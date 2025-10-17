'use client';

import { doc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { NoteEditor } from '@/components/note-editor';
import type { Note } from '@/lib/types';
import NoteLoading from '../loading';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';


export default function NotePage({ params }: { params: { noteId: string } }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const isNewNote = params.noteId === 'new';

  const noteRef = useMemoFirebase(() => {
    if (isNewNote || !user) return null;
    return doc(firestore, `users/${user.uid}/notes`, params.noteId);
  }, [firestore, user, params.noteId, isNewNote]);

  const { data: note, isLoading, error } = useDoc<Note>(noteRef);

  const newNoteTemplate: Note = useMemo(() => ({
      id: 'new',
      title: '',
      content: '',
      userId: user?.uid || '',
      createdAt: serverTimestamp() as any, // Will be replaced by server
      updatedAt: serverTimestamp() as any, // Will be replaced by server
  }), [user]);


  if (isLoading) {
    return <NoteLoading />;
  }

  if (error) {
    return <div>Error loading note.</div>;
  }
  
  const currentNote = isNewNote ? newNoteTemplate : note;

  if (!currentNote && !isNewNote) {
     // If still loading or if note is null for an existing ID, show loading.
     // This also gracefully handles the moment after creation before the new doc is fetched.
     return <NoteLoading />;
  }

  if (!currentNote) {
    // Should only happen for 'new' if newNoteTemplate isn't ready, which is unlikely.
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <NoteEditor note={currentNote} />
    </div>
  );
}
