'use client';

import { useQuery, useMutation, useQueryClient, QueryClient, hydrate } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchNoteById, deleteNote } from '@/lib/api';
import { useRouter } from 'next/navigation';
import type { Note } from '@/types/note';

interface NoteDetailsClientProps {
  noteId: string;
  dehydratedState: unknown;
}

export default function NoteDetailsClient({ noteId, dehydratedState }: NoteDetailsClientProps) {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();
  const queryClientHook = useQueryClient();

  hydrate(queryClient, dehydratedState);

  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: !!noteId,
    refetchOnMount: false,
  });


  if (isLoading) return <p>Loading...</p>;
  if (isError || !note) return <p>Note not found</p>;

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
      <span>{note.tag}</span>
    </div>
  );
}
