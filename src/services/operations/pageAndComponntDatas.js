import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { catalogData } from "../apis"

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...");
  console.log("category id in getCatalogPageData in operations" , categoryId);
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      catalogData.CATALOGPAGEDATA_API, // The base URL without query parameters
      null, // No body data for GET request
      null, // No custom headers
      { categoryId } // Pass categoryId as a query parameter
    );
    console.log("This is the category ID in the frontend:", categoryId);
    if (!response?.data?.success) {
      throw new Error("Could not fetch category page data.");
    }
    result = response?.data;
  } catch (error) {
    console.log("CATALOGPAGEDATA_API API ERROR:", error);
    toast.error(error.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};



