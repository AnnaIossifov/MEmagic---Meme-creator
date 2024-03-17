'use strict'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const galleryImages = document.querySelectorAll('.gallery-item')
const memeData = { txt: 'Example text' }

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
        const text = textInput.value.trim()

        ctx.font = '30px Poppins'
        ctx.fillStyle = '#FFFFFF'
        ctx.textAlign = 'center'
        ctx.fillText(text, canvas.width / 2, 50)
    }
    selectedImg.src = selectedImageUrl
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

function downloadMeme() {
    const downloadLink = document.createElement('a')
    downloadLink.href = canvas.toDataURL() // Convert canvas to image URL
    downloadLink.download = 'meme.png' // Set download file
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
}

function shareMeme(){

}

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
    const textInput = document.getElementById('#text-input')
    const currentSize = parseInt(window.getComputedStyle(textInput).fontSize)
    textInput.style.fontSize = `${currentSize + 2}px`
}

// Function to decrease font size
function onFontSizeDown() {
    const textInput = document.getElementById('#text-input')
    const currentSize = parseInt(window.getComputedStyle(textInput).fontSize)
    textInput.style.fontSize = `${Math.max(currentSize - 2, 10)}px`
}

// Function to set font family
function onSetFontFamily() {
    const textInput = document.getElementById('#text-input')
    const selectElement = document.getElementById('#font-family-select')
    const fontFamily = selectElement.value
    textInput.style.fontFamily = fontFamily
}

// Function to select fill color
function onSelectFillColor() {
    const textInput = document.getElementById('#text-input')
    const fillColor = document.getElementById('#fill-color').value
    textInput.style.color = fillColor
}

// Function to select stroke color
function onSelectStrokeColor() {
    const textInput = document.getElementById('#text-input')
    const strokeColor = document.getElementById('#stroke-color').value
    textInput.style.textShadow = `1px 1px 1px ${strokeColor}`
}


