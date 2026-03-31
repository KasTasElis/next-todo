"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const createTodo = async (prevState: any, formData: FormData) => {
  // No type safety... ?
  const title = formData.get("title");
  console.log(title);

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("todos").insert({ title });

  if (error) {
    console.error("Add todo failed: ", error);
    // again, no type safety?
    return { message: "Error happened: " + error, resetForm: false };
  }

  revalidatePath("/");
  return { message: "Added todo!", resetForm: true };
};

export const getTodos = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase
    .from("todos")
    .select()
    .eq("done", false);

  return todos;
};

export const getCompletedTodos = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase
    .from("todos")
    .select()
    .eq("done", true);

  return todos;
};

export const completeTodo = async (id: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("todos")
    .update({ done: true })
    .eq("id", id);

  if (error) {
    console.error("Completing todo failed: ", error);
    // again, no type safety?
    return { message: "Error happened: " + error, resetForm: false };
  }

  revalidatePath("/");
  return { message: "Completed todo!", resetForm: true };
};
