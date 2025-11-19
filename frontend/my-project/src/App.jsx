import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

function App() {
  // token state
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route
          path="/"
          element={token ? <Home setToken={setToken} /> : <Navigate to="/login" />}
        />

        {/* Login route */}
        <Route
          path="/login"
          element={
            !token ? <Login setToken={setToken} /> : <Navigate to="/" />
          }
        />

        {/* Signup route */}
        <Route
          path="/signup"
          element={
            !token ? <Signup setToken={setToken} /> : <Navigate to="/" />
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
