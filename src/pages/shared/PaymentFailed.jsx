import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button, Typography, Space, Alert } from 'antd';
import { CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import './PaymentFailed.css';

const { Title, Text } = Typography;

const PaymentFailed = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Parse URL parameters
    const orderCode = searchParams.get('orderCode');
    const status = searchParams.get('status');
    const code = searchParams.get('code');
    const transactionId = searchParams.get('id');
    const isCancelled = searchParams.get('cancel') === 'true';

    const handleBackToWallet = () => {
        // Detect environment and redirect accordingly
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        if (isLocalhost) {
            // Local development - use navigate
            navigate('/admin/my-wallet');
        } else {
            // Production - redirect to full URL
            window.location.href = `${window.location.origin}/admin/my-wallet`;
        }
    };

    return (
        <div className="payment-result-container payment-failed">
            <div className="payment-result-content">
                {/* Error Icon */}
                <div className="error-icon-wrapper">
                    <CloseCircleOutlined className="error-icon shake-animation" />
                </div>

                {/* Error Message */}
                <Title level={2} className="error-title">
                    {isCancelled ? 'Payment Cancelled' : 'Payment Failed'}
                </Title>

                <Text className="error-subtitle">
                    {isCancelled
                        ? 'Your transaction has been cancelled'
                        : 'Your transaction was unsuccessful'}
                </Text>

                {/* Error Alert */}
                {!isCancelled && (
                    <Alert
                        message="Transaction Failed"
                        description="The payment could not be processed. Please try again or contact support if the problem persists."
                        type="error"
                        icon={<WarningOutlined />}
                        showIcon
                        className="error-alert"
                    />
                )}

                {/* Transaction Details */}
                {(orderCode || status || transactionId || code) && (
                    <Card className="transaction-details-card error-card" bordered={false}>
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
                                    <Text style={{ color: '#DC2626' }}>{status}</Text>
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
                                    <Text strong>Error Code:</Text>
                                    <Text>{code}</Text>
                                </div>
                            )}
                        </Space>
                    </Card>
                )}

                {/* Action Buttons */}
                <Space direction="vertical" size={12} style={{ width: '100%', maxWidth: 400 }}>
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleBackToWallet}
                        className="back-button error-button"
                    >
                        Back to Wallet
                    </Button>
                </Space>
            </div>
        </div>
    );
};

export default PaymentFailed;
