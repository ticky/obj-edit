import React, { PureComponent } from 'react';
import styled from 'styled-components';
import objData from './examples/default.js'
import './App.css';

import ThreeView from './ThreeView';

const ErrorView = styled.div`
  position: absolute;
  padding: .5em;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: right;
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

const AppContainer = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  min-height: 100%;
  min-height: 100vh;

  > * {
    flex: 1 0 50%;
  }
`;

export default class App extends PureComponent {
  state = {
    objData,
    error: null
  };

  render() {
    return (
      <AppContainer>
        {this.state.error && (
          <ErrorView>
            {this.state.error.toString()}
          </ErrorView>
        )}
        <EditView
          value={this.state.objData}
          onChange={this.handleUpdate}
        />
        <ThreeView
          objData={this.state.objData}
          onSuccess={this.handleSuccess}
          onError={this.handleError}
        />
      </AppContainer>
    );
  }

  handleUpdate = (evt) => {
    this.setState({ objData: evt.target.value });
  };

  handleSuccess = () => {
    this.setState({ error: null });
  };

  handleError = (error) => {
    this.setState({ error });
  };
}
