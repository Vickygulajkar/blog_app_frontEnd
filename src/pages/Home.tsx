import { useState, useEffect } from "react"
// import api from "../service/api"
import type { User } from "../types"
import axios from "axios"



function Home() {
    // const [users, setUsers] = useState<User | null>(null)
    const [users, setUsers] = useState<User[]>([])
    console.log(users)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/users")
                setUsers(response.data)
            } catch (error) {
                console.error("Failed to fetch user:", error)
            }
        }

        fetchUser()
    }, [])

    const handleLogOut = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"
    }

    return (
        <>
            <div className="min-h-screen">

                <h2>Home Page</h2>

                <div className="mt-4">
                    <button
                        onClick={handleLogOut}
                        className="rounded-md bg-red-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        Logout
                    </button>
                </div>

                <div className="mt-6 overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-3 text-left">
                                    Name
                                </th>
                                <th className="border border-gray-300 px-4 py-3 text-left">
                                    Email
                                </th>
                                <th className="border border-gray-300 px-4 py-3 text-left">
                                    Role
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-3">
                                        {user.name}
                                    </td>

                                    <td className="border border-gray-300 px-4 py-3">
                                        {user.email}
                                    </td>

                                    <td className="border border-gray-300 px-4 py-3">
                                        {user.role}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}

export default Home