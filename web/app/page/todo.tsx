import { Form, useActionData, useLoaderData, useSubmit } from "react-router";
import type { Route } from "./+types/home";
import { trpc } from "@/util";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const loader = async () => {
  const rows = await trpc.todo.list.query();
  return { rows };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const operation = formData.get("operation");

  if (operation === "create") {
    const newTodo = formData.get("title");
    await trpc.todo.create.mutate({ title: newTodo as string });
  } else if (operation === "toggle") {
    const id = formData.get("id");
    const completed = formData.get("completed") === "true";
    await trpc.todo.toggle.mutate({ id: Number(id), completed });
  } else if (operation === "remove") {
    const id = formData.get("id");
    await trpc.todo.remove.mutate({ id: Number(id) });
  }

  return {
    timeStamp: Date.now(),
  };
};

export default function Home() {
  const { rows } = useLoaderData<typeof loader>();

  return (
    <div className="pt-16 p-4 container mx-auto">
      <h1 className="text-3xl font-bold text-orange-500 text-center">
        TRPC TODO
      </h1>
      <div className="mt-8 flex justify-center">
        <TodoList rows={rows ?? []} />
      </div>
    </div>
  );
}

function TodoList({
  rows,
}: {
  rows: { id: number; title: string; completed: boolean }[];
}) {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  return (
    <div className="flex flex-col w-96">
      <ul>
        {rows.map((row) => (
          <li key={row.id} className="flex gap-2 w-full items-center">
            <Form method="post">
              <input type="hidden" name="operation" value={"toggle"} />
              <input type="hidden" name="id" value={row.id} />
              <input
                type="hidden"
                name="completed"
                value={(!row.completed).toString()}
              />
              <label>
                <input
                  type="checkbox"
                  checked={row.completed}
                  readOnly
                  onChange={(e) => {
                    submit(e.currentTarget.form);
                  }}
                />
                <span className={`ml-2 ${row.completed ? "line-through" : ""}`}>
                  {row.title}
                </span>
              </label>
            </Form>
            <Form method="post" className="ml-auto">
              <input type="hidden" name="operation" value={"remove"} />
              <input type="hidden" name="id" value={row.id} />
              <button
                type="submit"
                className="text-gray-400 px-0.5 rounded hover:text-red-500"
              >
                x
              </button>
            </Form>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Form key={actionData?.timeStamp} method="post" className="flex gap-2">
          <input type="hidden" name="operation" value="create" />
          <input
            type="text"
            className="border border-gray-300 rounded px-2 py-1 flex-1 placeholder:text-gray-400"
            name="title"
            placeholder="New todo"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        </Form>
      </div>
    </div>
  );
}
