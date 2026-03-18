const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

/**
 * 路由路徑: /api/brands
 */

// 1. 處理根路徑 /
router.route('/')
  .get(brandController.getAllBrands) // 所有人都可以看品牌清單
  .post(
    authenticateUser, 
    isAdmin, 
    brandController.createBrand
  ); // 只有管理員可以新增

// 2. 處理特定 ID /:id
router.route('/:id')
  .get(brandController.getBrandById) // 獲取單一品牌細節
  .put(
    authenticateUser, 
    isAdmin, 
    brandController.updateBrand
  ) // 只有管理員可以更新
  .delete(
    authenticateUser, 
    isAdmin, 
    brandController.deleteBrand
  ); // 只有管理員可以刪除

module.exports = router;