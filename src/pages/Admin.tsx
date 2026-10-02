import axios from "axios"
import { useEffect, useState } from "react"

type User = {
    _id: string
    name: string
    email: string
    role: string
}


function Admin() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [showEditForm, setShowEditForm] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    // const [editloading, setEditLoading] = useState(false)
    const [editFormData, setEditFormData] = useState({
        name: "",
        email: "",
        role: ""
    })

    const [showCreateModel, setShowCreateModel] = useState(false)
    const [createFormData, setCreateFormData] = useState({
        name: "",
        email: "",
        role: "",
        password: ""
    })

    const fetchUsers = async () => {
        try {
            const response = await axios.get("https://blog-app-backend-mmiu.onrender.com/api/users")
            setUsers(response.data)
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch users:", error)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteUser = async (userId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?")
        if (!confirmDelete) {
            return
        }
        try {
            const token = localStorage.getItem("token")
            await axios.delete(`https://blog-app-backend-mmiu.onrender.com/api/users/${userId}`, {
headers: {
    Authorization: `Bearer ${token}`
}
            })
setUsers(users.filter((user) => user._id !== userId))
        } catch (error) {
    console.error("Failed to delete user:", error)
}
    }

const handleEditUser = (userId: string) => {
    console.log("Edit user with ID:", userId)
    const user = users.find((u) => u._id === userId)
    if (user) {
        setSelectedUser(user)
        setEditFormData({
            name: user.name,
            email: user.email,
            role: user.role
        })
        setShowEditForm(true)
    }
}

const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditFormData((prevData) => ({
        ...prevData,
        [name]: value
    }))
}

const handleUserUpdate = async () => {
    if (!selectedUser) {
        return
    }
    try {
        const token = localStorage.getItem("token")
        await axios.put(`https://blog-app-backend-mmiu.onrender.com/api/users/${selectedUser._id}`, editFormData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setUsers(users.map((user) => (user._id === selectedUser._id ? { ...user, ...editFormData } : user)))
        setShowEditForm(false)
        setSelectedUser(null)
    } catch (error) {
        console.error("Failed to update user:", error)
    } finally {
        // setEditLoading(false)
    }
}

useEffect(() => {
    fetchUsers()
}, [])

const handleLogOut = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
}

const createUser = () => {
    try {
        const response = axios.post("https://blog-app-backend-mmiu.onrender.com/api/auth/register", createFormData)
        setUsers([...users, response.data])
        alert("User created successfully!")
        window.location.reload()

        setCreateFormData({
            name: "",
            email: "",
            role: "",
            password: ""
        })

        setShowCreateModel(false)
        fetchUsers()
    } catch (error) {
        console.error("Failed to create user:", error)
    }
}

const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCreateFormData((prevData) => ({
        ...prevData,
        [name]: value
    }))
}

return (
    <>
        <div className="min-h-screen bg-gray-100 px-6 py-8">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Admin Dashboard
                </h1>
                <p className="mt-1 text-gray-500">
                    Manage all users
                </p>
            </div>

            {/* Actions */}
            <div className="mb-6 flex items-center gap-3">
                <button
                    onClick={() => setShowCreateModel(true)}
                    className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Create New User
                </button>

                <button
                    onClick={handleLogOut}
                    className="rounded-md bg-red-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                    Logout
                </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-lg bg-white shadow-md">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Name
                            </th>
                            <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Email
                            </th>
                            <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Role
                            </th>
                            <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user._id}
                                className="transition hover:bg-gray-50"
                            >
                                <td className="border-b border-gray-100 px-6 py-4 text-sm text-gray-800">
                                    {user.name}
                                </td>

                                <td className="border-b border-gray-100 px-6 py-4 text-sm text-gray-600">
                                    {user.email}
                                </td>

                                <td className="border-b border-gray-100 px-6 py-4 text-sm">
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                        {user.role}
                                    </span>
                                </td>

                                <td className="border-b border-gray-100 px-6 py-4">
                                    <button
                                        className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                                        onClick={() => handleEditUser(user._id)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="ml-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                                        onClick={() => handleDeleteUser(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Edit User Modal */}
        {showEditForm && selectedUser && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">

                    <h2 className="mb-6 text-2xl font-bold text-gray-800">
                        Edit User
                    </h2>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleUserUpdate()
                        }}
                        className="space-y-5"
                    >
                        <div>
                            <label
                                className="mb-2 block text-sm font-medium text-gray-700"
                                htmlFor="name"
                            >
                                Name
                            </label>

                            <input
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                id="name"
                                name="name"
                                value={editFormData.name}
                                onChange={handleEditFormChange}
                            />
                        </div>

                        <div>
                            <label
                                className="mb-2 block text-sm font-medium text-gray-700"
                                htmlFor="email"
                            >
                                Email
                            </label>

                            <input
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                id="email"
                                name="email"
                                value={editFormData.email}
                                onChange={handleEditFormChange}
                            />
                        </div>

                        <div>
                            <label
                                className="mb-2 block text-sm font-medium text-gray-700"
                                htmlFor="role"
                            >
                                Role
                            </label>

                            <select
                                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                id="role"
                                name="role"
                                value={editFormData.role}
                                onChange={handleEditFormChange}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                className="rounded-md bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
                                type="button"
                                onClick={() => {
                                    setShowEditForm(false)
                                    setSelectedUser(null)
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                                type="submit"
                            >
                                Update User
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Create User Modal */}
        {showCreateModel && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">

                    <h2 className="mb-6 text-2xl font-bold text-gray-800">
                        Create User
                    </h2>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            createUser()
                        }}
                        className="space-y-5"
                    >
                        <div>
                            <label
                                className="mb-2 block text-sm font-medium text-gray-700"
                                htmlFor="name"
                            >
                                Name
                            </label>

                            <input
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                id="name"
                                name="name"
                                value={createFormData.name}
                                onChange={handleCreateChange}
                            />
                        </div>

                        <div>
                            <label
                                className="mb-2 block text-sm font-medium text-gray-700"
                                htmlFor="email"
                            >
                                Email
                            </label>

                            <input
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                id="email"
                                name="email"
                                value={createFormData.email}
                                onChange={handleCreateChange}
                            />
                        </div>

                        <div>
                            <label
                                className="mb-2 block text-sm font-medium text-gray-700"
                                htmlFor="role"
                            >
                                Role
                            </label>

                            <select
                                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                id="role"
                                name="role"
                                value={createFormData.role}
                                onChange={handleCreateChange}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div>
                            <label
                                className="mb-2 block text-sm font-medium text-gray-700"
                                htmlFor="password"
                            >
                                Password
                            </label>

                            <input
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                id="password"
                                name="password"
                                type="password"
                                value={createFormData.password}
                                onChange={handleCreateChange}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                className="rounded-md bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
                                type="button"
                                onClick={() => {
                                    setShowCreateModel(false)
                                    setCreateFormData({
                                        name: "",
                                        email: "",
                                        role: "",
                                        password: ""
                                    })
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                                type="submit"
                            >
                                Create User
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </>
)
}

export default Admin
