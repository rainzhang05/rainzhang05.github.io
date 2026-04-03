const CONTACT_SUCCESS_VISIBLE_MS = 5000

function getContactFormElements() {
    const contactForm = document.getElementById("contactForm")
    if (!contactForm) {
        return null
    }

    return {
        contactForm,
        submitButton: document.getElementById("submitBtn"),
        successMessage: document.getElementById("successMessage"),
    }
}

function getContactFieldValue(fieldId) {
    const field = document.getElementById(fieldId)
    return field ? field.value.trim() : ""
}

function hasValidContactFields() {
    return Boolean(
        getContactFieldValue("name") &&
        getContactFieldValue("email") &&
        getContactFieldValue("message")
    )
}

function setContactSubmitState(submitButton, isPending) {
    if (!submitButton) {
        return
    }

    if (!submitButton.dataset.originalText) {
        submitButton.dataset.originalText = submitButton.textContent
    }

    submitButton.textContent = isPending ? "Sending..." : submitButton.dataset.originalText
    submitButton.disabled = isPending
}

function hideContactSuccessMessage(successMessage) {
    if (!successMessage) {
        return
    }

    successMessage.style.display = "none"
}

function showContactSuccessMessage(successMessage) {
    if (!successMessage) {
        return
    }

    const contactState = PORTFOLIO_STATE.contact
    if (contactState.successMessageTimeoutId) {
        clearTimeout(contactState.successMessageTimeoutId)
    }

    successMessage.style.display = "block"
    contactState.successMessageTimeoutId = setTimeout(() => {
        hideContactSuccessMessage(successMessage)
        contactState.successMessageTimeoutId = null
    }, CONTACT_SUCCESS_VISIBLE_MS)
}

async function submitContactForm(contactForm) {
    const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
            Accept: "application/json",
        },
    })

    if (!response.ok) {
        throw new Error("Form submission failed")
    }

    try {
        return await response.json()
    } catch (error) {
        return null
    }
}

async function handleContactSubmit(event) {
    event.preventDefault()

    if (!hasValidContactFields()) {
        alert("Please fill in all fields")
        return
    }

    const elements = getContactFormElements()
    if (!elements) {
        return
    }

    const { contactForm, submitButton, successMessage } = elements
    hideContactSuccessMessage(successMessage)
    setContactSubmitState(submitButton, true)

    try {
        await submitContactForm(contactForm)
        showContactSuccessMessage(successMessage)
        contactForm.reset()
    } catch (error) {
        console.error("Error:", error)
        alert("Failed to send message. Please try again later.")
    } finally {
        setContactSubmitState(submitButton, false)
    }
}

// Setup Contact Form
function setupContactForm() {
    const elements = getContactFormElements()
    if (!elements) {
        return
    }

    const { contactForm } = elements
    if (contactForm.dataset.contactBound === "true") {
        return
    }

    contactForm.dataset.contactBound = "true"
    contactForm.addEventListener("submit", handleContactSubmit)
}
