'use client';

import { useState, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { User, fetchUsers } from '@/services/userService';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const parentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    loadUsers(1);
  }, []);
  
  const loadUsers = async (page: number) => {
    if (loading || (!hasMore && page !== 1)) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchUsers(page);
      
      if (data.users.length === 0) {
        setHasMore(false);
      } else {
        if (page === 1) {
          setUsers(data.users);
        } else {
          setUsers(prevUsers => [...prevUsers, ...data.users]);
        }
        setCurrentPage(page);
      }
    } catch (error) {
      setError("Failed to load users. Please try again.");
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // this is a virtualizer for good list rendering
  const rowVirtualizer = useVirtualizer({
    count: hasMore ? users.length + 1 : users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });
  
  // Load more when scrolling to bottom
  const loadMoreUsers = () => {
    if (!loading && hasMore) {
      loadUsers(currentPage + 1);
    }
  };
  
  // Check if we need to load more 
  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    
    if (
      lastItem?.index >= users.length - 5 &&
      hasMore &&
      !loading
    ) {
      loadMoreUsers();
    }
  }, [rowVirtualizer.getVirtualItems(), loading, hasMore]);
  
  return (
    <div className="flex flex-col h-screen max-h-screen">
      <header className="p-4 bg-blue-600 text-white">
        <h1 className="text-2xl font-bold">User Directory</h1>
      </header>
  
      {error && (
        <div className="p-4 text-red-600 bg-red-100 text-center">
          {error}
        </div>
      )}
  
      {/* this div for virtualized list */}
      <div
        ref={parentRef}
        className="flex-1 overflow-auto"
        style={{
          height: `calc(100vh - 80px)`,
          width: '100%',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          <div className="flex flex-col gap-100">
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow = virtualRow.index >= users.length;
              const user = users[virtualRow.index];
  
              return (
                <div
                  key={virtualRow.index}
                  className={`absolute top-0 left-0 w-full ${
                    virtualRow.index % 2 ? "bg-gray-50" : "bg-white"
                  }`}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {isLoaderRow ? (
                    loading ? (
                      <div className="p-2 text-center">Loading more users...</div>
                    ) : null
                  ) : (
                    <div className="border-b gap-2 p-2 flex items-center">
                      {/* avatar */}
                      <div className="w-9 h-9 bg-blue-300 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
  
                      {/* name wrapper */}
                      <div className="bg-gray-100 rounded-lg p-2 flex-1">
                        <span className="text-lg font-semibold item-center text-black">
                          {user.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
  
      {/* footer */}
      <footer className="p-4 bg-gray-100 text-center text-sm text-gray-600 border-t border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading more users...</span>
          </div>
        ) : hasMore ? (
          <span>Scroll down to load more users</span>
        ) : (
          <span>All users loaded</span>
        )}
      </footer>
    </div>
  );
}