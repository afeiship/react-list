import React from 'react';
import ReactList from '../../src/main';
import styled from 'styled-components';

const Container = styled.div`
  width: 80%;
  margin: 30px auto 0;
`;

const items = ['item1', 'item2', 'item3', 'item4', 'item5'];

// Usage: You can use your proxy just like you use
// a regular button!

export default () => {
  const ref1 = React.createRef();
  const ref2 = React.createRef();

  return (
    <Container>
      <ReactList
        ref={ref1}
        forwardedRef={ref2}
        as='ul'
        items={items}
        template={({ item, index }) => <li key={index}>{item}</li>}
      />
      <button onClick={() => console.log(ref1)}>click-instance-ref1</button>
      <button onClick={() => console.log(ref2)}>click-dom-ref2</button>
    </Container>
  );
};
