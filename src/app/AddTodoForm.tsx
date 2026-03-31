"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createTodo } from "./actions";
import { useEffect, useRef } from "react";

const initialState = {
  message: "",
  resetForm: false,
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

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.resetForm) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction}>
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
