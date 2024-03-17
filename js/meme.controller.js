'use strict'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const galleryImages = document.querySelectorAll('.gallery-item')
const memeData = { txt: 'Example text' }

let textX = 0
let textY = 0
let isDragging = false
let offsetY = 0
let offsetX = 0

let selectedFillColor = '#000000'
let selectedFontFamily = 'Arial'

function initMemeEditor() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    if (!canvas || !ctx) {
        console.error('Error: Canvas or context not available')
        return
    }

    loadMemes()
    renderMeme(memeData)
    initEventListeners()
    openEditor()
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
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(selectedImg, 0, 0, canvas.width, canvas.height)

        const textInput = document.getElementById('text-input')
        const text = textInput.value.trim();

        if (text.length > 0) {
            ctx.font = '30px Poppins'
            ctx.textAlign = 'center'
            const textWidth = ctx.measureText(text).width
            const textX = canvas.width / 2
            const textY = 50

            // Box around text
            ctx.strokeStyle = '#000000'
            ctx.lineWidth = 2
            ctx.strokeRect(textX - textWidth / 2 - 10, textY - 30, textWidth + 20, 40)

            // Fill text
            ctx.fillStyle = '#FFFFFF'
            ctx.fillText(text, textX, textY)
        }
    };
    selectedImg.src = selectedImageUrl;
}

document.getElementById('text-input').addEventListener('input', renderMeme)
window.addEventListener('load', renderMeme)

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
    fontSizeDownBtn.addEventListener('click', onFontSizedDown)
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

function startDragging(e) {
    isDragging = true
    startX = e.clientX
    startY = e.clientY
}

function stopDragging() {
    isDragging = false
}

function moveText(e) {
    if (isDragging) {
        const dx = e.clientX - startX
        const dy = e.clientY - startY
        textX += dx
        textY += dy
        startX = e.clientX
        startY = e.clientY
        renderMeme()
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas')

    canvas.addEventListener('mousedown', startDragging)
    canvas.addEventListener('mouseup', stopDragging)
    canvas.addEventListener('mousemove', moveText)

    renderMeme()
})

// -----------------------------------------------------------------------------------------

// Loading memes from service
function loadMemes() {
    const meme = gMeme.lines[0]
    renderMeme(meme)
}

// Updating a meme
// function onUpdateMeme(memeId, newText) {

// }

// Function to increase font size
function onFontSizeUp() {
    const textInput = document.getElementById('text-input')
    const currentSize = parseInt(window.getComputedStyle(textInput).fontSize)
    textInput.style.fontSize = `${currentSize + 2}px`
}

// Function to decrease font size
function onFontSizeDown() {
    const textInput = document.getElementById('text-input')
    const currentSize = parseInt(window.getComputedStyle(textInput).fontSize)
    textInput.style.fontSize = `${Math.max(currentSize - 2, 10)}px`
}

// Function to set font family
function onSetFontFamily() {
    const fontFamilySelect = document.getElementById('font-family-select');
    selectedFontFamily = fontFamilySelect.value
}

// Function to select fill color
function onSelectFillColor() {
    const fillColorInput = document.getElementById('fill-color');
    selectedFillColor = fillColorInput.value
}

// Function to select stroke color
function onSelectStrokeColor() {
    const textInput = document.getElementById('text-input')
    const strokeColor = document.getElementById('stroke-color').value
    textInput.style.textShadow = `1px 1px 1px ${strokeColor}`
}