"use client";

import { deleteTodo } from "./actions";

export default function DeleteTodoButton({ todoId }: { todoId: number }) {
  const handleDelete = async () => {
    const result = await deleteTodo(todoId);
    if (result?.error) alert(result.error);
  };

  return (
    <button onClick={handleDelete} className="hover:opacity-75">
      🗑️
    </button>
  );
}
