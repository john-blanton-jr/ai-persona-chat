import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

function PersonaList({ onSelectPersona }) {
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const firstUpdate = useRef(true);

  useEffect(() => {
    fetch("http://localhost:8000/chat/get_personas")
      .then((response) => response.json())
      .then((data) => {
        setPersonas(data);
        if (data.length > 0 && firstUpdate.current) {
          onSelectPersona(data[0]);
          setSelectedPersona(data[0].name);
          firstUpdate.current = false;
        }
      });
  }, [onSelectPersona]);

  const handleSelectPersona = (persona) => {
    onSelectPersona(persona);
    setSelectedPersona(persona.name);
  };

  return (
    <div
      data-mdb-perfect-scrollbar="true"
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <ul className="w-100 ps-2">
        {personas.map((persona, index) => (
          <li
            key={persona.name}
            className={`p-2 ${
              index === personas.length - 1 ? "" : "border-bottom"
            } ${
              selectedPersona === persona.name
                ? "bg-selected-persona border border-white border-3"
                : "bg-chat-dark"
            }`}
            onClick={() => handleSelectPersona(persona)}
          >
            <a
              href="#!"
              className="d-flex justify-content-between text-decoration-none"
            >
              <div className="d-flex flex-row text-white">
                <div>
                  <img
                    src={persona.avatar}
                    alt="avatar"
                    className="d-flex align-self-center me-3 bg-light "
                    style={{
                      width: "80px",
                      borderRadius: "50%",
                    }}
                  />
                  <span className="badge bg-success badge-dot"></span>
                </div>
                <div className="pt-1">
                  <p className="mb-0 persona-title">{persona.name}</p>
                  <p className="fs-6">{persona.short_description}</p>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

PersonaList.propTypes = {
  onSelectPersona: PropTypes.func.isRequired,
};

export default PersonaList;
