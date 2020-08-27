# react-list
> A list component.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
npm install -S @feizheng/react-list
```

## update
```shell
npm update @feizheng/react-list
```

## properties
| Name      | Type   | Required | Default | Description                                       |
| --------- | ------ | -------- | ------- | ------------------------------------------------- |
| className | string | false    | -       | The extended className for component.             |
| virtual   | bool   | false    | -       | If node name is React.Framgment.                  |
| nodeName  | any    | false    | 'div'   | Use customize node name(tagName or ReactElement). |
| items     | array  | false    | []      | List data source.                                 |
| template  | func   | false    | noop    | List item template.                               |


## usage
1. import css
  ```scss
  @import "~@feizheng/react-list/dist/style.scss";

  // customize your styles:
  $react-list-options: ()
  ```
2. import js
  ```js
  import React from 'react';
  import ReactDOM from 'react-dom';
  import ReactList from '@feizheng/react-list';
  import './assets/style.scss';

  class App extends React.Component {
    state = {
      items: require('./assets/data.json')
    };

    template = ({ item }) => {
      return (
        <div key={item.domId} className="is-item">
          {item.name}
        </div>
      );
    };

    render() {
      return (
        <div className="app-container">
          <ReactList items={this.state.items} template={this.template} />
        </div>
      );
    }
  }

  ReactDOM.render(<App />, document.getElementById('app'));

  ```

## documentation
- https://afeiship.github.io/react-list/


## license
Code released under [the MIT license](https://github.com/afeiship/react-list/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@feizheng/react-list
[version-url]: https://npmjs.org/package/@feizheng/react-list

[license-image]: https://img.shields.io/npm/l/@feizheng/react-list
[license-url]: https://github.com/afeiship/react-list/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@feizheng/react-list
[size-url]: https://github.com/afeiship/react-list/blob/master/dist/react-list.min.js

[download-image]: https://img.shields.io/npm/dm/@feizheng/react-list
[download-url]: https://www.npmjs.com/package/@feizheng/react-list
