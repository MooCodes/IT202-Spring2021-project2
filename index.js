const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// set the canvas width/height
canvas.width = innerWidth / 2
canvas.height = innerHeight / 2

// draw a circle
c.beginPath()
c.arc(50, 50, 10, Math.PI * 2, false)
c.fillStyle = 'blue'
c.fill()
