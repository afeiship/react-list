import noop from '@jswork/noop';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const CLASS_NAME = 'react-list';

export default class ReactList extends Component {
  static displayName = CLASS_NAME;
  static version = '__VERSION__';
  static propTypes = {
    /**
     * The extended className for component.
     */
    className: PropTypes.string,
    /**
     * If node name is React.Framgment.
     */
    virtual: PropTypes.bool,
    /**
     * Use customize node name(tagName or ReactElement).
     */
    nodeName: PropTypes.any,
    /**
     * List data source.
     */
    items: PropTypes.array,
    /**
     * The collection size key.
     */
    sizeKey: PropTypes.string,
    /**
     * The default allow empty element is null.
     */
    allowEmpty: PropTypes.bool,
    /**
     * List item template.
     */
    template: PropTypes.func
  };

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

  get childView() {
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
      ...props
    } = this.props;

    if (this.virtual) return null;

    return {
      'data-component': CLASS_NAME,
      'className': classNames(CLASS_NAME, className),
      ...props
    };
  }

  render() {
    const { items, sizeKey, allowEmpty } = this.props;
    if (!allowEmpty && (!items || !items[sizeKey])) return null;
    return React.createElement(this.nodeName, this.properties, this.childView);
  }
}
