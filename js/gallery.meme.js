'use strict'
let isRandom

const imagePaths = {
    "1.jpg": "imgs/meme-imgs (square)/1.jpg",
    "2.jpg": "imgs/meme-imgs (square)/2.jpg",
    "3.jpg": "imgs/meme-imgs (square)/3.jpg",
    "4.jpg": "imgs/meme-imgs (square)/4.jpg",
}

function initGallery() {
    loadImages()
    fetchDataFromAPI()
    initializeLocalStorage()
}

function loadImages() {
    const imagePaths = {
        "1.jpg": "imgs/meme-imgs (square)/1.jpg",
        "2.jpg": "imgs/meme-imgs (square)/2.jpg",
        "3.jpg": "imgs/meme-imgs (square)/3.jpg",
        "4.jpg": "imgs/meme-imgs (square)/4.jpg",
    }

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
            // const imageUrl = imageUrl
            console.log('Image URL:', imageUrl)
            renderImageToCanvas(imageUrl)
            saveSelectedImage(imageUrl)
            openEditor()
        })

        galleryItem.appendChild(img)
        galleryContainer.appendChild(galleryItem)
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadImages()
})

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

// function renderImageToCanvas(imgUrl) {
//     const canvas = document.getElementById('canvas')
//     const ctx = canvas.getContext('2d')

<<<<<<< HEAD
//     if (!canvas || !ctx) {
//         console.error('Error: Canvas or context not available')
//         return
//     }

//     const selectedImg = new Image()
//     selectedImg.onload = function () {
//         ctx.clearRect(0, 0, canvas.width, canvas.height)
//         ctx.drawImage(selectedImg, 0, 0, canvas.width, canvas.height)
//     }
//     selectedImg.src = imgUrl
// }
=======
    if (!canvas || !ctx) {
        console.error('Error: Canvas or context not available')
        return
    }

    const selectedImg = new Image()
    selectedImg.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(selectedImg, 0, 0, canvas.width, canvas.height)
    }
    selectedImg.src = imgUrl
}
>>>>>>> 67d0b392145bd41319bf0012bcd9e9141b01005e

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

    console.log('Random Image URL:', imageUrl)
    console.log('Random Text:', text)

    if (!canvas || !ctx) {
        console.error('Error: Canvas or context not available')
        return
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

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
            ctx.fillText(text, textX, textY)
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
    renderImageToCanvas(imagePaths[randomImageKey], randomText, isRandom)
}