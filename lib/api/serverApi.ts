import axios from "axios";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import { nextServer } from "./api";
import { cookies } from "next/headers";

const BASE_URL = "https://notehub-api.goit.study";

export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export type FetchNotesArgs = {
  tag?: NoteTag;
  search?: string;
  page?: number;
};

export async function fetchNotes({
  tag,
  search,
  page,
}: FetchNotesArgs): Promise<FetchNotesResponse> {
  const response = await axios.get<FetchNotesResponse>(`${BASE_URL}/notes`, {
    params: {
      tag,
      search,
      page,
      perPage: 12,
    },
    withCredentials: true,
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axios.get<Note>(`${BASE_URL}/notes/${id}`, {
    withCredentials: true,
  });
  return response.data;
}

export async function createNote(data: { title: string; content: string; tag: NoteTag }) {
  const response = await axios.post<Note>(`${BASE_URL}/notes`, data, {
    withCredentials: true,
  });
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await axios.delete<Note>(`${BASE_URL}/notes/${id}`, {
    withCredentials: true,
  });
  return response.data;
}

export const checkSession = async () => {
  const cookieStore = await cookies();
  try {
    const res = await nextServer.get('/auth/session', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};