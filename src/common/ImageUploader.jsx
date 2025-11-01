import React, { useState, useRef } from 'react';

import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';

import { Spin, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadService } from '../service/uploadService';
import cld from '../util/cloudinary';

const ImageUploader = ({ onImageUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePublicId, setImagePublicId] = useState('');
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.includes('image/')) {
      message.error('Vui lòng chọn file hình ảnh');
      return;
    }

    // Kiểm tra kích thước file (giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    try {
      setUploading(true);
      const result = await uploadService.uploadImage(file);
      
      setImageUrl(result.secure_url);
      setImagePublicId(result.public_id);
      
      // Gọi callback để truyền URL hình ảnh về component cha
      if (onImageUploaded) {
        onImageUploaded(result.secure_url, result.public_id);
      }
      
      message.success('Tải ảnh lên thành công!');
      console.log(imageUrl)
    } catch (error) {
      message.error('Lỗi khi tải ảnh lên: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Function to trigger file input click
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically trigger the file input
    }
  };

  return (
    <div className="image-uploader">
      <div className="upload-container" style={{ marginBottom: '16px' }}>
        <input
          type="file"
          id="file-upload"
          ref={fileInputRef} // Attach ref to input
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <Button
          icon={<UploadOutlined />}
          loading={uploading}
          onClick={handleButtonClick} // Handle click on button
          style={{
            backgroundColor: '#FF6B6B',
            borderColor: '#FF6B6B',
            color: 'white',
          }}
        >
          Chọn ảnh
        </Button>
      </div>

      {uploading && (
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <Spin tip="Đang tải ảnh lên..." />
        </div>
      )}

      {imagePublicId && (
        <div className="preview" style={{ marginTop: '16px' }}>
          <h4>Ảnh đã tải lên:</h4>
          <AdvancedImage
            cldImg={cld.image(imagePublicId).resize(fill().width(300).height(200))}
            style={{ maxWidth: '100%', borderRadius: '8px' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;