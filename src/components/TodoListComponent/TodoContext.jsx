import React, { createContext, useContext, useReducer, useEffect } from 'react';
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
function todoReducer(state, action) {
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
        title: action.payload.trim(),
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
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// Create contexts
const TodoStateContext = createContext();
const TodoDispatchContext = createContext();

// Custom hooks to use the contexts
export function useTodoState() {
  const context = useContext(TodoStateContext);
  if (context === undefined) {
    throw new Error('useTodoState must be used within a TodoProvider');
  }
  return context;
}

export function useTodoDispatch() {
  const context = useContext(TodoDispatchContext);
  if (context === undefined) {
    throw new Error('useTodoDispatch must be used within a TodoProvider');
  }
  return context;
}

// Computed values hook
export function useTodoComputed() {
  const state = useTodoState();
  
  const getFilteredTodos = () => {
    const { todolist, filter } = state;
    
    if (filter === 'pending') {
      return todolist.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      return todolist.filter(todo => todo.completed);
    }
    return todolist;
  };

  const getTodoStats = () => {
    const { todolist } = state;
    const total = todolist.length;
    const completed = todolist.filter(todo => todo.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  return {
    filteredTodos: getFilteredTodos(),
    todoStats: getTodoStats()
  };
}

// Provider component
export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Update document title when todolist changes
  useEffect(() => {
    const pendingCount = state.todolist.filter(todo => !todo.completed).length;
    document.title = pendingCount > 0 
      ? `Todo App (${pendingCount} pending)` 
      : 'Todo App';

    // Cleanup function
    return () => {
      document.title = 'Todo App';
    };
  }, [state.todolist]);

  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}