'use client';

import { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  useQuery,
  DehydratedState,
  keepPreviousData
} from '@tanstack/react-query';

import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import Loading from '@/components/Loading/Loading';
import Error from '@/components/Error/Error';
import { useDebouncedCallback } from 'use-debounce';
import css from './NotesPage.module.css';

type NotesClientProps = {
  tag: string;
  dehydratedState?: DehydratedState | null;
};

export default function NotesClient({ tag, dehydratedState }: NotesClientProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <NotesContent tag={tag} />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

function NotesContent({ tag }: { tag: string }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const perPage = 12;

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, perPage, search, tag],
    queryFn: () =>
      fetchNotes(
        page,
        perPage,
        search,
        tag === 'all' ? undefined : tag
      ),
    placeholderData: keepPreviousData,
  });

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
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <NoteForm onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  );
}
