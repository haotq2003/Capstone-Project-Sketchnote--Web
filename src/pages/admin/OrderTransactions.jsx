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
          <div>
            {/* Order & Payment Information */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '2px solid #1890ff',
                color: '#1890ff'
              }}>
                Order Information
              </h3>
              <Descriptions
                bordered
                column={1}
                size="middle"
                labelStyle={{ width: '180px', fontWeight: 500 }}
              >
                {selectedRecord.invoiceNumber && (
                  <Descriptions.Item label="Invoice Number">
                    <span style={{ fontFamily: 'monospace', color: '#1890ff' }}>
                      {selectedRecord.invoiceNumber}
                    </span>
                  </Descriptions.Item>
                )}

                <Descriptions.Item label="Order Status">
                  {(() => {
                    let color = "default";
                    if (selectedRecord.orderStatus === "COMPLETED") color = "success";
                    else if (selectedRecord.orderStatus === "PENDING") color = "warning";
                    else if (selectedRecord.orderStatus === "CANCELLED") color = "error";
                    return <Tag color={color}>{selectedRecord.orderStatus}</Tag>;
                  })()}
                </Descriptions.Item>

                <Descriptions.Item label="Payment Status">
                  {(() => {
                    let color = "default";
                    if (selectedRecord.paymentStatus === "PAID") color = "success";
                    else if (selectedRecord.paymentStatus === "PENDING") color = "warning";
                    else if (selectedRecord.paymentStatus === "FAILED") color = "error";
                    return <Tag color={color}>{selectedRecord.paymentStatus}</Tag>;
                  })()}
                </Descriptions.Item>

                {selectedRecord.paymentMethod && (
                  <Descriptions.Item label="Payment Method">
                    {selectedRecord.paymentMethod}
                  </Descriptions.Item>
                )}

                <Descriptions.Item label="Total Amount">
                  <span style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#52c41a'
                  }}>
                    {(selectedRecord.totalAmount || 0).toLocaleString()} đ
                  </span>
                </Descriptions.Item>

                <Descriptions.Item label="Order Date">
                  {selectedRecord.createdAt ? new Date(selectedRecord.createdAt).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }) : "-"}
                </Descriptions.Item>

                {selectedRecord.note && (
                  <Descriptions.Item label="Note">
                    {selectedRecord.note}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>

            {/* Order Items */}
            {selectedRecord.items && Array.isArray(selectedRecord.items) && selectedRecord.items.length > 0 && (
              <div>
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: '2px solid #fa8c16',
                  color: '#fa8c16'
                }}>
                  Order Items ({selectedRecord.items.length})
                </h3>
                <Table
                  dataSource={selectedRecord.items}
                  rowKey="orderDetailId"
                  pagination={false}
                  size="small"
                  bordered
                  columns={[
                    {
                      title: "Item Name",
                      dataIndex: "templateName",
                      key: "templateName",
                      ellipsis: true
                    },
                    {
                      title: "Type",
                      dataIndex: "templateType",
                      key: "templateType",
                      width: 120
                    },
                    {
                      title: "Price",
                      dataIndex: "unitPrice",
                      key: "unitPrice",
                      width: 120,
                      render: (v) => `${v?.toLocaleString()} đ`,
                      align: 'right'
                    },
                    {
                      title: "Discount",
                      dataIndex: "discount",
                      key: "discount",
                      width: 100,
                      render: (v) => v ? `${v?.toLocaleString()} đ` : '-',
                      align: 'right'
                    },
                    {
                      title: "Subtotal",
                      dataIndex: "subtotalAmount",
                      key: "subtotalAmount",
                      width: 120,
                      render: (v) => (
                        <span style={{ fontWeight: 600 }}>
                          {v?.toLocaleString()} đ
                        </span>
                      ),
                      align: 'right'
                    },
                  ]}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderTransactions;
