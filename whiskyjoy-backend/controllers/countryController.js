const countryModel = require('../models/countryModel');

// --- 國家 (Countries) ---

exports.createCountry = async (req, res) => {
  // 1. 【修改點】：多解構出 regions 陣列
  const { country_name_zh, country_name_en, regions } = req.body; 
  
  try {
    const exists = await countryModel.checkCountryExists(country_name_zh, country_name_en);
    if (exists) return res.status(409).json({ success: false, message: '國家已存在' });

    // 2. 建立國家
    const result = await countryModel.createCountry(country_name_zh, country_name_en);
    
    // 取得剛剛新增的國家 ID (通常 MySQL 是放在 insertId，如果你的套件是用 id 就寫 result.id)
    const newCountryId = result.insertId || result.id; 

    // 3. 【新增這段】：如果前端有傳產區陣列過來，就把它們寫進區域 (Regions) 資料表
    if (regions && Array.isArray(regions) && regions.length > 0) {
      await Promise.all(
        regions.map(region => 
          // 把每個產區跟剛建立好的 newCountryId 綁定在一起存入 DB
          countryModel.createRegion(newCountryId, region.region_name_zh, region.region_name_en)
        )
      );
    }

    res.status(201).json({ success: true, data: { id: newCountryId, ...req.body } });
  } catch (error) {
    console.error("創建國家與產區失敗:", error);
    res.status(500).json({ success: false, message: '創建國家失敗' });
  }
};

exports.getAllCountries = async (req, res) => {
  try {
    // 1. 先撈出所有國家的基本資料
    const countries = await countryModel.getAllCountries();

    // 2. 利用 Promise.all 幫每個國家去撈出屬於它的區域 (Regions)
    const countriesWithRegions = await Promise.all(
      countries.map(async (country) => {
        // 呼叫你原本就寫好的 Model 方法
        const regions = await countryModel.getRegionsByCountry(country.id);
        
        return {
          ...country,
          regions: regions || [] // 把區域塞進去，如果是日本沒區域，就會是 []
        };
      })
    );

    // 3. 把組裝好、帶有 regions 的完整資料回傳給前端
    res.status(200).json({ success: true, data: countriesWithRegions });
  } catch (error) {
    console.error('獲取國家清單失敗:', error);
    res.status(500).json({ success: false, message: '獲取國家清單失敗' });
  }
};

// 刪除國家 (會連動刪除區域，因為 SQL 設定了 ON DELETE CASCADE)
exports.deleteCountry = async (req, res) => {
  try {
    await countryModel.deleteCountry(req.params.id);
    res.status(200).json({ success: true, message: '國家及其所屬區域已刪除' });
  } catch (error) {
    res.status(500).json({ success: false, message: '刪除國家失敗' });
  }
};

// --- 區域 (Regions) ---

exports.createRegion = async (req, res) => {
  const { country_id, region_name_zh, region_name_en } = req.body;
  try {
    if (!country_id) return res.status(400).json({ success: false, message: '必須指定國家 ID' });

    const result = await countryModel.createRegion(country_id, region_name_zh, region_name_en);
    res.status(201).json({ success: true, data: { id: result.id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: '創建區域失敗' });
  }
};

exports.getRegionsByCountry = async (req, res) => {
  try {
    const regions = await countryModel.getRegionsByCountry(req.params.countryId);
    res.status(200).json({ success: true, data: regions });
  } catch (error) {
    res.status(500).json({ success: false, message: '獲取區域失敗' });
  }
};