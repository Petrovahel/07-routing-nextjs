'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import type { Note } from '@/types/note';
import css from './NotePreview.module.css';
import Modal from '@/components/Modal/Modal';

export default function NoteDetailsClient() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !note) return <p>Something went wrong.</p>;

  return (
    <Modal onClose={() => router.back()}>
          <div className={css.container}>
              <button className={css.backBtn} onClick={() => router.back()}>Back</button>
          <div className={css.item}>
             <div className={css.header}>
                 <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>
              {new Date(note.createdAt).toLocaleString('en', {
                 year: 'numeric',
                 month: 'long',
                 day: 'numeric',
                 hour: '2-digit',
                 minute: '2-digit',
               })}
          </p>
          <p className={css.tag}>Tag: {note.tag}</p>
        </div>
      </div>
    </Modal>
  );
}
