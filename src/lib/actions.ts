'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/index.server';
import { Note } from './types';
import { summarizeNote } from '@/ai/flows/summarize-note';

async function getAuthenticatedAppForUser() {
  const { auth, firestore } = initializeFirebase();
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  return { user, firestore };
}


export async function saveNote(data: FormData) {
  const app = await getAuthenticatedAppForUser();
  if (!app) {
    throw new Error('You must be logged in to save a note.');
  }
  const { user, firestore } = app;

  const { noteId, title, content } = {
    noteId: data.get('noteId') as string | null,
    title: data.get('title') as string,
    content: data.get('content') as string,
  };

  if (noteId && noteId !== 'new') {
    // Update existing note
    const noteRef = doc(firestore, `users/${user.uid}/notes`, noteId);
    const noteSnap = await getDoc(noteRef);
    if (!noteSnap.exists()) {
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
    const docRef = await addDoc(collection(firestore, `users/${user.uid}/notes`), {
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
    const app = await getAuthenticatedAppForUser();
    if (!app) {
      throw new Error('You must be logged in to delete a note.');
    }
    const { user, firestore } = app;
  
    const noteRef = doc(firestore, `users/${user.uid}/notes`, noteId);
    const noteSnap = await getDoc(noteRef);

    if (!noteSnap.exists()) {
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
