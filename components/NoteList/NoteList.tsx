import css from './NoteList.module.css';
import type { Note } from '../../types/note';
import Link from 'next/link'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api'; // функція для видалення нотатки через API

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  // Мутація для видалення нотатки
  const { mutate, isLoading } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: (_, id) => {
      // Оновлюємо кеш локально, прибираючи видалену нотатку
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
              onClick={() => mutate(note.id)}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
