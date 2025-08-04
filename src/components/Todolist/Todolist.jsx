import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";

class Todolist extends Component {
    constructor(props) {
        super(props);
        
        // Class component state
        this.state = {
            inputValue: "",
            todolist: [],
            editingId: null,
            editValue: "",
            filter: "all" // all, pending, completed
        };

        // Create refs 
        this.inputRef = React.createRef();
        this.editInputRef = React.createRef();

        // Bind methods to this context
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleToggleComplete = this.handleToggleComplete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEditChange = this.handleEditChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.clearCompleted = this.clearCompleted.bind(this);
        this.markAllComplete = this.markAllComplete.bind(this);
        this.setFilter = this.setFilter.bind(this);
    }

    // Lifecycle method - equivalent to useEffect with empty dependency array
    componentDidMount() {
        // Focus main input on component mount
        if (this.inputRef.current) {
            this.inputRef.current.focus();
        }
        this.updateDocumentTitle();
    }

    // Lifecycle method - equivalent to useEffect with dependencies
    componentDidUpdate(prevProps, prevState) {
        // Focus edit input when entering edit mode
        if (this.state.editingId && this.state.editingId !== prevState.editingId) {
            if (this.editInputRef.current) {
                this.editInputRef.current.focus();
            }
        }

        // Update document title when todolist changes
        if (prevState.todolist !== this.state.todolist) {
            this.updateDocumentTitle();
        }
    }

    // Lifecycle method - equivalent to useEffect cleanup
    componentWillUnmount() {
        document.title = "Todo App";
    }

    // Helper method to update document title
    updateDocumentTitle() {
        const pendingCount = this.state.todolist.filter(todo => !todo.completed).length;
        document.title = pendingCount > 0 ? `Todo App (${pendingCount} pending)` : 'Todo App';
    }

    // Event handlers
    handleChange(event) {
        this.setState({ inputValue: event.target.value });
    }

    handleSubmit() {
        if (this.state.inputValue.trim() === "") return;
        
        const newTodoItem = { 
            id: uuidv4(), 
            title: this.state.inputValue.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.setState(prevState => ({
            todolist: [...prevState.todolist, newTodoItem],
            inputValue: ""
        }));
    }

    handleDelete(id) {
        this.setState(prevState => {
            const newState = {
                todolist: prevState.todolist.filter(todo => todo.id !== id)
            };
            
            // If we're deleting the item being edited, exit edit mode
            if (prevState.editingId === id) {
                newState.editingId = null;
                newState.editValue = "";
            }
            
            return newState;
        });
    }

    handleToggleComplete(id) {
        this.setState(prevState => ({
            todolist: prevState.todolist.map(todo => 
                todo.id === id 
                    ? { ...todo, completed: !todo.completed }
                    : todo
            )
        }));
    }

    handleEdit(id, currentTitle) {
        this.setState({
            editingId: id,
            editValue: currentTitle
        });
    }
    
    handleSave(id) {
        if (this.state.editValue.trim() === "") return;
        
        this.setState(prevState => ({
            todolist: prevState.todolist.map(todo =>
                todo.id === id ? { ...todo, title: prevState.editValue.trim() } : todo
            ),
            editingId: null,
            editValue: ""
        }));
    }
    
    handleCancel() {
        this.setState({
            editingId: null,
            editValue: ""
        });
    }
    
    handleEditChange(event) {
        this.setState({ editValue: event.target.value });
    }
    
    handleKeyPress(event, id) {
        if (event.key === "Enter") {
            this.handleSave(id);
        } else if (event.key === "Escape") {
            this.handleCancel();
        }
    }

    clearCompleted() {
        this.setState(prevState => ({
            todolist: prevState.todolist.filter(todo => !todo.completed)
        }));
    }

    markAllComplete() {
        this.setState(prevState => ({
            todolist: prevState.todolist.map(todo => ({
                ...todo,
                completed: true
            }))
        }));
    }

    setFilter(filter) {
        this.setState({ filter });
    }

    // Computed properties (equivalent to useMemo)
    getFilteredTodos() {
        const { todolist, filter } = this.state;
        
        if (filter === "pending") {
            return todolist.filter(todo => !todo.completed);
        } else if (filter === "completed") {
            return todolist.filter(todo => todo.completed);
        }
        return todolist;
    }

    getTodoStats() {
        const { todolist } = this.state;
        const total = todolist.length;
        const completed = todolist.filter(todo => todo.completed).length;
        const pending = total - completed;
        return { total, completed, pending };
    }

    render() {
        const { inputValue, editingId, editValue, filter } = this.state;
        const filteredTodos = this.getFilteredTodos();
        const todoStats = this.getTodoStats();

        return (
            <div>
                <h2>Todo List (Class Component)</h2>

                {/* Stats */}
                <div>
                    <p>Total: {todoStats.total} | Completed: {todoStats.completed} | Pending: {todoStats.pending}</p>
                </div>

                {/* Add Todo */}
                <div>
                    <input 
                        ref={this.inputRef}
                        value={inputValue} 
                        onChange={this.handleChange}
                        placeholder="Enter a new todo..."
                    />
                    <button onClick={this.handleSubmit}>Add</button>
                </div>

                {/* Filter Buttons */}
                <div style={{ margin: '10px 0' }}>
                    <button 
                        onClick={() => this.setFilter("all")}
                        style={{ marginRight: '5px', fontWeight: filter === "all" ? 'bold' : 'normal' }}
                    >
                        All ({todoStats.total})
                    </button>
                    <button 
                        onClick={() => this.setFilter("pending")}
                        style={{ marginRight: '5px', fontWeight: filter === "pending" ? 'bold' : 'normal' }}
                    >
                        Pending ({todoStats.pending})
                    </button>
                    <button 
                        onClick={() => this.setFilter("completed")}
                        style={{ marginRight: '5px', fontWeight: filter === "completed" ? 'bold' : 'normal' }}
                    >
                        Completed ({todoStats.completed})
                    </button>
                </div>

                {/* Bulk Actions */}
                {this.state.todolist.length > 0 && (
                    <div style={{ margin: '10px 0' }}>
                        {todoStats.pending > 0 && (
                            <button onClick={this.markAllComplete} style={{ marginRight: '5px' }}>
                                Mark All Complete
                            </button>
                        )}
                        {todoStats.completed > 0 && (
                            <button onClick={this.clearCompleted}>
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
                                    onChange={() => this.handleToggleComplete(item.id)}
                                />

                                {editingId === item.id ? (
                                    // Edit mode
                                    <>
                                        <input
                                            ref={this.editInputRef}
                                            value={editValue}
                                            onChange={this.handleEditChange}
                                            onKeyDown={(e) => this.handleKeyPress(e, item.id)}
                                            style={{ flex: 1 }}
                                        />
                                        <button onClick={() => this.handleSave(item.id)}>Save</button>
                                        <button onClick={this.handleCancel}>Cancel</button>
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
                                            onClick={() => this.handleEdit(item.id, item.title)}
                                            disabled={item.completed}
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => this.handleDelete(item.id)}>Delete</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>

                    {filteredTodos.length === 0 && this.state.todolist.length > 0 && (
                        <p>No {filter} todos</p>
                    )}

                    {this.state.todolist.length === 0 && (
                        <p>No todos yet. Add one above!</p>
                    )}
                </div>
            </div>
        );
    }
}

export default Todolist;