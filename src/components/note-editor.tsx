'use client';

import { Note } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Save, Trash2, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import React, { useState, useRef, useEffect, useTransition, useMemo } from 'react';
import { getSummary } from '@/lib/actions';
import {
  useFirestore,
  useUser,
  setDocumentNonBlocking,
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';

export function NoteEditor({ note }: { note: Note }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: useMemo(() => ({
      title: note.title,
      content: note.content,
    }), [note]),
  });

  useEffect(() => {
    reset({
      title: note.title,
      content: note.content
    });
  }, [note, reset]);


  const { isSubmitting, isDirty } = formState;

  const [selection, setSelection] = useState<DOMRect | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, startSummaryTransition] = useTransition();
  const [isSummaryDialogOpen, setSummaryDialogOpen] = useState(false);

  const handleSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && sel.toString().trim().length > 10) {
      const range = sel.getRangeAt(0);
      setSelection(range.getBoundingClientRect());
      setSelectedText(sel.toString());
    } else {
      setSelection(null);
      setSelectedText('');
    }
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  const handleSummarize = async () => {
    if (!selectedText) return;
    setSummary('');
    setSummaryDialogOpen(true);
    setSelection(null);
    startSummaryTransition(async () => {
      const result = await getSummary(selectedText);
      setSummary(result.summary);
    });
  };

  async function onSave(data: { title: string; content: string }) {
     if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error Saving Note',
        description: 'You must be logged in to save a note.',
      });
      return;
    }
    
    const isNewNote = note.id === 'new';

    try {
      if (isNewNote) {
        const notesCollection = collection(firestore, `users/${user.uid}/notes`);
        const newNoteData = {
            ...data,
            userId: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
        const docRefPromise = addDocumentNonBlocking(notesCollection, newNoteData);
        toast({
          title: 'Note Created',
          description: 'Your new note has been saved.',
        });
        // We can optimistically navigate, and then get the real ID
        router.push(`/dashboard`);
        const docRef = await docRefPromise;
        if(docRef) {
          router.push(`/notes/${docRef.id}`);
        }

      } else {
        const noteRef = doc(firestore, `users/${user.uid}/notes`, note.id);
        const updatedData = {
          ...data,
          updatedAt: serverTimestamp(),
        };
        setDocumentNonBlocking(noteRef, updatedData, { merge: true });
        toast({
          title: 'Note Saved',
          description: 'Your changes have been saved successfully.',
        });
      }
      router.refresh();
      
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error Saving Note',
        description: 'Could not save your note. Please try again.',
      });
    }
  }

  function onDelete() {
    if (!user || !firestore || note.id === 'new') return;
    const noteRef = doc(firestore, `users/${user.uid}/notes`, note.id);
    deleteDocumentNonBlocking(noteRef);
    toast({
      title: 'Note Deleted',
      description: 'Your note has been permanently deleted.',
    });
    router.push('/dashboard');
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSave)}
        onMouseUp={handleSelection}
        className="space-y-6 h-full flex flex-col"
      >
        <div className="flex items-center justify-between gap-4">
           <Button type="button" variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
              <ArrowLeft />
           </Button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight font-headline">
              {note.id === 'new' ? 'New Note' : 'Edit Note'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {note.id !== 'new' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your note.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </div>

        <Input
          {...register('title')}
          placeholder="Note title"
          className="text-2xl font-bold h-14 border-0 shadow-none focus-visible:ring-0 px-0"
        />
        <Textarea
          {...register('content')}
          placeholder="Start writing your note here..."
          className="border-0 shadow-none focus-visible:ring-0 px-0 resize-none flex-1 min-h-0"
        />
      </form>
      
      <Popover open={!!selection} onOpenChange={(open) => !open && setSelection(null)}>
        <PopoverTrigger asChild>
          <div
            style={{
              position: 'fixed',
              top: selection ? selection.top - 40 : -100,
              left: selection ? selection.left + selection.width / 2 - 50 : -100,
              width: 100,
              height: 36,
            }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1">
          <Button onClick={handleSummarize}>
            <Sparkles className="mr-2 h-4 w-4" />
            Summarize
          </Button>
        </PopoverContent>
      </Popover>

      <Dialog open={isSummaryDialogOpen} onOpenChange={setSummaryDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>AI Summary</DialogTitle>
            <DialogDescription>Here is a summary of your selected text.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isSummarizing ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <p className="text-sm text-foreground leading-relaxed">{summary}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
