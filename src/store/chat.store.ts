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

interface ChatState {
  messages: Message[];
  conversationId: string | undefined;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setConversationId: (id: string | undefined) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      conversationId: undefined,
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setMessages: (messages) => set({ messages }),
      setConversationId: (id) => set({ conversationId: id }),
      clearChat: () => set({ messages: [], conversationId: undefined }),
    }),
    {
      name: "austral-ai-chat-storage", // nombre único para localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
