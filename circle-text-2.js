const colors = [ '#00bdff', '#4d39ce', '#088eff']

const getRandomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`

const randomIntFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

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

class Particle {
  constructor(goalX, goalY, x, y, color, radius) {
    this.goalX = goalX // X to where the particle is traveling
    this.originalX = goalX // X from the original text pixel
    this.x = x // actual paticle X position
    this.goalY = goalY
    this.originalY = goalY
    this.y = y
    this.originalRadius = radius // Original particle radius
    this.radius = radius // Actual particle radius (with modifiers)
    this.color = color
    this.section = null
    this.isReleased = false
    window.addEventListener('click', this.openSection.bind(this))
    window.addEventListener('click', this.onMouseClick.bind(this))
    window.addEventListener('mousemove', this.onMouseMove.bind(this))


    this.inflateMutex = true
  }

  onMouseMove(){
    if(this.isReleased && this.section && isCircleCollided(this.x, this.y, this.radius, event.x, event.y, 0)) {
      if (this.inflateMutex) {
        this.radius += 25
        this.inflateMutex = false
      }
    } else {
      if (this.isReleased && !this.inflateMutex) {
        this.radius = this.radius -= 25
        this.inflateMutex = true
      }
    }
  }

  openSection() {
    if(this.isReleased && this.section && isCircleCollided(this.x, this.y, this.radius, event.x, event.y, 0)) {
      window.location.href = `#${this.section}`
    }
  }

  onMouseClick() {
    if(this.isReleased) {
      this.isReleased = false
      this.color = 'white'
      // was traveling to random positin, so we redirect it to the text position
      this.goalX = this.originalX
      this.goalY = this.originalY
    } else {
      this.isReleased = true
      if (this.section) {
        this.color = colors[Math.floor(Math.random()*2)]
      }
       // was traveling to text position, so we assign a random goal position
       this.goalX = Math.random() * window.innerWidth
       this.goalY = Math.random() * window.innerHeight
    }
  }

  setContext(ctx) {
    this.context = ctx
    return this
  }

  setSection(section) {
    this.section = section
    return this
  }

  isInPosition() {
    const distance = 0.3
    const xDistanceToGoal = Math.abs(this.goalX - this.x)
    const yDistanceToGoal = Math.abs(this.goalY - this.y)
    const isInPosition = xDistanceToGoal < distance && yDistanceToGoal <= distance
    if(isInPosition) {
      return true
    }
    return false
  }

  draw() {
    if (!this.context) { throw new Error('Must set a context to draw a circle') }

    const radius = this.radius
    this.context.beginPath()
    this.context.arc(this.x, this.y, radius, 0, Math.PI * 2, false)
    this.context.fillStyle = this.color
    this.context.closePath()
    this.context.fill()

    // text
    if (this.section) {
      this.context.font = '20px helvetica'
      this.context.fillStyle = "rgba(40, 40, 40, 1)";
      this.context.fillText(this.section, this.x - this.radius / 2, this.y);
    }
  }

  update() {
    let velX = (this.goalX - this.x) / 10
    let velY = (this.goalY - this.y) / 10

    if (this.isReleased) {
      this.goalX += Math.floor(Math.random()*2) == 1 ? 1 : -1
      this.goalY += Math.floor(Math.random()*2) == 1 ? 1 : -1
      if (this.section && this.radius < 100) {
        this.radius++;
      }
    } else if (this.radius > this.originalRadius) {
      this.radius--
    }
  
    this.x += velX
    this.y += velY
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
  const densess = 1
  const particleRadius = 1
  const particles = []
  const sections = ['Trabajos', 'Estudios', 'Experiencia', 'Hobbies']

  // create background canvas to render the real text
  const bgCanvas = document.createElement('canvas');
  bgCanvas.width = canvas.width
  bgCanvas.height = canvas.height
  const bgCtx = bgCanvas.getContext('2d')
  // Text rendering
  bgCtx.font = '80px helvetica'

  bgCtx.beginPath()
  bgCtx.fillText('Seba', (bgCanvas.width / 2) - 100, (bgCanvas.height / 2) - 25 );
  // bgCtx.fillText('CX', (bgCanvas.width / 2) - 100, (bgCanvas.height / 2) - 25 );
  bgCtx.closePath()
  bgCtx.beginPath()
  bgCtx.fillText('Gonzalez', (bgCanvas.width / 2) - 150, (bgCanvas.height / 2) + 30);
  // bgCtx.fillText('one', (bgCanvas.width / 2) - 110, (bgCanvas.height / 2) + 30);
  bgCtx.closePath()

  // bgCtx.font = '10px helvetica'
  // bgCtx.beginPath()
  // bgCtx.fillText('(click my name)', (bgCanvas.width / 2) + 100, (bgCanvas.height / 2) + 100);
  // bgCtx.closePath()
  
  // Get the background canvas image data
  const imageData = bgCtx.getImageData(0, 0, bgCanvas.width, bgCanvas.height)


  for(height = 0; height < canvas.height; height += densess) {
    for(width = 0; width < canvas.width; width += densess) {
      // Get the PIXEL DATA
      const pixel = imageData.data[(width + height * canvas.width) * 4 - 1] // Formula to get the pixel
      if (pixel == 255) { // if the pixel is white
        // Random start positions
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        // Pixel original position is our goal
        const goalX = width
        const goalY = height
        const section = sections.pop()

        const particle = new Particle(goalX, goalY, x, y, 'white', particleRadius)
        particle.setContext(c)
        if(section) {
          particle.setSection(section)
        }
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
