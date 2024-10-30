/* General Styles */
body {
    margin: 0;
    font-family: 'Montserrat', sans-serif;
    background-color: #f5f0ff;
    color: #4b0082;
    overflow-x: hidden;
}

h1, h2, p, ul, li {
    margin: 0;
    padding: 0;
}

a {
    text-decoration: none;
    color: inherit;
}

button {
    border: none;
    border-radius: 25px;
    padding: 15px 30px;
    background-color: #d1c4e9;
    color: #4b0082;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.3s;
}

/* Glowing effect for 'Click to Start' button */
#start-button {
    animation: glow 1.5s infinite;
}

@keyframes glow {
    0% {
        box-shadow: 0 0 5px #d1c4e9;
    }
    50% {
        box-shadow: 0 0 20px #8a2be2;
    }
    100% {
        box-shadow: 0 0 5px #d1c4e9;
    }
}

button:hover {
    transform: scale(1.05);
}

/* Landing Page */
#landing-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

/* Intro Animation */
#intro-animation {
    display: none;
    text-align: center;
    margin-top: 20vh;
}

#intro-animation h1 {
    font-size: 3em;
    overflow: hidden;
    white-space: nowrap;
    border-right: 0.15em solid #8a2be2;
    margin: 0 auto;
    width: 0;
}

@keyframes typing {
    from { width: 0; }
    to { width: 100%; }
}

@keyframes blink {
    from, to { border-color: transparent; }
    50% { border-color: #8a2be2; }
}

/* Navigation */
nav {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #f5f0ff;
    padding: 10px 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
}

nav ul {
    display: flex;
    list-style: none;
}

nav li {
    margin: 0 15px;
}

nav a {
    font-size: 18px;
    padding: 10px 15px;
    border-radius: 20px;
    transition: background-color 0.3s;
}

nav a:hover {
    background-color: #d1c4e9;
}

/* Hero Section */
#hero {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    position: relative;
}

#hero h1 {
    font-size: 4em;
    text-align: center;
}

#dynamic-text {
    color: #8a2be2;
}

/* Page Sections */
.page-section {
    padding: 100px 20px;
    min-height: 100vh;
}

.page-section:nth-child(even) {
    background-color: #e1d7f0;
}

/* Projects Section */
.project-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.project-btn {
    width: 200px;
}

/* Project Details */
#project-details {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(245, 240, 255, 0.95);
    padding: 50px;
    overflow-y: auto;
}

#project-details h2 {
    text-align: center;
}

#project-details ul {
    margin-top: 20px;
}

#project-details .back-button {
    position: fixed;
    top: 20px;
    left: 20px;
    background-color: transparent;
    font-size: 30px;
    cursor: pointer;
}

/* Contact Form */
#contact-form {
    display: flex;
    flex-direction: column;
    max-width: 500px;
    margin: 0 auto;
}

#contact-form input, #contact-form textarea {
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ccc;
}

#contact-form button {
    align-self: center;
}

/* Animations */
.typing {
    animation: typing 2s steps(40, end), blink 0.75s step-end infinite;
    width: 100%;
}

.small {
    font-size: 2em;
    opacity: 0.7;
    transition: font-size 0.5s, opacity 0.5s;
}

/* Responsive */
@media (max-width: 768px) {
    #intro-animation h1 {
        font-size: 2em;
    }

    #hero h1 {
        font-size: 2.5em;
    }
}
