import { privateApi } from "./axiosIntance";

export const BlogApiController = {
  acceptBlog: async (blogId, status) => {
    return await privateApi.put(`/api/blogs/${blogId}/publish`,{status});
  },
  getBlogs: async (pageNo, pageSize, status) => {
    return await privateApi.get(`/api/blogs?page=${pageNo}&size=${pageSize}&status=${status}`);
  },
  checkBlog: async (blogId) => {
    return await privateApi.get(`/api/blogs/${blogId}/moderation/latest`);
  },
}