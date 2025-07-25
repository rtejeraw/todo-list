function TodoForm() {
  return (
    <form>
      <label htmlFor="todoTitle">Todo</label>
      <input type="text" id="todoTitle" placeholder="Enter todo title" />
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;
