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
  const [moderationInfo, setModerationInfo] = useState(null);
  const [loadingModeration, setLoadingModeration] = useState(false);

  const paginatedBlogs = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return allBlogs.slice(start, end);
  }, [allBlogs, pagination]);

  const fetchBlogs = async (page = 1, size = pagination.pageSize) => {
    try {
      setLoading(true);
      const res = await BlogService.getBlogsStatus(pagination.current, pagination.pageSize, "AI_REJECTED");
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
            await BlogService.acceptBlog(record.id, "REJECTED");
          }

          // Update local state
          const next = allBlogs.map((b) =>
            b.id === record.id
              ? { ...b, status: isAccept ? "PUBLISHED" : "REJECTED" }
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

  const handleView = async (record) => {
    setSelectedBlog(record);
    setIsModalVisible(true);
    setModerationInfo(null);

    // Fetch moderation info if blog is AI_REJECTED
    if (record.status === "AI_REJECTED") {
      try {
        setLoadingModeration(true);
        const moderationData = await BlogService.checkBlog(record.id);
        setModerationInfo(moderationData);
      } catch (err) {
        console.error("Failed to fetch moderation info:", err);
      } finally {
        setLoadingModeration(false);
      }
    }
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
      case "AI_REJECTED":
        return "red";
      default:
        return "default";
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
      title: "Cover Image",
      key: "cover",
      width: 120,
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
      ellipsis: true,
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
    },
    {
      title: "Actions",
      key: "actions",
      width: 260,
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleView(record)}>View</Button>
          {(record.status === "DRAFT" || record.status === "PENDING_REVIEW" || record.status === "AI_REJECTED") && (
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

        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>
        ]}
        width={900}
      >
        {selectedBlog && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* Basic Information Section */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '2px solid #1890ff',
                color: '#1890ff'
              }}>
                Basic Information
              </h4>
              <Descriptions bordered column={1} size="small" labelStyle={{ fontWeight: 600, width: '25%' }}>
                <Descriptions.Item label="Title">
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{selectedBlog.title}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Author">{selectedBlog.author}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(selectedBlog.status)}>
                    {selectedBlog.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Created Date">{selectedBlog.createdAt}</Descriptions.Item>
                {selectedBlog.excerpt && (
                  <Descriptions.Item label="Summary">{selectedBlog.excerpt}</Descriptions.Item>
                )}
                {selectedBlog.tags?.length > 0 && (
                  <Descriptions.Item label="Tags">
                    {selectedBlog.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>

            {/* AI Moderation Information Section */}
            {selectedBlog.status === "AI_REJECTED" && (
              <div style={{ marginBottom: 24 }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: '2px solid #ff4d4f',
                  color: '#ff4d4f'
                }}>
                  AI Moderation Information
                </h4>
                {loadingModeration ? (
                  <div style={{ textAlign: 'center', padding: 20 }}>
                    <span>Loading moderation information...</span>
                  </div>
                ) : moderationInfo ? (
                  <Descriptions bordered column={1} size="small" labelStyle={{ fontWeight: 600, width: '25%' }}>
                    <Descriptions.Item label="Safety Status">
                      <Tag color={moderationInfo.isSafe ? "green" : "red"}>
                        {moderationInfo.isSafe ? "SAFE" : "UNSAFE"}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Safety Score">
                      <span style={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: moderationInfo.safetyScore >= 70 ? '#52c41a' : moderationInfo.safetyScore >= 40 ? '#faad14' : '#ff4d4f'
                      }}>
                        {moderationInfo.safetyScore}/100
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Rejection Reason">
                      <div style={{
                        padding: 12,
                        backgroundColor: '#fff2e8',
                        borderRadius: 6,
                        border: '1px solid #ffbb96',
                        lineHeight: 1.8
                      }}>
                        {moderationInfo.reason.split('\\n').filter(line => !line.toLowerCase().includes('safety score')).map((line, index) => {
                          // Check if line starts with "- "
                          if (line.trim().startsWith('- ')) {
                            return (
                              <div key={index} style={{
                                marginLeft: 16,
                                marginBottom: 4,
                                display: 'flex',
                                alignItems: 'flex-start'
                              }}>
                                <span style={{
                                  color: '#ff4d4f',
                                  marginRight: 8,
                                  fontWeight: 600
                                }}>•</span>
                                <span style={{ flex: 1 }}>{line.substring(2)}</span>
                              </div>
                            );
                          }
                          // Regular line
                          return (
                            <div key={index} style={{
                              fontWeight: line.includes('Violations detected') ? 600 : 400,
                              color: line.includes('Violations detected') ? '#ff4d4f' : '#595959',
                              marginBottom: 4
                            }}>
                              {line || '\u00A0'}
                            </div>
                          );
                        })}
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Checked At">
                      {new Date(moderationInfo.checkedAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </Descriptions.Item>
                    <Descriptions.Item label="Previous Status">
                      <Tag color="blue">{moderationInfo.previousStatus}</Tag>
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: 20,
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    No moderation information available
                  </div>
                )}
              </div>
            )}

            {/* Cover Image Section */}
            {selectedBlog.coverUrl && (
              <div style={{ marginBottom: 24 }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: '2px solid #52c41a',
                  color: '#52c41a'
                }}>
                  Cover Image
                </h4>
                <Image
                  src={selectedBlog.coverUrl}
                  alt="cover"
                  style={{
                    width: '600px',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #d9d9d9',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </div>
            )}

            {/* Content Section */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '2px solid #fa8c16',
                color: '#fa8c16'
              }}>
                Content
              </h4>
              {selectedBlog.contents?.length > 0 ? (
                selectedBlog.contents.map((section, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: 20,
                      padding: 16,
                      backgroundColor: '#fafafa',
                      borderRadius: 8,
                      border: '1px solid #e8e8e8'
                    }}
                  >
                    <h5 style={{
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 12,
                      color: '#262626'
                    }}>
                      {section.sectionTitle}
                    </h5>
                    <p style={{
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.6,
                      color: '#595959',
                      marginBottom: section.contentUrl && section.contentUrl !== "string" ? 12 : 0
                    }}>
                      {section.content}
                    </p>
                    {section.contentUrl && section.contentUrl !== "string" && (
                      <Image
                        src={section.contentUrl}
                        alt={`content-${index}`}
                        style={{
                          width: '600px',
                          height: '300px',
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '1px solid #d9d9d9',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      />
                    )}
                  </div>
                ))
              ) : (
                <p style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                  color: '#595959',
                  padding: 16,
                  backgroundColor: '#fafafa',
                  borderRadius: 8,
                  border: '1px solid #e8e8e8'
                }}>
                  {selectedBlog.content || "No content available"}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AcceptBlog;