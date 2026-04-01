import { ReactList } from '@jswork/react-list';
import { todos } from '../assets/todos';

/**
 * Demo showing ReactNode as slot.
 */

// Using JSX directly as the slot
const todoItemNode = ({ item, index }: { item: typeof todos[0]; index: number }) => (
  <div className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3">
      <input type="checkbox" checked={item.completed} readOnly className="checkbox checkbox-sm" />
      <span className={`flex-1 ${item.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
        {item.title}
      </span>
      <span className="text-xs text-gray-500">{index + 1}</span>
    </div>
    <div className="mt-2 text-xs text-gray-500">
      Priority: <span className="font-medium">{item.priority}</span>
    </div>
  </div>
);

export function ReactNodeDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">React Node Demo</h2>
        <span className="badge badge-info badge-sm">JSX Slot</span>
      </div>
      <p className="text-sm text-gray-600">
        Using JSX elements directly as slots without defining separate components.
      </p>
      <div className="space-y-2">
        <ReactList
          data={todos}
          keyExtractor="uuid"
          slots={{
            item: todoItemNode,
            empty: (
              <div className="text-center p-8 bg-white rounded-lg">
                <p className="text-gray-500">No todos yet</p>
              </div>
            )
          }}
        />
      </div>
    </div>
  );
}
