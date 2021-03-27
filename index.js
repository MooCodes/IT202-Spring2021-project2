const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// set the canvas width/height
canvas.width = innerWidth / 2
canvas.height = innerHeight / 2

// define & load in our game images
const imageUrls = ['player.png', 'background.jpg', 'enemy.png', 'benefit.png']
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
        this.score = 0
        this.level = 1
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
        this.width = 32
        this.height = 32
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

class Benefit {
    constructor(x, y, velocity, maxSpeed) {
        this.x = x
        this.y = y
        this.width = 32
        this.height = 32
        this.velocity = velocity
        this.maxSpeed = maxSpeed
    }

    draw() {
        c.drawImage(images[3], this.x, this.y)
    }

    update() {
        if (this.velocity > -this.maxSpeed)
            this.velocity--

        this.x += this.velocity
    }
}

const player = new Player(32, (canvas.height / 2) - 32, 0, 6, 0.90)
const enemies = []
const benefits = []

let spawnEnemyInterval
let enemySpeed = 5
const spawnEnemies = () => {
    // every second, spawn a new enemy virus
    spawnEnemyInterval = setInterval(() => {
        enemies.push(new Enemy(canvas.width + 50, getRandomNum(0, canvas.height - 18), 0, enemySpeed))
    }, 500)
}

let benefitSpeed = 2
const spawnBenefits = () => {
    setInterval(() => {
        benefits.push(new Benefit(canvas.width + 50, getRandomNum(0, canvas.height - 18), 0, benefitSpeed))
    }, 2000)
}

// images have loaded, can start with game logic
const playGame = () => {
    animate()
    spawnEnemies()
    spawnBenefits()
}

// where we draw and update our game objects
let animationId
const animate = () => {
    animationId = requestAnimationFrame(animate)
    // draw background
    c.drawImage(images[1], 0, 0, canvas.width, canvas.height)
    // draw score
    c.font = "32px Arial"
    let topLeftMsg = `Lives: ${player.lives} Score: ${player.score} Level: ${player.level}`
    c.strokeText(topLeftMsg, 10, 30)
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
            // remove enemy smoothly

            player.lives--
            if (player.lives === 0) {
                c.font = "64px Arial Bold"
                c.strokeText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2)
                cancelAnimationFrame(animationId)
            }

            setTimeout(() => {
                enemies.splice(index, 1)
            }, 0)
        }

        // don't want infinite # of enemies
        // delete them when they're off the screen
        if (enemy.x + enemy.width < 0) {
            console.log('deleting enemy')
            setTimeout(() => {
                enemies.splice(index, 1)
            }, 0)
        }
    })

    benefits.forEach((benefit, index) => {
        benefit.draw()
        benefit.update()

        // player collided with benefit
        if (checkCollision(player.x, player.y, player.width, player.height,
            benefit.x, benefit.y, benefit.width, benefit.height)) {
            
            // increment score
            player.score += 10

            if (player.score % 50 == 0) {
                player.level++
                enemySpeed *= 1.5
                benefitSpeed *= 2
            }

            // delete the bene
            setTimeout(() => {
                benefits.splice(index, 1)
            }, 0)
        }

        // don't want infinite # of enemies
        // delete them when they're off the screen
        if (benefit.x + benefit.width < 0) {
            console.log('deleting enemy')
            setTimeout(() => {
                benefits.splice(index, 1)
            }, 0)
        }
    })
}

const checkCollision = (x1, y1, w1, h1, x2, y2, w2, h2) => {
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

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/IT202-Spring2021-project2/serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err));
    });
}