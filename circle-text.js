const colors = [ '#00bdff', '#4d39ce', '#088eff']

const getRandomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`

const randomIntFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

class Particle {
  constructor(goalX, goalY, lastX, lastY, color, radius) {
    this.goalX = goalX
    this.goalY = goalY
    this.lastX = lastX
    this.lastY = lastY
    this.color = color
    this.radius = radius
    window.addEventListener('mousemove', this.onMouseMove.bind(this)); //FIXME: A la mierda la perdormance
  }

  onMouseMove(event) {
    function isCircleCollided(x, y, radius, x1, y1, radius1) {
      if (!(Math.abs(x1 - x) > radius1 + radius && Math.abs(y1 - y) > radius1 + radius)) {
        const dx = x1 - x;
        const dy = y1 - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < (radius1 + radius)) {
            return true
        }
      }
      return false;
    }

    if(isCircleCollided(this.lastX, this.lastY, this.radius, event.x, event.y, 30) && this.isInPosition()) {
      this.lastX = Math.random() * window.innerWidth
      this.lastY = Math.random() * window.innerHeight
    }
  }

  setContext(context) {
    this.context = context
    return this
  }

  isInPosition() {
    const distance = 0.3
    const xDistanceToGoal = Math.abs(this.goalX - this.lastX)
    const yDistanceToGoal = Math.abs(this.goalY - this.lastY)
    const isInPosition = xDistanceToGoal < distance && yDistanceToGoal <= distance
    if(isInPosition) {
      return true
    }
    return false
  }

  draw() {
    if (!this.context) { throw new Error('Must set a context to draw a circle') }

    const radius = this.radius;
    this.context.beginPath()
    this.context.arc(this.lastX, this.lastY, radius, 0, Math.PI * 2, false)
    this.context.fillStyle = this.color
    this.context.closePath()
    this.context.fill()
  }

  update() {
    if (!this.isInPosition()) {
      const velX = (this.goalX - this.lastX) * 2 / 10
      const velY = (this.goalY - this.lastY) * 2 / 10
  
      this.lastX += velX
      this.lastY += velY
    }

    this.draw()
  }
}

const init = () => {
  const canvas = document.getElementById('cv1')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const c = canvas.getContext('2d') // context
  const mouse = { x: null, y: null}

  
  // Creation
  const densess = 3
  const particleRadius = 2
  const particles = []

  // create background canvas to render the real text
  const bgCanvas = document.createElement('canvas');
  bgCanvas.width = canvas.width
  bgCanvas.height = canvas.height
  const bgCtx = bgCanvas.getContext('2d')
  // Text rendering
  bgCtx.font = '80px helvetica'
  bgCtx.fontStyle = '#ffffff'

  bgCtx.beginPath()
  bgCtx.fillText('Seba', (bgCanvas.width / 2) - 100, (bgCanvas.height / 2) - 25 );
  // bgCtx.fillText('CX', (bgCanvas.width / 2) - 100, (bgCanvas.height / 2) - 25 );
  bgCtx.closePath()
  bgCtx.beginPath()
  bgCtx.fillText('Gonzalez', (bgCanvas.width / 2) - 150, (bgCanvas.height / 2) + 30);
  // bgCtx.fillText('one', (bgCanvas.width / 2) - 110, (bgCanvas.height / 2) + 30);
  bgCtx.closePath()
  
  // Get the background canvas image data
  const imageData = bgCtx.getImageData(0, 0, bgCanvas.width, bgCanvas.height)

  // No more need of this one
  // bgCanvas.remove()

  for(height = 0; height < canvas.height; height += densess) {
    for(width = 0; width < canvas.width; width += densess) {
      // Get the PIXEL DATA
      const pixel = imageData.data[(width + height * canvas.width) * 4 - 1] // Formula to get the pixel
      if (pixel == 255) { // if the pixel is white
        // Random start positions
        const lastX = Math.random() * canvas.width
        const lastY = Math.random() * canvas.height
        // Pixel original position is our goal
        const goalX = width
        const goalY = height

        const particle = new Particle(goalX, goalY, lastX, lastY, 'white', particleRadius)
        particle.setContext(c)
        particles.push(particle)
      }
    }
  }

  // Animation
  const animate = () => {
    requestAnimationFrame(animate)
    c.fillStyle = 'rgba(40, 40, 40, 1)'
    c.fillRect(0, 0, window.innerWidth, window.innerHeight)
    // c.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(particle => {
      particle.update()
    })
  }

  const onMouseMove = (event) => {
    const { x, y } = event
    mouse.x = x
    mouse.y = y
  }

  const onResize = (event) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)

  animate()
}
