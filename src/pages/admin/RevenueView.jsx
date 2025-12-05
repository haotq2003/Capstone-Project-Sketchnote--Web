import React, { useEffect, useMemo, useState } from "react";
import {
    Card,
    Row,
    Col,
    Statistic,
    Select,
    DatePicker,
    Space,
    Spin,
    Empty,
    message,
    Typography,
    Divider,
    Badge,
    Tabs
} from "antd";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart
} from "recharts";
import {
    DollarOutlined,
    RiseOutlined,
    FallOutlined,
    CalendarOutlined,
    TrophyOutlined,
    LineChartOutlined,
    BookOutlined,
    CrownOutlined,
    FileTextOutlined
} from "@ant-design/icons";
import { dashboardAminService } from "../../service/dashboardAdminService";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Color palette for modern charts
const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];
const REVENUE_TYPES = {
    all: { label: 'All Revenue', color: '#6366F1', icon: DollarOutlined },
    subscription: { label: 'Subscription', color: '#8B5CF6', icon: CrownOutlined },
    course: { label: 'Course', color: '#10B981', icon: BookOutlined },
    commission: { label: 'Resource Commission', color: '#EC4899', icon: FileTextOutlined }
};

export default function AdminRevenueView() {
    const [dashboardOverview, setDashboardOverview] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchOverview = async () => {
        try {
            setLoading(true);
            const result = await dashboardAminService.getRevenueDashboard();
            setDashboardOverview(result);
        } catch (err) {
            const msg = err?.message || "Failed to fetch dashboard overview";
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverview();
    }, []);

    const revenueStats = dashboardOverview?.revenueStats;

    // Process time series data for charts
    const chartData = useMemo(() => {
        if (!revenueStats) return [];

        // Assuming time series are arrays of { date: "YYYY-MM-DD", amount: number }
        // We need to merge them by date
        const dataMap = new Map();

        const addToMap = (series, key) => {
            series?.forEach(item => {
                // Adjust property names based on actual API response if needed
                // Assuming item has 'date' or 'period' and 'amount' or 'revenue'
                const date = item.date || item.period;
                const amount = item.amount || item.revenue || 0;

                if (!dataMap.has(date)) {
                    dataMap.set(date, { date, subscription: 0, token: 0, total: 0 });
                }
                const entry = dataMap.get(date);
                entry[key] = amount;
            });
        };

        addToMap(revenueStats.subscriptionRevenueTimeSeries, 'subscription');
        addToMap(revenueStats.tokenRevenueTimeSeries, 'token');
        addToMap(revenueStats.totalRevenueTimeSeries, 'total');

        return Array.from(dataMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [revenueStats]);

    const pieData = useMemo(() => {
        if (!revenueStats) return [];
        return [
            { name: 'Subscription', value: revenueStats.totalSubscriptionRevenue, fill: '#8B5CF6' },
            { name: 'Token', value: revenueStats.totalTokenRevenue, fill: '#10B981' }
        ].filter(item => item.value > 0);
    }, [revenueStats]);

    return (
        <div style={{ padding: '24px', minHeight: '100vh' }}>
            <Title level={2}>Revenue Overview</Title>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} sm={8}>
                    <Card bordered={false} style={{ background: "linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)", borderRadius: "12px" }}>
                        <Statistic
                            title={<span style={{ color: "rgba(255,255,255,0.9)" }}>Total Revenue</span>}
                            value={revenueStats?.totalRevenue || 0}
                            precision={0}
                            valueStyle={{ color: "#fff", fontSize: "30px", fontWeight: "bold" }}
                            suffix="đ"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card bordered={false} style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)", borderRadius: "12px" }}>
                        <Statistic
                            title={<span style={{ color: "rgba(255,255,255,0.9)" }}>Subscription Revenue</span>}
                            value={revenueStats?.totalSubscriptionRevenue || 0}
                            precision={0}
                            valueStyle={{ color: "#fff", fontSize: "30px", fontWeight: "bold" }}
                            suffix="đ"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card bordered={false} style={{ background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)", borderRadius: "12px" }}>
                        <Statistic
                            title={<span style={{ color: "rgba(255,255,255,0.9)" }}>Token Revenue</span>}
                            value={revenueStats?.totalTokenRevenue || 0}
                            precision={0}
                            valueStyle={{ color: "#fff", fontSize: "30px", fontWeight: "bold" }}
                            suffix="đ"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Revenue Over Time" bordered={false} style={{ borderRadius: '12px' }}>
                        <Spin spinning={loading}>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
                                    <Legend />
                                    <Bar dataKey="subscription" name="Subscription" fill="#8B5CF6" stackId="a" />
                                    <Bar dataKey="token" name="Token" fill="#10B981" stackId="a" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Spin>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Revenue Breakdown" bordered={false} style={{ borderRadius: '12px' }}>
                        <Spin spinning={loading}>
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Spin>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
