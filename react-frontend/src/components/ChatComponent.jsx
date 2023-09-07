import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import PersonaList from "./PersonaList";

function ChatComponent({ selectedPersona, userId }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const isFetching = useRef(false);
  userId = "user1";

  const messagesEndRef = useRef(null);

  const fetchChatHistory = useCallback(async () => {
    if (!selectedPersona || isFetching.current) {
      return;
    }

    isFetching.current = true;

    try {
      const response = await fetch(
        `http://localhost:8000/chat/get_chat_history?user_id=${userId}&persona_name=${selectedPersona.name}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setChatHistory(data);
      } else {
        console.error("Error: chat history data format is incorrect", data);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      isFetching.current = false;
    }
  }, [userId, selectedPersona]);

  const handleUserMessageChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleSendMessage = async () => {
    try {
      const userMessage = {
        role: "user",
        message: newMessage,
        timestamp: new Date().toISOString(),
      };
      console.log("NewMESSAGEEEEEE", userMessage);
      const response = await fetch("http://localhost:8000/chat/send_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          persona_name: selectedPersona.name,
          message: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setChatHistory((prevChatHistory) => [
        ...(Array.isArray(prevChatHistory) ? prevChatHistory : []),
        userMessage,
        {
          role: "assistant",
          message: data.response.message,
          timestamp: data.response.timestamp,
        },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory, selectedPersona, userId]);

  return (
    <div>
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
                            <PersonaList />
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
                        }}
                      >
                        {chatHistory.map((message) => {
                          console.log("Rendering Message:", message);
                          return (
                            <div
                              key={message._id}
                              className={`d-flex ${
                                message.role === "user"
                                  ? "justify-content-end"
                                  : "justify-content-start"
                              }`}
                            >
                              {message.role === "assistant" && (
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
                                    message.role === "user"
                                      ? "bg-chat-green shadow"
                                      : "bg-white shadow"
                                  }`}
                                >
                                  <strong>{message.role}:</strong>{" "}
                                  {message.role === "user"
                                    ? message.user_message
                                    : message.chatbot_reply}
                                </div>
                                <p className="small rounded-3 text-muted float-end">
                                  12:00 PM | Aug 13
                                </p>
                              </div>
                              {message.role === "user" && (
                                <img
                                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                  alt="avatar"
                                  style={{ width: "45px", height: "100%" }}
                                />
                              )}
                            </div>
                          );
                        })}

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
    </div>
  );
}

ChatComponent.propTypes = {
  selectedPersona: PropTypes.object,
  userId: PropTypes.string.isRequired,
};

export default ChatComponent;
