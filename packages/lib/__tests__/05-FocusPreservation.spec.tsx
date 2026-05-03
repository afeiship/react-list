/**
 * 05-FocusPreservation.spec.tsx
 *
 * 验证 renderSlot 使用 cloneElement（而非 createElement）策略，
 * 确保内联箭头函数 slot 在 rerender 时不会导致 input 失焦。
 *
 * 背景：
 * - createElement(slot, props) 会把 slot 函数本身作为组件类型
 * - 每次 rerender 产生新箭头函数 → React 认为组件类型变了 → 卸载重建
 * - cloneElement 作用于 slot 返回的实际元素，内部组件类型引用稳定 → 只更新 props
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
  it('should preserve input focus on rerender with inline arrow slot', () => {
    const { rerender } = render(
      <ReactList
        data={users}
        keyExtractor="id"
        slots={{ item: (props) => <InputItem {...props} /> }}
      />
    );

    const input = screen.getByTestId('input-1');
    input.focus();
    expect(input).toHaveFocus();

    // Rerender with same data — inline arrow creates new ref each time
    rerender(
      <ReactList
        data={users}
        keyExtractor="id"
        slots={{ item: (props) => <InputItem {...props} /> }}
      />
    );

    expect(input).toHaveFocus();
  });

  it('should preserve input focus when data changes', () => {
    const { rerender } = render(
      <ReactList
        data={users}
        keyExtractor="id"
        slots={{ item: (props) => <InputItem {...props} /> }}
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
        slots={{ item: (props) => <InputItem {...props} /> }}
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
        slots={{ item: (props) => <EditableItem {...props} /> }}
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
        slots={{ item: (props) => <EditableItem {...props} /> }}
      />
    );

    expect(input).toHaveFocus();
  });
});
