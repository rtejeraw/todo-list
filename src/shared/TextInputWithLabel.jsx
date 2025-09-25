import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  border-radius: 10px;
  padding: 0px 10px;
  font-size: 16px;
  padding: 10px;
  border: none;
`;

export function TextInputWithLabel({ elementId, label, onChange, ref, value }) {
  return (
    <>
      <label htmlFor={elementId}>{label}</label>
      <StyledInput
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;
