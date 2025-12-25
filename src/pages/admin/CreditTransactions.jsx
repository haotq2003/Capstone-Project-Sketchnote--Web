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
        title={<span style={{ color: '#1890ff', fontWeight: 600 }}>Credit Transaction Details</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={500}
      >
        {selectedRecord && (
          <div>
            {/* Amount Highlight Card */}
            <div style={{
              background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
              textAlign: 'center',
              border: '1px solid #b7eb8f'
            }}>
              <div style={{ color: '#389e0d', fontSize: 13, marginBottom: 4 }}>Amount</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#52c41a' }}>
                +{Math.abs(selectedRecord.amount || 0).toLocaleString()} credits
              </div>
            </div>

            {/* Info Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fafafa', borderRadius: 8 }}>
                <span style={{ color: '#8c8c8c' }}>Type</span>
                <Tag color="blue" style={{ margin: 0 }}>{selectedRecord.type}</Tag>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fafafa', borderRadius: 8 }}>
                <span style={{ color: '#8c8c8c' }}>User Email</span>
                <span style={{ fontWeight: 500 }}>{selectedRecord.userEmail || "-"}</span>
              </div>

              {selectedRecord.balanceBefore !== null && selectedRecord.balanceBefore !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fafafa', borderRadius: 8 }}>
                  <span style={{ color: '#8c8c8c' }}>Balance Before</span>
                  <span style={{ color: '#fa8c16' }}>{(selectedRecord.balanceBefore || 0).toLocaleString()} credits</span>
                </div>
              )}

              {selectedRecord.balanceAfter !== null && selectedRecord.balanceAfter !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fafafa', borderRadius: 8 }}>
                  <span style={{ color: '#8c8c8c' }}>Balance After</span>
                  <span style={{ fontWeight: 600, color: '#1890ff' }}>{(selectedRecord.balanceAfter || 0).toLocaleString()} credits</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fafafa', borderRadius: 8 }}>
                <span style={{ color: '#8c8c8c' }}>Date</span>
                <span>{selectedRecord.createdAt ? new Date(selectedRecord.createdAt).toLocaleString('vi-VN', {
                  year: 'numeric', month: '2-digit', day: '2-digit',
                  hour: '2-digit', minute: '2-digit', second: '2-digit'
                }) : "-"}</span>
              </div>

              {selectedRecord.description && (
                <div style={{ padding: '12px', background: '#f0f5ff', borderRadius: 8, border: '1px solid #adc6ff' }}>
                  <div style={{ color: '#2f54eb', fontSize: 12, marginBottom: 4 }}>Description</div>
                  <div style={{ color: '#434343' }}>{selectedRecord.description.replace(/null/g, "đ")}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CreditTransactions;
