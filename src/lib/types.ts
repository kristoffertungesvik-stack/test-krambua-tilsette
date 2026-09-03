/**
 * Domain types. This mirrors the "State Management" section of the
 * handoff README fairly closely, reshaped into normalized records so a
 * real API/DB layer can slot in later without reshaping the UI.
 *
 * "Data the server must own" (per the handoff): users & credentials,
 * checklist templates and dated instances per person, task completions
 * (who + when), deviation notes, posts and read receipts, chat threads
 * and messages, handbook articles and PDFs. In this scaffold all of it
 * lives in DataStore (lib/store.tsx), mocked with localStorage — replace
 * that layer with real API calls when wiring a backend.
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
  roleLabel: string; // e.g. "Dagleg leiar", "Tilsett"
  shift?: string; // e.g. "06.30–14.00"
}

export interface ChecklistTask {
  id: string;
  title: string;
  hint?: string;
  done: boolean;
  doneAt?: string; // "07.24"
  doneBy?: string; // display name
  note?: string;
}

export interface ChecklistInstance {
  id: string;
  personId: string;
  dayIndex: number; // 0 = Monday … 6 = Sunday, within the current week
  name: string;
  madeBy: string;
  tasks: ChecklistTask[];
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  body: string;
  createdAt: string; // ISO
  readBy: string[]; // user ids
}

export type ThreadKind = "group" | "dm";

export interface Thread {
  id: string;
  kind: ThreadKind;
  name: string;
  sub: string; // "7 personar" or a role label
  participantIds: string[];
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  text: string;
  createdAt: string; // ISO
}

export type HandbookGroup = "rutinar" | "reglar" | "skjema";

export interface HandbookArticle {
  id: string;
  group: HandbookGroup;
  badge: string; // "01", "HMS", "PDF"
  title: string;
  sub: string;
  updatedAt: string; // "14. august"
  updatedBy: string;
  readMinutes: number;
  steps: string[];
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
