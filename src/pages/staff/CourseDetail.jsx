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
  const [isViewLessonModalVisible, setIsViewLessonModalVisible] = useState(false);
  const [viewingLesson, setViewingLesson] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [editingLesson, setEditingLesson] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [lessonForms, setLessonForms] = useState([
    { title: '', description: '', content: '', videoUrl: '', duration: 0, orderIndex: 1 }
  ]);
  const [fetchingDuration, setFetchingDuration] = useState({});

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
      setLessons(res.result || []);
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
  const extractVideoId = (url) => {
    if (!url) return null;

    const cleanUrl = url.trim();

    // Regex cải tiến hỗ trợ tất cả format YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/, // youtube.com/watch?v=
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/, // youtu.be/ (có thể có ?si= sau)
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/, // youtube.com/embed/
      /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/, // youtube.com/v/
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/ // youtube.com/shorts/
    ];

    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  // Fetch YouTube video duration using YouTube Data API v3
  const fetchYouTubeDuration = async (videoId) => {
    try {
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

      if (!apiKey || apiKey.includes('xZ9x')) {
        message.warning('YouTube API key not configured.');
        return null;
      }

      const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails,snippet&key=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        message.error('Video not found. Please check the URL.');
        return null;
      }

      const video = data.items[0];
      const duration = video.contentDetails.duration;
      const title = video.snippet.title;

      const durationInSeconds = parseDuration(duration);

      message.success(`Video found: "${title}" (${formatDurationDisplay(durationInSeconds)})`);
      return durationInSeconds;
    } catch (error) {
      console.error('YouTube API error:', error);
      message.error(`Could not fetch video info: ${error.message}`);
      return null;
    }
  };

  // Parse ISO 8601 duration to seconds
  const parseDuration = (duration) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);

    return hours * 3600 + minutes * 60 + seconds;
  };

  // Format seconds to HH:MM:SS for display
  const formatDurationDisplay = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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
      message.error('Please provide all required information for every lesson!');
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
        message.success('Lesson updated successfully!');
      } else {
        // Thêm mới bài học
        const response = await courseService.createLesson(course.courseId, lessonForms);
        const newLessons = Array.isArray(response) ? response : (response.data || []);

        if (newLessons.length > 0) {
          setLessons([...lessons, ...newLessons]);
          message.success(`Successfully added ${newLessons.length} lessons!`);
        } else {
          await featchLessonsByCourseId(course.courseId);
          message.success('Lesson added successfully!');
        }
      }

      handleLessonCancel();
    } catch (error) {
      message.error(error.message || 'Error while saving lesson');
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
      title: 'Delete confirmation',
      content: 'Are you sure you want to delete this lesson?',
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await courseService.deleteLesson(lessonId);
          setLessons(lessons.filter(l => l.lessonId !== lessonId));
          message.success('Lesson deleted successfully!');
        } catch (error) {
          message.error('Error while deleting lesson!');
        }
      }
    });
  };

  const handleDeleteCourse = () => {
    Modal.confirm({
      title: 'Delete course confirmation',
      content: 'Are you sure you want to delete this course? All lessons will be removed!',
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: () => {
        message.success('Course deleted successfully!');
        onBack();
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryTag = (category) => {
    const colors = {
      'Icons': 'cyan',
      'Characters': 'blue',
      'ShapesAndFrames': 'purple',
      'Layouts': 'green',
      'EverydayObjects': 'orange',
      'LessonNote': 'magenta'
    };
    const displayNames = {
      'ShapesAndFrames': 'Shapes and Frames',
      'EverydayObjects': 'Everyday Objects',
      'LessonNote': 'Lesson Note'
    };
    return <Tag color={colors[category] || 'default'}>{displayNames[category] || category}</Tag>;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Space size="large">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              size="large"
            >
              Back
            </Button>
            <div>
              <Title level={3} className="!m-0">
                {course.title}
              </Title>
              <Text type="secondary">
                {course.subtitle}
              </Text>
            </div>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showLessonModal('add')}
            size="large"
          >
            Add Lesson
          </Button>
        </div>

        {/* Course Detail */}
        <Row gutter={24} align="stretch">
          {/* Left Column - Course Info */}
          <Col xs={24} lg={8}>
            <Card
              className="shadow-lg"
              style={{
                height: '100%',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              {/* Course Image */}
              {course.imageUrl && course.imageUrl !== 'string' && course.imageUrl.length > 10 && (
                <div style={{ marginBottom: '20px' }}>
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    width="100%"
                    style={{
                      borderRadius: '8px',
                      objectFit: 'cover',
                      maxHeight: '200px'
                    }}
                  />
                </div>
              )}

              <div className="space-y-4">
                <div style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  borderRadius: '8px'
                }}>
                  <Text type="secondary" className="block mb-2" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Course Title
                  </Text>
                  <Title level={4} className="!m-0" style={{ color: '#1a1a1a' }}>
                    {course.title}
                  </Title>
                </div>

                <div style={{
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <Text type="secondary" className="block mb-2" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Description
                  </Text>
                  <Paragraph className="!mb-0" style={{ color: '#4a5568' }}>
                    {course.description}
                  </Paragraph>
                </div>

                <Divider className="!my-4" />

                {/* Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  <div style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Text type="secondary" className="block mb-1" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                      Category
                    </Text>
                    {getCategoryTag(course.category)}
                  </div>

                  <div style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Text type="secondary" className="block mb-1" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                      Price
                    </Text>
                    <Text strong style={{ fontSize: '16px', color: '#d97706' }}>
                      {course.price.toLocaleString()} VND
                    </Text>
                  </div>

                  <div style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Text type="secondary" className="block mb-1" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                      Students
                    </Text>
                    <Text strong style={{ fontSize: '18px', color: '#7c3aed' }}>
                      {course.studentCount || 0}
                    </Text>
                  </div>

                  <div style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Text type="secondary" className="block mb-1" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                      Lessons
                    </Text>
                    <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
                      {lessons.length}
                    </Tag>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Right Column - Lessons List */}
          <Col xs={24} lg={16}>
            <Card
              className="shadow-lg"
              style={{
                borderRadius: '12px',
                overflow: 'hidden'
              }}
              title={
                <div className="flex items-center justify-between">
                  <Space>
                    <VideoCameraOutlined style={{ fontSize: '20px', color: '#667eea' }} />
                    <span style={{ fontSize: '18px', fontWeight: '600' }}>Lesson List</span>
                  </Space>
                  <Tag
                    color="blue"
                    style={{
                      fontSize: '14px',
                      padding: '4px 16px',
                      borderRadius: '20px'
                    }}
                  >
                    {getFilteredLessons().length} lessons
                  </Tag>
                </div>
              }
              extra={
                <Input.Search
                  placeholder="Search lessons..."
                  style={{
                    width: 300,
                    borderRadius: '8px'
                  }}
                  size="large"
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
                    renderItem={(lesson) => (
                      <List.Item
                        style={{
                          padding: '16px',
                          marginBottom: '8px',
                          background: '#fff',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setViewingLesson(lesson);
                          setIsViewLessonModalVisible(true);
                        }}
                        className="hover:shadow-md transition-shadow"
                      >
                        <List.Item.Meta
                          avatar={
                            <div style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '8px',
                              background: '#1890ff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '18px',
                              fontWeight: 'bold'
                            }}>
                              {lesson.orderIndex}
                            </div>
                          }
                          title={
                            <Text strong style={{ fontSize: '16px' }}>
                              {lesson.title}
                            </Text>
                          }
                          description={
                            <div className="space-y-2 mt-2">
                              <Paragraph
                                ellipsis={{ rows: 2 }}
                                className="!mb-2"
                                style={{ color: '#6b7280' }}
                              >
                                {lesson.description}
                              </Paragraph>
                              <Space size="middle">
                                <Tag icon={<ClockCircleOutlined />} color="blue">
                                  {formatDuration(lesson.duration)}
                                </Tag>
                                {lesson.videoUrl && (
                                  <Tag icon={<PlayCircleOutlined />} color="green">
                                    Video
                                  </Tag>
                                )}
                              </Space>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Spin>
              ) : (
                <Empty
                  description={searchTerm ? "No lessons found" : "No lessons yet"}
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
                      Add First Lesson
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
                      `${range[0]}-${range[1]} of ${total} lessons`
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
        title={modalMode === 'edit' ? 'Edit Lesson' : 'Add Multiple Lessons'}
        open={isModalVisible}
        onCancel={handleLessonCancel}
        onOk={handleLessonSubmit}
        okText={modalMode === 'edit' ? 'Update' : 'Save Lessons'}
        cancelText="Cancel"
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
                  <span className="font-semibold">Lesson {form.orderIndex}</span>
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
                    Lesson title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Enter the lesson title"
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
                    Lesson description <span className="text-red-500">*</span>
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Enter the detailed lesson description"
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
                    Lesson content
                  </label>
                  <TextArea
                    rows={4}
                    placeholder="Enter the detailed lesson content (optional)"
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
                      Duration (seconds) <span className="text-red-500">*</span>
                    </label>
                    <InputNumber
                      className="w-full"
                      placeholder="Example: 3600"
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
                      Display order
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
                    onChange={async (e) => {
                      const url = e.target.value;
                      const updated = [...lessonForms];
                      updated[index].videoUrl = url;
                      setLessonForms(updated);

                      // Auto-fetch duration when URL is pasted/changed
                      const videoId = extractVideoId(url);
                      if (videoId) {
                        setFetchingDuration(prev => ({ ...prev, [index]: true }));
                        const duration = await fetchYouTubeDuration(videoId);
                        setFetchingDuration(prev => ({ ...prev, [index]: false }));

                        if (duration !== null && duration > 0) {
                          const updatedWithDuration = [...lessonForms];
                          updatedWithDuration[index].duration = duration;
                          setLessonForms(updatedWithDuration);
                        }
                      }
                    }}
                    suffix={
                      fetchingDuration[index] && (
                        <Spin size="small" />
                      )
                    }
                  />
                  <Text type="secondary" className="text-xs mt-1 block">
                    Paste YouTube URL to automatically fetch video duration.
                  </Text>
                  {form.videoUrl && (
                    <div className="mt-3">
                      <Text type="secondary" className="block mb-2">Preview:</Text>
                      <div className="relative inline-block">
                        <iframe
                          width="300"
                          height="170"
                          src={`https://www.youtube.com/embed/${extractVideoId(form.videoUrl)}`}
                          title="YouTube video preview"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded"
                        ></iframe>
                      </div>
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
              Add Another Lesson
            </Button>
          )}
        </div>
      </Modal>

      {/* Course Modal */}
      <Modal
        title="Edit Course"
        open={isCourseModalVisible}
        onCancel={() => setIsCourseModalVisible(false)}
        onOk={() => {
          if (!courseForm.title || !courseForm.subtitle || !courseForm.description || !courseForm.category || courseForm.price <= 0) {
            message.error('Please fill in all required course information!');
            return;
          }
          message.success('Course information updated successfully!');
          setIsCourseModalVisible(false);
        }}
        okText="Save Changes"
        cancelText="Cancel"
        width={700}
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block mb-2 font-medium">Course title *</label>
            <Input
              placeholder="Enter the course title"
              size="large"
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Subtitle *</label>
            <Input
              placeholder="Enter the course subtitle"
              value={courseForm.subtitle}
              onChange={(e) => setCourseForm({ ...courseForm, subtitle: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Description *</label>
            <TextArea
              rows={4}
              placeholder="Enter the detailed course description"
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
            />
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <label className="block mb-2 font-medium">Category *</label>
              <Input
                placeholder="Enter category (Art, Design...)"
                value={courseForm.category}
                onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
              />
            </Col>
            <Col span={12}>
              <label className="block mb-2 font-medium">Price (VND) *</label>
              <InputNumber
                className="w-full"
                placeholder="Enter price"
                min={0}
                value={courseForm.price}
                onChange={(value) => setCourseForm({ ...courseForm, price: value })}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Col>
          </Row>
        </div>
      </Modal>

      {/* View Lesson Detail Modal */}
      <Modal
        title={
          <Space>
            <VideoCameraOutlined style={{ color: '#1890ff' }} />
            <span>Lesson Detail</span>
          </Space>
        }
        open={isViewLessonModalVisible}
        onCancel={() => {
          setIsViewLessonModalVisible(false);
          setViewingLesson(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsViewLessonModalVisible(false);
            setViewingLesson(null);
          }}>
            Close
          </Button>
        ]}
        width={800}
      >
        {viewingLesson && (
          <div className="space-y-4">
            <div>
              <Text type="secondary" className="block mb-2">Lesson Order</Text>
              <Tag color="blue" style={{ fontSize: '16px', padding: '6px 16px' }}>
                Lesson {viewingLesson.orderIndex}
              </Tag>
            </div>

            <div>
              <Text type="secondary" className="block mb-2">Title</Text>
              <Title level={4} className="!m-0">{viewingLesson.title}</Title>
            </div>

            <div>
              <Text type="secondary" className="block mb-2">Description</Text>
              <Paragraph>{viewingLesson.description}</Paragraph>
            </div>

            {viewingLesson.content && (
              <div>
                <Text type="secondary" className="block mb-2">Content</Text>
                <Paragraph style={{
                  background: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '6px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {viewingLesson.content}
                </Paragraph>
              </div>
            )}

            <div>
              <Text type="secondary" className="block mb-2">Duration</Text>
              <Tag icon={<ClockCircleOutlined />} color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                {formatDuration(viewingLesson.duration)}
              </Tag>
            </div>

            {viewingLesson.videoUrl && (
              <div>
                <Text type="secondary" className="block mb-2">Video</Text>
                <div style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0,
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <iframe
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                    src={`https://www.youtube.com/embed/${extractVideoId(viewingLesson.videoUrl)}`}
                    title={viewingLesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
};

export default CourseDetail;