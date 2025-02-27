import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; 

const UserDetails = ({ userData, refetchUserData }) => {
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60); 
  const [intervalId, setIntervalId] = useState(null);

  const handleSendOTP = async () => {
    try {
      await axios.post('/api/users/send-otp', { userId: userData.id });
      toast.success('OTP sent successfully!'); 
      setOtpSent(true);
      setTimer(60); 
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.'); 
    }
  };

  const handleSendAgain = () => {
    handleSendOTP();
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('/api/users/verify-otp', { userId: userData.id, otp });
      toast.success('User Verified Successfully!');

      await refetchUserData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  useEffect(() => {
    if (otpSent) {
      const id = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(id);
            return 0; 
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id); 
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [otpSent]);

  return (
    <div className="max-w-md p-6">
      <h1 className="text-3xl font-bold md:mb-8">Profile</h1>
      <div className="flex md:items-center space-x-4 flex-wrap ">
        <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-white text-2xl font-bold">
          {userData?.firstName?.[0]}
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            {userData?.firstName} {userData?.lastName}
          </h2>
          <p className="">{userData?.email}</p>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <p className="mt-2 ">
          <strong>Phone Number:</strong> {userData?.phoneNumber}
        </p>
        <p className="mt-2 ">
          <strong>Verified:</strong> {userData?.emailVerified ? 'Yes' : 'No'}
        </p>
      </div>
      {!userData?.emailVerified && (
        <>
          {!otpSent ? (
            <button
              onClick={handleSendOTP}
              className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 transition duration-300"
            >
              Send OTP
            </button>
          ) : (
            <div className="mt-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={handleVerifyOtp}
                  disabled={!otp}
                  className={`bg-green-500 text-white py-2 px-4 rounded-lg ${!otp ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                >
                  Verify OTP
                </button>
                <button
                  onClick={handleSendAgain}
                  disabled={timer > 0}
                  className={`bg-indigo-500 text-white py-2 px-4 rounded-lg ${timer > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-600'}`}
                >
                  Send Again
                </button>
                {timer > 0 && (
                  <span className="text-gray-500">
                    Resend available in {timer} seconds
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserDetails;
