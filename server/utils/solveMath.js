// const math = require('mathjs');
// const nerdamer = require('nerdamer');
// require('nerdamer/Solve');
// require('nerdamer/Calculus');
// require('nerdamer/Algebra');

// module.exports = async function solveMath(problem) {
//   try {
//     let steps = [];
//     problem = problem.replace(/\s/g, '') // remove whitespace
//                      .replace(/–/g, '-')  // fix common OCR dash
//                      .replace(/∑/g, 'sum');

//     // Handle integrals like ∫(6x^5-8x^2-5)dx
//     const integralMatch = problem.match(/^∫\((.+)\)(d[a-zA-Z])$/);
//     if (integralMatch) {
//       const expr = integralMatch[1];
//       const variable = integralMatch[2].slice(1);
//       const result = nerdamer(`integrate(${expr}, ${variable})`).toString();
//       steps.push(`Step 1: Identify integrand: ${expr}`);
//       steps.push(`Step 2: Integrate with respect to ${variable}`);
//       steps.push(`Result: ${result} + C`);
//       return steps.join('\n');
//     }

//     // Derivative: d/dx(...)
//     if (problem.startsWith('d/dx')) {
//       const expr = problem.slice(4);
//       const result = nerdamer(`diff(${expr}, x)`).toString();
//       steps.push(`Step 1: Differentiate ${expr} with respect to x`);
//       steps.push(`Result: ${result}`);
//       return steps.join('\n');
//     }

//     // Summation (mathjs only handles simple numeric ones)
//     if (problem.startsWith('sum')) {
//       try {
//         const result = math.evaluate(problem);
//         steps.push(`Summation result: ${result}`);
//         return steps.join('\n');
//       } catch {
//         return 'Use format: sum(expr, var, from, to)';
//       }
//     }

//     // Equation solving (e.g. 3x^2 - 10x + 8 = 0)
//     if (problem.includes('=')) {
//       const [lhs, rhs] = problem.split('=');
//       const equation = `${lhs}-(${rhs})`;
//       const simplified = nerdamer(equation).toString();
//       const solution = nerdamer(`solve(${lhs}=${rhs}, x)`).evaluate().toString();

//       steps.push(`Step 1: Original equation: ${lhs} = ${rhs}`);
//       steps.push(`Step 2: Move all terms to one side: ${equation} = 0`);
//       steps.push(`Step 3: Simplify: ${simplified} = 0`);
//       steps.push(`Step 4: Solve for x: ${solution}`);

//       return steps.join('\n');
//     }

//     // General expression simplification and evaluation
//     const simplified = math.simplify(problem).toString();
//     const evaluated = math.evaluate(problem);
//     steps.push(`Expression: ${problem}`);
//     steps.push(`Simplified: ${simplified}`);
//     steps.push(`Evaluated Result: ${evaluated}`);
//     return steps.join('\n');

//   } catch (err) {
//     console.error("Error solving math:", err);
//     return "❌ Could not solve the problem. Make sure it's a valid mathematical expression.";
//   }
// };

const math = require('mathjs');
const nerdamer = require('nerdamer');
require('nerdamer/Solve');
require('nerdamer/Calculus');
require('nerdamer/Algebra');

module.exports = async function solveMath(problem) {
  try {
    let steps = [];
    problem = problem.replace(/\s/g, '') // remove whitespace
                     .replace(/–/g, '-')  // fix OCR dash
                     .replace(/∑/g, 'sum');

    // ∫(expression)dx
    const integralMatch = problem.match(/^∫\((.+)\)(d[a-zA-Z])$/);
    if (integralMatch) {
      const expr = integralMatch[1];
      const variable = integralMatch[2].slice(1);
      const terms = math.parse(expr).args || [math.parse(expr)];

      steps.push(`Step 1: Identify the integrand: ${expr}`);
      for (let i = 0; i < terms.length; i++) {
        const term = terms[i].toString();
        const integral = nerdamer(`integrate(${term}, ${variable})`).toString();
        steps.push(`Step ${i + 2}: ∫${term} d${variable} = ${integral}`);
      }
      const final = nerdamer(`integrate(${expr}, ${variable})`).toString();
      steps.push(`Final Result: ${final} + C`);
      return steps.join('\n');
    }

    // Derivative
    if (problem.startsWith('d/dx')) {
      const expr = problem.slice(4);
      steps.push(`Step 1: Differentiate the expression ${expr} with respect to x`);
      const result = nerdamer(`diff(${expr}, x)`).toString();
      steps.push(`Result: ${result}`);
      return steps.join('\n');
    }

    // Summation
    if (problem.startsWith('sum')) {
      try {
        const result = math.evaluate(problem);
        steps.push(`Step 1: Evaluate the summation`);
        steps.push(`Result: ${result}`);
        return steps.join('\n');
      } catch {
        return '❌ Use format: sum(expr, var, from, to)';
      }
    }

    // Equation solving
    if (problem.includes('=')) {
      const [lhs, rhs] = problem.split('=');
      const combined = `${lhs}-(${rhs})`;
      const simplified = nerdamer(combined).toString();
      const stepsRaw = nerdamer(`${lhs}=${rhs}`).solveFor('x');

      steps.push(`Step 1: Original equation: ${lhs} = ${rhs}`);
      steps.push(`Step 2: Move all terms to one side: ${combined} = 0`);
      steps.push(`Step 3: Simplify: ${simplified} = 0`);

      if (Array.isArray(stepsRaw.symbols)) {
        steps.push(`Step 4: Solve for x:`);
        stepsRaw.symbols.forEach((sol, i) => {
          steps.push(`  Solution ${i + 1}: x = ${sol.toString()}`);
        });
      } else {
        steps.push(`Step 4: Solve for x: x = ${stepsRaw.toString()}`);
      }

      return steps.join('\n');
    }

    // General expression simplification
    const original = math.parse(problem).toString();
    const simplified = math.simplify(problem).toString();
    const evaluated = math.evaluate(problem);

    steps.push(`Step 1: Original expression: ${original}`);
    if (original !== simplified) {
      steps.push(`Step 2: Simplified form: ${simplified}`);
    }
    steps.push(`Step ${steps.length + 1}: Final Result: ${evaluated}`);
    return steps.join('\n');

  } catch (err) {
    console.error("❌ Error solving math:", err);
    return "❌ Could not solve the problem. Make sure it's a valid mathematical expression.";
  }
};
