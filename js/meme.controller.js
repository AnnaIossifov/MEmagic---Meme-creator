'use strict'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const galleryImages = document.querySelectorAll('.gallery-item')
const memeData = { txt: 'Example text' }

let isDragging = false
let textX = 0
let textY = 0

let offsetY = 0
let offsetX = 0

let selectedFillColor = '#e0e0e0'
let selectedFontFamily = 'Poppins'
let selectedStrokeColor = '#000000'

let selectedLineIndex = 0

const moveLineUpBtn = document.getElementById('move-line-up')
const moveLineDownBtn = document.getElementById('move-line-down')

moveLineUpBtn.addEventListener('click', changeTextLineUp)
moveLineDownBtn.addEventListener('click', changeTextLineDown)

window.addEventListener('load', renderMeme)
document.getElementById('text-input').addEventListener('input', renderMeme)


// ------------------------------------------------------------------------------------------

function initMemeEditor() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    if (!canvas || !ctx) {
        console.error('Error: Canvas or context not available')
        return
    }

    loadMemes()
    initEventListeners()

    const galleryImages = document.querySelectorAll('.gallery-item img')
    galleryImages.forEach(img => {
        img.addEventListener('click', function () {
            renderImageToCanvas(img)
            openEditor()
        })
    })
}

galleryImages.forEach(img => {
    img.addEventListener('click', function () {
        renderImageToCanvas(img)
    })
})

// Rendering the meme on the canvas
function renderMeme() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    const selectedImageUrl = localStorage.getItem('selectedImageUrl')
    if (!selectedImageUrl) {
        console.error('Error: Selected image URL not found')
        return
    }

    const selectedImg = new Image()
    selectedImg.onload = function () {
        // console.log('Image loaded')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(selectedImg, 0, 0, canvas.width, canvas.height)

        gMeme.lines.forEach((line, index) => {
            const text = line.txt.trim()

            if (text.length > 0) {
                ctx.font = `${line.size}px Poppins`
                ctx.fillStyle = line.color
                ctx.textAlign = 'center'

                const textWidth = ctx.measureText(text).width
                const textX = canvas.width / 2
                const textY = 50 + index * 50

                // Box around text
                ctx.strokeStyle = '#000000'
                ctx.lineWidth = 2
                ctx.strokeRect(textX - textWidth / 2 - 10, textY - 30, textWidth + 20, 40)

                // Fill text
                ctx.fillText(text, textX, textY)

                if (index === selectedLineIndex) {
                    ctx.strokeStyle = 'green'
                    ctx.strokeRect(textX - textWidth / 2 - 10, textY - 30, textWidth + 20, 40)
                }
            } else {
                console.log('No text provided for line:', line)
            }
        })
    }
    selectedImg.src = selectedImageUrl
}

function openEditor() {
    console.log('Opening editor...')
    const editorElement = document.getElementById('meme-editor')
    const elGallery = document.querySelector('.gallery-container')
    if (editorElement) {
        editorElement.style.display = 'flex'
    } else {
        console.error('Error: Editor element not found')
    }
    elGallery.style.display = 'none'
}

// Initializing event listeners
function initEventListeners() {
    const galleryItems = document.querySelectorAll('.gallery-item img')
    const fontSizeUpBtn = document.querySelector('.font-size-up')
    const fontSizeDownBtn = document.querySelector('.font-size-down')
    const fontFamilySelect = document.querySelector('#font-family-select')
    const fillColorInput = document.querySelector('#fill-color')
    const strokeColorInput = document.querySelector('#stroke-color')

    fontSizeUpBtn.addEventListener('click', onFontSizeUp)
    fontSizeDownBtn.addEventListener('click', onFontSizeDown)
    fontFamilySelect.addEventListener('change', onSetFontFamily)
    fillColorInput.addEventListener('change', onSelectFillColor)
    strokeColorInput.addEventListener('change', onSelectStrokeColor)

    galleryItems.forEach(function (item) {
        item.addEventListener('click', function () {
            const imageUrl = item.src
            saveSelectedImage(imageUrl);
            console.log("Image clicked! URL: ", imageUrl)
        })
    })
}

// -----------------------------------------------------------------------------------------
// move text on canvas

function initTextLines() {
    const textLines = document.querySelectorAll('.text-line');

    textLines.forEach((line, index) => {
        line.draggable = true

        line.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', index)
        })

        line.addEventListener('drop', (e) => {
            e.preventDefault()
            const draggedIndex = e.dataTransfer.getData('text/plain')
            const droppedIndex = index
            if (draggedIndex !== droppedIndex) {
                // Example: swapTextLines(draggedIndex, droppedIndex);
                console.log(`Dragging from ${draggedIndex} to ${droppedIndex}`)
            }
        })

        line.addEventListener('dragover', (e) => {
            e.preventDefault()
        })
    })
}

function startDragging(e) {
    const canvasRect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - canvasRect.left
    const mouseY = e.clientY - canvasRect.top
    
    gMeme.lines.forEach((line, index) => {
        const textWidth = ctx.measureText(line.txt).width
        const textX = canvas.width / 2
        const textY = 50 + index * 50
        if (
            mouseX >= textX - textWidth / 2 - 10 &&
            mouseX <= textX + textWidth / 2 + 10 &&
            mouseY >= textY - 30 &&
            mouseY <= textY + 10
        ) {
            isDragging = true
            offsetX = mouseX - textX
            offsetY = mouseY - textY
        }
    })
}

function moveText(e) {
    if (isDragging) {
        const canvasRect = canvas.getBoundingClientRect()
        const mouseX = e.clientX - canvasRect.left
        const mouseY = e.clientY - canvasRect.top

        const textX = mouseX - offsetX
        const textY = mouseY - offsetY

        gMeme.lines[selectedLineIndex].x = textX
        gMeme.lines[selectedLineIndex].y = textY

        renderMeme()
    }
}

function stopDragging() {
    isDragging = false
}

document.addEventListener('DOMContentLoaded', () => {
    initTextLines()
})

// ------------------------------------------------------------------------------------

// Function to increase font size


function onFontSizeUp() {
    const fontSizeIncrement = 2
    const line = gMeme.lines[selectedLineIndex]
    line.size += fontSizeIncrement
    renderMeme()
}

// Function to decrease font size
function onFontSizeDown() {
    const fontSizeDecrement = 2
    const line = gMeme.lines[selectedLineIndex]
    line.size = Math.max(line.size - fontSizeDecrement, 10)
    renderMeme()
}

// Function to set font family
function onSetFontFamily() {
    const selectElement = document.getElementById('font-family-select')
    selectedFontFamily = selectElement.value
    renderMeme()
}

// Function to select fill color
function onSelectFillColor() {
    const fillColorInput = document.getElementById('fill-color');
    selectedFillColor = fillColorInput.value
    renderMeme()
}

// Function to select stroke color
function onSelectStrokeColor() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    const strokeColor = document.getElementById('stroke-color').value

    ctx.strokeStyle = strokeColor
    renderMeme()
}