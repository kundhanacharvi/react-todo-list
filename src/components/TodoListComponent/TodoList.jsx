import React, { useRef, useEffect } from 'react';
import { useTodoState, useTodoDispatch, useTodoComputed, TODO_ACTIONS } from './TodoContext';

function TodoList() {
  // Get state and dispatch from context
  const state = useTodoState();
  const dispatch = useTodoDispatch();
  const { filteredTodos, todoStats } = useTodoComputed();

  // Destructure state for easier access
  const { inputValue, editingId, editValue, filter } = state;

  // Create refs
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  // Focus main input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Focus edit input when entering edit mode
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  // Event handlers
  const handleChange = (event) => {
    dispatch({
      type: TODO_ACTIONS.SET_INPUT_VALUE,
      payload: event.target.value
    });
  };

  const handleSubmit = () => {
    dispatch({
      type: TODO_ACTIONS.ADD_TODO,
      payload: inputValue
    });
  };

  const handleDelete = (id) => {
    dispatch({
      type: TODO_ACTIONS.DELETE_TODO,
      payload: id
    });
  };

  const handleToggleComplete = (id) => {
    dispatch({
      type: TODO_ACTIONS.TOGGLE_COMPLETE,
      payload: id
    });
  };

  const handleEdit = (id, currentTitle) => {
    dispatch({
      type: TODO_ACTIONS.START_EDIT,
      payload: { id, currentTitle }
    });
  };

  const handleSave = (id) => {
    dispatch({
      type: TODO_ACTIONS.SAVE_EDIT,
      payload: id
    });
  };

  const handleCancel = () => {
    dispatch({
      type: TODO_ACTIONS.CANCEL_EDIT
    });
  };

  const handleEditChange = (event) => {
    dispatch({
      type: TODO_ACTIONS.SET_EDIT_VALUE,
      payload: event.target.value
    });
  };

  const handleKeyPress = (event, id) => {
    if (event.key === 'Enter') {
      handleSave(id);
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  const clearCompleted = () => {
    dispatch({
      type: TODO_ACTIONS.CLEAR_COMPLETED
    });
  };

  const markAllComplete = () => {
    dispatch({
      type: TODO_ACTIONS.MARK_ALL_COMPLETE
    });
  };

  const setFilter = (filterType) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: filterType
    });
  };

  return (
    <div>
      <h2>Todo List (Functional Component with Context)</h2>

      {/* Stats */}
      <div>
        <p>
          Total: {todoStats.total} | Completed: {todoStats.completed} | 
          Pending: {todoStats.pending}
        </p>
      </div>

      {/* Add Todo */}
      <div>
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter a new todo..."
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button onClick={handleSubmit}>Add</button>
      </div>

      {/* Filter Buttons */}
      <div style={{ margin: '10px 0' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            marginRight: '5px',
            fontWeight: filter === 'all' ? 'bold' : 'normal'
          }}
        >
          All ({todoStats.total})
        </button>
        <button
          onClick={() => setFilter('pending')}
          style={{
            marginRight: '5px',
            fontWeight: filter === 'pending' ? 'bold' : 'normal'
          }}
        >
          Pending ({todoStats.pending})
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{
            marginRight: '5px',
            fontWeight: filter === 'completed' ? 'bold' : 'normal'
          }}
        >
          Completed ({todoStats.completed})
        </button>
      </div>

      {/* Bulk Actions */}
      {state.todolist.length > 0 && (
        <div style={{ margin: '10px 0' }}>
          {todoStats.pending > 0 && (
            <button 
              onClick={markAllComplete} 
              style={{ marginRight: '5px' }}
            >
              Mark All Complete
            </button>
          )}
          {todoStats.completed > 0 && (
            <button onClick={clearCompleted}>
              Clear Completed
            </button>
          )}
        </div>
      )}

      {/* Todo List */}
      <div>
        <ul>
          {filteredTodos.map((item) => (
            <li 
              key={item.id} 
              style={{
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggleComplete(item.id)}
              />

              {editingId === item.id ? (
                // Edit mode
                <>
                  <input
                    ref={editInputRef}
                    value={editValue}
                    onChange={handleEditChange}
                    onKeyDown={(e) => handleKeyPress(e, item.id)}
                    style={{ flex: 1 }}
                  />
                  <button onClick={() => handleSave(item.id)}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </>
              ) : (
                // Display mode
                <>
                  <span
                    style={{
                      flex: 1,
                      textDecoration: item.completed ? 'line-through' : 'none',
                      opacity: item.completed ? 0.6 : 1
                    }}
                  >
                    {item.title}
                  </span>
                  <button
                    onClick={() => handleEdit(item.id, item.title)}
                    disabled={item.completed}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>

        {filteredTodos.length === 0 && state.todolist.length > 0 && (
          <p>No {filter} todos</p>
        )}

        {state.todolist.length === 0 && (
          <p>No todos yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}

export default TodoList;