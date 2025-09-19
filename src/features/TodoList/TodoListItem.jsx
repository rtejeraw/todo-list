import { useState } from 'react';
import { TextInputWithLabel } from '../../shared/TextInputWithLabel.jsx';
import { useEffect } from 'react';
import styles from './TodoListItem.module.css';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing();
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    if (!isEditing) return;
    event.preventDefault();

    onUpdateTodo({ ...todo, title: workingTitle });
    setIsEditing(false);
  }

  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

  return (
    <li>
      <form className={styles.form} onSubmit={handleUpdate}>
        {isEditing ? (
          <div className={styles['todo-item-editing']}>
            <TextInputWithLabel value={workingTitle} onChange={handleEdit} />
            <button
              type="button"
              onClick={handleCancel}
              className={`${styles.button} ${styles['button-cancel']}`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className={`${styles.button} ${styles['button-ok']}`}
            >
              Update
            </button>
          </div>
        ) : (
          <div className={styles['todo-item']}>
            <input
              type="checkbox"
              id={`checkbox${todo.id}`}
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </div>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
