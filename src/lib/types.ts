/**
 * Domain types. This mirrors the "State Management" section of the
 * handoff README fairly closely, reshaped into normalized records so a
 * real API/DB layer can slot in later without reshaping the UI.
 *
 * IMPORTANT: This GitHub Pages version still stores all data in localStorage.
 * Passwords are therefore mock/demo credentials, not production auth.
 */
import type { Lang } from "./i18n";

export type Role = "tilsett" | "leiar";

export interface StaffUser {
  id: string;
  username: string;
  password: string; // mock only — a real backend never sends this to the client
  name: string;
  initials: string;
  role: Role;
  roleLabel: string;
  shift?: string;
  email?: string;
  phone?: string;
}

export interface ChecklistTask {
  id: string;
  title: string;
  hint?: string;
  done: boolean;
  doneAt?: string;
  doneBy?: string;
  note?: string;
}

export interface ChecklistInstance {
  id: string;
  personId: string;
  dayIndex: number;
  name: string;
  madeBy: string;
  tasks: ChecklistTask[];
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  body: string;
  createdAt: string;
  readBy: string[];
}

export type ThreadKind = "group" | "dm";

export interface Thread {
  id: string;
  kind: ThreadKind;
  name: string;
  sub: string;
  participantIds: string[];
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export type HandbookGroup = "rutinar" | "reglar" | "skjema";

export interface HandbookAttachment {
  name: string;
  type: string;
  dataUrl: string;
}

export interface HandbookArticle {
  id: string;
  group: HandbookGroup;
  badge: string;
  title: string;
  sub: string;
  updatedAt: string;
  updatedBy: string;
  readMinutes: number;
  steps: string[];
  attachment?: HandbookAttachment;
}

export interface AppData {
  lang: Lang;
  users: StaffUser[];
  lists: ChecklistInstance[];
  posts: Post[];
  threads: Thread[];
  messages: Message[];
  handbook: HandbookArticle[];
}
