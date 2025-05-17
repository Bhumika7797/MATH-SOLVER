// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const controller = require('../controllers/problemController');

// // Configure multer for file uploads
// const upload = multer({
//   dest: 'uploads/', // Ensure this directory exists
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter(req, file, cb) {
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
//       return cb(new Error('Only .png, .jpg, and .jpeg files are allowed'));
//     }
//     cb(null, true);
//   },
// });

// // Route for problem submission
// router.post(
//   '/',
//   (req, res, next) => {
//     upload.single('file')(req, res, (err) => {
//       if (err instanceof multer.MulterError) {
//         return res.status(400).json({ error: err.message });
//       } else if (err) {
//         return res.status(400).json({ error: err.message });
//       }
//       console.log('Multer Body:', req.body);
//       console.log('Multer File:', req.file);
//       next();
//     });
//   },
//   controller.handleProblem
// );

// module.exports = router;


const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const controller = require('../controllers/problemController');

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      return cb(new Error('Only .jpg, .jpeg, .png allowed'));
    }
    cb(null, true);
  },
});

router.post(
  '/',
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  controller.handleProblem
);

module.exports = router;
