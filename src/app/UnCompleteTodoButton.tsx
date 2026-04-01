"use client";

import { unCompleteTodo } from "./actions";

export const UnCompleteTodoButton = ({ todoId }: { todoId: number }) => {
  return (
    <button onClick={() => unCompleteTodo(todoId)} className="hover:opacity-75">
      ↩️
    </button>
  );
};
