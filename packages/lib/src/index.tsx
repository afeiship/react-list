import React, { useMemo } from 'react';

/**
 * Symbol marker to indicate that the item itself should be used as the key.
 * Use this for primitive arrays (string[], number[]) where each item is its own unique identifier.
 *
 * @example
 * ```tsx
 * import ReactList, { SELF } from 'react-list';
 *
 * <ReactList data={['apple', 'banana']} keyExtractor={SELF} slots={...} />
 * ```
 */
export const SELF: unique symbol = Symbol('react-list/self');

/**
 * Symbol marker to indicate that the array index should be used as the key.
 * Use this when items have no stable unique identifier and the list is static
 * (not reordered, inserted, or filtered).
 *
 * @example
 * ```tsx
 * import ReactList, { INDEX } from 'react-list';
 *
 * <ReactList data={['apple', 'banana']} keyExtractor={INDEX} slots={...} />
 * ```
 */
export const INDEX: unique symbol = Symbol('react-list/index');

/**
 * The type of React key value.
 * @internal
 */
type Key = string | number;

/**
 * Represents a slot that can be either a component, a React node, or a component with default props.
 *
 * @typeParam P - The props type that the slot component accepts.
 *
 * @example
 * ```tsx
 * // Using a component directly
 * const slot: Slot<{ name: string }> = MyComponent;
 *
 * // Using a React node directly
 * const slotNode: Slot<{ name: string }> = <div>Hello</div>;
 *
 * // Using a component with default props
 * const slotWithProps: Slot<{ name: string }> = {
 *   component: MyComponent,
 *   props: { name: 'Default' }
 * };
 * ```
 */
export type Slot<P = {}> =
  | React.ComponentType<P>
  | React.ReactNode
  | {
      /**
       * The component to render.
       * Accepts P plus any additional custom props supplied via `props`.
       * Uses `any` because the component may require extra props
       * that are provided at runtime via the `props` field.
       */
      component: React.ComponentType<any>;
      /**
       * Extra props to merge with the standard slot props.
       * These are passed to the component alongside the default slot props.
       */
      props?: Record<string, any>;
    };

/**
 * The context object passed to item-related callbacks (slot props and keyExtractor functions).
 *
 * @typeParam T - The type of items in the data array.
 */
export type ItemContext<T> = {
  /** The current data item. */
  item: T;
  /** The index of the current item in the data array. */
  index: number;
  /** The complete data array. */
  data: T[];
};

/**
 * Extracts a unique key or value from a data item.
 *
 * Can be specified as:
 * - `SELF` — use the item itself as the key (for primitive arrays)
 * - `INDEX` — use the array index as the key
 * - A key of the item type (`keyof T`)
 * - A dot-separated path to a nested property (e.g., `'user.address.city'`)
 * - A function that receives an {@link ItemContext} object
 *
 * @typeParam T - The type of items in the data array.
 */
export type KeyExtractor<T> =
  | typeof SELF
  | typeof INDEX
  | keyof T
  | string
  | ((ctx: ItemContext<T>) => Key);

/**
 * Props for the {@link ReactList} component.
 *
 * @typeParam T - The type of items in the data array.
 */
export interface ReactListProps<T> {
  /**
   * The array of data items to render.
   */
  data: T[];

  /**
   * Extracts a unique key for each item in the list.
   *
   * Can be specified as:
   * - `SELF` — use the item itself as the key (for primitive arrays like `string[]` or `number[]`)
   * - `INDEX` — use the array index as the key
   * - A key of the item type (`keyof T`)
   * - A dot-separated path to a nested property (e.g., `'user.address.city'`)
   * - A function that receives the item and index, returning a string or number
   *
   * @example
   * ```tsx
   * import ReactList, { SELF } from 'react-list';
   *
   * // Using SELF for primitive arrays
   * <ReactList data={['apple', 'banana']} keyExtractor={SELF} {...props} />
   *
   * // Using a key path
   * <ReactList data={items} keyExtractor="id" {...props} />
   *
   * // Using a dot path for nested properties
   * <ReactList data={items} keyExtractor="user.address.city" {...props} />
   *
   * // Using a function
   * <ReactList
   *   data={items}
   *   keyExtractor={({ item }) => item.id}
   *   {...props}
   * />
   * ```
   */
  keyExtractor?: KeyExtractor<T>;

  /**
   * Slot configuration for rendering different list states.
   */
  slots: {
    /**
     * Slot for rendering each item in the list.
     * Receives the current item, its index, and the full data array.
     */
    item: Slot<ItemContext<T>>;
    /**
     * Optional slot for rendering the empty state.
     * Receives the (empty) data array.
     */
    empty?: Slot<{
      /** The (empty) data array. */
      data: T[];
    }>;
  };
}

/**
 * Type guard to check if a value is a slot configuration object with component and props.
 *
 * @typeParam P - The props type for the slot component.
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

/**
 * A highly abstract, type-safe list component for React that renders data arrays
 * using a slot-based architecture.
 *
 * @typeParam T - The type of items in the data array.
 *
 * @remarks
 * `ReactList` provides a clean separation between data and presentation through
 * its slot system. It automatically handles:
 * - Rendering each item with its index and context
 * - Displaying an empty state when data is empty
 * - Flexible key extraction for optimal React reconciliation
 * - Performance optimization with memoized key generation
 *
 * @example
 * ```tsx
 * interface User {
 *   id: number;
 *   name: string;
 * }
 *
 * const ItemView = ({ item, index }: { item: User; index: number }) => (
 *   <div>{index}: {item.name}</div>
 * );
 *
 * const EmptyView = () => <div>No users found</div>;
 *
 * function UserList({ users }: { users: User[] }) {
 *   return (
 *     <ReactList
 *       data={users}
 *       keyExtractor="id"
 *       slots={{
 *         item: ItemView,
 *         empty: EmptyView
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using slots with default props
 * const slots = {
 *   item: {
 *     component: ItemView,
 *     props: { className: 'list-item' }
 *   }
 * };
 *
 * <ReactList data={items} keyExtractor="id" slots={slots} />
 * ```
 */
type ReactListForwardRef = {
  <T>(props: ReactListProps<T> & React.RefAttributes<ItemContext<T>[]>): React.ReactElement | null;
};

function ReactListInner<T>(
  { data, keyExtractor = 'id' as KeyExtractor<T>, slots }: ReactListProps<T>,
  ref: React.ForwardedRef<ItemContext<T>[]>
) {
  React.useImperativeHandle(ref, () => data.map((item, index) => ({ item, index, data })), [data]);

  const keys = useMemo(() => {
    return data.map((item, index) => getKey(item, index, data, keyExtractor));
  }, [data, keyExtractor]);

  if (data.length === 0) {
    return <>{renderSlot(slots.empty, { data })}</>;
  }

  return (
    <>{data.map((item, index) => renderSlot(slots.item, { item, index, data }, keys[index]))}</>
  );
}

export const ReactList = React.forwardRef(ReactListInner) as ReactListForwardRef;

export default ReactList;
