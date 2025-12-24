import React, { useState, useRef, useEffect } from 'react';
import { Spin, Button, message, Radio } from 'antd';
import { UploadOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { uploadService } from '../service/uploadService';
import cld from '../util/cloudinary';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';

const ImageUploader = ({ onImageUploaded, multiple = false, resetTrigger }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setUploadedImages([]);
    setThumbnailIndex(0);
  }, [resetTrigger]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles = files.filter(
      (f) => f.type.includes('image/') && f.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      message.warning('Some files are invalid (only accept images under 5MB)');
    }

    try {
      setUploading(true);
      const results = [];

      for (const file of validFiles) {
        const result = await uploadService.uploadImage(file);
        results.push(result);
      }

      setUploadedImages((prev) => [...prev, ...results]);
      message.success(`Upload ${results.length} success!`);
    } catch (err) {
      message.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Cập nhật callback khi có thay đổi
  useEffect(() => {
    if (uploadedImages.length > 0 && onImageUploaded) {
      const imagesData = uploadedImages.map((img, idx) => ({
        imageUrl: img.secure_url,
        isThumbnail: idx === thumbnailIndex,
      }));
      onImageUploaded(imagesData);
    }
  }, [uploadedImages, thumbnailIndex]);

  const handleSetThumbnail = (index) => {
    setThumbnailIndex(index);
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    if (thumbnailIndex === index) {
      setThumbnailIndex(0);
    } else if (thumbnailIndex > index) {
      setThumbnailIndex(thumbnailIndex - 1);
    }
  };

  const handleButtonClick = () => fileInputRef.current?.click();

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        multiple={multiple}
        style={{ display: 'none' }}
      />
      <Button
        icon={<UploadOutlined />}
        loading={uploading}
        onClick={handleButtonClick}
        style={{
          backgroundColor: '#FF6B6B',
          borderColor: '#FF6B6B',
          color: 'white',
        }}
      >
        Upload {multiple && '(multiple)'}
      </Button>

      {uploading && (
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <Spin tip="Uploading..." />
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2">
            Click star to select thumbnail
          </p>
          <div className="flex flex-wrap gap-3">
            {uploadedImages.map((img, i) => (
              <div
                key={`${img.public_id}-${i}`}
                className="relative group"
                style={{ width: 120, height: 120 }}
              >
                <AdvancedImage
                  cldImg={cld.image(img.public_id).resize(fill().width(150).height(150))}
                  style={{
                    borderRadius: '8px',
                    border: thumbnailIndex === i ? '3px solid #FF6B6B' : '1px solid #ddd',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Nút chọn thumbnail */}
                <button
                  onClick={() => handleSetThumbnail(i)}
                  className="absolute top-1 left-1 bg-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  {thumbnailIndex === i ? (
                    <StarFilled style={{ color: '#FF6B6B', fontSize: 18 }} />
                  ) : (
                    <StarOutlined style={{ color: '#999', fontSize: 18 }} />
                  )}
                </button>

                {/* Nút xóa */}
                <button
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ border: 'none', cursor: 'pointer', fontSize: 14 }}
                >
                  ×
                </button>

                {/* Label thumbnail */}
                {thumbnailIndex === i && (
                  <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs text-center py-1 rounded-b-lg">
                    Thumbnail
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;