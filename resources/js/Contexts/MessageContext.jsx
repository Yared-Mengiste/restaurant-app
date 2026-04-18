import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { usePage } from "@inertiajs/react";

const MessageContext = createContext();
export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const { flash } = usePage().props; // Extract flash from Laravel/Inertia

    const removeMessage = useCallback((id) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, []);

    const showMessage = useCallback((text, type = "success") => {
        const id = Date.now();
        setMessages((prev) => [...prev, { id, text, type }]);
        setTimeout(() => removeMessage(id), 4000);
    }, [removeMessage]);

    // 80/20 FIX: Sync Laravel Flash with React State
    useEffect(() => {
        if (flash?.success) {
            showMessage(flash.success, "success");
        }
        if (flash?.error) {
            showMessage(flash.error, "error");
        }
    }, [flash, showMessage]);

    const getIcon = (type) => (type === "error" ? "⚠️" : "✨");

    const getStyles = (type) => {
        return type === "error"
            ? "border-red-500/50 bg-red-50/90 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-red-500/10"
            : "border-emerald-500/50 bg-emerald-50/90 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/10";
    };

    return (
        <MessageContext.Provider value={{ showMessage }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-4 z-[100] space-y-3 max-w-sm w-full pointer-events-none">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`
              pointer-events-auto flex items-center gap-3 p-4
              rounded-2xl border backdrop-blur-md shadow-lg
              transition-all duration-300 animate-in slide-in-from-right-full
              ${getStyles(msg.type)}
            `}
                    >
                        <span className="text-xl shrink-0">{getIcon(msg.type)}</span>
                        <div className="flex-1">
                            <p className="text-sm font-bold capitalize leading-none mb-1">{msg.type}</p>
                            <p className="text-xs opacity-90 font-medium">{msg.text}</p>
                        </div>
                        <button
                            onClick={() => removeMessage(msg.id)}
                            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </MessageContext.Provider>
    );
};
