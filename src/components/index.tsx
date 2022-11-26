import noop from '@jswork/noop';
import cx from 'classnames';
import React, { Component, Fragment } from 'react';
import classImperativeHandle from '@jswork/class-imperative-handle';

const CLASS_NAME = 'react-list';

export interface TemplateArgs {
  items: any[];
  item: any;
  index: number;
}

export interface ReactListProps {
  /**
   * List data source.
   */
  items: any[];
  /**
   * List item template.
   */
  template?: (args: TemplateArgs, opts?: any) => any;
  /**
   * The extended className for component.
   */
  className?: string;
  /**
   * Use customize node name(tagName or ReactElement).
   */
  as?: any;
  /**
   * The collection size key.
   */
  sizeKey?: string;
  /**
   * The default allow empty element is null.
   */
  allowEmpty?: boolean;
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
    allowEmpty: false
  };

  get children() {
    const { items, template } = this.props;
    return items.map((item, index) => template!({ items, item, index }));
  }

  get properties() {
    const {
      className,
      as,
      items,
      template,
      children,
      sizeKey,
      allowEmpty,
      forwardedRef,
      ...props
    } = this.props;

    if (as === Fragment) return null;

    return {
      'data-component': CLASS_NAME,
      'ref': this.handleRef,
      'className': cx(CLASS_NAME, className),
      ...props
    };
  }

  handleRef = (inRoot) => {
    const { forwardedRef } = this.props;
    classImperativeHandle(forwardedRef, inRoot);
  };

  render() {
    const { as, items, sizeKey, allowEmpty } = this.props;
    if (!allowEmpty && (!items || !items[sizeKey!])) return null;
    return React.createElement(as, this.properties, this.children);
  }
}

export default React.forwardRef((props: any, ref) => {
  return <ReactList {...props} ref={ref} />;
});
