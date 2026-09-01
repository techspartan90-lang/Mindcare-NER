import React, { useState } from 'react';
import {
  Brain,
  Lock,
  Mail,
  User,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Sparkles,
  HeartHandshake,
  Stethoscope,
  X,
  Smartphone,
} from 'lucide-react';
import { UserRole } from '../../types';
import { sound } from '../../services/sound';

export type AuthMode = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD' | 'OTP_VERIFY' | 'ROLE_SELECT';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (role: UserRole, userName: string) => void;
  initialMode?: AuthMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  initialMode = 'LOGIN',
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('PATIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleQuickLogin = (role: UserRole, roleName: string) => {
    sound.playClick();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      sound.playSuccess();
      onAuthenticate(role, roleName);
      onClose();
    }, 400);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'LOGIN') {
      if (!email || !password) {
        setErrorMsg('Please enter both email and password.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        sound.playSuccess();
        onAuthenticate(selectedRole, email.split('@')[0] || 'User');
        onClose();
      }, 500);
    } else if (mode === 'SIGNUP') {
      if (!name || !email || !password) {
        setErrorMsg('Please fill in all required registration fields.');
        return;
      }
      setMode('OTP_VERIFY');
      setSuccessMsg(`Verification code sent to ${email}`);
    } else if (mode === 'OTP_VERIFY') {
      const enteredOtp = otp.join('');
      if (enteredOtp.length < 6) {
        setErrorMsg('Please enter all 6 digits of the verification code.');
        return;
      }
      setMode('ROLE_SELECT');
    } else if (mode === 'FORGOT_PASSWORD') {
      if (!email) {
        setErrorMsg('Please enter your registered email address.');
        return;
      }
      setSuccessMsg('Password reset link has been dispatched to your email.');
    } else if (mode === 'ROLE_SELECT') {
      onAuthenticate(selectedRole, name || 'User');
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07111F]/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-[#101F31] border border-[#243A50] w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#F4F8FC] relative">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          aria-label="Close authentication modal"
          className="absolute top-5 right-5 p-2 text-[#7F91A6] hover:text-[#F4F8FC] hover:bg-[#14283D] rounded-xl transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#14283D] border border-[#19C3B1]/40 mx-auto flex items-center justify-center text-[#19C3B1] shadow-lg shadow-[#19C3B1]/10">
            <Brain className="w-6 h-6" />
          </div>
          <h2 id="auth-modal-title" className="text-2xl font-black text-[#F4F8FC] tracking-tight">
            {mode === 'LOGIN' && 'Sign in to MindCare NER'}
            {mode === 'SIGNUP' && 'Create Your MindCare Account'}
            {mode === 'FORGOT_PASSWORD' && 'Reset Your Password'}
            {mode === 'OTP_VERIFY' && 'Verify Your Email'}
            {mode === 'ROLE_SELECT' && 'Select Your Active Role'}
          </h2>
          <p className="text-xs text-[#B7C5D6]">
            {mode === 'LOGIN' && 'Access your personalized cognitive care workspace.'}
            {mode === 'SIGNUP' && 'Start your connected cognitive health journey.'}
            {mode === 'FORGOT_PASSWORD' && 'Enter your email to receive recovery instructions.'}
            {mode === 'OTP_VERIFY' && 'Enter the 6-digit code sent to your email.'}
            {mode === 'ROLE_SELECT' && 'Choose your experience portal to enter the dashboard.'}
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {mode === 'SIGNUP' && (
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-[#B7C5D6]">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#7F91A6]" />
                <input
                  type="text"
                  placeholder="e.g. Dhiren Borah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B1726] border border-[#243A50] focus:border-[#19C3B1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F4F8FC] placeholder-[#7F91A6] focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          {(mode === 'LOGIN' || mode === 'SIGNUP' || mode === 'FORGOT_PASSWORD') && (
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-[#B7C5D6]">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#7F91A6]" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B1726] border border-[#243A50] focus:border-[#19C3B1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F4F8FC] placeholder-[#7F91A6] focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          {(mode === 'LOGIN' || mode === 'SIGNUP') && (
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#B7C5D6]">Password</label>
                {mode === 'LOGIN' && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setMode('FORGOT_PASSWORD');
                    }}
                    className="text-[11px] font-bold text-[#38D9C5] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#7F91A6]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B1726] border border-[#243A50] focus:border-[#19C3B1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F4F8FC] placeholder-[#7F91A6] focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          {mode === 'OTP_VERIFY' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#B7C5D6] block text-center">
                Enter 6-Digit Verification Code
              </label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 bg-[#0B1726] border border-[#243A50] focus:border-[#19C3B1] rounded-xl text-center text-lg font-bold text-[#38D9C5] focus:outline-none"
                  />
                ))}
              </div>
            </div>
          )}

          {mode === 'ROLE_SELECT' && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { role: 'PATIENT' as UserRole, label: 'Senior Patient', desc: 'Large tactile interface & daily games', icon: Brain, color: '#19C3B1' },
                { role: 'CAREGIVER' as UserRole, label: 'Family Caregiver', desc: 'Remote adherence & missed alerts', icon: HeartHandshake, color: '#5BA7FF' },
                { role: 'HEALTHCARE_WORKER' as UserRole, label: 'Doctor / Clinician', desc: 'MoCA trajectory & export reports', icon: Stethoscope, color: '#8B7CFF' },
                { role: 'ADMIN' as UserRole, label: 'System Admin', desc: 'User & content management', icon: Shield, color: '#F4B740' },
              ].map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedRole(item.role);
                  }}
                  className={`p-3.5 rounded-2xl border text-left space-y-1.5 transition-all cursor-pointer ${
                    selectedRole === item.role
                      ? 'bg-[#14283D] border-[#19C3B1] shadow-md shadow-[#19C3B1]/10'
                      : 'bg-[#0B1726] border-[#243A50] hover:bg-[#14283D]'
                  }`}
                >
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  <h4 className="text-xs font-black text-[#F4F8FC]">{item.label}</h4>
                  <p className="text-[10px] text-[#7F91A6] leading-tight">{item.desc}</p>
                </button>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] rounded-xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <span>
              {isLoading
                ? 'Authenticating...'
                : mode === 'LOGIN'
                ? 'Sign In to Workspace'
                : mode === 'SIGNUP'
                ? 'Create Account'
                : mode === 'OTP_VERIFY'
                ? 'Verify Code'
                : mode === 'FORGOT_PASSWORD'
                ? 'Send Reset Link'
                : 'Enter Dashboard'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast-Login Bypass Chips */}
        {mode === 'LOGIN' && (
          <div className="pt-3 border-t border-[#243A50] space-y-2">
            <span className="text-[10px] font-black uppercase text-[#7F91A6] block text-center tracking-wider">
              ⚡ Demo Instant Role Access
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('PATIENT', 'Dhiren Borah')}
                className="px-2.5 py-1.5 bg-[#14283D] hover:bg-[#162B40] border border-[#243A50] hover:border-[#19C3B1] rounded-xl text-[11px] font-bold text-[#38D9C5] transition-all cursor-pointer truncate"
              >
                👴 Patient
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('CAREGIVER', 'Priyanka Borah')}
                className="px-2.5 py-1.5 bg-[#14283D] hover:bg-[#162B40] border border-[#243A50] hover:border-[#5BA7FF] rounded-xl text-[11px] font-bold text-[#5BA7FF] transition-all cursor-pointer truncate"
              >
                👩‍⚕️ Caregiver
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('HEALTHCARE_WORKER', 'Dr. Sharma')}
                className="px-2.5 py-1.5 bg-[#14283D] hover:bg-[#162B40] border border-[#243A50] hover:border-[#8B7CFF] rounded-xl text-[11px] font-bold text-[#8B7CFF] transition-all cursor-pointer truncate"
              >
                🩺 Clinician
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN', 'Admin Root')}
                className="px-2.5 py-1.5 bg-[#14283D] hover:bg-[#162B40] border border-[#243A50] hover:border-[#F4B740] rounded-xl text-[11px] font-bold text-[#F4B740] transition-all cursor-pointer truncate"
              >
                ⚙️ Admin
              </button>
            </div>
          </div>
        )}

        {/* Footer Mode Switcher */}
        <div className="pt-2 text-center text-xs text-[#B7C5D6]">
          {mode === 'LOGIN' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMode('SIGNUP');
                }}
                className="font-black text-[#38D9C5] hover:underline cursor-pointer"
              >
                Get Started
              </button>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setMode('LOGIN');
              }}
              className="font-black text-[#38D9C5] hover:underline cursor-pointer"
            >
              ← Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
