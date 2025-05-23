import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/reset-password", {
        token,
        password,
      });
      alert(res.data.message || "Password updated successfully");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      alert(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleReset}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mt-10 mb-2">
        <p className="text-3xl">Reset Password</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="px-8 py-2 mt-4 font-light text-white bg-black disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPassword;
