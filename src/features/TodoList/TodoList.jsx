import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';
import { useSearchParams } from 'react-router';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter((todo) => todo.isCompleted == false);

  const [searchParams, setSearchParams] = useSearchParams();

  function handlePreviousPage() {
    setSearchParams({ page: Math.max(1, currentPage - 1) });
  }

  function handleNextPage() {
    setSearchParams({ page: Math.min(totalPages, currentPage + 1) });
  }

  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || 1, 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);
  const paginatedTodoList = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (totalPages === 0) return;
    if (
      !Number.isInteger(currentPage) ||
      currentPage < 1 ||
      currentPage > totalPages
    ) {
      navigate('/');
    } else {
      setSearchParams({ page: currentPage });
    }
  }, [currentPage, totalPages, navigate]);

  return isLoading ? (
    <div className={styles['todo-list-container']}>
      <p>Todo list loading...</p>
    </div>
  ) : todoList.length === 0 ? (
    <p>Add todo above to get started</p>
  ) : (
    <div className={styles['todo-list-container']}>
      <ul className={styles['todo-list']}>
        {paginatedTodoList.map((item) => (
          <TodoListItem
            key={item.id}
            todo={item}
            onCompleteTodo={onCompleteTodo}
            onUpdateTodo={onUpdateTodo}
          />
        ))}
      </ul>
      <div className={styles['paginationControls']}>
        <button
          type="button"
          onClick={() => handlePreviousPage()}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => handleNextPage()}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TodoList;
