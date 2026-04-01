"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { AddTodoActionState } from "./AddTodoForm";
import * as z from "zod";

const CreateTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const createTodo = async (
  _prevState: AddTodoActionState,
  formData: FormData,
) => {
  // No type safety... ?
  const title = formData.get("title");
  console.log(title);

  const parsed = CreateTodoSchema.safeParse({
    title: formData.get("title"),
  });

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);

    console.log("Error: ", tree.errors[0]);
    return { message: "Zod validation error", resetForm: false };
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("todos")
    .insert({ title: parsed.data.title });

  if (error) {
    console.error("Add todo failed: ", error);
    // again, no type safety?
    return { message: "Error happened: " + error, resetForm: false };
  }

  revalidatePath("/");
  return { message: "Added todo!", resetForm: true };
};

export const updateTodo = async (
  todoId: number,
  _prevState: AddTodoActionState,
  formData: FormData,
) => {
  const parsed = CreateTodoSchema.safeParse({
    title: formData.get("title"),
  });

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);

    console.log("Error: ", tree.errors[0]);
    return { message: "Zod validation error", resetForm: false };
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const updatedAt = new Date().toISOString();

  const { error } = await supabase
    .from("todos")
    .update({ title: parsed.data.title, updated_at: updatedAt })
    .eq("id", todoId);

  if (error) {
    console.error("Updating todo failed: ", error);
    // again, no type safety?
    return { message: "Error happened: " + error, resetForm: false };
  }

  revalidatePath("/");
  return { message: "Updated todo!", resetForm: true };
};

export const getTodos = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase
    .from("todos")
    .select()
    .eq("done", false);

  return todos?.sort((a, b) => {
    const aTime = new Date(a.updated_at ?? a.created_at).getTime();
    const bTime = new Date(b.updated_at ?? b.created_at).getTime();
    return bTime - aTime;
  });
};

export const getCompletedTodos = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase
    .from("todos")
    .select()
    .eq("done", true);

  return todos?.sort((a, b) => {
    const aTime = new Date(a.updated_at ?? a.created_at).getTime();
    const bTime = new Date(b.updated_at ?? b.created_at).getTime();
    return bTime - aTime;
  });
};

export const completeTodo = async (id: number) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const updatedAt = new Date().toISOString();

  const { error } = await supabase
    .from("todos")
    .update({ done: true, updated_at: updatedAt })
    .eq("id", id);

  if (error) {
    console.error("Completing todo failed: ", error);
  }

  revalidatePath("/");
};

export const unCompleteTodo = async (id: number) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const updatedAt = new Date().toISOString();

  const { error } = await supabase
    .from("todos")
    .update({ done: false, updated_at: updatedAt })
    .eq("id", id);

  if (error) {
    console.error("Undoing todo failed: ", error);
  }

  revalidatePath("/");
};

export const deleteTodo = async (id: number) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) {
    console.error("Delete todo failed: ", error);
  }

  revalidatePath("/");
};
