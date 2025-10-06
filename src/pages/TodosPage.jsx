import TodoList from '../features/TodoList/TodoList.jsx';
import TodoForm from '../features/TodoList/TodoForm.jsx';
import TodosViewForm from '../features/TodosViewForm.jsx';
import styled from 'styled-components';

const StyledHr = styled.hr`
  border: none;
  border-top: 3px solid #653ed7;
  margin: 10px 0px;
`;

function TodosPage({
  todoState,
  addTodo,
  completeTodo,
  updateTodo,
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  return (
    <div>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
        isSaving={todoState.isSaving}
      />
      <StyledHr />
      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />
    </div>
  );
}

export default TodosPage;
