import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Space,
  Tag,
  Card,
  Row,
  Col,
  message,
  Popconfirm,
  Divider,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { creditService } from "../../service/creditService";

const AdminCreditPackages = () => {
  const [creditPackages, setCreditPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [editingPackage, setEditingPackage] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [form] = Form.useForm();

  const fetchCreditPackages = async () => {
    setLoading(true);
    try {
      const data = await creditService.getAllCreditPackages();
      console.log("Credit Packages:", data);
      setCreditPackages(data);
    } catch (err) {
      message.error("Failed to load credit packages");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCreditPackages();
  }, []);

  const showDetail = (record) => {
    setSelectedPackage(record);
    setDetailOpen(true);
  };

  const handleAdd = () => {
    setEditingPackage(null);
    form.resetFields();
    // Set default values
    form.setFieldsValue({
      isActive: true,
      isPopular: false,
      displayOrder: creditPackages.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingPackage(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      creditAmount: record.creditAmount,
      originalPrice: record.originalPrice,
      discountedPrice: record.discountedPrice,
      isActive: record.isActive,
      isPopular: record.isPopular,
      displayOrder: record.displayOrder,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (record) => {
    try {
      await creditService.activeCreditPackage(record.id);
      message.success(`Package ${record.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchCreditPackages();
    } catch (err) {
      message.error(err.message || "Failed to update status");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await creditService.deleteCreditPackage(id);
      message.success("Package deleted successfully");
      fetchCreditPackages();
    } catch (err) {
      message.error(err.message || "Failed to delete package");
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Prepare body theo format BE yêu cầu
      const body = {
        name: values.name,
        description: values.description,
        creditAmount: values.creditAmount,
        originalPrice: values.originalPrice,
        discountedPrice: values.discountedPrice,
        isActive: values.isActive ?? true,
        isPopular: values.isPopular ?? false,
        displayOrder: values.displayOrder,
      };

      if (editingPackage) {
        // Update
        await creditService.updateCreditPackage(editingPackage.id, body);
        message.success("Package updated successfully");
      } else {
        // Create
        await creditService.createCreditPackage(body);
        message.success("Package created successfully");
      }

      setIsModalOpen(false);
      form.resetFields();
      fetchCreditPackages();
    } catch (err) {
      message.error(err.message || "Failed to save package");
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
    },
    {
      title: "Package Name",
      dataIndex: "name",
      key: "name",
      width: 130,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{text}</div>
          {record.isPopular && (
            <Tag color="gold" style={{ fontSize: 10 }}>
              ⭐ POPULAR
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Credit Amount",
      dataIndex: "creditAmount",
      key: "creditAmount",
      width: 100,
      align: "right",
      render: (value) => (
        <span style={{ fontWeight: 600, color: "#1677ff" }}>
          {value?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Original Price",
      dataIndex: "originalPrice",
      key: "originalPrice",
      width: 110,
      align: "right",
      render: (value) => (
        <span style={{ color: "#e72828ff" }}>
          {value?.toLocaleString()} đ
        </span>
      ),
    },
    {
      title: "Discount %",
      dataIndex: "discountPercent",
      key: "discountPercent",
      width: 90,
      align: "center",
      render: (value) => <Tag color="blue">{value}%</Tag>,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 90,
      align: "center",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"} icon={isActive ? <CheckCircleOutlined /> : <StopOutlined />}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
            title="View Details"
          />

          <Button
            size="small"
            type={record.isActive ? "default" : "primary"}
            icon={record.isActive ? <StopOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleToggleActive(record)}
            title={record.isActive ? "Deactivate" : "Activate"}
          >
            {record.isActive ? "Deactivate" : "Activate"}
          </Button>

          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Edit"
          />

          <Popconfirm
            title="Delete this package?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteOutlined />} title="Delete" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Statistics
  const stats = {
    total: creditPackages.length,
    active: creditPackages.filter((p) => p.isActive).length,
    popular: creditPackages.filter((p) => p.isPopular).length,
  };

  return (
    <div style={{ padding: 24, overflowX: "hidden" }}>
      <div style={{ maxWidth: "100%", margin: "0 auto" }}>
        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Packages"
                value={stats.total}
                valueStyle={{ color: "#1677ff" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Active Packages"
                value={stats.active}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Popular Packages"
                value={stats.popular}
                valueStyle={{ color: "#faad14" }}
                prefix={<span>⭐</span>}
              />
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Card
          title={<span style={{ fontSize: 18, fontWeight: 600 }}>Credit Packages Management</span>}
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Package
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={creditPackages}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} packages` }}
            scroll={{ x: 900 }}
            size="small"
          />
        </Card>

        {/* Detail Modal */}
        <Modal
          title={<span style={{ fontSize: 18, fontWeight: 600 }}>Package Details</span>}
          open={detailOpen}
          onCancel={() => setDetailOpen(false)}
          footer={[
            <Button key="close" onClick={() => setDetailOpen(false)}>
              Close
            </Button>,
          ]}
          width={600}
        >
          {selectedPackage && (
            <div style={{ lineHeight: 2 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <strong>ID:</strong> {selectedPackage.id}
                </Col>
                <Col span={12}>
                  <strong>Display Order:</strong> {selectedPackage.displayOrder}
                </Col>
                <Col span={24}>
                  <strong>Name:</strong> {selectedPackage.name}
                  {selectedPackage.isPopular && (
                    <Tag color="gold" style={{ marginLeft: 8 }}>
                      ⭐ POPULAR
                    </Tag>
                  )}
                </Col>
                <Col span={24}>
                  <strong>Description:</strong> {selectedPackage.description || "N/A"}
                </Col>
                <Col span={12}>
                  <strong>Credit Amount:</strong>{" "}
                  <span style={{ color: "#1677ff", fontWeight: 600 }}>
                    {selectedPackage.creditAmount?.toLocaleString()}
                  </span>
                </Col>
                <Col span={12}>
                  <strong>Price per Credit:</strong> {selectedPackage.pricePerCredit?.toLocaleString()} đ
                </Col>
                <Col span={12}>
                  <strong>Original Price:</strong>{" "}
                  <span >
                    {selectedPackage.originalPrice?.toLocaleString()} đ
                  </span>
                </Col>
                <Col span={12}>
                  <strong>Discounted Price:</strong>{" "}
                  <span style={{ color: "#52c41a", fontWeight: 600, fontSize: 16 }}>
                    {selectedPackage.discountedPrice?.toLocaleString()} đ
                  </span>
                </Col>
                <Col span={12}>
                  <strong>Discount Percent:</strong>{" "}
                  <Tag color="blue">{selectedPackage.discountPercent}%</Tag>
                </Col>
                <Col span={12}>
                  <strong>Savings Amount:</strong>{" "}
                  <Tag color="green">-{selectedPackage.savingsAmount?.toLocaleString()} đ</Tag>
                </Col>
                <Col span={12}>
                  <strong>Status:</strong>{" "}
                  <Tag color={selectedPackage.isActive ? "green" : "red"}>
                    {selectedPackage.isActive ? "Active" : "Inactive"}
                  </Tag>
                </Col>
                <Col span={12}>
                  <strong>Currency:</strong> {selectedPackage.currency || "VND"}
                </Col>
              </Row>

              <Divider />

              <Row gutter={[16, 8]}>
                <Col span={24}>
                  <strong>Created At:</strong> {formatDate(selectedPackage.createdAt)}
                </Col>
                <Col span={24}>
                  <strong>Updated At:</strong> {formatDate(selectedPackage.updatedAt)}
                </Col>
              </Row>
            </div>
          )}
        </Modal>

        {/* Add/Edit Modal */}
        <Modal
          title={editingPackage ? "Edit Package" : "Add New Package"}
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          width={600}
          okText={editingPackage ? "Update" : "Create"}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Package Name" rules={[{ required: true, message: "Please enter package name" }]}>
              <Input placeholder="e.g., PREMIUM, POPULAR" />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Input.TextArea rows={2} placeholder="Package description" />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="creditAmount" label="Credit Amount" rules={[{ required: true }]}>
                  <InputNumber min={1} className="w-full" placeholder="100" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="displayOrder" label="Display Order" rules={[{ required: true }]}>
                  <InputNumber min={1} className="w-full" placeholder="1" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="originalPrice" label="Original Price (đ)" rules={[{ required: true }]}>
                  <InputNumber min={0} className="w-full" placeholder="100000" />
                </Form.Item>
              </Col>

            </Row>

            <Form.Item name="discountedPrice" label="Discounted Price (đ)" rules={[{ required: true }]}>
              <InputNumber min={0} className="w-full" placeholder="90000" />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="isPopular" label="Mark as Popular" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="isActive" label="Active Status" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminCreditPackages;
