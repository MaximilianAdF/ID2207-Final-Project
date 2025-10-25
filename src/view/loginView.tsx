import React, { useState } from "react";
import { authenticateUser } from "../model/userModel";
import { useNavigate } from "react-router-dom";
import { User, KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";

interface LoginFormData {
  username: string;
  password: string;
}

const LoginView: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const username = formData.username.trim();
    const password = formData.password;
    if (!username || !password) {
      setError("Please enter your username and password");
      return;
    }

    setLoading(true);
    // Simulate tiny auth delay for better UX feedback
    setTimeout(() => {
      const user = authenticateUser(username, password);

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("rememberMe", rememberMe ? "true" : "false");
        navigate("/dashboard", { replace: true });
      } else {
        setError("Invalid username or password");
      }
      setLoading(false);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <img src="/sep-logo.svg" alt="SEP Logo" className="mx-auto mb-3 h-12 w-12" />
          <h1 className="text-2xl font-semibold text-slate-800">SEP</h1>
          <p className="text-slate-500 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-md border border-slate-200">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-4 flex-col">
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="text-sm text-slate-700 flex items-center gap-2">
                <User className="size-4" /> Username
              </label>
              <input
                className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="username"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm text-slate-700 flex items-center gap-2">
                <KeyRound className="size-4" /> Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 select-none text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                Remember me
              </label>
              <span />
            </div>

            <button
              className="mt-2 inline-flex items-center justify-center gap-2 cursor-pointer py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading || !formData.username || !formData.password}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* No demo quick-fill in production UI */}
        </div>

        {/* Footer note */}
        <span className="sr-only">SEP Login</span>
      </div>
    </div>
  );
};

export default LoginView;
