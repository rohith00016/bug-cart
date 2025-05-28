import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      alert(res.data.message || "Check your email for reset instructions");
    } catch (error) {
      alert(error.response?.data?.message || "Error sending reset link");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mt-10 mb-2">
        <p className="text-3xl">Forgot Password</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button
        type="submit"
        className="px-8 py-2 mt-4 font-light text-white bg-black"
      >
        Send Reset Link
      </button>
    </form>
  );
};

export default ForgotPassword;
