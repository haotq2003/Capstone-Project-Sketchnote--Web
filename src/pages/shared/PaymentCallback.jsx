import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spin } from 'antd';

const PaymentCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Get all URL parameters
        const params = {};
        for (let [key, value] of searchParams.entries()) {
            params[key] = value;
        }

        // Build query string
        const queryString = new URLSearchParams(params).toString();

        // Check status to determine success or failure
        const status = searchParams.get('status');
      

        if (status === 'SUCCESS' || status === 'COMPLETED') {
            // Navigate to success page with all parameters
            navigate(`/wallet-success?${queryString}`, { replace: true });
        } else if (status === 'CANCELLED' || status === 'FAILED') {
            // Navigate to fail page with all parameters
            navigate(`/wallet-fail?${queryString}`, { replace: true });
        } else {
            // Unknown status, default to fail page
            navigate(`/wallet-fail?${queryString}`, { replace: true });
        }
    }, [navigate, searchParams]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#f0f2f5'
        }}>
            <Spin size="large" tip="Processing payment..." />
        </div>
    );
};

export default PaymentCallback;
