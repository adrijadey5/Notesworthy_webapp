import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Note } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

export function NoteItemCard({ note }: { note: Note }) {
  const date = note.updatedAt.toDate();
  const formattedDate = formatDistanceToNow(date, { addSuffix: true });

  return (
    <Link href={`/notes/${note.id}`} className="block">
      <Card className="hover:border-primary transition-colors h-full flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline truncate">{note.title}</CardTitle>
          <CardDescription>
            Updated {formattedDate}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
