import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface GeneratedFile {
  type: "pdf" | "excel";
  filename: string;
  filepath: string;
  metadata: any;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  generatedFiles?: GeneratedFile[];
}

interface UserChat {
  messages: Message[];
  conversationId: string | undefined;
}

interface ChatState {
  chats: Record<string, UserChat>; // keyed by userId
  activeUserId: string | undefined;
  getChat: () => UserChat;
  setActiveUser: (userId: string) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setConversationId: (id: string | undefined) => void;
  clearChat: () => void;
  // Backwards compat
  messages: Message[];
  conversationId: string | undefined;
}

const EMPTY_CHAT: UserChat = { messages: [], conversationId: undefined };

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: {},
      activeUserId: undefined,
      messages: [],
      conversationId: undefined,

      getChat: () => {
        const { chats, activeUserId } = get();
        if (!activeUserId) return EMPTY_CHAT;
        return chats[activeUserId] || EMPTY_CHAT;
      },

      setActiveUser: (userId: string) => {
        const { chats } = get();
        const chat = chats[userId] || EMPTY_CHAT;
        set({
          activeUserId: userId,
          messages: chat.messages,
          conversationId: chat.conversationId,
        });
      },

      addMessage: (message) => {
        const { activeUserId, chats } = get();
        if (!activeUserId) return;
        const chat = chats[activeUserId] || EMPTY_CHAT;
        const updated = { ...chat, messages: [...chat.messages, message] };
        set({
          chats: { ...chats, [activeUserId]: updated },
          messages: updated.messages,
        });
      },

      setMessages: (messages) => {
        const { activeUserId, chats } = get();
        if (!activeUserId) return;
        const chat = chats[activeUserId] || EMPTY_CHAT;
        set({
          chats: { ...chats, [activeUserId]: { ...chat, messages } },
          messages,
        });
      },

      setConversationId: (id) => {
        const { activeUserId, chats } = get();
        if (!activeUserId) return;
        const chat = chats[activeUserId] || EMPTY_CHAT;
        set({
          chats: { ...chats, [activeUserId]: { ...chat, conversationId: id } },
          conversationId: id,
        });
      },

      clearChat: () => {
        const { activeUserId, chats } = get();
        if (!activeUserId) return;
        set({
          chats: { ...chats, [activeUserId]: EMPTY_CHAT },
          messages: [],
          conversationId: undefined,
        });
      },
    }),
    {
      name: "austral-ai-chat-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        chats: state.chats,
        activeUserId: state.activeUserId,
      }),
    }
  )
);
