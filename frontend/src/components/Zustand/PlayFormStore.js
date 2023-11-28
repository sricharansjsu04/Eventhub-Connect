// playFormStore.js
import create from 'zustand';
import { persist } from 'zustand/middleware';

const usePlayFormStore = create(
  persist((set) => ({
    playData: [],
    addData: (data) => set((state) => ({ playData: [data,...state.playData] })),
    deleteData: (index) => set((state) => ({ playData: state.playData.filter((_, i) => i !== index) })),
    editData: (index, newData) => set((state) => {
        const updatedData = [...state.playData];
        updatedData[index] = newData;
        return { playData: updatedData };
      }),  }), {
    name: 'play_data',
  })
);

export default usePlayFormStore;
