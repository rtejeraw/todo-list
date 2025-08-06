import { useRef } from 'react';

function TodoForm({ onAddTodo }) {
  function handleAddTodo(event) {
    event.preventDefault();
    const title = event.target.title.value;
    onAddTodo(title);
    event.target.title.value = '';
    todoTitleInput.current.focus();
  }

  const todoTitleInput = useRef('');

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        name="title"
        type="text"
        id="todoTitle"
        placeholder="Enter todo title"
        ref={todoTitleInput}
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;
