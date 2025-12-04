import React, { useEffect, useState } from "react";
import { Card, Table, Form, Input, Button, message } from "antd";
import { dashboardAminService } from "../../service/dashboardAdminService";

const UserTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [form] = Form.useForm();

  const normalizeResult = (result) => {
    if (!result) return { items: [], total: 0 };
    if (Array.isArray(result)) return { items: result, total: result.length };
    if (result.content) return { items: result.content, total: result.totalElements || result.total || result.content.length };
    if (result.items) return { items: result.items, total: result.total || result.items.length };
    return { items: Array.isArray(result) ? result : [result], total: Array.isArray(result) ? result.length : 1 };
  };

  const makeColumns = (items) => {
    const sample = items[0];
    if (!sample) return [];
    return Object.keys(sample).map((key) => ({
      title: key,
      dataIndex: key,
      key,
      ellipsis: true,
      render: (value) => {
        if (value === null || value === undefined) return "";
        if (typeof value === "boolean") return value ? "true" : "false";
        if (typeof value === "number") return value.toLocaleString();
        if (typeof value === "string" && /\d{4}-\d{2}-\d{2}T/.test(value)) return new Date(value).toLocaleString();
        return Array.isArray(value) || typeof value === "object" ? JSON.stringify(value) : value;
      },
    }));
  };

  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const res = await dashboardAminService.getTransactionByUserId(values.userId, page - 1, pageSize);
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
      <Card title="Transactions By User" style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Form.Item name="userId" label="User ID" rules={[{ required: true }]}> 
            <Input placeholder="user id" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => fetchData(1, pagination.pageSize)}>Search</Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Table
          columns={makeColumns(data)}
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
    </div>
  );
};

export default UserTransactions;
