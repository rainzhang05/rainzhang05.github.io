// Typewriter Effect
const INTRO_GREETING = "Hello, I'm Rain Zhang"
/* After intro layout runs, wait before showing the line-1 caret so it follows the terminal appearing. */
const INTRO_AFTER_TERMINAL_FIRST_CARET_MS = 200
const INTRO_BEFORE_LINE1_TYPE_MS = 600
const INTRO_LINE1_TYPE_SPEED_MS = 66
const INTRO_AFTER_GREETING_PAUSE_MS = 500
const INTRO_BEFORE_LINE2_TYPE_MS = 300
const INTRO_LINE2_TYPE_SPEED_MS = 52
const INTRO_LINE2_WORD_HOLD_MS = 1700
const INTRO_LINE2_BETWEEN_WORDS_MS = 250
const INTRO_CYCLING_WORDS = [
    "Computer Science undergraduate",
    "Full-stack Engineer",
    "Web Developer",
    "Security Engineer",
    "Based in Vancouver",
]

function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

function setIntroText(textSpan, text) {
    if (!textSpan) {
        return
    }

    textSpan.textContent = text
}

function setCaretActive(textSpan, isActive) {
    if (!textSpan) {
        return
    }

    textSpan.classList.toggle("is-caret-active", isActive)
    textSpan.classList.toggle("is-caret-hidden", !isActive)
}

function setGreetingStatic(textSpan, isStatic) {
    if (!textSpan) {
        return
    }

    textSpan.classList.toggle("intro-terminal__line1-static", isStatic)
}

function typePlainText(textSpan, fullText, speedMs) {
    return new Promise((resolve) => {
        if (!textSpan) {
            resolve()
            return
        }

        let length = 0

        function tick() {
            if (length >= fullText.length) {
                setIntroText(textSpan, fullText)
                resolve()
                return
            }

            length += 1
            const slice = fullText.slice(0, length)
            setIntroText(textSpan, slice)
            setTimeout(tick, speedMs)
        }

        /* Caller must pass the persistent intro `.txt` span; first tick appends chars. */
        tick()
    })
}

function applyIntroTerminalReducedMotion() {
    const greetingEl = document.querySelector("#introGreeting")
    const greetingSpan = ensureIntroTextSpan(greetingEl)
    if (greetingSpan) {
        setGreetingStatic(greetingSpan, true)
        setCaretActive(greetingSpan, false)
        setIntroText(greetingSpan, INTRO_GREETING)
    }

    const nameEl = document.querySelector("#introName")
    const nameSpan = ensureIntroTextSpan(nameEl)
    if (nameSpan) {
        setGreetingStatic(nameSpan, false)
        setCaretActive(nameSpan, false)
        setIntroText(nameSpan, INTRO_CYCLING_WORDS[0])
    }
}

async function initIntroTerminalTyping() {
    const greetingEl = document.querySelector("#introGreeting")
    const nameEl = document.querySelector("#introName")
    const greetingSpan = ensureIntroTextSpan(greetingEl)
    const nameSpan = ensureIntroTextSpan(nameEl)

    if (!greetingSpan || !nameSpan) {
        initTypewriter()
        return
    }

    setGreetingStatic(greetingSpan, false)
    setIntroText(greetingSpan, "")
    setCaretActive(greetingSpan, false)

    setGreetingStatic(nameSpan, false)
    setIntroText(nameSpan, "")
    setCaretActive(nameSpan, false)

    await delay(INTRO_AFTER_TERMINAL_FIRST_CARET_MS)
    setCaretActive(greetingSpan, true)
    await delay(INTRO_BEFORE_LINE1_TYPE_MS)
    await typePlainText(greetingSpan, INTRO_GREETING, INTRO_LINE1_TYPE_SPEED_MS)
    await delay(INTRO_AFTER_GREETING_PAUSE_MS)
    setGreetingStatic(greetingSpan, true)
    setCaretActive(greetingSpan, false)
    setCaretActive(nameSpan, true)
    await delay(INTRO_BEFORE_LINE2_TYPE_MS)
    initTypewriter()
}

class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement
        this.textSpan = ensureIntroTextSpan(txtElement)
        this.words = words
        this.txt = ""
        this.wordIndex = 0
        this.wait = wait
        this.isDeleting = false

        // Add a flag to ensure only one instance is running
        if (PORTFOLIO_STATE.intro.activeTypewriter) {
            const previousTypewriter = PORTFOLIO_STATE.intro.activeTypewriter
            const previousSpan = previousTypewriter.textSpan ||
                ensureIntroTextSpan(previousTypewriter.txtElement)
            if (previousSpan) {
                setIntroText(previousSpan, "")
                setCaretActive(previousSpan, false)
            }
        }
        PORTFOLIO_STATE.intro.activeTypewriter = this

        if (!this.textSpan) {
            return
        }

        setGreetingStatic(this.textSpan, false)
        setCaretActive(this.textSpan, true)

        this.type()
    }

    type() {
        // Check if this instance is still the active one
        if (PORTFOLIO_STATE.intro.activeTypewriter !== this || !this.textSpan) return

        const current = this.wordIndex % this.words.length
        const fullTxt = this.words[current]

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1)
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1)
        }

        setIntroText(this.textSpan, this.txt)

        let typeSpeed = INTRO_LINE2_TYPE_SPEED_MS

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait
            this.isDeleting = true
        } else if (this.isDeleting && this.txt === "") {
            this.isDeleting = false
            this.wordIndex++
            typeSpeed = INTRO_LINE2_BETWEEN_WORDS_MS
        }

        setTimeout(() => this.type(), typeSpeed)
    }
}

// Initialize Typewriter (second intro line, after greeting is complete)
function initTypewriter() {
    const txtElement = document.querySelector("#introName")
    if (!txtElement) {
        return
    }

    const wait = INTRO_LINE2_WORD_HOLD_MS
    new TypeWriter(txtElement, INTRO_CYCLING_WORDS, wait)
}
