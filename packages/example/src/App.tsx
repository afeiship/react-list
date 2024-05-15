import ReactList from '@jswork/react-list/src';
import './index.css';
import '@jswork/react-list/src/style.scss';
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
        templateEmpty={() => <div className="p-2 text-center debug-blue text-gray-500">Empty View</div>}
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
