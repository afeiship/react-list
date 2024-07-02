# react-list
> List component for react.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
npm install -S @jswork/react-list
```

## usage
1. import css
  ```scss
  @import "~@jswork/react-list/dist/style.css";

  // or use sass
  @import "~@jswork/react-list/dist/style.scss";
  ```
2. import js
  ```js
  import ReactList from '@jswork/react-list';
  import './index.css';
  import '@jswork/react-list/dist/style.scss';
  import { useEffect, useState } from 'react';

  function App() {
    const [users, setUsers] = useState<any[]>([]);
    useEffect(() => {
      setTimeout(() => {
        setUsers([
          { name: 'John', age: 25 },
          { name: 'Mary', age: 30 },
          { name: 'Tom', age: 35 },
          { name: 'Jerry', age: 40 },
        ]);
      }, 2000);
    }, []);
    return (
      <div className="m-10 p-4 shadow bg-gray-100 text-gray-800 hover:shadow-md transition-all">
        <div className="badge badge-warning absolute right-0 top-0 m-4">Build Time: {BUILD_TIME}</div>
        <h1>react-list</h1>
        <nav>
          <button className="btn btn-primary" onClick={() => setUsers([])}>
            Set Empty
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setUsers([...users, { name: 'New', age: 10 }])}
          >
            Add New
          </button>
        </nav>
        <ReactList
          items={users}
          templateEmpty={(args) => {
            console.log('args: ', args);
            return <div className="p-2 text-center debug-blue text-gray-500">Empty View</div>;
          }}
          template={({ item, index }) => {
            return (
              <div key={index}>
                <p className="text-sm text-gray-700">
                  {index + 1}, {item.name} - {item.age}
                </p>
              </div>
            );
          }}
        />
        <button className="btn btn-info">Button</button>
      </div>
    );
  }

  export default App;
  ```

## preview
- https://afeiship.github.io/react-list/

## license
Code released under [the MIT license](https://github.com/afeiship/react-list/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/react-list
[version-url]: https://npmjs.org/package/@jswork/react-list

[license-image]: https://img.shields.io/npm/l/@jswork/react-list
[license-url]: https://github.com/afeiship/react-list/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/react-list
[size-url]: https://github.com/afeiship/react-list/blob/master/dist/react-list.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/react-list
[download-url]: https://www.npmjs.com/package/@jswork/react-list
