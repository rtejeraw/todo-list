const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
};

const actions = {
  // actions in useEffect that loads todos
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  // found in useEffect and addTodo to handle failed requests
  setLoadError: 'setLoadError',
  // actions found in addTodo
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  // found in helper functions
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  // reverts todos when requests fail
  revertTodo: 'revertTodo',
  // action on Dismiss Error button
  clearError: 'clearError',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return { ...state, isLoading: true };
    case actions.loadTodos: {
      const todos = action.records.map((record) => {
        const todo = {
          id: record.id,
          ...record.fields,
        };

        if (!todo.isCompleted) {
          todo.isCompleted = false;
        }
        return todo;
      });
      return { ...state, todoList: todos, isLoading: false };
    }
    case actions.setLoadError:
      return { ...state, isLoading: false, errorMessage: action.error.message };
    case actions.clearError:
      return { ...state, errorMessage: '' };
    case actions.startRequest:
      return { ...state, isSaving: true };
    case actions.endRequest:
      return { ...state, isLoading: false, isSaving: false };
    case actions.addTodo: {
      let savedTodo = {
        id: action.records[0].id,
        ...action.records[0].fields,
      };
      if (!action.records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    }
    case actions.updateTodo: {
      let savedTodo = {
        id: action.records[0].id,
        ...action.records[0].fields,
      };
      if (!action.records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === savedTodo.id ? savedTodo : todo
        ),
        isSaving: false,
      };
    }
    case actions.revertTodo: {
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.originalTodo.id ? action.originalTodo : todo
        ),
        isSaving: false,
      };
    }
    default:
      return state;
  }
}

export { reducer, initialState, actions };
