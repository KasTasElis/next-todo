import DeleteTodoButton from "./DeleteTodoButton";
import { AddTodoForm } from "./AddTodoForm";
import { getCompletedTodos, getTodos } from "./actions";
import { CompleteTodoButton } from "./CompleteTodoButton";
import { timeAgo } from "@/utils/dates";
import { UnCompleteTodoButton } from "./UnCompleteTodoButton";

export default async function Page() {
  const todos = await getTodos();
  const completedTodos = await getCompletedTodos();

  const todosJsx = (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id} className="flex gap-9">
          <div className="flex gap-4">
            <button className="hover:opacity-75">✏️</button>
            <CompleteTodoButton todoId={todo.id} />
          </div>

          <div className="opacity-50">
            {timeAgo(todo.updated_at || todo.created_at)}
          </div>

          <div>{todo.title}</div>
        </li>
      ))}
    </ul>
  );

  const completedTodosJsx = (
    <ul>
      {completedTodos?.map((todo) => (
        <li key={todo.id} className="flex gap-9">
          <div className="flex gap-4">
            <DeleteTodoButton todoId={todo.id} />
            <UnCompleteTodoButton todoId={todo.id} />
          </div>

          <div className="opacity-50">
            {timeAgo(todo.updated_at || todo.created_at)}
          </div>

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
        {completedTodos?.length ? completedTodosJsx : nothingToShowJsx}
      </div>
    </div>
  );
}
