"use client";

/**
 * DataStore — backed by Firestore (Firebase), with realtime sync so every
 * device/browser sees the same data.
 *
 * Data is split into two places in Firestore:
 *  - a single document `core/state` holding everything except handbook
 *    articles (users, checklists, posts, chat threads/messages, language).
 *    All the actions below that touch this document run inside a Firestore
 *    transaction, so two people saving at almost the same moment don't
 *    silently overwrite each other's change.
 *  - a `handbook` collection with one document per article, so a handbook
 *    attachment (which can be a few hundred KB) never risks pushing the
 *    shared core document over Firestore's 1 MB document size limit.
 *
 * The logged-in user (session) is intentionally kept in this browser's
 * localStorage only — each device should stay logged in as whoever used
 * it last, not follow a person across devices.
 */

import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ensureAnonAuth, getDb } from "./firebase";
import type { Lang } from "./i18n";
import { translate, type StringId } from "./i18n";
import { buildSeed } from "./mock-data";
import type {
  AppData,
  ChecklistInstance,
  HandbookArticle,
  StaffUser,
} from "./types";

const SESSION_KEY = "krambua-session-v1";

/** Everything in `core/state` except the handbook. */
type CoreData = Omit<AppData, "handbook">;

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
  saveUser: (user: StaffUser) => void;
  deleteUser: (userId: string) => void;
  saveHandbookArticle: (article: HandbookArticle) => void;
  deleteHandbookArticle: (articleId: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const coreDocRef = () => doc(getDb(), "core", "state");
const handbookColRef = () => collection(getDb(), "handbook");

export function DataProvider({ children }: { children: ReactNode }) {
  const [core, setCore] = useState<CoreData | null>(null);
  const [handbook, setHandbook] = useState<HandbookArticle[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  // Holds the current values so callbacks (defined once) can read fresh
  // state without needing to be recreated on every change.
  const coreRef = useRef<CoreData | null>(null);
  coreRef.current = core;

  useEffect(() => {
    setUserId(loadSession());
    let cancelledCore = false;
    let cancelledHandbook = false;
    let unsubCore: (() => void) | undefined;
    let unsubHandbook: (() => void) | undefined;

    ensureAnonAuth().then(() => {
      unsubCore = onSnapshot(
        coreDocRef(),
        async (snap) => {
          if (cancelledCore) return;
          if (snap.exists()) {
            setCore(snap.data() as CoreData);
          } else {
            // First run ever for this project: seed Firestore from the
            // built-in demo data so the app isn't empty.
            const seed = buildSeed();
            const { handbook: _handbook, ...seedCore } = seed;
            void _handbook;
            try {
              await setDoc(coreDocRef(), seedCore);
            } catch (err) {
              console.error("Klarte ikkje å så databasen med startdata", err);
              setCore(seedCore);
            }
          }
        },
        (err) => {
          console.error("Mista sanntidstilkopling til databasen (core)", err);
        }
      );

      unsubHandbook = onSnapshot(
        handbookColRef(),
        async (snap) => {
          if (cancelledHandbook) return;
          if (snap.empty) {
            const seed = buildSeed();
            try {
              await Promise.all(
                seed.handbook.map((article) =>
                  setDoc(doc(handbookColRef(), article.id), article)
                )
              );
            } catch (err) {
              console.error("Klarte ikkje å så handboka med startdata", err);
              setHandbook(seed.handbook);
            }
          } else {
            setHandbook(snap.docs.map((d) => d.data() as HandbookArticle));
          }
        },
        (err) => {
          console.error("Mista sanntidstilkopling til databasen (handbok)", err);
        }
      );
    });

    return () => {
      cancelledCore = true;
      cancelledHandbook = true;
      unsubCore?.();
      unsubHandbook?.();
    };
  }, []);

  useEffect(() => {
    if (core && handbook) setHydrated(true);
  }, [core, handbook]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (userId) window.localStorage.setItem(SESSION_KEY, userId);
      else window.localStorage.removeItem(SESSION_KEY);
    } catch {
      // localStorage unavailable — session just won't survive a reload
    }
  }, [userId, hydrated]);

  const data: AppData = useMemo(
    () => ({
      ...(core ?? buildSeed()),
      handbook: handbook ?? [],
    }),
    [core, handbook]
  );

  const currentUser = useMemo(
    () => data.users.find((u) => u.id === userId) ?? null,
    [data.users, userId]
  );

  const t = useCallback((id: StringId) => translate(id, data.lang), [data.lang]);

  /** Runs `updater` against the latest `core/state` inside a transaction. */
  const updateCore = useCallback(
    (updater: (prev: CoreData) => CoreData) => {
      runTransaction(getDb(), async (tx) => {
        const ref = coreDocRef();
        const snap = await tx.get(ref);
        const prev = (snap.exists() ? snap.data() : coreRef.current) as CoreData;
        if (!prev) return;
        const next = updater(prev);
        tx.set(ref, next as DocumentData);
      }).catch((err) => {
        console.error("Klarte ikkje å lagre endringa i databasen", err);
      });
    },
    []
  );

  const login = useCallback(
    (username: string, password: string) => {
      const match = data.users.find(
        (u) =>
          u.username.toLowerCase() === username.trim().toLowerCase() &&
          u.password === password
      );
      if (!match) return false;
      setUserId(match.id);
      return true;
    },
    [data.users]
  );

  const logout = useCallback(() => setUserId(null), []);

  const setLang = useCallback(
    (lang: Lang) => {
      updateCore((prev) => ({ ...prev, lang }));
    },
    [updateCore]
  );

  const toggleTask = useCallback(
    (listId: string, taskId: string) => {
      const doneByName = currentUser?.name;
      updateCore((prev) => ({
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
                doneBy: done ? doneByName : undefined,
              };
            }),
          };
        }),
      }));
    },
    [currentUser, updateCore]
  );

  const setDeviationNote = useCallback(
    (listId: string, taskId: string, text: string) => {
      const trimmed = text.trim();
      updateCore((prev) => ({
        ...prev,
        lists: prev.lists.map((list) => {
          if (list.id !== listId) return list;
          return {
            ...list,
            tasks: list.tasks.map((task) =>
              task.id === taskId
                ? { ...task, note: trimmed ? trimmed : undefined }
                : task
            ),
          };
        }),
      }));
    },
    [updateCore]
  );

  const sendMessage = useCallback(
    (threadId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !currentUser) return;
      const senderId = currentUser.id;
      updateCore((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: `m-${Date.now()}`,
            threadId,
            senderId,
            text: trimmed,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [currentUser, updateCore]
  );

  const createPost = useCallback(
    (title: string, body: string) => {
      if (!currentUser) return;
      const authorId = currentUser.id;
      updateCore((prev) => ({
        ...prev,
        posts: [
          {
            id: `p-${Date.now()}`,
            authorId,
            title: title.trim(),
            body: body.trim(),
            createdAt: new Date().toISOString(),
            readBy: [],
          },
          ...prev.posts,
        ],
      }));
    },
    [currentUser, updateCore]
  );

  const markPostRead = useCallback(
    (postId: string) => {
      if (!currentUser) return;
      const readerId = currentUser.id;
      updateCore((prev) => ({
        ...prev,
        posts: prev.posts.map((p) =>
          p.id === postId && !p.readBy.includes(readerId)
            ? { ...p, readBy: [...p.readBy, readerId] }
            : p
        ),
      }));
    },
    [currentUser, updateCore]
  );

  const savePlan = useCallback(
    (
      personId: string,
      dayIndex: number,
      plan: { name: string; tasks: string[] },
      editListId?: string
    ) => {
      if (!currentUser) return;
      const madeBy = currentUser.name;
      updateCore((prev) => {
        const withoutOld = editListId
          ? prev.lists.filter((l) => l.id !== editListId)
          : prev.lists;
        const filtered = withoutOld.filter(
          (l) => !(l.personId === personId && l.dayIndex === dayIndex)
        );
        if (plan.tasks.length === 0) return { ...prev, lists: filtered };
        const newList: ChecklistInstance = {
          id: editListId ?? `l-${personId}-${dayIndex}-${Date.now()}`,
          personId,
          dayIndex,
          name: plan.name,
          madeBy,
          tasks: plan.tasks.map((title, i) => ({
            id: `t${i + 1}`,
            title,
            done: false,
          })),
        };
        return { ...prev, lists: [...filtered, newList] };
      });
    },
    [currentUser, updateCore]
  );

  const resetPassword = useCallback(
    (userId2: string) => {
      const next = Math.random().toString(36).slice(2, 10);
      updateCore((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id === userId2 ? { ...u, password: next } : u
        ),
      }));
      return next;
    },
    [updateCore]
  );

  const saveUser = useCallback(
    (user: StaffUser) => {
      updateCore((prev) => {
        const exists = prev.users.some((u) => u.id === user.id);
        const users = exists
          ? prev.users.map((u) => (u.id === user.id ? user : u))
          : [...prev.users, user];

        const threads = prev.threads.map((thread) => {
          if (thread.id !== "th-alle") return thread;
          const participantIds = thread.participantIds.includes(user.id)
            ? thread.participantIds
            : [...thread.participantIds, user.id];
          return {
            ...thread,
            participantIds,
            sub: `${participantIds.length} personar`,
          };
        });

        return { ...prev, users, threads };
      });
    },
    [updateCore]
  );

  const deleteUser = useCallback(
    (userId2: string) => {
      updateCore((prev) => {
        const dmThreadIds = prev.threads
          .filter((th) => th.kind === "dm" && th.participantIds.includes(userId2))
          .map((th) => th.id);
        return {
          ...prev,
          users: prev.users.filter((u) => u.id !== userId2),
          lists: prev.lists.filter((l) => l.personId !== userId2),
          threads: prev.threads
            .filter((th) => !dmThreadIds.includes(th.id))
            .map((th) => ({
              ...th,
              participantIds: th.participantIds.filter((id) => id !== userId2),
            })),
          messages: prev.messages.filter((m) => !dmThreadIds.includes(m.threadId)),
          posts: prev.posts.map((p) => ({
            ...p,
            readBy: p.readBy.filter((id) => id !== userId2),
          })),
        };
      });
    },
    [updateCore]
  );

  const saveHandbookArticle = useCallback((article: HandbookArticle) => {
    setDoc(doc(handbookColRef(), article.id), article).catch((err) => {
      console.error("Klarte ikkje å lagre artikkelen i databasen", err);
    });
  }, []);

  const deleteHandbookArticle = useCallback((articleId: string) => {
    deleteDoc(doc(handbookColRef(), articleId)).catch((err) => {
      console.error("Klarte ikkje å slette artikkelen i databasen", err);
    });
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
    saveUser,
    deleteUser,
    saveHandbookArticle,
    deleteHandbookArticle,
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
  return `${String(d.getHours()).padStart(2, "0")}.${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}
