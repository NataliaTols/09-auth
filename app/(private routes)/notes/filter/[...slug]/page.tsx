import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NotesByFilterClient from "./Notes.client"; 
import { fetchNotes, type NoteTag } from "@/lib/api/serverApi";
import type { Metadata } from "next";



type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] || "all";
  return {
    title: `Note: ${tag}`,
    description: `Browse notes filtered by ${tag}`,
    openGraph: {
      title: `Note: ${tag}`,
      description: `Browse notes filtered by ${tag}`,
      url: `https://notehub.com/notes/${slug?.[0]}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Notes ${tag}`,
        },
      ],
      type: 'website',
    },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const tag = slug?.[0] || "all";
  const normalizedTag: NoteTag | undefined =
  tag === "all" ? undefined : (tag as NoteTag);

  const queryClient = new QueryClient();

 
  await queryClient.prefetchQuery({
    queryKey: ['notes', normalizedTag],
    queryFn: () =>
      fetchNotes({
        tag: normalizedTag as NoteTag | undefined,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesByFilterClient tag={tag} />
    </HydrationBoundary>
  );
}