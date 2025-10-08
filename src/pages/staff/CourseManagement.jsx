import React, { useEffect, useState } from 'react';
import CourseDetail from './CourseDetail';
import { 
  Typography, 
  Card, 
  Button, 
  Row, 
  Col, 
  Modal, 
  Input, 
  Select, 
  Space, 
  Tag, 
  InputNumber,
  message,
  Pagination,
  Spin,
  BackTop,Empty  
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined
} from '@ant-design/icons';
import { courseService } from '../../service/courseService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;



const CourseList = ({ onViewCourse }) => {
 
  const [courses, setCourses] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingCourse, setEditingCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    price: 0
  });
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await courseService.getAllCourse();
      setCourses(res.data);
      console.log(res)  
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const showModal = (mode, course = null) => {
    setModalMode(mode);
    setEditingCourse(course);
    if (course) {
      setFormData({
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        category: course.category,
        price: course.price
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        category: '',
        price: 0
      });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCourse(null);
  };

 const handleSubmit = async () => {
  if (!formData.title || !formData.subtitle || !formData.description || !formData.category || formData.price <= 0) {
    message.error('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  try {
    if (modalMode === 'add') {
      const newCourse = await courseService.createCourse(formData);
      setCourses([...courses, newCourse]);
      message.success('Đã thêm khóa học thành công!');
    } else {

      setCourses(courses.map(c => 
        c.courseId === editingCourse.courseId 
          ? { ...c, ...formData, updatedAt: new Date().toISOString() }
          : c
      ));
      message.success('Đã cập nhật khóa học thành công!');
    }

    handleCancel();
  } catch (error) {
    message.error(error.message);
  }
};

  const handleDelete = (courseId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa khóa học này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        setCourses(courses.filter(c => c.courseId !== courseId));
        message.success('Đã xóa khóa học!');
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getCategoryTag = (category) => {
    const colors = { 
      'Art': 'green', 
      'Design': 'blue', 
      'Digital Art': 'purple',
      'Photography': 'orange'
    };
    return <Tag color={colors[category] || 'default'}>{category}</Tag>;
  };

  // Lọc và tìm kiếm courses
  const getFilteredCourses = () => {
    if (!courses) return [];
    
    let filtered = courses;
    
    // Lọc theo tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Lọc theo danh mục
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }
    
    return filtered;
  };

  // Tính toán dữ liệu cho pagination
  const getPaginatedCourses = () => {
    const filteredCourses = getFilteredCourses();
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCourses.slice(startIndex, endIndex);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1); // Reset về trang đầu khi lọc
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen overflow-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <Title level={3} className="!m-0">Quản Lý Khóa Học</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal('add')}
            size="large"
          >
            Thêm Khóa Học Mới
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Input.Search
                placeholder="Tìm kiếm khóa học..."
                size="large"
                onSearch={handleSearch}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Lọc theo danh mục"
                size="large"
                style={{ width: '100%' }}
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <Select.Option value="all">Tất cả danh mục</Select.Option>
                <Select.Option value="Art">Art</Select.Option>
                <Select.Option value="Design">Design</Select.Option>
                <Select.Option value="Digital Art">Digital Art</Select.Option>
                <Select.Option value="Photography">Photography</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="text-right">
                <Text type="secondary">
                  Hiển thị {getPaginatedCourses().length} / {getFilteredCourses().length} khóa học
                </Text>
              </div>
            </Col>
          </Row>
        </div>

        <Spin  spinning={loading}>
        
          <Row gutter={[24, 24]}>
            {getPaginatedCourses()?.map(course => (
            <Col xs={24} sm={12} lg={8} xl={6} key={course.courseId}>
              <Card
                hoverable
                className="h-full"
                actions={[
                  <Button 
                    type="text" 
                    icon={<EyeOutlined />} 
                    onClick={() => onViewCourse(course)}
                  >
                    Xem
                  </Button>,
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    onClick={() => showModal('edit', course)}
                  >
                    Sửa
                  </Button>,
                  <Button 
                    type="text" 
                    icon={<DeleteOutlined />} 
                    danger
                    onClick={() => handleDelete(course.courseId)}
                  >
                    Xóa
                  </Button>
                ]}
              >
                <div className="mb-3">
                  {getCategoryTag(course.category)}
                  <Tag color="orange" className="ml-2">
                    {course?.price?.toLocaleString() || '0'} VNĐ
                  </Tag>
                </div>
                <Title level={5} className="!mb-2">{course.title}</Title>
                <Text type="secondary" className="block mb-3">{course.subtitle}</Text>
                <Paragraph ellipsis={{ rows: 2 }} className="text-gray-600">
                  {course?.description || ''}
                </Paragraph>
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <Text type="secondary">Học viên:</Text>
                      <Text strong>{course?.student_count || 0}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text type="secondary">Bài học:</Text>
                      <Text strong>{course?.lessons?.length || 0}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text type="secondary">Cập nhật:</Text>
                      <Text>{formatDate(course?.updatedAt || new Date())}</Text>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            ))}
          </Row>
        </Spin>

        {/* Pagination */}
        {getFilteredCourses().length > 0 && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={getFilteredCourses().length}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} của ${total} khóa học`
              }
              pageSizeOptions={['4', '8', '12', '16']}
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && getFilteredCourses().length === 0 && (
          <div className="text-center py-12">
            <Empty 
              description="Không tìm thấy khóa học nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
      </div>

      <BackTop />

      <Modal
        title={modalMode === 'add' ? 'Thêm Khóa Học Mới' : 'Chỉnh Sửa Khóa Học'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        okText={modalMode === 'add' ? 'Tạo Khóa Học' : 'Lưu Thay Đổi'}
        cancelText="Hủy"
        width={600}
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block mb-2 font-medium">Tiêu đề khóa học *</label>
            <Input 
              placeholder="Nhập tiêu đề khóa học" 
              size="large"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Phụ đề *</label>
            <Input 
              placeholder="Nhập phụ đề" 
              value={formData.subtitle}
              onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Mô tả *</label>
            <TextArea 
              rows={4} 
              placeholder="Nhập mô tả khóa học"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          
          <Row gutter={16}>
           <Col span={12}>
  <label className="block mb-2 font-medium">Danh mục *</label>
  <Select
    mode="tags"
    placeholder="Chọn hoặc nhập danh mục"
    className="w-full"
    value={formData.category ? [formData.category] : []}
    onChange={(value) =>
      setFormData({ ...formData, category: value[value.length - 1] })
    }
  >
    <Select.Option value="Art">Art</Select.Option>
    <Select.Option value="Design">Design</Select.Option>
    <Select.Option value="Digital Art">Digital Art</Select.Option>
    <Select.Option value="Photography">Photography</Select.Option>
  </Select>
</Col>

            <Col span={12}>
              <label className="block mb-2 font-medium">Giá (VNĐ) *</label>
              <InputNumber 
                className="w-full"
                placeholder="Nhập giá" 
                min={0}
                value={formData.price}
                onChange={(value) => setFormData({...formData, price: value})}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

const CourseManagement = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  if (selectedCourse) {
    return (
      <CourseDetail 
        course={selectedCourse} 
        onBack={() => setSelectedCourse(null)} 
      />
    );
  }

  return <CourseList onViewCourse={setSelectedCourse} />;
};

export default CourseManagement;