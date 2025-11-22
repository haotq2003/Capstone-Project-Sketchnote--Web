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
    const [groupBy, setGroupBy] = useState("month");
    const [range, setRange] = useState(null);
    const [revenueType, setRevenueType] = useState("all");
    const [revenueData, setRevenueData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Process data based on selected type
    const processedData = useMemo(() => {
        if (!revenueData) return [];

        const dataMap = new Map();

        // Helper function to add revenue to map
        const addToMap = (array, key) => {
            array?.forEach(item => {
                const period = item.period;
                const amount = Number(item.amount) || 0;

                if (!dataMap.has(period)) {
                    dataMap.set(period, { period, course: 0, subscription: 0, commission: 0, total: 0 });
                }

                const current = dataMap.get(period);
                current[key] = amount;
                current.total += amount;
            });
        };

        // Process all revenue types
        addToMap(revenueData.courseRevenue, 'course');
        addToMap(revenueData.subscriptionRevenue, 'subscription');
        addToMap(revenueData.resourceCommissionRevenue, 'commission');

        // Convert to array and sort by period
        return Array.from(dataMap.values()).sort((a, b) => a.period.localeCompare(b.period));
    }, [revenueData]);

    // Get data for selected revenue type
    const chartData = useMemo(() => {
        if (revenueType === 'all') {
            return processedData.map(item => ({
                label: item.period,
                revenue: item.total,
                course: item.course,
                subscription: item.subscription,
                commission: item.commission
            }));
        } else {
            const typeMap = {
                'course': 'course',
                'subscription': 'subscription',
                'commission': 'commission'
            };
            return processedData.map(item => ({
                label: item.period,
                revenue: item[typeMap[revenueType]]
            }));
        }
    }, [processedData, revenueType]);

    // Calculate statistics
    const totalRevenue = useMemo(() => {
        if (!revenueData) return 0;
        if (revenueType === 'all') {
            return revenueData.totalCourseRevenue + revenueData.totalSubscriptionRevenue + revenueData.totalResourceCommissionRevenue;
        } else if (revenueType === 'course') {
            return revenueData.totalCourseRevenue;
        } else if (revenueType === 'subscription') {
            return revenueData.totalSubscriptionRevenue;
        } else {
            return revenueData.totalResourceCommissionRevenue;
        }
    }, [revenueData, revenueType]);

    const maxRevenue = useMemo(() => chartData.reduce((m, s) => Math.max(m, s.revenue || 0), 0), [chartData]);
    const minRevenue = useMemo(() => chartData.reduce((m, s) => Math.min(m, s.revenue || 0), Infinity), [chartData]);
    const avgRevenue = useMemo(() => chartData.length > 0 ? chartData.reduce((sum, s) => sum + (s.revenue || 0), 0) / chartData.length : 0, [chartData]);

    // Calculate trend
    const trend = useMemo(() => {
        if (chartData.length < 2) return 0;
        const current = chartData[chartData.length - 1]?.revenue || 0;
        const previous = chartData[chartData.length - 2]?.revenue || 0;
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    }, [chartData]);

    const fetchRevenue = async () => {
        try {
            setLoading(true);
            const now = new Date();
            const defaultStart = new Date(now);
            defaultStart.setMonth(defaultStart.getMonth() - 6);
            const startStr = range?.[0] ? range[0].format("YYYY-MM-DD") : defaultStart.toISOString().slice(0, 10);
            const endStr = range?.[1] ? range[1].format("YYYY-MM-DD") : now.toISOString().slice(0, 10);

            console.log("🔄 Fetching Revenue Report...");
            console.log("📅 Parameters:", {
                startDate: startStr,
                endDate: endStr,
                groupBy: groupBy,
                type: revenueType
            });

            const result = await dashboardAminService.fetchRevenue(startStr, endStr, groupBy, revenueType);

            console.log("✅ API Response:", result);

            setRevenueData(result);
        } catch (err) {
            const msg = err?.message || "Không thể tải báo cáo doanh thu";
            console.error("❌ Error fetching revenue:", err);
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenue();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupBy, range, revenueType]);

    // Prepare data for pie chart (revenue breakdown by type)
    const pieData = useMemo(() => {
        if (!revenueData) return [];
        return [
            { name: 'Course', value: revenueData.totalCourseRevenue, fill: REVENUE_TYPES.course.color },
            { name: 'Subscription', value: revenueData.totalSubscriptionRevenue, fill: REVENUE_TYPES.subscription.color },
            { name: 'Commission', value: revenueData.totalResourceCommissionRevenue, fill: REVENUE_TYPES.commission.color }
        ].filter(item => item.value > 0);
    }, [revenueData]);

    return (
        <div style={{ padding: '24px', background: '', minHeight: '100vh' }}>
            {/* Header */}
            {/* <div style={{ marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
                    <LineChartOutlined style={{ marginRight: '12px', color: '#6366F1' }} />
                    Revenue Dashboard
                </Title>
                <Text type="secondary">Comprehensive revenue analysis and insights</Text>
            </div> */}

            {/* Filters */}
            <Card
                style={{
                    marginBottom: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
            >
                <Space wrap size="large">
                    <div>
                        <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                            <CalendarOutlined style={{ marginRight: '8px' }} />
                            Group By
                        </Text>
                        <Select
                            value={groupBy}
                            onChange={setGroupBy}
                            style={{ width: 180 }}
                            size="large"
                            options={[
                                { value: "day", label: " Daily" },
                                { value: "month", label: " Monthly" },
                                { value: "year", label: " Yearly" },
                            ]}
                        />
                    </div>
                    <div>
                        <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                            Revenue Type
                        </Text>
                        <Select
                            value={revenueType}
                            onChange={setRevenueType}
                            style={{ width: 220 }}
                            size="large"
                            options={[
                                { value: "all", label: " All Revenue" },
                                { value: "subscription", label: " Subscription" },
                                { value: "course", label: " Course" },
                                { value: "commission", label: "Resource Commission" },
                            ]}
                        />
                    </div>
                    <div>
                        <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                            Date Range
                        </Text>
                        <RangePicker
                            value={range}
                            onChange={setRange}
                            size="large"
                            style={{ width: 300 }}
                        />
                    </div>
                </Space>
            </Card>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
  {/* Total Revenue */}
  <Col xs={24} sm={12} lg={8}>
    <Card
      bordered={false}
      hoverable
      style={{
        borderRadius: "12px",
        background: "linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)",
        boxShadow: "0 4px 12px rgba(255, 94, 98, 0.35)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      bodyStyle={{ padding: 24 }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-6px)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translateY(0)")
      }
    >
      <Statistic
        title={
          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
            Total Revenue
          </span>
        }
        value={totalRevenue}
        precision={0}
        valueStyle={{
          color: "#fff",
          fontSize: "30px",
          fontWeight: "bold",
        }}
        prefix={<DollarOutlined style={{ color: "#fff" }} />}
        suffix="đ"
      />
    </Card>
  </Col>

  {/* Highest */}
  <Col xs={24} sm={12} lg={8}>
    <Card
      bordered={false}
      hoverable
      style={{
        borderRadius: "12px",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        boxShadow: "0 4px 12px rgba(245, 87, 108, 0.35)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      bodyStyle={{ padding: 24 }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-6px)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translateY(0)")
      }
    >
      <Statistic
        title={
          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
            Highest
          </span>
        }
        value={maxRevenue}
        precision={0}
        valueStyle={{
          color: "#fff",
          fontSize: "30px",
          fontWeight: "bold",
        }}
        prefix={<TrophyOutlined style={{ color: "#fff" }} />}
        suffix="đ"
      />
    </Card>
  </Col>

  {/* Average */}
  <Col xs={24} sm={12} lg={8}>
    <Card
      bordered={false}
      hoverable
      style={{
        borderRadius: "12px",
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        boxShadow: "0 4px 12px rgba(79, 172, 254, 0.35)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      bodyStyle={{ padding: 24 }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-6px)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translateY(0)")
      }
    >
      <Statistic
        title={
          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
            Average
          </span>
        }
        value={avgRevenue}
        precision={0}
        valueStyle={{
          color: "#fff",
          fontSize: "30px",
          fontWeight: "bold",
        }}
        suffix="đ"
      />
    </Card>
  </Col>
</Row>


            {/* Main Charts */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} lg={16}>
                    <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Badge color={REVENUE_TYPES[revenueType].color} />
                                <span>{REVENUE_TYPES[revenueType].label} Over Time</span>
                            </div>
                        }
                        bordered={false}
                        style={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    >
                        <Spin spinning={loading}>
                            {chartData.length === 0 ? (
                                <Empty description="No data available" style={{ padding: '60px 0' }} />
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    {revenueType === 'all' ? (
                                        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="courseGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                                                </linearGradient>
                                                <linearGradient id="subscriptionGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                                                </linearGradient>
                                                <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 12 }} />
                                            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e7eb',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                }}
                                                formatter={(value) => `${value.toLocaleString()} đ`}
                                            />
                                            <Legend />
                                            <Area type="monotone" dataKey="course" stroke="#10B981" fill="url(#courseGradient)" name="Course" />
                                            <Area type="monotone" dataKey="subscription" stroke="#8B5CF6" fill="url(#subscriptionGradient)" name="Subscription" />
                                            <Area type="monotone" dataKey="commission" stroke="#EC4899" fill="url(#commissionGradient)" name="Commission" />
                                        </ComposedChart>
                                    ) : (
                                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={REVENUE_TYPES[revenueType].color} stopOpacity={1} />
                                                    <stop offset="100%" stopColor={REVENUE_TYPES[revenueType].color} stopOpacity={0.6} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 12 }} />
                                            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e7eb',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                }}
                                                formatter={(value) => [`${value.toLocaleString()} đ`, 'Revenue']}
                                            />
                                            <Bar dataKey="revenue" fill="url(#barGradient)" radius={[8, 8, 0, 0]} maxBarSize={60} />
                                        </BarChart>
                                    )}
                                </ResponsiveContainer>
                            )}
                        </Spin>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Badge color="#EC4899" />
                                <span>Revenue Breakdown</span>
                            </div>
                        }
                        bordered={false}
                        style={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    >
                        <Spin spinning={loading}>
                            {pieData.length === 0 ? (
                                <Empty description="No data available" style={{ padding: '60px 0' }} />
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                            outerRadius={120}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                            }}
                                            formatter={(value) => `${value.toLocaleString()} đ`}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </Spin>
                    </Card>
                </Col>
            </Row>

            {/* Trend Line Chart */}
            <Row gutter={[16, 16]}>
                <Col xs={24}>
                    <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Badge color="#10B981" />
                                <span>Detailed Trend Analysis</span>
                            </div>
                        }
                        bordered={false}
                        style={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    >
                        <Spin spinning={loading}>
                            {chartData.length === 0 ? (
                                <Empty description="No data available" style={{ padding: '60px 0' }} />
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 12 }} />
                                        <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                            }}
                                            formatter={(value) => [`${value.toLocaleString()} đ`, 'Revenue']}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10B981"
                                            strokeWidth={3}
                                            dot={{ fill: '#10B981', r: 5 }}
                                            activeDot={{ r: 8 }}
                                            name="Revenue"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </Spin>
                    </Card>
                </Col>
            </Row>

            {/* Revenue Summary by Type */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24}>
                    <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Badge color="#F59E0B" />
                                <span>Revenue Summary by Type</span>
                            </div>
                        }
                        bordered={false}
                        style={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    >
                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={8}>
                                <div style={{ textAlign: 'center', padding: '20px', borderRadius: '8px', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                                    <BookOutlined style={{ fontSize: '36px', color: '#fff', marginBottom: '12px' }} />
                                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>
                                        {revenueData?.totalCourseRevenue?.toLocaleString() || 0}đ
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.9)', marginTop: '8px', fontSize: '16px' }}>Course Revenue</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={8}>
                                <div style={{ textAlign: 'center', padding: '20px', borderRadius: '8px', background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}>
                                    <CrownOutlined style={{ fontSize: '36px', color: '#fff', marginBottom: '12px' }} />
                                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>
                                        {revenueData?.totalSubscriptionRevenue?.toLocaleString() || 0}đ
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.9)', marginTop: '8px', fontSize: '16px' }}>Subscription Revenue</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={8}>
                                <div style={{ textAlign: 'center', padding: '20px', borderRadius: '8px', background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' }}>
                                    <FileTextOutlined style={{ fontSize: '36px', color: '#fff', marginBottom: '12px' }} />
                                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>
                                        {revenueData?.totalResourceCommissionRevenue?.toLocaleString() || 0}đ
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.9)', marginTop: '8px', fontSize: '16px' }}>Commission Revenue</div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
