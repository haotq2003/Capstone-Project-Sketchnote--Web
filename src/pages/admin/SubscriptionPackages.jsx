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
  Checkbox
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
      render: (text) => (
        <Tag color={text === "DESIGNER" ? "purple" : "gold"}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Price",
      render: (_, r) => (
        <b>{r.price.toLocaleString()} {r.currency}</b>
      ),
    },
    {
      title: "Duration",
      dataIndex: "durationDays",
      render: (d) => `${d} days`,
    },
    {
      title: "Actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => openDetailModal(record)}>
            View
          </Button>

          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Delete this plan?"
            onConfirm={() => handleDelete(record.planId)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
         

            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Plan
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={packages}
            rowKey="planId"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>

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
        title="Subscription Plan Details"
        open={isDetailModal}
        footer={null}
        onCancel={() => setIsDetailModal(false)}
      >
        {detailData && (
          <div className="space-y-3 text-[15px]">
            <div>
              <p className="text-gray-500">Plan Name</p>
              <p className="font-semibold">{detailData.planName}</p>
            </div>

            <div>
              <p className="text-gray-500">Plan Type</p>
              <Tag color={detailData.planType === "DESIGNER" ? "purple" : "gold"}>
                {detailData.planType}
              </Tag>
            </div>

            <div>
              <p className="text-gray-500">Price</p>
              <p className="font-semibold">
                {detailData.price.toLocaleString()} {detailData.currency}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Duration</p>
              <p>{detailData.durationDays} days</p>
            </div>

            <div>
              <p className="text-gray-500">Description</p>
              <p>{detailData.description || "No description"}</p>
            </div>

            <div>
              <p className="text-gray-500">Created At</p>
              <p>{new Date(detailData.createdAt).toLocaleString()}</p>
            </div>

            <div>
              <p className="text-gray-500">Updated At</p>
              <p>{new Date(detailData.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubscriptionPackages;
