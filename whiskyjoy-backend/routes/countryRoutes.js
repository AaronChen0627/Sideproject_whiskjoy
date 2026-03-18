const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

/**
 * 國家部分 (Countries)
 */
router.route('/')
  .get(countryController.getAllCountries) // 獲取所有國家
  .post(
    authenticateUser, 
    isAdmin, 
    countryController.createCountry
  ); // 僅限管理員新增

router.delete(
  '/:id', 
  authenticateUser, 
  isAdmin, 
  countryController.deleteCountry
); // 僅限管理員刪除國家 (含連動刪除區域)

/**
 * 區域部分 (Regions) - 隸屬於國家
 */

// 獲取特定國家的所有區域 (例如: /api/countries/uuid-123/regions)
router.get('/:countryId/regions', countryController.getRegionsByCountry);

// 新增區域 (建議路徑保持語義化)
router.post(
  '/regions', 
  authenticateUser, 
  isAdmin, 
  countryController.createRegion
);

module.exports = router;