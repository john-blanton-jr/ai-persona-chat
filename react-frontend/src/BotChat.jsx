import React, { useState, useEffect, useRef } from "react";

function BotChat() {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [userId, setUserId] = useState("64efbce7689387e5ace5542e");
  const [personaId, setPersonaId] = useState("64efbd37689387e5ace5542f");
  const messagesEndRef = useRef(null);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create the URL with query parameters for user_id and persona_id
    const chatUrl = `http://localhost:8000/chat/?user_id=${userId}&persona_id=${personaId}`;

    // Prepare the data object; only including the latest user_message
    const data = {
      user_message: userMessage,
    };

    // Fetch config; notice the body only contains the user_message
    const fetchConfig = {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Update the chat history with the user's message
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { role: "user", content: userMessage, isActive: true },
    ]);

    // Clear the input field
    setUserMessage("");

    // Perform the fetch
    const messageResponse = await fetch(chatUrl, fetchConfig);
    if (messageResponse.ok) {
      const response = await messageResponse.json();
      const botMessageContent = response.chatbot_reply;
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { role: "assistant", content: botMessageContent, isActive: true },
        console.log("CHAT HISTORY:", chatHistory),
      ]);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const chatUrl = `http://localhost:8000/get_chat_history/?user_id=${userId}&persona_id=${personaId}`;
        const response = await fetch(chatUrl);
        if (response.ok) {
          const data = await response.json();
          const transformedChatHistory = data.chat_history.map((chat) => {
            const commonProps = {
              _id: chat._id, // Include this
              isActive: true,
            };

            if (chat.user_message) {
              return {
                ...commonProps,
                role: "user",
                content: chat.user_message,
              };
            } else {
              return {
                ...commonProps,
                role: "assistant",
                content: chat.chatbot_reply,
              };
            }
          });
          setChatHistory(transformedChatHistory || []);
        }
      } catch (error) {
        console.error("There was a problem fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [personaId, userId]);
  return (
    // <div dangerouslySetInnerHTML={{ __html: persona.avatar_svg }} />
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
                        <ul className="list-unstyled mb-0">
                          {/* Marie Horwitz Chat Item */}
                          <li className="p-2 border-bottom bg-chat-dark">
                            <a
                              href="#!"
                              className="d-flex justify-content-between"
                            >
                              <div className="d-flex flex-row  text-white">
                                <div>
                                  <img
                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                    alt="avatar"
                                    className="d-flex align-self-center me-3"
                                    width="60"
                                  />
                                  <span className="badge bg-success badge-dot"></span>
                                </div>
                                <div className="pt-1">
                                  <p className="fw-bold mb-0">Marie Horwitz</p>
                                  <p className="small">Hello, Are you there?</p>
                                </div>
                              </div>
                              <div className="pt-1">
                                <p className="small mb-1  text-white">
                                  Just now
                                </p>
                                <span className="badge bg-danger rounded-pill float-end">
                                  3
                                </span>
                              </div>
                            </a>
                          </li>
                          {/* Alexa Chung Chat Item */}
                          <li className="p-2 border-bottom">
                            <a
                              href="#!"
                              className="d-flex justify-content-between"
                            >
                              <div className="d-flex flex-row text-white">
                                <div>
                                  <img
                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                                    alt="avatar"
                                    className="d-flex align-self-center me-3"
                                    width="60"
                                  />
                                  {/* <span className="badge bg-warning badge-dot"></span> */}
                                </div>
                                <div className="pt-1">
                                  <p className="fw-bold mb-0">Alexa Chung</p>
                                  <p className="small ">
                                    Lorem ipsum dolor sit.
                                  </p>
                                </div>
                              </div>
                              <div className="pt-1">
                                <p className="small text-white mb-1">
                                  5 mins ago
                                </p>
                                <span className="badge bg-danger rounded-pill float-end">
                                  2
                                </span>
                              </div>
                            </a>
                          </li>
                          {/* Danny McChain Chat Item */}
                          <li className="p-2 border-bottom">
                            <a
                              href="#!"
                              className="d-flex justify-content-between"
                            >
                              <div className="d-flex flex-row text-white">
                                <div>
                                  <img
                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                                    alt="avatar"
                                    className="d-flex align-self-center me-3"
                                    width="60"
                                  />
                                  <span className="badge bg-success badge-dot"></span>
                                </div>
                                <div className="pt-1">
                                  <p className="fw-bold mb-0">Danny McChain</p>
                                  <p className="small">
                                    Lorem ipsum dolor sit.
                                  </p>
                                </div>
                              </div>
                              <div className="pt-1">
                                <p className="small text-white mb-1">
                                  Yesterday
                                </p>
                              </div>
                            </a>
                          </li>
                          {/* Ashley Olsen Chat Item */}
                          <li className="p-2 border-bottom">
                            <a
                              href="#!"
                              className="d-flex justify-content-between"
                            >
                              <div className="d-flex flex-row text-white">
                                <div>
                                  <img
                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                                    alt="avatar"
                                    className="d-flex align-self-center me-3"
                                    width="60"
                                  />
                                  <span className="badge bg-danger badge-dot"></span>
                                </div>
                                <div className="pt-1">
                                  <p className="fw-bold mb-0">Ashley Olsen</p>
                                  <p className="small">
                                    Lorem ipsum dolor sit.
                                  </p>
                                </div>
                              </div>
                              <div className="pt-1">
                                <p className="small text-white mb-1">
                                  Yesterday
                                </p>
                              </div>
                            </a>
                          </li>
                          {/* Kate Moss Chat Item */}
                          <li className="p-2 border-bottom">
                            <a
                              href="#!"
                              className="d-flex justify-content-between"
                            >
                              <div className="d-flex flex-row text-white">
                                <div>
                                  <img
                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                                    alt="avatar"
                                    className="d-flex align-self-center me-3"
                                    width="60"
                                  />
                                  <span className="badge bg-warning badge-dot"></span>
                                </div>
                                <div className="pt-1">
                                  <p className="fw-bold mb-0">Kate Moss</p>
                                  <p className="small">
                                    Lorem ipsum dolor sit.
                                  </p>
                                </div>
                              </div>
                              <div className="pt-1">
                                <p className="small text-white mb-1">
                                  Yesterday
                                </p>
                              </div>
                            </a>
                          </li>
                          {/* Ben Smith Chat Item */}
                          <li className="p-2">
                            <a
                              href="#!"
                              className="d-flex justify-content-between"
                            >
                              <div className="d-flex flex-row text-white">
                                <div>
                                  <img
                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                    alt="avatar"
                                    className="d-flex align-self-center me-3"
                                    width="60"
                                  />
                                  <span className="badge bg-success badge-dot"></span>
                                </div>
                                <div className="pt-1">
                                  <p className="fw-bold mb-0">Ben Smith</p>
                                  <p className="small">
                                    Lorem ipsum dolor sit.
                                  </p>
                                </div>
                              </div>
                              <div className="pt-1">
                                <p className="small text-white mb-1">
                                  Yesterday
                                </p>
                              </div>
                            </a>
                          </li>
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
                      {chatHistory.map((message) => (
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
                              <strong>{message.role}:</strong> {message.content}
                            </div>
                            <p className="small rounded-3 text-muted float-end">
                              12:00 PM | Aug 13{" "}
                              {/* Replace with real date and time */}
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
                      ))}

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
                        <input
                          type="text"
                          placeholder="User ID"
                          value={userId}
                          onChange={handleUserIdChange}
                        />
                        <input
                          type="text"
                          placeholder="Persona ID"
                          value={personaId}
                          onChange={handlePersonaIdChange}
                        />
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
