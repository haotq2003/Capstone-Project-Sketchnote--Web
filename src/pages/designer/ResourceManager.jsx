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
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ImageUploader from "../../common/ImageUploader";
import { resourceService } from "../../service/resourceService";

const { Search } = Input;

export default function DesignerResourceManager() {
  const [resources, setResources] = useState([]);
  const [selected, setSelected] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [itemUrls, setItemUrls] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();

  // 🟢 Tính thống kê
  const stats = useMemo(() => {
    const total = resources.length;
    const pending = resources.filter((r) => r.status === "pending").length;
    const approved = resources.filter((r) => r.status === "approved").length;
    const rejected = resources.filter((r) => r.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [resources]);

  // 🟢 Gọi API danh sách
  const fetchResources = async (p = page, s = size) => {
    try {
      setLoading(true);
      const res = await resourceService.getResourceByUserId(p - 1, s);
      console.log("API Data:", res.content);
      setResources(res.content || []);
      setTotal(res.totalElements || res.content?.length || 0);
    } catch (error) {
      message.error(error.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources(page, size);
  }, [page, size]);

  // 🟢 Các hàm hành động
  const handleView = (record) => {
    setSelected(record);
    setPreviewVisible(true);
  };

  const handleEdit = (record) => {
    message.info(`Edit resource ID: ${record.resourceTemplateId}`);
    // TODO: mở modal edit hoặc điều hướng
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa?",
      content: `Bạn có chắc muốn xóa "${record.name}" không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        message.success(`Đã xóa resource ID: ${record.resourceTemplateId}`);
        // TODO: Gọi API xóa ở đây
      },
    });
  };

  // 🟢 Cấu hình bảng
  const columns = [
    { title: "ID", dataIndex: "resourceTemplateId", key: "id", width: 80 },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    { title: "Loại", dataIndex: "type", key: "type", width: 100 },
    { title: "Giá (VNĐ)", dataIndex: "price", key: "price", width: 120 },
    {
      title: "Ngày phát hành",
      dataIndex: "releaseDate",
      key: "releaseDate",
      width: 130,
      render: (d) => d?.split("T")[0],
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiredTime",
      key: "expiredTime",
      width: 130,
      render: (d) => d?.split("T")[0],
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

  // 🟢 Upload Asset
  const handleUpload = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const template = {
        name: values.name,
        description: values.description,
        type: values.type,
        price: Number(values.price),
        expiredTime: values.expired,
        releaseDate: values.release,
        images: [
          {
            imageUrl: thumbnailUrl,
            isThumbnail: true,
          },
        ],
        items: itemUrls.map((url, idx) => ({
          itemIndex: idx + 1,
          itemUrl: url,
        })),
      };

      await resourceService.uploadRecource(template);
      message.success("Tải lên thành công!");
      form.resetFields();
      setThumbnailUrl("");
      setItemUrls([]);
      setUploadVisible(false);
      fetchResources();
    } catch (err) {
      message.error(err.message || "Upload thất bại!");
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

      {/* 🔍 Bộ lọc */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Search
          placeholder="Tìm theo tên..."
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
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="approved">Approved</Select.Option>
          <Select.Option value="rejected">Rejected</Select.Option>
        </Select>
        <Button
          type="default"
          icon={<UploadOutlined />}
          onClick={() => setUploadVisible(true)}
        >
          Upload Asset
        </Button>
      </div>

      {/* 📋 Bảng dữ liệu */}
      <Table
        columns={columns}
        dataSource={resources.filter((r) =>
          r.name?.toLowerCase().includes(searchText.toLowerCase())
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

      {/* 🔍 Modal xem chi tiết */}
     <Modal
  title={selected?.name}
  open={previewVisible}
  onCancel={() => setPreviewVisible(false)}
  footer={null}
  width={900}
>
  {selected && (
    <div className="space-y-5">
      {/* Ảnh thumbnail */}
      {selected.images?.find((img) => img.isThumbnail) && (
        <img
          src={selected.images.find((img) => img.isThumbnail).imageUrl}
          alt="thumbnail"
          className="w-full h-64 object-cover rounded-lg border shadow-sm"
        />
      )}

      {/* Thông tin chi tiết */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <p>
            <strong>Tên tài nguyên:</strong> {selected.name}
          </p>
          <p>
            <strong>Loại:</strong> {selected.type}
          </p>
          <p>
            <strong>Giá:</strong> {selected.price?.toLocaleString()} VNĐ
          </p>
          <p>
            <strong>Mô tả:</strong> {selected.description}
          </p>
        </Col>
        <Col span={12}>
          <p>
            <strong>Ngày phát hành:</strong> {selected.releaseDate}
          </p>
          <p>
            <strong>Ngày hết hạn:</strong> {selected.expiredTime}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {selected.isActive ? (
              <Tag color="green">Active</Tag>
            ) : (
              <Tag color="red">Inactive</Tag>
            )}
          </p>
         
        </Col>
      </Row>

      {/* Danh sách ảnh */}
      {selected.images && selected.images.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Ảnh liên quan:</h4>
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

      {/* Danh sách items */}
      {selected.items && selected.items.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Các Item đính kèm:</h4>
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


      {/* 📤 Modal upload */}
      <Modal
        title="Upload New Asset"
        open={uploadVisible}
        onCancel={() => setUploadVisible(false)}
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
            label="Tên tài nguyên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input placeholder="Nhập tên..." />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Loại"
                name="type"
                rules={[{ required: true, message: "Nhập loại" }]}
              >
                <Input placeholder="Nhập loại..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá (VNĐ)"
                name="price"
                rules={[{ required: true, message: "Nhập giá" }]}
              >
                <Input type="number" min={0} placeholder="Nhập giá..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày phát hành"
                name="release"
                rules={[{ required: true, message: "Chọn ngày phát hành" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày hết hạn"
                name="expired"
                rules={[{ required: true, message: "Chọn ngày hết hạn" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Thumbnail">
            <ImageUploader onImageUploaded={(url) => setThumbnailUrl(url)} />
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt="thumbnail"
                className="mt-2 w-32 h-32 object-cover rounded border"
              />
            )}
          </Form.Item>

          <Form.Item label="Các item (tệp hoặc hình liên quan)">
            <ImageUploader
              multiple
              onImageUploaded={(url) => setItemUrls((prev) => [...prev, url])}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {itemUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`item-${i}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Tải lên
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
