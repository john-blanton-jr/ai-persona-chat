import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import PersonaList from "./PersonaList"; // Import the PersonaList component

function ChatComponent({
  selectedPersona,
  userId: initialUserId,
  onSelectPersona,
}) {
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(initialUserId || "user1");
  const isFetching = useRef(false);
  const [personaDescription, setPersonaDescription] = useState("");
  const messagesEndRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("700px");
  const [chatWindowHeight, setChatWindowHeight] = useState("600px");
  const [tempMessage, setTempMessage] = useState("");

  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth <= 992) {
        setMaxHeight("300px");
        setChatWindowHeight("400px");
      } else {
        setMaxHeight("700px");
        setChatWindowHeight("600px");
      }
    };

    window.addEventListener("resize", updateDimensions);

    updateDimensions();

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await fetch("http://localhost:8000/chat/get_personas");
        const personas = await response.json();
        if (personas && personas.length > 0 && !selectedPersona) {
          onSelectPersona(personas[0]);
          setPersonaDescription(personas[0].description); // Set the persona description here
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
        console.log("HEREEEEE!!!!!", data);
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

    setTempMessage(newMessage); // Store the current message temporarily
    setNewMessage(""); // Clear the input field immediately

    try {
      const userMessage = {
        role: "user",
        message: newMessage,
      };

      const requestBody = {
        user_id: userId,
        persona_name: selectedPersona.name,
        message: newMessage,
        persona_description: personaDescription,
      };

      console.log("Request Body:", requestBody); // Log the request body to verify the values

      const response = await fetch("http://localhost:8000/chat/send_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.response) {
        setChatHistory((prevChatHistory) => [
          ...(Array.isArray(prevChatHistory) ? prevChatHistory : []),
          userMessage,
          {
            role: "assistant",
            message: data.response.message,
          },
        ]);

        setTempMessage(""); // Clear the temporary message as it has been successfully sent
      } else {
        console.error("Unexpected response format:", data);
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setNewMessage(tempMessage); // Restore the message from the temporary storage in case of an error
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory, userId]);

  useEffect(() => {
    if (selectedPersona) {
      setPersonaDescription(selectedPersona.description);
    }
  }, [selectedPersona]);

  return (
    <section className="bg-chat-green" style={{ minHeight: "100vh" }}>
      <div className="container py-5">
        <div className="card-body p-0">
          <div
            className="bg-chat-outer-dark"
            style={{
              borderRadius: "15px",
              padding: "10px",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            <h1 style={{ color: "#FFFFFF" }} className="title-text">
              AI Persona Chat
            </h1>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div
                className="card bg-chat-outer-dark shadow"
                id="chat3"
                style={{ borderRadius: "15px" }}
              >
                <div className="card-body">
                  <div className="row d-flex flex-column flex-lg-row justify-content-around">
                    <div className="col-lg-5 col-xl-4 mb-4 mb-lg-0 d-flex align-items-center p-3">
                      <div className="w-100 d-flex justify-content-center">
                        <div
                          style={{
                            maxWidth: "500px",
                            width: "100%",
                            maxHeight: maxHeight,
                            overflowY: "auto",
                          }}
                          className="h-100 h-lg-50"
                        >
                          <PersonaList onSelectPersona={onSelectPersona} />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-7 col-xl-8 p-3">
                      <div
                        className="p-3 overflow-auto bg-chat-dark"
                        style={{
                          position: "relative",
                          height: chatWindowHeight,
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
                                  src={selectedPersona.avatar}
                                  alt="avatar"
                                  className="bg-light"
                                  style={{
                                    width: "65px",
                                    height: "65px",
                                    borderRadius: "50%",
                                  }}
                                />
                              )}
                              <div
                                className="mt-1 pt-2 px-3 fs-6 d-inline-block my-3"
                                style={{ maxWidth: "75%" }}
                              >
                                <div
                                  className={`p-2 ${
                                    msg.role === "user"
                                      ? "bg-chat-green shadow"
                                      : "bg-white shadow"
                                  }`}
                                >
                                  {msg?.message}
                                </div>
                              </div>
                              {msg.role === "user" && (
                                <img
                                  src="https://robohash.org/6PY.png?set=set4"
                                  className="bg-light"
                                  alt="avatar"
                                  style={{
                                    width: "65px",
                                    height: "65px",
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
                          className="bg-light"
                          src="https://robohash.org/6PY.png?set=set4"
                          alt="avatar 3"
                          style={{ width: "50px", borderRadius: "50%" }}
                        />
                        <form
                          onSubmit={handleSubmit}
                          id="create-presentation-form"
                          className="mt-auto p-4 w-100 d-flex justify-content-end flex-column flex-md-row"
                        >
                          <div className="input-group flex-grow-1">
                            <input
                              type="text"
                              className="form-control border-0 form-floating bg-chat-dark text-white me-2"
                              required
                              onChange={handleUserMessageChange}
                              onKeyDown={handleKeyPress}
                              value={newMessage}
                              id="chat3"
                              placeholder="Type message"
                            />
                          </div>
                          <div className="d-flex flex-column flex-md-row mt-2 mt-md-0 text-center">
                            <div className="col-12 col-md-6 p-0 pe-md-2">
                              <button
                                className="btn btn-outline-light w-100"
                                type="button"
                                id="button-addon2"
                                onClick={handleSubmit}
                              >
                                Send
                              </button>
                            </div>
                            <div className="col-12 col-md-6 p-0 pt-2 pt-md-0">
                              <button
                                className="btn btn-danger"
                                type="button"
                                id="button-addon3"
                                onClick={handleDeleteHistory}
                              >
                                Delete History
                              </button>
                            </div>
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
        <div
          className="bg-chat-outer-dark d-flex text-white justify-content-around flex-wrap p-4"
          style={{
            borderRadius: "15px",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <div className="col-12 col-lg-4 p-1 text-center">
            <p className="">
              Robots lovingly delivered by <br />
              <a
                href="https://robohash.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Robohash.org
              </a>
            </p>
            <a
              href="https://robohash.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://robohash.org/855.png?set=set5"
                alt="robohash avatar"
                className="w-50"
              />
            </a>
          </div>
          <div className="col-12 col-lg-8 p-1 ">
            <h4>What am I?</h4>
            <p>
              Hello, explorers of the digital frontier! I am your friendly
              neighborhood chatbot, here to keep you company, assist you, or
              even be your virtual confidant. I wear many hats, or should I say,
              personas, each designed to cater to your unique preferences and
              needs. Whether you're in the mood for a friendly chat or seeking
              assistance with tasks, I've got a persona just for you. Dive into
              the world of AI and experience a conversation like no other. I am
              here for everyone who is curious to witness the blend of
              technology and personality, right at their fingertips. Let's chat,
              shall we?
            </p>
            <p>Written by ChatGPT, your AI-powered Conversation Maestro</p>
          </div>
        </div>
      </div>
    </section>
  );
}

ChatComponent.propTypes = {
  selectedPersona: PropTypes.object,
  initialUserId: PropTypes.string.isRequired,
  onSelectPersona: PropTypes.func.isRequired,
};

export default ChatComponent;
