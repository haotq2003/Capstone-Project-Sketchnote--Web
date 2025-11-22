import { courseApiController } from "../api/courseApiController";

export const courseService = {
  getAllCourse : async () =>{
   try {
    const res = await courseApiController.getAll();
    return res.data;
   } catch (error) {
    const message =
        error.response?.data?.message || error.message || "Get all courses failed.";
      throw new Error(message);
   }
  },
  getCourseById : async (id) =>{
    try {
      const res = await courseApiController.getCourseById(id);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Get course by id failed.";
      throw new Error(message);
    }
  },
  createCourse : async (courseData) =>{
    try {
      const res = await courseApiController.createCourse(courseData);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Create course failed.";
      throw new Error(message);
    }
  },
  getLessonsByCourseId : async (id) =>{
    try {
      const res = await courseApiController.getLessonsByCourseId(id);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Get lessons by course id failed.";
      throw new Error(message);
    }
  },
  createLesson : async (id,lessonData) =>{
    try {
      const res = await courseApiController.createLesson(id,lessonData);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Create lesson failed.";
      throw new Error(message);
    }
  },
  updateCourse : async (id, courseData) =>{
    try {
      const res = await courseApiController.updateCourse(id, courseData);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Update course failed.";
      throw new Error(message);
    }
  },
  deleteCourse : async (id) =>{
    try {
      const res = await courseApiController.deleteCourse(id);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Delete course failed.";
      throw new Error(message);
    }
  },
  updateLesson : async (id, lessonData) =>{
    try {
      const res = await courseApiController.updateLesson(id, lessonData);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Update lesson failed.";
      throw new Error(message);
    }
  },
  deleteLesson : async (id) =>{
    try {
      const res = await courseApiController.deleteLesson(id);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Delete lesson failed.";
      throw new Error(message);
    }
  }
}