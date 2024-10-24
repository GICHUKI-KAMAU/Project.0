import axios from "axios";
import { TaskGet, UserRegister } from "../Components/types/user.types";
import { UserLogin } from "../Components/types/user.types";


const API_BASE_URL = "http://localhost:3500/api";

const api = axios.create({
    baseURL: API_BASE_URL
});

export const register = (userData: UserRegister) => api.post("/auth/signup", userData);
export const login = (userData: UserLogin) => api.post("/auth/login", userData);
export const getTasks = (taskData: TaskGet) => api.get("/tasks", { params: taskData });