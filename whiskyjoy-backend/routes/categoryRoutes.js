const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

// 針對 /api/categories
router.route('/')
  .get(categoryController.getAllCategories) // 公開獲取清單
  .post(
    authenticateUser, 
    isAdmin, 
    categoryController.createCategory
  ); // 僅限管理員新增

// 針對 /api/categories/:id
router.route('/:id')
  .put(
    authenticateUser, 
    isAdmin, 
    categoryController.updateCategory
  ) // 僅限管理員更新
  .delete(
    authenticateUser, 
    isAdmin, 
    categoryController.deleteCategory
  ); // 僅限管理員刪除

module.exports = router;