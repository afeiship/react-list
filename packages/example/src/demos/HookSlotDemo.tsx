import { ReactList } from '@jswork/react-list/src/react-list';
import { products } from '../assets/products';
import { useState, useEffect, useRef } from 'react';

interface Product {
  sku: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

const EditableItem = ({ item, index, data }: { item: Product; index: number; data: Product[] }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [count, setCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const mountCount = useRef(0);

  useEffect(() => {
    mountCount.current += 1;
  }, []);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
      <span className="text-gray-400 text-sm font-mono w-20">{item.sku}</span>
      {editing ? (
        <input
          ref={inputRef}
          className="input input-sm input-bordered flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
        />
      ) : (
        <span
          className="flex-1 cursor-pointer hover:text-blue-500"
          onClick={() => setEditing(true)}
        >
          {name}
        </span>
      )}
      <span className="font-semibold text-green-600 w-16 text-right">${item.price.toFixed(2)}</span>
      <button className="btn btn-xs btn-outline" onClick={() => setCount((c) => c + 1)}>
        {count}
      </button>
      <span className="text-xs text-gray-400">mounted: {mountCount.current}</span>
    </div>
  );
};

export function HookSlotDemo() {
  const [highlight, setHighlight] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Hook Slot Demo</h2>
        <span className="badge badge-warning badge-sm">Hooks in Slot</span>
      </div>
      <p className="text-sm text-gray-600">
        Each item uses <code>useState</code>, <code>useEffect</code>, and{' '}
        <code>useRef</code> internally. Mount count stays at 1 across re-renders,
        proving SlotBridge gives each item its own stable hook context.
      </p>
      <div className="flex gap-2">
        <button
          className={`btn btn-sm ${highlight ? 'btn-error' : 'btn-outline'}`}
          onClick={() => setHighlight((v) => !v)}
        >
          Trigger Re-render
        </button>
      </div>
      <div className={`space-y-2 rounded-lg p-2 transition-colors ${highlight ? 'bg-yellow-50' : ''}`}>
        <ReactList
          data={products}
          keyExtractor="sku"
          slots={{ item: EditableItem }}
        />
      </div>
    </div>
  );
}
