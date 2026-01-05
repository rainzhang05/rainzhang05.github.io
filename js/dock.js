// Enhanced Dock Hover Effects - Updated for more subtle magnification
function setupDockHoverEffects() {
    const dock = document.getElementById("dock")
    if (!dock) {
        return
    }
    const dockItems = dock.querySelectorAll(".dock-item")

    // More subtle magnification effect for dock
    dockItems.forEach((item) => {
        if (!item.classList.contains("dock-separator")) {
            item.addEventListener("mouseenter", () => {
                // Apply a more subtle scale to the hovered item
                item.style.transform = "scale(1.08) translateY(-3px)"
            })

            item.addEventListener("mouseleave", () => {
                item.style.transform = "scale(1)"
            })
        }
    })

    // Reset all items when mouse leaves the dock
    dock.addEventListener("mouseleave", () => {
        dockItems.forEach((item) => {
            if (!item.classList.contains("dock-separator")) {
                item.style.transform = "scale(1)"
            }
        })
    })

    normalizeDockIcons(dock)
}

function normalizeDockIcons(dock) {
    const dockImages = dock.querySelectorAll(".dock-item img")

    dockImages.forEach((img) => {
        if (img.classList.contains("theme-icon")) {
            return
        }

        if (img.dataset.normalized === "true") {
            return
        }

        const imageSrc = img.currentSrc || img.src
        if (!imageSrc || !isSameOriginImage(imageSrc)) {
            return
        }

        if (!img.complete || img.naturalWidth === 0) {
            img.addEventListener(
                "load",
                () => {
                    normalizeDockImage(img)
                },
                { once: true }
            )
            return
        }

        normalizeDockImage(img)
    })
}

function isSameOriginImage(imageSrc) {
    try {
        const parsedUrl = new URL(imageSrc, window.location.href)
        return parsedUrl.origin === window.location.origin
    } catch (error) {
        return false
    }
}

function normalizeDockImage(img) {
    const width = img.naturalWidth
    const height = img.naturalHeight

    if (!width || !height) {
        return
    }

    const sourceCanvas = document.createElement("canvas")
    sourceCanvas.width = width
    sourceCanvas.height = height
    const sourceContext = sourceCanvas.getContext("2d")

    if (!sourceContext) {
        return
    }

    sourceContext.drawImage(img, 0, 0, width, height)

    let imageData
    try {
        imageData = sourceContext.getImageData(0, 0, width, height)
    } catch (error) {
        return
    }

    const { data } = imageData
    let minX = width
    let minY = height
    let maxX = 0
    let maxY = 0
    let hasOpaquePixel = false

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const alpha = data[(y * width + x) * 4 + 3]
            if (alpha > 0) {
                hasOpaquePixel = true
                minX = Math.min(minX, x)
                minY = Math.min(minY, y)
                maxX = Math.max(maxX, x)
                maxY = Math.max(maxY, y)
            }
        }
    }

    if (!hasOpaquePixel) {
        return
    }

    const cropWidth = maxX - minX + 1
    const cropHeight = maxY - minY + 1
    const targetSize = 256
    const outputCanvas = document.createElement("canvas")
    outputCanvas.width = targetSize
    outputCanvas.height = targetSize
    const outputContext = outputCanvas.getContext("2d")

    if (!outputContext) {
        return
    }

    outputContext.clearRect(0, 0, targetSize, targetSize)
    const scale = targetSize / Math.max(cropWidth, cropHeight)
    const drawWidth = cropWidth * scale
    const drawHeight = cropHeight * scale
    const offsetX = (targetSize - drawWidth) / 2
    const offsetY = (targetSize - drawHeight) / 2

    outputContext.drawImage(
        sourceCanvas,
        minX,
        minY,
        cropWidth,
        cropHeight,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight
    )

    img.src = outputCanvas.toDataURL("image/png")
    img.dataset.normalized = "true"
}
