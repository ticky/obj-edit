import React, { PureComponent } from 'react';
import styled from 'styled-components';
import './App.css';

import objData from './examples/default.js'
import textureSrc from './examples/default.png';

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
    objData,
    textureSrc
  };

  render() {
    return (
      <AppContainer>
        <EditView
          defaultValue={this.state.objData}
          onChange={this.handleModelChange}
          textureSrc={this.state.textureSrc}
          onTextureChange={this.handleTextureChange}
        />
        <ThreeView objData={this.state.objData} textureSrc={this.state.textureSrc} />
      </AppContainer>
    );
  }

  handleModelChange = (evt) => {
    this.setState({ objData: evt.target.value });
  };

  handleTextureChange = (textureSrc) => {
    this.setState({ textureSrc });
  };
}
