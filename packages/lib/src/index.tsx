import noop from '@jswork/noop';
import cx from 'classnames';
import React, { Component, Fragment, ReactNode } from 'react';
import classImperativeHandle from '@jswork/class-imperative-handle';

const CLASS_NAME = 'react-list';

export interface TemplateArgs {
  items: any[];
  item: any;
  index: number;
  options?: Record<string, any>;
}

export interface ReactListProps {
  /**
   * List data source.
   */
  items: any[];
  /**
   * List item template.
   */
  template?: (args: TemplateArgs, opts?: any) => ReactNode;
  /**
   * Empty template.
   */
  templateEmpty?: (args: TemplateArgs, opts?: any) => ReactNode;
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
    items: [],
    sizeKey: 'length',
    as: Fragment,
    template: noop,
    templateEmpty: noop,
    allowEmpty: false,
  };

  get children() {
    const { items, template, options } = this.props;
    return items.map((item, index) => template!({ items, item, index, options }));
  }

  get emptyView() {
    const { items, templateEmpty, options } = this.props;
    return templateEmpty!({ items, item: null, index: -1, options });
  }

  get properties() {
    const { className, as, items, template, sizeKey, forwardedRef, options, ...props } = this.props;

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
    const { as, items, sizeKey } = this.props;
    if (!items || !items[sizeKey!]) return this.emptyView;
    return React.createElement(as, this.properties, this.children);
  }
}

export default React.forwardRef((props: any, ref) => {
  return <ReactList {...props} ref={ref} />;
});
