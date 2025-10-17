import { Timestamp } from "firebase/firestore";

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  category?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
