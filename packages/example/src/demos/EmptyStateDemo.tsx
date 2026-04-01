import { ReactList } from '@jswork/react-list';
import { users, emptyUsers } from '../assets/users';
import { useState } from 'react';

/**
 * Demo showing empty state handling.
 */
const UserItem = ({ item, index }: { item: typeof users[0]; index: number }) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
    <span className="text-gray-400 text-sm">#{index + 1}</span>
    <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full bg-gray-200" />
    <div className="flex-1">
      <h3 className="font-medium text-gray-900">{item.name}</h3>
      <p className="text-sm text-gray-500">{item.email}</p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
    <svg
      className="w-16 h-16 text-gray-300 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
    <p className="text-gray-500 font-medium">No users found</p>
    <p className="text-sm text-gray-400">Add some users to see them listed here</p>
  </div>
);

export function EmptyStateDemo() {
  const [isEmpty, setIsEmpty] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Empty State Demo</h2>
        <span className="badge badge-info badge-sm">Empty Slot</span>
      </div>
      <p className="text-sm text-gray-600">
        Toggle between empty and populated states to see the empty slot in action.
      </p>
      <div className="flex gap-2">
        <button
          className={`btn btn-sm ${!isEmpty ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setIsEmpty(false)}>
          With Data
        </button>
        <button
          className={`btn btn-sm ${isEmpty ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setIsEmpty(true)}>
          Empty
        </button>
      </div>
      <div className="space-y-2">
        <ReactList
          data={isEmpty ? emptyUsers : users}
          keyExtractor="id"
          slots={{
            item: UserItem,
            empty: EmptyState
          }}
        />
      </div>
    </div>
  );
}
