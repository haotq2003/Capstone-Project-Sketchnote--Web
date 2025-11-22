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

  getBlogsStatusDraft: async (pageNo, pageSize,Draft) => {
    try {
      const res = await BlogApiController.getBlogs(pageNo, pageSize, Draft);
      return res.data.result.content;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Get blogs failed.";
      throw new Error(message);
    }
  },
}