import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button, Typography, Space } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import './PaymentSuccess.css';

const { Title, Text } = Typography;

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [showConfetti, setShowConfetti] = useState(true);

    // Parse URL parameters
    const orderCode = searchParams.get('orderCode');
    const status = searchParams.get('status');
    const code = searchParams.get('code');
    const transactionId = searchParams.get('id');

    useEffect(() => {
        // Hide confetti after 3 seconds
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleBackToWallet = () => {
        navigate('/admin/my-wallet');
    };

    return (
        <div className="payment-result-container">
            {/* Confetti Effect */}
            {showConfetti && (
                <div className="confetti-container">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)]
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="payment-result-content">
                {/* Success Icon */}
                <div className="success-icon-wrapper">
                    <CheckCircleOutlined className="success-icon" />
                </div>

                {/* Success Message */}
                <Title level={2} className="success-title">
                    Payment Successful!
                </Title>

                <Text className="success-subtitle">
                    Your transaction has been completed successfully
                </Text>

                {/* Transaction Details */}
                {(orderCode || status || transactionId) && (
                    <Card className="transaction-details-card" bordered={false}>
                        <Space direction="vertical" size={8} style={{ width: '100%' }}>
                            {orderCode && (
                                <div className="detail-row">
                                    <Text strong>Order Code:</Text>
                                    <Text code>{orderCode}</Text>
                                </div>
                            )}
                            {status && (
                                <div className="detail-row">
                                    <Text strong>Status:</Text>
                                    <Text style={{ color: '#10B981' }}>{status}</Text>
                                </div>
                            )}
                            {transactionId && (
                                <div className="detail-row">
                                    <Text strong>Transaction ID:</Text>
                                    <Text type="secondary">{transactionId}</Text>
                                </div>
                            )}
                            {code && (
                                <div className="detail-row">
                                    <Text strong>Code:</Text>
                                    <Text>{code}</Text>
                                </div>
                            )}
                        </Space>
                    </Card>
                )}

                {/* Back Button */}
                <Button
                    type="primary"
                    size="large"
                    onClick={handleBackToWallet}
                    className="back-button"
                >
                    Back to Wallet
                </Button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
