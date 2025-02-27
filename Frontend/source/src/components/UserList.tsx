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
  
  // loading more when scrolling to bottom
  const loadMoreUsers = () => {
    if (!loading && hasMore) {
      loadUsers(currentPage + 1);
    }
  };
  
  // checking if we need to load more 
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
    <div className="flex h-screen max-h-screen bg-background text-glow">
      {/* sidebar header */}
      <header className="w-20 bg-neonPurple/90 flex flex-col items-center py-6 fixed h-full shadow-lg shadow-neonPurple/50">
        <h1 className="text-2xl font-extrabold text-glow transform -rotate-90 whitespace-nowrap mt-auto mb-20">
          Neon Users
        </h1>
      </header>
  
      <div className="flex-1 ml-20 overflow-hidden">
        {error && (
          <div className="p-3 bg-neonPink/20 text-neonPink text-center font-medium border-b-2 border-neonPink">
            {error}
          </div>
        )}
  
        {/* virtualized list of users*/}
        <div
          ref={parentRef}
          className="h-full overflow-auto p-8"
          style={{
            height: `calc(100vh - ${error ? "60px" : "0px"})`,
            width: "100%",
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            <div className="flex flex-col gap-8"> {/* Larger gap (32px) */}
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const isLoaderRow = virtualRow.index >= users.length;
                const user = users[virtualRow.index];
  
                return (
                  <div
                    key={virtualRow.index}
                    className="absolute top-0 left-0 w-full bg-background/80 border-2 border-neonCyan rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] transition-all"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {isLoaderRow ? (
                      loading ? (
                        <div className="p-6 text-center text-neonCyan/70 font-medium">
                          Fetching more neon souls...
                        </div>
                      ) : null
                    ) : (
                      <div className="p-6 flex items-center gap-6">
                        {/* Avatar */}
                        <div className="w-14 h-14 bg-neonPink rounded-full flex items-center justify-center border-4 border-neonPink shadow-[0_0_10px_rgba(255,0,127,0.7)]">
                          <span className="text-glow text-2xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
  
                        {/* Name */}
                        <div className="flex-1">
                          <span className="text-2xl font-bold text-glow">
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
  
        {/* floating Bar */}
        <footer className="absolute bottom-4 left-24 right-4 bg-neonPurple/80 text-glow text-center py-3 rounded-full shadow-[0_0_20px_rgba(157,0,255,0.6)] backdrop-blur-sm">
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <svg
                className="animate-spin h-5 w-5 text-neonCyan"
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
              <span>Fetching more neon souls...</span>
            </div>
          ) : hasMore ? (
            <span>Scroll for more glow!</span>
          ) : (
            <span>All neon souls aboard!</span>
          )}
        </footer>
      </div>
    </div>
  );
}