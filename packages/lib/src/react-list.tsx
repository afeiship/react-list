import React, { useMemo } from 'react';
import type { ReactListProps } from './types';
import { renderSlot, getKey } from './utils';
import type { KeyExtractor } from './types';

export function ReactList<T>({
  data,
  keyExtractor = 'id' as KeyExtractor<T>,
  slots,
}: ReactListProps<T>) {
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
