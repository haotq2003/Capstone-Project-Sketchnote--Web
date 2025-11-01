import { Cloudinary } from '@cloudinary/url-gen';

// Tạo instance Cloudinary với cloud name của bạn
const cld = new Cloudinary({
  cloud: {
    cloudName: 'dturncvxv'
  }
});

export default cld;