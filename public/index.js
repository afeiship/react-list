import ReactDemokit from '@jswork/react-demokit';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactList from '../src/main';
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
      <ReactDemokit
        className="p-3 app-container"
        url="https://github.com/afeiship/react-list">
        <ReactList items={this.state.items} template={this.template} />
      </ReactDemokit>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
