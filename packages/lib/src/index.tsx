import React, { useMemo } from 'react';

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
       */
      component: React.ComponentType<P & Record<string, any>>;
      /**
       * Extra props to merge with the standard slot props.
       * These are passed to the component alongside the default slot props.
       */
      props?: Record<string, any>;
    };

/**
 * Extracts a unique key or value from a data item.
 *
 * @typeParam T - The type of items in the data array.
 */
export type KeyExtractor<T> = keyof T | ((item: T, index: number) => string | number);

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
   * - A key of the item type (`keyof T`)
   * - A function that receives the item and index, returning a string or number
   *
   * @example
   * ```tsx
   * // Using a key path
   * <ReactList data={items} keyExtractor="id" {...props} />
   *
   * // Using a function
   * <ReactList
   *   data={items}
   *   keyExtractor={(item, index) => item.id}
   *   {...props}
   * />
   * ```
   */
  keyExtractor: KeyExtractor<T>;

  /**
   * Slot configuration for rendering different list states.
   */
  slots: {
    /**
     * Slot for rendering each item in the list.
     * Receives the current item, its index, and the full data array.
     */
    item: Slot<{
      /** The current data item. */
      item: T;
      /** The index of the current item in the data array. */
      index: number;
      /** The complete data array. */
      data: T[];
    }>;
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
export function isSlotConfig<P>(
  value: any
): value is { component: React.ComponentType<P & Record<string, any>>; props?: Record<string, any> } {
  return value && typeof value === 'object' && 'component' in value;
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
export function renderSlot<P>(
  slot: Slot<P> | undefined,
  props: P,
  key?: string | number
): React.ReactNode {
  if (!slot) return null;

  if (typeof slot === 'function') {
    return React.createElement(slot as any, key ? { key, ...props } : (props as any));
  }

  if (isSlotConfig<P>(slot)) {
    return React.createElement(slot.component as any, {
      key,
      ...slot.props,
      ...props,
    } as any);
  }

  if (key !== undefined) {
    return <React.Fragment key={key}>{slot}</React.Fragment>;
  }
  return slot;
}

/**
 * Extracts a unique key for a list item using the provided key extractor.
 *
 * @template T - The type of the data item.
 * @param item - The data item.
 * @param index - The index of the item in the array.
 * @param keyExtractor - The key extractor function or property key.
 * @returns A unique key (string or number) for the item.
 *
 * @example
 * ```tsx
 * getKey({ id: 1, name: 'Item' }, 0, 'id'); // => 1
 * getKey({ id: 1, name: 'Item' }, 0, (item) => item.id); // => 1
 * getKey({ name: 'Item' }, 0, 'id'); // => 0 (fallback to index)
 * ```
 */
export function getKey<T>(
  item: T,
  index: number,
  keyExtractor: ReactListProps<T>['keyExtractor']
): string | number {
  if (typeof keyExtractor === 'function') {
    return keyExtractor(item, index);
  }
  return (item[keyExtractor] ?? index) as string | number;
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
export function ReactList<T>({
  data,
  keyExtractor,
  slots,
}: ReactListProps<T>) {
  // Cache keys array for performance optimization.
  // Essential for large lists, harmless for small ones.
  const keys = useMemo(() => {
    return data.map((item, index) => getKey(item, index, keyExtractor));
  }, [data, keyExtractor]);

  if (data.length === 0) {
    return <>{renderSlot(slots.empty, { data })}</>;
  }

  return (
    <>
      {data.map((item, index) =>
        renderSlot(slots.item, { item, index, data }, keys[index])
      )}
    </>
  );
}

export default ReactList;
