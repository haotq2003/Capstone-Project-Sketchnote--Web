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
      console.log(data);
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
      console.log("Version resources:", data);
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
      title: "ID",
      dataIndex: "resourceTemplateId",
      key: "id",
      width: 80,
    },
    {
      title: "Thumbnail",
      key: "thumbnail",
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
      title: "Version ID",
      dataIndex: "versionId",
      key: "versionId",
      width: 80,
    },
    {
      title: "Template ID",
      dataIndex: "templateId",
      key: "templateId",
      width: 100,
    },
    {
      title: "Thumbnail",
      key: "thumbnail",
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
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Version",
      dataIndex: "versionNumber",
      key: "versionNumber",
      render: (versionNumber) => <Tag color="purple">v{versionNumber}</Tag>,
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
        title={`Resource Details - Version ${selectedResource?.versionNumber || 'N/A'}`}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedResource && (
          <>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Name">{selectedResource.name}</Descriptions.Item>
              <Descriptions.Item label="Description">{selectedResource.description}</Descriptions.Item>
              <Descriptions.Item label="Type">{selectedResource.type}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color="orange">{selectedResource.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(selectedResource.price)}
              </Descriptions.Item>
              <Descriptions.Item label="Expired Time">{selectedResource.expiredTime}</Descriptions.Item>
              <Descriptions.Item label="Release Date">{selectedResource.releaseDate}</Descriptions.Item>
              {selectedResource.versionNumber && (
                <Descriptions.Item label="Version">
                  <Tag color="purple">v{selectedResource.versionNumber}</Tag>
                </Descriptions.Item>
              )}
              {selectedResource.versionId && (
                <Descriptions.Item label="Version ID">{selectedResource.versionId}</Descriptions.Item>
              )}
              {selectedResource.templateId && (
                <Descriptions.Item label="Template ID">{selectedResource.templateId}</Descriptions.Item>
              )}
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <h4>Images</h4>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {selectedResource.images?.length > 0 ? (
                  selectedResource.images.map((img) => (
                    <Image key={img.id} src={img.imageUrl} alt="resource" width={120} />
                  ))
                ) : (
                  <p>No images</p>
                )}
              </div>

              <h4 style={{ marginTop: 16 }}>Items</h4>

              <ul className="flex gap-3">
                {selectedResource.items?.length > 0 ? (
                  selectedResource.items.map((item) => (
                    <li key={item.resourceItemId} className="gap-3">
                      <img src={item.imageUrl} alt={`Price ${item.itemIndex}`} style={{ maxWidth: '200px' }} />
                    </li>
                  ))
                ) : (
                  <p>No items</p>
                )}
              </ul>

            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ResourceReviewPage;
