var app, card, onDragEnd, onDragMove, onDragStart, setup;

setup = function(loader, resources) {
  var rectangle;
  var card, cardFace, cardH, cardSuit, cardW, rectangle, texture;
  texture = PIXI.utils.TextureCache['cards.png'];
  rectangle = new PIXI.Rectangle(192, 128, 64, 64);
  cardW = 73;
  cardH = 98;
  cardFace = 11;
  cardSuit = 3;
  rectangle = new PIXI.Rectangle(cardFace * cardW, cardSuit * cardH, cardW, cardH);
  texture.frame = rectangle;
  card = new PIXI.Sprite(texture);
  card.x = 88;
  card.y = 148;
  app.stage.addChild(card);
  card.anchor.x = 0.5;
  card.anchor.y = 0.5;
  card.interactive = true;
  card.buttonMode = true;
  card.on('pointerdown', onDragStart).on('pointerup', onDragEnd).on('pointerupoutside', onDragEnd).on('pointermove', onDragMove);
  app.ticker.add(function(delta) {});
};

onDragStart = function(event) {
  this.data = event.data;
  this.alpha = 0.5;
  this.dragging = true;
  card.rotation = -0.4;
};

onDragEnd = function() {
  var socket;
  this.alpha = 1;
  this.dragging = false;
  this.data = null;
  socket = io();
  socket.emit('chat message', 'The Card was dropped at x:' + this.x + ' y:' + this.y);
  card.rotation = 0;
};

onDragMove = function() {
  var newPosition;
  if (this.dragging) {
    newPosition = this.data.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;
  }
};

$(function() {
  var socket;
  socket = io();
  $('form#chat').submit(function() {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
  $('form#sign_in_form').submit(function() {
    socket.emit('sign in', JSON.stringify({
      'name': $('#name').val(),
      'avitar': $('#avitar').val()
    }));
    $('#name').val('---');
    return false;
  });
});

app = new PIXI.Application(800, 600, {
  backgroundColor: 0x1099bb
});

document.body.appendChild(app.view);

PIXI.loader.add('cardTiles', 'cards.png').load(setup);

card = void 0;
