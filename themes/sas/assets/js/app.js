let app

let numberOfSectors = 12

let w = 0
let h = 0

let timer = 0
let velocity = 0.04
let currentPos = {'x' : 850, 'y': 850}
let targetPos = {'x' : 850, 'y': 850}

let kaleidoscope
let sector
let image
let maskImages = []
let radius = 4000

document.addEventListener('DOMContentLoaded', init)
window.addEventListener('resize', onWindowResize)

function init () {
  w = window.innerWidth
  h = window.innerHeight
  
  //Create a Pixi Application
  app = new PIXI.Application({
    width: w, 
    height: h,
    antialias: true
  })
  app.stage.interactive = true
//  app.stage.mousemove = onMouseMove

  image = PIXI.Texture.fromImage('/img/kaleidoscope.jpg')
  document.getElementById('js-canvas-wrapper').appendChild(app.view);
  
  createKaleidoscope()
  animate()
}

function onMouseMove (e) {
  //currentPos.x = e.data.global.x
//  currentPos.y = e.data.global.y
}

function createKaleidoscope () {
  // calculate the length of an arc 
  let arc = 2 * Math.PI / numberOfSectors

  kaleidoscope = new PIXI.Container()
  kaleidoscope.position.set(w / 2, h / 2)
  
  for (let i = 0; i < numberOfSectors; i++ ) {

    // create the kaleidoscope "slices"
    sector = new PIXI.Graphics()
    sector.beginFill('0x000000')
    sector.moveTo(w / 2, h / 2)
    sector.arc(w / 2, h / 2, radius, -arc / 2, arc / 2)
    sector.endFill()
    
    let maskImage = new PIXI.extras.TilingSprite(image, radius, radius)
    maskImages.push(maskImage)
    maskImage.mask = sector
    
    let container = new PIXI.Container()
    container.addChild(maskImage)
    container.addChild(sector)
    container.pivot.x = w / 2
    container.pivot.y = h / 2
    container.rotation = arc * i
    container.scale.x = i % 2 ? 1 : -1

    kaleidoscope.addChild(container)
    
  }
  app.stage.addChild(kaleidoscope)
}

function animate () {
  app.ticker.add(() => {
    let delta = { 'x': targetPos.x - currentPos.x, 'y': targetPos.y - currentPos.y}
    targetPos = {'x': targetPos.x - (delta.x * velocity), 'y': targetPos.y - (delta.y * velocity)}
    timer += 0.4
    
    for(let i = 0;i < numberOfSectors; i++) {
      maskImages[i].tilePosition.y = targetPos.y + timer
      maskImages[i].tilePosition.x = targetPos.x + timer
    }
  })
}

function reset() {
  app.stage.removeChild(kaleidoscope)
  maskImages = []
}

function onWindowResize () {
  w = window.innerWidth
  h = window.innerHeight
  
  // resize the renderer
  app.renderer.view.style.width = w + 'px'
  app.renderer.view.style.height = h + 'px'
  app.renderer.resize(w,h)
  
  kaleidoscope.position.set(w / 2, h / 2)
}
