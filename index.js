const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// set the canvas width/height
canvas.width = innerWidth / 2
canvas.height = innerHeight / 2

console.log(canvas.width, canvas.height)

// define & load in our game images
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
    constructor(x, y, velocity, maxSpeed, friction) {
        this.x = x
        this.y = y
        this.velocity = velocity
        this.maxSpeed = maxSpeed
        this.friction = friction
    }

    draw() {
        c.drawImage(images[0], this.x, this.y)
    }

    update() {
        if (keys[37] || keys[65]) {
            // move left
            if (this.velocity > -this.maxSpeed)
                this.velocity--
        }

        if (keys[39] || keys[68]) {
            // move right
            if (this.velocity < this.maxSpeed)
                this.velocity++
        }

        // add a smoothing effect to when we are stopping
        this.velocity *= this.friction
        this.y += this.velocity
    }
}

let speed = 4
let friction = 0.90
const player = new Player(32, (canvas.height / 2) - 32, 0, speed, friction)

// images have loaded, can start with game logic
const playGame = () => {
    animate()
}

// where we draw and update our game objects
const animate = () => {
    requestAnimationFrame(animate)
    // draw background
    c.drawImage(images[1], 0, 0, canvas.width, canvas.height)
    // draw player
    player.draw()
    player.update()
}

// logic for knowing when a certain key is pressed/released
// with using just an array indexed by keycode
let keys = []
document.body.addEventListener('keydown', (e) => {
    keys[e.keyCode] = true
})
document.body.addEventListener('keyup', (e) => {
    keys[e.keyCode] = false
})