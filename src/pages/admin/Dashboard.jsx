import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Tag,
} from "antd";
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

  useEffect(() => {
    dashboardAminService.fetchUser().then(setUserData);
    dashboardAminService.fetchTotalOrderAndEnrollments().then(setTotalOrderAndEnrollments);
    dashboardAminService.fetchTopCourses(5).then(setTopCourses);
    dashboardAminService.fetchTopResources(5).then(setTopResources);
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

  return (
    <>
      <Title level={3}>Admin Dashboard</Title>

      {/* ==================== TOP STATISTICS ==================== */}
      <Row gutter={16}>
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
        title="Total Orders"
        value={totalOrderAndEnrollments?.totalOrders || 0}
        prefix={<ShoppingCartOutlined style={{ color: "#ff4d4f" }} />}
      />
    </Card>
  </Col>
</Row>


      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={6}>
          <Card style={{ borderLeft: "4px solid #722ed1" }}>
            <Statistic
              title="Total Enrollments"
              value={totalOrderAndEnrollments?.totalEnrollments || 0}
              prefix={<BookOutlined style={{ color: "#722ed1" }} />}
            />
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
    </>
  );
}
