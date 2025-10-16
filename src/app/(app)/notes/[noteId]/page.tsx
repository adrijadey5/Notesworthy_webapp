import { doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { NoteEditor } from '@/components/note-editor';
import type { Note } from '@/lib/types';

async function getNote(noteId: string): Promise<Note | null> {
  if (noteId === 'new') {
    return {
      id: 'new',
      title: '',
      content: '',
      userId: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as unknown as Note;
  }

  const noteRef = doc(firestore, 'notes', noteId);
  const noteSnap = await getDoc(noteRef);

  if (!noteSnap.exists()) {
    return null;
  }

  return { id: noteSnap.id, ...noteSnap.data() } as Note;
}

export default async function NotePage({ params }: { params: { noteId: string } }) {
  const note = await getNote(params.noteId);

  if (!note) {
    return <div>Note not found.</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <NoteEditor note={note} />
    </div>
  );
}
