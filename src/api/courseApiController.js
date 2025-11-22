import { privateApi, publicApi } from "./axiosIntance";

export const courseApiController = {
  getAll: async () => {
    return await publicApi.get("/api/learning/courses");
  },

  getCourseById: async (id) => {
    return await publicApi.get(`/api/learning/courses/${id}`);
  },

  createCourse: async (courseData) => {
    return await privateApi.post(`/api/learning/courses`, courseData);
  },

  getLessonsByCourseId: async (id) => {
    return await privateApi.get(`/api/learning/lessons/${id}`);
  },

  createLesson: async (id, lessonData) => {
    return await privateApi.post(`/api/learning/lessons/${id}`, lessonData);
  },

  updateCourse: async (id, courseData) => {
    return await privateApi.put(`/api/learning/courses/${id}`, courseData);
  },

  deleteCourse: async (id) => {
    return await privateApi.delete(`/api/learning/courses/${id}`);
  },

  updateLesson: async (id, lessonData) => {
    return await privateApi.put(`/api/learning/lessons/${id}`, lessonData);
  },

  deleteLesson: async (id) => {
    return await privateApi.delete(`/api/learning/lessons/${id}`);
  },
};
