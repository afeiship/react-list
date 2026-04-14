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
import ReactList, { SELF } from '../src';

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
    render(<ReactList data={users} keyExtractor={(item) => item.id} slots={{ item: ItemView }} />);
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
});
