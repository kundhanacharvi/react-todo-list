import { createStore, applyMiddleware } from 'redux';
import { v4 as uuidv4 } from 'uuid';

// Action types
export const TODO_ACTIONS = {
  ADD_TODO: 'ADD_TODO',
  DELETE_TODO: 'DELETE_TODO',
  TOGGLE_COMPLETE: 'TOGGLE_COMPLETE',
  START_EDIT: 'START_EDIT',
  SAVE_EDIT: 'SAVE_EDIT',
  CANCEL_EDIT: 'CANCEL_EDIT',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
  MARK_ALL_COMPLETE: 'MARK_ALL_COMPLETE',
  SET_FILTER: 'SET_FILTER',
  SET_INPUT_VALUE: 'SET_INPUT_VALUE',
  SET_EDIT_VALUE: 'SET_EDIT_VALUE'
};

// Initial state
const initialState = {
  inputValue: '',
  todolist: [],
  editingId: null,
  editValue: '',
  filter: 'all' // all, pending, completed
};

// Reducer function
function todoReducer(state = initialState, action) {
  switch (action.type) {
    case TODO_ACTIONS.SET_INPUT_VALUE:
      return {
        ...state,
        inputValue: action.payload
      };

    case TODO_ACTIONS.ADD_TODO: {
      if (action.payload.trim() === '') return state;
      
      const newTodoItem = {
        id: uuidv4(),
        title: action.payload, // Title will be modified by middleware
        completed: false,
        createdAt: new Date().toISOString()
      };

      return {
        ...state,
        todolist: [...state.todolist, newTodoItem],
        inputValue: ''
      };
    }

    case TODO_ACTIONS.DELETE_TODO: {
      const newState = {
        ...state,
        todolist: state.todolist.filter(todo => todo.id !== action.payload)
      };

      // If we're deleting the item being edited, exit edit mode
      if (state.editingId === action.payload) {
        newState.editingId = null;
        newState.editValue = '';
      }

      return newState;
    }

    case TODO_ACTIONS.TOGGLE_COMPLETE:
      return {
        ...state,
        todolist: state.todolist.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };

    case TODO_ACTIONS.START_EDIT:
      return {
        ...state,
        editingId: action.payload.id,
        editValue: action.payload.currentTitle
      };

    case TODO_ACTIONS.SET_EDIT_VALUE:
      return {
        ...state,
        editValue: action.payload
      };

    case TODO_ACTIONS.SAVE_EDIT: {
      if (state.editValue.trim() === '') return state;

      return {
        ...state,
        todolist: state.todolist.map(todo =>
          todo.id === action.payload
            ? { ...todo, title: state.editValue.trim() }
            : todo
        ),
        editingId: null,
        editValue: ''
      };
    }

    case TODO_ACTIONS.CANCEL_EDIT:
      return {
        ...state,
        editingId: null,
        editValue: ''
      };

    case TODO_ACTIONS.CLEAR_COMPLETED:
      return {
        ...state,
        todolist: state.todolist.filter(todo => !todo.completed)
      };

    case TODO_ACTIONS.MARK_ALL_COMPLETE:
      return {
        ...state,
        todolist: state.todolist.map(todo => ({
          ...todo,
          completed: true
        }))
      };

    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: action.payload
      };

    default:
      return state;
  }
}

// Middleware to modify "add todo" action title
const addTodoTitleMiddleware = store => next => action => {
  if (action.type === TODO_ACTIONS.ADD_TODO) {
    const currentDate = new Date().toISOString().split('T')[0]; // Format: 2025-08-01
    const modifiedAction = {
      ...action,
      payload: `Added at ${currentDate}: ${action.payload.trim()}`
    };
    return next(modifiedAction);
  }
  return next(action);
};

// Store enhancer to log the time it takes to process actions
const performanceLoggerEnhancer = createStore => (reducer, initialState, enhancer) => {
  const store = createStore(reducer, initialState, enhancer);
  
  const originalDispatch = store.dispatch;
  
  store.dispatch = (action) => {
    const startTime = performance.now();
    const result = originalDispatch(action);
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    console.log(`Action: ${action.type}`);
    console.log(`Execution time: ${executionTime.toFixed(3)}ms`);
    console.log('---');
    
    return result;
  };
  
  return store;
};

// Create store with middleware and enhancer
const store = createStore(
  todoReducer,
  performanceLoggerEnhancer(
    applyMiddleware(addTodoTitleMiddleware)
  )
);

export default store;