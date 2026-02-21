import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Users, Bookmark, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Sidebar() {
  const communities = useStore((state) => state.communities);
  const fetchCommunities = useStore((state) => state.fetchCommunities);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const handleCommunityClick = (communityId: string) => {
    navigate(`/community/${communityId}`);
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-sky-950 rounded-lg shadow-sm p-2 md:p-4 mb-2 md:mb-0">
        <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1 overflow-x-auto pb-1 md:pb-0">
          <Link
            to="/"
            className="flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 text-white hover:bg-sky-900 rounded-lg flex-shrink-0"
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline md:inline">Home</span>
          </Link>
          <Link
            to="/communities"
            className="flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 text-white hover:bg-sky-900 rounded-lg flex-shrink-0"
          >
            <Users className="w-5 h-5" />
            <span className="hidden sm:inline md:inline">Explore</span>
          </Link>
          {/* <Link
            to="/saved"
            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <Bookmark className="w-5 h-5" />
            <span>Saved</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link> */}
        </nav>

        <div className="hidden md:block mt-8">
          <h3 className="px-4 text-sm font-semibold text-white uppercase tracking-wider">
            Popular Communities
          </h3>
          <div className="mt-4 space-y-1">
            {communities.map((community) => (
              <Link
                key={community.id}
                to={`/community/${community.id}`}
                className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-sky-900 rounded-lg"
              >
                <img
                  src={community.avatar}
                  alt={community.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="truncate">{community.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}