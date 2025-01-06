import noop from '@jswork/noop';
import cx from 'classnames';
import React, { Fragment, ReactNode, useImperativeHandle, forwardRef } from 'react';

const CLASS_NAME = 'react-list';
export type TemplateCallback = (args: TemplateArgs) => ReactNode;
export type TemplateComponent = React.FC<TemplateArgs>;

export interface TemplateArgs {
  items: any[];
  item: any;
  index: number;
  options?: any;
}

// @reference https://github.com/copilot/c/d647b1d0-18b4-4503-8991-358b9387b7a0

export interface ReactListProps {
  /**
   * Whether to allow empty list.
   */
  allowEmpty?: boolean;
  /**
   * List data source.
   */
  items: any[];
  /**
   * Whether to display the loading status.
   */
  loading?: boolean;
  /**
   * If template can use react hook(as function component).
   */
  hookable?: boolean;
  /**
   * List item template.
   */
  template?: TemplateCallback | TemplateComponent;
  /**
   * Empty template.
   */
  templateEmpty?: TemplateCallback | TemplateComponent;
  /**
   * Loading template.
   */
  templateLoading?: TemplateCallback | TemplateComponent;
  /**
   * The extended className for component.
   */
  className?: string;
  /**
   * Use customize node name(tagName or ReactElement).
   */
  as?: any;
  /**
   * The extra options for template function.
   */
  options?: any;
  /**
   * The collection size key.
   */
  sizeKey?: string;
  /**
   * Reference to original ref instance(tag: dom).
   */
  forwardedRef?: any;
}

const ReactList: React.FC<ReactListProps> = forwardRef((props, ref) => {
  const {
    allowEmpty = false,
    items = [],
    loading,
    hookable = false,
    template = noop,
    templateEmpty = noop,
    templateLoading,
    className,
    as = Fragment,
    options,
    sizeKey = 'length',
    forwardedRef,
    ...restProps
  } = props;

  useImperativeHandle(ref, () => forwardedRef);

  const children = hookable
    ? items.map((item, index) => {
      const Component = template as TemplateComponent;
      return <Component key={index} items={items} item={item} index={index} options={options} />;
    })
    : items.map((item, index) => template!({ items, item, index, options }));

  const placeholderView = hookable
    ? React.createElement(
      loading ? (templateLoading as TemplateComponent) : (templateEmpty as TemplateComponent),
      { items, item: null, index: -1, options },
    )
    : (loading ? templateLoading : templateEmpty)?.({ items, item: null, index: -1, options });

  const properties = as !== Fragment ? {
    'data-component': CLASS_NAME,
    ref: forwardedRef,
    className: cx(CLASS_NAME, className),
    ...restProps,
  } : null;

  if ((!items || !items[sizeKey]) && !allowEmpty) return placeholderView;
  return React.createElement(as, properties, children);
});

ReactList.displayName = CLASS_NAME;
// ReactList.version = '__VERSION__';

export default ReactList;
