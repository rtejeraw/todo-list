import './App.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoList/TodoForm.jsx';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState([false]);
  const [isSaving, setIsSaving] = useState([false]);
  const [errorMessage, setErrorMessage] = useState(['']);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

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
        const resp = await fetch(url, options);
        if (!resp.ok) {
          throw new Error(resp.statusText);
        }
        const result = await resp.json();
        const todos = result.records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };
          if (!record.isCompleted) {
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
  }, []);

  const addTodo = async (newTodoTitle) => {
    await APIFetch(
      'POST',
      { title: newTodoTitle, isCompleted: false },
      null,
      (savedTodo) => {
        console.log(savedTodo);
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
    var savedTodo = null;
    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
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
      console.error(error);
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
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
        isSaving={isSaving}
      />
      {!errorMessage ? (
        <>
          <hr />
          <p>{errorMessage}</p>
          <button type="button" onClick={setErrorMessage['']}>
            Dismiss
          </button>
        </>
      ) : null}
    </div>
  );
}

export default App;
