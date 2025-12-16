import React, { useState, useEffect } from "react";
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    message,
    Popconfirm,
    Tag,
    Space,
    Typography,
    Checkbox,
    Spin,
} from "antd";
import {
    BankOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    StarOutlined,
    StarFilled,
} from "@ant-design/icons";
import { walletService } from "../../service/walletService";

const { Title, Text } = Typography;

const BankAccountManagement = ({ onAccountChange }) => {
    const [loading, setLoading] = useState(false);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [bankList, setBankList] = useState([]);
    const [bankListLoading, setBankListLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [selectedBank, setSelectedBank] = useState(null);
    const [form] = Form.useForm();

    // Fetch bank accounts
    const fetchBankAccounts = async () => {
        setLoading(true);
        try {
            const res = await walletService.getBankAccountByUserId();
            const accounts = res.result || res || [];
            setBankAccounts(accounts);
        } catch (error) {
            message.error(error.message || "Failed to load bank accounts");
        }
        setLoading(false);
    };

    // Fetch VietQR bank list
    const fetchBankList = async () => {
        setBankListLoading(true);
        try {
            const res = await walletService.getBankList();
            if (res.data && Array.isArray(res.data)) {
                setBankList(res.data);
            }
        } catch (error) {
            console.error("Failed to load bank list:", error);
            message.warning("Could not load bank list from VietQR");
        }
        setBankListLoading(false);
    };

    useEffect(() => {
        fetchBankAccounts();
        fetchBankList();
    }, []);

    // Open modal for add/edit
    const openModal = (account = null) => {
        setEditingAccount(account);
        setSelectedBank(null); // Reset selected bank
        if (account) {
            form.setFieldsValue({
                bankName: account.bankName,
                accountNumber: account.accountNumber,
                accountHolderName: account.accountHolderName,
                branch: account.branch || "",
                isDefault: account.isDefault || false,
            });
        } else {
            form.resetFields();
        }
        setModalVisible(true);
    };

    // Handle form submit
    const handleSubmit = async (values) => {
        try {
            if (editingAccount) {
                // Update existing account - include logoUrl if bank was changed
                const updateData = {
                    id: editingAccount.id,
                    ...values,
                };
                // If user changed the bank, update logoUrl
                if (selectedBank) {
                    updateData.logoUrl = selectedBank.logo;
                }
                await walletService.updateBankAccount(updateData);
                message.success("Bank account updated successfully");
            } else {
                // Create new account - add logoUrl from selected bank
                const accountData = {
                    ...values,
                    logoUrl: selectedBank?.logo || "",
                };
                await walletService.createBankAccount(accountData);
                message.success("Bank account added successfully");
            }
            setModalVisible(false);
            form.resetFields();
            setSelectedBank(null);
            fetchBankAccounts();
            onAccountChange?.(); // Notify parent component
        } catch (error) {
            message.error(error.message || "Operation failed");
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        try {
            await walletService.deleteBankAccount(id);
            message.success("Bank account deleted successfully");
            fetchBankAccounts();
            onAccountChange?.(); // Notify parent component
        } catch (error) {
            message.error(error.message || "Delete failed");
        }
    };

    // Handle set default
    const handleSetDefault = async (account) => {
        try {
            await walletService.updateBankAccount({
                id: account.id,
                bankName: account.bankName,
                accountNumber: account.accountNumber,
                accountHolderName: account.accountHolderName,
                branch: account.branch,
                isDefault: true,
            });
            message.success("Default bank account updated");
            fetchBankAccounts();
            onAccountChange?.(); // Notify parent component
        } catch (error) {
            message.error(error.message || "Failed to set default");
        }
    };

    const columns = [
        {
            title: "Bank Name",
            dataIndex: "bankName",
            key: "bankName",
            render: (text) => (
                <Space>
                    <BankOutlined style={{ color: "#1890ff" }} />
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: "Account Number",
            dataIndex: "accountNumber",
            key: "accountNumber",
            render: (text) => <Text code>{text}</Text>,
        },
        {
            title: "Account Holder",
            dataIndex: "accountHolderName",
            key: "accountHolderName",
        },
        {
            title: "Branch",
            dataIndex: "branch",
            key: "branch",
            render: (text) => text || "-",
        },
        {
            title: "Default",
            dataIndex: "isDefault",
            key: "isDefault",
            width: 100,
            align: "center",
            render: (isDefault, record) => (
                isDefault ? (
                    <Tag icon={<StarFilled />} color="gold">
                        Default
                    </Tag>
                ) : (
                    <Button
                        type="link"
                        size="small"
                        icon={<StarOutlined />}
                        onClick={() => handleSetDefault(record)}
                    >
                        Set Default
                    </Button>
                )
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => openModal(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete this bank account?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="link"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card
                title={
                    <Space>
                        <BankOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                        <Title level={3} style={{ margin: 0 }}>
                            Bank Account Management
                        </Title>
                    </Space>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => openModal()}
                    >
                        Add Bank Account
                    </Button>
                }
                style={{ borderRadius: 12 }}
            >
                <Table
                    columns={columns}
                    dataSource={bankAccounts}
                    rowKey={(record, index) => record.id || `bank-${index}`}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    locale={{
                        emptyText: (
                            <div style={{ padding: "40px 0" }}>
                                <BankOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
                                <div style={{ marginTop: 16 }}>
                                    <Text type="secondary">No bank accounts yet</Text>
                                </div>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => openModal()}
                                    style={{ marginTop: 16 }}
                                >
                                    Add Your First Bank Account
                                </Button>
                            </div>
                        ),
                    }}
                />
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                title={
                    <Space>
                        <BankOutlined />
                        {editingAccount ? "Edit Bank Account" : "Add Bank Account"}
                    </Space>
                }
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                    setSelectedBank(null);
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ marginTop: 24 }}
                >
                    <Form.Item
                        name="bankName"
                        label="Bank Name"
                        rules={[{ required: true, message: "Please select a bank" }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select or type bank name"
                            loading={bankListLoading}
                            onChange={(value) => {
                                // Find and store the selected bank object
                                const bank = bankList.find(b => b.shortName === value);
                                setSelectedBank(bank);
                            }}
                            filterOption={(input, option) =>
                                (option?.searchLabel ?? "").toLowerCase().includes(input.toLowerCase())
                            }
                            notFoundContent={bankListLoading ? <Spin size="small" /> : "No banks found"}
                            options={bankList.map((bank) => ({
                                value: bank.shortName,
                                label: (
                                    <Space>
                                        <img
                                            src={bank.logo}
                                            alt={bank.shortName}
                                            style={{ width: 20, height: 20 }}
                                        />
                                        <span>{bank.name}</span>
                                        <Text type="secondary">({bank.shortName})</Text>
                                    </Space>
                                ),
                                searchLabel: `${bank.name} ${bank.shortName} ${bank.code}`,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="accountNumber"
                        label="Account Number"
                        rules={[
                            { required: true, message: "Please enter account number" },
                            { pattern: /^[0-9]+$/, message: "Only numbers allowed" },
                        ]}
                    >
                        <Input placeholder="Enter account number" maxLength={20} />
                    </Form.Item>

                    <Form.Item
                        name="accountHolderName"
                        label="Account Holder Name"
                        rules={[
                            { required: true, message: "Please enter account holder name" },
                        ]}
                    >
                        <Input placeholder="Enter account holder name" />
                    </Form.Item>

                    <Form.Item
                        name="branch"
                        label="Branch (Optional)"
                    >
                        <Input placeholder="e.g. Ho Chi Minh City Branch" />
                    </Form.Item>

                    <Form.Item name="isDefault" valuePropName="checked">
                        <Checkbox>
                            <Space>
                                <StarOutlined />
                                Set as default account
                            </Space>
                        </Checkbox>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                            <Button
                                onClick={() => {
                                    setModalVisible(false);
                                    form.resetFields();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingAccount ? "Update" : "Add"} Bank Account
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BankAccountManagement;
