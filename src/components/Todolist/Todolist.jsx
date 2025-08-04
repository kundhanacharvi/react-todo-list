import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

/* 
    controlled component
        2 way data binding
    uncontrolled component

    spread operator: make shallow copy of existing array by creating a new array
*/

// const arr = [1, [2, 3]];
// const arr1 = [...arr];
// //structuredClone
// const arr2 = structuredClone(arr); // deep copy
// //const arr2 = JSON.parse(JSON.stringify(arr)) // deep copy
// console.log(arr[1] === arr1[1], arr[1] === arr2[1]); //true, shallow

const Todolist = () => {
    // useState - Core state management
    const [inputValue, setInputValue] = useState("");
    const [todolist, setTodolist] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [filter, setFilter] = useState("all"); // all, pending, completed

    // useRef - DOM references
    const inputRef = useRef(null);
    const editInputRef = useRef(null);

    // useEffect - Side effects and lifecycle management
    useEffect(() => {
        // Focus main input on component mount
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        // Focus edit input when entering edit mode
        if (editingId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingId]);

    useEffect(() => {
        // Update document title with pending count
        const pendingCount = todolist.filter(todo => !todo.completed).length;
        document.title = pendingCount > 0 ? `Todo App (${pendingCount} pending)` : 'Todo App';
        
        // Cleanup function
        return () => {
            document.title = "Todo App";
        };
    }, [todolist]);

    // useCallback - Memoized functions
    const handleChange = useCallback((event) => {
        setInputValue(event.target.value);
    }, []);

    const handleSubmit = useCallback(() => {
        if (inputValue.trim() === "") return;
        
        const newTodoItem = { 
            id: uuidv4(), 
            title: inputValue.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        setTodolist(prev => [...prev, newTodoItem]);
        setInputValue("");
    }, [inputValue]);

    const handleDelete = useCallback((id) => {
        setTodolist(prev => prev.filter((todo) => todo.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setEditValue("");
        }
    }, [editingId]);

    const handleToggleComplete = useCallback((id) => {
        setTodolist(prev => prev.map(todo => 
            todo.id === id 
                ? { ...todo, completed: !todo.completed }
                : todo
        ));
    }, []);

    const handleEdit = useCallback((id, currentTitle) => {
        setEditingId(id);
        setEditValue(currentTitle);
    }, []);
    
    const handleSave = useCallback((id) => {
        if (editValue.trim() === "") return;
        
        setTodolist(prev => prev.map(todo =>
            todo.id === id ? { ...todo, title: editValue.trim() } : todo
        ));
        setEditingId(null);
        setEditValue("");
    }, [editValue]);
    
    const handleCancel = useCallback(() => {
        setEditingId(null);
        setEditValue("");
    }, []);
    
    const handleEditChange = useCallback((event) => {
        setEditValue(event.target.value);
    }, []);
    
    const handleKeyPress = useCallback((event, id) => {
        if (event.key === "Enter") {
            handleSave(id);
        } else if (event.key === "Escape") {
            handleCancel();
        }
    }, [handleSave, handleCancel]);

    const clearCompleted = useCallback(() => {
        setTodolist(prev => prev.filter(todo => !todo.completed));
    }, []);

    const markAllComplete = useCallback(() => {
        setTodolist(prev => prev.map(todo => ({
            ...todo,
            completed: true
        })));
    }, []);

    // useMemo - Computed values
    const filteredTodos = useMemo(() => {
        if (filter === "pending") {
            return todolist.filter(todo => !todo.completed);
        } else if (filter === "completed") {
            return todolist.filter(todo => todo.completed);
        }
        return todolist;
    }, [todolist, filter]);

    const todoStats = useMemo(() => {
        const total = todolist.length;
        const completed = todolist.filter(todo => todo.completed).length;
        const pending = total - completed;
        return { total, completed, pending };
    }, [todolist]);

    return (
        <div>
            <h2>Todo List</h2>

            {/* Stats */}
            <div>
                <p>Total: {todoStats.total} | Completed: {todoStats.completed} | Pending: {todoStats.pending}</p>
            </div>

            {/* Add Todo */}
            <div>
                <input 
                    ref={inputRef}
                    value={inputValue} 
                    onChange={handleChange}
                    placeholder="Enter a new todo..."
                />
                <button onClick={handleSubmit}>Add</button>
            </div>

            {/* Filter Buttons */}
            <div style={{ margin: '10px 0' }}>
                <button 
                    onClick={() => setFilter("all")}
                    style={{ marginRight: '5px', fontWeight: filter === "all" ? 'bold' : 'normal' }}
                >
                    All ({todoStats.total})
                </button>
                <button 
                    onClick={() => setFilter("pending")}
                    style={{ marginRight: '5px', fontWeight: filter === "pending" ? 'bold' : 'normal' }}
                >
                    Pending ({todoStats.pending})
                </button>
                <button 
                    onClick={() => setFilter("completed")}
                    style={{ marginRight: '5px', fontWeight: filter === "completed" ? 'bold' : 'normal' }}
                >
                    Completed ({todoStats.completed})
                </button>
            </div>

            {/* Bulk Actions */}
            {todolist.length > 0 && (
                <div style={{ margin: '10px 0' }}>
                    {todoStats.pending > 0 && (
                        <button onClick={markAllComplete} style={{ marginRight: '5px' }}>
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
                        <li key={item.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
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
};

export default Todolist;