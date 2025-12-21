import React, { useEffect, useState } from "react";
import { Card, Table, Form, Input, Select, Button, message, Modal, Descriptions, Tag } from "antd";
import { dashboardAminService } from "../../service/dashboardAdminService";

const CreditTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();

  const normalizeResult = (result) => {
    if (!result) return { items: [], total: 0 };
    if (Array.isArray(result)) return { items: result, total: result.length };
    if (result.content) return { items: result.content, total: result.totalElements || result.total || result.content.length };
    if (result.items) return { items: result.items, total: result.total || result.items.length };
    return { items: Array.isArray(result) ? result : [result], total: Array.isArray(result) ? result.length : 1 };
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      render: (_, __, index) => {
        const { current, pageSize } = pagination;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: "User Email",
      dataIndex: "userEmail",
      key: "userEmail",
      ellipsis: true,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => <span style={{ fontWeight: 500 }}>{type}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span style={{ color: amount > 0 ? "green" : "red" }}>
          {amount?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Balance After",
      dataIndex: "balanceAfter",
      key: "balanceAfter",
      render: (balance) => balance?.toLocaleString(),
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => (
    //     <span
    //       style={{
    //         color: status === "SUCCESS" ? "green" : status === "PENDING" ? "orange" : "red",
    //       }}
    //     >
    //       {status}
    //     </span>
    //   ),
    // },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    //   ellipsis: true,
    // },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button
          style={{ background: "#eeea15ff", color: "black" }}
          onClick={() => handleViewDetail(record)}
        >
          View
        </Button>

      ),
    },
  ];

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const res = await dashboardAminService.getAllCreditTransactions(
        values.search || "",
        values.type,
        page - 1,
        pageSize,
        "createdAt",
        "DESC"
      );
      const { items, total } = normalizeResult(res);
      console.log(items)
      setData(items);
      setPagination((p) => ({ ...p, current: page, pageSize, total }));
    } catch (err) {
      message.error(err.message || "Failed to load credit transactions");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(1, 10);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Form.Item name="search" label="Search">
            <Input placeholder="Search..." style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="type" label="Type">
            <Select
              placeholder="All Types"
              allowClear
              style={{ width: 200 }}
              options={[
                { label: "Purchase", value: "PURCHASE" },
                { label: "Refund", value: "REFUND" },
                { label: "Bonus", value: "BONUS" },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => fetchData(1, pagination.pageSize)}>Search</Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(r, i) => r.id || r.transactionId || i}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
          }}
          onChange={(pag) => fetchData(pag.current, pag.pageSize)}
          scroll={{ x: "max-content" }}
        />
      </Card>

      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedRecord && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* Transaction Information Section */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom: '2px solid #1890ff',
                color: '#1890ff'
              }}>
                Transaction Information
              </h3>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Transaction Type">
                  <Tag color="blue">{selectedRecord.type}</Tag>
                </Descriptions.Item>
                {selectedRecord.createdAt && (
                  <Descriptions.Item label="Transaction Date">
                    {new Date(selectedRecord.createdAt).toLocaleString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>

            {/* User Information Section */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom: '2px solid #52c41a',
                color: '#52c41a'
              }}>
                User Information
              </h3>
              <Descriptions bordered column={1} size="small">
                {selectedRecord.userEmail && (
                  <Descriptions.Item label="Email">
                    {selectedRecord.userEmail}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>

            {/* Credit Details Section */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom: '2px solid #fa8c16',
                color: '#fa8c16'
              }}>
                Credit Details
              </h3>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Amount">
                  <span style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: (selectedRecord.amount || 0) > 0 ? '#52c41a' : '#f5222d'
                  }}>
                    {(selectedRecord.amount || 0) > 0 ? '+' : ''}
                    {(selectedRecord.amount || 0).toLocaleString()} credits
                  </span>
                </Descriptions.Item>
                {selectedRecord.balanceBefore !== null && selectedRecord.balanceBefore !== undefined && (
                  <Descriptions.Item label="Balance Before">
                    {(selectedRecord.balanceBefore || 0).toLocaleString()} credits
                  </Descriptions.Item>
                )}
                {selectedRecord.balanceAfter !== null && selectedRecord.balanceAfter !== undefined && (
                  <Descriptions.Item label="Balance After">
                    <span style={{ fontWeight: 600 }}>
                      {(selectedRecord.balanceAfter || 0).toLocaleString()} credits
                    </span>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>

            {/* Additional Information Section */}
            {selectedRecord.description && (
              <div>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 16,
                  paddingBottom: 8,
                  borderBottom: '2px solid #722ed1',
                  color: '#722ed1'
                }}>
                  Additional Information
                </h3>
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Description">
                    {selectedRecord.description.replace(/null/g, "đ")}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CreditTransactions;
