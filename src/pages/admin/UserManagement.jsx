import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Space, Modal, Form, Select, message, Popconfirm, Card, Input } from "antd";
import { userService } from "../../service/userService";
import { dashboardAminService } from "../../service/dashboardAdminService";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const columns = [
    {
      title: "No.",
      key: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const colorMap = {
          ADMIN: "blue",
          STAFF: "cyan",
          DESIGNER: "purple",
          CUSTOMER: "green",
        };
        return <Tag color={colorMap[role] || "default"}>{role}</Tag>;
      },
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => (
    //     <Tag color={status === "Active" ? "green" : "red"}>
    //       {status}
    //     </Tag>
    //   ),
    // },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleViewDetail(record)}>
            View
          </Button>
          <Popconfirm
            title="Inactive User"
            description="Are you sure to inactive this user?"
            onConfirm={() => inactiveUser(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Inactive
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const inactiveUser = async (id) => {
    try {
      await userService.deleteUser(id);
      message.success("User has been inactivated successfully");
      fetchUser(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("Error inactivating user:", error);
      message.error("Failed to inactive user");
    }
  };

  const getRole = async () => {
    try {
      const res = await userService.fetchRole();
      console.log("Fetched roles:", res);
      setRoles(res);
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  };

  const fetchUser = async (page, size) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const res = await dashboardAminService.getAllUser(
        values.search || "",
        values.role || "",
        page - 1,
        size,
        values.sortBy || "createAt",
        values.sortDir || "desc"
      );

      console.log("Fetched users:", res.content);

      const formatted = res.content.map((u) => ({
        id: u.id,
        name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        email: u.email,
        role: u.role || "CUSTOMER",
        status: "Active",
        keycloakId: u.keycloakId,
      }));

      setUsers(formatted);
      setPagination((prev) => ({
        ...prev,
        total: res.totalElements,
        current: page,
        pageSize: size
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    searchForm.setFieldsValue({ sortBy: "createAt", sortDir: "desc" });
    fetchUser(pagination.current, pagination.pageSize);
    getRole();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchUser(newPagination.current, newPagination.pageSize);
  };

  const handleViewDetail = (record) => {
    setSelectedUser(record);
    form.setFieldsValue({
      role: record.role,
    });
    setIsModalVisible(true);
  };

  const handleUpdateRole = async (values) => {
    if (!selectedUser) return;

    try {
      // Tìm role object từ role name được chọn
      const selectedRole = roles.find((r) => r.name === values.role);

      if (!selectedRole) {
        message.error("Invalid role selected");
        return;
      }

      const payload = {
        roleId: selectedRole.id, // Keycloak Role ID (string)
        userId: selectedUser.id,  // User ID (number)
      };

      console.log("Sending payload:", payload);

      // API expects: { roleId: "keycloak-role-id", userId: number }
      await userService.updateUserRole(payload);

      message.success("Role updated successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchUser(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("Update role error:", error);
      message.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const ALLOWED_ROLES = ["DESIGNER", "ADMIN", "STAFF", "CUSTOMER"];

  return (
    <div style={{ padding: 24 }}>


      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline">
          <Form.Item name="search" label="Search">
            <Input placeholder="Search name, email..." style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select style={{ width: 150 }} placeholder="Select Role" allowClear>
              {roles
                .filter((role) => ALLOWED_ROLES.includes(role.name))
                .map((role) => (
                  <Select.Option key={role.id} value={role.name}>
                    {role.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button className="le" type="primary" onClick={() => fetchUser(1, pagination.pageSize)}>Search</Button>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: "max-content" }}
        />
      </Card>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 600 }}>User Details</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false); c
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500" style={{ marginBottom: 4, fontSize: 13 }}>Full Name</p>
                <p className="font-medium" style={{ fontSize: 15 }}>{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-gray-500" style={{ marginBottom: 4, fontSize: 13 }}>Email</p>
                <p className="font-medium" style={{ fontSize: 15 }}>{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-gray-500" style={{ marginBottom: 4, fontSize: 13 }}>Current Role</p>
                <Tag color={
                  selectedUser.role === "ADMIN" ? "blue" :
                    selectedUser.role === "STAFF" ? "cyan" :
                      selectedUser.role === "DESIGNER" ? "purple" : "green"
                } style={{ fontSize: 13, padding: '4px 12px' }}>
                  {selectedUser.role}
                </Tag>
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}
                size="large"
                style={{ minWidth: 100 }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}