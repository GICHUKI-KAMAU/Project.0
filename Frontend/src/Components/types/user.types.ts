type User = {
    username: string;
    email: string;
    password: string;
    role: string;
};

export type UserRegister = Omit<User, "role">;
export type UserLogin = Pick<User, "email" | "password" | "username">;

type Task = {
    id: string;
    description: string;
    due_date: string;
    AssignedToName: string;
    project_id: string;
    status: string;
};

export type TaskGet = Task;