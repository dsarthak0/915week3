import React, { useState } from 'react';
import { preAuthHandshake } from '@/services/websocket/apis/prehandshake';
import { login } from '@/services/websocket/apis/login';
import { validateOtp } from '@/services/websocket/apis/otp';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  const [username, setUsername] = useState('AMITH1');
  const [password, setPassword] = useState('abc@12345');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleInitialAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.removeItem('bearer_token');
    try {
      await preAuthHandshake();
      await login(username, password);
      setStep(2);
    } catch (err) {
      alert("Login sequence failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await validateOtp(username, otp);
      const token = response?.jwtTokens?.accessToken;
      if (token) {
        console.log('Token received:', token);
        localStorage.setItem('bearer_token', token);
        onLoginSuccess();
      } else {
        alert("OTP Verified but no token received. Check API response structure.");
      }
    } catch (err) {
      alert("Invalid OTP or connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .gw-root {
          min-height: 100vh;
          background: #0e1117;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          color: #c8cdd6;
          position: relative;
          overflow: hidden;
        }

        .gw-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 48px;
          position: relative;
          border-right: 1px solid rgba(255,255,255,0.05);
          overflow: hidden;
        }

        .gw-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,192,118,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,192,118,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .gw-left::after {
          content: '';
          position: absolute;
          bottom: -15%;
          left: -10%;
          width: 70%;
          height: 70%;
          background: radial-gradient(circle, rgba(0,192,118,0.08) 0%, transparent 65%);
          pointer-events: none;
          animation: orbFloat 10s ease-in-out infinite alternate;
        }

        @keyframes orbFloat {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(4%,-6%) scale(1.05); }
        }

        .gw-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 2;
        }

        .gw-logo-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 22px;
          font-weight: 700;
          color: #00c076;
          letter-spacing: -0.03em;
        }

        .gw-logo-badge {
          background: rgba(0,192,118,0.12);
          border: 1px solid rgba(0,192,118,0.25);
          border-radius: 5px;
          padding: 2px 7px;
          font-size: 11px;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          color: #00c076;
        }

        .gw-ticker {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
          padding: 40px 0;
        }

        .gw-ticker-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #2e3a4a;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .gw-ticker-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          border-radius: 10px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.05);
          animation: tickerIn 0.5s ease both;
        }

        .gw-ticker-row:nth-child(2) { animation-delay: 0.05s; }
        .gw-ticker-row:nth-child(3) { animation-delay: 0.10s; }
        .gw-ticker-row:nth-child(4) { animation-delay: 0.15s; }
        .gw-ticker-row:nth-child(5) { animation-delay: 0.20s; }
        .gw-ticker-row:nth-child(6) { animation-delay: 0.25s; }

        @keyframes tickerIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .ticker-symbol {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 600;
          color: #e0e4ec;
          width: 120px;
          flex-shrink: 0;
        }

        .ticker-price {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: #5a6575;
          flex: 1;
        }

        .ticker-chg {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 5px;
        }

        .ticker-chg.up   { background: rgba(0,192,118,0.14); color: #00c076; }
        .ticker-chg.down { background: rgba(255,75,75,0.14);  color: #ff4b4b; }

        .gw-left-footer {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00c076;
          box-shadow: 0 0 8px #00c076;
          animation: livePulse 1.5s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }

        .live-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #2e3a48;
          letter-spacing: 0.06em;
        }

        /* Right panel */
        .gw-right {
          width: 420px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 44px;
          background: #12161e;
          position: relative;
        }

        .gw-right::before {
          content: '';
          position: absolute;
          top: 0;
          left: 15%;
          right: 15%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,192,118,0.5), transparent);
        }

        .gw-form-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #00c076;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .gw-form-eyebrow::before {
          content: '';
          display: inline-block;
          width: 16px;
          height: 1px;
          background: #00c076;
          opacity: 0.6;
        }

        .gw-form-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 23px;
          font-weight: 700;
          color: #e8eaed;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 6px;
          white-space: pre-line;
        }

        .gw-form-sub {
          font-size: 13px;
          color: #4a5565;
          margin-bottom: 28px;
        }

        /* Steps */
        .gw-steps {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
        }

        .gw-step-node {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          flex-shrink: 0;
          transition: all 0.3s;
        }

        .gw-step-node.active  { background: #00c076; color: #000; box-shadow: 0 0 0 3px rgba(0,192,118,0.2); }
        .gw-step-node.done    { background: rgba(0,192,118,0.12); color: #00c076; border: 1px solid rgba(0,192,118,0.3); }
        .gw-step-node.pending { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.07); }

        .gw-step-label {
          font-size: 10px;
          color: #2e3542;
          margin-left: 7px;
          font-weight: 500;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .gw-step-label.active-label { color: #7a8494; }

        .gw-step-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
          position: relative;
          overflow: hidden;
          margin: 0 6px;
        }

        .gw-step-line.filled::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #00c076, #00a864);
          animation: lineFill 0.5s ease both;
        }

        @keyframes lineFill {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); }
        }

        /* Fields */
        .gw-fields {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 18px;
        }

        .gw-field { display: flex; flex-direction: column; gap: 6px; }

        .gw-field-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3a4555;
          font-family: 'JetBrains Mono', monospace;
        }

        .gw-input-wrap { position: relative; }

        .gw-input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #3a4555;
          pointer-events: none;
        }

        .gw-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 12px 14px 12px 38px;
          font-size: 13px;
          font-family: 'JetBrains Mono', monospace;
          color: #e0e4ec;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .gw-input::placeholder { color: #2a3442; }

        .gw-input:focus {
          border-color: rgba(0,192,118,0.5);
          background: rgba(0,192,118,0.04);
          box-shadow: 0 0 0 3px rgba(0,192,118,0.08);
        }

        /* OTP */
        .gw-otp-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }

        .gw-otp-input {
          width: 100%;
          background: rgba(0,192,118,0.04);
          border: 1px solid rgba(0,192,118,0.18);
          border-radius: 10px;
          padding: 18px 14px;
          font-size: 30px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          color: #00c076;
          text-align: center;
          letter-spacing: 0.5em;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .gw-otp-input:focus {
          border-color: rgba(0,192,118,0.6);
          box-shadow: 0 0 0 3px rgba(0,192,118,0.1), 0 0 20px rgba(0,192,118,0.06);
        }

        .gw-otp-hint {
          font-size: 11px;
          color: #3a4555;
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
        }

        .gw-otp-hint span { color: #6a7585; }

        /* Button */
        .gw-btn {
          width: 100%;
          background: #00c076;
          color: #000;
          border: none;
          border-radius: 10px;
          padding: 13px 24px;
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          letter-spacing: 0.08em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 4px 18px rgba(0,192,118,0.3);
        }

        .gw-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 55%);
        }

        .gw-btn:hover:not(:disabled) {
          background: #00d484;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0,192,118,0.4);
        }

        .gw-btn:active:not(:disabled) { transform: scale(0.98); }

        .gw-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        .gw-btn-inner {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .gw-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }

        .gw-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 22px;
        }

        .gw-divider-line { flex:1; height:1px; background: rgba(255,255,255,0.05); }

        .gw-divider-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: #242c38;
          letter-spacing: 0.1em;
          white-space: nowrap;
        }

        .gw-step-content {
          animation: stepSlide 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes stepSlide {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div className="gw-root">

        {/* Left branding panel */}
        <div className="gw-left">
          <div className="gw-logo">
            <span className="gw-logo-text">groww</span>
            <span className="gw-logo-badge">915</span>
          </div>

          <div className="gw-ticker">
            <div className="gw-ticker-label">Live Market</div>
            {[
              { sym:"HDFCBANK",  price:"₹1,706.67", chg:"+1.54%",  up:true  },
              { sym:"INFY",      price:"₹1,583.85", chg:"+0.09%",  up:true  },
              { sym:"AXISBANK",  price:"₹1,072.47", chg:"-2.71%",  up:false },
              { sym:"RELIANCE",  price:"₹2,897.48", chg:"+0.60%",  up:true  },
              { sym:"KOTAKBANK", price:"₹1,825.33", chg:"-2.72%",  up:false },
            ].map(s => (
              <div className="gw-ticker-row" key={s.sym}>
                <span className="ticker-symbol">{s.sym}</span>
                <span className="ticker-price">{s.price}</span>
                <span className={`ticker-chg ${s.up ? "up" : "down"}`}>{s.chg}</span>
              </div>
            ))}
          </div>

          <div className="gw-left-footer">
            <div className="live-dot" />
            <span className="live-label">ws://localhost:8080 · SIMULATED DATA</span>
          </div>
        </div>

        {/* Right login panel */}
        <div className="gw-right">
          <div className="gw-form-eyebrow">
            {step === 1 ? "Secure Login" : "OTP Verification"}
          </div>
          <div className="gw-form-title">
            {step === 1 ? "Sign in to\nyour account" : "Verify your\nidentity"}
          </div>
          <div className="gw-form-sub">
            {step === 1
              ? "Access the live trading portal."
              : "Enter the code sent to your registered device."}
          </div>

          {/* Step indicator */}
          <div className="gw-steps">
            <div className={`gw-step-node ${step === 1 ? "active" : "done"}`}>
              {step > 1
                ? <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="#00c076" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                : "1"}
            </div>
            <span className={`gw-step-label ${step === 1 ? "active-label" : ""}`}>Credentials</span>
            <div className={`gw-step-line ${step > 1 ? "filled" : ""}`} />
            <div className={`gw-step-node ${step === 2 ? "active" : "pending"}`}>2</div>
            <span className={`gw-step-label ${step === 2 ? "active-label" : ""}`}>Verify OTP</span>
          </div>

          {/* Form */}
          <form onSubmit={step === 1 ? handleInitialAuth : handleOtpVerify}>
            <div className="gw-step-content" key={step}>
              {step === 1 ? (
                <div className="gw-fields">
                  <div className="gw-field">
                    <label className="gw-field-label">User ID</label>
                    <div className="gw-input-wrap">
                      <svg className="gw-input-icon" width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                      <input
                        type="text"
                        required
                        className="gw-input"
                        placeholder="Enter username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="gw-field">
                    <label className="gw-field-label">Password</label>
                    <div className="gw-input-wrap">
                      <svg className="gw-input-icon" width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                      <input
                        type="password"
                        required
                        className="gw-input"
                        placeholder="Enter password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="gw-otp-wrap">
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={4}
                    className="gw-otp-input"
                    placeholder="0000"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                  />
                  <p className="gw-otp-hint">Code sent to <span>{username}</span>'s registered device</p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="gw-btn">
              <div className="gw-btn-inner">
                {loading ? (
                  <><div className="gw-spinner" /> Authenticating…</>
                ) : (
                  <>
                    {step === 1 ? "CONTINUE" : "VERIFY & LOGIN"}
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7h9M8 3l3.5 4L8 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="gw-divider">
            <div className="gw-divider-line" />
            <span className="gw-divider-text">256-BIT ENCRYPTED · SIMULATED DATA</span>
            <div className="gw-divider-line" />
          </div>
        </div>
      </div>
    </>
  );
};