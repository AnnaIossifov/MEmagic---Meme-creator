var gImgs = [
    {
        id: 1,
        url: 'img/1.jpg',
        keywords: ['funny', 'cat']
    }
]

let gMeme =
{
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: []
}

var gKeywordSearchCountMap = {
    'funny': 12,
    'cat': 16,
    'baby': 2
}

function loadMemeFromStorage(memeId) {
    console.log('Loading meme from storage by ID')

    const allMemes = getMemes()
    return allMemes.find(meme => meme.id === memeId)
}

function getMemes() {
    console.log('Implement fetching all memes')

    return JSON.parse(localStorage.getItem('memes')) || []
}

function getMemeById(memeId) {
    console.log('fetching a meme by ID')

    const allMemes = getMemes()
    return allMemes.find(meme => meme.id === memeId)
}

function createMeme(imageUrl, text) {
    const meme = {
        imageUrl: imageUrl,
        text: text
    }
    localStorage.setItem('meme', JSON.stringify(meme));
}

function saveMeme(meme) {
    console.log('saving a meme')

    let allMemes = getMemes()
    allMemes.push(meme)
    localStorage.setItem('memes', JSON.stringify(allMemes))
}

// function updateMeme(memeId) {
//     console.log('updating a meme text by ID')

//     let allMemes = getMemes()
//     const memeToUpdate = allMemes.find(meme => meme.id === memeId)
//     if (memeToUpdate) {
//         memeToUpdate.text = newText
//         localStorage.setItem('memes', JSON.stringify(allMemes))
//     }
// }

// -------------------------------------------------------------------------

// Loading memes from service
function loadMemes() {
    const meme = gMeme.lines[0]
    renderMeme(meme)
}

function downloadMeme() {
    const downloadLink = document.createElement('a')
    downloadLink.href = canvas.toDataURL() // Convert canvas to image URL
    downloadLink.download = 'meme.png' // Set download file
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
}

function shareMeme() {

}

// ------------------------------------------------------------------------
//  meme to gallery

function saveToGallery() {
    const canvas = document.getElementById('canvas')
    const dataURL = canvas.toDataURL()
    localStorage.setItem('savedMeme', dataURL)
    alert('Meme saved to gallery!')
}

function deleteMeme(memeId) {
    console.log('deleting a meme by ID')

    let allMemes = getMemes()
    allMemes = allMemes.filter(meme => meme.id !== memeId)
    localStorage.setItem('memes', JSON.stringify(allMemes))
}

// -------------------- Phase4 – multiple lines --------------------------

function addTextLine() {
    const textInput = document.getElementById('text-input');
    const text = textInput.value.trim()

    if (text) {
        gMeme.lines.push({
            txt: text,
            size: 20,
            color: selectedFillColor
        })

        textInput.value = ''
        renderMeme()
    } else {
        alert('Please enter text before adding a line.')
    }
    console.log('Selected color:', selectedFillColor)
}

// -----------------------------------------------------------------------------------------

function switchTextLine() {
    selectedLineIndex = (selectedLineIndex + 1) % gMeme.lines.length
    renderMeme()
}

function changeTextLineUp() {
    if (selectedLineIndex > 0) {
        selectedLineIndex--
        renderMeme()
    }
}

function changeTextLineDown() {
    if (selectedLineIndex < gMeme.lines.length - 1) {
        selectedLineIndex++
        renderMeme()
    }
}