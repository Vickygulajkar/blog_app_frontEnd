export interface User{
    _id: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    createdAt: string;
}

export interface Post{
    _id: string;
    title: string;
    content: string;
    author: User;
    createdAt: string;
}

export interface AuthResponse{
    user: User;
    token: string;
}