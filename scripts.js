// Landing Page Start Button
document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('intro-animation').style.display = 'block';
    startIntroAnimation();
});

// Intro Animation Text Lines
const lines = [
    'Hello there,',
    "I'm Rain Zhang,",
    'I turn ideas into seamless, dynamic digital experiences'
];

let currentLine = 0;

function startIntroAnimation() {
    const lineElements = [
        document.getElementById('line1'),
        document.getElementById('line2'),
        document.getElementById('line3')
    ];

    function showNextLine() {
        if (currentLine < lines.length) {
            const currentElement = lineElements[currentLine];
            currentElement.textContent = lines[currentLine];
            currentElement.classList.add('typing');

            // After typing animation completes
            currentElement.addEventListener('animationend', function handler() {
                currentElement.classList.remove('typing');
                currentElement.removeEventListener('animationend', handler);

                if (currentLine > 0) {
                    lineElements[currentLine - 1].classList.add('small');
                }

                currentLine++;
                setTimeout(showNextLine, 500);
            });
        } else {
            // Transition to main content
            setTimeout(() => {
                document.getElementById('intro-animation').style.display = 'none';
                document.querySelector('nav').style.display = 'flex';
                document.getElementById('main-content').style.display = 'block';
            }, 1000);
        }
    }

    showNextLine();
}

// Dynamic Text in Hero Section
const dynamicTexts = ['Rain Zhang', 'a current computing science student'];
let dynamicIndex = 0;
const dynamicTextElement = document.getElementById('dynamic-text');

function typeDynamicText() {
    let charIndex = 0;
    let currentText = dynamicTexts[dynamicIndex];

    function typeChar() {
        if (charIndex < currentText.length) {
            dynamicTextElement.textContent += currentText.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 100);
        } else {
            setTimeout(eraseDynamicText, 2000);
        }
    }

    function eraseDynamicText() {
        if (charIndex > 0) {
            dynamicTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(eraseDynamicText, 50);
        } else {
            dynamicIndex = (dynamicIndex + 1) % dynamicTexts.length;
            currentText = dynamicTexts[dynamicIndex];
            setTimeout(typeChar, 500);
        }
    }

    typeChar();
}

typeDynamicText();

// Smooth Scrolling
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetSection = document.querySelector(this.getAttribute('href'));
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Project Buttons Event Listeners
document.querySelectorAll('.project-btn').forEach(button => {
    button.addEventListener('click', () => {
        showProjectDetails(button.getAttribute('data-project'));
    });
});

// Show Project Details
function showProjectDetails(project) {
    const projectDetails = {
        'playlist': {
            title: 'Play List Generator (C++)',
            date: 'September 2024',
            points: [
                'Developed a class using a singly linked list to store the data of each song.',
                'Implemented public methods such as insertion, removal, and swapping of songs, enabling manipulations of the play list through user input.',
                'Incorporated dynamic memory management and error handling, while validating user input to prevent runtime errors.'
            ]
        },
        'coinsorter': {
            title: 'Coin Sorter (C)',
            date: 'March 2024',
            points: [
                'Implemented a C program that simulates the operations of a terminal-based coin sorting machine, categorizing coin types based on data such as sizes and values.',
                'Incorporated error handling to validate data input, prevent program crashes, and managing unexpected user inputs.',
                'Utilized dynamic memory management and handled file input and output, allowing the program to process data from configuration files.'
            ]
        },
        'languageapp': {
            title: 'Language Learning App (Python)',
            date: 'December 2023',
            points: [
                'Developed a terminal-based application that simulates the functions of an actual application.',
                'Implemented features that analyze graphics, audio, and text files.',
                'Created features that mimic app-like behaviors for learning, examining, and playing, maintaining ideal user experience within a terminal environment.'
            ]
        }
    };

    const projectInfo = projectDetails[project];

    const projectDiv = document.getElementById('project-details');
    projectDiv.innerHTML = `
        <button class="back-button">&larr;</button>
        <h2>${projectInfo.title}</h2>
        <p><em>${projectInfo.date}</em></p>
        <ul>
            ${projectInfo.points.map(point => `<li>${point}</li>`).join('')}
        </ul>
    `;

    projectDiv.style.display = 'block';

    document.querySelector('.back-button').addEventListener('click', () => {
        projectDiv.style.display = 'none';
    });
}

// Contact Form Submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(this);

    // Placeholder for sending email (requires backend)
    alert('Thank you for your message!');

    // Reset form
    this.reset();
});

// Background Shapes Animation (Using Canvas)
const canvas = document.getElementById('background-shapes');
const ctx = canvas.getContext('2d');
let width, height, hexagon;

function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    hexagon = {
        x: width / 2,
        y: height / 2,
        size: 100,
        angle: 0
    };
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(hexagon.x, hexagon.y);
    ctx.rotate(hexagon.angle);
    ctx.beginPath();

    for (let i = 0; i < 6; i++) {
        ctx.lineTo(hexagon.size * Math.cos(i * Math.PI / 3), hexagon.size * Math.sin(i * Math.PI / 3));
    }

    ctx.closePath();
    ctx.strokeStyle = '#8a2be2';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();

    hexagon.angle += 0.01;

    requestAnimationFrame(draw);
}

window.addEventListener('resize', initCanvas);

initCanvas();
draw();
