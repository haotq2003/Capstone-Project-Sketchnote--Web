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
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
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
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" onClick={() => handleViewDetail(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the user"
            description="Are you sure to delete this user?"
            onConfirm={() => deleteUser(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const deleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      message.success("User deleted successfully");
      fetchUser(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user");
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
          <Form.Item name="sortBy" label="Sort By">
            <Input placeholder="createAt" />
          </Form.Item>
          <Form.Item name="sortDir" label="Sort Dir">
            <Select style={{ width: 100 }} options={[{ value: "asc", label: "ASC" }, { value: "desc", label: "DESC" }]} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => fetchUser(1, pagination.pageSize)}>Search</Button>
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
        title="User Details"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Full Name</p>
                <p className="font-medium">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-gray-500">User ID</p>
                <p className="font-medium">{selectedUser.id}</p>
              </div>
              <div>
                <p className="text-gray-500">Current Role</p>
                <Tag color={
                  selectedUser.role === "ADMIN" ? "blue" :
                    selectedUser.role === "STAFF" ? "cyan" :
                      selectedUser.role === "DESIGNER" ? "purple" : "green"
                }>
                  {selectedUser.role}
                </Tag>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-3">Update Role</h3>
              <Form form={form} onFinish={handleUpdateRole} layout="vertical">
                <Form.Item
                  name="role"
                  label="Select New Role"
                  rules={[{ required: true, message: "Please select a role" }]}
                >
                  <Select placeholder="Choose a role">
                    {roles
                      .filter((role) => ALLOWED_ROLES.includes(role.name))
                      .map((role) => (
                        <Select.Option key={role.id} value={role.name}>
                          {role.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item className="mb-0 text-right">
                  <Button onClick={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                  }} className="mr-2">
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Update Role
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}