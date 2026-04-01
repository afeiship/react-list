import { ReactList } from '@jswork/react-list';
import { users } from '../assets/users';

/**
 * Basic list demo using a component as the item slot.
 */
const UserItem = ({ item, index }: { item: typeof users[0]; index: number }) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <span className="text-gray-400 text-sm">#{index + 1}</span>
    <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full bg-gray-200" />
    <div className="flex-1">
      <h3 className="font-medium text-gray-900">{item.name}</h3>
      <p className="text-sm text-gray-500">{item.email}</p>
    </div>
    <span className="text-sm text-gray-600">{item.age} years old</span>
  </div>
);

export function BasicDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Basic Demo</h2>
        <span className="badge badge-info badge-sm">Component Slot</span>
      </div>
      <p className="text-sm text-gray-600">
        Simple list using a component as the item slot with keyExtractor as a string key.
      </p>
      <div className="space-y-2">
        <ReactList
          data={users}
          keyExtractor="id"
          slots={{
            item: UserItem
          }}
        />
      </div>
    </div>
  );
}
