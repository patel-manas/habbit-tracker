"use client";

import React, { useState } from "react";
import { useHabits } from "@/lib/habitContext";
import { X, Lock, Mail, User, ShieldCheck, AlertCircle, LogOut } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    user, 
    loginWithEmail, 
    signupWithEmail, 
    loginWithGoogle, 
    loginAsDemo, 
    logout 
  } = useHabits();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (mode === "signin") {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password, displayName || "Habit Champion");
      }
      onClose();
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || "Authentication failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setErrorMsg("Sign-in popup was closed before completing.");
      } else if (err.code === "auth/configuration-not-found" || err.message?.includes("identitytoolkit")) {
        setErrorMsg("Google Sign-In needs to be enabled once in Firebase Console (Authentication > Sign-in method > Google).");
      } else {
        setErrorMsg(err.message || "Google sign-in error.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = (name = "Manas") => {
    loginAsDemo(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-[#22444e] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#142a32] hover:bg-[#1a3844] text-[#859ca2] hover:text-white flex items-center justify-center border border-[#1e3c46] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* If user is already logged in, show Profile card */}
        {user && !user.isDemo ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl mx-auto bg-gradient-to-tr from-[#1b3a44] to-[#2dd4bf]/40 p-1 flex items-center justify-center overflow-hidden">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-full h-full object-cover rounded-[22px]"
                />
              ) : (
                <div className="w-full h-full rounded-[22px] bg-[#0c1a1e] flex items-center justify-center text-xl font-black text-[#dcf743]">
                  {user.displayName?.slice(0, 2).toUpperCase() || "MP"}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">{user.displayName}</h3>
              <p className="text-xs text-[#859ca2] mt-0.5">{user.email}</p>
              <span className="inline-flex items-center gap-1 mt-2 text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-[#2dd4bf]/15 text-[#2dd4bf] border border-[#2dd4bf]/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Synchronized with Firebase Cloud
              </span>
            </div>

            <div className="pt-4 border-t border-[#18343e] flex flex-col gap-2">
              <button
                onClick={async () => {
                  await logout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-[#f87171]/15 hover:bg-[#f87171]/25 text-[#f87171] font-semibold text-xs transition-colors border border-[#f87171]/30 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl mx-auto mb-3 bg-[#dcf743]/10 border border-[#dcf743]/30 flex items-center justify-center text-[#dcf743]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Sign In to Habit Tracker
              </h3>
              <p className="text-xs text-[#859ca2] mt-1">
                Every user gets their own private habits, streaks & dashboards
              </p>
            </div>

            {/* Primary Google Login Button */}
            <div className="mb-5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-[#142930] hover:bg-[#1a3844] border border-[#274c5a] hover:border-[#2dd4bf]/50 text-white text-sm font-bold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg shadow-black/20"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-[#18343e] w-full" />
              <span className="bg-[#0f2127] px-3 text-[10px] font-semibold uppercase tracking-wider text-[#68858e] absolute">
                or use email
              </span>
            </div>

            {/* Mode Switcher */}
            <div className="flex rounded-2xl bg-[#0c1a1e] p-1 border border-[#18343e] mb-4">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  mode === "signin"
                    ? "bg-[#1e3c46] text-white shadow-sm"
                    : "text-[#859ca2] hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  mode === "signup"
                    ? "bg-[#1e3c46] text-white shadow-sm"
                    : "text-[#859ca2] hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-[#f87171]/10 border border-[#f87171]/30 text-[#f87171] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#859ca2] uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-2.5 w-4 h-4 text-[#5e7d86]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Manas Patel"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#0c1a1e] border border-[#1d3c46] text-white text-xs focus:outline-none focus:border-[#dcf743]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[#859ca2] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-[#5e7d86]" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#0c1a1e] border border-[#1d3c46] text-white text-xs focus:outline-none focus:border-[#dcf743]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#859ca2] uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-[#5e7d86]" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#0c1a1e] border border-[#1d3c46] text-white text-xs focus:outline-none focus:border-[#dcf743]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-1 rounded-2xl bg-[#dcf743] hover:bg-[#e6fc58] text-[#091518] font-bold text-xs shadow-md shadow-[#dcf743]/20 transition-all cursor-pointer"
              >
                {loading
                  ? "Processing..."
                  : mode === "signin"
                  ? "Sign In with Email"
                  : "Create Account"}
              </button>
            </form>

            {/* Demo Option */}
            <div className="mt-3 pt-3 border-t border-[#18343e] text-center">
              <button
                type="button"
                onClick={() => handleDemoSignIn("Manas")}
                className="text-[11px] text-[#6d8a92] hover:text-[#dcf743] transition-colors"
              >
                Or continue offline in Demo Mode →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
