import React, { useEffect, useState } from "react";
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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { paperTemplateService } from "../../service/paperTemplateService";

const { Search } = Input;
const { Text } = Typography;

export default function ResourceTemplate() {
  const [activeTab, setActiveTab] = useState("category");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterPaperType, setFilterPaperType] = useState("");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form] = Form.useForm();

  // Paper type options based on API documentation
  const paperTypeOptions = [
    { label: "Cover", value: "COVER" },
    { label: "Paper", value: "PAPER" },
  ];

  const paperTypeColors = {
    COVER: "blue",
    PAPER: "green",
  };

  // Fetch category papers
  const fetchCategories = async (p = page, s = size) => {
    try {
      setLoading(true);
      const res = await paperTemplateService.getCategoryPapers(
        filterPaperType,
        searchKeyword,
        p - 1,
        s
      );
      setCategories(res.content || []);
      setTotal(res.totalElements || 0);
    } catch (error) {
      message.error(error.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "category") {
      fetchCategories(page, size);
    }
  }, [page, size, filterPaperType, searchKeyword, activeTab]);

  // Format date
  const formatDate = (value) =>
    value ? new Date(value).toLocaleString("en-US") : "-";

  // Handle create category
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await paperTemplateService.createCategoryPaper(values);
      message.success("Category created successfully!");
      setCreateModalVisible(false);
      form.resetFields();
      fetchCategories(1, size);
      setPage(1);
    } catch (error) {
      if (error.errorFields) {
        return; // Form validation error
      }
      message.error(error.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit category
  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await paperTemplateService.updateCategoryPaper(
        selectedCategory.categoryPaperId,
        values
      );
      message.success("Category updated successfully!");
      setEditModalVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      if (error.errorFields) {
        return; // Form validation error
      }
      message.error(error.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete category
  const handleDelete = (record) => {
    Modal.confirm({
      title: "Delete confirmation",
      content: `Are you sure you want to delete "${record.name}"?`,
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setLoading(true);
          await paperTemplateService.deleteCategoryPaper(
            record.categoryPaperId
          );
          message.success("Category deleted successfully!");
          fetchCategories();
        } catch (error) {
          message.error(error.message || "Failed to delete category");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Handle view category
  const handleView = (record) => {
    setSelectedCategory(record);
    setViewModalVisible(true);
  };

  // Open edit modal
  const openEditModal = (record) => {
    setSelectedCategory(record);
    form.setFieldsValue({
      paperType: record.paperType,
      name: record.name,
    });
    setEditModalVisible(true);
  };

  // Table columns
  const columns = [
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
      width: 200,
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
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: (d) => formatDate(d),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
      width: 260,
    },
  ];

  // Category Page content
  const categoryPageContent = (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Search
          placeholder="Search by keyword..."
          allowClear
          className="flex-1 min-w-0"
          onChange={(e) => setSearchKeyword(e.target.value)}
          prefix={<SearchOutlined />}
        />

        <Select
          placeholder="Filter by paper type"
          allowClear
          className="w-full sm:w-48"
          value={filterPaperType || undefined}
          onChange={(value) => setFilterPaperType(value || "")}
        >
          {paperTypeOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          Create Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="categoryPaperId"
        pagination={{
          current: page,
          pageSize: size,
          total,
          onChange: (p, s) => {
            setPage(p);
            setSize(s);
          },
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        loading={loading}
        size="middle"
      />
    </div>
  );

  // Paper Template placeholder content
  const paperTemplateContent = (
    <div className="flex items-center justify-center h-64">
      <Text type="secondary" style={{ fontSize: 18 }}>
        Paper Template section coming soon...
      </Text>
    </div>
  );

  // Tab items
  const tabItems = [
    {
      key: "category",
      label: "Category Page",
      children: categoryPageContent,
    },
    {
      key: "template",
      label: "Paper Template",
      children: paperTemplateContent,
    },
  ];

  return (
    <div className="p-6">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />

      {/* Create Category Modal */}
      <Modal
        title="Create Category"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        onOk={handleCreate}
        confirmLoading={loading}
        okText="Create"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Paper Type"
            name="paperType"
            rules={[{ required: true, message: "Please select a paper type" }]}
          >
            <Select placeholder="Select paper type">
              {paperTypeOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        title="Edit Category"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        onOk={handleEdit}
        confirmLoading={loading}
        okText="Update"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Paper Type"
            name="paperType"
            rules={[{ required: true, message: "Please select a paper type" }]}
          >
            <Select placeholder="Select paper type">
              {paperTypeOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Category Modal */}
      <Modal
        title="Category Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedCategory && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text type="secondary">ID</Text>
                <p className="text-base font-semibold">
                  {selectedCategory.categoryPaperId}
                </p>
              </div>
              <div>
                <Text type="secondary">Name</Text>
                <p className="text-base font-semibold">
                  {selectedCategory.name}
                </p>
              </div>
              <div>
                <Text type="secondary">Paper Type</Text>
                <div className="mt-1">
                  <Tag
                    color={
                      paperTypeColors[selectedCategory.paperType] || "default"
                    }
                  >
                    {selectedCategory.paperType || "N/A"}
                  </Tag>
                </div>
              </div>
              <div>
                <Text type="secondary">Created At</Text>
                <p className="text-base font-semibold">
                  {formatDate(selectedCategory.createdAt)}
                </p>
              </div>
              <div>
                <Text type="secondary">Updated At</Text>
                <p className="text-base font-semibold">
                  {formatDate(selectedCategory.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
