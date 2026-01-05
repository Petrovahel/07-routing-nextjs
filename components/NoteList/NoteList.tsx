import css from './NoteList.module.css';
import type { Note } from '../../types/note';
import Link from 'next/link'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<Note, Error, string>({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Note[]>(['notes'], oldNotes =>
        oldNotes ? oldNotes.filter(note => note.id !== id) : []
      );
    },
    onError: (error) => {
      console.error('Failed to delete note:', error);
    },
  });

  if (!notes.length) return <p>No notes found.</p>;

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link href={`/notes/${note.id}`} className={css.link}>
              View details
            </Link>
            <button
              className={css.button}
              onClick={() => deleteMutation.mutate(note.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
