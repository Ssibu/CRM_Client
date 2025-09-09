// import React, { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaComments } from "react-icons/fa";
// import ChatHeader from "../Chatbot/ChatHeader";
// import MessageBubble from "../Chatbot/MessageBubble";
// import TypingIndicator from "../Chatbot/TypingIndicator";
// import ChatInput from "../Chatbot/ChatInput";

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       role: "bot",
//       text: "👋 Welcome! I’m your assistant. How can I help you today?",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   useEffect(() => {
//     const handleKeyDown = (e) =>
//       e.key === "Escape" && isOpen && setIsOpen(false);
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isOpen]);

//   const handleSend = () => {
//     if (!input.trim()) return;
//     setMessages((prev) => [...prev, { role: "user", text: input }]);
//     setInput("");
//     setIsTyping(true);

//     setTimeout(() => {
//       setMessages((prev) => [
//         ...prev,
//         { role: "bot", text: "✅ Request received. I'll get back shortly." },
//       ]);
//       setIsTyping(false);
//     }, 1500);
//   };

//   return (
//     <div>
//       {/* Accessibility Skip Link */}
//       <a
//         href="#chatWindow"
//         className="sr-only focus:not-sr-only bg-indigo-700 text-white px-4 py-2"
//       >
//         Skip to Chat
//       </a>

//       {/* Floating Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Open AI Assistant Chat"
//         className="fixed bottom-5 right-5 z-[9999] bg-gradient-to-r from-[#4e51e5] from-[1%] to-[#fbcf7dfa] to-[100%]  text-white p-4 rounded-full shadow-lg 
//                    transition-transform hover:scale-110 hover:shadow-2xl"
//       >
//         <FaComments className="w-6 h-6" />
//       </button>

//       {/* Chat Window */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.section
//             role="dialog"
//             aria-labelledby="chatTitle"
//             id="chatWindow"
//             aria-live="polite"
//             initial={{ opacity: 0, y: 50, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 50, scale: 0.9 }}
//             transition={{ duration: 0.3, ease: "easeOut" }}
//             className="fixed bottom-20 right-5 z-[9999] bg-white shadow-2xl flex flex-col overflow-hidden rounded-2xl"
//             style={{
//               width: "22rem",
//               height: "500px",
//             }}
//           >
//             <ChatHeader onClose={() => setIsOpen(false)} />

//             {/* Messages */}
//             <div
//               className="flex-1 overflow-y-auto p-3 space-y-3"
//               role="log"
//               aria-live="polite"
//               style={{
//                 backgroundImage:
//                   "url('https://img.freepik.com/free-vector/vintage-ornamental-flowers-background_52683-28040.jpg')",
//                 backgroundSize: "cover",
//                 backgroundRepeat: "repeat",
//               }}
//             >
//               <ul className="space-y-3">
//                 {messages.map((msg, i) => (
//                   <MessageBubble key={i} {...msg} />
//                 ))}
//                 {isTyping && <TypingIndicator />}
//                 <div ref={chatEndRef} />
//               </ul>
//             </div>

//             {/* Input */}
//             <ChatInput input={input} setInput={setInput} onSend={handleSend} />
//           </motion.section>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Chatbot;



// import React, { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaComments } from "react-icons/fa";
// import axios from "axios";

// import ChatHeader from "../Chatbot/ChatHeader";
// import MessageBubble from "../Chatbot/MessageBubble";
// import TypingIndicator from "../Chatbot/TypingIndicator";
// import ChatInput from "../Chatbot/ChatInput";

// // 🈯️ Import translation hook
// import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const [currentCategory, setCurrentCategory] = useState(null);
//   const [showQuestions, setShowQuestions] = useState(false);
//   const chatEndRef = useRef(null);

//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   const { translate, language } = useGlobalTranslation();

//   useEffect(() => {
//     if (isOpen) {
//       setMessages([
//         {
//           role: "bot",
//           text:
//             translate("chatbot-welcome-message", "text") ||
//             "Hi there. How can I help you today?",
//         },
//         {
//           role: "bot",
//           text:
//             translate("chatbot-choose-category", "text") ||
//             "Please choose a category:",
//         },
//       ]);
//       setCurrentCategory(null);
//       setQuestions([]);
//       setShowQuestions(false);
//     }
//   }, [language, isOpen]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping, showQuestions]);

//   useEffect(() => {
//     const handleKeyDown = (e) =>
//       e.key === "Escape" && isOpen && setIsOpen(false);
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isOpen]);

//   useEffect(() => {
//     if (isOpen && categories.length === 0) {
//       fetchCategories();
//     }
//   }, [isOpen]);

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/user-chatbot/categories?status=Active`
//       );
//       setCategories(res.data.categories || []);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "bot",
//           text:
//             translate("chatbot.errorLoadingCategories", "text") ||
//             "Sorry, I'm having trouble loading categories.",
//         },
//       ]);
//     }
//   };

//   const fetchQuestions = async (categoryId) => {
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/user-chatbot/questions/category/${categoryId}?status=Active`
//       );
//       return res.data.questions || [];
//     } catch (err) {
//       console.error("Error fetching questions:", err);
//       return [];
//     }
//   };

//   const fetchAnswer = async (questionId) => {
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/user-chatbot/answers/question/${questionId}?status=Active`
//       );
//       return res.data.answers?.[0] || null;
//     } catch (err) {
//       console.error("Error fetching answer:", err);
//       return null;
//     }
//   };

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { role: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsTyping(true);

//     try {
//       if (!currentCategory) {
//         const matchedCategory = categories.find((cat) =>
//           translate(cat, "title").toLowerCase().includes(input.toLowerCase())
//         );

//         if (matchedCategory) {
//           await handleCategorySelect(matchedCategory);
//         } else {
//           setMessages((prev) => [
//             ...prev,
//             {
//               role: "bot",
//               text:
//                 translate("chatbot-invalid-category", "text") ||
//                 "I didn't understand that. Please choose a valid category.",
//             },
//             {
//               role: "bot",
//               text:
//                 translate("chatbot-choose-category", "text") ||
//                 "Please choose a category:",
//             },
//           ]);
//         }
//         setIsTyping(false);
//         return;
//       }

//       if (currentCategory && !showQuestions) {
//         await handleCategorySelect(currentCategory);
//         setIsTyping(false);
//         return;
//       }

//       const questionNumber = parseInt(input);
//       let selectedQuestion = null;

//       if (!isNaN(questionNumber) && questionNumber > 0 && questionNumber <= questions.length) {
//         selectedQuestion = questions[questionNumber - 1];
//       } else {
//         selectedQuestion = questions.find((q) =>
//           translate(q, "question").toLowerCase().includes(input.toLowerCase())
//         );
//       }

//       if (selectedQuestion) {
//         await handleQuestionSelect(selectedQuestion);
//       } else {
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "bot",
//             text:
//               translate("chatbot-invalid-question", "text") ||
//               "Sorry, I couldn't find that question.",
//           },
//           {
//             role: "bot",
//             text:
//               translate("chatbot-another-category", "text") ||
//               "Would you like to explore another category?",
//           },
//         ]);
//         setCurrentCategory(null);
//         setQuestions([]);
//         setShowQuestions(false);
//       }
//     } catch (error) {
//       console.error("Error processing message:", error);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleCategorySelect = async (category) => {
//     const userMessage = { role: "user", text: translate(category, "title") };
//     setMessages((prev) => [...prev, userMessage]);
//     setCurrentCategory(category);
//     setIsTyping(true);

//     try {
//       const fetchedQuestions = await fetchQuestions(category.id);
//       setQuestions(fetchedQuestions);
//       setShowQuestions(true);

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "bot",
//           text:
//             translate("chatbot-question-list-intro", "text") ||
//             `Here are questions about ${translate(category, "title")}:`,
//         },
//       ]);
//     } catch (err) {
//       console.error("Error loading questions:", err);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   // ✅ UPDATED FUNCTION — "Here is your answer:" added before actual answer
//   const handleQuestionSelect = async (question) => {
//     const userMessage = { role: "user", text: translate(question, "question") };
//     setMessages((prev) => [...prev, userMessage]);
//     setShowQuestions(false);
//     setIsTyping(true);

//     try {
//       const answer = await fetchAnswer(question.id);
//       if (answer) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "bot",
//             text:
//               translate("chatbot-answer-intro", "text") ||
//               "Here is your answer:",
//           },
//           {
//             role: "bot",
//             text: translate(answer, "answer"),
//           },
//         ]);

//         setCurrentCategory(null);
//         setQuestions([]);

//         setTimeout(() => {
//           setMessages((prev) => [
//             ...prev,
//             {
//               role: "bot",
//               text:
//                 translate("chatbot-another-category", "text") ||
//                 "Would you like to explore another category?",
//             },
//           ]);
//         }, 1000);
//       } else {
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "bot",
//             text:
//               translate("chatbot-noAnswerFound", "text") ||
//               "Sorry, no answer found. Please try another question.",
//           },
//           {
//             role: "bot",
//             text:
//               translate("chatbot-another-category", "text") ||
//               "Would you like to explore another category?",
//           },
//         ]);
//         setCurrentCategory(null);
//         setQuestions([]);
//         setShowQuestions(false);
//       }
//     } catch (err) {
//       console.error("Error loading answer:", err);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const resetChat = () => {
//     setCurrentCategory(null);
//     setQuestions([]);
//     setShowQuestions(false);
//     setMessages([
//       {
//         role: "bot",
//         text:
//           translate("chatbot-welcome-message", "text") ||
//           "Hi there. How can I help you today?",
//       },
//       {
//         role: "bot",
//         text:
//           translate("chatbot-choose-category", "text") ||
//           "Please choose a category:",
//       },
//     ]);
//   };

//   return (
//     <div>
//       <a
//         href="#chatWindow"
//         className="sr-only focus:not-sr-only bg-indigo-700 text-white px-4 py-2"
//       >
//         Skip to Chat
//       </a>

//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Open AI Assistant Chat"
//         className="fixed bottom-5 right-5 z-[9999] bg-gradient-to-r from-[#4e51e5] to-[#fbcf7dfa] text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-2xl"
//       >
//         <FaComments className="w-6 h-6" />
//       </button>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.section
//             role="dialog"
//             id="chatWindow"
//             initial={{ opacity: 0, y: 50, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 50, scale: 0.9 }}
//             transition={{ duration: 0.3 }}
//             className="fixed bottom-20 right-5 z-[9999] bg-white shadow-2xl flex flex-col overflow-hidden rounded-2xl"
//             style={{ width: "22rem", height: "500px" }}
//           >
//             <ChatHeader onClose={() => setIsOpen(false)} onReset={resetChat} />

//             <div
//               className="flex-1 overflow-y-auto p-3 space-y-3"
//               style={{
//                 backgroundImage:
//                   "url('https://img.freepik.com/free-vector/vintage-ornamental-flowers-background_52683-28040.jpg')",
//                 backgroundSize: "cover",
//                 backgroundRepeat: "repeat",
//               }}
//             >
//               <ul className="space-y-3">
//                 {messages.map((msg, i) => (
//                   <MessageBubble key={i} {...msg} />
//                 ))}

//                 {isTyping && <TypingIndicator />}

//                 {!currentCategory && categories.length > 0 && (
//                   <li className="bg-blue-50 rounded-xl px-4 py-3 text-sm shadow-md w-fit max-w-[90%]">
//                     <div className="flex flex-col gap-2">
//                       {categories.map((cat) => (
//                         <button
//                           key={cat.id}
//                           onClick={() => handleCategorySelect(cat)}
//                           className="bg-white border border-blue-300 rounded-md px-3 py-2 text-left hover:bg-blue-100 transition"
//                         >
//                           {translate(cat, "title")}
//                         </button>
//                       ))}
//                     </div>
//                   </li>
//                 )}

//                 {currentCategory && questions.length > 0 && showQuestions && (
//                   <li className="bg-green-50 rounded-xl px-4 py-3 text-sm shadow-md w-fit max-w-[90%]">
//                     <div className="flex flex-col gap-2">
//                       {questions.map((q, idx) => (
//                         <button
//                           key={q.id}
//                           onClick={() => handleQuestionSelect(q)}
//                           className="bg-white border border-green-300 rounded-md px-3 py-2 text-left hover:bg-green-100 transition"
//                         >
//                           <strong>{idx + 1}.</strong> {translate(q, "question")}
//                         </button>
//                       ))}
//                     </div>
//                   </li>
//                 )}

//                 <div ref={chatEndRef} />
//               </ul>
//             </div>

//             <ChatInput input={input} setInput={setInput} onSend={handleSend} />
//           </motion.section>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Chatbot;



import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaComments } from "react-icons/fa";
import axios from "axios";

import ChatHeader from "../Chatbot/ChatHeader";
import MessageBubble from "../Chatbot/MessageBubble";
import TypingIndicator from "../Chatbot/TypingIndicator";
import ChatInput from "../Chatbot/ChatInput";

import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showOptionsAfterAnswer, setShowOptionsAfterAnswer] = useState(false);
  const chatEndRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { translate, language } = useGlobalTranslation();

  const startNewChat = () => {
    setMessages([
      {
        role: "bot",
        text:
          translate("chatbot-welcome-message", "text") ||
          "Hi there. How can I help you today?",
      },
      {
        role: "bot",
        text:
          translate("chatbot-choose-category", "text") ||
          "Please choose a category:",
      },
    ]);
    setCurrentCategory(null);
    setQuestions([]);
    setShowQuestions(false);
    setShowOptionsAfterAnswer(false);
  };

  const resetChat = () => {
    startNewChat();
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showQuestions, showOptionsAfterAnswer]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user-chatbot/categories?status=Active`);
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            translate("chatbot.errorLoadingCategories", "text") ||
            "Sorry, I'm having trouble loading categories.",
        },
      ]);
    }
  };

  const fetchQuestions = async (categoryId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user-chatbot/questions/category/${categoryId}?status=Active`);
      return res.data.questions || [];
    } catch (err) {
      console.error("Error fetching questions:", err);
      return [];
    }
  };

  const fetchAnswer = async (questionId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user-chatbot/answers/question/${questionId}?status=Active`);
      return res.data.answers?.[0] || null;
    } catch (err) {
      console.error("Error fetching answer:", err);
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      if (showOptionsAfterAnswer) {
        if (input.toLowerCase() === "1" || input.toLowerCase().includes("more")) {
          // Show more questions from the same category
          setShowOptionsAfterAnswer(false);
          setShowQuestions(true);
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              text:
                translate("chatbot-question-list-intro", "text") ||
                `Here are questions about ${translate(currentCategory, "title")}:`,
            },
          ]);
        } else if (input.toLowerCase() === "2" || input.toLowerCase().includes("category")) {
          // Go back to categories
          setShowOptionsAfterAnswer(false);
          setCurrentCategory(null);
          setQuestions([]);
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              text:
                translate("chatbot-choose-category", "text") ||
                "Please choose a category:",
            },
          ]);
        } else if (input.toLowerCase() === "3" || input.toLowerCase().includes("exit")) {
          // End conversation
          setShowOptionsAfterAnswer(false);
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              text:
                translate("chatbot-goodbye", "text") ||
                "Thank you for chatting with us. Have a great day!",
            },
          ]);
        } else {
          // Invalid option
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              text:
                translate("chatbot-invalid-option", "text") ||
                "I didn't understand that. Please choose a valid option.",
            },
            {
              role: "bot",
              text: showOptionsAfterAnswerMessage()
            },
          ]);
        }
        setIsTyping(false);
        return;
      }

      if (!currentCategory) {
        const matchedCategory = categories.find((cat) =>
          translate(cat, "title").toLowerCase().includes(input.toLowerCase())
        );

        if (matchedCategory) {
          await handleCategorySelect(matchedCategory);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              text:
                translate("chatbot-invalid-category", "text") ||
                "I didn't understand that. Please choose a valid category.",
            },
            {
              role: "bot",
              text:
                translate("chatbot-choose-category", "text") ||
                "Please choose a category:",
            },
          ]);
        }
        setIsTyping(false);
        return;
      }

      if (currentCategory && !showQuestions) {
        await handleCategorySelect(currentCategory);
        setIsTyping(false);
        return;
      }

      const questionNumber = parseInt(input);
      let selectedQuestion = null;

      if (!isNaN(questionNumber) && questionNumber > 0 && questionNumber <= questions.length) {
        selectedQuestion = questions[questionNumber - 1];
      } else {
        selectedQuestion = questions.find((q) =>
          translate(q, "question").toLowerCase().includes(input.toLowerCase())
        );
      }

      if (selectedQuestion) {
        await handleQuestionSelect(selectedQuestion);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text:
              translate("chatbot-invalid-question", "text") ||
              "Sorry, I couldn't find that question.",
          },
        ]);
        setShowOptionsAfterAnswer(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: showOptionsAfterAnswerMessage()
          },
        ]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const showOptionsAfterAnswerMessage = () => {
    return translate("chatbot-what-next", "text") || 
      "What would you like to do next?\n1. Ask another question from this category\n2. Choose a different category\n3. Exit chat";
  };

  const handleCategorySelect = async (category) => {
    const userMessage = { role: "user", text: translate(category, "title") };
    setMessages((prev) => [...prev, userMessage]);
    setCurrentCategory(category);
    setIsTyping(true);

    try {
      const fetchedQuestions = await fetchQuestions(category.id);
      setQuestions(fetchedQuestions);
      setShowQuestions(true);
      setShowOptionsAfterAnswer(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            translate("chatbot-question-list-intro", "text") ||
            `Here are questions about ${translate(category, "title")}:`,
        },
      ]);
    } catch (err) {
      console.error("Error loading questions:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuestionSelect = async (question) => {
    const userMessage = { role: "user", text: translate(question, "question") };
    setMessages((prev) => [...prev, userMessage]);
    setShowQuestions(false);
    setIsTyping(true);

    try {
      const answer = await fetchAnswer(question.id);
      if (answer) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text:
              translate("chatbot-answer-intro", "text") ||
              "Here is your answer:",
          },
          {
            role: "bot",
            text: translate(answer, "answer"),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text:
              translate("chatbot-noAnswerFound", "text") ||
              "Sorry, no answer found.",
          },
        ]);
      }

      // Show options instead of resetting to categories
      setShowOptionsAfterAnswer(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: showOptionsAfterAnswerMessage()
        },
      ]);
    } catch (err) {
      console.error("Error loading answer:", err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div>
      <a href="#chatWindow" className="sr-only focus:not-sr-only bg-indigo-700 text-white px-4 py-2">
        Skip to Chat
      </a>

      <button
        onClick={() => {
          if (!isOpen) {
            startNewChat(); // ✅ Reset chatbot when reopened
          }
          setIsOpen(!isOpen);
        }}
        aria-label="Open AI Assistant Chat"
        className="fixed bottom-5 right-5 z-[9999] bg-gradient-to-r from-[#4e51e5] to-[#fbcf7dfa] text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-2xl"
      >
        <FaComments className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            id="chatWindow"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-5 z-[9999] bg-white shadow-极l flex flex-col overflow-hidden rounded-2xl"
            style={{ width: "22rem", height: "500px" }}
          >
            <ChatHeader onClose={() => setIsOpen(false)} onReset={resetChat} />

            <div
              className="flex-1 overflow-y-auto p-3 space-y-3"
              style={{
                backgroundImage:
                  "url('https://img.freepik.com/free-vector/vintage-ornamental-flowers-background_52683-28040.jpg')",
                backgroundSize: "cover",
                backgroundRepeat: "repeat",
              }}
            >
              <ul className="space-y-3">
                {messages.map((msg, i) => (
                  <MessageBubble key={i} {...msg} />
                ))}

                {isTyping && <TypingIndicator />}

                {!currentCategory && categories.length > 0 && !showQuestions && !showOptionsAfterAnswer && (
                  <li className="bg-blue-50 rounded-xl px-4 py-3 text-sm shadow-md w-fit max-w-[90%]">
                    <div className="flex flex-col gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat)}
                          className="bg-white border border-blue-300 rounded-md px-3 py-2 text-left hover:bg-blue-100 transition"
                        >
                          {translate(cat, "title")}
                        </button>
                      ))}
                    </div>
                  </li>
                )}

                {currentCategory && questions.length > 0 && showQuestions && (
                  <li className="bg-green-50 rounded-xl px-4 py-3 text-sm shadow-md w-fit max-w-[90%]">
                    <div className="flex flex-col gap-2">
                      {questions.map((q, idx) => (
                        <button
                          key={q.id}
                          onClick={() => handleQuestionSelect(q)}
                          className="bg-white border border-green-300 rounded-md px-3 py-2 text-left hover:bg-green-100 transition"
                        >
                          <strong>{idx + 1}.</strong> {translate(q, "question")}
                        </button>
                      ))}
                    </div>
                  </li>
                )}

                {showOptionsAfterAnswer && (
                  <li className="bg-purple-50 rounded-xl px-4 py-3 text-sm shadow-md w-fit max-w-[90%]">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setShowOptionsAfterAnswer(false);
                          setShowQuestions(true);
                          setMessages((prev) => [
                            ...prev,
                            {
                              role: "bot",
                              text:
                                translate("chatbot-question-list-intro", "text") ||
                                `Here are questions about ${translate(currentCategory, "title")}:`,
                            },
                          ]);
                        }}
                        className="bg-white border border-purple-300 rounded-md px-3 py-2 text-left hover:bg-purple-100 transition"
                      >
                        1. Ask another question from this category
                      </button>
                      <button
                        onClick={() => {
                          setShowOptionsAfterAnswer(false);
                          setCurrentCategory(null);
                          setQuestions([]);
                          setMessages((prev) => [
                            ...prev,
                            {
                              role: "bot",
                              text:
                                translate("chatbot-choose-category", "text") ||
                                "Please choose a category:",
                            },
                          ]);
                        }}
                        className="bg-white border border-purple-300 rounded-md px-3 py-2 text-left hover:bg-purple-100 transition"
                      >
                        2. Choose a different category
                      </button>
                      <button
                        onClick={() => {
                          setShowOptionsAfterAnswer(false);
                          setMessages((prev) => [
                            ...prev,
                            {
                              role: "bot",
                              text:
                                translate("chatbot-goodbye", "text") ||
                                "Thank you for chatting with us. Have a great day!",
                            },
                          ]);
                        }}
                        className="bg-white border border-purple-300 rounded-md px-3 py-2 text-left hover:bg-purple-100 transition"
                      >
                        3. Exit chat
                      </button>
                    </div>
                  </li>
                )}

                <div ref={chatEndRef} />
              </ul>
            </div>

            <ChatInput input={input} setInput={setInput} onSend={handleSend} />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;