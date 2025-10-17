'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Logo from '@/components/logo';
import { NewNoteButton } from '@/components/new-note-button';
import { UserButton } from '@/components/user-button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        {/* You can put a loader here */}
      </div>
    );
  }

  const sidebarContent = (
    <div className="flex h-full flex-col p-4">
      <div className="mb-8">
        <Logo />
      </div>
      <NewNoteButton />
      <div className="mt-auto flex flex-col gap-2">
         <ThemeToggle />
        <UserButton user={user} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="md:hidden border-b p-2 flex items-center justify-between sticky top-0 bg-background z-10">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <PanelLeft />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            {sidebarContent}
          </SheetContent>
        </Sheet>
        <Logo />
      </div>
      <div className="flex">
        <aside className="hidden md:block w-64 h-screen sticky top-0 border-r">
          {sidebarContent}
        </aside>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
