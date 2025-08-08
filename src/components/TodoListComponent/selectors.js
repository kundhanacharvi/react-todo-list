// Selectors for computed values
export const getFilteredTodos = (state) => {
    const { todolist, filter } = state;
    
    if (filter === 'pending') {
      return todolist.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      return todolist.filter(todo => todo.completed);
    }
    return todolist;
  };
  
  export const getTodoStats = (state) => {
    const { todolist } = state;
    const total = todolist.length;
    const completed = todolist.filter(todo => todo.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };
  
  export const getInputValue = (state) => state.inputValue;
  export const getEditingId = (state) => state.editingId;
  export const getEditValue = (state) => state.editValue;
  export const getFilter = (state) => state.filter;
  export const getTodoList = (state) => state.todolist;