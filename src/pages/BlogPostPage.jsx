import React from 'react';
import { useParams } from 'react-router-dom';

const BlogPostPage = () => {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-gray-100">
             <img src="https://images.unsplash.com/photo-1525494337628-3341b4e3bf01" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-4xl font-bold mb-4">The Science of Compression</h1>
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-8">
            <span>By Dr. Alex Stride</span>
            <span>•</span>
            <span>5 min read</span>
        </div>
        <div className="prose prose-lg">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        </div>
    </div>
  );
};

export default BlogPostPage;