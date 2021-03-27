const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// set the canvas width/height
canvas.width = innerWidth / 2
canvas.height = innerHeight / 2

console.log(canvas.width, canvas.height)

// Define & load in our game images
const playerImg = new Image()
playerImg.src = './img/player.png'
const bgImg = new Image()
bgImg.src = './img/background.jpg'

const imageUrls = ['player.png', 'background.jpg']
const images = []
let imgCount = 0

imageUrls.forEach(src => {
    const image = new Image()
    image.src = `./img/${src}`
    image.onload = () => {
        imgCount++
        if (imgCount == imageUrls.length) {
            // all images have been loaded
            // start the game
            playGame()
        }
    }
    images.push(image)
})

class Player {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    draw() {
        c.drawImage(images[0], this.x, this.y)
    }
}

const player = new Player(0, 0)

// images have loaded, can start drawing them to canvas
const playGame = () => {
    // draw background
    c.drawImage(images[1], 0, 0, canvas.width, canvas.height)
    player.draw()
}

