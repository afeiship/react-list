import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from '@feizheng/noop';

const CLASS_NAME = 'react-list';

export default class extends Component {
  static displayName = CLASS_NAME;
  static propTypes = {
    className: PropTypes.string,
    virtual: PropTypes.bool,
    nodeName: PropTypes.any,
    items: PropTypes.array,
    template: PropTypes.func
  };

  static defaultProps = {
    items: [],
    nodeName: 'div',
    template: noop
  };

  get childView() {
    const { items, template } = this.props;
    return items.map((item, index) => {
      return template({ item, index });
    });
  }

  get nodeName() {
    const { virtual, nodeName } = this.props;
    return virtual ? React.Fragment : nodeName;
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
    return virtual
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
