import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const EditField = styled.textarea.attrs({
  autoComplete: false,
  spellCheck: false
})`
  flex: 1 0 auto;
  font: inherit;
  background-color: inherit;
  color: inherit;
  resize: none;
  border: none;
  margin: 0;
  padding: .5em;
`;

const EditFieldWrapper = styled.div`
  display: flex;
  flex: 1 0 auto;
`;

export default class EditView extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onTextureChange: PropTypes.func.isRequired,
    textureSrc: PropTypes.string.isRequired
  };

  componentWillMount() {
    this._fileReader = new FileReader();
    this._fileReader.addEventListener('load', this.handleFileLoad);
  }

  componentWillUnmount() {
    this._fileReader.removeEventListener('load', this.handleFileLoad);
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <EditField
          defaultValue={this.props.defaultValue}
          onChange={this.props.onChange}
        />
        <div style={{ flex: '0 0 auto', display: 'flex', paddingLeft: '.5em', borderTop: '1px solid grey' }}>
          <label style={{ flex: '1 0 auto', display: 'flex', alignItems: 'center' }}>
            Texture
            <img style={{ margin: '1em', width: '2em', height: '2em', flex: 'none' }} src={this.props.textureSrc} />
            <input type="file" accept="image/*" style={{ flex: '1 0 auto' }} onChange={this.handleFileChange} />
          </label>
        </div>
      </div>
    );
  }

  handleFileChange = (evt) => {
    if (evt.target.files.length) {
      this._fileReader.readAsDataURL(evt.target.files[0]);
    }
  };

  handleFileLoad = (evt) => {
    this.props.onTextureChange(evt.target.result);
  };
}
