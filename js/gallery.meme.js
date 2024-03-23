'use strict'
let isRandom
const imagePaths = {
    "1.jpg": "imgs/meme-imgs (square)/1.jpg",
    "2.jpg": "imgs/meme-imgs (square)/2.jpg",
    "3.jpg": "imgs/meme-imgs (square)/3.jpg",
    "4.jpg": "imgs/meme-imgs (square)/4.jpg",
    "5.jpg": "imgs/meme-imgs (square)/5.jpg",
    "6.jpg": "imgs/meme-imgs (square)/6.jpg",
    "7.jpg": "imgs/meme-imgs (square)/7.jpg",
    "8.jpg": "imgs/meme-imgs (square)/8.jpg",
    "9.jpg": "imgs/meme-imgs (square)/9.jpg",
    "10.jpg": "imgs/meme-imgs (square)/10.jpg",
    "11.jpg": "imgs/meme-imgs (square)/11.jpg",
    "12.jpg": "imgs/meme-imgs (square)/12.jpg",
    "13.jpg": "imgs/meme-imgs (square)/13.jpg",
    "14.jpg": "imgs/meme-imgs (square)/14.jpg",
    "15.jpg": "imgs/meme-imgs (square)/15.jpg",
    "16.jpg": "imgs/meme-imgs (square)/16.jpg",
    "17.jpg": "imgs/meme-imgs (square)/17.jpg",
    "18.jpg": "imgs/meme-imgs (square)/18.jpg",
    // "19.jpg": "imgs/meme-imgs (various aspect ratios)/2.jpg",
    // "20.jpg": "imgs/meme-imgs (various aspect ratios)/003.jpg",
    // "21.jpg": "imgs/meme-imgs (various aspect ratios)/004.jpg",
    // "22.jpg": "imgs/meme-imgs (various aspect ratios)/5.jpg",
    // "23.jpg": "imgs/meme-imgs (various aspect ratios)/006.jpg",
    // "24.jpg": "imgs/meme-imgs (various aspect ratios)/8.jpg",
    // "25.jpg": "imgs/meme-imgs (various aspect ratios)/9.jpg",
    // "26.jpg": "imgs/meme-imgs (various aspect ratios)/12.jpg",
    // "27.jpg": "imgs/meme-imgs (various aspect ratios)/19.jpg",
    // "28.jpg": "imgs/meme-imgs (various aspect ratios)/20.jpg",
    // "29.jpg": "imgs/meme-imgs (various aspect ratios)/21.jpg",
    // "30.jpg": "imgs/meme-imgs (various aspect ratios)/22.jpg",
    // "31.jpg": "imgs/meme-imgs (various aspect ratios)/23.jpg",
    // "32.jpg": "imgs/meme-imgs (various aspect ratios)/24.jpg",
    // "33.jpg": "imgs/meme-imgs (various aspect ratios)/25.jpg",
    // "34.jpg": "imgs/meme-imgs (various aspect ratios)/26.jpg",
    // "35.jpg": "imgs/meme-imgs (various aspect ratios)/27.jpg",
    // "36.jpg": "imgs/meme-imgs (various aspect ratios)/28.jpg",
    // "37.jpg": "imgs/meme-imgs (various aspect ratios)/29.jpg",
    // "38.jpg": "imgs/meme-imgs (various aspect ratios)/30.jpg",
    // "39.jpg": "imgs/meme-imgs (various aspect ratios)/31.jpg",
    // "40.jpg": "imgs/meme-imgs (various aspect ratios)/32.jpg",
    // "41.jpg": "imgs/meme-imgs (various aspect ratios)/33.jpg",
    // "42.jpg": "imgs/meme-imgs (various aspect ratios)/34.jpg",
}

document.addEventListener('DOMContentLoaded', function () {
    loadImages()
})

function initGallery() {
    loadImages()
    fetchDataFromAPI()
    initializeLocalStorage()
}

function loadImages() {
    const galleryContainer = document.querySelector('.gallery-container')
    galleryContainer.innerHTML = ''

    for (const filename in imagePaths) {
        const imageUrl = imagePaths[filename]
        const galleryItem = document.createElement('div')
        galleryItem.classList.add('gallery-item')
        const img = document.createElement('img')
        img.src = imageUrl
        img.alt = "Meme Image"
        img.className = "gallery-item"
        img.style.cursor = 'pointer'

        img.addEventListener('click', function () {
            const imageUrl = this.src
            renderImageToCanvas(imageUrl)
            saveSelectedImage(imageUrl)
            openEditor()
        })
        galleryItem.appendChild(img)
        galleryContainer.appendChild(galleryItem)
    }
}

function fetchDataFromAPI() {
    console.log("Fetching data from API...")

    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            console.log("Fetched data:", data)
        })
        .catch(error => {
            console.error("Error fetching data:", error)
        })
}

function initializeLocalStorage() {
    console.log("Initializing local storage...")

    if (!localStorage.getItem('initialized')) {
        localStorage.setItem('initialized', true)
        localStorage.setItem('username', 'JohnDoe')
        localStorage.setItem('theme', 'dark')
        console.log("Local storage initialized with dummy data.")
    } else {
        console.log("Local storage already initialized.")
    }
}

function saveSelectedImage(imageUrl) {
    localStorage.setItem('selectedImageUrl', imageUrl)
}

// --------------------- Random meme ------------------------

function getRandomImageUrl() {
    const imageKeys = Object.keys(imagePaths)
    const randomIndex = Math.floor(Math.random() * imageKeys.length)
    return imageKeys[randomIndex]
}

function getRandomText() {
    const textOptions = [
        '"I dont always study, but when I do, its right before the exam.',
        'Im not lazy, Im on energy-saving mode.',
        'My brain at 3 am: Lets think about every embarrassing moment from the past decade.',
        'I put the pro in procaffeinating.',
        'I speak fluent sarcasm, so if you hear me being nice, Im probably being sarcastic'
    ]

    const randomIndex = Math.floor(Math.random() * textOptions.length)
    return textOptions[randomIndex]
}

const randomMemeBtn = document.querySelector('.random-meme-btn')
randomMemeBtn.addEventListener('click', generateRandomMeme)

function renderImageToCanvas(imageUrl, text) {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    localStorage.setItem('selectedImageUrl', imageUrl)
    gMeme.lines[0].txt = text

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    console.log('Random Image URL:', imageUrl)

    if (!canvas || !ctx) {
        console.error('Error: Canvas or context not available')
        return
    }

    const selectedImg = new Image()

    selectedImg.onload = function () {
        console.log('Image loaded successfully')
        ctx.drawImage(selectedImg, 0, 0, canvas.width, canvas.height)

        if (isRandom && text.trim().length > 0) {
            const textX = canvas.width / 2
            const textY = canvas.height / 2
            ctx.font = '16px Poppins'
            ctx.fillStyle = '#000000'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            ctx.fillText(text, textX, textY)
            console.log('Text rendered:', text)
        }
    }
    selectedImg.onerror = function () {
        console.error('Error loading image:', imageUrl)
    }
    selectedImg.src = imageUrl
}

function generateRandomMeme() {
    const randomImageKey = getRandomImageUrl()
    const randomText = getRandomText()
    isRandom = true
    openEditor()
    renderImageToCanvas(imagePaths[randomImageKey], randomText)
}