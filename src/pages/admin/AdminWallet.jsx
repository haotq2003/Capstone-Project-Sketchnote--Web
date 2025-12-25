import React, { useEffect, useState } from "react";
import {
    Card,
    Table,
    Button,
    Row,
    Col,
    Statistic,
    message,
    Modal,
    Form,
    Input,
    InputNumber,
    Tag,
    Divider,
    Space,
    Typography,
    Tabs,
    Tooltip,
    Select,
} from "antd";
import {
    WalletOutlined,
    DollarOutlined,
    HistoryOutlined,
    BankOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    ReloadOutlined,
    SettingOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { walletService } from "../../service/walletService";
import BankAccountManagement from "./BankAccountManagement";

const { Title, Text } = Typography;

const quickAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000];

const AdminWallet = () => {
    const [loading, setLoading] = useState(false);
    const [walletData, setWalletData] = useState({
        balance: 0,
        transactions: [],
    });
    const [withdrawHistory, setWithdrawHistory] = useState([]);
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [depositModalVisible, setDepositModalVisible] = useState(false);
    const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
    const [depositAmount, setDepositAmount] = useState("");
    const [activeTab, setActiveTab] = useState("transactions");
    const [withdrawForm] = Form.useForm();
    const [bankAccounts, setBankAccounts] = useState([]);
    const [selectedBankAccount, setSelectedBankAccount] = useState(null);
    const [bankManagementVisible, setBankManagementVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return "0 đ";
        return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const fetchWallet = async () => {
        setLoading(true);
        try {
            const res = await walletService.getWallet();
            setWalletData(res.result || { balance: 0, transactions: [] });
        } catch (error) {
            message.error(error.message || "Failed to load wallet");
        }
        setLoading(false);
    };

    const fetchWithdrawHistory = async () => {
        setWithdrawLoading(true);
        try {
            const res = await walletService.getWithdrawHistory(0, 50, "createdAt", "desc");
            setWithdrawHistory(res?.content || res || []);
        } catch (error) {
            console.warn("Failed to load withdraw history:", error);
        }
        setWithdrawLoading(false);
    };

    const fetchBankAccounts = async () => {
        try {
            const res = await walletService.getBankAccountByUserId();
            setBankAccounts(res.result || res || []);
        } catch (error) {
            console.warn("Failed to load bank accounts:", error);
        }
    };

    useEffect(() => {
        fetchWallet();
        fetchWithdrawHistory();
        fetchBankAccounts();
    }, []);

    const handleDeposit = async () => {
        const amount = parseInt(depositAmount);
        if (!amount || amount < 10000) {
            message.error("Minimum deposit amount is 10,000 VND");
            return;
        }
        try {
            // Generate return URL to payment callback interceptor
            // Backend will redirect to: {baseUrl}/payment-callback?status=SUCCESS&orderCode=...
            // PaymentCallback will then route to /wallet-success or /wallet-fail
            const baseUrl = window.location.origin; // e.g., http://localhost:8888
            const returnUrl = `${baseUrl}/payment-callback`;

            const res = await walletService.depositWallet(amount, returnUrl);


            // Payment URL có thể ở res.message hoặc res.result
            const paymentUrl = res?.message || res?.result;

            if (paymentUrl && typeof paymentUrl === 'string' && paymentUrl.startsWith('http')) {
                // Navigate to payment page in same tab
                // After payment, backend will redirect to /wallet-success or /wallet-fail
                window.location.href = paymentUrl;
            } else {
                console.error("Invalid payment URL:", paymentUrl);
                message.error("Invalid payment URL received");
                return;
            }

            setDepositModalVisible(false);
            setDepositAmount("");
        } catch (error) {
            console.error("Deposit error:", error);
            message.error(error.message || "Deposit failed");
        }
    };

    const handleWithdraw = async (values) => {
        if (values.amount > walletData.balance) {
            message.error("Insufficient balance");
            return;
        }
        try {
            await walletService.withdrawRequest({
                amount: values.amount,
                bankName: values.bankName,
                bankAccountNumber: values.accountNumber,
                bankAccountHolder: values.accountName,
            });
            message.success("Withdrawal request submitted successfully");
            setWithdrawModalVisible(false);
            withdrawForm.resetFields();
            fetchWallet();
            fetchWithdrawHistory();
        } catch (error) {
            message.error(error.message || "Withdrawal request failed");
            console.error("Withdrawal error:", error);
        }
    };

    // Admin wallet: all transactions are INCOME (money coming IN)
    const getTransactionStyle = (type, status) => {
        const styles = {
            DEPOSIT: { color: "#52c41a", tagColor: "green" },
            WITHDRAWAL: { color: "#ff4d4f", tagColor: "red" },
            PURCHASE_AI_CREDITS: { color: "#1890ff", tagColor: "blue" },
            COURSE_FEE: { color: "#722ed1", tagColor: "purple" },
            SUBSCRIPTION: { color: "#13c2c2", tagColor: "cyan" },
            RESOURCE: { color: "#fa8c16", tagColor: "orange" },
        };
        return styles[type] || { color: "#52c41a", tagColor: "green" };
    };

    const transactionColumns = [
        {
            title: "No.",
            width: 60,
            align: "center",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Type",
            dataIndex: "type",
            width: 160,
            render: (type) => {
                const style = getTransactionStyle(type);
                const displayType = type?.replace(/_/g, " ") || "UNKNOWN";
                return (
                    <Tag color={style.tagColor}>
                        {displayType}
                    </Tag>
                );
            },
        },
        {
            title: "Amount",
            dataIndex: "amount",
            width: 150,
            render: (amount, record) => {
                const style = getTransactionStyle(record.type);
                return (
                    <Text style={{ color: style.color, fontWeight: 600 }}>
                        +{formatCurrency(Math.abs(amount))}
                    </Text>
                );
            },
        },
        {
            title: "Balance After",
            dataIndex: "balance",
            width: 150,
            render: (balance) => formatCurrency(balance),
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 100,
            render: (status) => (
                <Tag color={status === "SUCCESS" ? "green" : status === "PENDING" ? "orange" : "red"}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            width: 180,
            render: (date) => formatDate(date),
        },
        {
            title: "Action",
            width: 100,
            align: "center",
            render: (_, record) => (
                <Button
                    type="link"
                    size="small"
                    onClick={() => {
                        setSelectedTransaction(record);
                        setDetailModalVisible(true);
                    }}
                >
                    View Detail
                </Button>
            ),
        },
    ];

    const withdrawColumns = [
        {
            title: "Amount",
            dataIndex: "amount",
            width: 150,
            render: (amount) => (
                <Text style={{ color: "#ff4d4f", fontWeight: 600 }}>
                    -{formatCurrency(amount)}
                </Text>
            ),
        },
        {
            title: "Bank Name",
            dataIndex: "bankName",
            width: 150,
        },
        {
            title: "Account Number",
            dataIndex: "bankAccountNumber",
            width: 180,
        },
        {
            title: "Account Holder",
            dataIndex: "bankAccountHolder",
            width: 180,
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 100,
            render: (status) => (
                <Tag color={status === "COMPLETED" || status === "APPROVED" ? "green" : status === "PENDING" ? "orange" : "red"}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            width: 180,
            render: (date) => formatDate(date),
        },
    ];

    const totalDeposit = walletData.transactions
        .filter((t) => t.type === "DEPOSIT" && t.status === "SUCCESS")
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Admin wallet: calculate revenue from services (not withdrawals)
    const totalRevenue = walletData.transactions
        .filter((t) => t.type !== "DEPOSIT" && t.type !== "WITHDRAWAL" && t.status === "SUCCESS")
        .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);

    const tabItems = [
        {
            key: "transactions",
            label: (
                <span>
                    <HistoryOutlined /> Transactions
                </span>
            ),
            children: (
                <Table
                    columns={transactionColumns}
                    dataSource={[...walletData.transactions].sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )}
                    rowKey={(r) => r.transactionId || r.id || `trans-${Math.random()}`}
                    loading={loading}
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    scroll={{ x: "max-content" }}
                />
            ),
        },
        {
            key: "withdrawals",
            label: (
                <span>
                    <BankOutlined /> Withdrawal History
                </span>
            ),
            children: (
                <Table
                    columns={withdrawColumns}
                    dataSource={withdrawHistory}
                    rowKey={(r) => r.withdrawId || r.id || `withdraw-${Math.random()}`}
                    loading={withdrawLoading}
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    scroll={{ x: "max-content" }}
                />
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[24, 24]}>
                {/* Balance Card - Blue Theme & Compact */}
                <Col xs={24} lg={12}>
                    <Card
                        variant="borderless"
                        style={{
                            height: '100%',
                            minHeight: 180,
                            borderRadius: 24,
                            background: 'linear-gradient(110deg, #1890ff 0%, #40a9ff 50%, #69c0ff 100%)',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(24, 144, 255, 0.3)',
                        }}
                        styles={{
                            body: {
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: '20px 24px',
                                position: 'relative',
                                zIndex: 2
                            }
                        }}
                    >
                        {/* Decorative Background Elements (Họa tiết trang trí - tone trắng/xanh) */}
                        <div style={{
                            position: 'absolute',
                            top: -60,
                            right: -60,
                            width: 200,
                            height: 200,
                            // Họa tiết màu trắng mờ
                            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                            borderRadius: '50%',
                            zIndex: 1,
                        }} />
                        <div style={{
                            position: 'absolute',
                            bottom: -40,
                            left: -20,
                            width: 180,
                            height: 180,
                            // Họa tiết màu xanh nhạt mờ
                            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255,255,255,0) 70%)',
                            borderRadius: '50%',
                            zIndex: 1,
                        }} />

                        {/* Top Section: Label & Balance */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 20 }}>
                                    <WalletOutlined style={{ fontSize: 16, color: '#fff' }} />
                                    <Text style={{ color: '#fff', fontSize: 13, letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>
                                        Total Balance
                                    </Text>
                                </div>

                                {/* Refresh Button */}
                                <Tooltip title="Refresh Balance">
                                    <Button
                                        type="text"
                                        shape="circle"
                                        icon={<ReloadOutlined style={{ color: 'rgba(255,255,255,0.8)' }} />}
                                        onClick={() => { fetchWallet(); fetchWithdrawHistory(); }}
                                        style={{ background: 'transparent' }}
                                    />
                                </Tooltip>
                            </div>

                            <Title level={1} style={{
                                color: '#fff',
                                marginTop: 16, // Giảm margin
                                marginBottom: 4,
                                fontSize: 40, // Giảm kích thước font một chút
                                fontWeight: 800,
                                letterSpacing: '-1px',
                                textShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}>
                                {formatCurrency(walletData.balance)}
                            </Title>

                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                                Available for withdrawal
                            </Text>
                        </div>

                        {/* Bottom Section: Actions */}
                        <div style={{ marginTop: 24, position: 'relative', zIndex: 10 }}>
                            <Space size={12} style={{ width: '100%' }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<DollarOutlined />}
                                    style={{
                                        height: 44,
                                        padding: '0 24px',
                                        borderRadius: 12,
                                        background: 'rgba(255,255,255,0.25)', // Nền trong suốt sáng hơn
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        color: '#fff',
                                        fontWeight: 600,
                                        backdropFilter: 'blur(10px)',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    onClick={() => { console.log('Deposit button clicked'); setDepositModalVisible(true); }}
                                >
                                    Deposit
                                </Button>

                                <Button
                                    size="middle" // Dùng size middle thay vì large
                                    icon={<BankOutlined />}
                                    onClick={() => { console.log('Withdraw button clicked'); setWithdrawModalVisible(true); }}
                                    style={{
                                        height: 44,
                                        padding: '0 24px',
                                        borderRadius: 12,
                                        background: 'rgba(255,255,255,0.25)', // Nền trong suốt sáng hơn
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        color: '#fff',
                                        fontWeight: 600,
                                        backdropFilter: 'blur(10px)',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    Withdraw
                                </Button>
                            </Space>
                        </div>
                    </Card>
                </Col>

                {/* Total Revenue Card */}
                <Col xs={24} lg={12}>
                    <Card
                        style={{
                            height: '100%',
                            minHeight: 180,
                            borderRadius: 12,
                            border: "1px solid #f0f0f0",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        styles={{ body: { padding: "24px", width: '100%' } }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                            <div>
                                <Text type="secondary" style={{ fontSize: 14, display: "block", marginBottom: 8 }}>
                                    Total Revenue from Services
                                </Text>
                                <Title level={2} style={{ margin: 0, color: "#1890ff", fontSize: 36, fontWeight: 700 }}>
                                    {new Intl.NumberFormat("vi-VN").format(totalRevenue)} đ
                                </Title>
                                <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                                    AI Credits, Courses, Subscriptions, Resources
                                </Text>
                            </div>
                            <div style={{
                                width: 64,
                                height: 64,
                                borderRadius: 16,
                                background: "linear-gradient(135deg, #1890ff15 0%, #1890ff30 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <ArrowDownOutlined style={{ fontSize: 28, color: "#1890ff" }} />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Transactions Table */}
            <Card style={{ marginTop: 24, borderRadius: 12 }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                />
            </Card>

            {/* Deposit Modal */}
            <Modal
                title={<><DollarOutlined /> Deposit Funds</>}
                open={depositModalVisible}
                onCancel={() => { setDepositModalVisible(false); setDepositAmount(""); }}
                onOk={handleDeposit}
                okText="Proceed to Payment"
                okButtonProps={{ disabled: !depositAmount || parseInt(depositAmount) < 10000 }}
            >
                <div style={{ marginBottom: 16 }}>
                    <Text>Enter deposit amount:</Text>
                    <InputNumber
                        style={{ width: "100%", marginTop: 8 }}
                        size="large"
                        min={10000}
                        step={10000}
                        value={depositAmount ? parseInt(depositAmount) : null}
                        onChange={(val) => setDepositAmount(val ? val.toString() : "")}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value.replace(/\,/g, "")}
                        addonAfter="VND"
                        placeholder="Minimum 10,000 VND"
                    />
                </div>
                <Text type="secondary">Quick amounts:</Text>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                    {quickAmounts.map((amt) => (
                        <Button
                            key={amt}
                            type={depositAmount === amt.toString() ? "primary" : "default"}
                            onClick={() => setDepositAmount(amt.toString())}
                        >
                            {new Intl.NumberFormat("vi-VN").format(amt)}
                        </Button>
                    ))}
                </div>
            </Modal>

            {/* Withdraw Modal */}
            <Modal
                title={<><BankOutlined /> Request Withdrawal</>}
                open={withdrawModalVisible}
                onCancel={() => {
                    setWithdrawModalVisible(false);
                    withdrawForm.resetFields();
                    setSelectedBankAccount(null);
                }}
                footer={null}
                width={500}
            >
                <Form
                    form={withdrawForm}
                    layout="vertical"
                    onFinish={handleWithdraw}
                >
                    {/* Bank Account Required Notice */}
                    {bankAccounts.length === 0 ? (
                        <div style={{
                            background: "linear-gradient(135deg, #f0f5ff 0%, #e6f7ff 100%)",
                            padding: 24,
                            borderRadius: 12,
                            marginBottom: 16,
                            textAlign: "center",
                            border: "1px solid #91d5ff"
                        }}>
                            <BankOutlined style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }} />
                            <Title level={5} style={{ marginBottom: 8 }}>No Bank Account Found</Title>
                            <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
                                You need to add a bank account before making a withdrawal request.
                            </Text>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setWithdrawModalVisible(false);
                                    setBankManagementVisible(true);
                                }}
                            >
                                Add Bank Account
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Bank Account Selector */}
                            <Form.Item
                                label={<Text strong>Select Bank Account</Text>}
                                required
                                style={{ marginBottom: 16 }}
                            >
                                <Select
                                    size="large"
                                    placeholder="Choose a bank account for withdrawal"
                                    value={selectedBankAccount}
                                    onChange={(value) => {
                                        setSelectedBankAccount(value);
                                        if (value) {
                                            const account = bankAccounts.find(acc => acc.id === value);
                                            if (account) {
                                                withdrawForm.setFieldsValue({
                                                    bankName: account.bankName,
                                                    accountNumber: account.accountNumber,
                                                    accountName: account.accountHolderName,
                                                });
                                            }
                                        }
                                    }}
                                    dropdownStyle={{
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    }}
                                    optionLabelProp="label"
                                >
                                    {bankAccounts.map((acc, index) => (
                                        <Select.Option
                                            key={acc.id || `acc-${index}`}
                                            value={acc.id}
                                            label={`${acc.bankName} - ${acc.accountNumber}`}
                                        >
                                            <div style={{
                                                padding: '8px 4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 12
                                            }}>
                                                <div style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 8,
                                                    background: 'linear-gradient(135deg, #1890ff15 0%, #1890ff25 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <BankOutlined style={{ color: '#1890ff', fontSize: 18 }} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600, marginBottom: 2 }}>
                                                        {acc.bankName}
                                                    </div>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {acc.accountNumber} • {acc.accountHolderName}
                                                    </Text>
                                                </div>
                                                {acc.isDefault && <Tag color="gold">Default</Tag>}
                                            </div>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Selected Account Display */}
                            {selectedBankAccount && (() => {
                                const account = bankAccounts.find(acc => acc.id === selectedBankAccount);
                                return account ? (
                                    <Card
                                        size="small"
                                        style={{
                                            marginBottom: 16,
                                            background: 'linear-gradient(135deg, #f6ffed 0%, #f0f5ff 100%)',
                                            border: '1px solid #b7eb8f'
                                        }}
                                    >
                                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Withdrawal will be sent to:</Text>
                                            <Text strong style={{ fontSize: 14 }}>{account.bankName}</Text>
                                            <Text code>{account.accountNumber}</Text>
                                            <Text>{account.accountHolderName}</Text>
                                        </Space>
                                    </Card>
                                ) : null;
                            })()}

                            <div style={{ textAlign: "right", marginBottom: 16 }}>
                                <Button
                                    type="link"
                                    size="small"
                                    icon={<SettingOutlined />}
                                    onClick={() => {
                                        setWithdrawModalVisible(false);
                                        setBankManagementVisible(true);
                                    }}
                                >
                                    Manage Bank Accounts
                                </Button>
                            </div>

                            {/* Hidden fields to store bank account info */}
                            <Form.Item name="bankName" hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item name="accountNumber" hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item name="accountName" hidden>
                                <Input />
                            </Form.Item>

                            <Divider style={{ margin: "16px 0" }} />

                            {/* Amount Input */}
                            <Form.Item
                                name="amount"
                                label={<Text strong>Withdrawal Amount</Text>}
                                rules={[
                                    { required: true, message: "Please enter amount" },
                                    { type: "number", min: 50000, message: "Minimum 50,000 VND" },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    size="large"
                                    min={50000}
                                    max={walletData.balance}
                                    step={10000}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    parser={(value) => value.replace(/\,/g, "")}
                                    addonAfter="VND"
                                    placeholder="Enter amount"
                                />
                            </Form.Item>

                            <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
                                Available Balance: <Text strong style={{ color: '#52c41a' }}>{formatCurrency(walletData.balance)}</Text>
                            </Text>

                            {/* Quick Amount Buttons */}
                            <div style={{ marginBottom: 24 }}>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {quickAmounts.filter(a => a <= walletData.balance).map((amt) => (
                                        <Button
                                            key={amt}
                                            size="small"
                                            onClick={() => withdrawForm.setFieldValue("amount", amt)}
                                            style={{ borderRadius: 6 }}
                                        >
                                            {new Intl.NumberFormat("vi-VN").format(amt)}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <Form.Item style={{ marginBottom: 0, textAlign: "right", marginTop: 24 }}>
                                <Space>
                                    <Button onClick={() => {
                                        setWithdrawModalVisible(false);
                                        withdrawForm.resetFields();
                                        setSelectedBankAccount(null);
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        danger
                                        disabled={!selectedBankAccount}
                                    >
                                        Submit Request
                                    </Button>
                                </Space>
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>

            {/* Bank Account Management Modal */}
            <Modal
                // title="Bank Account Management"
                open={bankManagementVisible}
                onCancel={() => setBankManagementVisible(false)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <BankAccountManagement onAccountChange={fetchBankAccounts} />
            </Modal>

            {/* Transaction Detail Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <HistoryOutlined style={{ color: '#1890ff' }} />
                        <span>Transaction Details</span>
                    </div>
                }
                open={detailModalVisible}
                onCancel={() => {
                    setDetailModalVisible(false);
                    setSelectedTransaction(null);
                }}
                footer={[
                    <Button key="close" onClick={() => {
                        setDetailModalVisible(false);
                        setSelectedTransaction(null);
                    }}>
                        Close
                    </Button>
                ]}
                width={500}
            >
                {selectedTransaction && (
                    <div>
                        {/* Type & Status */}
                        <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
                            <Tag color={getTransactionStyle(selectedTransaction.type).tagColor} style={{ fontSize: 14, padding: '4px 12px' }}>
                                {selectedTransaction.type?.replace(/_/g, " ") || "UNKNOWN"}
                            </Tag>
                            <Tag color={selectedTransaction.status === "SUCCESS" ? "green" : selectedTransaction.status === "PENDING" ? "orange" : "red"}>
                                {selectedTransaction.status}
                            </Tag>
                        </div>

                        {/* Amount Card */}
                        <Card size="small" style={{ marginBottom: 16, background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                            <div style={{ textAlign: 'center' }}>
                                <Text type="secondary">Amount</Text>
                                <Title level={3} style={{ margin: '8px 0 0', color: getTransactionStyle(selectedTransaction.type).color }}>
                                    +{formatCurrency(Math.abs(selectedTransaction.amount))}
                                </Title>
                            </div>
                        </Card>

                        <Divider style={{ margin: '16px 0' }} />

                        {/* Detail Rows */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text type="secondary">Transaction ID</Text>
                                <Text strong>{selectedTransaction.transactionId || "-"}</Text>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text type="secondary">Balance After</Text>
                                <Text strong>{formatCurrency(selectedTransaction.balance)}</Text>
                            </div>

                            {selectedTransaction.orderCode && (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text type="secondary">Order Code</Text>
                                    <Text code>{selectedTransaction.orderCode}</Text>
                                </div>
                            )}

                            {selectedTransaction.orderId && (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text type="secondary">Order ID</Text>
                                    <Text>{selectedTransaction.orderId}</Text>
                                </div>
                            )}

                            {selectedTransaction.provider && (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text type="secondary">Provider</Text>
                                    <Text>{selectedTransaction.provider}</Text>
                                </div>
                            )}

                            {selectedTransaction.externalTransactionId && (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text type="secondary">External ID</Text>
                                    <Text code>{selectedTransaction.externalTransactionId}</Text>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text type="secondary">Date</Text>
                                <Text>{formatDate(selectedTransaction.createdAt)}</Text>
                            </div>
                        </div>

                        {/* Description Section */}
                        {(selectedTransaction.description || true) && (
                            <>
                                <Divider style={{ margin: '16px 0' }} />
                                <div>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Description</Text>
                                    <Card size="small" style={{ background: '#fafafa' }}>
                                        <Text>
                                            {selectedTransaction.description || (() => {
                                                const typeDescriptions = {
                                                    DEPOSIT: "Admin wallet deposit via payment gateway",
                                                    PURCHASE_AI_CREDITS: "Revenue from AI credits purchase",
                                                    COURSE_FEE: "Revenue from course purchase",
                                                    SUBSCRIPTION: "Revenue from subscription payment",
                                                    RESOURCE: "Revenue from resource template purchase",
                                                    WITHDRAWAL: "Withdrawal to bank account",
                                                };
                                                return typeDescriptions[selectedTransaction.type] || "Transaction completed";
                                            })()}
                                        </Text>
                                    </Card>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminWallet;
