/**
 * 03-getKey.spec.tsx
 *
 * 测试 getKey 工具函数：
 * - 通过属性名提取 key
 * - 通过函数提取 key
 * - 属性不存在时回退到 index
 * - 函数接收正确的 item 和 index 参数
 */
import { getKey } from '../src';

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
];

describe('getKey', () => {
  it('should extract key using a property name', () => {
    expect(getKey({ id: 42, name: 'test' }, 0, 'id')).toBe(42);
  });

  it('should extract key using a function', () => {
    const extractor = (item: User) => item.id;
    expect(getKey(users[0], 0, extractor)).toBe(1);
  });

  it('should fallback to index when property is undefined', () => {
    expect(getKey({ name: 'test' }, 5, 'id' as any)).toBe(5);
  });

  it('should pass index to function extractor', () => {
    const extractor = (_: User, index: number) => index * 10;
    expect(getKey(users[1], 1, extractor)).toBe(10);
  });
});
