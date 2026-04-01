import { ReactList, type Slot } from '@jswork/react-list';
import { products } from '../assets/products';
import { useState } from 'react';

/**
 * Demo showing slot with default props.
 */

interface ProductItemProps {
  item: typeof products[0];
  index: number;
  variant?: 'simple' | 'detailed';
  showCategory?: boolean;
}

const ProductItem = ({ item, index, variant = 'simple', showCategory = true }: ProductItemProps) => {
  const categoryColors = {
    electronics: 'badge-primary',
    clothing: 'badge-secondary',
    food: 'badge-accent',
    books: 'badge-info'
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <span className="text-gray-400 text-sm font-mono">{item.sku}</span>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        {variant === 'detailed' && (
          <div className="flex items-center gap-2 mt-1">
            {showCategory && (
              <span className={`badge badge-sm ${categoryColors[item.category]}`}>{item.category}</span>
            )}
            <span className="text-xs text-gray-500">Stock: {item.stock}</span>
          </div>
        )}
      </div>
      <span className="font-semibold text-green-600">${item.price.toFixed(2)}</span>
    </div>
  );
};

export function SlotPropsDemo() {
  const [useSimpleVariant, setUseSimpleVariant] = useState(true);

  // Slot with default props
  const productSlot: Slot<ProductItemProps> = {
    component: ProductItem,
    props: {
      variant: 'detailed',
      showCategory: true
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Slot Props Demo</h2>
        <span className="badge badge-info badge-sm">Default Props</span>
      </div>
      <p className="text-sm text-gray-600">
        Using slot configuration with default props that get merged with runtime props.
      </p>
      <div className="flex gap-2">
        <button
          className={`btn btn-sm ${useSimpleVariant ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setUseSimpleVariant(true)}>
          With Default Props
        </button>
        <button
          className={`btn btn-sm ${!useSimpleVariant ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setUseSimpleVariant(false)}>
          Override Props
        </button>
      </div>
      <div className="space-y-2">
        <ReactList
          data={products}
          keyExtractor="sku"
          slots={{
            item: useSimpleVariant
              ? productSlot
              : {
                  component: ProductItem,
                  props: {
                    variant: 'simple',
                    showCategory: false
                  }
                }
          }}
        />
      </div>
    </div>
  );
}
