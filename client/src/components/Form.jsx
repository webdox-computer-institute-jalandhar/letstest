import { useState } from "react";

export default function Form({ addTodo }) {
  const [inputValue, setInputValue] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const title = inputValue.trim();
    if (!title) return;

    await addTodo({ title, completed: false });
    setInputValue("");
  };

  return (
    <form className="ui form" onSubmit={handleFormSubmit}>
      <div className="ui grid center aligned">
        <div className="row">
          <div className="column five wide">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              type="text"
              placeholder="Enter To Do ..."
            />
          </div>
          <div className="column one wide">
            <button type="submit" className="ui button circular icon green">
              <i className="white plus icon" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
