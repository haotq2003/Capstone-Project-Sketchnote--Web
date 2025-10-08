import React, { useState } from "react";
import {
  Table,
  Typography,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Descriptions,
  Card,
  Statistic,
  Row,
  Col,
  Divider,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { TextArea } = Input;

// Mock data
const withdrawalRequests = [
  {
    id: 1,
    user: "John Doe",
    amount: 250,
    date: "2023-10-15",
    status: "pending",
    accountInfo: "Bank: ABC Bank, Acc: 123456789",
  },
  {
    id: 2,
    user: "Jane Smith",
    amount: 500,
    date: "2023-10-14",
    status: "approved",
    accountInfo: "Bank: XYZ Bank, Acc: 987654321",
  },
  {
    id: 3,
    user: "Mike Johnson",
    amount: 150,
    date: "2023-10-13",
    status: "rejected",
    accountInfo: "PayPal: mike@example.com",
  },
  {
    id: 4,
    user: "Sarah Williams",
    amount: 300,
    date: "2023-10-12",
    status: "pending",
    accountInfo: "Bank: DEF Bank, Acc: 456789123",
  },
  {
    id: 5,
    user: "David Brown",
    amount: 450,
    date: "2023-10-11",
    status: "approved",
    accountInfo: "Bank: GHI Bank, Acc: 789123456",
  },
];

const WithdrawalManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [form] = Form.useForm();

  const showModal = (record) => {
    setSelectedRequest(record);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleApprove = () => {
    form.validateFields().then((values) => {
      console.log(
        "Approved request:",
        selectedRequest.id,
        "with note:",
        values.note
      );
      setIsModalVisible(false);
    });
  };

  const handleReject = () => {
    form.validateFields().then((values) => {
      console.log(
        "Rejected request:",
        selectedRequest.id,
        "with note:",
        values.note
      );
      setIsModalVisible(false);
    });
  };

  const getStatusTag = (status) => {
    let color, icon;
    switch (status) {
      case "pending":
        color = "gold";
        icon = <ClockCircleOutlined />;
        break;
      case "approved":
        color = "green";
        icon = <CheckCircleOutlined />;
        break;
      case "rejected":
        color = "red";
        icon = <CloseCircleOutlined />;
        break;
      default:
        color = "default";
        icon = null;
    }
    return (
      <Tag color={color} icon={icon}>
        {status.toUpperCase()}
      </Tag>
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <Text>${amount}</Text>,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Approved", value: "approved" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => showModal(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  // Calculate statistics
  const totalRequests = withdrawalRequests.length;
  const pendingRequests = withdrawalRequests.filter(
    (req) => req.status === "pending"
  ).length;
  const totalAmount = withdrawalRequests.reduce(
    (sum, req) => sum + req.amount,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Withdrawal Request Management
      </h1>

      {/* Stats Section */}
      <div className="mb-6">
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Requests"
                value={totalRequests}
                prefix={<DollarOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Pending Requests"
                value={pendingRequests}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Amount"
                value={totalAmount}
                prefix="$"
                precision={2}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Table */}
      <Card title="Withdrawal Requests" bordered={false}>
        <Table
          columns={columns}
          dataSource={withdrawalRequests}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title="Withdrawal Request Details"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        {selectedRequest && (
          <>
            <Card className="mb-4">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="ID">
                  {selectedRequest.id}
                </Descriptions.Item>
                <Descriptions.Item label="User">
                  {selectedRequest.user}
                </Descriptions.Item>
                <Descriptions.Item label="Amount">
                  ${selectedRequest.amount}
                </Descriptions.Item>
                <Descriptions.Item label="Date">
                  {selectedRequest.date}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {getStatusTag(selectedRequest.status)}
                </Descriptions.Item>
                <Descriptions.Item label="Account Info">
                  {selectedRequest.accountInfo}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Form form={form} layout="vertical">
              <Form.Item
                name="note"
                label="Note"
                rules={[{ required: true, message: "Please add a note" }]}
              >
                <TextArea rows={4} placeholder="Add your note here..." />
              </Form.Item>
            </Form>

            <Divider />

            <div className="flex justify-end gap-2">
              <Button onClick={handleCancel}>Cancel</Button>

              {selectedRequest.status === "pending" && (
                <>
                  <Button
                    danger
                    onClick={handleReject}
                    icon={<CloseCircleOutlined />}
                  >
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleApprove}
                    icon={<CheckCircleOutlined />}
                  >
                    Approve
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default WithdrawalManagement;
