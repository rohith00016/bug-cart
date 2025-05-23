import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useAuth = (initialState = "Login") => {
  const [currentState, setCurrentState] = useState(initialState);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const url = currentState === "Login" ? "/login" : "/signup";

    try {
      const response = await axios.post(
        `http://localhost:8000/api/auth${url}`,
        form
      );
      const data = response.data;

      if (currentState === "Login") {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/");
          alert("Login successful");
        } else {
          alert(data.message || "Login failed");
        }
      } else {
        alert("Signup successful. Please log in.");
        setCurrentState("Login");
        setForm({ name: "", email: "", password: "" });
      }
    } catch (error) {
      console.error("Axios Error:", error.response || error.message);
      alert(error.response?.data?.message || "Server error");
    }
  };

  return {
    currentState,
    setCurrentState,
    form,
    setForm,
    onChange,
    onSubmitHandler,
  };
};

export default useAuth;
