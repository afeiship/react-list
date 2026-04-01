import { ReactList } from '@jswork/react-list';
import { todos } from '../assets/todos';

/**
 * Demo showing different keyExtractor patterns.
 */

// Using function keyExtractor
const TodoItem = ({ item, index }: { item: typeof todos[0]; index: number }) => {
  const priorityColors = {
    low: 'badge-success',
    medium: 'badge-warning',
    high: 'badge-error'
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <input type="checkbox" checked={item.completed} readOnly className="checkbox checkbox-sm" />
      <div className="flex-1">
        <h3 className={`font-medium ${item.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {item.title}
        </h3>
        <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
      </div>
      <span className={`badge badge-sm ${priorityColors[item.priority]}`}>{item.priority}</span>
    </div>
  );
};

export function KeyExtractorDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Key Extractor Demo</h2>
        <span className="badge badge-info badge-sm">Function Key</span>
      </div>
      <p className="text-sm text-gray-600">
        Using a function as keyExtractor to extract custom UUID keys from todo items.
      </p>
      <div className="space-y-2">
        <ReactList
          data={todos}
          keyExtractor={(item) => item.uuid}
          slots={{
            item: TodoItem
          }}
        />
      </div>
    </div>
  );
}
