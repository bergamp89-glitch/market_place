import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ChatContext = createContext();

const STORAGE_KEY = "tealmarket_chats_v2";

const defaultChats = [
  {
    id: "demo-chat-1",
    name: "Tech Store",
    slug: "tech-store",
    kind: "seller",
    avatar: "",
    unread: 1,
    lastMessage: "Assalomu alaykum, yordam kerakmi?",
    lastTime: "10:24",
    messages: [
      {
        id: 1,
        sender: "seller",
        text: "Assalomu alaykum, yordam kerakmi?",
        time: "10:24",
      },
    ],
  },
];

function getCurrentTime() {
  return new Date().toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getSavedChats() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultChats;
  } catch {
    return defaultChats;
  }
}

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(() => getSavedChats());
  const [activeChatId, setActiveChatIdState] = useState(() => {
    const firstChat = getSavedChats()[0];
    return firstChat?.id || null;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch {
      //
    }
  }, [chats]);

  useEffect(() => {
    if (!chats.length) {
      setActiveChatIdState(null);
      return;
    }

    const stillExists = chats.some((chat) => chat.id === activeChatId);
    if (!stillExists) {
      setActiveChatIdState(chats[0].id);
    }
  }, [chats, activeChatId]);

  const activeChat = useMemo(() => {
    return chats.find((chat) => chat.id === activeChatId) || chats[0] || null;
  }, [chats, activeChatId]);

  const totalUnread = useMemo(() => {
    return chats.reduce((sum, chat) => sum + (chat.unread || 0), 0);
  }, [chats]);

  const setActiveChatId = (chatId) => {
    setActiveChatIdState(chatId);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              unread: 0,
            }
          : chat
      )
    );
  };

  const sendMessageToChat = (chatId, text) => {
    const messageText = String(text || "").trim();
    if (!messageText || !chatId) return;

    const sentTime = getCurrentTime();

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              lastMessage: messageText,
              lastTime: sentTime,
              messages: [
                ...(chat.messages || []),
                {
                  id: Date.now(),
                  sender: "user",
                  text: messageText,
                  time: sentTime,
                },
              ],
            }
          : chat
      )
    );
  };

  const sendMessage = (text) => {
    if (!activeChatId) return;
    sendMessageToChat(activeChatId, text);
  };

  const sendSharedReel = (chatId, reel, product) => {
    if (!chatId || !reel) return;

    const productLink = product?.id
      ? `${window.location.origin}/product/${product.id}`
      : `${window.location.origin}/`;

    const shareText = `🎬 Reel: ${reel.title}\n🛍 Mahsulot: ${
      product?.title || "Mahsulot"
    }\n🔗 ${productLink}`;

    sendMessageToChat(chatId, shareText);
    setActiveChatId(chatId);
  };

  const getOrCreateSellerChat = ({ storeName, storeSlug, avatar = "" }) => {
    const existing = chats.find(
      (chat) =>
        chat.kind === "seller" &&
        (storeSlug ? chat.slug === storeSlug : chat.name === storeName)
    );

    if (existing) {
      setActiveChatId(existing.id);
      return existing.id;
    }

    const chatId = `seller-${Date.now()}`;
    const time = getCurrentTime();

    const newChat = {
      id: chatId,
      name: storeName || "Do'kon",
      slug: storeSlug || "",
      kind: "seller",
      avatar,
      unread: 0,
      lastMessage: "Assalomu alaykum, sizga qanday yordam bera olaman?",
      lastTime: time,
      messages: [
        {
          id: Date.now(),
          sender: "seller",
          text: "Assalomu alaykum, sizga qanday yordam bera olaman?",
          time,
        },
      ],
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatIdState(chatId);

    return chatId;
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        activeChatId,
        totalUnread,
        setActiveChatId,
        sendMessage,
        sendMessageToChat,
        sendSharedReel,
        getOrCreateSellerChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}