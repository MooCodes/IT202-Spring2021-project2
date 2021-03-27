const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// set the canvas width/height
canvas.width = innerWidth / 2
canvas.height = innerHeight / 2

// define & load in our game images
const imageUrls = ['player.png', 'background.jpg', 'enemy.png']
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
        this.width = 32
        this.height = 32
        this.velocity = velocity
        this.maxSpeed = maxSpeed
        this.friction = friction
        this.lives = 3
    }

    draw() {
        c.drawImage(images[0], this.x, this.y)
    }

    update() {
        this.moveUpOrDown()
    }

    moveUpOrDown() {
        // if user hit 'a' or '<--' keys
        if (keys[37] || keys[65]) {
            // move left
            if (this.velocity > -this.maxSpeed)
                // as long as we're not moving faster than our max, keep speeding up
                this.velocity--
        }

        // if user hit 'd' or '-->' keys
        if (keys[39] || keys[68]) {
            // move right
            if (this.velocity < this.maxSpeed)
                // as long as we're not moving faster than our max, keep speeding up
                this.velocity++
        }

        // add a smoothing effect overtime for when we are stopping
        this.velocity *= this.friction
        this.y += this.velocity

        // add bounds to movement
        if (this.y <= 0) {
            this.y = 0
        } else if (this.y >= canvas.height - 32) {
            this.y = canvas.height - 32
        }
    }
}

class Enemy {
    constructor(x, y, velocity, maxSpeed) {
        this.x = x
        this.y = y
        this.width = 24
        this.height = 18
        this.velocity = velocity
        this.maxSpeed = maxSpeed
    }

    draw() {
        c.drawImage(images[2], this.x, this.y)
    }

    update() {
        if (this.velocity > -this.maxSpeed)
            this.velocity--

        this.x += this.velocity
    }

}

const player = new Player(32, (canvas.height / 2) - 32, 0, 6, 0.90)
const enemies = []

let spawnEnemyInterval
const spawnEnemies = () => {
    // every second, spawn a new enemy virus
    spawnEnemyInterval = setInterval(() => {
        enemies.push(new Enemy(canvas.width + 50, getRandomNum(0, canvas.height - 18), 0, 10))
    }, 1000)
}

// images have loaded, can start with game logic
const playGame = () => {
    animate()
    spawnEnemies()
}

// where we draw and update our game objects
let animationId
const animate = () => {
    animationId = requestAnimationFrame(animate)
    // draw background
    c.drawImage(images[1], 0, 0, canvas.width, canvas.height)
    // draw player
    player.draw()
    player.update()

    enemies.forEach((enemy, index) => {
        enemy.draw()
        enemy.update()

        // check if the enemy has collided with the player
        if (checkCollision(player.x, player.y, player.width, player.height,
            enemy.x, enemy.y, enemy.width, enemy.height)) {
            console.log('collision detected! remove enemy')
                setTimeout(() => {
                    enemies.splice(index, 1)
                }, 0)

            player.lives--
            if (player.lives === 0)
                cancelAnimationFrame(animationId)
        }
    })
}

let checkCollision = (x1, y1, w1, h1, x2, y2, w2, h2) => {
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
        return false;
    }
    return true;
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

function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}