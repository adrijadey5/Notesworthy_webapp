import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { NotebookText } from 'lucide-react';
import Logo from '@/components/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center">
            <div className="mb-6 p-4 bg-primary/20 rounded-full">
              <div className="p-3 bg-primary/50 rounded-full">
                <NotebookText className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-headline">
              Capture Your Thoughts
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
              Noteworthy is a simple, elegant, and AI-powered notes application to help you organize your ideas and summarize your thoughts.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">Start Writing for Free</Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Noteworthy. All rights reserved.</p>
      </footer>
    </div>
  );
}
