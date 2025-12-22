import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Tag,
  Popconfirm,
  Card,
  message,
  Checkbox,
  Row,
  Col,
  Divider,
  Descriptions,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { subscriptionService } from "../../service/subscriptionService";

const SubscriptionPackages = () => {
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getSubscriptionPlans();
  }, []);

  const getSubscriptionPlans = async () => {
    try {
      const res = await subscriptionService.getAllSubscriptions();
      setPackages(res);
    } catch (error) {
      message.error("Failed to load subscription plans");
    }
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await subscriptionService.deleteSubscription(id);
      message.success("Deleted successfully");
      getSubscriptionPlans();
    } catch (error) {
      message.error(error.message || "Delete failed");
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    try {
      if (editing) {
        await subscriptionService.updateSubscription(editing.planId, values);
        message.success("Updated successfully");
      } else {
        await subscriptionService.createSubscription(values);
        message.success("Created successfully");
      }
      setIsModalOpen(false);
      getSubscriptionPlans();
    } catch (error) {
      message.error(error.message || "Save failed");
    }
  };

  const openDetailModal = (record) => {
    setDetailData(record);
    setIsDetailModal(true);
  };

  const columns = [
    {
      title: "Plan",
      dataIndex: "planName",
      width: 150,
      render: (text, r) => (
        <div className="font-semibold">
          {text}
          <div className="text-xs text-gray-500">{r.description}</div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "planType",
      width: 100,
      render: (text) => (
        <Tag color={text === "DESIGNER" ? "purple" : "gold"}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Price",
      width: 120,
      render: (_, r) => (
        <b className=" text-orange-600">{r.price.toLocaleString()} {r.currency}</b>
      ),
    },
    {
      title: "Duration",
      dataIndex: "durationDays",
      width: 90,
      render: (d) => `${d} days`,
    },
    {
      title: "Actions",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => openDetailModal(record)}>
            View
          </Button>

          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Delete this plan?"
            onConfirm={() => handleDelete(record.planId)}
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>

      <Card className="shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold mb-6">Subscription Packages</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Subscription
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={packages}
          rowKey="planId"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 700 }}
          size="small"
        />
      </Card>

      {/* EDIT / CREATE FORM */}
      <Modal
        title={editing ? "Edit Plan" : "Add New Plan"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText={editing ? "Update" : "Create"}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="planName" label="Plan Name" rules={[{ required: true }]}>
            <Input placeholder="Customer Pro - Monthly" />
          </Form.Item>

          <Form.Item name="planType" label="Plan Type" rules={[{ required: true }]}>
            <Input placeholder="CUSTOMER_PRO / DESIGNER" />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber
              className="w-full"
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          <Form.Item name="currency" label="Currency" rules={[{ required: true }]}>
            <Input placeholder="VND / USD" />
          </Form.Item>

          <Form.Item
            name="durationDays"
            label="Duration (days)"
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" min={1} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="active" label="Active">
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>

      {/* DETAIL MODAL */}
      <Modal
        open={isDetailModal}
        footer={[
          <Button key="close" onClick={() => setIsDetailModal(false)}>
            Close
          </Button>,
        ]}
        onCancel={() => setIsDetailModal(false)}
        width={700}
      >
        {detailData && (
          <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            {/* Plan Information Section */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom: '2px solid #1890ff',
                color: '#1890ff'
              }}>
                Plan Information
              </h3>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Plan Name">
                  <span style={{ fontWeight: 600 }}>
                    {detailData.planName}
                  </span>
                </Descriptions.Item>
                {detailData.description && (
                  <Descriptions.Item label="Description">
                    {detailData.description}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Plan Type">
                  <Tag color={detailData.planType === "DESIGNER" ? "purple" : "gold"}>
                    {detailData.planType}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Duration">
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#1677ff' }}>
                    {detailData.durationDays} days
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Published Date">
                  {new Date(detailData.createdAt).toLocaleDateString('vi-VN')}
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* Pricing Details Section */}
            <div>
              <h3 style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom: '2px solid #52c41a',
                color: '#52c41a'
              }}>
                Pricing Details
              </h3>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Price">
                  <span style={{ fontSize: 18, fontWeight: 'bold', color: '#52c41a' }}>
                    {detailData.price.toLocaleString()} {detailData.currency}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Currency">
                  {detailData.currency}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubscriptionPackages;
