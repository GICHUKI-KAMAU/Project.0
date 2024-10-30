import axios from "axios";
import {
  TaskGet,
  UserRegister,
  UserLogin,
} from "../Components/types/user.types";
import * as jose from "jose";

const API_BASE_URL = "http://localhost:3500/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const register = (userData: UserRegister) =>
  api.post("/auth/signup", userData);

export const login = async (userData: UserLogin) => {
  try {
    const response = await api.post<{ token: string }>("/auth/login", userData);
    console.log("the fetched user data is:", userData)

    const { token } = response.data;
    localStorage.setItem("accessToken", token);

    const decodedToken = jose.decodeJwt(token);

    // GET /users/:id    decodedToken.id
    const res = await fetch(`http://localhost:3500/api/auth/users/${decodedToken.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    const user = await res.json()

    localStorage.setItem("auth", JSON.stringify(user));

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getTasks = (taskData: TaskGet) =>
  api.get("/tasks", { params: taskData });
