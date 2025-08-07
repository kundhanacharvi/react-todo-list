import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import EventDemo from "./components/EventDemo/EventDemo";
import Counter from "./components/Counter/Counter";
import TodoList from "./components/TodoListComponent/Todolist";
import { TodoProvider } from "./components/TodoListComponent/TodoContext";

function App() {
  const handleClick = (name) => {
    console.log("child button is clicked", name);
  };

  return (
    <>
      {/* <EventDemo onClickButton={handleClick} /> */}
      {/* <Counter /> */}
      <TodoProvider>
      <TodoList />
      </TodoProvider>
    </>
  );
}

export default App;