import { NotebookText } from 'lucide-react';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
      <NotebookText className="h-6 w-6" />
      <span className="text-xl font-bold tracking-tight font-headline">Noteworthy</span>
    </Link>
  );
}
