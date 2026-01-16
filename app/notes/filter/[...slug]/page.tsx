import NotesClient from './Notes.client';

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function NotesByTagPage({ params }: PageProps) {
  const { slug } = await params; 
  const tag = slug?.[0] ?? 'all';

  return <NotesClient tag={tag} />;
}

