import { useState, useEffect } from "react"
import type { Post } from "../types"
import axios from "axios"
import { Link } from "react-router-dom"
import AdSlot from "../comopnents/AdSlot"

function Home() {
    const [posts, setPosts] = useState<Post[]>([])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("https://blog-app-backend-mmiu.onrender.com/api/posts")
                setPosts(response.data)
            } catch (error) {
                console.error("Failed to fetch posts:", error)
            }
        }
        fetchPosts()
    }, [])

    const handleLogOut = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/"
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
            <AdSlot slotId="top-banner" width={728} height={90} label="Top Banner" />
            
            <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Blog Home</h1>
                <button
                    onClick={handleLogOut}
                    className="rounded-md bg-red-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                >
                    Logout
                </button>
            </header>

            <div className="flex flex-1 max-w-6xl mx-auto w-full px-4 py-8 gap-8">
                <main className="flex-1">
                    <div className="grid gap-6">
                        {posts.map((post) => (
                            <div key={post._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition hover:shadow-md">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                                <p className="text-sm text-gray-500 mb-4">By {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}</p>
                                <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                                <Link to={`/post/${post._id}`} className="text-blue-600 hover:underline font-medium">Read more</Link>
                            </div>
                        ))}
                        {posts.length === 0 && <p className="text-gray-500 text-center py-10">No posts available.</p>}
                    </div>
                </main>
                <aside className="w-80 hidden lg:block">
                    <AdSlot slotId="sidebar-ad" width={300} height={250} label="Sidebar Ad" />
                </aside>
            </div>

            <AdSlot slotId="bottom-banner" width={728} height={90} label="Bottom Banner" />
            
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
                <AdSlot slotId="sticky-footer" width={320} height={50} label="Sticky Footer" />
            </div>
        </div>
    )
}

export default Home