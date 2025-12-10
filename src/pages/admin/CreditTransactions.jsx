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
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
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
        title="Credit Transaction Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedRecord && (
          <Descriptions bordered column={1}>
            {Object.entries(selectedRecord).map(([key, value]) => {
              let displayValue = value;
              if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
                displayValue = new Date(value).toLocaleString();
              } else if (typeof value === "object" && value !== null) {
                displayValue = JSON.stringify(value, null, 2);
              } else {
                displayValue = String(value);
              }
              if (key === "status") {
                let color = "default";
                if (value === "SUCCESS") color = "success";
                else if (value === "PENDING") color = "warning";
                else if (value === "FAILED") color = "error";
                return (
                  <Descriptions.Item key={key} label={key}>
                    <Tag color={color}>{value}</Tag>
                  </Descriptions.Item>
                );
              }
              return (
                <Descriptions.Item key={key} label={key}>
                  {displayValue}
                </Descriptions.Item>
              );
            })}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default CreditTransactions;
