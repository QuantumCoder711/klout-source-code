import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { heading } from '../../../features/heading/headingSlice';
import { fetchUser } from '../../../features/auth/authSlice';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';

const WalletPaymentStatus: React.FC = () => {
  const { status, id } = useParams<{ status: string, id: string }>();
  const dispatch = useAppDispatch();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Update the heading
    dispatch(heading('Payment Status'));
    
    // Refresh user data to get updated wallet balance
    if (token && status?.toLowerCase() === 'success') {
      dispatch(fetchUser(token));
    }
  }, [dispatch, status, token]);

  const getStatusIcon = () => {
    if (status?.toLowerCase() === 'success') {
      return <CheckCircle className="w-20 h-20 text-green-500 mb-4" />;
    } else if (status?.toLowerCase() === 'failed') {
      return <XCircle className="w-20 h-20 text-red-500 mb-4" />;
    } else {
      return <AlertCircle className="w-20 h-20 text-yellow-500 mb-4" />;
    }
  };

  const getStatusColor = () => {
    if (status?.toLowerCase() === 'success') {
      return 'text-green-600';
    } else if (status?.toLowerCase() === 'failed') {
      return 'text-red-600';
    } else {
      return 'text-yellow-600';
    }
  };

  const getStatusMessage = () => {
    if (status?.toLowerCase() === 'success') {
      return 'Your payment was successful! Credits have been added to your wallet.';
    } else if (status?.toLowerCase() === 'failed') {
      return 'Your payment was unsuccessful. No credits have been added to your wallet.';
    } else {
      return 'Payment status is pending. Please check your wallet balance later.';
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
        <div className="flex flex-col items-center text-center">
          {getStatusIcon()}

          <h1 className="text-3xl font-bold mb-2">Payment Status</h1>

          <div className={`text-xl font-semibold mb-4 ${getStatusColor()}`}>
            {status?.toUpperCase()}
          </div>

          <p className="text-gray-700 mb-6">{getStatusMessage()}</p>

          {status === "success" && (
            <p className="text-gray-700 mb-4 font-medium bg-green-50 p-3 rounded-lg border border-green-100">
              <span className="text-green-600">✓</span> Your wallet has been topped up!
            </p>
          )}

          {id && status === "success" && (
            <div className="bg-gray-50 p-3 rounded-lg w-full mb-6">
              <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
              <p className="text-gray-800 font-medium break-all">{id}</p>
            </div>
          )}

          <div className="flex gap-4 w-full">
            <Link
              to="/profile"
              onClick={() => dispatch(heading('Profile'))}
              className="flex-1 py-3 px-4 bg-klt_primary-600 hover:bg-klt_primary-700 text-white font-medium rounded-lg text-center transition-colors"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPaymentStatus;