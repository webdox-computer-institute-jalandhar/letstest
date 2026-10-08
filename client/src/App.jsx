import { useEffect, useState } from "react";
import todos from "./apis";
import Form from "./components/Form";
import Section from "./components/Sections";
import List from "./components/List";

const appTitle = "To-Do App";

export default function App() {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await todos.get("/todos");
        setTodoList(data);
      } catch (err) {
        console.error(err);
        setError("Could not load todos. Make sure the Express API is running.");
      }
    }

    fetchData();
  }, []);

  const addTodo = async (item) => {
    const { data } = await todos.post("/todos", item);
    setTodoList((oldList) => [...oldList, data]);
  };

  const removeTodo = async (id) => {
    await todos.delete(`/todos/${id}`);
    setTodoList((oldList) => oldList.filter((item) => item.id !== id));
  };

  const editTodo = async (id, item) => {
    const { data } = await todos.put(`/todos/${id}`, item);
    setTodoList((oldList) =>
      oldList.map((todo) => (todo.id === id ? data : todo))
    );
  };

  return (
    <div className="ui container center aligned">
      <Section>
        <h1>{appTitle}</h1>
      </Section>
      <Section>
        <Form addTodo={addTodo} />
        {error && <div className="ui negative message">{error}</div>}
      </Section>
      <Section>
        <List
          editTodoListProp={editTodo}
          removeTodoListProp={removeTodo}
          list={todoList}
        />
      </Section>
    </div>
  );
}
