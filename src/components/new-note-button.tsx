'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import Link from 'next/link';

export function NewNoteButton() {
  return (
    <Button asChild className="w-full justify-start">
        <Link href="/notes/new">
            <FilePlus className="mr-2 h-4 w-4" />
            New Note
        </Link>
    </Button>
  );
}
