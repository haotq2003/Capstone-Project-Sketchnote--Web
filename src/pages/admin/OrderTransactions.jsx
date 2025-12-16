import React, { useEffect, useState } from "react";
import { Card, Table, Form, Input, Select, Button, message, Modal, Descriptions, Tag } from "antd";
import { dashboardAminService } from "../../service/dashboardAdminService";

const OrderTransactions = () => {
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
      title: "InvoiceNumber",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      ellipsis: true,
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        let color = "default";
        if (status === "COMPLETED") color = "success";
        else if (status === "PENDING") color = "warning";
        else if (status === "CANCELLED") color = "error";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => {
        let color = "default";
        if (status === "PAID") color = "success";
        else if (status === "PENDING") color = "warning";
        else if (status === "FAILED") color = "error";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `${amount?.toLocaleString()} đ`,
    },
    // {
    //   title: "Payment Method",
    //   dataIndex: "paymentMethod",
    //   key: "paymentMethod",
    // },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    // {
    //   title: "Note",
    //   dataIndex: "note",
    //   key: "note",
    //   ellipsis: true,
    // },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button
          style={{ background: "#a1f0ecff", color: "white" }}
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
      const res = await dashboardAminService.getAllOrderTransaction(
        values.search || "",
        values.orderStatus,
        values.paymentStatus,
        page - 1,
        pageSize,
        "createdAt",
        "DESC"
      );
      const { items, total } = normalizeResult(res);
      setData(items);
      console.log(items)
      setPagination((p) => ({ ...p, current: page, pageSize, total }));
    } catch (err) {
      message.error(err.message || "Failed to load order transactions");
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
          <Form.Item name="orderStatus" label="Order Status">
            <Select
              placeholder="All Status"
              allowClear
              style={{ width: 150 }}
              options={[
                { label: "Completed", value: "COMPLETED" },
                { label: "Pending", value: "PENDING" },
                { label: "Cancelled", value: "CANCELLED" },
              ]}
            />
          </Form.Item>
          <Form.Item name="paymentStatus" label="Payment Status">
            <Select
              placeholder="All Status"
              allowClear
              style={{ width: 150 }}
              options={[
                { label: "Paid", value: "PAID" },
                { label: "Pending", value: "PENDING" },
                { label: "Failed", value: "FAILED" },
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
          rowKey={(r, i) => r.id || r.orderId || i}
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
        title="Order Transaction Details"
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
            {Object.entries(selectedRecord)
              .filter(([key, value]) => {
                // Hide null, undefined, or empty values
                return value !== null && value !== undefined && value !== "";
              })
              .map(([key, value]) => {
                if (key === "items" && Array.isArray(value)) {
                  return (
                    <Descriptions.Item key={key} label={key} span={1}>
                      <Table
                        dataSource={value}
                        rowKey="orderDetailId"
                        pagination={false}
                        size="small"
                        columns={[
                          { title: "Item Name", dataIndex: "templateName", key: "templateName" },
                          { title: "Type", dataIndex: "templateType", key: "templateType" },
                          { title: "Price", dataIndex: "unitPrice", key: "unitPrice", render: (v) => `${v?.toLocaleString()} đ` },
                          { title: "Discount", dataIndex: "discount", key: "discount", render: (v) => `${v?.toLocaleString()} đ` },
                          { title: "Subtotal", dataIndex: "subtotalAmount", key: "subtotalAmount", render: (v) => `${v?.toLocaleString()} đ` },
                          { title: "Date", dataIndex: "createdAt", key: "createdAt", render: (v) => v ? new Date(v).toLocaleDateString() : "" },
                        ]}
                      />
                    </Descriptions.Item>
                  );
                }

                let displayValue = value;

                // Format currency fields
                if ((key === "totalAmount" || key === "amount" || key === "subtotalAmount" || key === "unitPrice" || key === "discount") && typeof value === "number") {
                  displayValue = `${value.toLocaleString()} đ`;
                } else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
                  displayValue = new Date(value).toLocaleString();
                } else if (typeof value === "object" && value !== null) {
                  displayValue = JSON.stringify(value, null, 2);
                } else {
                  displayValue = String(value);
                }

                if (key === "orderStatus" || key === "paymentStatus") {
                  let color = "default";
                  if (value === "COMPLETED" || value === "PAID") color = "success";
                  else if (value === "PENDING") color = "warning";
                  else if (value === "CANCELLED" || value === "FAILED") color = "error";
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

export default OrderTransactions;
