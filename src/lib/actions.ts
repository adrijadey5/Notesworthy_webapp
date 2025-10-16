'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, firestore } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';
import { Note } from './types';
import { summarizeNote } from '@/ai/flows/summarize-note';

export async function saveNote(data: FormData) {
  const { noteId, title, content } = {
    noteId: data.get('noteId') as string | null,
    title: data.get('title') as string,
    content: data.get('content') as string,
  };

  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be logged in to save a note.');
  }

  if (noteId && noteId !== 'new') {
    // Update existing note
    const noteRef = doc(firestore, 'notes', noteId);
    const noteSnap = await getDoc(noteRef);
    if (!noteSnap.exists() || noteSnap.data().userId !== user.uid) {
        throw new Error("Note not found or you don't have permission to edit it.");
    }
    await updateDoc(noteRef, {
      title,
      content,
      updatedAt: serverTimestamp(),
    });
    revalidatePath(`/notes/${noteId}`);
    revalidatePath('/dashboard');
    return { noteId };
  } else {
    // Create new note
    const docRef = await addDoc(collection(firestore, 'notes'), {
      title,
      content,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    revalidatePath('/dashboard');
    redirect(`/notes/${docRef.id}`);
  }
}

export async function deleteNote(noteId: string) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('You must be logged in to delete a note.');
    }
  
    const noteRef = doc(firestore, 'notes', noteId);
    const noteSnap = await getDoc(noteRef);

    if (!noteSnap.exists() || noteSnap.data().userId !== user.uid) {
        throw new Error("Note not found or you don't have permission to delete it.");
    }

    await deleteDoc(noteRef);
    revalidatePath('/dashboard');
    redirect('/dashboard');
}


export async function getSummary(text: string) {
    if (!text || text.trim().length < 20) {
      return { summary: 'Please select more text to get a summary.' };
    }
    try {
      const { summary } = await summarizeNote({ text });
      return { summary };
    } catch (error) {
      console.error(error);
      return { summary: 'Sorry, we couldn\'t generate a summary at this time.' };
    }
}
