import React, { useMemo } from 'react';
import type { ReactListProps, ItemContext } from './types';
import { renderSlot, getKey } from './utils';
import type { KeyExtractor } from './types';

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
