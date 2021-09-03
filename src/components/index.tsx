import noop from '@jswork/noop';
import classNames from 'classnames';
import React, { Component } from 'react';

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
  template: (args: TemplateArgs) => any;
  /**
   * The extended className for component.
   */
  className?: string;
  /**
   * If node name is React.Framgment.
   */
  virtual?: boolean;
  /**
   * Use customize node name(tagName or ReactElement).
   */
  nodeName?: any;
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
    nodeName: 'div',
    template: noop,
    allowEmpty: false
  };

  get virtual() {
    const { virtual, nodeName } = this.props;
    return virtual || nodeName === React.Fragment;
  }

  get children() {
    const { items, template } = this.props;
    return items.map((item, index) => template({ items, item, index }));
  }

  get nodeName() {
    const { nodeName } = this.props;
    return this.virtual ? React.Fragment : nodeName;
  }

  get properties() {
    const {
      className,
      nodeName,
      items,
      template,
      children,
      virtual,
      sizeKey,
      allowEmpty,
      forwardedRef,
      ...props
    } = this.props;

    if (this.virtual) return null;

    return {
      'data-component': CLASS_NAME,
      'ref': forwardedRef,
      'className': classNames(CLASS_NAME, className),
      ...props
    };
  }

  render() {
    const { items, sizeKey, allowEmpty } = this.props;
    if (!allowEmpty && (!items || !items[sizeKey!])) return null;
    return React.createElement(this.nodeName, this.properties, this.children);
  }
}

export default React.forwardRef((props: any, ref) => {
  return <ReactList {...props} ref={ref} />;
});
