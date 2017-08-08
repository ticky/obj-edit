import styled from 'styled-components';

export default styled.textarea.attrs({
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
