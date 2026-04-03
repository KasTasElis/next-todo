"use client";

import { createClient } from "@/utils/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const User = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed!!!");
      console.log({ event, session });

      if (session?.user) {
        setUser(session?.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    const supabase = createClient();
    const {
      data: { user, session },
      error,
    } = await supabase.auth.signInWithPassword({
      email: "eli@email.com",
      password: "Pass123!!!",
    });

    if (error) {
      console.error("Errrrrr: ", error);
    } else {
      console.log("It workssss: ", { user, session });
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <div className="flex gap-7">
      <div>{user ? `Signed in as: ${user.email}` : "Please sign in!"}</div>

      <div className="flex gap-1">
        {user ? (
          <button onClick={signOut} className="p-1 outline">
            Sign Out
          </button>
        ) : (
          <button className="p-1 outline" onClick={signIn}>
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};
