/**
 * 05-FocusPreservation.spec.tsx
 *
 * 验证 renderSlot 使用 SlotBridge（useRef + useState 稳定包装组件）策略，
 * 确保稳定的 slot 组件引用在 rerender 时不会导致 input 失焦。
 *
 * 背景：
 * - SlotBridge 内部使用 useRef 追踪最新 slot，useState 创建稳定包装组件
 * - 稳定组件引用（直接传组件或 slot config）→ StableSlot 不变 → 不 remount
 * - 使用 slot config 或直接传组件引用是推荐方式，可保证 focus 和 local state 不丢失
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useState } from 'react';
import ReactList from '../src';

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

const InputItem = ({ item }: { item: User; index: number; data: User[] }) => (
  <div>
    <input data-testid={`input-${item.id}`} />
    <span data-testid={`name-${item.id}`}>{item.name}</span>
  </div>
);

describe('focus preservation', () => {
  it('should preserve input focus on rerender with stable slot ref', () => {
    const { rerender } = render(
      <ReactList
        data={users}
        keyExtractor="id"
        slots={{ item: InputItem }}
      />
    );

    const input = screen.getByTestId('input-1');
    input.focus();
    expect(input).toHaveFocus();

    // Rerender with same data — stable component ref keeps focus
    rerender(
      <ReactList
        data={users}
        keyExtractor="id"
        slots={{ item: InputItem }}
      />
    );

    expect(input).toHaveFocus();
  });

  it('should preserve input focus when data changes', () => {
    const { rerender } = render(
      <ReactList
        data={users}
        keyExtractor="id"
        slots={{ item: InputItem }}
      />
    );

    const input = screen.getByTestId('input-2');
    input.focus();
    expect(input).toHaveFocus();

    // Update data — item at index 1 still exists with same key
    const updated = [
      { id: 1, name: 'Alice Updated' },
      { id: 2, name: 'Bob Updated' },
    ];

    rerender(
      <ReactList
        data={updated}
        keyExtractor="id"
        slots={{ item: InputItem }}
      />
    );

    // Input keeps focus, content updated
    expect(input).toHaveFocus();
    expect(screen.getByTestId('name-2')).toHaveTextContent('Bob Updated');
  });

  it('should preserve input focus with slot config', () => {
    const { rerender } = render(
      <ReactList
        data={users}
        keyExtractor="id"
        slots={{
          item: {
            component: InputItem,
            props: { 'data-slot': 'test' },
          },
        }}
      />
    );

    const input = screen.getByTestId('input-1');
    input.focus();
    expect(input).toHaveFocus();

    rerender(
      <ReactList
        data={users}
        keyExtractor="id"
        slots={{
          item: {
            component: InputItem,
            props: { 'data-slot': 'test' },
          },
        }}
      />
    );

    expect(input).toHaveFocus();
  });

  it('should preserve input focus with interactive state inside slot', () => {
    const EditableItem = ({ item }: { item: User; index: number; data: User[] }) => {
      const [value, setValue] = useState(item.name);
      return (
        <div>
          <input
            data-testid={`input-${item.id}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      );
    };

    const { rerender } = render(
      <ReactList
        data={users}
        keyExtractor="id"
        slots={{ item: EditableItem }}
      />
    );

    const input = screen.getByTestId('input-1') as HTMLInputElement;
    input.focus();
    expect(input).toHaveFocus();

    // Type into the input
    input.value = 'Alice edited';
    screen.getByTestId('input-1').dispatchEvent(new Event('input', { bubbles: true }));

    // Rerender — input should keep focus and local state
    rerender(
      <ReactList
        data={users}
        keyExtractor="id"
        slots={{ item: EditableItem }}
      />
    );

    expect(input).toHaveFocus();
  });
});
