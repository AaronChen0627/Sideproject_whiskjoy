const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// 完整路徑：POST /api/auth/register
router.post('/register', AuthController.register);

// 完整路徑：POST /api/auth/login
router.post('/login', AuthController.login);

// 完整路徑：POST /api/auth/upload
router.post(
  '/upload', 
  authMiddleware.authenticateUser, 
  upload.single('file'), 
  AuthController.handleUpload
);

// 完整路徑：PUT /api/auth/profile
router.put(
  '/profile',
  authMiddleware.authenticateUser,
  AuthController.updateProfile
);

module.exports = router;