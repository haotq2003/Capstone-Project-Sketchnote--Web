import { privateApi } from "./axiosIntance";

export const dashBoardApiController = {
  getSalesReport: async (start, end, groupBy) => {
  return await privateApi.get(
    `/api/orders/designer/dashboard/sales`,
    {
      // baseURL: "http://34.126.98.83:8083",
      params: {
        start,
        end,
        groupBy,
      },
    }
  );
},

};
