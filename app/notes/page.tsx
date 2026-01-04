'use client';

import { useState } from 'react';
import Pagination from '../../components/Pagination/Pagination';
import SearchBox from '../../components/SearchBox/SearchBox';
import NoteList from '../../components/NoteList/NoteList';
import Modal from '../../components/Modal/Modal';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes, deleteNote} from '../../lib/api';
import { useDebouncedCallback } from 'use-debounce';
import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';
import NoteForm from '../../components/NoteForm/NoteForm';
import css from './NotesPage.module.css';

export default function App() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, perPage, search],
    queryFn: () => fetchNotes(page, perPage, search),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  const handleDelete = (id: string) => deleteMutation.mutate(id);


  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={debouncedSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}


       <button className={css.button} onClick={() => setShowModal(true)}>
         Create note +
       </button>
      </header>

      {isLoading && <Loading />}
      {isError && <Error message="Error fetching notes." />}
      {data && data.notes.length === 0 && <p>No notes found.</p>}
      {data && data.notes.length > 0 && <NoteList notes={data.notes} onDelete={handleDelete} />}

      {showModal && (
       <Modal onClose={() => setShowModal(false)}>
         <NoteForm onClose={() => setShowModal(false)} />
       </Modal>
    )}
    </div>
  );
}