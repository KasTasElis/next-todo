import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from("todos").select();

  return (
    <div>
      <div className="p-7">
        <form action="">
          <input
            className="p-5 text-pink-900 w-[500px]"
            type="text"
            placeholder="What do i need to do? "
            required
          />
          <button className="p-5 outline">Add</button>
        </form>
      </div>
      <div className="p-7">
        <h3 className="text-xl mb-5">⏳ Todo:</h3>
        <ul>
          {todos?.map((todo) => (
            <li key={todo.id} className="flex gap-9">
              <div className="flex gap-4">
                <button className="hover:opacity-75">✏️</button>
                <button className="hover:opacity-75">🗑️</button>
                <button className="hover:opacity-75">✅</button>
              </div>

              <div className="opacity-50">{todo.created_at}</div>

              <div>{todo.title}</div>

              {/* Edit Form */}
              {/* <div>
                <form action="">
                  <input
                    className="p-1 text-pink-900 w-[500px]"
                    type="text"
                    placeholder="What do i need to do? "
                    required
                  />
                  <button className="p-1 outline">Done</button>
                  <button className="p-1 outline">Cancel</button>
                </form>
              </div> */}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-7">
        <h3 className="text-xl mb-5">✅ Completed:</h3>
        <ul>
          {todos?.map((todo) => (
            <li key={todo.id} className="flex gap-9">
              <div className="flex gap-4">
                <button className="hover:opacity-75">🗑️</button>
                <button className="hover:opacity-75">↩️</button>
              </div>

              <div className="opacity-50">{todo.created_at}</div>

              <div>{todo.title}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
