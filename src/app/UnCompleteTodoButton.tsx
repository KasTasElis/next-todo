"use client";

import { setTodoDone } from "./actions";

export const UnCompleteTodoButton = ({ todoId }: { todoId: number }) => {
  return (
    <button onClick={() => setTodoDone(todoId, false)} className="hover:opacity-75">
      ↩️
    </button>
  );
};
