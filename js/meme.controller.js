'use strict'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const galleryImages = document.querySelectorAll('.gallery-item')
const fontFamilySelect = document.getElementById('font-family')
const fontSizeInput = document.getElementById('font-size')
const alignLeftBtn = document.getElementById('align-left')
const alignCenterBtn = document.getElementById('align-center')
const alignRightBtn = document.getElementById('align-right')
const menuBtn = document.querySelector('.mobile-nav-btn')
const sideMenu = document.querySelector('.side-menu')
let isDragging = false
let textX = 0
let textY = 0
let offsetY = 0
let offsetX = 0
let selectedTextColor = ''
let selectedFillColor = '#e0e0e0'
let selectedFontFamily = 'Poppins'
let selectedStrokeColor = '#000000'
let selectedLineIndex = 0

window.addEventListener('load', initMemeEditor)
document.getElementById('text-input').addEventListener('input', renderMeme)
canvas.addEventListener('click', handleCanvasClick)

canvas.addEventListener('click', function (e) {
    const canvasRect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - canvasRect.left
    const mouseY = e.clientY - canvasRect.top
    detectLineClick(mouseX, mouseY)
})

menuBtn.addEventListener('click', function () {
    sideMenu.classList.toggle('active')
})

galleryImages.forEach(img => {
    img.addEventListener('click', function () {
        renderImageToCanvas(img)
    })
})

textInput.addEventListener('input', function () {
    addTextLine()
})

// ------------------------------------------------------------------------------------------

function initMemeEditor() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
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
        console.log('Image loaded successfully')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(selectedImg, 0, 0, canvas.width, canvas.height)

        gMeme.lines.forEach((line, index) => {
            const text = line.txt.trim()

            console.log(`Rendering text for line ${index}: ${text}`)
            console.log('Size:', line.size);
            console.log('Color:', line.color);
            console.log('Position (X, Y):', line.x, line.y)

            if (text.length > 0) {
                ctx.font = `${line.size}px Arial`
                ctx.textAlign = 'middle'
                ctx.fillStyle = line.color

                if (index === selectedLineIndex) {
                    ctx.fillStyle = selectedFillColor ? selectedFillColor : fillTextColor
                    ctx.strokeStyle = 'green'
                } else {
                    ctx.fillStyle = line.color
                    ctx.strokeStyle = 'transparent'
                }

                const textX = line.x
                const textY = line.y

                ctx.fillText(text, textX, textY)

                const textWidth = ctx.measureText(text).width
                const textHeight = line.size

                var boxX = textX - textWidth / 2 - 10;
                var boxY = textY - textHeight - 10;
                const boxWidth = textWidth + 20;
                const boxHeight = textHeight + 20;

                if (line.alignment === 'left') {
                    boxX = textX
                } else if (line.alignment === 'center') {
                    boxX = textX - textWidth / 2
                } else if (line.alignment === 'right') {
                    boxX = textX - textWidth
                }

                ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)

                boxY = textY - textHeight
                if (index === selectedLineIndex) {
                    ctx.strokeRect(textX - textWidth / 2 - 10, textY - 30, textWidth + 20, 40)
                }
                console.log(`Rendering text for line ${index}:`, line)
                console.log(text, textX, textY)
            }
        })
        updateTextDimensions()
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
            saveSelectedImage(imageUrl)
            console.log("Image clicked! URL: ", imageUrl)
        })
    })
}

function toggleMenu() {
    const sideMenu = document.querySelector('.side-menu')
    const mobileNavBtn = document.getElementById('mobile-nav-btn')
    const body = document.body

    sideMenu.classList.toggle('menu-open')
    body.classList.toggle('menu-open')

    if (sideMenu.classList.contains('menu-open')) {
        mobileNavBtn.textContent = '✕'
    } else {
        mobileNavBtn.textContent = '☰'
    }
}
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
    setTextFamily()
    renderMeme()
}

// Function to select fill color
function onSelectFillColor() {
    const fillColorInput = document.getElementById('fill-color')
    selectedFillColor = fillColorInput.value

    console.log('Selected fill color:', selectedFillColor)

    if (selectedLineIndex >= 0 && selectedLineIndex < gMeme.lines.length) {
        gMeme.lines[selectedLineIndex].color = selectedFillColor
    }
    renderMeme()
}

// Function to select stroke color
function onSelectStrokeColor() {
    const strokeColorInput = document.getElementById('stroke-color')
    selectedStrokeColor = strokeColorInput.value
    console.log('Selected stroke color:', selectedStrokeColor)

    if (selectedLineIndex >= 0 && selectedLineIndex < gMeme.lines.length) {
        gMeme.lines[selectedLineIndex].strokeColor = selectedStrokeColor
    }
    renderMeme()
}

const moveLineUpBtn = document.getElementById('move-line-up')
const moveLineDownBtn = document.getElementById('move-line-down')
moveLineUpBtn.addEventListener('click', changeTextLineUp)
moveLineDownBtn.addEventListener('click', changeTextLineDown)

// ----------------------------------

function handleCanvasClick(event) {
    const canvasBounds = canvas.getBoundingClientRect()
    const mouseX = event.clientX - canvasBounds.left
    const mouseY = event.clientY - canvasBounds.top


    gMeme.lines.forEach((line, index) => {
        const textWidth = ctx.measureText(line.txt).width
        const textX = line.x
        const textY = line.y

        const boxLeft = textX - textWidth / 2 - 10
        const boxRight = textX + textWidth / 2 + 10
        const boxTop = textY - 30
        const boxBottom = textY + 10

        if (mouseX >= boxLeft
            && mouseX <= boxRight
            && mouseY >= boxTop
            && mouseY <= boxBottom) {
            selectedLineIndex = index
            renderMeme()
            return
        }
    })
}

// -------------------------- Save to gallery ---------------------------------
function saveToGallery() {
    const createdMeme = getCurrentMeme()
    memeService.saveMeme(createdMeme)
    alert('Meme saved successfully!')
}

document.addEventListener('DOMContentLoaded', function () {
    displaySavedMemes()
})

function displaySavedMemes() {
    const savedMemes = memeService.getSavedMemes()
    const savedMemesContainer = document.querySelector('saved-memes-container')

    savedMemes.forEach(meme => {
        const memeElement = document.createElement('div')
        memeElement.textContent = JSON.stringify(meme)
        savedMemesContainer.appendChild(memeElement)
    })
}