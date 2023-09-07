import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import PersonaList from "./PersonaList"; // Import the PersonaList component

function ChatComponent({ selectedPersona, userId, onSelectPersona }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const isFetching = useRef(false);
  userId = "user1";

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await fetch("http://localhost:8000/chat/get_personas");
        const personas = await response.json();
        if (personas && personas.length > 0 && !selectedPersona) {
          onSelectPersona(personas[0]); // Set the first persona as the selectedPersona
        }
      } catch (error) {
        console.error("Error fetching personas:", error);
      }
    };

    fetchPersonas();
  }, [onSelectPersona, selectedPersona]);

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
    setNewMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleDeleteHistory = async () => {
    if (!selectedPersona) {
      console.error("Error: selectedPersona is null");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/chat/delete_chat_history?user_id=${userId}&persona_name=${selectedPersona.name}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setChatHistory([]);
    } catch (error) {
      console.error("Error deleting chat history:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleSendMessage = async () => {
    if (!selectedPersona) {
      console.error("Error: selectedPersona is null");
      return;
    }

    try {
      const userMessage = {
        role: "user",
        message: newMessage,
      };
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
        },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory, selectedPersona, userId]);

  return (
    <section className="bg-chat-green vh-100">
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
                        <PersonaList onSelectPersona={onSelectPersona} />
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
                      {chatHistory.map((msg, index) => {
                        return (
                          <div
                            key={index}
                            className={`d-flex ${
                              msg.role === "user"
                                ? "justify-content-end"
                                : "justify-content-start"
                            }`}
                          >
                            {msg.role === "assistant" && selectedPersona && (
                              <img
                                src={
                                  selectedPersona.avatar ||
                                  "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                }
                                alt="avatar"
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  borderRadius: "50%",
                                }}
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
                                <strong>{msg.role}:</strong> {msg.message}
                              </div>
                            </div>
                            {msg.role === "user" && (
                              <img
                                src="https://robohash.org/6PY.png?set=set4"
                                alt="avatar"
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  borderRadius: "50%",
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="text-muted d-flex justify-content-start align-items-center mt-2">
                      <img
                        src="https://robohash.org/6PY.png?set=set4"
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
                            className="form-control border-0 form-floating bg-chat-dark text-white me-2"
                            required
                            onChange={handleUserMessageChange}
                            onKeyDown={handleKeyPress}
                            value={newMessage} // Changed this line to reflect the correct state
                            id="chat3"
                            placeholder="Type message"
                          />
                          <button
                            className="btn btn-outline-light me-2"
                            type="button"
                            id="button-addon2"
                            onClick={handleSubmit}
                          >
                            Send
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            type="button"
                            id="button-addon3"
                            onClick={handleDeleteHistory}
                          >
                            Delete History
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

ChatComponent.propTypes = {
  selectedPersona: PropTypes.object,
  userId: PropTypes.string.isRequired,
  onSelectPersona: PropTypes.func.isRequired,
};

export default ChatComponent;
