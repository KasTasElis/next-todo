import DeleteTodoButton from "./DeleteTodoButton";
import { AddTodoForm } from "./AddTodoForm";
import { getTodos } from "./actions";

export default async function Page() {
  const todos = await getTodos();

  const todosJsx = (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id} className="flex gap-9">
          <div className="flex gap-4">
            <button className="hover:opacity-75">✏️</button>
            <DeleteTodoButton todoId={todo.id} />
            <button className="hover:opacity-75">✅</button>
          </div>

          <div className="opacity-50">{todo.created_at}</div>

          <div>{todo.title}</div>
        </li>
      ))}
    </ul>
  );

  const nothingToShowJsx = <div>Nothing to show...</div>;

  return (
    <div>
      <div className="p-7">
        <AddTodoForm />
      </div>
      <div className="p-7">
        <h3 className="text-xl mb-5">⏳ Todo:</h3>
        {todos?.length ? todosJsx : nothingToShowJsx}
      </div>

      <div className="p-7">
        <h3 className="text-xl mb-5">✅ Completed:</h3>
        <ul>
          {todos?.map((todo) => (
            <li key={todo.id} className="flex gap-9">
              <div className="flex gap-4">
                <button className="hover:opacity-75">🗑️</button>
                <button className="hover:opacity-75">↩️</button>
              </div>

              <div className="opacity-50">{todo.created_at}</div>

              <div>{todo.title}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
