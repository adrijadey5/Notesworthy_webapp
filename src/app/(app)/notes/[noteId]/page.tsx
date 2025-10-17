'use client';

import { doc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { NoteEditor } from '@/components/note-editor';
import type { Note } from '@/lib/types';
import NoteLoading from '../loading';
import { useEffect, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';


export default function NotePage({ params }: { params: { noteId: string } }) {
  const resolvedParams = use(Promise.resolve(params));
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const isNewNote = resolvedParams.noteId === 'new';

  const noteRef = useMemoFirebase(() => {
    if (isNewNote || !user) return null;
    return doc(firestore, `users/${user.uid}/notes`, resolvedParams.noteId);
  }, [firestore, user, resolvedParams.noteId, isNewNote]);

  const { data: note, isLoading, error } = useDoc<Note>(noteRef);

  const newNoteTemplate: Note = useMemo(() => ({
      id: 'new',
      title: '',
      content: '',
      userId: user?.uid || '',
      createdAt: serverTimestamp() as any, // Will be replaced by server
      updatedAt: serverTimestamp() as any, // Will be replaced by server
  }), [user]);


  // If the note doesn't exist and it's not a new note, redirect.
  useEffect(() => {
    if (!isLoading && !note && !isNewNote) {
      router.push('/dashboard');
    }
  }, [isLoading, note, isNewNote, router]);


  if (isLoading) {
    return <NoteLoading />;
  }

  if (error) {
    return <div>Error loading note.</div>;
  }
  
  const currentNote = isNewNote ? newNoteTemplate : note;

  if (!currentNote) {
     return <NoteLoading />;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <NoteEditor note={currentNote} />
    </div>
  );
}
