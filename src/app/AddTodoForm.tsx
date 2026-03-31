"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createTodo } from "./actions";

const initialState = {
  message: "",
};

const SubmitBtn = () => {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit" className="p-5 outline">
      {pending ? "Loading..." : "Add"}
    </button>
  );
};

export const AddTodoForm = () => {
  // i could pass a reset callback
  const [state, formAction] = useFormState(createTodo, initialState);

  return (
    <form action={formAction}>
      <input
        className="p-5 text-pink-900 w-[500px]"
        type="text"
        placeholder="What do i need to do? "
        required
        name="title"
      />
      <SubmitBtn />
      <div className="p-3">BE message: {state.message}</div>
    </form>
  );
};
