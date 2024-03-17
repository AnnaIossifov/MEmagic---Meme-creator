'use strict'

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

document.addEventListener('DOMContentLoaded', function() {
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

function renderImageToCanvas(imgUrl) {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    if (!canvas || !ctx) {
        console.error('Error: Canvas or context not available')
        return;
    }

    const selectedImg = new Image()
    selectedImg.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(selectedImg, 0, 0, canvas.width, canvas.height)
    };
    selectedImg.src = imgUrl
}

function saveSelectedImage(imageUrl) {
    localStorage.setItem('selectedImageUrl', imageUrl)
}
