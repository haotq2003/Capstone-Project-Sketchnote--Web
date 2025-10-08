import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Row, 
  Col, 
  List, 
  Avatar, 
  Modal, 
  Input, 
  Space, 
  Tag, 
  Divider,
  Empty,
  InputNumber,
  message,
  Image,
  Pagination,
  Spin,
  BackTop
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  VideoCameraOutlined, 
  ClockCircleOutlined,
  ArrowLeftOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import { courseService } from '../../service/courseService';
import formatDuration from '../../common/duration';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const CourseDetail = ({ course, onBack }) => {
  const [lessons, setLessons] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingLesson, setEditingLesson] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [lessonForms, setLessonForms] = useState([
    { title: '', description: '', content: '', videoUrl: '', duration: 0, orderIndex: 1 }
  ]);

  const [courseForm, setCourseForm] = useState({
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    category: course.category,
    price: course.price
  });

  useEffect(() => {
    featchLessonsByCourseId(course.courseId);
  }, [course.courseId]);

  const featchLessonsByCourseId = async (id) => {
    setLoading(true);
    try {
      const res = await courseService.getLessonsByCourseId(id);
      setLessons(res.data);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Lọc và tìm kiếm lessons
  const getFilteredLessons = () => {
    if (!lessons) return [];
    
    let filtered = lessons;
    
    // Lọc theo tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(lesson => 
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Tính toán dữ liệu cho pagination
  const getPaginatedLessons = () => {
    const filteredLessons = getFilteredLessons();
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredLessons.slice(startIndex, endIndex);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  // Lấy thumbnail từ YouTube URL
  const getYoutubeThumbnail = (url) => {
    if (!url) return null;
    
    // Extract video ID from various YouTube URL formats
    let videoId = null;
    
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    }
    // Format: https://youtu.be/VIDEO_ID
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    
    return null;
  };

  const showLessonModal = (mode = 'add', lesson = null) => {
    setModalMode(mode);
    setEditingLesson(lesson);
    
    if (mode === 'edit' && lesson) {
      // Chế độ sửa - load dữ liệu bài học
      setLessonForms([{
        title: lesson.title,
        description: lesson.description,
        content: lesson.content || '',
        videoUrl: lesson.videoUrl || '',
        duration: lesson.duration,
        orderIndex: lesson.orderIndex
      }]);
    } else {
      // Chế độ thêm mới - tính orderIndex tiếp theo
      const nextOrderIndex = lessons.length > 0 
        ? Math.max(...lessons.map(l => l.orderIndex)) + 1 
        : 1;
      
      setLessonForms([{
        title: '',
        description: '',
        content: '',
        videoUrl: '',
        duration: 0,
        orderIndex: nextOrderIndex
      }]);
    }
    
    setIsModalVisible(true);
  };

  const handleLessonCancel = () => {
    setIsModalVisible(false);
    setEditingLesson(null);
    setModalMode('add');
  };

  const handleLessonSubmit = async () => {
    if (lessonForms.some(l => !l.title || !l.description || l.duration <= 0)) {
      message.error('Vui lòng điền đầy đủ thông tin cho tất cả bài học!');
      return;
    }

    try {
      if (modalMode === 'edit' && editingLesson) {
        // Cập nhật bài học
        const updatedLesson = await courseService.updateLesson(
          editingLesson.lessonId, 
          lessonForms[0]
        );
        
        setLessons(lessons.map(l => 
          l.lessonId === editingLesson.lessonId ? updatedLesson : l
        ));
        message.success('Đã cập nhật bài học!');
      } else {
        // Thêm mới bài học
        const response = await courseService.createLesson(course.courseId, lessonForms);
        const newLessons = Array.isArray(response) ? response : (response.data || []);
        
        if (newLessons.length > 0) {
          setLessons([...lessons, ...newLessons]);
          message.success(`Đã thêm ${newLessons.length} bài học thành công!`);
        } else {
          await featchLessonsByCourseId(course.courseId);
          message.success('Đã thêm bài học thành công!');
        }
      }
      
      handleLessonCancel();
    } catch (error) {
      message.error(error.message || 'Lỗi khi lưu bài học');
    }
  };

  const addLessonForm = () => {
    const currentMaxOrder = Math.max(
      ...lessonForms.map(f => f.orderIndex),
      lessons.length > 0 ? Math.max(...lessons.map(l => l.orderIndex)) : 0
    );
    
    setLessonForms([
      ...lessonForms,
      {
        title: '',
        description: '',
        content: '',
        videoUrl: '',
        duration: 0,
        orderIndex: currentMaxOrder + 1
      }
    ]);
  };

  const removeLessonForm = (index) => {
    const updated = [...lessonForms];
    updated.splice(index, 1);
    setLessonForms(updated.map((f, i) => ({ 
      ...f, 
      orderIndex: f.orderIndex 
    })));
  };

  const handleDeleteLesson = (lessonId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bài học này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await courseService.deleteLesson(lessonId);
          setLessons(lessons.filter(l => l.lessonId !== lessonId));
          message.success('Đã xóa bài học!');
        } catch (error) {
          message.error('Lỗi khi xóa bài học!');
        }
      }
    });
  };

  const handleDeleteCourse = () => {
    Modal.confirm({
      title: 'Xác nhận xóa khóa học',
      content: 'Bạn có chắc chắn muốn xóa khóa học này? Tất cả bài học sẽ bị xóa!',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        message.success('Đã xóa khóa học!');
        onBack();
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={onBack}
              size="large"
            >
              Quay Lại
            </Button>
            <Title level={3} className="!m-0">{course.title}</Title>
          </Space> */}
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showLessonModal('add')}
            size="large"
          >
            Thêm Bài Học
          </Button>
        </div>

        {/* Course Detail */}
        <Row gutter={24}>
          {/* Left Column - Course Info */}
          <Col xs={24} lg={8}>
            <Card title="Thông Tin Khóa Học" className="sticky top-6">
              <div className="space-y-4">
                <div>
                  <Text type="secondary" className="block mb-1">Tiêu đề:</Text>
                  <Title level={5} className="!m-0">{course.title}</Title>
                </div>
                
                <div>
                  <Text type="secondary" className="block mb-1">Phụ đề:</Text>
                  <Text strong>{course.subtitle}</Text>
                </div>
                
                <div>
                  <Text type="secondary" className="block mb-1">Mô tả:</Text>
                  <Paragraph className="!mb-0">{course.description}</Paragraph>
                </div>
                
                <Divider className="!my-3" />
                
                <div className="flex justify-between items-center">
                  <Text type="secondary">Danh mục:</Text>
                  {getCategoryTag(course.category)}
                </div>
                
                <div className="flex justify-between items-center">
                  <Text type="secondary">Giá:</Text>
                  <Text strong className="text-lg text-orange-500">
                    {course.price.toLocaleString()} VNĐ
                  </Text>
                </div>
                
                <div className="flex justify-between items-center">
                  <Text type="secondary">Số học viên:</Text>
                  <Text strong>{course.student_count}</Text>
                </div>
                
                <div className="flex justify-between items-center">
                  <Text type="secondary">Số bài học:</Text>
                  <Tag color="blue">{lessons.length} bài</Tag>
                </div>
                
                <Divider className="!my-3" />
                
                <div>
                  <Text type="secondary" className="block mb-1">Ngày tạo:</Text>
                  <Text>{formatDate(course.createdAt)}</Text>
                </div>
                
                <div>
                  <Text type="secondary" className="block mb-1">Cập nhật:</Text>
                  <Text>{formatDate(course.updatedAt)}</Text>
                </div>
                
                <Divider className="!my-3" />
                
                <Space direction="vertical" className="w-full">
                  <Button 
                    icon={<EditOutlined />} 
                    block 
                    onClick={() => setIsCourseModalVisible(true)}
                  >
                    Chỉnh Sửa Khóa Học
                  </Button>
                  <Button 
                    icon={<DeleteOutlined />} 
                    danger 
                    block
                    onClick={handleDeleteCourse}
                  >
                    Xóa Khóa Học
                  </Button>
                </Space>
              </div>
            </Card>
          </Col>

          {/* Right Column - Lessons List */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <div className="flex items-center justify-between">
                  <span>Danh Sách Bài Học</span>
                  <Tag color="blue">{getFilteredLessons().length} bài học</Tag>
                </div>
              }
              extra={
                <Input.Search
                  placeholder="Tìm kiếm bài học..."
                  style={{ width: 300 }}
                  onSearch={handleSearch}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                />
              }
            >
              {getFilteredLessons().length > 0 ? (
                <Spin spinning={loading}>
                  <List
                    itemLayout="horizontal"
                    dataSource={getPaginatedLessons().sort((a, b) => a.orderIndex - b.orderIndex)}
                    renderItem={lesson => {
                    const thumbnail = getYoutubeThumbnail(lesson.videoUrl);
                    
                    return (
                      <List.Item 
                        className="hover:bg-gray-50 px-4 rounded transition-colors"
                        actions={[
                          <Button 
                            icon={<EditOutlined />} 
                            size="small" 
                            onClick={() => showLessonModal('edit', lesson)}
                          >
                            Sửa
                          </Button>,
                          <Button 
                            icon={<DeleteOutlined />} 
                            danger 
                            size="small"
                            onClick={() => handleDeleteLesson(lesson.lessonId)}
                          >
                            Xóa
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            thumbnail ? (
                              <div className="relative w-28 h-16 rounded overflow-hidden">
                                <Image
                                  src={thumbnail}
                                  alt={lesson.title}
                                  className="w-full h-full object-cover"
                                  preview={false}
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                  <PlayCircleOutlined className="text-white text-2xl" />
                                </div>
                              </div>
                            ) : (
                              <Avatar 
                                icon={<VideoCameraOutlined />} 
                                className="bg-blue-500"
                                size={56}
                              />
                            )
                          }
                          title={
                            <Space>
                              <Tag color="blue">Bài {lesson.orderIndex}</Tag>
                              <Text strong className="text-base">{lesson.title}</Text>
                            </Space>
                          }
                          description={
                            <div className="space-y-2 mt-2">
                              <Paragraph ellipsis={{ rows: 2 }} className="!mb-0 text-gray-600">
                                {lesson.description}
                              </Paragraph>
                              <Space size="large" className="text-xs">
                                <Text type="secondary">
                                  <ClockCircleOutlined /> {formatDuration(lesson.duration)}
                                </Text>
                              </Space>
                            </div>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
                </Spin>
              ) : (
                <Empty
                  description={searchTerm ? "Không tìm thấy bài học nào" : "Chưa có bài học nào"} 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  className="py-12"
                >
                  {!searchTerm && (
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={() => showLessonModal('add')}
                      size="large"
                    >
                      Thêm Bài Học Đầu Tiên
                    </Button>
                  )}
                </Empty>
              )}

              {/* Pagination for Lessons */}
              {getFilteredLessons().length > pageSize && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={getFilteredLessons().length}
                    onChange={handlePageChange}
                    onShowSizeChange={handlePageChange}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) => 
                      `${range[0]}-${range[1]} của ${total} bài học`
                    }
                    pageSizeOptions={['5', '10', '15', '20']}
                  />
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>

      {/* Lesson Modal */}
      <Modal
        title={modalMode === 'edit' ? 'Chỉnh Sửa Bài Học' : 'Thêm Nhiều Bài Học'}
        open={isModalVisible}
        onCancel={handleLessonCancel}
        onOk={handleLessonSubmit}
        okText={modalMode === 'edit' ? 'Cập Nhật' : 'Lưu Bài Học'}
        cancelText="Hủy"
        width={900}
        styles={{
          body: {
            maxHeight: '70vh',
            overflowY: 'auto',
            padding: '24px'
          }
        }}
      >
        <div className="space-y-6">
          {lessonForms.map((form, index) => (
            <Card
              key={index}
              title={
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Bài {form.orderIndex}</span>
                  {modalMode === 'add' && lessonForms.length > 1 && (
                    <Button 
                      danger 
                      size="small" 
                      icon={<DeleteOutlined />}
                      onClick={() => removeLessonForm(index)}
                    >
                      Xóa
                    </Button>
                  )}
                </div>
              }
              className="shadow-sm"
            >
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Tiêu đề bài học <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Nhập tiêu đề bài học"
                    size="large"
                    value={form.title}
                    onChange={(e) => {
                      const updated = [...lessonForms];
                      updated[index].title = e.target.value;
                      setLessonForms(updated);
                    }}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Mô tả bài học <span className="text-red-500">*</span>
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Nhập mô tả chi tiết bài học"
                    value={form.description}
                    onChange={(e) => {
                      const updated = [...lessonForms];
                      updated[index].description = e.target.value;
                      setLessonForms(updated);
                    }}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Nội dung bài học
                  </label>
                  <TextArea
                    rows={4}
                    placeholder="Nhập nội dung chi tiết của bài học (optional)"
                    value={form.content}
                    onChange={(e) => {
                      const updated = [...lessonForms];
                      updated[index].content = e.target.value;
                      setLessonForms(updated);
                    }}
                  />
                </div>

                <Row gutter={16}>
                  <Col span={12}>
                    <label className="block mb-2 font-medium text-gray-700">
                      Thời lượng (giây) <span className="text-red-500">*</span>
                    </label>
                    <InputNumber
                      className="w-full"
                      placeholder="Ví dụ: 3600"
                      size="large"
                      min={0}
                      value={form.duration}
                      onChange={(value) => {
                        const updated = [...lessonForms];
                        updated[index].duration = value;
                        setLessonForms(updated);
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <label className="block mb-2 font-medium text-gray-700">
                      Thứ tự hiển thị
                    </label>
                    <InputNumber
                      className="w-full"
                      size="large"
                      min={1}
                      value={form.orderIndex}
                      onChange={(value) => {
                        const updated = [...lessonForms];
                        updated[index].orderIndex = value;
                        setLessonForms(updated);
                      }}
                    />
                  </Col>
                </Row>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    URL Video YouTube
                  </label>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    size="large"
                    value={form.videoUrl}
                    onChange={(e) => {
                      const updated = [...lessonForms];
                      updated[index].videoUrl = e.target.value;
                      setLessonForms(updated);
                    }}
                  />
                  {form.videoUrl && getYoutubeThumbnail(form.videoUrl) && (
                    <div className="mt-3">
                      <Text type="secondary" className="block mb-2">Preview:</Text>
                      <Image
                        src={getYoutubeThumbnail(form.videoUrl)}
                        alt="Video preview"
                        className="rounded"
                        style={{ maxWidth: '300px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {modalMode === 'add' && (
            <Button 
              type="dashed" 
              block 
              size="large"
              icon={<PlusOutlined />} 
              onClick={addLessonForm}
            >
              Thêm Bài Học Khác
            </Button>
          )}
        </div>
      </Modal>

      {/* Course Modal */}
      <Modal
        title="Chỉnh Sửa Khóa Học"
        open={isCourseModalVisible}
        onCancel={() => setIsCourseModalVisible(false)}
        onOk={() => {
          if (!courseForm.title || !courseForm.subtitle || !courseForm.description || !courseForm.category || courseForm.price <= 0) {
            message.error('Vui lòng điền đầy đủ thông tin khóa học!');
            return;
          }
          message.success('Đã cập nhật thông tin khóa học!');
          setIsCourseModalVisible(false);
        }}
        okText="Lưu Thay Đổi"
        cancelText="Hủy"
        width={700}
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block mb-2 font-medium">Tiêu đề khóa học *</label>
            <Input 
              placeholder="Nhập tiêu đề khóa học" 
              size="large"
              value={courseForm.title}
              onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Phụ đề *</label>
            <Input 
              placeholder="Nhập phụ đề khóa học"
              value={courseForm.subtitle}
              onChange={(e) => setCourseForm({...courseForm, subtitle: e.target.value})}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Mô tả *</label>
            <TextArea 
              rows={4} 
              placeholder="Nhập mô tả chi tiết khóa học"
              value={courseForm.description}
              onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
            />
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <label className="block mb-2 font-medium">Danh mục *</label>
              <Input 
                placeholder="Nhập danh mục (Art, Design...)" 
                value={courseForm.category}
                onChange={(e) => setCourseForm({...courseForm, category: e.target.value})}
              />
            </Col>
            <Col span={12}>
              <label className="block mb-2 font-medium">Giá (VNĐ) *</label>
              <InputNumber 
                className="w-full"
                placeholder="Nhập giá" 
                min={0}
                value={courseForm.price}
                onChange={(value) => setCourseForm({...courseForm, price: value})}
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

export default CourseDetail;