import { QueryClient, dehydrate } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { fetchNoteById } from '@/lib/api';

type NotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetails({ params }: NotePageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return <NoteDetailsClient noteId={id} dehydratedState={dehydratedState} />;
}
