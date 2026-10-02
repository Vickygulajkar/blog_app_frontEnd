import axios from "axios"
import { useEffect, useState } from "react"
import type { User, Post } from "../types"

function Admin() {
    const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "posts">("dashboard")

    const [users, setUsers] = useState<User[]>([])
    const [showEditForm, setShowEditForm] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [editFormData, setEditFormData] = useState({ name: "", email: "", role: "" })
    const [showCreateModel, setShowCreateModel] = useState(false)
    const [createFormData, setCreateFormData] = useState({ name: "", email: "", role: "", password: "" })

    const [posts, setPosts] = useState<Post[]>([])
    const [showEditPostForm, setShowEditPostForm] = useState(false)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [editPostFormData, setEditPostFormData] = useState({ title: "", content: "" })
    const [showCreatePostModel, setShowCreatePostModel] = useState(false)
    const [createPostFormData, setCreatePostFormData] = useState({ title: "", content: "" })

    const token = localStorage.getItem("token")

    const fetchUsers = async () => {
        try {
            const response = await axios.get("https://blog-app-backend-mmiu.onrender.com/api/users")
            setUsers(response.data)
        } catch (error) {
            console.error("Failed to fetch users:", error)
        }
    }

    const fetchPosts = async () => {
        try {
            const response = await axios.get("https://blog-app-backend-mmiu.onrender.com/api/posts")
            setPosts(response.data)
        } catch (error) {
            console.error("Failed to fetch posts:", error)
        }
    }

    useEffect(() => {
        fetchUsers()
        fetchPosts()
    }, [])

    const handleDeleteUser = async (userId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?")
        if (!confirmDelete) return
        try {
            await axios.delete(`https://blog-app-backend-mmiu.onrender.com/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers(users.filter((user) => user._id !== userId))
        } catch (error) {
            console.error("Failed to delete user:", error)
        }
    }

    const handleEditUser = (userId: string) => {
        const user = users.find((u) => u._id === userId)
        if (user) {
            setSelectedUser(user)
            setEditFormData({ name: user.name, email: user.email, role: user.role })
            setShowEditForm(true)
        }
    }

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setEditFormData((prevData) => ({ ...prevData, [name]: value }))
    }

    const handleUserUpdate = async () => {
        if (!selectedUser) return
        try {
            await axios.put(`https://blog-app-backend-mmiu.onrender.com/api/users/${selectedUser._id}`, editFormData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers(users.map((user) => (user._id === selectedUser._id ? { ...user, ...editFormData } as User : user)))
            setShowEditForm(false)
            setSelectedUser(null)
        } catch (error) {
            console.error("Failed to update user:", error)
        }
    }

    const createUser = async () => {
        try {
            const response = await axios.post("https://blog-app-backend-mmiu.onrender.com/api/auth/register", createFormData)
            setUsers([...users, response.data.user])
            alert("User created successfully!")
            setCreateFormData({ name: "", email: "", role: "", password: "" })
            setShowCreateModel(false)
            fetchUsers()
        } catch (error) {
            console.error("Failed to create user:", error)
        }
    }

    const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setCreateFormData((prevData) => ({ ...prevData, [name]: value }))
    }

    const handleDeletePost = async (postId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?")
        if (!confirmDelete) return
        try {
            await axios.delete(`https://blog-app-backend-mmiu.onrender.com/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setPosts(posts.filter((post) => post._id !== postId))
        } catch (error) {
            console.error("Failed to delete post:", error)
        }
    }

    const handleEditPost = (postId: string) => {
        const post = posts.find((p) => p._id === postId)
        if (post) {
            setSelectedPost(post)
            setEditPostFormData({ title: post.title, content: post.content })
            setShowEditPostForm(true)
        }
    }

    const handleEditPostFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEditPostFormData((prevData) => ({ ...prevData, [name]: value }))
    }

    const handlePostUpdate = async () => {
        if (!selectedPost) return
        try {
            const response = await axios.put(`https://blog-app-backend-mmiu.onrender.com/api/posts/${selectedPost._id}`, editPostFormData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setPosts(posts.map((post) => (post._id === selectedPost._id ? { ...post, ...response.data } : post)))
            setShowEditPostForm(false)
            setSelectedPost(null)
        } catch (error) {
            console.error("Failed to update post:", error)
        }
    }

    const createPost = async () => {
        try {
            const response = await axios.post("https://blog-app-backend-mmiu.onrender.com/api/posts", createPostFormData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setPosts([...posts, response.data])
            alert("Post created successfully!")
            setCreatePostFormData({ title: "", content: "" })
            setShowCreatePostModel(false)
            fetchPosts()
        } catch (error) {
            console.error("Failed to create post:", error)
        }
    }

    const handleCreatePostChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setCreatePostFormData((prevData) => ({ ...prevData, [name]: value }))
    }

    const handleLogOut = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/"
    }

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-8">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="mt-1 text-gray-500">Manage users and posts</p>
                </div>
                <button
                    onClick={handleLogOut}
                    className="rounded-md bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            <div className="mb-6 flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`py-2 px-4 border-b-2 font-medium text-sm transition ${activeTab === "dashboard" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setActiveTab("users")}
                    className={`py-2 px-4 border-b-2 font-medium text-sm transition ${activeTab === "users" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                >
                    Users
                </button>
                <button
                    onClick={() => setActiveTab("posts")}
                    className={`py-2 px-4 border-b-2 font-medium text-sm transition ${activeTab === "posts" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                >
                    Posts
                </button>
            </div>

            {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between border-l-4 border-blue-500">
                        <div>
                            <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Users</h2>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{users.length}</p>
                        </div>
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between border-l-4 border-green-500">
                        <div>
                            <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Posts</h2>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{posts.length}</p>
                        </div>
                        <div className="bg-green-100 text-green-600 p-3 rounded-full">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "users" && (
                <div>
                    <div className="mb-4">
                        <button
                            onClick={() => setShowCreateModel(true)}
                            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Create New User
                        </button>
                    </div>
                    <div className="overflow-x-auto rounded-lg bg-white shadow-md">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border-b px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                    <th className="border-b px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                    <th className="border-b px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                                    <th className="border-b px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="transition hover:bg-gray-50">
                                        <td className="border-b px-6 py-4 text-sm text-gray-800">{user.name}</td>
                                        <td className="border-b px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                        <td className="border-b px-6 py-4 text-sm">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{user.role}</span>
                                        </td>
                                        <td className="border-b px-6 py-4">
                                            <button className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600" onClick={() => handleEditUser(user._id)}>Edit</button>
                                            <button className="ml-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "posts" && (
                <div>
                    <div className="mb-4">
                        <button
                            onClick={() => setShowCreatePostModel(true)}
                            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Create New Post
                        </button>
                    </div>
                    <div className="overflow-x-auto rounded-lg bg-white shadow-md">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border-b px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                                    <th className="border-b px-6 py-4 text-left text-sm font-semibold text-gray-700">Author</th>
                                    <th className="border-b px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post) => (
                                    <tr key={post._id} className="transition hover:bg-gray-50">
                                        <td className="border-b px-6 py-4 text-sm text-gray-800">{post.title}</td>
                                        <td className="border-b px-6 py-4 text-sm text-gray-600">{post.author?.name}</td>
                                        <td className="border-b px-6 py-4">
                                            <button className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600" onClick={() => handleEditPost(post._id)}>Edit</button>
                                            <button className="ml-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600" onClick={() => handleDeletePost(post._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showEditForm && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800">Edit User</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleUserUpdate(); }} className="space-y-5">
                            <div><label className="mb-2 block text-sm font-medium text-gray-700">Name</label><input className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800" name="name" value={editFormData.name} onChange={handleEditFormChange} /></div>
                            <div><label className="mb-2 block text-sm font-medium text-gray-700">Email</label><input className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800" name="email" value={editFormData.email} onChange={handleEditFormChange} /></div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Role</label>
                                <select className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-800" name="role" value={editFormData.role} onChange={handleEditFormChange}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button className="rounded-md bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700" type="button" onClick={() => { setShowEditForm(false); setSelectedUser(null); }}>Cancel</button>
                                <button className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white" type="submit">Update User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCreateModel && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800">Create User</h2>
                        <form onSubmit={(e) => { e.preventDefault(); createUser(); }} className="space-y-5">
                            <div><label className="mb-2 block text-sm font-medium text-gray-700">Name</label><input className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800" name="name" value={createFormData.name} onChange={handleCreateChange} /></div>
                            <div><label className="mb-2 block text-sm font-medium text-gray-700">Email</label><input className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800" name="email" value={createFormData.email} onChange={handleCreateChange} /></div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Role</label>
                                <select className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-800" name="role" value={createFormData.role} onChange={handleCreateChange}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div><label className="mb-2 block text-sm font-medium text-gray-700">Password</label><input className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800" name="password" type="password" value={createFormData.password} onChange={handleCreateChange} /></div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button className="rounded-md bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700" type="button" onClick={() => { setShowCreateModel(false); setCreateFormData({ name: "", email: "", role: "", password: "" }); }}>Cancel</button>
                                <button className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white" type="submit">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditPostForm && selectedPost && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800">Edit Post</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handlePostUpdate(); }} className="space-y-5">
                            <div><label className="mb-2 block text-sm font-medium text-gray-700">Title</label><input className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800" name="title" value={editPostFormData.title} onChange={handleEditPostFormChange} /></div>
                            <div><label className="mb-2 block text-sm font-medium text-gray-700">Content</label><textarea className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800 h-32" name="content" value={editPostFormData.content} onChange={handleEditPostFormChange} /></div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button className="rounded-md bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700" type="button" onClick={() => { setShowEditPostForm(false); setSelectedPost(null); }}>Cancel</button>
                                <button className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white" type="submit">Update Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCreatePostModel && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800">Create Post</h2>
                        <form onSubmit={(e) => { e.preventDefault(); createPost(); }} className="space-y-5">
                            <div><label className="mb-2 block text-sm font-medium text-gray-700">Title</label><input className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800" name="title" value={createPostFormData.title} onChange={handleCreatePostChange} /></div>
                            <div><label className="mb-2 block text-sm font-medium text-gray-700">Content</label><textarea className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800 h-32" name="content" value={createPostFormData.content} onChange={handleCreatePostChange} /></div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button className="rounded-md bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700" type="button" onClick={() => { setShowCreatePostModel(false); setCreatePostFormData({ title: "", content: "" }); }}>Cancel</button>
                                <button className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white" type="submit">Create Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Admin
