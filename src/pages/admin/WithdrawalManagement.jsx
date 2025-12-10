import React, { useEffect, useState } from "react";
import { Card, Table, Form, Input, Select, Button, Row, Col, message, Modal, Descriptions, Tag, Space, Popconfirm } from "antd";
import { withdrawalsService } from "../../service/withdrawalsService";

const AdminWithdrawalManagement = () => {
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
            width: 60,
        },
        {
            title: "Amount",
            dataIndex: "amount",
            width: 120,
            render: (amount) => (
                <span style={{ fontWeight: "bold", color: "#ddaf17ff" }}>
                    {amount?.toLocaleString()} đ
                </span>
            ),
        },
        {
            title: "Bank",
            dataIndex: "bankName",
            width: 100,
            ellipsis: true,
        },
        {
            title: "Account No.",
            dataIndex: "bankAccountNumber",
            width: 130,
            ellipsis: true,
        },
        {
            title: "Holder",
            dataIndex: "bankAccountHolder",
            width: 120,
            ellipsis: true,
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 100,
            render: (status) => {
                let color = "default";
                if (status === "APPROVED" || status === "SUCCESS") color = "success";
                if (status === "PENDING") color = "warning";
                if (status === "REJECTED" || status === "FAILED") color = "error";
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            width: 100,
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "actions",
            width: 220,
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleViewDetail(record)}
                    >
                        View
                    </Button>
                    {record.status === "PENDING" && (
                        <>
                            <Popconfirm
                                title="Approve this withdrawal?"
                                onConfirm={() => handleApprove(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="primary" style={{ backgroundColor: "#52c41a" }}>
                                    Approve
                                </Button>
                            </Popconfirm>
                            <Popconfirm
                                title="Reject this withdrawal?"
                                onConfirm={() => handleReject(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="primary" danger>
                                    Reject
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    const handleViewDetail = (record) => {
        setSelectedRecord(record);
        setIsModalVisible(true);
    };

    const handleApprove = async (id) => {
        try {
            await withdrawalsService.approveWithdrawal(id);
            message.success("Withdrawal approved successfully");
            fetchData(pagination.current, pagination.pageSize);
        } catch (error) {
            message.error(error.message || "Failed to approve withdrawal");
        }
    };

    const handleReject = async (id) => {
        try {
            await withdrawalsService.rejectWithdrawal(id);
            message.success("Withdrawal rejected successfully");
            fetchData(pagination.current, pagination.pageSize);
        } catch (error) {
            message.error(error.message || "Failed to reject withdrawal");
        }
    };

    const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
        setLoading(true);
        try {
            const values = form.getFieldsValue();
            const res = await withdrawalsService.getWithdrawals(
                values.search || "",
                values.status || "",
                page - 1,
                pageSize,
                values.sortBy,
                values.sortDir
            );
            console.log(res);

            const { items, total } = normalizeResult(res);
            setData(items);
            setPagination((p) => ({ ...p, current: page, pageSize, total }));
        } catch (err) {
            message.error(err.message || "Failed to load withdrawals");
            console.log(err.response?.data?.message || err.message || "Failed to load withdrawals");
        }
        setLoading(false);
    };

    useEffect(() => {
        form.setFieldsValue({ sortBy: "createdAt", sortDir: "DESC" });
        fetchData(1, 10);
    }, []);

    return (
        <div style={{ padding: 24, maxWidth: "100%", overflowX: "hidden" }}>

            <Card style={{ marginBottom: 16 }}>
                <Form form={form} layout="inline">
                    <Form.Item name="search" label="Search">
                        <Input placeholder="Search..." style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item name="status" label="Status">
                        <Select
                            style={{ width: 150 }}
                            allowClear
                            placeholder="All Status"
                            options={[
                                { value: "PENDING", label: "Pending" },
                                { value: "APPROVED", label: "Approved" },
                                { value: "REJECTED", label: "Rejected" },
                            ]}
                        />
                    </Form.Item>
                    {/* <Form.Item name="sortBy" label="Sort By">
                        <Input placeholder="createdAt" />
                    </Form.Item>
                    <Form.Item name="sortDir" label="Sort Dir">
                        <Select style={{ width: 100 }} options={[{ value: "ASC" }, { value: "DESC" }]} />
                    </Form.Item> */}
                    <Form.Item>
                        <Button type="primary" onClick={() => fetchData(1, pagination.pageSize)}>
                            Search
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card style={{ overflow: "hidden" }}>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} items`,
                    }}
                    onChange={(pag) => fetchData(pag.current, pag.pageSize)}
                />
            </Card>

            <Modal
                title="Withdrawal Details"
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
                        {Object.entries(selectedRecord).map(([key, value]) => (
                            <Descriptions.Item key={key} label={key}>
                                {typeof value === "object" && value !== null
                                    ? JSON.stringify(value, null, 2)
                                    : String(value)}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default AdminWithdrawalManagement;
