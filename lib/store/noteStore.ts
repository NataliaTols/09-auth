import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TagType = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

interface DraftNote {
  title: string;
  content: string;
  tag: TagType;
}

const initialDraft: DraftNote = {
  title: '',
  content: '',
  tag: 'Todo',
};

interface NoteDraftStore {
  draft: DraftNote;
  setDraft: (draft: Partial<DraftNote>) => void;
  clearDraft: () => void;
}

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (newDraft) =>
        set((state) => ({
          draft: { ...state.draft, ...newDraft },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-draft-storage',
    }
  )
);