import { useState, useEffect } from "react"
import api from "../service/api"
// import { Link, useNavigate } from "react-router-dom"
import type { AuthResponse } from "../types"


function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    // const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            const response = await api.post<AuthResponse>("/auth/login", { email, password })
            const { token } = response.data
            localStorage.setItem("token", token)
            alert("Login successful!")
            if (response.data.user.role === "admin") {
                // navigate("/admin") // Redirect to admin dashboard
                window.location.href = "/admin" // Redirect to admin dashboard
            } else {
                // navigate("/home") // Redirect to home page
                window.location.href = "/home" // Redirect to home page
            }
        } catch (error) {
            console.error("Login failed:", error)
            alert("Login failed!")
        } finally {
            setLoading(false)
        }
    }



    return (
        <>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Login Page
                        </h1>
                    </div>

                    {
                        error && (
                            <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )
                    }

                    <form
                        action=""
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleLogin()
                        }}
                        className="space-y-5"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                </div>

            </div>
        </>
    )
}

export default Login
