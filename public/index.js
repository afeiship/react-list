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
