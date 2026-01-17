import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NotePreview.client';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

interface NoteDetailsPageProps {
  id: string ;
}

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<NoteDetailsPageProps>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
