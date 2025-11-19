import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/user/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token); // update app state
      navigate("/"); // redirect to home
    } catch (err) {
      setError(err.response?.data.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-500">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md h-[50vh] pt-15">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full  bg-gray-700 text-white py-2 rounded hover:bg-gray-500 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
