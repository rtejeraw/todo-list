import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter((todo) => todo.isCompleted == false);

  return isLoading ? (
    <div className={styles['todo-list-container']}>
      <p>Todo list loading...</p>
    </div>
  ) : todoList.length === 0 ? (
    <p>Add todo above to get started</p>
  ) : (
    <div className={styles['todo-list-container']}>
      <ul className={styles['todo-list']}>
        {filteredTodoList.map((item) => (
          <TodoListItem
            key={item.id}
            todo={item}
            onCompleteTodo={onCompleteTodo}
            onUpdateTodo={onUpdateTodo}
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
