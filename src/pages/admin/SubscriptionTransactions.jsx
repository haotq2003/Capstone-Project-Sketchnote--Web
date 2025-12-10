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
      title: "ID",
      dataIndex: "subscriptionId",
      key: "subscriptionId",
      width: 80,
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
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => date ? new Date(date).toLocaleDateString() : "-",
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
          style={{ background: "#a1f0ecff", color: "black" }}
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
        title="Subscription Transaction Details"
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
                if (value === "ACTIVE") color = "success";
                else if (value === "EXPIRED") color = "error";
                else if (value === "PENDING") color = "warning";
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

export default SubscriptionTransactions;
