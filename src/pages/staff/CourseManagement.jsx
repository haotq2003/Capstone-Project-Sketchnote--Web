import React, { useEffect, useState } from 'react';
import CourseDetail from './CourseDetail';
import {
  Typography,
  Table,
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
  Image,
  Popconfirm,
  Steps,
  Card,
  Form,
  Divider,
  Spin
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BookOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { courseService } from '../../service/courseService';
import ImageUploader from '../../common/ImageUploader';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Step } = Steps;



const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Modal states
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [editingCourse, setEditingCourse] = useState(null);

  // Form instances
  const [courseForm] = Form.useForm();
  const [lessonForm] = Form.useForm();
  const [newCourseId, setNewCourseId] = useState(null);
  const [lessonForms, setLessonForms] = useState([
    { title: '', description: '', content: '', videoUrl: '', duration: 0, orderIndex: 1 }
  ]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [fetchingDuration, setFetchingDuration] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await courseService.getAllCourse();

      setCourses(res.result || []);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses
  const getFilteredCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    return filtered;
  };

  // Create Course Flow - Step 1: Create Course
  const handleCreateCourse = async (values) => {
    try {
      const newCourse = await courseService.createCourse(values);
      setNewCourseId(newCourse.result.courseId);
      message.success('Course created! Continue by adding lessons.');
      setCurrentStep(1);
    } catch (error) {
      message.error(error.message);
    }
  };

  // Create Course Flow - Step 2: Create Lessons
  const handleCreateLessons = async () => {
    if (lessonForms.some(l => !l.title || !l.description || l.duration <= 0)) {
      message.error('Please provide all required information for every lesson!');
      return;
    }

    try {
      const res = await courseService.createLesson(newCourseId, lessonForms);
      console.log(res)
      message.success('Lessons created successfully!');
      handleCloseCreateModal();
      fetchCourses();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalVisible(false);
    setCurrentStep(0);
    setNewCourseId(null);
    courseForm.resetFields();
    setLessonForms([{ title: '', description: '', content: '', videoUrl: '', duration: 0, orderIndex: 1 }]);
  };

  // Edit Course
  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setIsEditModalVisible(true);
  };

  const handleUpdateCourse = async (values) => {
    try {
      await courseService.updateCourse(editingCourse.courseId, values);
      message.success('Course updated successfully!');
      setIsEditModalVisible(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      message.error(error.message);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId) => {
    try {
      await courseService.deleteCourse(courseId);
      message.success('Course deleted successfully!');
      fetchCourses();
    } catch (error) {
      message.error(error.message);
    }
  };

  // Lesson Form Management
  const addLessonForm = () => {
    const currentMaxOrder = Math.max(...lessonForms.map(f => f.orderIndex), 0);
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
    setLessonForms(updated);
  };

  const updateLessonForm = (index, field, value) => {
    const updated = [...lessonForms];
    updated[index][field] = value;
    setLessonForms(updated);
  };

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*$/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Fetch YouTube video duration using YouTube Data API v3
  const fetchYouTubeDuration = async (videoId) => {
    try {
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      console.log('🔑 API Key exists:', !!apiKey);
      console.log('🔑 API Key preview:', apiKey ? apiKey.substring(0, 10) + '...' : 'none');

      if (!apiKey || apiKey.includes('xZ9x')) {
        message.warning('YouTube API key not configured. Please add a valid API key to .env file.');
        return null;
      }

      const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails,snippet&key=${apiKey}`;
      console.log('🌐 Fetching from YouTube API...');

      const response = await fetch(url);
      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 API Response data:', data);

      if (!data.items || data.items.length === 0) {
        message.error('Video not found. Please check the URL.');
        return null;
      }

      const video = data.items[0];
      const duration = video.contentDetails.duration; // Format: PT1H2M10S
      const title = video.snippet.title;

      console.log('⏱️ Raw duration:', duration);

      // Parse ISO 8601 duration to seconds
      const durationInSeconds = parseDuration(duration);
      console.log('⏱️ Parsed duration (seconds):', durationInSeconds);

      message.success(`Video found: "${title}" (${formatDuration(durationInSeconds)})`);
      return durationInSeconds;
    } catch (error) {
      console.error('❌ YouTube API error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack
      });
      message.error(`Could not fetch video info: ${error.message}`);
      return null;
    }
  };

  // Parse ISO 8601 duration (PT1H2M10S) to seconds
  const parseDuration = (duration) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);

    return hours * 3600 + minutes * 60 + seconds;
  };

  // Format seconds to readable duration (HH:MM:SS)
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle YouTube URL change
  const handleYouTubeUrlChange = async (index, url) => {
    console.log('🎬 YouTube URL changed:', { index, url });
    updateLessonForm(index, 'videoUrl', url);

    const videoId = extractYouTubeId(url);
    console.log('📹 Extracted video ID:', videoId);

    if (videoId) {
      setFetchingDuration(prev => ({ ...prev, [index]: true }));
      console.log('⏳ Fetching duration for video ID:', videoId);

      const duration = await fetchYouTubeDuration(videoId);
      console.log('✅ Received duration:', duration);

      setFetchingDuration(prev => ({ ...prev, [index]: false }));

      if (duration !== null && duration > 0) {
        console.log('📝 Setting duration to:', duration);
        // Auto-fill duration
        updateLessonForm(index, 'duration', duration);
      } else {
        console.log('⚠️ Duration is null or 0');
      }
    } else {
      console.log('❌ Could not extract video ID from URL');
    }
  };

  // View Course Detail
  if (selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => {
          setSelectedCourse(null);
          fetchCourses();
        }}
      />
    );
  }

  // Table columns
  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 100,
      render: (imageUrl, record) => {
        if (!imageUrl || imageUrl === 'string' || imageUrl.length < 10) {
          return <Text type="secondary" style={{ fontSize: 12 }}>No image</Text>;
        }
        return (
          <Image
            src={imageUrl}
            alt={record.title}
            width={80}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            fallback={<Text type="secondary" style={{ fontSize: 12 }}>Failed to load image</Text>}
          />
        );
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.subtitle}</Text>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category) => {
        const colors = {
          'Icons': 'cyan',
          'Characters': 'blue',
          'ShapesAndFrames': 'purple',
          'Layouts': 'green',
          'EverydayObjects': 'orange',
          'LessonNote': 'magenta'
        };
        return <Tag color={colors[category] || 'default'}>{category === 'ShapesAndFrames' ? 'Shapes and Frames' : category === 'EverydayObjects' ? 'Everyday Objects' : category === 'LessonNote' ? 'Lesson Note' : category}</Tag>;
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => (
        <Text strong style={{ color: '#ff6b35' }}>
          {price?.toLocaleString() || '0'} VNĐ
        </Text>
      ),
    },
    {
      title: 'Students',
      dataIndex: 'studentCount',
      key: 'studentCount',
      width: 100,
      align: 'center',
      render: (count) => <Tag color="blue">{count || 0}</Tag>,
    },
    {
      title: 'Lessons',
      dataIndex: 'lessons',
      key: 'lessons',
      width: 100,
      align: 'center',
      render: (lessons) => <Tag color="green">{lessons?.length || 0}</Tag>,
    },
    {
      title: 'Actions',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setSelectedCourse(record)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditCourse(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete course confirmation"
            description="Are you sure you want to delete this course?"
            onConfirm={() => handleDeleteCourse(record.courseId)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Title level={3} className="!m-0">
            <BookOutlined />
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
            size="large"
          >
            Create New Course
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <Space size="middle" style={{ width: '100%' }}>
            <Input.Search
              placeholder="Search courses..."
              size="large"
              style={{ width: 300 }}
              onSearch={(value) => setSearchTerm(value)}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
            <Select
              placeholder="Filter by category"
              size="large"
              style={{ width: 200 }}
              value={selectedCategory}
              onChange={setSelectedCategory}
            >
              <Select.Option value="all">All categories</Select.Option>
              <Select.Option value="Icons">Icons</Select.Option>
              <Select.Option value="Characters">Characters</Select.Option>
              <Select.Option value="ShapesAndFrames">Shapes and Frames</Select.Option>
              <Select.Option value="Layouts">Layouts</Select.Option>
              <Select.Option value="EverydayObjects">Everyday Objects</Select.Option>
              <Select.Option value="LessonNote">Lesson Note</Select.Option>
            </Select>
            <Text type="secondary">
              Total: {getFilteredCourses().length} courses
            </Text>
          </Space>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={getFilteredCourses()}
          rowKey="courseId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]} -${range[1]} of ${total} courses`,
          }}
        />
      </div>

      {/* Create Course Modal with Steps */}
      <Modal
        title={
          <div>
            <Title level={4} className="!mb-2">Create New Course</Title>
            <Steps current={currentStep} size="small">
              <Step title="Course information" icon={<BookOutlined />} />
              <Step title="Add lessons" icon={<VideoCameraOutlined />} />
            </Steps>
          </div>
        }
        open={isCreateModalVisible}
        onCancel={handleCloseCreateModal}
        footer={null}
        width={800}
        destroyOnClose
      >
        {currentStep === 0 && (
          <Form
            form={courseForm}
            layout="vertical"
            onFinish={handleCreateCourse}
            className="mt-4"
          >
            <Form.Item
              name="title"
              label="Course title"
              rules={[{ required: true, message: 'Please enter the course title!' }]}
            >
              <Input placeholder="Enter the course title" size="large" />
            </Form.Item>

            <Form.Item
              name="subtitle"
              label="Subtitle"
              rules={[{ required: true, message: 'Please enter the subtitle!' }]}
            >
              <Input placeholder="Enter the subtitle" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter the description!' }]}
            >
              <TextArea rows={4} placeholder="Enter the course description" />
            </Form.Item>

            <Form.Item
              name="imageUrl"
              label="Course image"
              rules={[{ required: true, message: 'Please upload a course image!' }]}
            >
              <ImageUploader
                multiple={false}
                onImageUploaded={(images) => {
                  if (images && images.length > 0) {
                    const imageUrl = images[0].imageUrl;
                    setUploadedImageUrl(imageUrl);
                    courseForm.setFieldsValue({ imageUrl });
                  }
                }}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: 'Please select a category!' }]}
                >
                  <Select placeholder="Select category">
                    <Select.Option value="Icons">Icons</Select.Option>
                    <Select.Option value="Characters">Characters</Select.Option>
                    <Select.Option value="ShapesAndFrames">Shapes and Frames</Select.Option>
                    <Select.Option value="Layouts">Layouts</Select.Option>
                    <Select.Option value="EverydayObjects">Everyday Objects</Select.Option>
                    <Select.Option value="LessonNote">Lesson Note</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="price"
                  label="Price (VND)"
                  rules={[{ required: true, message: 'Please enter the price!' }]}
                >
                  <InputNumber
                    className="w-full"
                    placeholder="Enter the price"
                    min={0}
                    formatter={value => `${value} `.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="!mb-0">
              <Space className="w-full justify-end">
                <Button onClick={handleCloseCreateModal}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Next: Add lessons
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}

        {currentStep === 1 && (
          <div className="mt-4">
            <div className="space-y-4 mb-4">
              {lessonForms.map((form, index) => (
                <Card
                  key={index}
                  title={`Lesson ${form.orderIndex} `}
                  extra={
                    lessonForms.length > 1 && (
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => removeLessonForm(index)}
                      >
                        Delete
                      </Button>
                    )
                  }
                  className="shadow-sm"
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block mb-1 font-medium">Title *</label>
                      <Input
                        placeholder="Enter the lesson title"
                        value={form.title}
                        onChange={(e) => updateLessonForm(index, 'title', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Description *</label>
                      <TextArea
                        rows={2}
                        placeholder="Enter the lesson description"
                        value={form.description}
                        onChange={(e) => updateLessonForm(index, 'description', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Content</label>
                      <TextArea
                        rows={3}
                        placeholder="Enter detailed content (optional)"
                        value={form.content}
                        onChange={(e) => updateLessonForm(index, 'content', e.target.value)}
                      />
                    </div>

                    <Row gutter={16}>
                      <Col span={12}>
                        <label className="block mb-1 font-medium">Duration (seconds) *</label>
                        <InputNumber
                          className="w-full"
                          placeholder="Example: 3600"
                          min={0}
                          value={form.duration}
                          onChange={(value) => updateLessonForm(index, 'duration', value)}
                        />
                      </Col>
                      <Col span={12}>
                        <label className="block mb-1 font-medium">Order</label>
                        <InputNumber
                          className="w-full"
                          min={1}
                          value={form.orderIndex}
                          onChange={(value) => updateLessonForm(index, 'orderIndex', value)}
                        />
                      </Col>
                    </Row>

                    <div>
                      <label className="block mb-1 font-medium">YouTube video URL</label>
                      <Input
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={form.videoUrl}
                        onChange={async (e) => {
                          const url = e.target.value;
                          updateLessonForm(index, 'videoUrl', url);

                          // Auto-fetch duration when URL is pasted/changed
                          const videoId = extractYouTubeId(url);
                          if (videoId) {
                            setFetchingDuration(prev => ({ ...prev, [index]: true }));
                            const duration = await fetchYouTubeDuration(videoId);
                            setFetchingDuration(prev => ({ ...prev, [index]: false }));

                            if (duration !== null && duration > 0) {
                              updateLessonForm(index, 'duration', duration);
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
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button
              type="dashed"
              block
              icon={<PlusOutlined />}
              onClick={addLessonForm}
              className="mb-4"
            >
              Add Another Lesson
            </Button>

            <Divider />

            <Space className="w-full justify-end">
              <Button onClick={() => setCurrentStep(0)}>Back</Button>
              <Button type="primary" onClick={handleCreateLessons}>
                Finish
              </Button>
            </Space>
          </div>
        )}
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        title="Edit Course"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingCourse(null);
        }}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form
          layout="vertical"
          initialValues={editingCourse}
          onFinish={handleUpdateCourse}
          className="mt-4"
        >
          <Form.Item
            name="title"
            label="Course title"
            rules={[{ required: true, message: 'Please enter the course title!' }]}
          >
            <Input placeholder="Enter the course title" size="large" />
          </Form.Item>

          <Form.Item
            name="subtitle"
            label="Subtitle"
            rules={[{ required: true, message: 'Please enter the subtitle!' }]}
          >
            <Input placeholder="Enter the subtitle" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the description!' }]}
          >
            <TextArea rows={4} placeholder="Enter the course description" />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Course image"
            rules={[{ required: true, message: 'Please upload a course image!' }]}
          >
            <div className="mb-2">
              {editingCourse?.imageUrl && (
                <div className="mb-2">
                  <Text type="secondary" className="text-xs">Current image:</Text>
                  <Image
                    src={editingCourse.imageUrl}
                    alt="Current course image"
                    width={120}
                    height={80}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                    className="mt-1"
                  />
                </div>
              )}
              <ImageUploader
                multiple={false}
                onImageUploaded={(images) => {
                  if (images && images.length > 0) {
                    const imageUrl = images[0].imageUrl;
                    setUploadedImageUrl(imageUrl);
                    // Update form field value directly
                    const form = Modal.useForm ? Modal.useForm()[0] : null;
                    if (form) {
                      form.setFieldsValue({ imageUrl });
                    }
                  }
                }}
              />
            </div>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select a category!' }]}
              >
                <Select placeholder="Select category">
                  <Select.Option value="Icons">Icons</Select.Option>
                  <Select.Option value="Characters">Characters</Select.Option>
                  <Select.Option value="ShapesAndFrames">Shapes and Frames</Select.Option>
                  <Select.Option value="Layouts">Layouts</Select.Option>
                  <Select.Option value="EverydayObjects">Everyday Objects</Select.Option>
                  <Select.Option value="LessonNote">Lesson Note</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="price"
                label="Price (VND)"
                rules={[{ required: true, message: 'Please enter the price!' }]}
              >
                <InputNumber
                  className="w-full"
                  placeholder="Enter the price"
                  min={0}
                  formatter={value => `${value} `.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="!mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setIsEditModalVisible(false);
                setEditingCourse(null);
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManagement;
