import React, { useState } from 'react';
import { 
  Layout, 
  Typography, 
  Tabs, 
  List, 
  Avatar, 
  Badge, 
  Input, 
  Button, 
  Card, 
  Space
} from 'antd';
import { 
  UserOutlined, 
  SendOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

// Mock data
const supportTickets = [
  { id: 1, user: 'John Doe', subject: 'Payment Issue', date: '2023-10-15', status: 'open', unread: 2 },
  { id: 2, user: 'Jane Smith', subject: 'Account Access', date: '2023-10-14', status: 'open', unread: 0 },
  { id: 3, user: 'Mike Johnson', subject: 'Product Question', date: '2023-10-13', status: 'closed', unread: 0 },
  { id: 4, user: 'Sarah Williams', subject: 'Refund Request', date: '2023-10-12', status: 'open', unread: 1 },
  { id: 5, user: 'David Brown', subject: 'Technical Issue', date: '2023-10-11', status: 'closed', unread: 0 },
];

const mockMessages = [
  { id: 1, sender: 'John Doe', content: 'Hi, I have an issue with my payment. It was deducted from my account but not reflected in the system.', time: '10:30 AM', isUser: true },
  { id: 2, sender: 'Support Staff', content: 'Hello John, I understand your concern. Could you please provide your transaction ID so I can check this for you?', time: '10:35 AM', isUser: false },
  { id: 3, sender: 'John Doe', content: 'Sure, my transaction ID is TX123456789.', time: '10:40 AM', isUser: true },
  { id: 4, sender: 'Support Staff', content: 'Thank you for providing the transaction ID. Let me check our system and get back to you shortly.', time: '10:45 AM', isUser: false },
];

const CustomerSupport = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [selectedTicket, setSelectedTicket] = useState(supportTickets[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'Support Staff',
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const getFilteredTickets = () => {
    if (activeTab === 'open') return supportTickets.filter(ticket => ticket.status === 'open');
    if (activeTab === 'closed') return supportTickets.filter(ticket => ticket.status === 'closed');
    return supportTickets;
  };

  return (
    <div className="p-6">
      <Layout className="bg-white rounded-lg shadow-md overflow-hidden">
        <Content style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
          <Tabs activeKey={activeTab} onChange={handleTabChange} type="card" style={{ marginBottom: 0, padding: '0 16px' }}>
            <TabPane tab="Open Tickets" key="open" />
            <TabPane tab="Closed Tickets" key="closed" />
            <TabPane tab="All Tickets" key="all" />
          </Tabs>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Ticket List */}
            <div style={{ width: '30%', borderRight: '1px solid #f0f0f0', overflow: 'auto', background: '#f9f9f9' }}>
              <List
                itemLayout="horizontal"
                dataSource={getFilteredTickets()}
                renderItem={ticket => (
                  <List.Item 
                    onClick={() => handleTicketSelect(ticket)}
                    style={{ 
                      cursor: 'pointer', 
                      padding: '12px 16px',
                      background: selectedTicket && selectedTicket.id === ticket.id ? '#e6f7ff' : 'transparent',
                      borderLeft: selectedTicket && selectedTicket.id === ticket.id ? '3px solid #1890ff' : '3px solid transparent'
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge count={ticket.unread} size="small">
                          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                        </Badge>
                      }
                      title={
                        <Space>
                          <Text strong>{ticket.user}</Text>
                          {ticket.unread > 0 && <Badge status="error" />}
                        </Space>
                      }
                      description={
                        <div>
                          <Text type="secondary">{ticket.subject}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>{ticket.date}</Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>

            {/* Chat Area */}
            <div style={{ width: '70%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
              {selectedTicket && (
                <>
                  <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                    <Title level={5} style={{ margin: 0 }}>{selectedTicket.subject}</Title>
                    <Text type="secondary">{selectedTicket.user} • {selectedTicket.date}</Text>
                  </div>

                  <div style={{ 
                    flex: 1, 
                    padding: '16px', 
                    overflow: 'auto',
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/notebook.png")',
                    backgroundColor: '#f5f5f5'
                  }}>
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: msg.isUser ? 'flex-start' : 'flex-end',
                          marginBottom: '16px' 
                        }}
                      >
                        {msg.isUser && (
                          <Avatar 
                            icon={<UserOutlined />} 
                            style={{ marginRight: '8px', alignSelf: 'flex-start', backgroundColor: '#f56a00' }} 
                          />
                        )}

                        <Card 
                          size="small"
                          style={{ 
                            maxWidth: '70%', 
                            borderRadius: '8px',
                            backgroundColor: msg.isUser ? '#fff' : '#1890ff',
                            color: msg.isUser ? 'inherit' : '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
                          }}
                          bodyStyle={{ padding: '12px' }}
                        >
                          <Paragraph style={{ margin: 0, color: msg.isUser ? 'inherit' : '#fff', whiteSpace: 'pre-wrap' }}>
                            {msg.content}
                          </Paragraph>
                          <Text style={{ fontSize: '11px', display: 'block', textAlign: 'right', marginTop: '4px', color: msg.isUser ? '#999' : 'rgba(255,255,255,0.85)' }}>
                            {msg.time}
                          </Text>
                        </Card>

                        {!msg.isUser && (
                          <Avatar style={{ marginLeft: '8px', alignSelf: 'flex-start', backgroundColor: '#1890ff' }}>S</Avatar>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0', background: '#fff' }}>
                    <Search
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onSearch={handleSendMessage}
                      enterButton={
                        <Button type="primary" icon={<SendOutlined />} style={{ width: '100%', height: '100%' }} />
                      }
                      allowClear
                      onPressEnter={handleSendMessage}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default CustomerSupport;
