'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { Button } from '@/components/ui/button';
import { FilePlus, Loader2 } from 'lucide-react';

export function NewNoteButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleCreateNote = () => {
    startTransition(async () => {
      if (!user || !firestore) return;

      const newNote = {
        title: 'Untitled Note',
        content: '',
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const notesCollection = collection(firestore, `users/${user.uid}/notes`);
      const docRefPromise = addDocumentNonBlocking(notesCollection, newNote);
      
      // We don't need to await the promise to get the ID, we can navigate optimistically
      router.push(`/notes/new`);
      
      // When the write is confirmed, we can get the real ID and navigate
      const docRef = await docRefPromise;
      if (docRef) {
        router.push(`/notes/${docRef.id}`);
      }

      router.refresh();
    });
  };

  return (
    <Button onClick={handleCreateNote} disabled={isPending} className="w-full justify-start">
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FilePlus className="mr-2 h-4 w-4" />
      )}
      New Note
    </Button>
  );
}
