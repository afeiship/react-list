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
 * A stable bridge component that renders the slot via a stable wrapper.
 *
 * Uses useRef + useState to create a per-item StableSlot component whose identity
 * never changes across renders. Inside StableSlot, the slot is called directly
 * (not via createElement) so inline arrow wrappers don't cause remounts.
 *
 * This ensures:
 * 1. StableSlot provides a dedicated fiber host for slot hooks
 * 2. SlotBridge can safely add its own hooks without conflict
 * 3. Inline arrow slot refs changing across renders don't cause unmount/remount
 *
 * @internal
 */
function SlotBridge<P>(bridgeProps: { _slot: Slot<P>; _slotProps: P }) {
  const { _slot, _slotProps } = bridgeProps;
  const slotRef = React.useRef(_slot);
  slotRef.current = _slot;

  const [StableSlot] = React.useState(
    () =>
      function StableSlot(p: any) {
        return (slotRef.current as any)(p);
      },
  );

  if (typeof _slot !== 'function') {
    return _slot as React.ReactNode;
  }

  return React.createElement(StableSlot as React.ComponentType<any>, _slotProps);
}

/**
 * Renders a slot by creating a React element from the slot definition.
 *
 * Uses a stable `SlotBridge` wrapper for function/component slots so that:
 * 1. Hooks inside slot components get their own proper React context
 * 2. The bridge identity is stable across renders, avoiding unnecessary remounts
 *
 * @template P - The props type for the slot component.
 * @param slot - The slot definition to render.
 * @param props - The props to pass to the slot component.
 * @param key - Optional React key to add to the element.
 * @returns A React node, or `null` if no slot is provided.
 */
export function renderSlot<P>(slot: Slot<P> | undefined, props: P, key?: Key): React.ReactNode {
  if (!slot) return null;

  if (typeof slot === 'function') {
    return React.createElement(SlotBridge, { _slot: slot, _slotProps: props, key });
  }

  if (isSlotConfig(slot)) {
    return React.createElement(SlotBridge, {
      _slot: slot.component,
      _slotProps: { ...slot.props, ...props },
      key,
    });
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
