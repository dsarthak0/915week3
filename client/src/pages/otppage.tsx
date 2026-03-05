import React, { useState } from 'react';
import { verifyOtp } from "../services/websocket/apis/authlogic"

interface OtpFormProps {
  onOtpSuccess: (token: string) => void;
}

export const OtpForm: React.FC<OtpFormProps> = ({ onOtpSuccess }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await verifyOtp(otp);
      if (result.token) {
        onOtpSuccess(result.token);
      } else {
        alert("Invalid OTP code.");
      }
    } catch (err) {
      alert("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Check your device</h2>
      <p className="text-gray-500 mb-6 text-center text-sm">We've sent a code to your registered email.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit code"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-[1em] focus:ring-2 focus:ring-blue-500 outline-none"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          {loading ? "Requesting New Timestamp..." : "Verify & Sign In"}
        </button>
      </form>
    </div>
  );
};
