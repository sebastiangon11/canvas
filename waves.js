const colors = [ '#00bdff', '#4d39ce', '#088eff']

const getRandomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`

const randomIntFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

class Particle {
  constructor() {
  }

  setContext(context) {
    this.context = context
    return this
  }

  draw() {
    if (!this.context) { throw new Error('Must set a context to draw a circle') }

    this.context.beginPath() // Con esto lo separo del trazado anterior
    this.context.closePath()
  }

  update() {
    this.draw()
  }
}

const init = () => {
  const gui = new dat.GUI()
  const canvas = document.getElementById('cv1')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const c = canvas.getContext('2d') // context
  const mouse = { x: null, y: null}

  const wave = {
    y: canvas.height / 2,
    length: 0.01,
    amplitude: 50,
    frequency: 0.01
  }

  const strokeColor = { h: 200, s: 50, l: 50 }
  const bgColor = { r: 0, g: 0, b: 0 , a: 0.01}

  const waveFolder = gui.addFolder('wave')
  waveFolder.add(wave, 'y', 0, canvas.height)
  waveFolder.add(wave, 'length', -0.01, 0.01)
  waveFolder.add(wave, 'amplitude', -300, 300)
  waveFolder.add(wave, 'frequency', -0.01, 1)
  waveFolder.open()
  const strokeFolder = gui.addFolder('stroke')
  strokeFolder.add(strokeColor, 'h', 0, 255)
  strokeFolder.add(strokeColor, 's', 0, 50)
  strokeFolder.add(strokeColor, 'l', 0, 50)
  strokeFolder.open()
  const bgFolder = gui.addFolder('background')
  bgFolder.add(bgColor, 'r', 0, 255)
  bgFolder.add(bgColor, 'g', 0, 255)
  bgFolder.add(bgColor, 'b', 0, 255)
  bgFolder.add(bgColor, 'a', 0, 0.1)
  bgFolder.open()

  let increment = wave.frequency
  let iterCount = 0

  // Animation
  const animate = () => {
    requestAnimationFrame(animate)

    // Cada animationFrame dibuja un rectangulo con 0.05 de opacidad encima del que ya estaba
    c.fillStyle = `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})`
    // c.clearRect(0, 0, window.innerWidth, window.innerHeight)
    c.fillRect(0, 0, window.innerWidth, window.innerHeight)

    c.beginPath()
    c.moveTo(0, canvas.height / 2)
  
    for (let pixel = 0; pixel < canvas.width; pixel++) {
      c.lineTo(pixel, (
        wave.y/2 +
        Math.sin(pixel * wave.length + increment) * wave.amplitude * Math.sin(increment)))
    }
    c.strokeStyle = `hsl(${Math.abs(strokeColor.h * Math.sin(increment))}, ${strokeColor.s}%, ${strokeColor.l}%)`
    c.stroke()
    increment += wave.frequency
    iterCount += 1
  }

  animate()

  const onMouseMove = (event) => {
    const { x, y } = event
    mouse.x = x
    mouse.y = y
  }

  const onResize = (event) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // init()
  }
  
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)
}
