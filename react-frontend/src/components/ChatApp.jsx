import React, { useState } from "react";
import PersonaList from "./PersonaList";
import ChatComponent from "./ChatComponent";

function ChatApp() {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const userId = "64f8de878ff76eb958d12fa2";
  const handleSelectPersona = (persona) => {
    setSelectedPersona(persona);
  };

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
                      <PersonaList onSelectPersona={handleSelectPersona} />
                    </div>
                  </div>
                  {selectedPersona && (
                    <ChatComponent
                      selectedPersona={selectedPersona}
                      userId={userId}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChatApp;
