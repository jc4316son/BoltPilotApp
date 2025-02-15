import React from 'react';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

interface ForumPostProps {
  post: {
    id: string;
    author: {
      id: string;
      name: string;
      avatar: string;
      role: string;
      airline: string;
    };
    title: string;
    content: string;
    category: string;
    timestamp: string;
    likes: number;
    comments: number;
    tags: string[];
  };
}

export function ForumPost({ post }: ForumPostProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start space-x-4">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">{post.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm font-medium text-gray-700">
                  {post.author.name}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{post.author.role}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{post.author.airline}</span>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(post.timestamp).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-600 mt-2">{post.content}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-100">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
              <ThumbsUp className="h-5 w-5" />
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}