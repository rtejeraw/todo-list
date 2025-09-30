import { useState } from 'react';
import { useRef } from 'react';
import { TextInputWithLabel } from '../../shared/TextInputWithLabel';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  gap: 10px;
`;

const StyledButton = styled.button`
  width: 100px;
  text-wrap: none;
  padding: 0px 10px;
  border: none;
  border-radius: 10px;
  color: #f0f0f0;
  cursor: pointer;
  font-size: 16px;
  background-color: green;
  &:hover {
    background-color: darkgreen;
  }
  &:disabled {
    background-color: grey;
    font-style: italic;
  }
`;

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');
    todoTitleInput.current.focus();
  }

  const todoTitleInput = useRef('');

  return (
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />
      <StyledButton
        type="submit"
        disabled={workingTodoTitle == '' ? true : false}
      >
        {isSaving ? 'Saving...' : 'Add Todo'}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
