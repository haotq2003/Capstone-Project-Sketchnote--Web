import { BlogApiController } from "../api/blogApiController";

export const BlogService = {
 acceptBlog: async (blogId,status) => {
  try {
    const res = await BlogApiController.acceptBlog(blogId, status);
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Accept blog failed.";
    throw new Error(message);
  }
},

  getBlogsStatus: async (pageNo, pageSize,status) => {
    try {
      const res = await BlogApiController.getBlogs(pageNo, pageSize, status);
      return res.data.result.content;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Get blogs failed.";
      throw new Error(message);
    }
  },
  checkBlog: async (blogId) => {
    try {
      const res = await BlogApiController.checkBlog(blogId);
      return res.data.result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Check blog failed.";
      throw new Error(message);
    }
  },
}