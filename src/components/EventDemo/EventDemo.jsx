import React, { useState } from "react";
/* 
    <div onclick="function()"></div>

    camelcase onClick
    skewercase on-click
*/

/* const foo = () => {
    return 1;
}; */
//typeof

//console.log(typeof foo, typeof foo()); //1. function 2. number

/* 
    event propagation:
        bubbling
        capturing

*/

const list = ["Adam", "John", "Eric", "Smith"];

/* const foo = () => {
    let count = 1;
    count++;
    return count;
};

let count1 = foo();
let count2 = foo();
console.log("count", count1, count2); */

//render

//what type of data is useState
/* 
    function:
        argument: number, 
        return value: array, with likely at least 2 elements
*/
/* 
    prim, 
    non-prim: object, array, function


*/

/* 

abc(): abc is function
abc.def: abc is object
abc[def]: abc is array, object
*/

//immutable
/* let a = 1;
let b = a + 1;
console.log(b); */

/* 
    
    render: state change, props change


    trigger: initial render, state change
    render: call the component, (virtual dom)
    commit: change the dom, based on (virtual dom)
*/

/* 
    react 
*/

const EventDemo = ({ onClickButton }) => {
    // current value, setter function
    const [count, setCount] = useState(0);

    console.log(
        "event demo component is rendering",
        count, //from react component,1
        document.querySelector("#count-span")?.innerHTML //from dom, 0
    );

    /* const handleClick = () => alert("the button is clicked"); */
    const handleParentClick = () => {
        console.log("parent div is clicked");
    };

    const handleIncrement = () => {
        setCount(count + 1);
    };
    return (
        <div /* onClick={handleParentClick} */>
            {list.map((name) => {
                return (
                    <button
                        key={name}
                        onClick={() => {
                            onClickButton(name);
                        }}
                    >
                        {name}
                    </button>
                );
            })}
            <div>
                <span id="count-span">{count}</span>
                <button onClick={handleIncrement}>increment</button>
            </div>
        </div>
    );
};

export default EventDemo;
