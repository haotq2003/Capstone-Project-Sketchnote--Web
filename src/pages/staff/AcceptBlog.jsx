import React, { useEffect, useMemo, useState } from "react";
import { Table, Button, Space, Modal, Tag, message, Image, Descriptions } from "antd";
import { BlogService } from "../../service/blogService";

const { confirm } = Modal;

const AcceptBlog = () => {
  const [loading, setLoading] = useState(false);
  const [allBlogs, setAllBlogs] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const paginatedBlogs = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return allBlogs.slice(start, end);
  }, [allBlogs, pagination]);

  const fetchBlogs = async (page = 1, size = pagination.pageSize) => {
    try {
      setLoading(true);
      const res = await BlogService.getBlogsStatusDraft(pagination.current, pagination.pageSize, "DRAFT");
      console.log(res);
      
      // Transform API data to match table structure
      const transformedBlogs = res.map((blog) => ({
        id: blog.id,
        title: blog.title,
        author: blog.authorDisplay,
        authorId: blog.authorId,
        status: blog.status,
        createdAt: new Date(blog.createdAt).toLocaleDateString("en-US"),
        updatedAt: blog.updatedAt,
        coverUrl: blog.imageUrl,
        excerpt: blog.summary,
        content: blog.contents?.map((c) => `${c.sectionTitle}\n${c.content}`).join("\n\n") || "",
        tags: [],
        contents: blog.contents,
      }));

      setAllBlogs(transformedBlogs);
      setPagination((prev) => ({ 
        ...prev, 
        current: page, 
        pageSize: size, 
        total: transformedBlogs.length 
      }));
    } catch (err) {
      message.error(err.message || "Failed to load blog list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1, pagination.pageSize);
  }, []);

  const handleAction = (record, isAccept) => {
    const actionLabel = isAccept ? "approve" : "reject";
    confirm({
      title: `Are you sure you want to ${actionLabel} this blog?`,
      onOk: async () => {
        try {
          if (isAccept) {
            await BlogService.acceptBlog(record.id, "PUBLISHED");
          } else {
            await BlogService.acceptBlog(record.id, "ARCHIVED");
          }
          
          // Update local state
          const next = allBlogs.map((b) => 
            b.id === record.id 
              ? { ...b, status: isAccept ? "PUBLISHED" : "ARCHIVED" } 
              : b
          );
          setAllBlogs(next);
          message.success(`Successfully ${actionLabel}ed the blog`);
        } catch (err) {
          message.error(err.message || "Operation failed");
          console.log(err);
        }
      },
    });
  };

  const handleView = (record) => {
    setSelectedBlog(record);
    setIsModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DRAFT":
        return "orange";
      case "PENDING_REVIEW":
        return "blue";
      case "APPROVED":
      case "PUBLISHED":
        return "green";
      case "REJECTED":
      case "ARCHIVED":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    {
      title: "Cover Image",
      key: "cover",
      render: (_, record) => (
        <Image 
          src={record.coverUrl} 
          alt="cover" 
          width={80} 
          fallback="https://via.placeholder.com/80x80?text=No+Image"
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <b>{text}</b>,
    },
    { title: "Author", dataIndex: "author", key: "author" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    { title: "Created Date", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleView(record)}>View</Button>
          {record.status === "DRAFT" && (
            <>
              <Button type="primary" onClick={() => handleAction(record, true)}>
                Approve
              </Button>
              <Button danger onClick={() => handleAction(record, false)}>
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
    
      <Table
        columns={columns}
        dataSource={paginatedBlogs}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          onChange: (page, size) => fetchBlogs(page, size),
          showTotal: (total) => `Total ${total} blogs`,
        }}
      />

      <Modal
        open={isModalVisible}
        title={`Blog Details #${selectedBlog?.id}`}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedBlog && (
          <>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Title">{selectedBlog.title}</Descriptions.Item>
              <Descriptions.Item label="Author">{selectedBlog.author}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedBlog.status)}>
                  {selectedBlog.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created Date">{selectedBlog.createdAt}</Descriptions.Item>
              <Descriptions.Item label="Tags">
                {selectedBlog.tags?.length ? (
                  selectedBlog.tags.map((t) => <Tag key={t}>{t}</Tag>)
                ) : (
                  "No tags"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Summary">{selectedBlog.excerpt}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <h4>Content</h4>
              {selectedBlog.contents?.length > 0 ? (
                selectedBlog.contents.map((section, index) => (
                  <div key={index} style={{ marginBottom: 16 }}>
                    <h5>{section.sectionTitle}</h5>
                    <p style={{ whiteSpace: "pre-wrap" }}>{section.content}</p>
                    {section.contentUrl && section.contentUrl !== "string" && (
                      <Image 
                        src={section.contentUrl} 
                        alt={`content-${index}`} 
                        width={300}
                        style={{ marginTop: 8 }}
                      />
                    )}
                  </div>
                ))
              ) : (
                <p style={{ whiteSpace: "pre-wrap" }}>{selectedBlog.content}</p>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AcceptBlog;