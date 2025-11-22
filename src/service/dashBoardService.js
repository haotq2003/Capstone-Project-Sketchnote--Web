import { dashBoardApiController } from "../api/dashBoardApiController";

export const dashBoardService = {
    getSalesReport : async (start, end, groupBy) => {
        try {
            const response = await dashBoardApiController.getSalesReport(start, end, groupBy);
            return response.data.result;
        } catch (error) {
             const message =
        error.response?.data?.message || error.message || "Get sales report failed.";
      throw new Error(message);
    }
        },

        
    }

