<a name="readme-top"></a>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1>AI Persona Chat</h1>
  </a>

  <h3 align="center">A Multi-Persona AI Chatbot</h3>

</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

## Overview
The Multi-Persona AI Chatbot is a user-friendly platform that allows users to interact with AI through various predefined personas. Depending on the selected persona, the chatbot can function as a friendly companion or a helpful assistant. The project utilizes React for the frontend and FastAPI for the backend, encapsulated within a Docker container for streamlined deployment and scalability.

## Features
### <ins>Persona Selection:</ins>

**Persona Gallery**: A feature that allows users to choose from different personas, each with a distinct style of interaction.

**Dynamic Interaction**: The chatbot modifies its responses based on the chosen persona, offering a varied chat experience.
<br>
<br>
### <ins>Chat Interface:</ins>

**Responsive Design**: A flexible interface that adapts to different device screens, enhancing user engagement.

**Real-Time Chat**: A chat window that supports real-time conversation with the selected persona, complemented with appropriate avatars and message formats.
<br>
<br>
### <ins>Backend Integration:</ins>

**API Integration**: The backend, developed with FastAPI, manages persona data and chat history efficiently.

**Error Handling**: Mechanisms in place to handle errors and ensure a smooth user experience.
<br>
<br>
### <ins>Customizable Settings:</ins>

**User Profiles**: Users can create and manage profiles to personalize their interactions with the chatbot.

**Chat History Management**: A feature that enables users to manage their chat history, including options to delete previous conversations.
<br>
<br>
### <ins>Chat History:</ins>

**MongoDB Integration**: The project utilizes MongoDB to manage chat histories securely, facilitating quick data retrieval and management.

**History Deletion**: Users can delete chat history, ensuring privacy and data security.
<br>
<br>
## Development Process

- The project began with the establishment of a React frontend, integrated with APIs for persona data and chat history management.

- Various components such as PersonaList and ChatComponent were developed to build a cohesive application.

- The application was designed to adapt to different devices, adjusting layout and elements based on screen size.

- The development process included testing phases to identify and fix bugs, ensuring a seamless user experience.

- Feedback was incorporated to enhance functionalities and improve UI elements.
<br>
<br>

## Collaborative Development

This project was undertaken individually, showcasing the ability to manage and execute a comprehensive development project independently.


## Technologies Used

- Frontend: React, Bootstrap for responsive design
- Backend: FastAPI
- Database: MongoDB for chat history storage
- Containerization: Docker Compose for orchestrating multi-container Docker applications


## Conclusion

The Multi-Persona AI Chatbot offers a unique platform for users to experience AI chat with a personalized touch. It combines technology and predefined persona models to provide a varied and engaging chat experience.


<br>
<br>
<br>
![Autotrackr screenshot](/images/persona_chat_screenshot_01.png "Boilerplate FIles")
![Autotrackr screenshot](/images/persona_chat_screenshot_02.png "Boilerplate FIles")
![Autotrackr screenshot](/images/persona_chat_screenshot_03.png "Boilerplate FIles")
![Autotrackr screenshot](/images/persona_chat_screenshot_04.png "Boilerplate FIles")

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Built With

* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) - Frontend library for building user interfaces.
* ![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white) - Frontend toolkit for developing with HTML, CSS, and JS.
* ![FastAPI](https://img.shields.io/badge/fastapi-109989?style=for-the-badge&logo=FASTAPI&logoColor=white) - A modern, high-performance web framework for building APIs with Python.
* ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) - NoSQL database for storing chat histories.
* ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) - Platform to build, deploy, and manage containerized applications.
* ![Robohash](https://img.shields.io/badge/Robohash-%237589C7.svg?style=for-the-badge&logo=robohash&logoColor=white) - API for generating unique, robot-themed avatars.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Fork and clone repository

### Prerequisites

Install Docker

### Installation


1. Clone the repo
   ```sh
   git clone https://gitlab.com/johnbjr76/Autotrackr.git
   ```
2. Create the database volume in docker
   ```sh
   docker volume create beta-data
   ```
3. Build the Docker images
   ```sh
   docker-compose build
   ```
4. Start the Docker containers
   ```sh
   docker-compose up
   ```


<!-- USAGE EXAMPLES -->
## Usage

Can be used or adapted any way you would like. Feel free to clone and change it up to your specifications. 


<!-- ROADMAP -->
## Roadmap

No roadmap or future support planned.  Any questions feel free to send me an email hello@johnblanton.com.



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.


<!-- CONTACT -->
## Contact

John Blanton - hello@johnblanton.com

Project Link: [https://gitlab.com/johnbjr76/Autotrackr](https://gitlab.com/johnbjr76/Autotrackr)


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Markdown Badges](https://github.com/Ileriayo/markdown-badges)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)


<p align="right">(<a href="#readme-top">back to top</a>)</p>
