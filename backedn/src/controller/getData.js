const GetDataService = require("../services/getData.service");


class GetDataController {
  constructor(GetDataService) {
    this.getDataService = GetDataService;
    this.getData = this.getData.bind(this);
  }
  
  async getData(req, res) {
    const { tableName, companyId, page, limit, search, searchColumns } = req.validatedGetData;
    try {
      const result = await this.getDataService.getData({
        data: { tableName, companyId, page, limit, search, searchColumns },
      });
      res.status(200).json(result);
    }
    catch (error) { 
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
}
}
module.exports = GetDataController;