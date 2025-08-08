import { TODO_ACTIONS } from './store';

// Action creators
export const setInputValue = (value) => ({
  type: TODO_ACTIONS.SET_INPUT_VALUE,
  payload: value
});

export const addTodo = (title) => ({
  type: TODO_ACTIONS.ADD_TODO,
  payload: title
});

export const deleteTodo = (id) => ({
  type: TODO_ACTIONS.DELETE_TODO,
  payload: id
});

export const toggleComplete = (id) => ({
  type: TODO_ACTIONS.TOGGLE_COMPLETE,
  payload: id
});

export const startEdit = (id, currentTitle) => ({
  type: TODO_ACTIONS.START_EDIT,
  payload: { id, currentTitle }
});

export const setEditValue = (value) => ({
  type: TODO_ACTIONS.SET_EDIT_VALUE,
  payload: value
});

export const saveEdit = (id) => ({
  type: TODO_ACTIONS.SAVE_EDIT,
  payload: id
});

export const cancelEdit = () => ({
  type: TODO_ACTIONS.CANCEL_EDIT
});

export const clearCompleted = () => ({
  type: TODO_ACTIONS.CLEAR_COMPLETED
});

export const markAllComplete = () => ({
  type: TODO_ACTIONS.MARK_ALL_COMPLETE
});

export const setFilter = (filter) => ({
  type: TODO_ACTIONS.SET_FILTER,
  payload: filter
});