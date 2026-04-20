
import { nextServer } from './api';
import { Note } from '@/types/note';

// Types for authentication
export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
};

export type UserData = {
  id: string;
  email: string;
  username: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserRequest = {
  username: string;
};

// Authentication endpoints
export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<UserData>('/auth/login', data);
  return res.data;
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<UserData>('/auth/register', data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

export const checkSession = async () => {
  const res = await nextServer.get<{ success: boolean }>('/auth/session');
  return res.data.success;
};

// User endpoints
export const getMe = async () => {
  const { data } = await nextServer.get<UserData>('/users/me');
  return data;
};

export const updateMe = async (payload: UpdateUserRequest) => {
  const res = await nextServer.patch<UserData>('/users/me', payload);
  return res.data;
};

// Notes endpoints
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export type CreateNoteRequest = {
  title: string;
  content: string;
  tag: NoteTag;
};

export type FetchNotesParams = {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: NoteTag;
};

export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export const fetchNotes = async (params: FetchNotesParams = {}) => {
  const res = await nextServer.get<FetchNotesResponse>('/notes', { params: { ...params, perPage: 12 } });
  return res.data;
};

export const fetchNoteById = async (id: string) => {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (data: CreateNoteRequest) => {
  const res = await nextServer.post<Note>('/notes', data);
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await nextServer.delete<Note>(`/notes/${id}`);
  return res.data;
};