'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/lib/api";
import Link from "next/link";

import css from "../../notes.module.css";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";

type Props = {
  tag: string;
};

export default function NotesByFilterClient({ tag }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);


  const [debouncedSearch] = useDebounce(search, 500);

  const normalizedTag = tag === "all" ? undefined : (tag as NoteTag);

  const { data, isLoading } = useQuery({
    queryKey: ['notes', normalizedTag, debouncedSearch, page],

    queryFn: () => fetchNotes({
  search: debouncedSearch,
  page,
  tag: normalizedTag,
}),

    refetchOnMount: false,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };


  const hasNotes = data && data.notes && data.notes.length > 0;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <h2 className={css.title}>{tag === "all" ? "All notes" : `Tag: ${tag}`}</h2>

        <Link href="/notes/action/create" className={css.button}>Create note +</Link>
      </div>

      <SearchBox
        searchText={search}
        updateSearch={handleSearchChange}
      />

      {isLoading ? (
        <div className={css.loading}>
          <p>Loading...</p>
        </div>
      ) : (

        hasNotes ? (
          <NoteList notes={data.notes} />
        ) : (
          <div className={css.empty}>
            <p>No notes found.</p>
          </div>
        )
      )}

      <Pagination
        currentPage={page}
        pageCount={data?.totalPages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}