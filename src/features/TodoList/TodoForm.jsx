import { useState } from 'react';
import { useRef } from 'react';
import { TextInputWithLabel } from '../../shared/TextInputWithLabel';
import styles from './TodoForm.module.css';

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
    <form onSubmit={handleAddTodo} className={styles.form}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />
      <button
        type="submit"
        className={styles.button}
        disabled={workingTodoTitle == '' ? true : false}
      >
        {isSaving ? 'Saving...' : 'Add Todo'}
      </button>
    </form>
  );
}

export default TodoForm;
