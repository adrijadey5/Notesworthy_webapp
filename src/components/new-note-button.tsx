'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { FilePlus, Loader2 } from 'lucide-react';

export function NewNoteButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreateNote = () => {
    startTransition(async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = await addDoc(collection(firestore, 'notes'), {
        title: 'Untitled Note',
        content: '',
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.push(`/notes/${docRef.id}`);
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
