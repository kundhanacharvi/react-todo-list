import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import EventDemo from "./components/EventDemo/EventDemo";
import Counter from "./components/Counter/Counter";
import Todolist from "./components/Todolist/Todolist";
//auto complete
function App() {
    //const [count, setCount] = useState(0);
    const handleClick = (name) => {
        console.log("child button is clicked", name);
    };
    return (
        <>
            {/* <EventDemo onClickButton={handleClick} /> */}
            {/* <Counter /> */}
            <Todolist />
        </>
    );
}

export default App;
