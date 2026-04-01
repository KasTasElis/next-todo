"use client";

import { setTodoDone } from "./actions";

export const CompleteTodoButton = ({ todoId }: { todoId: number }) => {
  return (
    <button onClick={() => setTodoDone(todoId, true)} className="hover:opacity-75">
      ✅
    </button>
  );
};
