const colors = [ '#00bdff', '#4d39ce', '#088eff']

const getRandomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`

const randomIntFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

class Particle {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.radians = Math.random() * Math.PI * 2 // initial radian (particle position in the circle perimeter)
    this.radiansDelta = 0.05 // How many radians to move per frame
    this.context = null
    this.distanceFromCenter = randomIntFromRange(50, 120)
    this.lastMouse = { x, y }
  }

  setContext(context) {
    this.context = context
    return this
  }

  draw(lastPoint) {
    if (!this.context) { throw new Error('Must set a context to draw a circle') }

    this.context.beginPath() // Con esto lo separo del trazado anterior
    this.context.strokeStyle = this.color
    this.context.lineWidth = this.radius
    this.context.moveTo(lastPoint.x, lastPoint.y) // Setea el "cursor" (donde va a empezar a dibujar)
    this.context.lineTo(this.x, this.y)
    this.context.stroke()
    this.context.closePath()
  }

  update(mouse) {
    const lastPoint = { x: this.x, y: this.y }
    
    // Move points over time
    this.radians += this.radiansDelta

    // Merge particle center with mouse position
    this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05
    this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05

    // Circular Motion
    this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter
    this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter

    this.draw(lastPoint)
  }
}

const init = () => {
  const canvas = document.getElementById('cv1')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const c = canvas.getContext('2d') // context
  const mouse = { x: null, y: null}

  // Creation
  const particles = [];
  for (let index = 0; index < 50; index++) {
    const radius = randomIntFromRange(1, 2)
    const x = canvas.width / 2
    const y = canvas.height / 2
    const color = colors[index%colors.length]

    particles.push(new Particle(x, y, radius, color).setContext(c))
  }

  // Animation
  const animate = () => {
    requestAnimationFrame(animate)

    // Cada animationFrame dibuja un rectangulo con 0.05 de opacidad encima del que ya estaba
    // Generando asi el efecto de rastro
    c.fillStyle = 'rgba(255, 255, 255, 0.05)'
    c.fillRect(0, 0, window.innerWidth, window.innerHeight)

    particles.forEach(particle => {
      particle.update(mouse)
    })
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
