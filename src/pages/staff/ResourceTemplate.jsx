import React, { useEffect, useState, useMemo } from "react";
import {
  Tabs,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Input,
  Select,
  Form,
  message,
  Typography,
  Image,
  Popconfirm,
  Card,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { paperTemplateService } from "../../service/paperTemplateService";
import ImageUploader from "../../common/ImageUploader";

const { Search } = Input;
const { Text, Title, Paragraph } = Typography;

const customStyles = `
  .resource-header {
    background: linear-gradient(135deg, #6366f1 0%, #5578f7ff 100%);
    padding: 48px;
    border-radius: 24px;
    margin-bottom: 20px;
    color: white;
    box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
    position: relative;
    overflow: hidden;
  }
  .resource-header::after {
    content: "";
    position: absolute;
    top: -50%;
    right: -10%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    filter: blur(50px);
  }
  .resource-card {
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    background: white;
  }
  .resource-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
  }
  .gradient-btn {
    background: linear-gradient(135deg, #6366f1 0%, #5578f7ff 100%) !important;
    border: none !important;
    color: white !important;
    height: 44px !important;
    padding: 0 24px !important;
    border-radius: 12px !important;
    font-weight: 600 !important;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important;
    transition: all 0.3s ease !important;
  }
  .gradient-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4) !important;
    opacity: 0.9 !important;
  }
  .ant-tabs-nav::before {
    border-bottom: none !important;
  }
  .ant-tabs-tab {
    padding: 12px 24px !important;
    border-radius: 12px !important;
    margin-right: 8px !important;
    transition: all 0.3s !important;
    font-weight: 500 !important;
  }
  .ant-tabs-tab-active {
    background: white !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  }
  .ant-table-thead > tr > th {
    background: #f1f5f9 !important;
    font-weight: 700 !important;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.05em;
    color: #475569 !important;
    border-bottom: 2px solid #e2e8f0 !important;
  }
  .ant-table-row {
    transition: all 0.3s ease;
  }
  .ant-table-row:hover > td {
    background: #f8fafc !important;
  }
  .action-btn {
    border-radius: 8px !important;
    transition: all 0.2s ease !important;
  }
  .action-btn:hover {
    background: #f1f5f9 !important;
    transform: scale(1.1);
  }
  .glass-modal .ant-modal-content {
    border-radius: 24px;
    overflow: hidden;
    padding: 0 !important;
  }
  .glass-modal .ant-modal-header {
    background: linear-gradient(135deg, #6366f1 0%, #5578f7ff 100%);
    padding: 24px;
    margin-bottom: 0;
  }
  .glass-modal .ant-modal-title {
    color: white !important;
  }
  .glass-modal .ant-modal-close {
    color: white !important;
    top: 24px !important;
    right: 24px !important;
  }
  .glass-modal .ant-modal-body {
    padding: 32px;
  }
  .glass-modal .ant-modal-footer {
    padding: 16px 32px 24px !important;
    margin-top: 0 !important;
    border-top: 1px solid #f1f5f9 !important;
  }
  .detail-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94a3b8;
    font-weight: 600;
    margin-bottom: 4px;
    display: block;
  }
  .detail-value {
    font-size: 16px;
    color: #1e293b;
    font-weight: 500;
  }
  .image-preview-container {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    border: 4px solid white;
  }
`;

export default function ResourceTemplate() {
  const [activeTab, setActiveTab] = useState("category");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [templateForm] = Form.useForm();

  // Category State
  const [categories, setCategories] = useState([]);
  const [catPage, setCatPage] = useState(1);
  const [catSize, setCatSize] = useState(10);
  const [catTotal, setCatTotal] = useState(0);
  const [catSearchKeyword, setCatSearchKeyword] = useState("");
  const [catFilterPaperType, setCatFilterPaperType] = useState("");
  const [createCatModalVisible, setCreateCatModalVisible] = useState(false);
  const [editCatModalVisible, setEditCatModalVisible] = useState(false);
  const [viewCatModalVisible, setViewCatModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Template State
  const [templates, setTemplates] = useState([]);
  const [tplSearchKeyword, setTplSearchKeyword] = useState("");
  const [tplFilterSize, setTplFilterSize] = useState("");
  const [tplFilterCategory, setTplFilterCategory] = useState("");
  const [createTplModalVisible, setCreateTplModalVisible] = useState(false);
  const [editTplModalVisible, setEditTplModalVisible] = useState(false);
  const [viewTplModalVisible, setViewTplModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Category Groups
  const paperTemplateCategories = ["Base", "Study", "Plan", "Work", "Write", "Specialty", "Life"];
  const coverTemplateCategories = ["Black & White", "Illustration", "Fruit", "Graph", "Simple"];

  // Paper type options
  const paperTypeOptions = [
    { label: "Cover", value: "COVER" },
    { label: "Paper", value: "PAPER" },
  ];

  const paperTypeColors = {
    COVER: "geekblue",
    PAPER: "cyan",
  };

  const paperSizeOptions = [
    { label: "Landscape", value: "LANDSCAPE" },
    { label: "Portrait", value: "PORTRAIT" },
  ];

  const paperSizeColors = {
    LANDSCAPE: "orange",
    PORTRAIT: "purple",
  };

  // Fetch category papers
  const fetchCategories = async (p = catPage, s = catSize) => {
    try {
      setLoading(true);
      const res = await paperTemplateService.getCategoryPapers(
        catFilterPaperType,
        catSearchKeyword,
        p - 1,
        s
      );
      setCategories(res.content || []);
      setCatTotal(res.totalElements || 0);
    } catch (error) {
      message.error(error.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Fetch paper templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      // Fetch a large batch to allow client-side filtering for the two tabs
      // This ensures that "Paper Template" tab isn't empty just because the first page of results are all covers.
      const res = await paperTemplateService.getPaperTemplates(
        tplFilterCategory,
        tplFilterSize,
        tplSearchKeyword,
        0,
        1000 // Fetch up to 1000 items for client-side filtering
      );
      setTemplates(res.content || []);
    } catch (error) {
      message.error(error.message || "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "category") {
      fetchCategories(catPage, catSize);
    } else {
      fetchTemplates();
      if (categories.length === 0) {
        fetchCategories(1, 100);
      }
    }
  }, [
    catPage,
    catSize,
    catFilterPaperType,
    catSearchKeyword,
    tplFilterSize,
    tplFilterCategory,
    tplSearchKeyword,
    activeTab,
  ]);

  // Filtered Templates for each tab
  const paperTemplates = useMemo(() =>
    templates.filter(t => paperTemplateCategories.some(cat => t.categoryPaperName?.toLowerCase().trim() === cat.toLowerCase().trim())),
    [templates]
  );

  const coverTemplates = useMemo(() =>
    templates.filter(t => coverTemplateCategories.some(cat => t.categoryPaperName?.toLowerCase().trim() === cat.toLowerCase().trim())),
    [templates]
  );

  // Format date
  const formatDate = (value) =>
    value ? new Date(value).toLocaleString("en-US") : "-";

  // --- Category Handlers ---
  const handleCreateCat = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await paperTemplateService.createCategoryPaper(values);
      message.success("Category created successfully!");
      setCreateCatModalVisible(false);
      form.resetFields();
      fetchCategories(1, catSize);
      setCatPage(1);
    } catch (error) {
      if (!error.errorFields) {
        message.error(error.message || "Failed to create category");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditCat = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await paperTemplateService.updateCategoryPaper(
        selectedCategory.categoryPaperId,
        values
      );
      message.success("Category updated successfully!");
      setEditCatModalVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      if (!error.errorFields) {
        message.error(error.message || "Failed to update category");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCat = async (id) => {
    try {
      setLoading(true);
      await paperTemplateService.deleteCategoryPaper(id);
      message.success("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      message.error(error.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const openEditCatModal = (record) => {
    setSelectedCategory(record);
    form.setFieldsValue({
      paperType: record.paperType,
      name: record.name,
    });
    setEditCatModalVisible(true);
  };

  // --- Template Handlers ---
  const handleCreateTpl = async () => {
    try {
      const values = await templateForm.validateFields();
      setLoading(true);
      await paperTemplateService.createPaperTemplate(values);
      message.success("Template created successfully!");
      setCreateTplModalVisible(false);
      templateForm.resetFields();
      fetchTemplates();
    } catch (error) {
      if (!error.errorFields) {
        message.error(error.message || "Failed to create template");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditTpl = async () => {
    try {
      const values = await templateForm.validateFields();
      setLoading(true);
      await paperTemplateService.updatePaperTemplate(
        selectedTemplate.paperTemplateId,
        values
      );
      message.success("Template updated successfully!");
      setEditTplModalVisible(false);
      templateForm.resetFields();
      fetchTemplates();
    } catch (error) {
      if (!error.errorFields) {
        message.error(error.message || "Failed to update template");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTpl = async (id) => {
    try {
      setLoading(true);
      await paperTemplateService.deletePaperTemplate(id);
      message.success("Template deleted successfully!");
      fetchTemplates();
    } catch (error) {
      message.error(error.message || "Failed to delete template");
    } finally {
      setLoading(false);
    }
  };

  const openEditTplModal = (record) => {
    setSelectedTemplate(record);
    templateForm.setFieldsValue({
      name: record.name,
      paperSize: record.paperSize,
      categoryPaperId: record.categoryPaperId,
      imageUrl: record.imageUrl,
    });
    setEditTplModalVisible(true);
  };

  // --- Columns ---
  const catColumns = [
    {
      title: "ID",
      dataIndex: "categoryPaperId",
      key: "id",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Paper Type",
      dataIndex: "paperType",
      key: "paperType",
      width: 150,
      render: (type) => (
        <Tag color={paperTypeColors[type] || "default"}>{type || "N/A"}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (d) => formatDate(d),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      width: 200,
      render: (_, record) => (
        <div className="action-btn-wrapper">
          <Button
            type="text"
            className="action-btn"
            icon={<EyeOutlined className="text-blue-500" />}
            onClick={() => {
              setSelectedCategory(record);
              setViewCatModalVisible(true);
            }}
          />
          <Button
            type="text"
            className="action-btn"
            icon={<EditOutlined className="text-amber-500" />}
            onClick={() => openEditCatModal(record)}
          />
          <Popconfirm
            title="Delete Category"
            description={`Are you sure you want to delete "${record.name}"?`}
            onConfirm={() => handleDeleteCat(record.categoryPaperId)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger className="action-btn" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const tplColumns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 120,
      render: (url) => (
        <Image
          src={url}
          width={80}
          height={60}
          style={{ objectFit: "cover", borderRadius: 4 }}
          fallback="https://placehold.co/80x60?text=No+Image"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Category",
      dataIndex: "categoryPaperName",
      key: "category",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Size",
      dataIndex: "paperSize",
      key: "paperSize",
      render: (size) => (
        <Tag color={paperSizeColors[size] || "default"}>{size}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (d) => formatDate(d),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      width: 200,
      render: (_, record) => (
        <div className="action-btn-wrapper">
          <Button
            type="text"
            className="action-btn"
            icon={<EyeOutlined className="text-blue-500" />}
            onClick={() => {
              setSelectedTemplate(record);
              setViewTplModalVisible(true);
            }}
          />
          <Button
            type="text"
            className="action-btn"
            icon={<EditOutlined className="text-amber-500" />}
            onClick={() => openEditTplModal(record)}
          />
          <Popconfirm
            title="Delete Template"
            description={`Are you sure you want to delete "${record.name}"?`}
            onConfirm={() => handleDeleteTpl(record.paperTemplateId)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger className="action-btn" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // --- Page Contents ---
  const categoryPageContent = (
    <Card className="resource-card">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Search
          placeholder="Search categories..."
          allowClear
          className="flex-1"
          onSearch={(v) => setCatSearchKeyword(v)}
          onChange={(e) => setCatSearchKeyword(e.target.value)}
          prefix={<SearchOutlined className="text-indigo-400" />}
          size="large"
        />
        <Select
          placeholder="Filter by type"
          allowClear
          className="w-full sm:w-48"
          value={catFilterPaperType || undefined}
          onChange={(v) => setCatFilterPaperType(v || "")}
          size="large"
        >
          {paperTypeOptions.map((o) => (
            <Select.Option key={o.value} value={o.value}>
              {o.label}
            </Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          className="gradient-btn"
          icon={<PlusOutlined />}
          onClick={() => setCreateCatModalVisible(true)}
        >
          Add Category
        </Button>
      </div>

      <Table
        columns={catColumns}
        dataSource={categories}
        rowKey="categoryPaperId"
        loading={loading}
        pagination={{
          current: catPage,
          pageSize: catSize,
          total: catTotal,
          onChange: (p, s) => {
            setCatPage(p);
            setCatSize(s);
          },
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        size="middle"
      />
    </Card>
  );

  const renderTemplateTab = (data, allowedCategories) => (
    <Card className="resource-card">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Search
          placeholder="Search templates..."
          allowClear
          className="flex-1"
          onSearch={(v) => setTplSearchKeyword(v)}
          onChange={(e) => setTplSearchKeyword(e.target.value)}
          prefix={<SearchOutlined className="text-indigo-400" />}
          size="large"
        />
        <Select
          placeholder="Filter by category"
          allowClear
          className="w-full sm:w-48"
          value={tplFilterCategory || undefined}
          onChange={(v) => setTplFilterCategory(v || "")}
          size="large"
        >
          {categories
            .filter(c => allowedCategories.includes(c.name))
            .map((c) => (
              <Select.Option key={c.categoryPaperId} value={c.categoryPaperId}>
                {c.name}
              </Select.Option>
            ))}
        </Select>
        <Select
          placeholder="Filter by size"
          allowClear
          className="w-full sm:w-40"
          value={tplFilterSize || undefined}
          onChange={(v) => setTplFilterSize(v || "")}
          size="large"
        >
          {paperSizeOptions.map((o) => (
            <Select.Option key={o.value} value={o.value}>
              {o.label}
            </Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          className="gradient-btn"
          icon={<PlusOutlined />}
          onClick={() => setCreateTplModalVisible(true)}
        >
          Add Template
        </Button>
      </div>

      <Table
        columns={tplColumns}
        dataSource={data}
        rowKey="paperTemplateId"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        size="middle"
      />
    </Card>
  );

  return (
    <div className="p-8 bg-[#fcfcfd] min-h-screen">
      <style>{customStyles}</style>
      <div className="max-w-7xl mx-auto">
        <div className="resource-header">
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={1} className="!m-0 !text-white !font-bold">
                Resource Hub
              </Title>
              <Paragraph className="!text-white/80 !text-lg !m-0 mt-2">
                Curate and manage your creative assets with precision.
              </Paragraph>
            </Col>
            <Col>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
                <Text className="!text-white/60 block text-xs uppercase tracking-wider font-bold">Total Assets</Text>
                <Title level={3} className="!m-0 !text-white">
                  {catTotal + templates.length}
                </Title>
              </div>
            </Col>
          </Row>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          className="mb-8"
          items={[
            {
              key: "category",
              label: (
                <span className="flex items-center gap-2">
                  <AppstoreOutlined />
                  Category Page
                  <Tag className="!m-0 !rounded-full !bg-indigo-50 !text-indigo-600 !border-indigo-100">
                    {catTotal}
                  </Tag>
                </span>
              ),
              children: categoryPageContent,
            },
            {
              key: "paper_template",
              label: (
                <span className="flex items-center gap-2">
                  <FileTextOutlined />
                  Paper Template
                  <Tag className="!m-0 !rounded-full !bg-purple-50 !text-purple-600 !border-purple-100">
                    {paperTemplates.length}
                  </Tag>
                </span>
              ),
              children: renderTemplateTab(paperTemplates, paperTemplateCategories),
            },
            {
              key: "cover_template",
              label: (
                <span className="flex items-center gap-2">
                  <PictureOutlined />
                  Cover Page Template
                  <Tag className="!m-0 !rounded-full !bg-pink-50 !text-pink-600 !border-pink-100">
                    {coverTemplates.length}
                  </Tag>
                </span>
              ),
              children: renderTemplateTab(coverTemplates, coverTemplateCategories),
            },
          ]}
        />
      </div>

      {/* --- Category Modals --- */}
      <Modal
        title={<Title level={4} className="!m-0 !text-white">Create Category</Title>}
        open={createCatModalVisible}
        onCancel={() => {
          setCreateCatModalVisible(false);
          form.resetFields();
        }}
        onOk={handleCreateCat}
        confirmLoading={loading}
        className="glass-modal"
        okButtonProps={{ className: "gradient-btn" }}
        cancelButtonProps={{ className: "rounded-xl" }}
      >
        <Form layout="vertical" form={form} className="mt-4">
          <Form.Item
            label={<span className="font-semibold text-slate-600">Paper Type</span>}
            name="paperType"
            rules={[{ required: true, message: "Please select a paper type" }]}
          >
            <Select placeholder="Select paper type" size="large" className="rounded-xl">
              {paperTypeOptions.map((o) => (
                <Select.Option key={o.value} value={o.value}>
                  {o.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={<span className="font-semibold text-slate-600">Category Name</span>}
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input placeholder="e.g. Study, Work, etc." size="large" className="rounded-xl" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Title level={4} className="!m-0 !text-white">Edit Category</Title>}
        open={editCatModalVisible}
        onCancel={() => {
          setEditCatModalVisible(false);
          form.resetFields();
        }}
        onOk={handleEditCat}
        confirmLoading={loading}
        className="glass-modal"
        okButtonProps={{ className: "gradient-btn" }}
        cancelButtonProps={{ className: "rounded-xl" }}
      >
        <Form layout="vertical" form={form} className="mt-4">
          <Form.Item
            label={<span className="font-semibold text-slate-600">Paper Type</span>}
            name="paperType"
            rules={[{ required: true, message: "Please select a paper type" }]}
          >
            <Select placeholder="Select paper type" size="large" className="rounded-xl">
              {paperTypeOptions.map((o) => (
                <Select.Option key={o.value} value={o.value}>
                  {o.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={<span className="font-semibold text-slate-600">Category Name</span>}
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input placeholder="Enter category name" size="large" className="rounded-xl" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Title level={4} className="!m-0 !text-white">Category Details</Title>}
        open={viewCatModalVisible}
        onCancel={() => setViewCatModalVisible(false)}
        className="glass-modal"
        footer={[
          <Button key="close" onClick={() => setViewCatModalVisible(false)} className="rounded-xl px-6">
            Close
          </Button>,
        ]}
      >
        {selectedCategory && (
          <div className="space-y-6">
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <span className="detail-label">Category ID</span>
                <span className="detail-value">#{selectedCategory.categoryPaperId}</span>
              </Col>
              <Col span={12}>
                <span className="detail-label">Paper Type</span>
                <Tag color={paperTypeColors[selectedCategory.paperType]} className="!rounded-lg px-3 py-1 font-semibold">
                  {selectedCategory.paperType}
                </Tag>
              </Col>
              <Col span={24}>
                <span className="detail-label">Category Name</span>
                <span className="detail-value text-xl font-bold">{selectedCategory.name}</span>
              </Col>
              <Col span={12}>
                <span className="detail-label">Created At</span>
                <span className="detail-value text-sm">{formatDate(selectedCategory.createdAt)}</span>
              </Col>
              <Col span={12}>
                <span className="detail-label">Last Updated</span>
                <span className="detail-value text-sm">{formatDate(selectedCategory.updatedAt)}</span>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* --- Template Modals --- */}
      <Modal
        title={<Title level={4} className="!m-0 !text-white">Create Paper Template</Title>}
        open={createTplModalVisible}
        onCancel={() => {
          setCreateTplModalVisible(false);
          templateForm.resetFields();
        }}
        onOk={handleCreateTpl}
        confirmLoading={loading}
        width={600}
        className="glass-modal"
        okButtonProps={{ className: "gradient-btn" }}
      >
        <Form layout="vertical" form={templateForm}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter a name" }]}
              >
                <Input placeholder="Enter template name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Paper Size"
                name="paperSize"
                rules={[{ required: true, message: "Please select a size" }]}
              >
                <Select placeholder="Select size">
                  {paperSizeOptions.map((o) => (
                    <Select.Option key={o.value} value={o.value}>
                      {o.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Category"
            name="categoryPaperId"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select category">
              {categories
                .filter(c => {
                  if (activeTab === "paper_template") return paperTemplateCategories.includes(c.name);
                  if (activeTab === "cover_template") return coverTemplateCategories.includes(c.name);
                  return true;
                })
                .map((c) => (
                  <Select.Option key={c.categoryPaperId} value={c.categoryPaperId}>
                    {c.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Template Image"
            name="imageUrl"
            rules={[{ required: true, message: "Please upload an image" }]}
          >
            <ImageUploader
              onImageUploaded={(images) => {
                if (images && images.length > 0) {
                  templateForm.setFieldsValue({ imageUrl: images[0].imageUrl });
                }
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Title level={4} className="!m-0 !text-white">Edit Paper Template</Title>}
        open={editTplModalVisible}
        onCancel={() => {
          setEditTplModalVisible(false);
          templateForm.resetFields();
        }}
        onOk={handleEditTpl}
        confirmLoading={loading}
        width={600}
        className="glass-modal"
        okButtonProps={{ className: "gradient-btn" }}
      >
        <Form layout="vertical" form={templateForm}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter a name" }]}
              >
                <Input placeholder="Enter template name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Paper Size"
                name="paperSize"
                rules={[{ required: true, message: "Please select a size" }]}
              >
                <Select placeholder="Select size">
                  {paperSizeOptions.map((o) => (
                    <Select.Option key={o.value} value={o.value}>
                      {o.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Category"
            name="categoryPaperId"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select category">
              {categories.map((c) => (
                <Select.Option key={c.categoryPaperId} value={c.categoryPaperId}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Template Image"
            name="imageUrl"
            rules={[{ required: true, message: "Please upload an image" }]}
          >
            <div className="space-y-2">
              {templateForm.getFieldValue("imageUrl") && (
                <Image
                  src={templateForm.getFieldValue("imageUrl")}
                  width={120}
                  height={90}
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />
              )}
              <ImageUploader
                onImageUploaded={(images) => {
                  if (images && images.length > 0) {
                    templateForm.setFieldsValue({ imageUrl: images[0].imageUrl });
                  }
                }}
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Title level={4} className="!m-0 !text-white">Template Details</Title>}
        open={viewTplModalVisible}
        onCancel={() => setViewTplModalVisible(false)}
        className="glass-modal"
        footer={[
          <Button key="close" onClick={() => setViewTplModalVisible(false)} className="rounded-xl px-6">
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedTemplate && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="image-preview-container">
              <Image
                src={selectedTemplate.imageUrl}
                width="100%"
                className="hover:scale-105 transition-transform duration-500"
                fallback="https://placehold.co/400x300?text=No+Image"
              />
            </div>
            <div className="space-y-8 py-2">
              <div>
                <span className="detail-label">Template Name</span>
                <Title level={3} className="!m-0 !text-slate-800">
                  {selectedTemplate.name}
                </Title>
              </div>

              <Row gutter={[16, 24]}>
                <Col span={12}>
                  <span className="detail-label">Category</span>
                  <Tag color="blue" className="!rounded-lg px-4 py-1 font-bold text-sm">
                    {selectedTemplate.categoryPaperName}
                  </Tag>
                </Col>
                <Col span={12}>
                  <span className="detail-label">Paper Size</span>
                  <Tag
                    color={paperSizeColors[selectedTemplate.paperSize]}
                    className="!rounded-lg px-4 py-1 font-bold text-sm"
                  >
                    {selectedTemplate.paperSize}
                  </Tag>
                </Col>
                <Col span={12}>
                  <span className="detail-label">Created At</span>
                  <Text className="detail-value text-sm">{formatDate(selectedTemplate.createdAt)}</Text>
                </Col>
                <Col span={12}>
                  <span className="detail-label">Last Updated</span>
                  <Text className="detail-value text-sm">{formatDate(selectedTemplate.updatedAt)}</Text>
                </Col>
              </Row>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-4">
                <Text className="text-slate-500 text-xs italic">
                  * This template is available for all designers in the {selectedTemplate.categoryPaperName} category.
                </Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
