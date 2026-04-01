"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { AddTodoActionState } from "./AddTodoForm";
import * as z from "zod";

const CreateTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

const getSupabase = () => createClient(cookies());

const sortByTime = <
  T extends { updated_at: string | null; created_at: string },
>(
  todos: T[] | null | undefined,
) =>
  todos?.sort(
    (a, b) =>
      new Date(b.updated_at ?? b.created_at).getTime() -
      new Date(a.updated_at ?? a.created_at).getTime(),
  );

const validateTodoTitle = (
  formData: FormData,
): { ok: true; title: string } | { ok: false; result: AddTodoActionState } => {
  const parsed = CreateTodoSchema.safeParse({ title: formData.get("title") });
  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    console.log("Error: ", tree.errors[0]);
    return {
      ok: false,
      result: { message: "Zod validation error", resetForm: false },
    };
  }
  return { ok: true, title: parsed.data.title };
};

export const createTodoNew = async (title: string) => {
  const parsed = CreateTodoSchema.safeParse({ title: 123 });
  if (!parsed.success) {
    console.error("ZOD validation failed:", parsed.error.issues[0].message);
    return { error: "BE validation rejected entry." };
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("todos").insert({ title });

    if (error) {
      console.error("Supabase insert failed:", error);
      return { error: "Supabase rejected entry." };
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return { error: "Something went wrong." };
  }

  revalidatePath("/");
};

export const createTodo = async (
  _prevState: AddTodoActionState,
  formData: FormData,
) => {
  const validation = validateTodoTitle(formData);
  if (!validation.ok) return validation.result;

  const supabase = getSupabase();
  const { error } = await supabase
    .from("todos")
    .insert({ title: validation.title });

  if (error) {
    console.error("Add todo failed: ", error);
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
  const validation = validateTodoTitle(formData);
  if (!validation.ok) return validation.result;

  const supabase = getSupabase();
  const updatedAt = new Date().toISOString();

  const { error } = await supabase
    .from("todos")
    .update({ title: validation.title, updated_at: updatedAt })
    .eq("id", todoId);

  if (error) {
    console.error("Updating todo failed: ", error);
    return { message: "Error happened: " + error, resetForm: false };
  }

  revalidatePath("/");
  return { message: "Updated todo!", resetForm: true };
};

export const getTodos = async () => {
  const { data: todos } = await getSupabase()
    .from("todos")
    .select()
    .eq("done", false);
  return sortByTime(todos);
};

export const getCompletedTodos = async () => {
  const { data: todos } = await getSupabase()
    .from("todos")
    .select()
    .eq("done", true);
  return sortByTime(todos);
};

export const setTodoDone = async (id: number, done: boolean) => {
  const { error } = await getSupabase()
    .from("todos")
    .update({ done, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Updating todo done state failed: ", error);
  }

  revalidatePath("/");
};

export const deleteTodo = async (id: number) => {
  const { error } = await getSupabase().from("todos").delete().eq("id", id);

  if (error) {
    console.error("Delete todo failed: ", error);
  }

  revalidatePath("/");
};

export const getImage = async (img: string) => {
  const {
    data: { publicUrl },
  } = await getSupabase().storage.from("tasks").getPublicUrl(img);

  return publicUrl;
};
