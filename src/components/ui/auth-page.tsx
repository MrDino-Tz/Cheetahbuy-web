"use client";

import * as React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Brand colors
const BRAND_ORANGE = "#F97316";
const DARK_BG = "#0a0a0f";
const CARD_BG = "#141419";
const INPUT_BG = "#e8ecfd";

export default function AuthPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"VENDOR" | "RIDER">("VENDOR");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role === "ADMIN") {
        navigate("/admin");
      } else if (profile?.role === "VENDOR") {
        navigate("/vendor");
      } else {
        alert("Unauthorized role");
        await supabase.auth.signOut();
      }
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) {
      alert(error.message);
    } else if (data.user) {
      alert("Registration successful! Please check your email to verify.");
      setIsLogin(true);
    }
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: DARK_BG }}
    >
      {/* Auth Card */}
      <div 
        className="w-full max-w-lg rounded-3xl p-10 sm:p-12"
        style={{ backgroundColor: CARD_BG }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/cheetah_logo.webp" alt="CheetahBuy" className="w-12 h-12 object-contain" />
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            {isLogin ? "Vendor Login" : "Create Account"}
          </h1>
          <p className="text-gray-400 text-base">
            {isLogin 
              ? "Manage your digital storefront." 
              : "Join as a vendor or rider"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
          {/* Role Selection (Register only) */}
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("VENDOR")}
                className={`py-4 px-4 rounded-xl text-base font-medium transition-all ${
                  role === "VENDOR"
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                style={{ 
                  backgroundColor: role === "VENDOR" ? BRAND_ORANGE : "#1f1f26",
                }}
              >
                Vendor
              </button>
              <button
                type="button"
                onClick={() => setRole("RIDER")}
                className={`py-4 px-4 rounded-xl text-base font-medium transition-all ${
                  role === "RIDER"
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                style={{ 
                  backgroundColor: role === "RIDER" ? BRAND_ORANGE : "#1f1f26",
                }}
              >
                Rider
              </button>
            </div>
          )}

          {/* Full Name (Register only) */}
          {!isLogin && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-14 border-0 text-gray-900 placeholder:text-gray-500 rounded-xl text-base"
                style={{ backgroundColor: INPUT_BG }}
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="admin@haset.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 border-0 text-gray-900 placeholder:text-gray-500 rounded-xl text-base"
              style={{ backgroundColor: INPUT_BG }}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Secure Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 border-0 text-gray-900 placeholder:text-gray-500 rounded-xl pr-12 text-base"
                style={{ backgroundColor: INPUT_BG }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl font-semibold text-lg mt-4 hover:opacity-90 transition-opacity"
            style={{ 
              backgroundColor: "white",
              color: "#0a0a0f"
            }}
          >
            {loading ? (
              <div className="size-6 border-2 border-gray-400/30 border-t-gray-900 rounded-full animate-spin" />
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
          </Button>
        </form>

        {/* Toggle */}
        <p className="text-center text-gray-500 text-base mt-8">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail("");
              setPassword("");
              setFullName("");
            }}
            className="font-semibold hover:underline ml-1"
            style={{ color: BRAND_ORANGE }}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
