import React, { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

function BotChat() {
  // Existing state variables
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [userId, setUserId] = useState("64f4be3ec636626231f136f9");
  const [personaId, setPersonaId] = useState("64f4bddbc636626231f136f5");
  const messagesEndRef = useRef(null);

  // Existing functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUserMessageChange = (event) => {
    setUserMessage(event.target.value);
  };

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
  };

  const handlePersonaIdChange = (event) => {
    setPersonaId(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const addMessageToChatHistory = (message) => {
    setChatHistory((prevChatHistory) => {
      if (!prevChatHistory.find((m) => m._id === message._id)) {
        return [...prevChatHistory, message];
      }
      return prevChatHistory;
    });
  };

  const handlePersonaClick = (id) => {
    setPersonaId(id);
  };

  async function fetchAllPersonas() {
    try {
      const response = await fetch("http://localhost:8000/get_all_personas");
      if (response.ok) {
        const data = await response.json();
        setPersonas(data.personas);
        if (data.personas.length > 0) {
          setPersonaId(data.personas[0]._id);
        }
      } else {
        console.log("Failed to fetch personas");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  const fetchChatHistory = useCallback(async () => {
    if (!userId || !personaId) {
      console.error("User ID or Persona ID is not set");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/get_chat_history?user_id=${userId}&persona_id=${personaId}`
      );
      if (response.ok) {
        const data = await response.json();
        setChatHistory(data.chat_history || []);
      } else {
        console.log("Failed to fetch chat history");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [userId, personaId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("User Message:", userMessage); // Log the user message

    const chatUrl = `http://localhost:8000/chat/?user_id=${userId}&persona_id=${personaId}`;
    const data = { user_message: userMessage };
    const fetchConfig = {
      method: "post",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };

    const addMessageToChatHistory = (message) => {
      setChatHistory((prevChatHistory) => {
        if (!prevChatHistory.find((m) => m._id === message._id)) {
          const newChatHistory = [...prevChatHistory, message];
          console.log("Updated Chat History:", newChatHistory); // Log the updated chat history
          return newChatHistory;
        }
        return prevChatHistory;
      });
    };

    setUserMessage("");

    const messageResponse = await fetch(chatUrl, fetchConfig);
    if (messageResponse.ok) {
      const response = await messageResponse.json();
      console.log("Server Response:", response); // Log the server response

      const botMessageContent = response.chatbot_reply;
      addMessageToChatHistory({
        role: "assistant",
        content: botMessageContent, // Updated this line to use content instead of chatbot_reply
        isActive: true,
        _id: uuidv4(),
      });
      fetchChatHistory(); // Fetch the updated chat history
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (userId && personaId) {
      fetchAllPersonas();
      fetchChatHistory();
    }
  }, [userId, personaId, fetchChatHistory]);

  useEffect(() => {
    console.log("CHAT HISTORY:", chatHistory);
  }, [chatHistory]);

  return (
    <section className="bg-chat-green">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-12">
            <div
              className="card bg-chat-outer-dark shadow"
              id="chat3"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
                    <div className="p-3">
                      <div
                        data-mdb-perfect-scrollbar="true"
                        style={{ position: "relative", height: "400px" }}
                      >
                        <ul>
                          <p>persona list??</p>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-7 col-xl-8 p-3">
                    <div
                      className="p-3 overflow-auto bg-chat-dark"
                      style={{
                        position: "relative",
                        height: "400px",
                        // boxShadow: "inset 0 0 5px #000000",
                      }}
                    >
                      {Array.isArray(chatHistory) ? (
                        chatHistory.map((msg) => (
                          <div
                            key={msg._id}
                            className={`d-flex ${
                              msg.role === "user"
                                ? "justify-content-end"
                                : "justify-content-start"
                            }`}
                          >
                            {msg.role === "assistant" && (
                              <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                alt="avatar"
                                style={{ width: "45px", height: "100%" }}
                              />
                            )}
                            <div
                              className="mt-1 pt-2 px-3 fs-6 d-inline-block"
                              style={{ maxWidth: "75%" }}
                            >
                              <div
                                className={`p-2 ${
                                  msg.role === "user"
                                    ? "bg-chat-green shadow"
                                    : "bg-white shadow"
                                }`}
                              >
                                <strong>{msg.role}:</strong>{" "}
                                {msg.role === "user"
                                  ? "You"
                                  : selectedPersona.name}
                                : {msg.message}
                              </div>
                              <p className="small rounded-3 text-muted float-end">
                                12:00 PM | Aug 13
                                {/* Replace with real date and time */}
                              </p>
                            </div>
                            {msg.role === "user" && (
                              <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                alt="avatar"
                                style={{ width: "45px", height: "100%" }}
                              />
                            )}
                          </div>
                        ))
                      ) : (
                        <div>Error: chatHistory is not an array</div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                    <div className="text-muted d-flex justify-content-start align-items-center mt-2">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                        alt="avatar 3"
                        style={{ width: "40px", height: "100%" }}
                      />

                      <form
                        onSubmit={handleSubmit}
                        id="create-presentation-form"
                        className="mt-auto p-4 w-100 d-flex justify-content-end"
                      >
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control border-0 form-floating bg-chat-dark text-white"
                            required
                            onChange={handleUserMessageChange}
                            onKeyDown={handleKeyPress}
                            value={userMessage}
                            id="chat3"
                            placeholder="Type message"
                          />
                          <button
                            className="btn btn-outline-light"
                            type="button"
                            id="button-addon2"
                            onClick={handleSubmit}
                          >
                            Send
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BotChat;
