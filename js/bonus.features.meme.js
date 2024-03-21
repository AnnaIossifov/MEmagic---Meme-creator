'use strict'

const randomMemeBtn = document.querySelector('.random-meme-btn')
randomMemeBtn.addEventListener('click', generateRandomMeme)

function generateRandomMeme() {
    // Your logic to generate a random meme
    const randomImageUrl = getRandomImageUrl(); // Function to get a random image URL
    const randomText = getRandomText(); // Function to generate random text

    // Update the editor with the random meme
    updateEditor(randomImageUrl, randomText);
}

function getRandomImageUrl() {
    // Your logic to get a random image URL from your image collection
    // Return a random image URL
    return 'random-image-url.jpg';
}

function getRandomText() {
    // Your logic to generate random text
    // Return a random text string
    return 'Random Text';
}

function updateEditor(imageUrl, text) {
    // Update the editor with the random image and text
    localStorage.setItem('selectedImageUrl', imageUrl);
    // Update gMeme or other data structure as needed
    gMeme.lines[0].txt = text; // Assuming the first line is used for text
    // Other updates to UI or data

    // Render the meme in the editor
    renderMeme();
}