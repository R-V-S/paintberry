
const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')

const colorPicker = document.getElementById('color-picker')

let cursorDown = false

let actions = []
let drawPath = []
let color = null

canvas.addEventListener('mousedown', function(e) {
  cursorDown = true
  color = {
    r: parseInt( colorPicker.value.substr(1,2), 16 ),
    g: parseInt( colorPicker.value.substr(3,2), 16 ),
    b: parseInt( colorPicker.value.substr(5,2), 16 ),
    a: 0.01
  }
  color.brightness = parseInt( (color.r + color.g + color.b) / 765 )
  //color.adjustedOpacity = color.a + (Math.abs( 0.5 - color.brightness ) * 0.1)
})

canvas.addEventListener('mouseup', function(e) {
  cursorDown = false
  actions.push({type: 'paint', path: drawPath})
  drawPath = []
})

canvas.addEventListener('webkitmouseforcechanged', function(e) {
  console.log(e)
})

canvas.addEventListener('touchstart', function(e) {
   // Iterate through the list of touch points and log each touch
   // point's force.
   for (var i=0; i < e.targetTouches.length; i++) {
     // Add code to "switch" based on the force value. For example
     // minimum pressure versus maximum pressure could result in
     // different handling of the user's input.
     console.log("targetTouches[" + i + "].force = " + e.targetTouches[i].force);
   }
}, false);

canvas.addEventListener('mousemove', function(e) {
  if (!cursorDown) { return }

  // console.log('webkitforce', e.webkitForce)
  // console.log(e)

  color.adjustedOpacity = color.a + (drawPath.length / 20000 )
  // console.log(drawPath.length)
  // synthesize event data
  const x = e.layerX
  const y = e.layerY

  // read from canvas
  const pixel = ctx.getImageData(x, y, 1, 1)
  const currentOpacity = pixel.data[3]

  // write to canvas
  if (drawPath.length) {
    let prevPoint = drawPath[drawPath.length-1]
    let distance = {
      x: prevPoint.x - x,
      y: prevPoint.y - y
    }
    distance.total = Math.ceil(Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y, 2))) //pythagorean
    if (distance.total) {
      let size = distance.total * 2
      for (var i=0; i<distance.total; i++) {

        let lineX = x + (distance.x * (i / distance.total) )
        let lineY = y + (distance.y * (i / distance.total) )

        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b}, ${color.adjustedOpacity})`
        ctx.beginPath()

        ctx.arc(lineX, lineY, size, 0, 360)
        ctx.fill()
      }
    }
  }

  // update drawPath data
  drawPath.push({x: x, y: y, color: color})
})