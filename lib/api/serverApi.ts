import axios from "axios";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import { nextServer } from "./api";
import { cookies } from "next/headers";

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
  const cookieStore = await cookies();
  const response = await nextServer.get<FetchNotesResponse>('/notes', {
    params: {
      tag,
      search,
      page,
      perPage: 12,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

export async function createNote(data: { title: string; content: string; tag: NoteTag }) {
  const cookieStore = await cookies();
  const response = await nextServer.post<Note>('/notes', data, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await nextServer.delete<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
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
    return res.data;
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
  return {
    email: data.email,
    username: data.userName || '',
    avatar: data.photoUrl || '',
  };
};