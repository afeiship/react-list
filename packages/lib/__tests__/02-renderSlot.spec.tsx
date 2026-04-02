/**
 * 02-renderSlot.spec.tsx
 *
 * 测试 renderSlot 函数：
 * - 对 undefined slot 返回 null
 * - 渲染函数组件并传递 props
 * - 渲染 ReactNode（带/不带 key）
 * - 渲染 slot config 对象，合并默认 props 和运行时 props
 * - 运行时 props 覆盖 slot config 中的默认 props
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderSlot } from '../src';

describe('renderSlot', () => {
  it('should return null for undefined slot', () => {
    const result = renderSlot(undefined, {});
    expect(result).toBeNull();
  });

  it('should render a function component with props', () => {
    const SlotComponent = ({ name }: { name: string }) => <span>{name}</span>;
    const result = renderSlot(SlotComponent, { name: 'test' });
    const { container } = render(<>{result}</>);
    expect(container.textContent).toBe('test');
  });

  it('should render a function component with a key', () => {
    const SlotComponent = ({ name }: { name: string }) => <span>{name}</span>;
    const result = renderSlot(SlotComponent, { name: 'keyed' }, 'my-key');
    const { container } = render(<>{result}</>);
    expect(container.textContent).toBe('keyed');
  });

  it('should render a ReactNode as-is', () => {
    const result = renderSlot(<div>static content</div>, {});
    const { container } = render(<>{result}</>);
    expect(container.textContent).toBe('static content');
  });

  it('should wrap ReactNode in Fragment with key when key is provided', () => {
    const node = <div>with key</div>;
    const result = renderSlot(node, {}, 'item-0');
    const { container } = render(<>{result}</>);
    expect(container.textContent).toBe('with key');
  });

  it('should render a slot config with merged props', () => {
    const SlotComponent = ({ greeting, name }: { greeting: string; name: string }) => (
      <span>
        {greeting} {name}
      </span>
    );
    const config = { component: SlotComponent, props: { greeting: 'Hello' } };
    const result = renderSlot(config, { name: 'World' });
    const { container } = render(<>{result}</>);
    expect(container.textContent).toBe('Hello World');
  });

  it('should let runtime props override slot config default props', () => {
    const SlotComponent = ({ color }: { color: string }) => <span>{color}</span>;
    const config = { component: SlotComponent, props: { color: 'red' } };
    const result = renderSlot(config, { color: 'blue' });
    const { container } = render(<>{result}</>);
    expect(container.textContent).toBe('blue');
  });

  it('should let runtime props override slot config same-name props while merging others', () => {
    const SlotComponent = ({ greeting, name }: { greeting: string; name: string }) => (
      <span>
        {greeting} {name}
      </span>
    );
    const config = { component: SlotComponent, props: { greeting: 'Hi', name: 'Config' } };
    const result = renderSlot(config, { greeting: 'Hello', name: 'Runtime' });
    const { container } = render(<>{result}</>);
    expect(container.textContent).toBe('Hello Runtime');
  });
});
