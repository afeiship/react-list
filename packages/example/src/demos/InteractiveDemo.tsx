import { ReactList } from '@jswork/react-list';
import { users } from '../assets/users';
import { useState } from 'react';

/**
 * Demo showing interactive list with state management.
 */

interface UserItemProps {
  item: typeof users[0];
  index: number;
  data: typeof users;
  onLike: (id: number) => void;
  onRemove: (id: number) => void;
  likedIds: Set<number>;
}

const UserItem = ({ item, index, onLike, onRemove, likedIds }: UserItemProps) => {
  const isLiked = likedIds.has(item.id);

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
      <span className="text-gray-400 text-sm">#{index + 1}</span>
      <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.email}</p>
      </div>
      <div className="flex gap-2">
        <button
          className={`btn btn-sm btn-circle ${isLiked ? 'btn-error' : 'btn-ghost'}`}
          onClick={() => onLike(item.id)}
          aria-label="Like">
          {isLiked ? '❤️' : '🤍'}
        </button>
        <button
          className="btn btn-sm btn-circle btn-ghost"
          onClick={() => onRemove(item.id)}
          aria-label="Remove">
          🗑️
        </button>
      </div>
    </div>
  );
};

const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
    <p className="text-gray-500 font-medium mb-4">No users left</p>
    <button className="btn btn-sm btn-primary" onClick={onReset}>
      Reset Users
    </button>
  </div>
);

export function InteractiveDemo() {
  const [currentUsers, setCurrentUsers] = useState(users);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

  const handleLike = (id: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleRemove = (id: number) => {
    setCurrentUsers((prev) => prev.filter((user) => user.id !== id));
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleReset = () => {
    setCurrentUsers(users);
    setLikedIds(new Set());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Interactive Demo</h2>
        <span className="badge badge-info badge-sm">State Management</span>
      </div>
      <p className="text-sm text-gray-600">
        Interactive list with like and remove actions. Try clicking the buttons!
      </p>
      <div className="stats shadow bg-white">
        <div className="stat">
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-2xl">{currentUsers.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Liked</div>
          <div className="stat-value text-2xl text-error">{likedIds.size}</div>
        </div>
      </div>
      <div className="space-y-2">
        <ReactList
          data={currentUsers}
          keyExtractor="id"
          slots={{
            item: (props) => (
              <UserItem
                {...props}
                onLike={handleLike}
                onRemove={handleRemove}
                likedIds={likedIds}
              />
            ),
            empty: () => <EmptyState onReset={handleReset} />
          }}
        />
      </div>
    </div>
  );
}
