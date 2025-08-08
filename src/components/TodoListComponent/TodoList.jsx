import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setInputValue,
  addTodo,
  deleteTodo,
  toggleComplete,
  startEdit,
  setEditValue,
  saveEdit,
  cancelEdit,
  clearCompleted,
  markAllComplete,
  setFilter
} from './actions';
import {
  getFilteredTodos,
  getTodoStats,
  getInputValue,
  getEditingId,
  getEditValue,
  getFilter,
  getTodoList
} from './selectors';

function TodoList() {
  // Redux hooks
  const dispatch = useDispatch();
  const inputValue = useSelector(getInputValue);
  const editingId = useSelector(getEditingId);
  const editValue = useSelector(getEditValue);
  const filter = useSelector(getFilter);
  const todolist = useSelector(getTodoList);
  const filteredTodos = useSelector(getFilteredTodos);
  const todoStats = useSelector(getTodoStats);

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

  // Update document title when todolist changes
  useEffect(() => {
    const pendingCount = todolist.filter(todo => !todo.completed).length;
    document.title = pendingCount > 0 
      ? `Todo App (${pendingCount} pending)` 
      : 'Todo App';

    // Cleanup function
    return () => {
      document.title = 'Todo App';
    };
  }, [todolist]);

  // Event handlers
  const handleChange = (event) => {
    dispatch(setInputValue(event.target.value));
  };

  const handleSubmit = () => {
    if (inputValue.trim() === '') return;
    dispatch(addTodo(inputValue));
  };

  const handleDelete = (id) => {
    dispatch(deleteTodo(id));
  };

  const handleToggleComplete = (id) => {
    dispatch(toggleComplete(id));
  };

  const handleEdit = (id, currentTitle) => {
    dispatch(startEdit(id, currentTitle));
  };

  const handleSave = (id) => {
    if (editValue.trim() === '') return;
    dispatch(saveEdit(id));
  };

  const handleCancel = () => {
    dispatch(cancelEdit());
  };

  const handleEditChange = (event) => {
    dispatch(setEditValue(event.target.value));
  };

  const handleKeyPress = (event, id) => {
    if (event.key === 'Enter') {
      handleSave(id);
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const handleMarkAllComplete = () => {
    dispatch(markAllComplete());
  };

  const handleSetFilter = (filterType) => {
    dispatch(setFilter(filterType));
  };

  return (
    <div>
      <h2>Todo List (Redux Version)</h2>

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
          onClick={() => handleSetFilter('all')}
          style={{
            marginRight: '5px',
            fontWeight: filter === 'all' ? 'bold' : 'normal'
          }}
        >
          All ({todoStats.total})
        </button>
        <button
          onClick={() => handleSetFilter('pending')}
          style={{
            marginRight: '5px',
            fontWeight: filter === 'pending' ? 'bold' : 'normal'
          }}
        >
          Pending ({todoStats.pending})
        </button>
        <button
          onClick={() => handleSetFilter('completed')}
          style={{
            marginRight: '5px',
            fontWeight: filter === 'completed' ? 'bold' : 'normal'
          }}
        >
          Completed ({todoStats.completed})
        </button>
      </div>

      {/* Bulk Actions */}
      {todolist.length > 0 && (
        <div style={{ margin: '10px 0' }}>
          {todoStats.pending > 0 && (
            <button 
              onClick={handleMarkAllComplete} 
              style={{ marginRight: '5px' }}
            >
              Mark All Complete
            </button>
          )}
          {todoStats.completed > 0 && (
            <button onClick={handleClearCompleted}>
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

        {filteredTodos.length === 0 && todolist.length > 0 && (
          <p>No {filter} todos</p>
        )}

        {todolist.length === 0 && (
          <p>No todos yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}

export default TodoList;