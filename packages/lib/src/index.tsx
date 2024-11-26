import noop from '@jswork/noop';
import cx from 'classnames';
import React, { Component, Fragment, ReactNode } from 'react';
import classImperativeHandle from '@jswork/class-imperative-handle';

const CLASS_NAME = 'react-list';
export type TemplateCallback = (args: TemplateArgs) => ReactNode;

export interface TemplateArgs {
  items: any[];
  item: any;
  index: number;
  options?: any;
}

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
   * If template is jsx or function.
   */
  isJsx?: boolean;
  /**
   * List item template.
   */
  template?: TemplateCallback | React.FC<TemplateArgs>;
  /**
   * Empty template.
   */
  templateEmpty?: TemplateCallback | React.FC<TemplateArgs>;
  /**
   * Loading template.
   */
  templateLoading?: TemplateCallback | React.FC<TemplateArgs>;
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

class ReactList extends Component<ReactListProps> {
  static displayName = CLASS_NAME;
  static version = '__VERSION__';
  static defaultProps = {
    isJsx: false,
    allowEmpty: false,
    items: [],
    sizeKey: 'length',
    as: Fragment,
    template: noop,
    templateEmpty: noop,
  };

  get children() {
    const { items, template, options, isJsx } = this.props;
    if (isJsx) {
      const Component = template as React.FC<TemplateArgs>;
      return items.map((item, index) => (
        <Component key={index} items={items} item={item} index={index} options={options} />
      ));
    }
    return items.map((item, index) => template!({ items, item, index, options }));
  }

  get placeholderView() {
    const { items, loading, templateEmpty, templateLoading, options, isJsx } = this.props;
    const emptyArgs = { items, item: null, index: -1, options };
    const isLoadingTemplate = typeof loading === 'boolean' && loading;
    if (isJsx) {
      const Component = isLoadingTemplate
        ? (templateLoading as React.FC<TemplateArgs>)
        : (templateEmpty as React.FC<TemplateArgs>);
      return <Component {...emptyArgs} />;
    }
    return isLoadingTemplate ? templateLoading?.(emptyArgs) : templateEmpty?.(emptyArgs);
  }

  get properties() {
    const {
      className,
      allowEmpty,
      isJsx,
      as,
      items,
      template,
      templateEmpty,
      sizeKey,
      forwardedRef,
      options,
      ...props
    } = this.props;

    if (as === Fragment) return null;

    return {
      'data-component': CLASS_NAME,
      'ref': this.handleRef,
      'className': cx(CLASS_NAME, className),
      ...props,
    };
  }

  handleRef = (inRoot: any) => {
    const { forwardedRef } = this.props;
    classImperativeHandle(forwardedRef, inRoot);
  };

  render() {
    const { as, items, sizeKey, allowEmpty } = this.props;
    if ((!items || !items[sizeKey!]) && !allowEmpty) return this.placeholderView;
    return React.createElement(as, this.properties, this.children);
  }
}

export default React.forwardRef((props: any, ref) => {
  return <ReactList {...props} ref={ref} />;
});
