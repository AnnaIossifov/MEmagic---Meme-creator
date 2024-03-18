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
            color: selectedFillColor,
            x: canvas.width / 2, 
            y: 50 + gMeme.lines.length * 50,
        })

        textInput.value = ''
        renderMeme()
    } else {
        alert('Please enter text before adding a line.')
    }
    console.log('Selected color:', selectedFillColor)
}

// -----------------------------------------------------------------------------------------
function selectTextLine(index) {
    selectedLineIndex = index;
    if (index >= 0 && index < gMeme.lines.length) {
        selectedTextColor = gMeme.lines[index].color
    } else {
        selectedTextColor = ''
    }
    renderMeme()
}

function switchTextLine() {
    selectedLineIndex = (selectedLineIndex + 1) % gMeme.lines.length
    renderMeme()
}

function changeTextLineUp() {
    console.log('Changing text line up')
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

function deleteTextLine() {
    if (selectedLineIndex !== -1) {
        gMeme.lines.splice(selectedLineIndex, 1)
        selectedLineIndex = -1
        renderMeme()
    } else {
        console.log('No line selected to delete')
    }
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

        gMeme.lines[selectedLineIndex].x = mouseX - offsetX
        gMeme.lines[selectedLineIndex].y = mouseY - offsetY

        renderMeme()
    }
}

function stopDragging() {
    isDragging = false
}

document.addEventListener('DOMContentLoaded', () => {
    initTextLines()
})

// ------------------------ Phase5 – selectable lines -----------------------------------------

function detectLineClick(mouseX, mouseY) {
    selectedLineIndex = -1

    gMeme.lines.forEach((line, index) => {
        console.log(`Line ${index} - X: ${line.x}, Y: ${line.y}, Width: ${line.width}, Height: ${line.height}`)

        if (
            mouseX >= line.x &&
            mouseX <= line.x + line.width &&
            mouseY >= line.y &&
            mouseY <= line.y + line.height
        ) {
            console.log(`Clicked on Line ${index}`)
            selectedLineIndex = index
        }
    })

    console.log('Selected Line Index:', selectedLineIndex)
    renderMeme()
}

function calculateTextDimensions(line) {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = `${line.size}px Poppins`
    const textWidth = ctx.measureText(line.txt.trim()).width
    const textHeight = line.size + 10
    line.width = textWidth
    line.height = textHeight
}

function updateTextDimensions() {
    gMeme.lines.forEach(line => {
        calculateTextDimensions(line)
    })
}

canvas.addEventListener('click', function (e) {
    const canvasRect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - canvasRect.left
    const mouseY = e.clientY - canvasRect.top
    detectLineClick(mouseX, mouseY)
})
