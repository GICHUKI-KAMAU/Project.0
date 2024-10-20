import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

// Importing mock data (replace with actual mock.json import path)
import mockData from "../MockData/mock.json";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Find the user by email and password (hashed passwords not implemented here)
    const user = mockData.users.find(
      (user: { email: string; password: string }) =>
        user.email === email && user.password === password
    );

    if (user) {
      setSuccessMessage(`Welcome, ${user.name}! You are logged in.`);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p className="account">
          Don't have an account?{" "}
          <Link to="/register" className="signup-link">
            Sign up
          </Link>
        </p>
      </form>

    </div>
  );
};

export default Login;
