import React from "react";

import "./App.css";
const AppContext = React.createContext();
AppContext.displayName = "Alex";

const initialState = [];

function reducer(prevState, action) {
  switch (action.type) {
    case "ADD":
      return [
        ...prevState,
        { id: Date.now(), text: action.text, completed: false },
      ];

    case "TOGGLE":
      return prevState.map((i) => {
        if (i.id === action.id) {
          return { ...i, completed: !i.completed };
        } else {
          return i;
        }
      });

    // case "ALL":
    //   return prevState;

    // case "COMPLETED":
    //   return prevState.filter((i) => i.completed);

    default:
      return prevState;
  }
}

function TodoForm() {
  const { actions } = React.useContext(AppContext);
  const input = React.useRef();
  return (
    <div>
      <input autoFocus id="t" ref={input} type="text" />
      <button
        onClick={() => {
          actions.add(input.current.value);
          input.current.value = "";
          input.current.focus();
        }}
      >
        Add
      </button>
    </div>
  );
}

function getVisible(todos, filter) {
  switch (filter) {
    case "ALL":
      return todos;

    case "COMPLETED":
      return todos.filter((i) => i.completed);
    default:
      return todos;
  }
}

function TodoList() {
  const { todos, actions } = React.useContext(AppContext);
  const [filter, setFilter] = React.useState();
  const visibleTodos = getVisible(todos, filter);

  console.log(visibleTodos);

  return (
    <div>
      <ul style={{ textAlign: "left" }}>
        {visibleTodos && visibleTodos.length ? (
          visibleTodos.map((i) => (
            <li onClick={() => actions.toggle(i.id)} key={i.id}>
              <span>{i.completed ? "☒" : "☐"}</span>
              {i.text}
            </li>
          ))
        ) : (
          <li>sem todos</li>
        )}
      </ul>
      <button onClick={() => setFilter("ALL")}>all</button>
      <button onClick={() => setFilter("COMPLETED")}>completed</button>
    </div>
  );
}

function App() {
  const [todos, dispatch] = React.useReducer(reducer, initialState);

  const actions = React.useMemo(
    () => ({
      add(text) {
        dispatch({ type: "ADD", text });
      },
      toggle(id) {
        dispatch({ type: "TOGGLE", id });
      },
      all() {
        dispatch({ type: "ALL" });
      },
      completed() {
        dispatch({ type: "COMPLETED" });
      },
    }),
    []
  );

  return (
    <AppContext.Provider value={{ todos, actions }}>
      <div className="App">
        <div className="App-header">
          <TodoForm />
          <TodoList />
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
