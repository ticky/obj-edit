import React, { PureComponent } from 'react';
import styled from 'styled-components';
import objData from './examples/default.js'
import './App.css';

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

const EditView = styled.textarea.attrs({
  autoComplete: false,
  spellCheck: false
})`
  font: inherit;
  background-color: inherit;
  color: inherit;
  resize: none;
  border: none;
  margin: 0;
  padding: .5em;
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
