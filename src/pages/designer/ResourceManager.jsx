import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Input,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  message,
  Form,
  Typography,
} from "antd";

import {
  EyeOutlined,
  SearchOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ImageUploader from "../../common/ImageUploader";
import { resourceService } from "../../service/resourceService";

const { Search } = Input;
const { Text } = Typography;

export default function DesignerResourceManager() {
  const [resources, setResources] = useState([]);
  const [selected, setSelected] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [itemUrls, setItemUrls] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [resetUploader, setResetUploader] = useState(0);
  const [form] = Form.useForm();

  const stats = useMemo(() => {
    const total = resources.length;
    const pending = resources.filter((r) => r.status === "PENDING_REVIEW").length;
    const approved = resources.filter((r) => r.status === "APPROVED").length;
    const rejected = resources.filter((r) => r.status === "REJECTED").length;
    return { total, pending, approved, rejected };
  }, [resources]);

  const statusColors = {
    PENDING_REVIEW: "orange",
    APPROVED: "green",
    REJECTED: "red",
    PUBLISHED: "blue",
  };

  const typeColors = {
    brush: "cyan",
    font: "purple",
    icon: "gold",
    texture: "magenta",
    default: "blue",
  };

  const getTypeColor = (type) => {
    if (!type) return typeColors.default;
    const normalized = type.toLowerCase();
    return typeColors[normalized] || typeColors.default;
  };

  const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString("en-US") : "-";

  const formatCurrency = (value) =>
    typeof value === "number" ? value.toLocaleString() : value || "-";

  const fetchResources = async (p = page, s = size) => {
    try {
      setLoading(true);
      const res = await resourceService.getResourceByUserId(p - 1, s);
      setResources(res.content || []);
      setTotal(res.totalElements || res.content?.length || 0);
    } catch (error) {
      message.error(error.message || "Unable to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources(page, size);
  }, [page, size]);

  const handleView = (record) => {
    setSelected(record);
    setPreviewVisible(true);
  };

  const handleEdit = (record) => {
    message.info(`Edit resource ID: ${record.resourceTemplateId}`);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Delete confirmation",
      content: `Are you sure you want to delete "${record.name}"?`,
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: () => {
        message.success(`Resource ID ${record.resourceTemplateId} removed`);
      },
    });
  };

  const columns = [
    { title: "ID", dataIndex: "resourceTemplateId", key: "id", width: 80 },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type) => <Tag color={getTypeColor(type)}>{type || "N/A"}</Tag>,
    },
    { 
      title: "Price (VND)", 
      dataIndex: "price", 
      key: "price", 
      width: 120,
      render: (price) => formatCurrency(price)
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      key: "releaseDate",
      width: 130,
      render: (d) => formatDate(d),
    },
    {
      title: "Expiration Date",
      dataIndex: "expiredTime",
      key: "expiredTime",
      width: 130,
      render: (d) => formatDate(d),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)}>
            View
          </Button>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
      width: 260,
    },
  ];

  const handleUpload = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (!imagesData || imagesData.length === 0) {
        message.error("Please upload at least one image!");
        return;
      }

      const template = {
        name: values.name,
        description: values.description,
        type: values.type,
        price: Number(values.price),
        expiredTime: values.expired,
        releaseDate: values.release,
        images: imagesData,
        items: itemUrls
          .filter((url) => url.trim())
          .map((url, idx) => ({
            itemIndex: idx + 1,
            itemUrl: url,
          })),
      };

      await resourceService.uploadRecource(template);
      message.success("Asset uploaded successfully!");
      form.resetFields();
      setImagesData([]);
      setItemUrls([]);
      setResetUploader((prev) => prev + 1);
      setUploadVisible(false);
      fetchResources();
    } catch (err) {
      message.error(err.message || "Upload failed!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total" value={stats.total} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Approved"
              value={stats.approved}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Rejected"
              value={stats.rejected}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      <div className="flex flex-col sm:flex-row gap-4">
        <Search
          placeholder="Search by name..."
          allowClear
          className="flex-1 min-w-0"
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
        />

        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          className="w-full sm:w-40"
        >
          <Select.Option value="all">All</Select.Option>
          <Select.Option value="PENDING_REVIEW">Pending</Select.Option>
          <Select.Option value="PUBLISHED">Published</Select.Option>
          <Select.Option value="REJECTED">Rejected</Select.Option>
        </Select>
        <Button
          type="default"
          icon={<UploadOutlined />}
          onClick={() => setUploadVisible(true)}
        >
          Upload Asset
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={resources.filter(
          (r) =>
            r.name?.toLowerCase().includes(searchText.toLowerCase()) &&
            (filterStatus === "all" || r.status === filterStatus)
        )}
        rowKey="resourceTemplateId"
        pagination={{
          current: page,
          pageSize: size,
          total,
          onChange: (p, s) => {
            setPage(p);
            setSize(s);
          },
          showSizeChanger: true,
        }}
        loading={loading}
        size="middle"
      />

      <Modal
        title={selected?.name}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={900}
      >
        {selected && (
          <div className="space-y-5">
            {selected.images?.find((img) => img.isThumbnail) && (
              <img
                src={selected.images.find((img) => img.isThumbnail).imageUrl}
                alt="thumbnail"
                className="w-full h-64 object-cover rounded-lg border shadow-sm"
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card size="small" className="shadow-sm">
                <Text type="secondary">Resource Name</Text>
                <p className="text-base font-semibold mt-1">{selected.name}</p>
              </Card>
              <Card size="small" className="shadow-sm">
                <Text type="secondary">Type</Text>
                <div className="mt-1">
                  <Tag color={getTypeColor(selected.type)}>{selected.type || "N/A"}</Tag>
                </div>
              </Card>
              <Card size="small" className="shadow-sm">
                <Text type="secondary">Price</Text>
                <p className="text-base font-semibold mt-1">{formatCurrency(selected.price)} VND</p>
              </Card>
              <Card size="small" className="shadow-sm">
                <Text type="secondary">Status</Text>
                <div className="mt-1">
                  <Tag color={statusColors[selected.status] || "default"}>{selected.status}</Tag>
                </div>
              </Card>
              <Card size="small" className="shadow-sm">
                <Text type="secondary">Release Date</Text>
                <p className="text-base font-semibold mt-1">{formatDate(selected.releaseDate)}</p>
              </Card>
              <Card size="small" className="shadow-sm">
                <Text type="secondary">Expiration Date</Text>
                <p className="text-base font-semibold mt-1">{formatDate(selected.expiredTime)}</p>
              </Card>
            </div>

            <Card size="small" className="shadow-sm">
              <Text type="secondary">Description</Text>
              <p className="mt-2 text-gray-700 leading-relaxed">{selected.description || "No description provided."}</p>
            </Card>

            {selected.images && selected.images.filter((img) => !img.isThumbnail).length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Gallery</h4>
                <div className="flex flex-wrap gap-3">
                  {selected.images
                    .filter((img) => !img.isThumbnail)
                    .map((img) => (
                      <img
                        key={img.id}
                        src={img.imageUrl}
                        alt="resource"
                        className="w-32 h-32 object-cover rounded border shadow-sm hover:scale-105 transition-transform"
                      />
                    ))}
                </div>
              </div>
            )}

            {selected.items && selected.items.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Attached Items</h4>
                <div className="flex flex-wrap gap-3">
                  {selected.items.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-2 bg-gray-50 hover:shadow-md transition"
                    >
                      <a
                        href={item.itemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        Item {item.itemIndex}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="Upload New Asset"
        open={uploadVisible}
        onCancel={() => {
          setUploadVisible(false);
          form.resetFields();
          setImagesData([]);
          setItemUrls([]);
          setResetUploader((prev) => prev + 1);
        }}
        footer={null}
        width={720}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleUpload}
          className="space-y-4"
        >
          <Form.Item
            label="Resource name"
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input placeholder="Enter resource name" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: "Please enter a type" }]}
              >
                <Input placeholder="Enter type" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Price (VND)"
                name="price"
                rules={[{ required: true, message: "Please enter a price" }]}
              >
                <Input type="number" min={0} placeholder="Enter price" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Release date"
                name="release"
                rules={[{ required: true, message: "Please choose a release date" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Expiration date"
                name="expired"
                rules={[{ required: true, message: "Please choose an expiration date" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Resource images" required>
            <ImageUploader
              multiple={true}
              onImageUploaded={(images) => setImagesData(images)}
              resetTrigger={resetUploader}
            />
          </Form.Item>

          <Form.Item label="Items (links or files)">
            <div className="space-y-2">
              {itemUrls.map((url, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => {
                      const updated = [...itemUrls];
                      updated[idx] = e.target.value;
                      setItemUrls(updated);
                    }}
                    placeholder={`Item ${idx + 1} URL`}
                  />
                  <Button
                    danger
                    onClick={() =>
                      setItemUrls((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="dashed"
                onClick={() => setItemUrls((prev) => [...prev, ""])}
                style={{ width: "100%" }}
              >
                + Add Item
              </Button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Upload Asset
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}