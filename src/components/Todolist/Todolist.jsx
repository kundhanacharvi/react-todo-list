import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

/* 
    controlled component
        2 way data binding
    uncontrolled component

    spread operator: make shallow copy of existing array by creating a new array
*/

const arr = [1, [2, 3]];
const arr1 = [...arr];
//structuredClone
const arr2 = structuredClone(arr); // deep copy
//const arr2 = JSON.parse(JSON.stringify(arr)) // deep copy
console.log(arr[1] === arr1[1], arr[1] === arr2[1]); //true, shallow

const Todolist = () => {
    const [inputValue, setInputValue] = useState("");
    const [todolist, setTodolist] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");

    const handleChange = (event) => {
        //synthetic event: cross platform compatibility
        console.log("event", event, event.target.value);
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        if (inputValue.trim() === "") return; // Prevent empty todos
        
        const newTodoItem = { id: uuidv4(), title: inputValue };
        const newTodolist = [...todolist];
        newTodolist.push(newTodoItem);
        setTodolist(newTodolist);
        setInputValue("");
    };

    const handleDelete = (id) => {
        //filter: callback,
        //splice: index,
        const filteredList = todolist.filter((todo) => todo.id !== id);
        setTodolist(filteredList);
    };

    const handleEdit = (id, currentTitle) => {
        setEditingId(id);
        setEditValue(currentTitle);
    };
    
    const handleSave = (id) => {
        if (editValue.trim() === "") return; // Prevent empty todos
        
        const updatedTodolist = todolist.map((todo) =>
            todo.id === id ? { ...todo, title: editValue } : todo
        );
        setTodolist(updatedTodolist);
        setEditingId(null);
        setEditValue("");
    };
    
    const handleCancel = () => {
        setEditingId(null);
        setEditValue("");
    };
    
    const handleEditChange = (event) => {
        setEditValue(event.target.value);
    };
    
    const handleKeyPress = (event, id) => {
        if (event.key === "Enter") {
            handleSave(id);
        } else if (event.key === "Escape") {
            handleCancel();
        }
    };

    return (
        <div>
            <div>
                <input 
                    id="123" 
                    value={inputValue} 
                    onChange={handleChange}
                    placeholder="Enter a new todo..."
                />
                <button onClick={handleSubmit}>submit</button>
            </div>
            <div>
                <ul>
                    {todolist.map((item) => (
                        <li key={item.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {editingId === item.id ? (
                                // Edit mode
                                <>
                                    <input
                                        value={editValue}
                                        onChange={handleEditChange}
                                        onKeyDown={(e) => handleKeyPress(e, item.id)}
                                        autoFocus
                                        style={{ flex: 1 }}
                                    />
                                    <button onClick={() => handleSave(item.id)}>Save</button>
                                    <button onClick={handleCancel}>Cancel</button>
                                </>
                            ) : (
                                // Display mode
                                <>
                                    <span style={{ flex: 1 }}>{item.title}</span>
                                    <button onClick={() => handleEdit(item.id, item.title)}>Edit</button>
                                    <button onClick={() => handleDelete(item.id)}>delete</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Todolist;