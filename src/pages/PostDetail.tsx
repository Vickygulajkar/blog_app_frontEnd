import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import type { Post } from "../types"
import axios from "axios"
import AdSlot from "../comopnents/AdSlot"

function PostDetail() {
    const { id } = useParams<{ id: string }>()
    const [post, setPost] = useState<Post | null>(null)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`https://blog-app-backend-mmiu.onrender.com/api/posts/${id}`)
                setPost(response.data)
            } catch (error) {
                console.error("Failed to fetch post:", error)
            }
        }
        if (id) {
            fetchPost()
        }
    }, [id])

    if (!post) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    const contentParagraphs = post.content.split('\n').filter(p => p.trim() !== '')

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-blue-600 hover:underline font-medium">&larr; Back to Home</Link>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <article className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
                    <div className="text-sm text-gray-500 mb-8 border-b pb-4">
                        By <span className="font-medium text-gray-700">{post.author.name}</span> &bull; {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="prose max-w-none text-gray-800 leading-relaxed space-y-6">
                        {contentParagraphs.map((paragraph, index) => {
                            return (
                                <div key={index}>
                                    <p>{paragraph}</p>
                                    {index === 1 && <AdSlot slotId="in-content-1" width={300} height={250} label="In-content Ad 1" />}
                                    {index === 4 && <AdSlot slotId="in-content-2" width={300} height={250} label="In-content Ad 2" />}
                                </div>
                            )
                        })}
                    </div>
                </article>
            </main>
        </div>
    )
}

export default PostDetail
