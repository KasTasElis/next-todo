"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { createTodoNew } from "./actions";
import { useState } from "react";

type Inputs = {
  title: string;
  image: FileList;
};

export const AddTodoFormNew = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setServerError("");
    const result = await createTodoNew(data);
    if (result?.error) {
      setServerError(result.error);
    } else {
      reset();
    }
    setIsLoading(false);
  };

  return (
    <div>
      {serverError ? (
        <div className="mb-3 text-red-500 text-sm">{serverError}</div>
      ) : null}

      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col mb-3">
          <input
            className="p-5 text-pink-900 w-[500px] mb-1"
            placeholder="What do i need to do? "
            {...register("title", { required: true })}
          />
          {errors.title && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        <div>
          <input {...register("image")} type="file" accept="image/*" />
        </div>

        <button disabled={isLoading} type="submit" className="p-5 outline">
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};
