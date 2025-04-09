import { create } from "zustand";

interface SpawnedImagesState {
  spawnedUrls: string[];
  addSpawnedUrls: (urls: string[]) => void;
}

export const useSpawnedImagesStore = create<SpawnedImagesState>((set) => ({
  spawnedUrls: [],
  addSpawnedUrls: (newUrls) =>
    set((state) => ({
      spawnedUrls: [...state.spawnedUrls, ...newUrls],
    })),
}));
