'use client';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import type { Note } from '@/lib/types';
import NoteList from '@/components/note-list';
import { FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DashboardLoading from './loading';

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const notesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, `users/${user.uid}/notes`),
      orderBy('updatedAt', 'desc')
    );
  }, [firestore, user]);

  const { data: notes, isLoading } = useCollection<Note>(notesQuery);

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (!notes || notes.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-xl">
            <FilePlus className="w-16 h-16 text-muted-foreground mb-4"/>
            <h2 className="text-2xl font-semibold mb-2 font-headline">No notes yet</h2>
            <p className="text-muted-foreground mb-4">You have not created any notes. Let's create your first one!</p>
            <Button asChild>
                <Link href="/notes/new">Create a Note</Link>
            </Button>
        </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-headline">My Notes</h1>
      <NoteList notes={notes} />
    </div>
  );
}
