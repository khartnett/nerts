setup = (loader, resources) ->
  `var rectangle`
  # cards are 98 px tall, 73 wide
  texture = PIXI.utils.TextureCache['cards.png']
  #Create a rectangle object that defines the position and
  #size of the sub-image you want to extract from the texture
  rectangle = new (PIXI.Rectangle)(192, 128, 64, 64)
  cardW = 73
  cardH = 98
  cardFace = 11
  cardSuit = 3
  rectangle = new (PIXI.Rectangle)(cardFace * cardW, cardSuit * cardH, cardW, cardH)
  #Tell the texture to use that rectangular section
  texture.frame = rectangle
  #Create the sprite from the texture
  card = new (PIXI.Sprite)(texture)
  #Position the card sprite on the canvas
  card.x = 88
  card.y = 148
  #Add the card to the stage
  app.stage.addChild card
  #Render the stage
  #        app.renderer.render(stage);
  card.anchor.x = 0.5
  card.anchor.y = 0.5
  # enable the bunny to be interactive... this will allow it to respond to mouse and touch events
  card.interactive = true
  # this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
  card.buttonMode = true
  card.on('pointerdown', onDragStart).on('pointerup', onDragEnd).on('pointerupoutside', onDragEnd).on 'pointermove', onDragMove
  app.ticker.add (delta) ->
# just for fun, let's rotate mr rabbit a little
# delta is 1 if running at 100% performance
# creates frame-independent tranformation
#            card.rotation += -0.01 * delta;
    return
  return

onDragStart = (event) ->
# store a reference to the data
# the reason for this is because of multitouch
# we want to track the movement of this particular touch
  @data = event.data
  @alpha = 0.5
  @dragging = true
  card.rotation = -0.4
  return

onDragEnd = ->
  @alpha = 1
  @dragging = false
  # set the interaction data to null
  @data = null
  socket = io()
  socket.emit 'chat message', 'The Card was dropped at x:' + @x + ' y:' + @y
  card.rotation = 0
  return

onDragMove = ->
  if @dragging
    newPosition = @data.getLocalPosition(@parent)
    @x = newPosition.x
    @y = newPosition.y
  return

$ ->
  socket = io()
  $('form#chat').submit ->
    socket.emit 'chat message', $('#m').val()
    $('#m').val ''
    false
  socket.on 'chat message', (msg) ->
    $('#messages').append $('<li>').text(msg)
    window.scrollTo 0, document.body.scrollHeight
    return
  $('form#sign_in_form').submit ->
    socket.emit 'sign in', JSON.stringify( { 'name': $('#name').val(), 'avitar': $('#avitar').val() } ), (id, users) -> console.log('you are id' + id); console.dir(users)
    $('#name').val ''
    false
  return


# The application will create a renderer using WebGL, if possible,
# with a fallback to a canvas render. It will also setup the ticker
# and the root stage PIXI.Container.
app = new (PIXI.Application)(800, 600, backgroundColor: 0x1099bb)
# The application will create a canvas element for you that you
# can then insert into the DOM.
document.body.appendChild app.view
PIXI.loader.add('cardTiles', 'cards.png').load setup
card = undefined

