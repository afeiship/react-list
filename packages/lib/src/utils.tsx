import React from 'react';
import { SELF, INDEX, type Key, type Slot, type KeyExtractor } from './types';

/**
 * Type guard to check if a value is a slot configuration object with component and props.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a slot configuration object.
 */
export function isSlotConfig(
  value: any
): value is { component: React.ComponentType<any>; props?: Record<string, any> } {
  return value && typeof value === 'object' && 'component' in value;
}

/**
 * Attaches a React key to a rendered result via `cloneElement`.
 * @internal
 *
 * Unlike `createElement`, which treats the slot function itself as the component
 * type, `cloneElement` operates on the *returned* element. This distinction is
 * critical for inline arrow function slots:
 *
 * ```tsx
 * // Each render creates a NEW arrow function reference
 * <ReactList slots={{ item: (props) => <InputItem {...props} /> }} />
 * ```
 *
 * With `createElement(slot, props)`, React sees a different component type on every
 * render (new function reference) and unmounts/remounts the entire subtree. This
 * destroys local DOM state — an `<input>` loses focus, animations reset, scroll
 * position jumps, etc.
 *
 * By calling the slot function first and then using `cloneElement` on the result,
 * the *actual* component (`InputItem`) remains the stable type across renders,
 * so React performs a props-only update instead of a full remount.
 *
 * @param result - The rendered React node to attach the key to.
 * @param key - Optional React key.
 */
function withKey(result: React.ReactNode, key?: Key): React.ReactNode {
  if (key != null && React.isValidElement(result)) {
    return React.cloneElement(result, { key });
  }
  return result;
}

/**
 * Renders a slot by creating a React element from the slot definition.
 *
 * @template P - The props type for the slot component.
 * @param slot - The slot definition to render.
 * @param props - The props to pass to the slot component.
 * @param key - Optional React key to add to the element.
 * @returns A React node, or `null` if no slot is provided.
 *
 * @example
 * ```tsx
 * const slot = MyComponent;
 * renderSlot(slot, { name: 'John' }); // => <MyComponent name="John" />
 *
 * const slotNode = <div>Hello</div>;
 * renderSlot(slotNode, {}); // => <div>Hello</div>
 *
 * const slotWithProps = { component: MyComponent, props: { age: 30 } };
 * renderSlot(slotWithProps, { name: 'John' }); // => <MyComponent age={30} name="John" />
 * ```
 */
export function renderSlot<P>(slot: Slot<P> | undefined, props: P, key?: Key): React.ReactNode {
  if (!slot) return null;

  if (typeof slot === 'function') {
    return withKey((slot as any)(props), key);
  }

  if (isSlotConfig(slot)) {
    return withKey((slot.component as any)({ ...slot.props, ...props }), key);
  }

  return key != null ? <React.Fragment key={key}>{slot}</React.Fragment> : slot;
}

/**
 * Extracts a unique key for a list item using the provided key extractor.
 *
 * @template T - The type of the data item.
 * @param item - The data item.
 * @param index - The index of the item in the array.
 * @param data - The complete data array.
 * @param keyExtractor - The key extractor: `SELF`, `INDEX`, a property key, a dot path, or a function.
 * @returns A unique key (string or number) for the item.
 *
 * @example
 * ```tsx
 * getKey({ id: 1, name: 'Item' }, 0, [], 'id'); // => 1
 * getKey({ id: 1, name: 'Item' }, 0, [], ({ item }) => item.id); // => 1
 * getKey({ name: 'Item' }, 0, [], 'id'); // => 0 (fallback to index)
 * getKey('apple', 0, [], SELF); // => 'apple'
 * getKey('apple', 0, [], INDEX); // => 0
 * getKey({ user: { id: 1 } }, 0, [], 'user.id'); // => 1
 * ```
 */
export function getKey<T>(item: T, index: number, data: T[], keyExtractor: KeyExtractor<T>): Key {
  if (typeof keyExtractor === 'function') {
    return keyExtractor({ item, index, data });
  }
  if (keyExtractor === SELF) {
    return item as unknown as Key;
  }
  if (keyExtractor === INDEX) {
    return index;
  }
  // String: simple key or dot path
  const segments = (keyExtractor as string).split('.');
  let value: any = item;
  for (const key of segments) {
    value = value?.[key];
  }
  return (value ?? index) as Key;
}
