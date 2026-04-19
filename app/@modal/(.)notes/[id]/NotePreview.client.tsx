'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from "@/lib/api/clientApi";
import Modal from "@/components/NotesModal/NotesModal"; 
import type { Note } from "@/types/note";

type Props = {
  id: string;
};

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();

 
  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id), refetchOnMount: false,
  });

  
  const handleClose = () => {
    router.back();
  };

 
  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <div className="p-4 text-center">Завантаження...</div>
      </Modal>
    );
  }

 
  if (isError || !note) {
    return (
      <Modal onClose={handleClose}>
        <div className="p-4 text-center text-red-500">
          Помилка завантаження нотатки.
        </div>
      </Modal>
    );
  }

  return (
   
    <Modal onClose={handleClose}>
      <div className="p-6 relative">

        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2">{note.title}</h2>
        <p className="text-gray-700 mb-4">{note.content}</p>

        <hr className="my-4" />


        <div className="flex justify-between items-center text-sm text-gray-500">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Tag: {note.tag || 'No tag'}
          </span>
          <span>
            Created: {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Unknown'}
          </span>
        </div>
      </div>
    </Modal>
  );
}