/**
 * 01-isSlotConfig.spec.tsx
 *
 * 测试 isSlotConfig 类型守卫函数：
 * - 判断值是否为 { component, props? } 形式的 slot 配置对象
 * - 对函数组件、ReactNode、null、undefined 应返回 false
 */
import { isSlotConfig } from '../src';

const DummyComponent = () => <div />;

describe('isSlotConfig', () => {
  it('should return true for a valid slot config object', () => {
    const config = { component: DummyComponent, props: { index: 0 } };
    expect(isSlotConfig(config)).toBe(true);
  });

  it('should return true for slot config without props', () => {
    const config = { component: DummyComponent };
    expect(isSlotConfig(config)).toBe(true);
  });

  it('should return false for a function component', () => {
    expect(isSlotConfig(DummyComponent)).toBe(false);
  });

  it('should return false for a ReactNode', () => {
    expect(isSlotConfig(<div>hello</div>)).toBe(false);
  });

  it('should return falsy for null', () => {
    expect(isSlotConfig(null)).toBeFalsy();
  });

  it('should return falsy for undefined', () => {
    expect(isSlotConfig(undefined)).toBeFalsy();
  });
});
