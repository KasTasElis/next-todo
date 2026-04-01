"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CompleteTodoButton } from "./CompleteTodoButton";
import { timeAgo } from "@/utils/dates";
import { useFormState } from "react-dom";
import { updateTodo } from "./actions";

import { Database } from "@/types/database.types";
type Todo = Database["public"]["Tables"]["todos"]["Row"];

const EditTodoForm = ({
  todo,
  onCancel,
  onSuccess,
}: {
  todo: Todo;
  onCancel: () => void;
  onSuccess: () => void;
}) => {
  const updateTodoWithId = updateTodo.bind(null, todo.id);

  const [state, formAction] = useFormState(updateTodoWithId, {
    message: "",
    resetForm: false,
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.resetForm) {
      formRef.current?.reset();
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="flex gap-1">
      <input
        defaultValue={todo.title}
        type="text"
        placeholder="What do you want to do?"
        className="text-gray-900"
        name="title"
        required
        autoFocus
      />
      <button className="outline p-1">Done</button>
      <button onClick={onCancel} className="outline p-1">
        Cancel
      </button>
    </form>
  );
};

export const TodoItem = ({ todo }: { todo: Todo }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex gap-9">
      <div className="flex gap-4">
        <button onClick={() => setIsEditing(true)} className="hover:opacity-75">
          ✏️
        </button>
        <CompleteTodoButton todoId={todo.id} />
      </div>

      <div className="opacity-50">
        {timeAgo(todo.updated_at || todo.created_at)}
      </div>

      <div>
        {isEditing ? (
          <EditTodoForm
            todo={todo}
            onCancel={() => setIsEditing(false)}
            onSuccess={() => setIsEditing(false)}
          />
        ) : (
          todo.title
        )}
      </div>

      {todo.image_path && (
        <Image
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/tasks/${todo.image_path}`}
          alt={todo.title}
          width={100}
          height={100}
        />
      )}
    </div>
  );
};
