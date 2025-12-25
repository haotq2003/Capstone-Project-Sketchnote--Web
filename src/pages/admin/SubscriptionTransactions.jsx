import React, { useEffect, useState } from "react";
import { Card, Table, Form, Input, Select, Button, message, Modal, Descriptions, Tag } from "antd";
import { dashboardAminService } from "../../service/dashboardAdminService";

const SubscriptionTransactions = () => {
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
      title: "Plan",
      dataIndex: "planName",
      key: "planName",
      render: (plan) => <Tag color="purple">{plan}</Tag>,
    },
    {
      title: "Amount",
      dataIndex: "price",
      key: "price",
      render: (amount) => (
        <span style={{ fontWeight: "bold", color: "orange" }}>
          {amount?.toLocaleString()} đ
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "ACTIVE") color = "success";
        else if (status === "EXPIRED") color = "error";
        else if (status === "PENDING") color = "warning";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => date ? new Date(date).toLocaleDateString() : "-",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
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
      const res = await dashboardAminService.getAllSubscriptionsTransaction(
        values.search || "",
        values.status,
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
      message.error(err.message || "Failed to load subscription transactions");
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
          <Form.Item name="status" label="Status">
            <Select
              placeholder="All Status"
              allowClear
              style={{ width: 150 }}
              options={[
                { label: "Active", value: "ACTIVE" },
                { label: "Expired", value: "EXPIRED" },
                { label: "Pending", value: "PENDING" },
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
        width={600}
      >
        {selectedRecord && (
          <div>
            {/* Subscription Information */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '2px solid #1890ff',
                color: '#1890ff'
              }}>
                Subscription Information
              </h3>
              <Descriptions
                bordered
                column={1}
                size="middle"
                labelStyle={{ width: '180px', fontWeight: 500 }}
              >
                {selectedRecord.planName && (
                  <Descriptions.Item label="Plan">
                    <Tag color="purple" style={{ fontSize: 14, padding: '4px 12px', margin: 0 }}>
                      {selectedRecord.planName}
                    </Tag>
                  </Descriptions.Item>
                )}

                <Descriptions.Item label="Status">
                  {(() => {
                    let color = "default";
                    if (selectedRecord.status === "ACTIVE") color = "success";
                    else if (selectedRecord.status === "EXPIRED") color = "error";
                    else if (selectedRecord.status === "PENDING") color = "warning";
                    return <Tag color={color}>{selectedRecord.status}</Tag>;
                  })()}
                </Descriptions.Item>

                {selectedRecord.userEmail && (
                  <Descriptions.Item label="User Email">
                    {selectedRecord.userEmail}
                  </Descriptions.Item>
                )}

                <Descriptions.Item label="Price">
                  <span style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#52c41a'
                  }}>
                    {(selectedRecord.price || 0).toLocaleString()} đ
                  </span>
                </Descriptions.Item>

                {selectedRecord.description && (
                  <Descriptions.Item label="Description">
                    {selectedRecord.description}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>

            {/* Subscription Period */}
            <div>
              <h3 style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '2px solid #13c2c2',
                color: '#13c2c2'
              }}>
                Subscription Period
              </h3>
              <Descriptions
                bordered
                column={1}
                size="middle"
                labelStyle={{ width: '180px', fontWeight: 500 }}
              >
                {selectedRecord.createdAt && (
                  <Descriptions.Item label="Start Date">
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

                {selectedRecord.endDate && (
                  <Descriptions.Item label="End Date">
                    {new Date(selectedRecord.endDate).toLocaleString('vi-VN', {
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
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubscriptionTransactions;
