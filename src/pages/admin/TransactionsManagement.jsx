import React, { useEffect, useState } from "react";
import { Card, Table, Form, Input, Select, Button, message, Modal, Descriptions, Tag } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { dashboardAminService } from "../../service/dashboardAdminService";

const TransactionsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();

  const normalizeResult = (result) => {
    if (!result) return { items: [], total: 0 };

    // Handle Spring Pageable response
    if (result.content && Array.isArray(result.content)) {
      return {
        items: result.content,
        total: result.totalElements || result.content.length
      };
    }

    // Handle array response
    if (Array.isArray(result)) {
      return { items: result, total: result.length };
    }

    // Handle custom response with items
    if (result.items) {
      return { items: result.items, total: result.total || result.items.length };
    }

    // Fallback
    return {
      items: Array.isArray(result) ? result : [result],
      total: Array.isArray(result) ? result.length : 1
    };
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      render: (_, __, index) => {
        // Calculate sequential number based on current page
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
      render: (type, record) => {
        const { userEmail, description } = record;

        // Check if this is an admin transaction (admin email or description contains "admin")
        const isAdminTransaction =
          userEmail === "huytainp@gmail.com" ||
          (description && description.toLowerCase().includes("admin"));

        // Determine if transaction is incoming (+) or outgoing (-)
        // Admin transactions are always treated as incoming
        const isIncoming = type === "DEPOSIT" || isAdminTransaction;
        const isOutgoing = !isAdminTransaction && [
          "PAYMENT",
          "WITHDRAW",
          "COURSE_FEE",
          "SUBSCRIPTION",
          "PURCHASE_RESOURCE",
          "PURCHASE_AI_CREDITS",
          "PURCHASE_SUBSCRIPTION"
        ].includes(type);

        let color = "blue";
        let icon = null;

        if (isIncoming) {
          color = "green";
          icon = <ArrowDownOutlined style={{ marginRight: 4 }} />;
        } else if (isOutgoing) {
          color = "red";
          icon = <ArrowUpOutlined style={{ marginRight: 4 }} />;
        }

        return (
          <Tag color={color} icon={icon}>
            {type}
          </Tag>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => {
        const { type, status, userEmail, description } = record;

        // Check if this is an admin transaction (admin email or description contains "admin")
        const isAdminTransaction =
          userEmail === "huytainp@gmail.com" ||
          (description && description.toLowerCase().includes("admin"));

        // If PENDING, show amount without sign
        if (status === "PENDING") {
          return (
            <span style={{ color: "#faad14", fontWeight: "bold" }}>
              {amount?.toLocaleString()} đ
            </span>
          );
        }

        // If SUCCESS, show with +/- based on type
        if (status === "SUCCESS") {
          // Admin transactions are always incoming (+)
          const isIncoming = type === "DEPOSIT" || isAdminTransaction;
          const sign = isIncoming ? "+" : "-";
          const color = isIncoming ? "#52c41a" : "#f5222d";

          return (
            <span style={{ color, fontWeight: "bold" }}>
              {sign}{Math.abs(amount)?.toLocaleString()} đ
            </span>
          );
        }

        // For FAILED or other statuses, show without sign
        return (
          <span style={{ color: "#d9d9d9", fontWeight: "bold" }}>
            {amount?.toLocaleString()} đ
          </span>
        );
      },
    },
    {
      title: "Balance After",
      dataIndex: "balanceAfter",
      key: "balanceAfter",
      render: (balance) => `${balance?.toLocaleString()} đ`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "SUCCESS") color = "success";
        else if (status === "PENDING") color = "warning";
        else if (status === "FAILED") color = "error";
        return <Tag color={color}>{status}</Tag>;
      },
    },
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
      const res = await dashboardAminService.getAllTransactions(
        values.search || "",
        values.type,
        page - 1, // Backend uses 0-based index
        pageSize,
        "createdAt", // Fixed sort by createdAt
        "DESC" // Fixed sort direction DESC
      );
      console.log(res)
      const { items, total } = normalizeResult(res);
      setData(items);
      setPagination((p) => ({ ...p, current: page, pageSize, total }));
    } catch (err) {
      message.error(err.message || "Failed to load transactions");
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
                { label: "Deposit", value: "DEPOSIT" },
                { label: "Payment", value: "PAYMENT" },
                { label: "Withdraw", value: "WITHDRAW" },
                { label: "Course Fee", value: "COURSE_FEE" },
                { label: "Subscription", value: "SUBSCRIPTION" },
                { label: "Purchase Resource", value: "PURCHASE_RESOURCE" },
                { label: "Purchase AI Credits", value: "PURCHASE_AI_CREDITS" },
                { label: "Purchase Subscription", value: "PURCHASE_SUBSCRIPTION" },
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
            {/* Transaction Information */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '2px solid #1890ff',
                color: '#1890ff'
              }}>
                Transaction Information
              </h3>
              <Descriptions
                bordered
                column={1}
                size="middle"
                labelStyle={{ width: '180px', fontWeight: 500 }}
              >
                <Descriptions.Item label="Transaction Type">
                  {(() => {
                    const type = selectedRecord.type;
                    const isIncoming = type === "DEPOSIT";
                    const isOutgoing = [
                      "PAYMENT", "WITHDRAW", "COURSE_FEE", "SUBSCRIPTION",
                      "PURCHASE_RESOURCE", "PURCHASE_AI_CREDITS", "PURCHASE_SUBSCRIPTION"
                    ].includes(type);
                    let color = "blue";
                    if (isIncoming) color = "green";
                    else if (isOutgoing) color = "red";
                    return <Tag color={color}>{type}</Tag>;
                  })()}
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                  {(() => {
                    let color = "default";
                    if (selectedRecord.status === "SUCCESS") color = "success";
                    else if (selectedRecord.status === "PENDING") color = "warning";
                    else if (selectedRecord.status === "FAILED") color = "error";
                    return <Tag color={color}>{selectedRecord.status}</Tag>;
                  })()}
                </Descriptions.Item>

                <Descriptions.Item label="User Email">
                  {selectedRecord.userEmail || "-"}
                </Descriptions.Item>

                {selectedRecord.orderCode && (
                  <Descriptions.Item label="Order Code">
                    <span style={{ fontFamily: 'monospace', color: '#1890ff' }}>
                      {selectedRecord.orderCode}
                    </span>
                  </Descriptions.Item>
                )}
                {selectedRecord.description && (
                  <Descriptions.Item label="Description">
                    {selectedRecord.description}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Transaction Date">
                  {selectedRecord.createdAt ? new Date(selectedRecord.createdAt).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }) : "-"}
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* Financial Details */}
            <div>
              <h3 style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '2px solid #fa8c16',
                color: '#fa8c16'
              }}>
                Financial Details
              </h3>
              <Descriptions
                bordered
                column={1}
                size="middle"
                labelStyle={{ width: '180px', fontWeight: 500 }}
              >
                <Descriptions.Item label="Amount">
                  {(() => {
                    // Check if this is an admin transaction
                    const isAdminTransaction =
                      selectedRecord.userEmail === "huytainp@gmail.com" ||
                      (selectedRecord.description && selectedRecord.description.toLowerCase().includes("admin"));
                    const isIncoming = selectedRecord.type === "DEPOSIT" || isAdminTransaction;

                    return (
                      <span style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: isIncoming ? '#52c41a' : '#f5222d'
                      }}>
                        {isIncoming ? '+' : '-'}
                        {Math.abs(selectedRecord.amount || 0).toLocaleString()} đ
                      </span>
                    );
                  })()}
                </Descriptions.Item>

                {selectedRecord.balanceBefore !== null && selectedRecord.balanceBefore !== undefined && (
                  <Descriptions.Item label="Balance Before">
                    {(selectedRecord.balanceBefore || 0).toLocaleString()} đ
                  </Descriptions.Item>
                )}

                {selectedRecord.balanceAfter !== null && selectedRecord.balanceAfter !== undefined && (
                  <Descriptions.Item label="Balance After">
                    <span style={{ fontWeight: 600 }}>
                      {(selectedRecord.balanceAfter || 0).toLocaleString()} đ
                    </span>
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

export default TransactionsManagement;
