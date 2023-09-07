import React, { useState } from "react";
import ChatComponent from "./ChatComponent";

function ChatApp() {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const userId = "64f8de878ff76eb958d12fa2";
  const handleSelectPersona = (persona) => {
    setSelectedPersona(persona);
  };

  return (
    <div>
      <ChatComponent
        selectedPersona={selectedPersona}
        initialUserId={userId}
        onSelectPersona={handleSelectPersona}
      />
    </div>
  );
}

export default ChatApp;
