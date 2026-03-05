import React, { useState } from 'react';
import LoginForm from './LoginPage';
import {OtpForm} from './otppage';

const AuthPage: React.FC = () => {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [authToken, setAuthToken] = useState<string | null>(null);

  const handleLoginSuccess = () => {
    setStep('otp'); // Switch UI to OTP
  };

  const handleFinalSuccess = (token: string) => {
    setAuthToken(token);
    alert("Success! Bearer Token received.");
    // Redirect user to Dashboard here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-md">
        {step === 'login' ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <OtpForm onOtpSuccess={handleFinalSuccess} />
             <button 
                onClick={() => setStep('login')}
                className="w-full mt-4 text-sm text-gray-500 hover:text-blue-600 underline"
             >
               Back to Login
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;