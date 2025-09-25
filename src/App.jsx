import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoList/TodoForm.jsx';
import TodosViewForm from './features/TodosViewForm.jsx';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import styles from './App.module.css';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState([false]);
  const [isSaving, setIsSaving] = useState([false]);
  const [sortField, setSortField] = useState(['createdTime']);
  const [sortDirection, setSortDirection] = useState(['desc']);
  const [queryString, setQueryString] = useState(['']);
  const [errorMessage, setErrorMessage] = useState(['']);

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) {
          throw new Error(resp.statusText);
        }
        const result = await resp.json();
        const todos = result.records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };

          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        });
        setTodoList(todos);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [sortField, sortDirection, queryString]);

  const addTodo = async (newTodoTitle) => {
    await APIFetch(
      'POST',
      { title: newTodoTitle, isCompleted: false },
      null,
      (savedTodo) => {
        setTodoList([...todoList, savedTodo]);
      }
    );
  };

  function completeTodo(todoId) {
    const todo = todoList.find((todo) => todo.id === todoId);
    if (todo) {
      todo.isCompleted = !todo.isCompleted;
      updateTodo(todo);
    }
  }

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    await APIFetch(
      'PATCH',
      editedTodo,
      () => {
        const revertedTodos = todoList.map((todo) => {
          if (todo.id === originalTodo.id) {
            todo.title = originalTodo.title;
            todo.isCompleted = originalTodo.isCompleted;
            return originalTodo;
          }
          return todo;
        });
        setTodoList([...revertedTodos]);
      },
      (savedTodo) => {
        setTodoList(
          todoList.map((todo) => (todo.id === savedTodo.id ? savedTodo : todo))
        );
      }
    );
  };

  async function APIFetch(
    method,
    todo,
    revertCallback = null,
    finallyCallback = null
  ) {
    const payload = {
      records: [
        {
          id: todo.id,
          fields: {
            title: todo.title,
            isCompleted: todo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: method,
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    let savedTodo = null;
    try {
      setIsSaving(true);
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      const { records } = await resp.json();
      savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
    } catch (error) {
      setErrorMessage(error.message);
      if (revertCallback) {
        revertCallback();
      }
    } finally {
      if (finallyCallback) {
        finallyCallback(savedTodo);
      }
      setIsSaving(false);
    }
  }

  return (
    <div className={styles['appcontainer']}>
      <div className={styles['header']}>
        <div className={styles['header-container']}>
          <h1>CTD [Vite + React course]</h1>
        </div>
      </div>
      <div className={styles['content']}>
        <div className={styles['container']}>
          <h1>Todo List</h1>
          <TodoForm onAddTodo={addTodo} />
          <TodoList
            todoList={todoList}
            onCompleteTodo={completeTodo}
            onUpdateTodo={updateTodo}
            isLoading={isLoading}
            isSaving={isSaving}
          />
          <hr className={styles.hr} />
          <TodosViewForm
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            sortField={sortField}
            setSortField={setSortField}
            queryString={queryString}
            setQueryString={setQueryString}
          />
          {!errorMessage ? (
            <div className={styles['error-container']}>
              <p>{errorMessage}</p>
              <button type="button" onClick={setErrorMessage['']}>
                Dismiss
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
