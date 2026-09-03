"use client";

/**
 * DataStore — a mock stand-in for the real backend.
 *
 * Everything in here (users & credentials, checklist instances, task
 * completions, deviation notes, posts + read receipts, chat threads &
 * messages, handbook articles) is exactly what the handoff README lists
 * under "Data the server must own". For this scaffold it lives in
 * localStorage instead of a database, and every action below is
 * synchronous instead of an API call — but the shape of each action
 * (login, toggleTask, sendMessage, savePlan, …) is what a real API client
 * should expose, so swapping this provider for one backed by fetch/
 * websockets shouldn't change any component that calls useStore().
 *
 * Not simulated here, because it needs a real server to mean anything:
 * hashed passwords (the mock stores plaintext demo passwords), realtime
 * push between devices (the manager's live view would need a
 * websocket/poll subscription), and access control (any mock user can
 * currently call any action).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "./i18n";
import { translate, type StringId } from "./i18n";
import { buildSeed } from "./mock-data";
import type { AppData, ChecklistInstance, StaffUser } from "./types";

const DATA_KEY = "krambua-data-v1";
const SESSION_KEY = "krambua-session-v1";

function loadData(): AppData {
  if (typeof window === "undefined") return buildSeed();
  try {
    const raw = window.localStorage.getItem(DATA_KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch {
    // fall through to seed
  }
  return buildSeed();
}

function loadSession(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

interface StoreValue {
  hydrated: boolean;
  data: AppData;
  lang: Lang;
  t: (id: StringId) => string;
  currentUser: StaffUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  setLang: (lang: Lang) => void;
  toggleTask: (listId: string, taskId: string) => void;
  setDeviationNote: (listId: string, taskId: string, text: string) => void;
  sendMessage: (threadId: string, text: string) => void;
  createPost: (title: string, body: string) => void;
  markPostRead: (postId: string) => void;
  savePlan: (
    personId: string,
    dayIndex: number,
    plan: { name: string; tasks: string[] },
    editListId?: string
  ) => void;
  resetPassword: (userId: string) => string;
}

const StoreContext = createContext<StoreValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(buildSeed);
  const [userId, setUserId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadData());
    setUserId(loadSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (userId) window.localStorage.setItem(SESSION_KEY, userId);
    else window.localStorage.removeItem(SESSION_KEY);
  }, [userId, hydrated]);

  const currentUser = useMemo(
    () => data.users.find((u) => u.id === userId) ?? null,
    [data.users, userId]
  );

  const t = useCallback((id: StringId) => translate(id, data.lang), [data.lang]);

  const login = useCallback(
    (username: string, password: string) => {
      const match = data.users.find(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
      );
      if (!match) return false;
      setUserId(match.id);
      return true;
    },
    [data.users]
  );

  const logout = useCallback(() => setUserId(null), []);

  const setLang = useCallback((lang: Lang) => {
    setData((prev) => ({ ...prev, lang }));
  }, []);

  const toggleTask = useCallback(
    (listId: string, taskId: string) => {
      setData((prev) => ({
        ...prev,
        lists: prev.lists.map((list): ChecklistInstance => {
          if (list.id !== listId) return list;
          return {
            ...list,
            tasks: list.tasks.map((task) => {
              if (task.id !== taskId) return task;
              const done = !task.done;
              return {
                ...task,
                done,
                doneAt: done ? formatNowTime() : undefined,
                doneBy: done ? currentUser?.name : undefined,
              };
            }),
          };
        }),
      }));
    },
    [currentUser]
  );

  const setDeviationNote = useCallback((listId: string, taskId: string, text: string) => {
    const trimmed = text.trim();
    setData((prev) => ({
      ...prev,
      lists: prev.lists.map((list) => {
        if (list.id !== listId) return list;
        return {
          ...list,
          tasks: list.tasks.map((task) =>
            task.id === taskId ? { ...task, note: trimmed ? trimmed : undefined } : task
          ),
        };
      }),
    }));
  }, []);

  const sendMessage = useCallback(
    (threadId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !currentUser) return;
      setData((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: `m-${Date.now()}`,
            threadId,
            senderId: currentUser.id,
            text: trimmed,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [currentUser]
  );

  const createPost = useCallback(
    (title: string, body: string) => {
      if (!currentUser) return;
      setData((prev) => ({
        ...prev,
        posts: [
          {
            id: `p-${Date.now()}`,
            authorId: currentUser.id,
            title: title.trim(),
            body: body.trim(),
            createdAt: new Date().toISOString(),
            readBy: [],
          },
          ...prev.posts,
        ],
      }));
    },
    [currentUser]
  );

  const markPostRead = useCallback(
    (postId: string) => {
      if (!currentUser) return;
      setData((prev) => ({
        ...prev,
        posts: prev.posts.map((p) =>
          p.id === postId && !p.readBy.includes(currentUser.id)
            ? { ...p, readBy: [...p.readBy, currentUser.id] }
            : p
        ),
      }));
    },
    [currentUser]
  );

  const savePlan = useCallback(
    (
      personId: string,
      dayIndex: number,
      plan: { name: string; tasks: string[] },
      editListId?: string
    ) => {
      if (!currentUser) return;
      setData((prev) => {
        const withoutOld = editListId ? prev.lists.filter((l) => l.id !== editListId) : prev.lists;
        const filtered = withoutOld.filter((l) => !(l.personId === personId && l.dayIndex === dayIndex));
        if (plan.tasks.length === 0) return { ...prev, lists: filtered };
        const newList: ChecklistInstance = {
          id: editListId ?? `l-${personId}-${dayIndex}-${Date.now()}`,
          personId,
          dayIndex,
          name: plan.name,
          madeBy: currentUser.name,
          tasks: plan.tasks.map((title, i) => ({ id: `t${i + 1}`, title, done: false })),
        };
        return { ...prev, lists: [...filtered, newList] };
      });
    },
    [currentUser]
  );

  const resetPassword = useCallback((userId2: string) => {
    const next = Math.random().toString(36).slice(2, 10);
    setData((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === userId2 ? { ...u, password: next } : u)),
    }));
    return next;
  }, []);

  const value: StoreValue = {
    hydrated,
    data,
    lang: data.lang,
    t,
    currentUser,
    login,
    logout,
    setLang,
    toggleTask,
    setDeviationNote,
    sendMessage,
    createPost,
    markPostRead,
    savePlan,
    resetPassword,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within DataProvider");
  return ctx;
}

function formatNowTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`;
}
