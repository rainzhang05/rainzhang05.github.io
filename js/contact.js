// Setup Contact Form
function setupContactForm() {
    const contactForm = document.getElementById("contactForm")
    if (!contactForm) return

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault()

        // Get form values
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const message = document.getElementById("message").value

        // Simple validation
        if (!name || !email || !message) {
            alert("Please fill in all fields")
            return
        }

        // Store the original button text
        const submitBtn = document.getElementById("submitBtn")
        const originalText = submitBtn.textContent

        // Change button text and disable
        submitBtn.textContent = "Sending..."
        submitBtn.disabled = true

        // Get the form data
        const formData = new FormData(contactForm)

        // Send the form data using fetch
        fetch(contactForm.action, {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error("Form submission failed")
                }
            })
            .then((data) => {
                // Show success message
                const successMessage = document.getElementById("successMessage")
                successMessage.style.display = "block"

                // Reset form
                contactForm.reset()

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = "none"
                }, 5000)
            })
            .catch((error) => {
                console.error("Error:", error)
                alert("Failed to send message. Please try again later.")
            })
            .finally(() => {
                // Reset button regardless of success or failure
                submitBtn.textContent = originalText
                submitBtn.disabled = false
            })
    })
}
