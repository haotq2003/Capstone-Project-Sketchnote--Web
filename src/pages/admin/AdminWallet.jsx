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
import dayjs from "dayjs";

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
  const [filterType, setFilterType] = useState('date');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = () => {
    dashboardAminService.fetchUser().then(setUserData);
    dashboardAminService.fetchTotalOrderAndEnrollments().then(setTotalOrderAndEnrollments);
    dashboardAminService.fetchTopCourses(5).then(setTopCourses);
    dashboardAminService.fetchTopResources(5).then(setTopResources);
    dashboardAminService.getDashboardOverview().then(setWalletOverview);
    dashboardAminService.getTopTokenPackages(5).then(setTopTokenPackages);
    dashboardAminService.getTopSubscriptions(5).then(setTopSubscriptions);
    dashboardAminService.fetchTopDesigners(5).then((designers) => {
      setTopDesigners(designers);
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
  };

  const fetchRevenueData = (params = {}) => {
    setLoadingRevenue(true);
    dashboardAminService.getRevenueDashboard(params)
      .then(data => {
        setRevenueStats(data?.revenueStats);
      })
      .catch(err => {
        console.error('Failed to fetch revenue:', err);
        message.error('Failed to load revenue data');
      })
      .finally(() => setLoadingRevenue(false));
  };

  const handleApplyFilter = () => {
    if (!dateRange) {
      message.warning('Please select a date/month/year');
      return;
    }

    const params = {};

    if (filterType === 'date' && dateRange[0] && dateRange[1]) {
      params.startDate = dateRange[0].format('YYYY-MM-DD');
      params.endDate = dateRange[1].format('YYYY-MM-DD');
    } else if (filterType === 'month' && dateRange[0]) {
      const start = dateRange[0].startOf('month');
      const end = dateRange[0].endOf('month');
      params.startDate = start.format('YYYY-MM-DD');
      params.endDate = end.format('YYYY-MM-DD');
    } else if (filterType === 'year' && dateRange[0]) {
      const start = dateRange[0].startOf('year');
      const end = dateRange[0].endOf('year');
      params.startDate = start.format('YYYY-MM-DD');
      params.endDate = end.format('YYYY-MM-DD');
    }

    fetchRevenueData(params);
  };

  const handleClearFilter = () => {
    setDateRange(null);
    fetchRevenueData();
  };

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
    setDateRange(null);
  };

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

  const chartData = React.useMemo(() => processChartData(revenueStats), [revenueStats]);
  const pieData = React.useMemo(() => processPieData(revenueStats), [revenueStats]);

  const getDisplayPeriod = () => {
    if (!chartData || chartData.length === 0) return null;
    return {
      start: chartData[0]?.date,
      end: chartData[chartData.length - 1]?.date
    };
  };

  const displayPeriod = getDisplayPeriod();

  return (
    <>
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

      {/* ==================== REVENUE FILTER ==================== */}
      <Card 
        style={{ 
          marginTop: 32, 
          marginBottom: 16,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarOutlined style={{ fontSize: 20, color: "#1677ff" }} />
              <Text strong style={{ fontSize: 15 }}>Filter Revenue:</Text>
            </div>
            
            <Select
              value={filterType}
              onChange={handleFilterTypeChange}
              style={{ width: 140 }}
              size="large"
            >
              <Select.Option value="date">📅 By Date Range</Select.Option>
              <Select.Option value="month">📆 By Month</Select.Option>
              <Select.Option value="year">🗓️ By Year</Select.Option>
            </Select>

            {filterType === 'date' && (
              <RangePicker
                style={{ width: 320 }}
                size="large"
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
                size="large"
                placeholder="Select Month"
                format="YYYY-MM"
                value={dateRange?.[0]}
                onChange={(date) => setDateRange(date ? [date] : null)}
              />
            )}

            {filterType === 'year' && (
              <DatePicker
                picker="year"
                style={{ width: 180 }}
                size="large"
                placeholder="Select Year"
                format="YYYY"
                value={dateRange?.[0]}
                onChange={(date) => setDateRange(date ? [date] : null)}
              />
            )}
            
            <Button
              type="primary"
              icon={<BarChartOutlined />}
              onClick={handleApplyFilter}
              size="large"
              disabled={!dateRange}
            >
              Apply Filter
            </Button>

            {dateRange && (
              <Button
                icon={<ReloadOutlined />}
                onClick={handleClearFilter}
                size="large"
              >
                Clear
              </Button>
            )}
          </div>

          {displayPeriod && (
            <div 
              style={{ 
                padding: '12px 16px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 8,
                display: 'inline-block'
              }}
            >
              <Text style={{ color: 'white', fontSize: 14 }}>
                📊 Viewing: <Text strong style={{ color: 'white' }}>
                  {displayPeriod.start} → {displayPeriod.end}
                </Text>
              </Text>
            </div>
          )}
        </Space>
      </Card>

      {/* ==================== REVENUE CHARTS ==================== */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChartOutlined style={{ color: "#1677ff", fontSize: 18 }} />
                <span>Revenue Over Time</span>
              </div>
            }
            bordered={false} 
            style={{ 
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Spin spinning={loadingRevenue} tip="Loading revenue data...">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip 
                      formatter={(value) => `${value.toLocaleString()} ₫`}
                      contentStyle={{ 
                        borderRadius: 8,
                        border: '1px solid #e8e8e8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: 20 }}
                      iconType="circle"
                    />
                    <Bar 
                      dataKey="subscription" 
                      name="Subscription" 
                      fill="#8B5CF6" 
                      stackId="a"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar 
                      dataKey="token" 
                      name="Token" 
                      fill="#10B981" 
                      stackId="a"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar 
                      dataKey="course" 
                      name="Course" 
                      fill="#722ed1" 
                      stackId="a"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ 
                  height: 420, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#999'
                }}>
                  No data available for the selected period
                </div>
              )}
            </Spin>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiseOutlined style={{ color: "#52c41a", fontSize: 18 }} />
                <span>Revenue Breakdown</span>
              </div>
            }
            bordered={false} 
            style={{ 
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Spin spinning={loadingRevenue} tip="Loading...">
              {pieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        dataKey="value"
                        labelLine={{ stroke: '#999', strokeWidth: 1 }}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => `${value.toLocaleString()} ₫`}
                        contentStyle={{ 
                          borderRadius: 8,
                          border: '1px solid #e8e8e8',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div style={{ marginTop: 20, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                    {pieData.map((item, index) => (
                      <div 
                        key={index}
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 12,
                          padding: '8px 12px',
                          borderRadius: 6,
                          background: '#fafafa'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div 
                            style={{ 
                              width: 12, 
                              height: 12, 
                              borderRadius: '50%', 
                              background: item.fill 
                            }}
                          />
                          <Text strong>{item.name}</Text>
                        </div>
                        <Text style={{ color: item.fill, fontWeight: 600 }}>
                          {item.value.toLocaleString()} ₫
                        </Text>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ 
                  height: 420, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#999'
                }}>
                  No revenue data available
                </div>
              )}
            </Spin>
          </Card>
        </Col>
      </Row>
    </>
  );
}

// Helper functions
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
    { name: 'Subscription', value: revenueStats.totalSubscriptionRevenue || 0, fill: '#8B5CF6' },
    { name: 'Token', value: revenueStats.totalTokenRevenue || 0, fill: '#10B981' },
    { name: 'Course', value: revenueStats.totalCourseRevenue || 0, fill: '#722ed1' }
  ].filter(item => item.value > 0);
}