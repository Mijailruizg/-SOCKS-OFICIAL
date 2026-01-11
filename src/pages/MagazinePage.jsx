import React from 'react';
import { Link } from 'react-router-dom';

const posts = [
    {
        id: 1,
        title: "The Science of Compression",
        excerpt: "How pressure gradients improve blood flow during marathon training.",
        image: "https://images.unsplash.com/photo-1525494337628-3341b4e3bf01",
        date: "Jan 10, 2026"
    },
    {
        id: 2,
        title: "Winter Running Guide",
        excerpt: "Don't let the cold stop you. Here are our top tips for sub-zero jogs.",
        image: "https://images.unsplash.com/photo-1637666639858-e914177a9146",
        date: "Jan 05, 2026"
    },
    {
        id: 3,
        title: "Merino vs Synthetic",
        excerpt: "The ultimate showdown of materials. Which one is right for you?",
        image: "https://images.unsplash.com/photo-1650826125683-f4e9c4e62f16",
        date: "Dec 28, 2025"
    }
];

const MagazinePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-black mb-12 text-center">THE MAGAZINE</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
            {posts.map(post => (
                <Link key={post.id} to={`/blog/${post.id}`} className="group">
                    <div className="overflow-hidden rounded-xl aspect-video mb-4">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="text-xs text-gray-500 mb-2">{post.date}</div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">{post.title}</h2>
                    <p className="text-gray-600">{post.excerpt}</p>
                </Link>
            ))}
        </div>
    </div>
  );
};

export default MagazinePage;