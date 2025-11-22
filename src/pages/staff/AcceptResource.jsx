import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message, Tag, Image, Descriptions } from "antd";
import { resourceService } from "../../service/resourceService";


const { confirm } = Modal;

const ResourceReviewPage = () => {
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [selectedResource, setSelectedResource] = useState(null); 
  const [isModalVisible, setIsModalVisible] = useState(false); 

  const fetchResources = async (page = pagination.current, size = pagination.pageSize) => {
    try {
      setLoading(true);
      const data = await resourceService.getResourceByStatus("PENDING_REVIEW", page - 1, size);
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

  const handleView = (record) => {
    setSelectedResource(record);
    setIsModalVisible(true);
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

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Pending Resource Review</h2>
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

     
      <Modal
        open={isModalVisible}
        title={`Resource Details #${selectedResource?.resourceTemplateId}`}
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
              <Descriptions.Item label="Price">{selectedResource.price}</Descriptions.Item>
              <Descriptions.Item label="Expired Time">{selectedResource.expiredTime}</Descriptions.Item>
              <Descriptions.Item label="Release Date">{selectedResource.releaseDate}</Descriptions.Item>
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
              <ul>
                {selectedResource.items?.length > 0 ? (
                  selectedResource.items.map((item) => (
                    <li key={item.resourceItemId}>
                      <a href={item.itemUrl} target="_blank" rel="noopener noreferrer">
                        {item.itemUrl}
                      </a>
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
