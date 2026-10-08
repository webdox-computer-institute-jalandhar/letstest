import Todo from "./Todo";

export default function List({ list, removeTodoListProp, editTodoListProp }) {
  return (
    <div>
      {list.map((item) => (
        <Todo
          key={item.id}
          title={item.title}
          completed={item.completed}
          removeTodoItemProp={() => removeTodoListProp(item.id)}
          editTodoItemProp={(updatedItem) => editTodoListProp(item.id, updatedItem)}
        />
      ))}
    </div>
  );
}
