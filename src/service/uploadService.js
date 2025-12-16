import axios from 'axios';

// Sử dụng thông tin từ biến môi trường
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dturncvxv';
const CLOUDINARY_UPLOAD_PRESET = 'lovehaven_preset'; // Bạn cần tạo preset này trong Cloudinary Dashboard

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_VIDEO_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;

export const uploadService = {
  /**
   * Upload hình ảnh lên Cloudinary
   * @param {File} file - File hình ảnh cần upload
   * @returns {Promise<Object>} - Thông tin hình ảnh đã upload
   */
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
      return response.data;
    } catch (error) {
        console.error('Lỗi khi upload ảnh:', {
            message: error.message,
            code: error.code,
            response: error.response ? error.response.data : null,
            status: error.response ? error.response.status : null,
          });
      throw error;
    }
  },

  /**
   * Upload video lên Cloudinary
   * @param {File} file - File video cần upload
   * @param {Function} onProgress - Callback để theo dõi tiến trình upload
   * @returns {Promise<Object>} - Thông tin video đã upload (bao gồm URL và duration)
   */
  uploadVideo: async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('resource_type', 'video');
      
      const response = await axios.post(CLOUDINARY_VIDEO_UPLOAD_URL, formData, {
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        }
      });
      
      return {
        url: response.data.secure_url,
        duration: response.data.duration, // Duration in seconds
        publicId: response.data.public_id,
        format: response.data.format,
        resourceType: response.data.resource_type
      };
    } catch (error) {
      console.error('Lỗi khi upload video:', {
        message: error.message,
        code: error.code,
        response: error.response ? error.response.data : null,
        status: error.response ? error.response.status : null,
      });
      throw error;
    }
  },
  
  /**
   * Xóa hình ảnh từ Cloudinary (cần thực hiện qua server)
   * @param {string} publicId - Public ID của hình ảnh
   */
  deleteImage: async (publicId) => {
    try {
      // Lưu ý: Việc xóa hình ảnh nên được thực hiện qua server để bảo mật API Secret
      // Đây là ví dụ gọi API xóa ảnh từ server của bạn
      const response = await axios.delete(`/api/images/${publicId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa ảnh:', error);
      throw error;
    }
  }
};