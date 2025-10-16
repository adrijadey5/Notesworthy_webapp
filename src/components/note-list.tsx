import { Note } from '@/lib/types';
import { NoteItemCard } from './note-item-card';

export default function NoteList({ notes }: { notes: Note[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map(note => (
        <NoteItemCard key={note.id} note={note} />
      ))}
    </div>
  );
}
