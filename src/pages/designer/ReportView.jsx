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
  Badge
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
  RadialBarChart,
  RadialBar
} from "recharts";
import {
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  CalendarOutlined,
  TrophyOutlined,
  LineChartOutlined
} from "@ant-design/icons";
import { dashBoardService } from "../../service/dashBoardService";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Color palette for modern charts
const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];
const GRADIENT_COLORS = {
  primary: ['#6366F1', '#8B5CF6'],
  success: ['#10B981', '#34D399'],
  warning: ['#F59E0B', '#FBBF24'],
  danger: ['#EF4444', '#F87171']
};

export default function DesignerReportView() {
  const [groupBy, setGroupBy] = useState("month");
  const [range, setRange] = useState(null);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalRevenue = useMemo(() => series.reduce((sum, s) => sum + (s.revenue || 0), 0), [series]);
  const maxRevenue = useMemo(() => series.reduce((m, s) => Math.max(m, s.revenue || 0), 0), [series]);
  const minRevenue = useMemo(() => series.reduce((m, s) => Math.min(m, s.revenue || 0), Infinity), [series]);
  const avgRevenue = useMemo(() => series.length > 0 ? totalRevenue / series.length : 0, [totalRevenue, series]);

  // Calculate trend (comparing last two periods)
  const trend = useMemo(() => {
    if (series.length < 2) return 0;
    const current = series[series.length - 1]?.revenue || 0;
    const previous = series[series.length - 2]?.revenue || 0;
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }, [series]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const defaultStart = new Date(now);
      defaultStart.setDate(defaultStart.getDate() - 30);
      const startStr = range?.[0] ? range[0].format("YYYY-MM-DD") : defaultStart.toISOString().slice(0, 10);
      const endStr = range?.[1] ? range[1].format("YYYY-MM-DD") : now.toISOString().slice(0, 10);

      console.log("🔄 Fetching Sales Report...");
      console.log("📅 Parameters:", {
        startDate: startStr,
        endDate: endStr,
        groupBy: groupBy
      });

      const result = await dashBoardService.getSalesReport(startStr, endStr, groupBy);

      console.log("✅ API Response:", result);

      const type = result?.type;
      const data = result?.data || [];

      console.log("📊 Data type:", type);
      console.log("📈 Raw data:", data);

      let mapped = [];
      if (type === "yearly" || type === "year") mapped = data.map((d) => ({ label: String(d.year), revenue: Number(d.revenue) }));
      else if (type === "monthly" || type === "month") mapped = data.map((d) => ({ label: d.month, revenue: Number(d.revenue) }));
      else if (type === "daily" || type === "day") mapped = data.map((d) => ({ label: d.date, revenue: Number(d.revenue) }));

      console.log("🎯 Mapped data for charts:", mapped);

      setSeries(mapped);
    } catch (err) {
      const msg = err?.message || "Không thể tải báo cáo";
      console.error("❌ Error fetching report:", err);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy, range]);

  // Prepare data for pie chart (latest 5 periods in chronological order)
  const pieData = useMemo(() => {
    return series
      .slice(-5)
      .map((item, index) => ({
        name: item.label,
        value: item.revenue,
        fill: COLORS[index % COLORS.length]
      }));
  }, [series]);

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
          <LineChartOutlined style={{ marginRight: '12px', color: '#6366F1' }} />
          Sales Report
        </Title>
        <Text type="secondary">Detailed revenue analysis over time</Text>
      </div>

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
                { value: "day", label: "📅 Daily" },
                { value: "month", label: "📊 Monthly" },
                { value: "year", label: "📈 Yearly" },
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
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Total Revenue</span>}
              value={totalRevenue}
              precision={0}
              valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<DollarOutlined />}
              suffix="đ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              boxShadow: '0 4px 6px rgba(245, 87, 108, 0.3)'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Highest</span>}
              value={maxRevenue}
              precision={0}
              valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<TrophyOutlined />}
              suffix="đ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              boxShadow: '0 4px 6px rgba(79, 172, 254, 0.3)'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Average</span>}
              value={avgRevenue}
              precision={0}
              valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
              suffix="đ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: '12px',
              background: trend >= 0
                ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              boxShadow: `0 4px 6px ${trend >= 0 ? 'rgba(67, 233, 123, 0.3)' : 'rgba(250, 112, 154, 0.3)'}`
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Trend</span>}
              value={Math.abs(trend)}
              precision={1}
              valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
              prefix={trend >= 0 ? <RiseOutlined /> : <FallOutlined />}
              suffix="%"
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
                <Badge color="#6366F1" />
                <span>Revenue Over Time</span>
              </div>
            }
            bordered={false}
            style={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <Spin spinning={loading}>
              {series.length === 0 ? (
                <Empty description="No data available" style={{ padding: '60px 0' }} />
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  {groupBy === "day" ? (
                    <AreaChart data={series} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="label"
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value) => [`${value.toLocaleString()} đ`, 'Revenue']}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6366F1"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  ) : (
                    <BarChart data={series} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366F1" stopOpacity={1} />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="label"
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value) => [`${value.toLocaleString()} đ`, 'Revenue']}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="url(#barGradient)"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={60}
                      />
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
                <span>Latest 5 Periods</span>
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
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
      {/* <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Badge color="#10B981" />
                <span>Detailed Trend</span>
              </div>
            }
            bordered={false}
            style={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <Spin spinning={loading}>
              {series.length === 0 ? (
                <Empty description="No data available" style={{ padding: '60px 0' }} />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={series} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="label"
                      stroke="#6b7280"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
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
      </Row> */}

      {/* Data Summary */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Badge color="#F59E0B" />
                <span>Data Overview</span>
              </div>
            }
            bordered={false}
            style={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#6366F1' }}>
                    {series.length}
                  </div>
                  <div style={{ color: '#6b7280', marginTop: '8px' }}>Data Points</div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#EC4899' }}>
                    {minRevenue !== Infinity ? minRevenue.toLocaleString() : 0}đ
                  </div>
                  <div style={{ color: '#6b7280', marginTop: '8px' }}>Lowest Revenue</div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10B981' }}>
                    {maxRevenue.toLocaleString()}đ
                  </div>
                  <div style={{ color: '#6b7280', marginTop: '8px' }}>Highest Revenue</div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#F59E0B' }}>
                    {avgRevenue.toLocaleString()}đ
                  </div>
                  <div style={{ color: '#6b7280', marginTop: '8px' }}>Average Revenue</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
