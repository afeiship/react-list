import ReactList from '@jswork/react-list/src';
import './index.css';
import '@jswork/react-list/src/style.scss';
import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const template = ({ item, index }) => {
    const [v, setV] = useState(0);
    return (
      <div key={index} className="border mb-1 debug-red">
        <span>Value: {v}</span>
        <p className="text-sm text-gray-700">
          {index + 1}, {item.name} - {item.age}
        </p>
      </div>
    );
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers([
        { name: 'John', age: 25 },
        { name: 'Mary', age: 30 },
        { name: 'Tom', age: 35 },
        { name: 'Jerry', age: 40 }
      ]);
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="m-10 p-4 shadow bg-gray-100 y-5 text-gray-800 hover:shadow-md transition-all">
      <div className="badge badge-warning absolute right-0 top-0 m-4">Build Time: {BUILD_TIME}</div>
      <h1>react-list</h1>
      <nav className="x-2">
        <button className="btn btn-sm btn-primary" onClick={() => setUsers([])}>
          Set Empty
        </button>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => setUsers([...users, { name: 'New', age: 10 }])}>
          Add New
        </button>
        <button className="btn btn-sm btn-error" onClick={() => setUsers(users.slice(0, -1))}>
          Remove Last
        </button>
      </nav>
      <div className="bg-blue-100 rounded p-2">
        <ReactList
          items={users}
          loading={isLoading}
          isJsx
          templateLoading={() => {
            return <div className="p-2 text-center debug-blue text-gray-500">Loading...</div>;
          }}
          templateEmpty={() => {
            return <div className="p-2 text-center debug-blue text-gray-500">Empty View</div>;
          }}
          template={template}
        />
      </div>
    </div>
  );
}

export default App;
