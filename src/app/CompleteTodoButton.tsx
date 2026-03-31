"use client";

import { completeTodo } from "./actions";

export const CompleteTodoButton = ({ todoId }: { todoId: string }) => {
  return (
    <button onClick={() => completeTodo(todoId)} className="hover:opacity-75">
      ✅
    </button>
  );
};
