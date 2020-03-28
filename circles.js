const colors = [ '#00bdaa', '#400082', '#fe346e', '#f1e7b6']

const getRandomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`

class Circle {
  constructor(x, y, radius, dx, dy) {
    this.x = x
    this.y = y
    this.radius = radius
    this.minRadius = radius
    this.maxRadius = 60
    this.dx = dx // velocidad en que se mueve en x
    this.dy = dy // velocidad en que se mueve en y
    this.context = null
    this.color = null
    this.stroke = null
  }

  setContext(context) {
    this.context = context;
    return this
  }

  setColor(color) {
    this.color = color
    return this
  }

  setStroke(stroke) {
    this.stroke = stroke
    return this
  }

  draw() {
    if (!this.context) { throw new Error('Must set a context to draw a circle') }
    // Dibujo el circulo
    this.context.beginPath() // Con esto lo separo del trazado anterior
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    if (this.color) {
      this.context.fillStyle = this.color
      this.context.fill()
    }
    if (this.stroke) {
      this.context.fillStyle = this.stroke
      this.context.stroke()
    }
  }

  getPosition() {
    return {
      x: this.x,
      y: this.y
    }
  }

  inflate(delta) {
    if (this.radius < this.maxRadius) {
      this.radius += delta
    }
  }

  shrink(delta) {
    if (this.radius > this.minRadius && delta <= this.minRadius) {
      this.radius -= delta
    }
  }

  update() {
    // rebote en x
    if ((this.x + this.radius) > window.innerWidth || (this.x - this.radius < 0)) {
      this.dx = -this.dx
    }

    // rebote en y
    if ((this.y + this.radius) > window.innerHeight || (this.y - this.radius < 0)) {
      this.dy = -this.dy
    }

    this.x += this.dx
    this.y += this.dy
    
    // Re render
    this.draw()
  }
}

const init = () => {
  const canvas = document.getElementById('cv1')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const c = canvas.getContext('2d') // context
  const mouse = { x: null, y: null}

  // Rectangulo
  // c.fillStyle = "#3483fa"
  // c.fillRect(100, 100, 100, 100)

  // Line
  // c.beginPath()
  // c.moveTo(50, 300)
  // c.lineTo(300, 100)
  // c.lineTo(400, 200)
  // c.strokeStyle = "#454545"
  // c.stroke()

  const circlesArray = [];
  for (let index = 0; index < 800; index++) {
    const radius = (Math.random() * 13) + 1
    const x = Math.random() * (window.innerWidth - (radius * 2) + radius)
    const y = Math.random() * (window.innerHeight - (radius * 2) + radius)
    const dx = (Math.random() - 0.5) * 5
    const dy = (Math.random() - 0.5) * 5
    const color = colors[index%colors.length]

    circlesArray.push(new Circle(x, y, radius, dx, dy).setContext(c).setColor(color))
  }

  const animate = () => {
    requestAnimationFrame(animate)

    // En cada frame limpio el canvas
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)

    circlesArray.forEach(circle => {
      const { x: circleX, y: circleY } = circle.getPosition()
      const xDistance = Math.abs(mouse.x - circleX)
      const yDistance = Math.abs(mouse.y - circleY)

      if (xDistance < 50 && yDistance < 50)
        circle.inflate(2)
      else
        circle.shrink(2)
      
      circle.update()
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
