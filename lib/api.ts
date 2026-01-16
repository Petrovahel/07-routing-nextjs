import axios from 'axios';
import type { Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface CreateNoteInput {
  title: string;
  content: string;
  tag: NoteTag;
}

function getAuthHeaders() {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function fetchNotes(page: number, perPage: number, search?: string) {
  return axios
    .get<{ notes: Note[]; totalPages: number }>(`${BASE_URL}/notes`, {
      headers: getAuthHeaders(),
      params: { page, perPage, ...(search ? { search } : {}) },
    })
    .then(res => res.data);
}

export function createNote(data: CreateNoteInput) {
  return axios
    .post<Note>(`${BASE_URL}/notes`, data, { headers: getAuthHeaders() })
    .then(res => res.data);
}

export function deleteNote(id: string): Promise<Note> {
  return axios
    .delete<Note>(`${BASE_URL}/notes/${id}`, {
      headers: getAuthHeaders(),
    })
    .then(res => res.data);
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axios.get<Note>(`${BASE_URL}/notes/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}


export const getTags = async () => {
  const res = await axios<NoteTag[]>('/tags');
  return res.data;
};

export async function fetchNotesByTag(
  page: number,
  perPage: number,
  search?: string,
  tag?: string
) {
  const res = await axios.get(`${BASE_URL}/notes`, {
    headers: getAuthHeaders(),
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
  });

  return res.data; 

}

