import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

function PersonaList({ onSelectPersona }) {
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/chat/get_personas")
      .then((response) => response.json())
      .then((data) => setPersonas(data));
  }, []);

  return (
    <div
      data-mdb-perfect-scrollbar="true"
      style={{ position: "relative", height: "400px" }}
    >
      <ul>
        {personas.map((persona, index) => (
          <li
            key={persona.name}
            className={`p-2 ${
              index === personas.length - 1 ? "" : "border-bottom"
            } bg-chat-dark`}
            onClick={() => onSelectPersona(persona)}
          >
            <a href="#!" className="d-flex justify-content-between">
              <div className="d-flex flex-row text-white">
                <div>
                  <img
                    src={persona.avatar}
                    alt="avatar"
                    className="d-flex align-self-center me-3"
                    style={{
                      width: "60px",
                      borderRadius: "50%",
                    }}
                  />
                  <span className="badge bg-success badge-dot"></span>
                </div>
                <div className="pt-1">
                  <p className="fw-bold mb-0">{persona.name}</p>
                  <p className="small">{persona.short_description}</p>
                </div>
              </div>
              <div className="pt-1">
                <p className="small mb-1 text-white">Just now</p>
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
