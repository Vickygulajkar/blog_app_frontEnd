export interface User{
    _id: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    createdAt: string;
}

export interface AuthResponse{
    user: User;
    token: string;
}