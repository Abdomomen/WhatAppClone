"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToken, useUser } from "@/app/stores/context";
import authServices from "@/app/services/auth";

function WaLogo({ size = 40, color = "#00A884" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

const PERKS = [
  "End-to-end encrypted messages",
  "Real-time delivery & read receipts",
  "Group chats & media sharing",
  "Available on all your devices",
];

export default function Register() {
  const router = useRouter();
  const setToken = useToken((s) => s.setToken);
  const setUser = useUser((s) => s.setUser);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Full name is required.";
    if (!form.username.trim()) return "Username is required.";
    if (form.username.includes(" ")) return "Username cannot contain spaces.";
    if (!form.email.trim()) return "Email is required.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    const res = await authServices.register({
      name: form.name.trim(),
      username: form.username.trim().toLowerCase(),
      email: form.email.trim(),
      password: form.password,
    });
    if (res.success) {
      setToken(res.accessToken);
      setUser(res.user);
      router.replace("/home");
    } else {
      setError(res.message || res.error || "Registration failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-wa-dark text-wa-text">
      {/* ── Left: Branding Panel ── */}
      <div className="hidden lg:flex lg:w-[52%] bg-gradient-to-br from-wa-green-hover to-wa-dark flex-col items-center justify-center p-14 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute w-[480px] h-[480px] rounded-full bg-wa-green/5 -top-[140px] -left-[140px]" />
        <div className="absolute w-[320px] h-[320px] rounded-full bg-wa-green/5 -bottom-[100px] -right-[100px]" />

        <div className="relative z-10 text-center w-full max-w-[340px]">
          {/* Logo frame */}
          <div className="w-[100px] h-[100px] rounded-full bg-wa-green/10 border-2 border-wa-green/30 flex items-center justify-center mx-auto mb-[26px]">
            <WaLogo size={52} />
          </div>

          <h1 className="text-[34px] font-bold text-wa-text tracking-tight mb-[10px]">
            Join WhatsApp Clone
          </h1>
          <p className="text-[15.5px] text-wa-muted leading-relaxed mb-10">
            Create an account and start
            <br />
            messaging your people today.
          </p>

          {/* Checklist */}
          <div className="flex flex-col gap-3.5 text-left">
            {PERKS.map((perk, i) => (
              <div
                key={i}
                style={{ animation: `fadeInUp 0.5s ease ${i * 0.1}s both` }}
                className="flex items-center gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-wa-green/18 border border-wa-green/25 flex items-center justify-center shrink-0">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00A884"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-[13.5px] text-wa-text">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-8 bg-wa-dark">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-7">
            <div className="w-[42px] h-[42px] rounded-full bg-wa-green/10 flex items-center justify-center">
              <WaLogo size={22} />
            </div>
            <span className="text-[19px] font-bold text-wa-text">
              WhatsApp Clone
            </span>
          </div>

          {/* Heading */}
          <div className="mb-[26px]">
            <h2 className="text-[25px] font-bold text-wa-text mb-1.5">
              Create account
            </h2>
            <p className="text-[14px] text-wa-muted">
              Fill in your details to get started
            </p>
          </div>

          {/* Error display */}
          {error && (
            <div className="mb-[18px] flex items-center gap-2.5 bg-wa-error/10 border border-wa-error/25 rounded-[9px] p-[11px] px-[14px] text-[13.5px] text-wa-error">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name + Username Row */}
            <div className="flex gap-3.5">
              <div className="flex-1 flex flex-col gap-2">
                <label
                  className="text-[12px] font-semibold text-wa-muted tracking-wider uppercase"
                  htmlFor="reg-name"
                >
                  Full name
                </label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Ahmad Ali"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-wa-input border border-transparent focus:border-wa-green focus:ring-[3px] focus:ring-wa-green/15 text-wa-text rounded-[9px] px-4 py-3 text-[14.5px] outline-none transition-all duration-250 disabled:opacity-60 disabled:cursor-not-allowed placeholder-wa-muted/60"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label
                  className="text-[12px] font-semibold text-wa-muted tracking-wider uppercase"
                  htmlFor="reg-username"
                >
                  Username
                </label>
                <input
                  id="reg-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="ahmad_ali"
                  value={form.username}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-wa-input border border-transparent focus:border-wa-green focus:ring-[3px] focus:ring-wa-green/15 text-wa-text rounded-[9px] px-4 py-3 text-[14.5px] outline-none transition-all duration-250 disabled:opacity-60 disabled:cursor-not-allowed placeholder-wa-muted/60"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label
                className="text-[12px] font-semibold text-wa-muted tracking-wider uppercase"
                htmlFor="reg-email"
              >
                Email address
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-wa-input border border-transparent focus:border-wa-green focus:ring-[3px] focus:ring-wa-green/15 text-wa-text rounded-[9px] px-4 py-3 text-[14.5px] outline-none transition-all duration-250 disabled:opacity-60 disabled:cursor-not-allowed placeholder-wa-muted/60"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label
                className="text-[12px] font-semibold text-wa-muted tracking-wider uppercase"
                htmlFor="reg-password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-wa-input border border-transparent focus:border-wa-green focus:ring-[3px] focus:ring-wa-green/15 text-wa-text rounded-[9px] pl-4 pr-12 py-3 text-[14.5px] outline-none transition-all duration-250 disabled:opacity-60 disabled:cursor-not-allowed placeholder-wa-muted/60"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass((p) => !p)}
                  aria-label={showPass ? "Hide" : "Show"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-wa-muted hover:text-wa-text cursor-pointer flex items-center p-1"
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-2">
              <label
                className="text-[12px] font-semibold text-wa-muted tracking-wider uppercase"
                htmlFor="reg-confirm"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="reg-confirm"
                  name="confirm"
                  type={showConf ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-wa-input border border-transparent focus:border-wa-green focus:ring-[3px] focus:ring-wa-green/15 text-wa-text rounded-[9px] pl-4 pr-12 py-3 text-[14.5px] outline-none transition-all duration-250 disabled:opacity-60 disabled:cursor-not-allowed placeholder-wa-muted/60"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConf((p) => !p)}
                  aria-label={showConf ? "Hide" : "Show"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-wa-muted hover:text-wa-text cursor-pointer flex items-center p-1"
                >
                  <EyeIcon open={showConf} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1.5 w-full bg-wa-green hover:bg-wa-green-hover text-white font-semibold rounded-[10px] py-3.5 px-6 text-[15px] cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading && (
                <span className="w-[18px] h-[18px] shrink-0 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-[26px] text-[14px] text-wa-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="color-wa-green hover:text-white font-semibold no-underline text-wa-green transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
