import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message, Tag, Image, Descriptions, Tabs, Input } from "antd";
import { resourceService } from "../../service/resourceService";

const { confirm } = Modal;
const { TextArea } = Input;

const ResourceReviewPage = () => {
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [versionResources, setVersionResources] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [versionPagination, setVersionPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("PENDING_REVIEW");

  // Review comment modal
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewingResource, setReviewingResource] = useState(null);
  const [reviewAction, setReviewAction] = useState(null); // 'approve' or 'reject'

  const fetchResources = async (page = pagination.current, size = pagination.pageSize) => {
    try {
      setLoading(true);
      const data = await resourceService.getResourceByStatus("PENDING_REVIEW", page - 1, size, "createdAt", "DESC");
      setResources(data.content || []);
      setPagination({
        ...pagination,
        current: page,
        pageSize: size,
        total: data.totalElements || 0,
      });
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVersionResources = async (page = 1, size = 10) => {
    try {
      setLoading(true);
      const data = await resourceService.getResourceVersion(page - 1, size);
      setVersionResources(data.content || []);
      setVersionPagination({
        current: page,
        pageSize: size,
        total: data.totalElements || 0,
      });
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources(1, pagination.pageSize);
  }, []);

  const handleAction = (record, isAccept) => {
    const action = isAccept ? "accept" : "reject";
    confirm({
      title: `Are you sure you want to ${action} this resource?`,
      onOk: async () => {
        try {
          if (isAccept) {
            await resourceService.acceptResource(record.resourceTemplateId);
          } else {
            await resourceService.rejectResource(record.resourceTemplateId);
          }
          message.success(`Resource ${action}ed successfully.`);
          fetchResources(pagination.current, pagination.pageSize);
        } catch (err) {
          message.error(err.message);
        }
      },
    });
  };

  const handleVersionReview = (record, isApprove) => {
    setReviewingResource(record);
    setReviewAction(isApprove ? 'approve' : 'reject');
    setReviewComment("");
    setReviewModalVisible(true);
  };

  const submitVersionReview = async () => {
    if (!reviewComment.trim()) {
      message.warning("Please enter a review comment");
      return;
    }

    try {
      await resourceService.ReviewResourceVersion(reviewingResource.versionId, {
        approve: reviewAction === 'approve',
        reviewComment: reviewComment
      });
      message.success(`Version ${reviewAction}d successfully`);
      setReviewModalVisible(false);
      fetchVersionResources(versionPagination.current, versionPagination.pageSize);
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleView = (record) => {
    setSelectedResource(record);
    setIsModalVisible(true);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "VERSION_REVIEW") {
      fetchVersionResources(1, 10);
    } else {
      fetchResources(1, 10);
    }
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      render: (_, __, index) => {
        const { current, pageSize } = pagination;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Thumbnail",
      key: "thumbnail",
      width: 150,
      render: (_, record) => (
        <Image
          src={record.images?.[0]?.imageUrl || "https://via.placeholder.com/80"}
          alt="thumbnail"
          width={80}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      ellipsis: true,
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "PENDING_REVIEW" ? "orange" : status === "APPROVED" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleView(record)}> View</Button>
          <Button type="primary" onClick={() => handleAction(record, true)}>
            Accept
          </Button>
          <Button danger onClick={() => handleAction(record, false)}>
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  const versionColumns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      render: (_, __, index) => {
        const { current, pageSize } = versionPagination;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Thumbnail",
      key: "thumbnail",
      width: 150,
      render: (_, record) => (
        <Image
          src={record.images?.[0]?.imageUrl || "https://via.placeholder.com/80"}
          alt="thumbnail"
          width={80}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 120,
      ellipsis: true,
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Version",
      dataIndex: "versionNumber",
      key: "versionNumber",
      width: 120,
      render: (versionNumber) => <Tag color="purple">v{versionNumber}</Tag>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "PENDING_REVIEW" ? "orange" : status === "APPROVED" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleView(record)}>View</Button>
          <Button type="primary" onClick={() => handleVersionReview(record, true)}>
            Approve
          </Button>
          <Button danger onClick={() => handleVersionReview(record, false)}>
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "PENDING_REVIEW",
      label: "Pending Reviews",
      children: (
        <Table
          columns={columns}
          dataSource={resources}
          rowKey="resourceTemplateId"
          loading={loading}
          bordered
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            onChange: (page, size) => fetchResources(page, size),
            showTotal: (total) => `Total ${total} resources`,
          }}
        />
      ),
    },
    {
      key: "VERSION_REVIEW",
      label: "Version Reviews",
      children: (
        <Table
          columns={versionColumns}
          dataSource={versionResources}
          rowKey="versionId"
          loading={loading}
          bordered
          pagination={{
            current: versionPagination.current,
            pageSize: versionPagination.pageSize,
            total: versionPagination.total,
            showSizeChanger: true,
            onChange: (page, size) => fetchVersionResources(page, size),
            showTotal: (total) => `Total ${total} versions`,
          }}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />

      {/* Review Comment Modal */}
      <Modal
        open={reviewModalVisible}
        title={`${reviewAction === 'approve' ? 'Approve' : 'Reject'} Version`}
        onCancel={() => setReviewModalVisible(false)}
        onOk={submitVersionReview}
        okText="Submit"
        okButtonProps={{ danger: reviewAction === 'reject' }}
      >
        <p>Please provide your review comment:</p>
        <TextArea
          rows={4}
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          placeholder="Enter your review comment here..."
        />
      </Modal>

      {/* View Details Modal */}
      <Modal
        open={isModalVisible}
        title={<span style={{ fontSize: 18, fontWeight: 600 }}>Resource Details </span>}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedResource && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <Descriptions bordered column={1} size="small" labelStyle={{ fontWeight: 600, width: '30%' }}>
              <Descriptions.Item label="Name">
                <span style={{ fontWeight: 600, fontSize: 15 }}>{selectedResource.name}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedResource.description || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color="blue">{selectedResource.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={
                  selectedResource.status === "PENDING_REVIEW" ? "orange" :
                    selectedResource.status === "APPROVED" ? "green" : "red"
                }>
                  {selectedResource.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                <span style={{ fontSize: 16, fontWeight: 600, color: '#52c41a' }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(selectedResource.price)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Release Date">
                {selectedResource.releaseDate ? new Date(selectedResource.releaseDate).toLocaleDateString('vi-VN') : 'N/A'}
              </Descriptions.Item>
              {selectedResource.versionNumber && (
                <Descriptions.Item label="Version">
                  <Tag color="purple">v{selectedResource.versionNumber}</Tag>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Images Gallery */}
            <div style={{ marginTop: 24 }}>
              <h4 style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '2px solid #fa8c16',
                color: '#fa8c16'
              }}>
                Images Gallery
              </h4>
              {selectedResource.images?.length > 0 ? (
                <Image.PreviewGroup>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: 12
                  }}>
                    {selectedResource.images.map((img) => (
                      <div key={img.id} style={{
                        border: '1px solid #d9d9d9',
                        borderRadius: 8,
                        overflow: 'hidden',
                        aspectRatio: '1/1',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Image
                          src={img.imageUrl}
                          alt="resource"
                          width="100%"
                          height="100%"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                </Image.PreviewGroup>
              ) : (
                <p style={{ color: '#999', fontStyle: 'italic' }}>No images available</p>
              )}
            </div>

            {/* Items Gallery */}
            <div style={{ marginTop: 24 }}>
              <h4 style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '2px solid #13c2c2',
                color: '#13c2c2'
              }}>
                Items Gallery
              </h4>
              {selectedResource.items?.length > 0 ? (
                <Image.PreviewGroup>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: 12
                  }}>
                    {selectedResource.items.map((item) => (
                      <div key={item.resourceItemId} style={{
                        border: '1px solid #d9d9d9',
                        borderRadius: 8,
                        overflow: 'hidden',
                        aspectRatio: '1/1',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Image
                          src={item.imageUrl}
                          alt={`Item ${item.itemIndex}`}
                          width="100%"
                          height="100%"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                </Image.PreviewGroup>
              ) : (
                <p style={{ color: '#999', fontStyle: 'italic' }}>No items available</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResourceReviewPage;
