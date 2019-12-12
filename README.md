# react-list
> A list component.

## installation
```shell
npm install -S @feizheng/react-list
```
## properties
| property  | type  | description |
| --------- | ----- | ----------- |
| className | -     | -           |
| items     | array | -           |
| template  | func  | -           |

## usage
1. import css
  ```scss
  @import "~@feizheng/react-list/dist/style.scss";

  // customize your styles:
  $react-list-options: ()
  ```
2. import js
  ```js
  import ReactList from '../src/main';
  import ReactDOM from 'react-dom';
  import React from 'react';
  import './assets/style.scss';

  class App extends React.Component {
    state = {
      items: require('./assets/data.json')
    }

    template = ({ item }) => {
      return <div key={item.domId} className="is-item">{item.name}</div>
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
