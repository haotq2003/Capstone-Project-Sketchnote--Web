import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Tag,
  Spin,
  DatePicker,
  Space,
  Button,
  Select,
  Input,
  message,
} from "antd";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingCartOutlined,
  UserOutlined,
  TeamOutlined,
  CrownOutlined,
  BookOutlined,
  FileImageOutlined,
  DollarOutlined,
  GiftOutlined,
  ThunderboltOutlined,
  FireOutlined,
  InboxOutlined,
  TrophyOutlined,
  BarChartOutlined,
  RiseOutlined,
  ReloadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { dashboardAminService } from "../../service/dashboardAdminService";
import { userService } from "../../service/userService";
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function AdminDashboard() {
  const [userData, setUserData] = useState([]);
  const [totalOrderAndEnrollments, setTotalOrderAndEnrollments] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [topResources, setTopResources] = useState([]);
  const [topDesigners, setTopDesigners] = useState([]);
  const [designerNames, setDesignerNames] = useState({});
  const [walletOverview, setWalletOverview] = useState(null);
  const [topTokenPackages, setTopTokenPackages] = useState([]);
  const [topSubscriptions, setTopSubscriptions] = useState([]);
  const [revenueStats, setRevenueStats] = useState(null);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [filterType, setFilterType] = useState('date'); // 'date', 'month', 'year'

  useEffect(() => {
    dashboardAminService.fetchUser().then(setUserData);
    dashboardAminService.fetchTotalOrderAndEnrollments().then(setTotalOrderAndEnrollments);
    dashboardAminService.fetchTopCourses(5).then(setTopCourses);
    dashboardAminService.fetchTopResources(5).then(setTopResources);
    dashboardAminService.getDashboardOverview().then(setWalletOverview);
    dashboardAminService.getTopTokenPackages(5).then(setTopTokenPackages);
    dashboardAminService.getTopSubscriptions(5).then(setTopSubscriptions);
    dashboardAminService.fetchTopDesigners(5).then((designers) => {
      setTopDesigners(designers);
      // Fetch designer names
      designers.forEach(designer => {
        userService.fetchUserById(designer.designerId)
          .then(response => {
            setDesignerNames(prev => ({
              ...prev,
              [designer.designerId]: `${response.result.firstName} ${response.result.lastName}`
            }));
          })
          .catch(error => {
            console.error(`Failed to fetch designer ${designer.designerId}:`, error);
          });
      });
    });

    // Fetch initial revenue data
    fetchRevenueData();
  }, []);

  // Auto-fetch when filter changes
  useEffect(() => {
    if (dateRange && dateRange[0]) {
      handleApplyFilter();
    }
  }, [dateRange, filterType]);

  const fetchRevenueData = (start = null, end = null, groupBy = 'day') => {
    console.log('🔄 [Revenue API] Fetching with params:', { start, end, groupBy });
    setLoadingRevenue(true);
    dashboardAminService.getRevenueDashboard(start, end, groupBy, null)
      .then(data => {
        console.log('✅ [Revenue API] Response received:', data);
        console.log('📊 [Revenue Stats]:', data?.revenueStats);
        setRevenueStats(data?.revenueStats);
      })
      .catch(err => {
        console.error('❌ [Revenue API] Error:', err);
        console.error('Error details:', err.response?.data || err.message);
        message.error('Failed to load revenue data');
      })
      .finally(() => setLoadingRevenue(false));
  };

  const handleApplyFilter = () => {
    if (!dateRange || !dateRange[0]) {
      return;
    }

    let start = null;
    let end = null;
    let groupBy = 'day';

    if (filterType === 'date' && dateRange[1]) {
      start = dateRange[0].format('YYYY-MM-DD');
      end = dateRange[1].format('YYYY-MM-DD');
      groupBy = 'day';
    } else if (filterType === 'month') {
      start = dateRange[0].startOf('month').format('YYYY-MM-DD');
      end = dateRange[0].endOf('month').format('YYYY-MM-DD');
      groupBy = 'month';
    } else if (filterType === 'year') {
      start = dateRange[0].startOf('year').format('YYYY-MM-DD');
      end = dateRange[0].endOf('year').format('YYYY-MM-DD');
      groupBy = 'year';
    }

    fetchRevenueData(start, end, groupBy);
  };

  const handleClearFilter = () => {
    setDateRange(null);
    fetchRevenueData();
  };

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
    setDateRange(null);
  };

  // ================= DESIGNER TABLE COLUMNS =================
  const designerColumns = [
    {
      title: "#",
      width: 60,
      render: (_, __, index) => (
        <Tag
          color={
            index === 0
              ? "gold"
              : index === 1
                ? "silver"
                : index === 2
                  ? "blue"
                  : "purple"
          }
          style={{ fontWeight: 600 }}
        >
          {index + 1}
        </Tag>
      ),
    },
    {
      title: "Designer",
      dataIndex: "designerId",
      render: (id) => (
        <span style={{ fontWeight: 600 }}>
          <CrownOutlined style={{ marginRight: 6, color: "#faad14" }} />
          {designerNames[id] || `Designer #${id}`}
        </span>
      ),
    },
    {
      title: "Total Revenue",
      dataIndex: "totalRevenue",
      render: (value) => (
        <Tag color="green" style={{ fontSize: 14, padding: "6px 12px" }}>
          {value.toLocaleString()} ₫
        </Tag>
      ),
    },
  ];

  // Process chart data (filtering is done server-side via API)
  const chartData = React.useMemo(() => processChartData(revenueStats), [revenueStats]);

  const pieData = React.useMemo(() => processPieData(revenueStats), [revenueStats]);

  return (
    <>


      {/* ==================== TOP STATISTICS ==================== */}
      {/* ==================== TOP STATISTICS ==================== */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card
            style={{
              borderLeft: "4px solid #1677ff",
              backgroundColor: "#e6f4ff",
              transition: "all 0.3s",
              cursor: "pointer",
            }}
            hoverable
            bodyStyle={{ padding: 20 }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <Statistic
              title="Total Users"
              value={userData?.totalUsers || 0}
              prefix={<UserOutlined style={{ color: "#1677ff" }} />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card
            style={{
              borderLeft: "4px solid #52c41a",
              backgroundColor: "#f6ffed",
              transition: "all 0.3s",
              cursor: "pointer",
            }}
            hoverable
            bodyStyle={{ padding: 20 }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <Statistic
              title="Total Customers"
              value={userData?.customers || 0}
              prefix={<TeamOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card
            style={{
              borderLeft: "4px solid #faad14",
              backgroundColor: "#fff7e6",
              transition: "all 0.3s",
              cursor: "pointer",
            }}
            hoverable
            bodyStyle={{ padding: 20 }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <Statistic
              title="Total Designers"
              value={userData?.designers || 0}
              prefix={<CrownOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card
            style={{
              borderLeft: "4px solid #722ed1",
              backgroundColor: "#f9f0ff",
              transition: "all 0.3s",
              cursor: "pointer",
            }}
            hoverable
            bodyStyle={{ padding: 20 }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <Statistic
              title="Course Balance"
              value={walletOverview?.courseBalance || 0}
              precision={0}
              suffix="₫"
              valueStyle={{ color: '#722ed1' }}
              prefix={<BookOutlined style={{ color: "#722ed1" }} />}
            />
          </Card>
        </Col>

        {/* Wallet Overview Cards moved here */}
        {walletOverview && (
          <>
            <Col span={6}>
              <Card
                style={{
                  borderLeft: "4px solid #13c2c2",
                  backgroundColor: "#e6fffb",
                  transition: "all 0.3s",
                  cursor: "pointer",
                }}
                hoverable
                bodyStyle={{ padding: 20 }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <Statistic
                  title="Total Balance"
                  value={walletOverview.totalBalance}
                  precision={0}
                  suffix="₫"
                  valueStyle={{ color: '#13c2c2' }}
                  prefix={<DollarOutlined style={{ fontSize: 20, color: "#13c2c2" }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                style={{
                  borderLeft: "4px solid #ff4d4f",
                  backgroundColor: "#fff1f0",
                  transition: "all 0.3s",
                  cursor: "pointer",
                }}
                hoverable
                bodyStyle={{ padding: 20 }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <Statistic
                  title="Subscription Balance"
                  value={walletOverview.subscriptionBalance}
                  precision={0}
                  suffix="₫"
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<CrownOutlined style={{ color: "#ff4d4f" }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                style={{
                  borderLeft: "4px solid #2f54eb",
                  backgroundColor: "#f0f5ff",
                  transition: "all 0.3s",
                  cursor: "pointer",
                }}
                hoverable
                bodyStyle={{ padding: 20 }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <Statistic
                  title="Token Balance"
                  value={walletOverview.tokenBalance}
                  precision={0}
                  suffix="₫"
                  valueStyle={{ color: '#2f54eb' }}
                  prefix={<BookOutlined style={{ color: "#2f54eb" }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                style={{
                  borderLeft: "4px solid #eb2f96",
                  backgroundColor: "#fff0f6",
                  transition: "all 0.3s",
                  cursor: "pointer",
                }}
                hoverable
                bodyStyle={{ padding: 20 }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <Statistic
                  title="User Wallet Balance"
                  value={walletOverview.totalUserWalletBalance}
                  precision={0}
                  suffix="₫"
                  valueStyle={{ color: '#eb2f96' }}
                  prefix={<UserOutlined style={{ color: "#eb2f96" }} />}
                />
              </Card>
            </Col>
          </>
        )}
      </Row>

      {/* ==================== TOP SUBSCRIPTIONS & TOKENS ==================== */}
      <Row gutter={16} style={{ marginTop: 32 }}>
        <Col span={12}>
          <Card title={<><GiftOutlined style={{ marginRight: 8, color: "#faad14" }} />Top Subscriptions</>}>
            {topSubscriptions?.map((item, index) => (
              <Row
                key={item.planId}
                justify="space-between"
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Text strong>
                  <CrownOutlined style={{ color: "#faad14", marginRight: 8 }} />
                  {index + 1}. {item.planName}
                </Text>
                <div>
                  <Tag color="gold">Count: {item.purchaseCount}</Tag>
                  <Tag color="green">{item.totalRevenue?.toLocaleString()} ₫</Tag>
                </div>
              </Row>
            ))}
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<><ThunderboltOutlined style={{ marginRight: 8, color: "#13c2c2" }} />Top Token Packages</>}>
            {topTokenPackages?.length > 0 ? (
              topTokenPackages.map((item, index) => (
                <Row
                  key={index}
                  justify="space-between"
                  style={{
                    padding: "14px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <Text strong>
                    <BookOutlined style={{ color: "#13c2c2", marginRight: 8 }} />
                    {index + 1}. {item.packageName || "Package"}
                  </Text>
                  <Tag color="cyan">Sold: {item.purchaseCount || 0}</Tag>
                </Row>
              ))
            ) : (
              <div style={{ padding: 20, textAlign: "center" }}>No data</div>
            )}
          </Card>
        </Col>
      </Row>

      {/* ==================== TOP COURSES + RESOURCES ==================== */}
      <Row gutter={16} style={{ marginTop: 32 }}>
        <Col span={12}>
          <Card title={<><FireOutlined style={{ marginRight: 8, color: "#ff4d4f" }} />Top Courses</>}>
            {topCourses?.map((item, index) => (
              <Row
                key={item.id}
                justify="space-between"
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Text strong>
                  <BookOutlined style={{ color: "#722ed1", marginRight: 8 }} />
                  {index + 1}. {item.name}
                </Text>
                <Tag color="purple">Enrolls: {item.count}</Tag>
              </Row>
            ))}
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<><InboxOutlined style={{ marginRight: 8, color: "#13c2c2" }} />Top Resources</>}>
            {topResources?.map((item, index) => (
              <Row
                key={item.id}
                justify="space-between"
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Text strong>
                  <FileImageOutlined
                    style={{ color: "#13c2c2", marginRight: 8 }}
                  />
                  {index + 1}. {item.name}
                </Text>
                <Tag color="cyan">Sold: {item.count}</Tag>
              </Row>
            ))}
          </Card>
        </Col>
      </Row>

      {/* ==================== TOP DESIGNERS ==================== */}
      <Row style={{ marginTop: 32 }}>
        <Col span={24}>
          <Card title={<><TrophyOutlined style={{ marginRight: 8, color: "#faad14" }} />Top Designers (Revenue)</>}>
            <Table
              dataSource={topDesigners}
              rowKey="designerId"
              pagination={false}
              columns={designerColumns}
            />
          </Card>
        </Col>
      </Row>

      {/* ==================== REVENUE CHARTS ==================== */}
      {/* Date Filter for Revenue */}
      <Card style={{ marginTop: 32, marginBottom: 16 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space size="middle" wrap>
            <CalendarOutlined style={{ fontSize: 20, color: "#1677ff" }} />
            <Text strong>Filter Revenue:</Text>

            {/* Quick Filter Buttons */}
            <Button
              onClick={() => {
                const today = dayjs();
                setFilterType('date');
                setDateRange([today, today]);
              }}
            >
              Today
            </Button>

            <Button
              onClick={() => {
                const today = dayjs();
                const weekStart = today.startOf('week');
                const weekEnd = today.endOf('week');
                setFilterType('date');
                setDateRange([weekStart, weekEnd]);
              }}
            >
              This Week
            </Button>

            <Button
              onClick={() => {
                const today = dayjs();
                setFilterType('month');
                setDateRange([today]);
              }}
            >
              This Month
            </Button>

            <Button
              onClick={() => {
                const today = dayjs();
                setFilterType('year');
                setDateRange([today]);
              }}
            >
              This Year
            </Button>

            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setDateRange(null);
                fetchRevenueData();
              }}
            >
              All Time
            </Button>
          </Space>

          {/* Custom Filter */}
          <Space size="middle" wrap>
            <Text type="secondary">Custom:</Text>
            <Select
              value={filterType}
              onChange={handleFilterTypeChange}
              style={{ width: 120 }}
            >
              <Select.Option value="date">By Date</Select.Option>
              <Select.Option value="month">By Month</Select.Option>
              <Select.Option value="year">By Year</Select.Option>
            </Select>

            {filterType === 'date' && (
              <RangePicker
                style={{ width: 300 }}
                placeholder={["Start Date", "End Date"]}
                format="YYYY-MM-DD"
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
              />
            )}

            {filterType === 'month' && (
              <DatePicker
                picker="month"
                style={{ width: 200 }}
                placeholder="Select Month"
                format="YYYY-MM"
                value={dateRange?.[0]}
                onChange={(date) => setDateRange(date ? [date] : null)}
              />
            )}

            {filterType === 'year' && (
              <DatePicker
                picker="year"
                style={{ width: 150 }}
                placeholder="Select Year"
                format="YYYY"
                value={dateRange?.[0]}
                onChange={(date) => setDateRange(date ? [date] : null)}
              />
            )}
          </Space>

          {/* Display current date range */}
          {chartData.length > 0 && (
            <div style={{ padding: '6px 12px', background: '#f0f5ff', borderRadius: 6, display: 'inline-block' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                📊 Viewing: <Text strong style={{ color: '#1677ff' }}>
                  {chartData[0]?.date} → {chartData[chartData.length - 1]?.date}
                </Text>
              </Text>
            </div>
          )}
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title={<><BarChartOutlined style={{ marginRight: 8, color: "#1677ff" }} />Revenue Over Time</>} bordered={false} style={{ borderRadius: '12px' }}>
            <Spin spinning={loadingRevenue}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
                  <Legend />
                  <Bar dataKey="subscription" name="Subscription" fill="#3B82F6" stackId="a" />
                  <Bar dataKey="token" name="Token" fill="#F59E0B" stackId="a" />
                  <Bar dataKey="course" name="Course" fill="#8B5CF6" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </Spin>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<><RiseOutlined style={{ marginRight: 8, color: "#52c41a" }} />Revenue Breakdown</>} bordered={false} style={{ borderRadius: '12px' }}>
            <Spin spinning={loadingRevenue}>
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
    </>
  );
}

// Helper functions for chart data processing
function processChartData(revenueStats) {
  if (!revenueStats) return [];

  const dataMap = new Map();

  const addToMap = (series, key) => {
    series?.forEach(item => {
      const date = item.date || item.period;
      const amount = item.amount || item.revenue || 0;

      if (!dataMap.has(date)) {
        dataMap.set(date, { date, subscription: 0, token: 0, course: 0, total: 0 });
      }
      const entry = dataMap.get(date);
      entry[key] = amount;
    });
  };

  addToMap(revenueStats.subscriptionRevenueTimeSeries, 'subscription');
  addToMap(revenueStats.tokenRevenueTimeSeries, 'token');
  addToMap(revenueStats.courseRevenueTimeSeries, 'course');
  addToMap(revenueStats.totalRevenueTimeSeries, 'total');

  return Array.from(dataMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
}

function processPieData(revenueStats) {
  if (!revenueStats) return [];
  return [
    { name: 'Subscription', value: revenueStats.totalSubscriptionRevenue || 0, fill: '#3B82F6' },
    { name: 'Token', value: revenueStats.totalTokenRevenue || 0, fill: '#F59E0B' },
    { name: 'Course', value: revenueStats.totalCourseRevenue || 0, fill: '#8B5CF6' }
  ].filter(item => item.value > 0);
}
