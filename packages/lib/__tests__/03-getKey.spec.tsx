/**
 * 03-getKey.spec.tsx
 *
 * 测试 getKey 工具函数：
 * - 通过属性名提取 key
 * - 通过函数提取 key
 * - 属性不存在时回退到 index
 * - 函数接收正确的 item 和 index 参数
 */
import { getKey, SELF } from '../src';

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

  describe('SELF', () => {
    it('should return item itself as key using SELF', () => {
      expect(getKey('apple', 0, SELF)).toBe('apple');
    });

    it('should return number item itself as key using SELF', () => {
      expect(getKey(42, 0, SELF)).toBe(42);
    });
  });

  describe('dot path', () => {
    const nested = { user: { profile: { city: 'Shanghai' } }, id: 1 };

    it('should extract key using a dot path', () => {
      expect(getKey(nested, 0, 'user.profile.city')).toBe('Shanghai');
    });

    it('should extract key using a single-level dot path (equivalent to keyof)', () => {
      expect(getKey(nested, 0, 'id')).toBe(1);
    });

    it('should fallback to index when dot path resolves to undefined', () => {
      expect(getKey(nested, 3, 'user.profile.country' as any)).toBe(3);
    });

    it('should fallback to index when intermediate path is null', () => {
      expect(getKey({ user: null }, 7, 'user.name' as any)).toBe(7);
    });
  });
});
