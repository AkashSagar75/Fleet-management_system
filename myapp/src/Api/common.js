import API from "./axios";

export const getData = async ({ tableName, companyId, page, limit, search, searchColumns }) => {
	try {
		const res = await API.get(`/common/getData`, {
			params: { tableName, companyId, page, limit, search, searchColumns
			}
		});
		return res.data;
	} catch (error) {
		console.error("Error fetching data:", error);
		throw error;
	}
};