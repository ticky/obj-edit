import React, { PureComponent } from 'react';
import styled from 'styled-components';
import objData from './examples/default.js'
import './App.css';

import EditView from './EditView';
import ThreeView from './ThreeView';

const AppContainer = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;

  > * {
    flex: 1 0 50%;
  }
`;

export default class App extends PureComponent {
  state = {
    objData
  };

  render() {
    return (
      <AppContainer>
        <EditView value={this.state.objData} onChange={this.handleUpdate} />
        <ThreeView objData={this.state.objData} />
      </AppContainer>
    );
  }

  handleUpdate = (evt) => {
    this.setState({ objData: evt.target.value });
  };
}
