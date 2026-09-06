const GetDataRepository = require("../repositories/getData.repository");

class GetDataService {
  constructor(GetDataRepository) {
    this.getDataRepository =  GetDataRepository;
  }

  async getData({data}){
    const { tableName, companyId, page, limit, search, searchColumns } = data;
    try {
      const result = await this.getDataRepository.getData({
        tableName,
        companyId,
        page,
        limit,
        search,
        searchColumns
      });
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
}
module.exports = GetDataService;