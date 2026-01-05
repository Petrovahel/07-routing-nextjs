import { QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
  queryKey: ['notes', 1, 12, ''],
  queryFn: ({ queryKey }) => {
    const [_key, page, perPage, search] = queryKey as [string, number, number, string];
    return fetchNotes(page, perPage, search);
  }
});


  const dehydratedState = dehydrate(queryClient); 

  return (
    <section>
      <NotesClient dehydratedState={dehydratedState} />
    </section>); 
}