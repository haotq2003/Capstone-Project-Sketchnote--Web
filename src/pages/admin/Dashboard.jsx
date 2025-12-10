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
} from "@ant-design/icons";
import { dashboardAminService } from "../../service/dashboardAdminService";
import { userService } from "../../service/userService";

const { Title, Text } = Typography;

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

  useEffect(() => {
    dashboardAminService.fetchUser().then(setUserData);
    dashboardAminService.fetchTotalOrderAndEnrollments().then(setTotalOrderAndEnrollments);
    dashboardAminService.fetchTopCourses(5).then(setTopCourses);
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

    // Fetch revenue data for charts
    setLoadingRevenue(true);
    dashboardAminService.getRevenueDashboard()
      .then(data => {
        setRevenueStats(data?.revenueStats);
      })
      .catch(err => console.error('Failed to fetch revenue:', err))
      .finally(() => setLoadingRevenue(false));
  }, []);

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

  // Process chart data
  const chartData = React.useMemo(() => processChartData(revenueStats), [revenueStats]);
  const pieData = React.useMemo(() => processPieData(revenueStats), [revenueStats]);

  return (
    <>
      <Title level={3}>Admin Dashboard</Title>

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
              title="Total Enrollments"
              value={totalOrderAndEnrollments?.totalEnrollments || 0}
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
                  prefix={<span style={{ fontSize: 20 }}>💰</span>}
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
          <Card title="💎 Top Subscriptions">
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
          <Card title="🪙 Top Token Packages">
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
          <Card title="🔥 Top Courses">
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
          <Card title="📦 Top Resources">
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
          <Card title="🏆 Top Designers (Revenue)">
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
      <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
        <Col xs={24} lg={16}>
          <Card title="📊 Revenue Over Time" bordered={false} style={{ borderRadius: '12px' }}>
            <Spin spinning={loadingRevenue}>
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
          <Card title="📈 Revenue Breakdown" bordered={false} style={{ borderRadius: '12px' }}>
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
}

function processPieData(revenueStats) {
  if (!revenueStats) return [];
  return [
    { name: 'Subscription', value: revenueStats.totalSubscriptionRevenue, fill: '#8B5CF6' },
    { name: 'Token', value: revenueStats.totalTokenRevenue, fill: '#10B981' }
  ].filter(item => item.value > 0);
}
