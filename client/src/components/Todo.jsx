import { useState } from "react";

export default function Todo({ title, completed, removeTodoItemProp, editTodoItemProp }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [tempValue, setTempValue] = useState(title);
  const [completedState, setCompleted] = useState(completed);

  const saveTitle = async () => {
    const nextTitle = tempValue.trim();
    if (!nextTitle) return;
    await editTodoItemProp({ title: nextTitle });
    setValue(nextTitle);
    setIsEditing(false);
  };

  const handleInputKeyDown = async (e) => {
    if (e.key === "Enter") {
      await saveTitle();
    } else if (e.key === "Escape") {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  const handleButtonClick = async () => {
    const newState = !completedState;
    await editTodoItemProp({ completed: newState });
    setCompleted(newState);
  };

  return (
    <div className="row">
      {isEditing ? (
        <div className="column seven wide">
          <div className="ui input fluid">
            <input
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onBlur={saveTitle}
              autoFocus
              value={tempValue}
            />
          </div>
        </div>
      ) : (
        <div className="ui grid center aligned">
          <div className="column five wide" onDoubleClick={() => setIsEditing(true)}>
            <h2 className={`ui header${completedState ? " green" : ""}`}>{value}</h2>
          </div>

          <div className="column one wide">
            <button
              className={`ui button circular icon${completedState ? " blue" : " green"}`}
              onClick={handleButtonClick}
            >
              <i className="white check icon" />
            </button>
          </div>

          <div className="column one wide">
            <button className="ui button circular icon red" onClick={removeTodoItemProp}>
              <i className="white remove icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
