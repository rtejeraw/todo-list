import styled from 'styled-components';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  & a {
    text-decoration: none;
    color: #653ed7;
    font-weight: bold;
  }
`;

function NotFound() {
  return (
    <StyledDiv>
      <h2>Page not found</h2>
      <a href="/">Go back home</a>
    </StyledDiv>
  );
}

export default NotFound;
