import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import swal from 'sweetalert';

interface AddCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCreditsModal: React.FC<AddCreditsModalProps> = ({ isOpen, onClose }) => {
  const [creditAmount, setCreditAmount] = useState<number>(100); // Default to 100 credits (minimum is 10)
  const [totalPrice, setTotalPrice] = useState<number>(600); // Default price (Rs.6 per credit)
  const [paymentFormHtml, setPaymentFormHtml] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const { token } = useSelector((state: RootState) => state.auth);
  const apiBaseUrl = import.meta.env.VITE_APP_BASE_URL;
  const { user } = useSelector((state: RootState) => state.auth);
  const { first_name, email, mobile_number, uuid } = user!;

  useEffect(() => {
    // Calculate total price whenever credit amount changes
    setTotalPrice(creditAmount * 6); // 1 credit = Rs.6
  }, [creditAmount]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreditAmount(parseInt(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 10 && value <= 1000) {
      setCreditAmount(value);
    }
  };

  // Add a useEffect to handle the payment form submission
  useEffect(() => {
    if (paymentFormHtml) {
      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = paymentFormHtml;

      // Find the form element
      const form = tempDiv.querySelector('form');
      if (form) {
        // Create a new form element in the DOM
        const newForm = document.createElement('form');
        newForm.id = form.id;
        newForm.name = form.name;
        newForm.method = form.method;
        newForm.action = form.action;

        // Copy all input fields
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
          const newInput = document.createElement('input');
          newInput.type = input.type;
          newInput.name = input.name;
          newInput.value = input.value;
          newInput.hidden = true;
          newForm.appendChild(newInput);
        });

        // Append the form to the body
        document.body.appendChild(newForm);

        // Submit the form
        setTimeout(() => {
          newForm.submit();
        }, 100);
      }
    }
  }, [paymentFormHtml]);

  const handlePurchase = async () => {
    try {
      setIsProcessing(true);

      // Call your API to process the credit purchase
      const response = await axios.post(
        `${apiBaseUrl}/api/v1/payment/wallet-topup`,
        {
          amount: totalPrice,
          credits: creditAmount,
          firstname: first_name,
          email,
          mobile: mobile_number,
          uuid,
          token
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log("Payment response:", response.data);

      // If the response contains HTML form data
      if (response.data) {
        setPaymentFormHtml(response.data);
      } else {
        setIsProcessing(false);
        swal("Error", "Failed to initiate payment. Please try again later.", "error");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      setIsProcessing(false);
      swal("Error", "Failed to initiate payment. Please try again later.", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-klt_primary-900">Add Credits</h2>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">1 Credit = Rs.6</p>

          <div className="mb-4">
            <label htmlFor="creditSlider" className="block text-sm font-medium text-gray-700 mb-1">
              Select Credits Amount:
            </label>
            <input
              type="range"
              id="creditSlider"
              min="10"
              max="1000"
              step="1"
              value={creditAmount}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Rs.60 (10 credits)</span>
              <span>Rs.6000 (1000 credits)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <label htmlFor="creditInput" className="block text-sm font-medium text-gray-700">
              Credits:
            </label>
            <input
              type="number"
              id="creditInput"
              min="10"
              max="1000"
              value={creditAmount}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-24 text-right"
            />
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between font-medium">
              <span>Total Price:</span>
              <span className="text-klt_primary-900 font-bold">Rs.{totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="btn btn-outline border-gray-300 hover:bg-gray-100 hover:text-black"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="btn btn-primary text-white"
          >
            {isProcessing ? (
              <>
                <span className="loading loading-spinner loading-xs mr-2"></span>
                Processing...
              </>
            ) : (
              'Purchase Credits'
            )}
          </button>
        </div>

        {/* Hidden div to render the payment form */}
        <div ref={formContainerRef} style={{ display: 'none' }}></div>
      </div>
    </div>
  );
};

export default AddCreditsModal;
