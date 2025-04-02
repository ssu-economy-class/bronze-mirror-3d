// stores/usePersonStore.ts
import { create } from "zustand";

type Person = {
  id: string;
};

type Store = {
  people: Person[];
  addPerson: () => void;
};

export const usePersonStore = create<Store>((set) => ({
  people: [],
  addPerson: () =>
    set((state) => ({
      people: [...state.people, { id: crypto.randomUUID() }],
    })),
}));
