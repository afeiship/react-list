import React from 'react';
import ReactList from '../../src/main';
import styled from 'styled-components';

const Container = styled.div`
  width: 80%;
  margin: 30px auto 0;
`;

const items = ['item1', 'item2', 'item3', 'item4', 'item5'];

export default (props: any) => {
  return (
    <Container>
      <ReactList
        nodeName="ul"
        items={items}
        template={({ item, index }) => <li key={index}>{item}</li>}
      />
    </Container>
  );
};
