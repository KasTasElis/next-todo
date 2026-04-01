"use client";

import { deleteTodo } from "./actions";

export default function DeleteTodoButton({ todoId }: { todoId: number }) {
  return (
    <button onClick={() => deleteTodo(todoId)} className="hover:opacity-75">
      🗑️
    </button>
  );
}
