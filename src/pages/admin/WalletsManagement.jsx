import React, { useEffect, useState } from "react";
import { Card, Table, Form, Input, Select, Button, Row, Col, message, Modal, Descriptions } from "antd";
import { dashboardAminService } from "../../service/dashboardAdminService";

const WalletsManagement = () => {
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
      width: 220,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      width: 200,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      width: 150,
      render: (balance) => (
        <span style={{ fontWeight: "bold", color: "#ddaf17ff" }}>
          {balance?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button
          style={{ background: "#fcaf70ff", color: "white" }}
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
      const res = await dashboardAminService.getALlWalletOfUser(values.search || "", page - 1, pageSize, values.sortBy, values.sortDir);
      console.log(res);

      const { items, total } = normalizeResult(res);
      setData(items);
      setPagination((p) => ({ ...p, current: page, pageSize, total }));
    } catch (err) {
      message.error(err.message || "Failed to load wallets");
      console.log(err.response?.data?.message || err.message || "Failed to load wallets");
    }
    setLoading(false);
  };

  useEffect(() => {
    form.setFieldsValue({ sortBy: "createdAt", sortDir: "DESC" });
    fetchData(1, 10);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Form.Item name="search" label="Search">
            <Input placeholder="Search..." style={{ width: 200 }} />
          </Form.Item>
          {/* <Form.Item name="sortBy" label="Sort By">
            <Input placeholder="createdAt" />
          </Form.Item>
          <Form.Item name="sortDir" label="Sort Dir">
            <Select style={{ width: 120 }} options={[{ value: "ASC" }, { value: "DESC" }]} />
          </Form.Item> */}
          <Form.Item>
            <Row gutter={8}>
              <Col>
                <Button type="primary" onClick={() => fetchData(pagination.current, pagination.pageSize)}>Search</Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(r, i) => r.id || r.userId || i}
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
        title="Wallet Details"
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
                let displayValue = value;

                // Format currency fields
                if ((key === "balance" || key === "amount") && typeof value === "number") {
                  displayValue = `${value.toLocaleString()} đ`;
                } else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
                  displayValue = new Date(value).toLocaleString();
                } else if (typeof value === "object" && value !== null) {
                  displayValue = JSON.stringify(value, null, 2);
                } else {
                  displayValue = String(value);
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

export default WalletsManagement;
