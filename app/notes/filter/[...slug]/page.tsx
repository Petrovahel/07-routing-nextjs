import { QueryClient, dehydrate } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function NotesByTagPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = slug?.[0] ?? 'all';

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, 12, '', tag],
    queryFn: () =>
      fetchNotes(1, 12, '', tag === 'all' ? undefined : tag),
  });

  return (
    <NotesClient
      tag={tag}
      dehydratedState={dehydrate(queryClient)}
    />
  );
}
