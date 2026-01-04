'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import type { Note } from '@/types/note';

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [search, setSearch] = useState('');

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<{
    notes: Note[];
    totalPages: number;
  }>({
    queryKey: ['notes', page, perPage, search],
    queryFn: () => fetchNotes(page, perPage, search),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Could not fetch the list of notes.</p>;
  if (!data) return null; 

  return (
    <ul>
      {data.notes.map(note => (
        <li key={note.id}>{note.title}</li>
      ))}
    </ul>
  );
}
