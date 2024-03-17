var gImgs = [
    {
        id: 1,
        url: 'img/1.jpg',
        keywords: ['funny', 'cat']
    }
]

var gMeme =
{
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            color: 'red'
        },
        {
            txt: 'Second line',
            size: 20, color: '#FFFFFF',
            x: 50, y: 100
        }
    ]
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

function updateMeme(memeId) {
    console.log('updating a meme text by ID')

    let allMemes = getMemes()
    const memeToUpdate = allMemes.find(meme => meme.id === memeId)
    if (memeToUpdate) {
        memeToUpdate.text = newText
        localStorage.setItem('memes', JSON.stringify(allMemes))
    }
}

// -------------------------------------------------------------------------

function deleteMeme(memeId) {
    console.log('deleting a meme by ID')

    let allMemes = getMemes()
    allMemes = allMemes.filter(meme => meme.id !== memeId)
    localStorage.setItem('memes', JSON.stringify(allMemes))
}

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

//  meme to gallery
function saveToGallery() {
    const canvas = document.getElementById('canvas')
    const dataURL = canvas.toDataURL()
    localStorage.setItem('savedMeme', dataURL)
    alert('Meme saved to gallery!')
}
