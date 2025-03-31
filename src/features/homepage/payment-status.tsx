import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentStatus: React.FC = () => {
  const { status, id } = useParams<{ status: string; id: string }>();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (id) {
        try {
          const appBaseUrl = import.meta.env.VITE_API_BASE_URL;
          const response = await axios.get(`${appBaseUrl}/api/v1/payment/status/${id}`);
          setPaymentDetails(response.data);
        } catch (error) {
          console.error('Error fetching payment details:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [id]);

  const handleGoHome = () => {
    navigate('/');
  };

  const getStatusIcon = () => {
    if (status === 'success') {
      return (
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    } else if (status === 'failed') {
      return (
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      );
    }
  };

  const getStatusMessage = () => {
    if (status === 'success') {
      return 'Payment Successful';
    } else if (status === 'failed') {
      return 'Payment Failed';
    } else {
      return 'Payment Pending';
    }
  };

  return (
    <div className='min-h-screen w-full grid place-content-center bg-gradient-to-b from-gray-50 to-gray-100 py-10'>
      <div className='bg-white rounded-xl p-8 shadow-lg max-w-md w-full border border-gray-100'>
        {loading ? (
          <div className="flex flex-col items-center py-8">
            <div className="animate-spin rounded-full h-14 w-14 border-b-3 border-t-3 border-brand-primary"></div>
            <p className="mt-6 text-gray-700 font-medium">Loading payment details...</p>
          </div>
        ) : (
          <>
            {getStatusIcon()}
            <h1 className='text-2xl font-bold text-center mb-6 text-gray-800'>{getStatusMessage()}</h1>
            
            {paymentDetails && (
              <div className="mb-8 border-t border-b border-gray-200 py-5 my-5 bg-gray-50 rounded-lg px-4">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-700 font-medium">Transaction ID:</span>
                  <span className="font-semibold text-gray-900">{paymentDetails.transaction_id || id}</span>
                </div>
                {paymentDetails.amount && (
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-700 font-medium">Amount:</span>
                    <span className="font-semibold text-gray-900">₹{paymentDetails.amount}</span>
                  </div>
                )}
                {paymentDetails.event_name && (
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-700 font-medium">Event:</span>
                    <span className="font-semibold text-gray-900">{paymentDetails.event_name}</span>
                  </div>
                )}
                {paymentDetails.date && (
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Date:</span>
                    <span className="font-semibold text-gray-900">{new Date(paymentDetails.date).toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}
            
            <button 
              onClick={handleGoHome}
              className='w-full bg-brand-primary text-white px-5 py-4 rounded-lg hover:bg-opacity-90 transition-colors font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform'
            >
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;