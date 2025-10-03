import { use, useReducer, useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import styles from './App.module.css';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';
import TodosPage from './pages/TodosPage.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import Header from './shared/Header.jsx';
import { Route, Routes, useLocation } from 'react-router';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        dispatch({ type: todoActions.changeLocation, pathName: 'Todo List' });
        break;
      case '/about':
        dispatch({ type: todoActions.changeLocation, pathName: 'About' });
        break;
      default:
        dispatch({ type: todoActions.changeLocation, pathName: 'Not Found' });
        break;
    }
  }, [location]);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });

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
        dispatch({ type: todoActions.loadTodos, records: result.records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error });
      }
    };
    fetchTodos();
  }, [sortField, sortDirection, queryString]);

  const addTodo = async (newTodoTitle) => {
    await APIFetch('POST', { title: newTodoTitle, isCompleted: false }, null);
  };

  const updateTodo = async (editedTodo) => {
    await APIFetch('PATCH', editedTodo);
  };

  function completeTodo(todoId) {
    const todo = todoState.todoList.find((todo) => todo.id === todoId);
    if (todo) {
      todo.isCompleted = !todo.isCompleted;
      updateTodo(todo);
    }
  }

  async function APIFetch(method, todo) {
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

    let originalTodo = null;
    if (method === 'PATCH') {
      originalTodo = todoState.todoList.find((x) => x.id === todo.id);
    }
    try {
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      const { records } = await resp.json();
      switch (method) {
        case 'POST':
          dispatch({ type: todoActions.addTodo, records: records });
          break;
        case 'PATCH':
          dispatch({ type: todoActions.updateTodo, records: records });
          break;
      }
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
      dispatch({ type: todoActions.revertTodo, originalTodo: originalTodo });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }
  return (
    <div className={styles['content']}>
      <Header title={todoState.pathName} />
      <div className={styles['container']}>
        <Routes>
          <Route
            path="/"
            element={
              <TodosPage
                todoState={todoState}
                addTodo={addTodo}
                completeTodo={completeTodo}
                updateTodo={updateTodo}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                sortField={sortField}
                setSortField={setSortField}
                queryString={queryString}
                setQueryString={setQueryString}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>

        {todoState.errorMessage !== '' ? (
          <div className={styles['error-container']}>
            <p>{todoState.errorMessage}</p>
            <button
              type="button"
              onClick={() => dispatch({ type: todoActions.clearError })}
            >
              Dismiss
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
