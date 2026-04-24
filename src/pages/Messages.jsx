import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Search, SendHorizonal } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

function getChatTitle(chat) {
  return chat?.name || chat?.title || chat?.storeName || "Chat";
}

function getChatAvatar(chat) {
  return chat?.avatar || chat?.image || "";
}

function getMessageText(message) {
  return (
    message?.text ||
    message?.message ||
    message?.content ||
    message?.body ||
    ""
  );
}

function isOwnMessage(message, currentUser) {
  if (message?.isMine === true) return true;
  if (message?.sender === "user") return true;
  if (message?.role === "user") return true;
  if (message?.authorId && currentUser?.id && message.authorId === currentUser.id) return true;
  if (message?.author && currentUser?.name && message.author === currentUser.name) return true;
  return false;
}

export default function Messages() {
  const { currentUser } = useAuth();

  const {
    chats = [],
    activeChatId,
    setActiveChatId,
    sendMessage,
    markChatAsRead,
  } = useChat();

  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return chats;

    return chats.filter((chat) =>
      getChatTitle(chat).toLowerCase().includes(query)
    );
  }, [chats, searchTerm]);

  useEffect(() => {
    if (!activeChatId && filteredChats.length > 0 && typeof setActiveChatId === "function") {
      setActiveChatId(filteredChats[0].id);
    }
  }, [activeChatId, filteredChats, setActiveChatId]);

  const activeChat = useMemo(() => {
    return chats.find((chat) => chat.id === activeChatId) || filteredChats[0] || null;
  }, [chats, activeChatId, filteredChats]);

  useEffect(() => {
    if (activeChat?.id && typeof markChatAsRead === "function") {
      markChatAsRead(activeChat.id);
    }
  }, [activeChat, markChatAsRead]);

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const trimmed = messageText.trim();
    if (!trimmed || !activeChat) return;

    if (typeof sendMessage === "function") {
      try {
        await sendMessage(activeChat.id, {
          id: Date.now(),
          text: trimmed,
          sender: "user",
          createdAt: new Date().toLocaleTimeString("uz-UZ", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          author: currentUser?.name || "Siz",
          isMine: true,
        });
      } catch {
        try {
          await sendMessage(activeChat.id, trimmed);
        } catch {
          //
        }
      }
    }

    setMessageText("");
  };

  return (
    <section className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="grid min-h-[78vh] md:grid-cols-[320px_1fr]">
          <aside className="border-b border-slate-200 md:border-b-0 md:border-r">
            <div className="border-b border-slate-200 p-4">
              <p className="text-sm font-semibold text-teal-600">Xabarlar</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">Chatlar</h1>

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Chat qidirish..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto md:max-h-[calc(78vh-109px)]">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => {
                  const isActive = activeChat?.id === chat.id;
                  const lastMessage =
                    Array.isArray(chat.messages) && chat.messages.length > 0
                      ? chat.messages[chat.messages.length - 1]
                      : null;

                  return (
                    <button
                      key={chat.id}
                      type="button"
                      onClick={() => {
                        if (typeof setActiveChatId === "function") {
                          setActiveChatId(chat.id);
                        }
                      }}
                      className={`flex w-full items-center gap-3 border-b border-slate-100 px-4 py-4 text-left transition ${
                        isActive ? "bg-teal-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                        {getChatAvatar(chat) ? (
                          <img
                            src={getChatAvatar(chat)}
                            alt={getChatTitle(chat)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getChatTitle(chat).charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {getChatTitle(chat)}
                          </p>
                          <span className="shrink-0 text-[11px] text-slate-400">
                            {chat?.lastTime || lastMessage?.createdAt || ""}
                          </span>
                        </div>

                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                          {chat?.lastMessage || getMessageText(lastMessage) || "Hozircha xabar yo‘q"}
                        </p>
                      </div>

                      {chat?.unreadCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-500 px-1 text-[10px] font-bold text-white">
                          {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-6 text-sm text-slate-500">Chat topilmadi.</div>
              )}
            </div>
          </aside>

          <div className="flex min-h-[60vh] flex-col">
            {activeChat ? (
              <>
                <div className="border-b border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                      {getChatAvatar(activeChat) ? (
                        <img
                          src={getChatAvatar(activeChat)}
                          alt={getChatTitle(activeChat)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getChatTitle(activeChat).charAt(0).toUpperCase()
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">{getChatTitle(activeChat)}</p>
                      <p className="text-xs text-slate-500">Onlayn savdo suhbati</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
                  {Array.isArray(activeChat.messages) && activeChat.messages.length > 0 ? (
                    activeChat.messages.map((message) => {
                      const mine = isOwnMessage(message, currentUser);
                      return (
                        <div
                          key={message.id || `${message.createdAt}-${getMessageText(message)}`}
                          className={`flex ${mine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[82%] rounded-3xl px-4 py-3 shadow-sm sm:max-w-[70%] ${
                              mine
                                ? "bg-teal-500 text-white"
                                : "border border-slate-200 bg-white text-slate-900"
                            }`}
                          >
                            <p className="text-sm leading-6">{getMessageText(message)}</p>
                            <p
                              className={`mt-2 text-[11px] ${
                                mine ? "text-white/80" : "text-slate-400"
                              }`}
                            >
                              {message?.createdAt || message?.time || ""}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
                        <MessageCircle className="mx-auto text-slate-300" size={34} />
                        <p className="mt-3 text-sm text-slate-500">
                          Hozircha xabar yo‘q. Suhbatni boshlang.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="border-t border-slate-200 bg-white p-3 sm:p-4"
                >
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(event) => setMessageText(event.target.value)}
                      placeholder="Xabar yozing..."
                      className="w-full bg-transparent px-2 py-2 text-sm outline-none"
                    />

                    <button
                      type="submit"
                      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500 text-white transition hover:bg-teal-600"
                    >
                      <SendHorizonal size={18} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center bg-slate-50 p-8">
                <div className="text-center">
                  <MessageCircle className="mx-auto text-slate-300" size={36} />
                  <p className="mt-3 text-sm text-slate-500">Chat tanlang.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}