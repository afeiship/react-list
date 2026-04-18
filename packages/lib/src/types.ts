import React from 'react';

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
export type Key = string | number;

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
