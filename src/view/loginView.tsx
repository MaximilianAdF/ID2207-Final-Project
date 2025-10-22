import React, { useState } from "react";
import { authenticateUser } from "../model/userModel";
import { useNavigate } from "react-router-dom";
import { User, KeyRound } from "lucide-react";

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
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = authenticateUser(formData.username, formData.password);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard", { replace: true });
    } else {
      setError("Invalid username or password");
    }
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
    <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gray-300 p-10 rounded-lg shadow-lg">
        <div className="h-6 mb-4 -mx-2">
          {error && <span className="text-red-400">{error}</span>}
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-4 flex-col">
          <div className="flex flex-col"> 
            <div className="flex flex-row gap-1 items-center">
              <User className="size-5" />
              <label htmlFor="username">Username: </label>
            </div>
            <input
              className="px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col"> 
            <div className="flex flex-row gap-1 items-center">
              <KeyRound className="size-5"/>
              <label htmlFor="password"> Password: </label>
            </div>
            <input
              className="px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button className="mt-4 cursor-pointer py-2 bg-blue-500 text-white font-semibold rounded-xl shadow-md border border-blue-700 hover:bg-blue-700 transition duration-300 ease-in-out" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
