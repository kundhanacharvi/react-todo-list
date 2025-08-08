import { useState } from "react";
import { Provider } from 'react-redux';
import store from './components/TodoListComponent/store';
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import EventDemo from "./components/EventDemo/EventDemo";
import Counter from "./components/Counter/Counter";
import TodoList from "./components/TodoListComponent/Todolist";

function App() {
  const handleClick = (name) => {
    console.log("child button is clicked", name);
  };

  return (
    <>
      {/* <EventDemo onClickButton={handleClick} /> */}
      {/* <Counter /> */}
      <Provider store={store}>
        <TodoList />
      </Provider>
    </>
  );
}

export default App;