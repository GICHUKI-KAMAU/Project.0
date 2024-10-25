import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as apiLogin } from "../../Utils/api"; 
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const userData = { username: "", email, password };
      

      const response = await apiLogin(userData) as {
        status: number; data: { user: { username: string }, token: string } 
};

      if (response.status === 200) {
        const data: { user: { username: string }, token: string } = response.data;

        localStorage.setItem("authToken", data.token);
        setSuccessMessage(`Welcome, ${data.user.username}! You are logged in.`);

        navigate("/");
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
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
