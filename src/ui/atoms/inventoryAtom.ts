import { atomWithQuery } from "jotai/query";

export const inventoryAtom = atomWithQuery((get) => ({
  queryKey: ["inventory"],
  queryFn: async ({ queryKey: [, id] }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    return res.json();
  },
}));
