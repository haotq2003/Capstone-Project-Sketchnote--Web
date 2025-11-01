import axios from 'axios';

// Sử dụng thông tin từ biến môi trường
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dturncvxv';
const CLOUDINARY_UPLOAD_PRESET = 'lovehaven_preset'; // Bạn cần tạo preset này trong Cloudinary Dashboard

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

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