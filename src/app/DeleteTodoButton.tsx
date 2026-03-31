"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function DeleteTodoButton({ todoId }: { todoId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const supabase = createClient();
    await supabase.from("todos").delete().eq("id", todoId);
    router.refresh();
  };

  return (
    <button onClick={handleDelete} className="hover:opacity-75">
      🗑️
    </button>
  );
}
