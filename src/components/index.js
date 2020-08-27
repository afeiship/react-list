import noop from '@feizheng/noop';
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
     * List item template.
     */
    template: PropTypes.func
  };

  static defaultProps = {
    items: [],
    nodeName: 'div',
    template: noop
  };

  get virtual() {
    const { virtual, nodeName } = this.props;
    return virtual || nodeName === React.Fragment;
  }

  get childView() {
    const { items, template } = this.props;
    return items.map((item, index) => {
      return template({ item, index });
    });
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
      ...props
    } = this.props;

    return this.virtual
      ? { children: this.childView }
      : {
          'data-component': CLASS_NAME,
          children: this.childView,
          className: classNames(CLASS_NAME, className),
          ...props
        };
  }

  render() {
    return React.createElement(this.nodeName, this.properties);
  }
}
