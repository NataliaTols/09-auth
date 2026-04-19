import axios from "axios";
import type { Note } from "../types/note";

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api/notes";


export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";


interface FetchNotesProps {
  notes: Note[];
  totalPages: number;
}


interface FetchNotesArgs {
  tag?: NoteTag;      
  search?: string;
  page?: number;
}


export async function fetchNotes({
  tag,
  search,
  page,
}: FetchNotesArgs): Promise<FetchNotesProps> {
  const response = await axios.get<FetchNotesProps>(BASE_URL, {
    params: {
      tag,
      search,
      page,
    },
    headers: {
      Authorization: `Bearer ${myKey}`,
      Accept: "application/json",
    },
  });

  return response.data;
}


interface CreateNoteProps {
  title: string;
  content: string;
  tag: NoteTag; 
}

export async function createNote(newPost: CreateNoteProps): Promise<Note> {
  const response = await axios.post<Note>(BASE_URL, newPost, {
    headers: {
      Authorization: `Bearer ${myKey}`,
      Accept: "application/json",
    },
  });
  return response.data;
}


export async function deleteNote(noteId: string): Promise<Note> {
  const response = await axios.delete<Note>(`${BASE_URL}/${noteId}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
      Accept: "application/json",
    },
  });
  return response.data;
}


export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axios.get<Note>(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
      Accept: "application/json",
    },
  });
  return response.data;
}