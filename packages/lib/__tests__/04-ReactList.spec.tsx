/**
 * 04-ReactList.spec.tsx
 *
 * 测试 ReactList 组件的整体渲染行为：
 * - 使用组件 slot 渲染列表项
 * - 使用函数式 keyExtractor
 * - 空数据时渲染 empty slot
 * - 空数据且无 empty slot 时不渲染任何内容
 * - 使用 ReactNode slot 渲染列表项
 * - 使用 slot config（带默认 props）渲染列表项
 * - 验证 default export 可正常使用
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import ReactList, { SELF, INDEX } from '../src';

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
];

const ItemView = ({
  item,
  index,
  color,
}: {
  item: User;
  index: number;
  data: User[];
  color: string;
}) => (
  <div data-testid="item" style={{ backgroundColor: color }}>
    {index}: {item.name}
  </div>
);

const EmptyView = ({ data }: { data: User[] }) => (
  <div data-testid="empty">No items found ({data.length})</div>
);

describe('ReactList', () => {
  it('should render items using a component slot', () => {
    render(<ReactList data={users} keyExtractor="id" slots={{ item: ItemView }} />);
    expect(screen.getByText('0: Alice')).toBeInTheDocument();
    expect(screen.getByText('1: Bob')).toBeInTheDocument();
    expect(screen.getByText('2: Charlie')).toBeInTheDocument();
  });

  it('should render items using a function keyExtractor', () => {
    render(<ReactList data={users} keyExtractor={({ item }) => item.id} slots={{ item: ItemView }} />);
    expect(screen.getByText('0: Alice')).toBeInTheDocument();
    expect(screen.getByText('2: Charlie')).toBeInTheDocument();
  });

  it('should render empty slot when data is empty', () => {
    render(<ReactList data={[]} keyExtractor="id" slots={{ item: ItemView, empty: EmptyView }} />);
    expect(screen.getByTestId('empty')).toBeInTheDocument();
    expect(screen.getByText(/No items found/)).toBeInTheDocument();
  });

  it('should render nothing when data is empty and no empty slot', () => {
    const { container } = render(
      <ReactList data={[] as User[]} keyExtractor="id" slots={{ item: ItemView }} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('should render items using a ReactNode slot', () => {
    render(<ReactList data={users} keyExtractor="id" slots={{ item: <span>static</span> }} />);
    const items = screen.getAllByText('static');
    expect(items).toHaveLength(3);
  });

  it('should render items using a slot config with default props', () => {
    const ConfigItem = ({
      item,
      prefix,
    }: {
      item: User;
      index: number;
      data: User[];
      prefix: string;
    }) => (
      <div>
        {prefix}
        {item.name}
      </div>
    );

    render(
      <ReactList
        data={users}
        keyExtractor="id"
        slots={{ item: { component: ConfigItem, props: { prefix: '>> ' } } }}
      />
    );
    expect(screen.getByText('>> Alice')).toBeInTheDocument();
    expect(screen.getByText('>> Bob')).toBeInTheDocument();
    expect(screen.getByText('>> Charlie')).toBeInTheDocument();
  });

  it('should accept slot config with required extra props passed via props', () => {
    const clickFn = vi.fn();
    const handlers: Record<string, () => void> = {
      item_1: clickFn,
    };

    const CardItem = ({
      item,
      handlers: cardHandlers,
    }: {
      item: User;
      index: number;
      data: User[];
      handlers: Record<string, () => void>;
    }) => (
      <div data-testid="card" onClick={cardHandlers[`item_${item.id}`]}>
        {item.name}
      </div>
    );

    render(
      <ReactList
        data={users}
        keyExtractor="id"
        slots={{ item: { component: CardItem, props: { handlers } } }}
      />
    );

    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(3);
    expect(screen.getByText('Alice')).toBeInTheDocument();

    // Simulate clicking the first item
    fireEvent.click(cards[0]);
    expect(clickFn).toHaveBeenCalled();
  });

  it('should use "id" as default keyExtractor when not provided', () => {
    render(<ReactList data={users} slots={{ item: ItemView }} />);
    expect(screen.getByText('0: Alice')).toBeInTheDocument();
    expect(screen.getByText('1: Bob')).toBeInTheDocument();
    expect(screen.getByText('2: Charlie')).toBeInTheDocument();
  });

  it('should work with default export', () => {
    render(
      <ReactList
        data={[{ id: 1, name: 'Test' }]}
        keyExtractor="id"
        slots={{
          item: {
            component: ItemView,
            props: {
              color: 'red',
            },
          },
        }}
      />
    );
    expect(screen.getByText('0: Test')).toBeInTheDocument();
  });

  it('should render primitive arrays using SELF keyExtractor', () => {
    const StringItem = ({ item }: { item: string }) => <div>{item}</div>;
    render(
      <ReactList
        data={['apple', 'banana', 'cherry']}
        keyExtractor={SELF}
        slots={{ item: StringItem }}
      />
    );
    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getByText('banana')).toBeInTheDocument();
    expect(screen.getByText('cherry')).toBeInTheDocument();
  });

  it('should handle empty string items with SELF keyExtractor without key warning', () => {
    const consoleWarn = vi.spyOn(console, 'error').mockImplementation(() => {});
    const StringItem = ({ item }: { item: string }) => <div>{item || '(empty)'}</div>;
    render(
      <ReactList
        data={['abc', '']}
        keyExtractor={SELF}
        slots={{ item: StringItem }}
      />
    );
    expect(screen.getByText('abc')).toBeInTheDocument();
    expect(screen.getByText('(empty)')).toBeInTheDocument();
    expect(consoleWarn).not.toHaveBeenCalled();
    consoleWarn.mockRestore();
  });

  it('should render items using INDEX keyExtractor', () => {
    const StringItem = ({ item }: { item: string }) => <div>{item}</div>;
    render(
      <ReactList
        data={['apple', 'banana', 'cherry']}
        keyExtractor={INDEX}
        slots={{ item: StringItem }}
      />
    );
    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getByText('banana')).toBeInTheDocument();
    expect(screen.getByText('cherry')).toBeInTheDocument();
  });

  it('should render nested data using dot path keyExtractor', () => {
    interface NestedUser {
      id: number;
      profile: { city: string };
    }
    const nestedUsers: NestedUser[] = [
      { id: 1, profile: { city: 'Shanghai' } },
      { id: 2, profile: { city: 'Beijing' } },
    ];
    const NestedItem = ({ item }: { item: NestedUser }) => <div>{item.profile.city}</div>;
    render(
      <ReactList
        data={nestedUsers}
        keyExtractor="profile.city"
        slots={{ item: NestedItem }}
      />
    );
    expect(screen.getByText('Shanghai')).toBeInTheDocument();
    expect(screen.getByText('Beijing')).toBeInTheDocument();
  });

  describe('inline arrow function slot remount', () => {
    it('should NOT remount items when slot is an inline arrow function (new ref each render)', () => {
      const mountTracker = vi.fn();

      const InputItem = ({ item }: { item: User; index: number; data: User[] }) => {
        React.useEffect(() => { mountTracker(item.id); }, []);
        return (
          <div>
            <input data-testid={`input-${item.id}`} />
            <span>{item.name}</span>
          </div>
        );
      };

      const { rerender } = render(
        <ReactList
          data={users}
          keyExtractor="id"
          slots={{ item: (props) => <InputItem {...props} /> }}
        />
      );

      expect(mountTracker).toHaveBeenCalledTimes(3);

      const firstInput = screen.getByTestId('input-1');
      firstInput.focus();
      expect(firstInput).toHaveFocus();

      // Re-render creates a NEW inline arrow function
      // StableSlot is stable, so items are NOT remounted
      rerender(
        <ReactList
          data={users}
          keyExtractor="id"
          slots={{ item: (props) => <InputItem {...props} /> }}
        />
      );

      // Items are NOT remounted: still only 3 mount calls
      expect(mountTracker).toHaveBeenCalledTimes(3);

      // Same input element still exists and retains focus
      expect(firstInput).toBeInTheDocument();
      expect(firstInput).toHaveFocus();
    });

    it('should preserve component state when slot ref is stable across renders', () => {
      const mountTracker = vi.fn();

      const InputItem = ({ item }: { item: User; index: number; data: User[] }) => {
        React.useEffect(() => { mountTracker(item.id); }, []);
        return (
          <div>
            <input data-testid={`input-${item.id}`} />
            <span>{item.name}</span>
          </div>
        );
      };

      const { rerender } = render(
        <ReactList
          data={users}
          keyExtractor="id"
          slots={{ item: InputItem }}
        />
      );

      expect(mountTracker).toHaveBeenCalledTimes(3);

      const firstInput = screen.getByTestId('input-1');
      firstInput.focus();
      expect(firstInput).toHaveFocus();

      // Re-render with the SAME component ref → React reuses component
      rerender(
        <ReactList
          data={users}
          keyExtractor="id"
          slots={{ item: InputItem }}
        />
      );

      // No remounts
      expect(mountTracker).toHaveBeenCalledTimes(3);

      // Same DOM node, focus preserved
      expect(firstInput).toHaveFocus();
    });
  });

  describe('hooks in slot components', () => {
    it('should support useState in slot item components', () => {
      const CounterItem = ({ item }: { item: User; index: number; data: User[] }) => {
        const [count, setCount] = React.useState(0);
        return (
          <div>
            <span data-testid={`name-${item.id}`}>{item.name}</span>
            <span data-testid={`count-${item.id}`}>{count}</span>
            <button data-testid={`btn-${item.id}`} onClick={() => setCount(c => c + 1)}>
              inc
            </button>
          </div>
        );
      };

      render(<ReactList data={users} keyExtractor="id" slots={{ item: CounterItem }} />);

      expect(screen.getByTestId('name-1').textContent).toBe('Alice');
      expect(screen.getByTestId('count-1').textContent).toBe('0');

      fireEvent.click(screen.getByTestId('btn-1'));
      expect(screen.getByTestId('count-1').textContent).toBe('1');

      fireEvent.click(screen.getByTestId('btn-2'));
      expect(screen.getByTestId('count-2').textContent).toBe('1');
    });

    it('should support useEffect in slot item components', () => {
      const effectFn = vi.fn();

      const EffectItem = ({ item }: { item: User; index: number; data: User[] }) => {
        React.useEffect(() => { effectFn(item.id); }, [item.id]);
        return <div>{item.name}</div>;
      };

      render(<ReactList data={users} keyExtractor="id" slots={{ item: EffectItem }} />);

      expect(effectFn).toHaveBeenCalledTimes(3);
      expect(effectFn).toHaveBeenCalledWith(1);
      expect(effectFn).toHaveBeenCalledWith(2);
      expect(effectFn).toHaveBeenCalledWith(3);
    });

    it('should support hooks in slot config components', () => {
      const ConfigHookItem = ({
        item,
        prefix,
      }: {
        item: User;
        index: number;
        data: User[];
        prefix: string;
      }) => {
        const [count, setCount] = React.useState(0);
        return (
          <div>
            <span data-testid={`label-${item.id}`}>{prefix}{item.name}:{count}</span>
            <button data-testid={`btn-${item.id}`} onClick={() => setCount(c => c + 1)}>+</button>
          </div>
        );
      };

      render(
        <ReactList
          data={users}
          keyExtractor="id"
          slots={{ item: { component: ConfigHookItem, props: { prefix: '>> ' } } }}
        />
      );

      expect(screen.getByTestId('label-1').textContent).toBe('>> Alice:0');
      fireEvent.click(screen.getByTestId('btn-2'));
      expect(screen.getByTestId('label-2').textContent).toBe('>> Bob:1');
    });
  });
});
