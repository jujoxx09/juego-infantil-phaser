// Configuración básica del juego
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#AEEEEE',
  parent: 'game-container',
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let contadorPeces = 0;
let contadorTortugas = 0;
let textoContador;
let fondoContador;
let musicaFondo;

function preload() {
  // Cargar imágenes
  this.load.image('fondo', 'assets/fondo.png');
  this.load.image('amigo1', 'assets/amigo1.png');
  this.load.image('amigo2', 'assets/amigo2.png');
  this.load.image('pez', 'assets/pez.png');
  this.load.image('tortuga', 'assets/tortuga.png');
  this.load.image('cubo', 'assets/cubo.png');

  // 🎵 Cargar la música
  this.load.audio('musica', 'assets/musica.mp3');
}

function create() {
  // Fondo
  this.add.image(400, -150, 'fondo').setScale(0.3);

  // Personajes
  this.add.image(200, 420, 'amigo1').setScale(0.4);
  this.add.image(600, 420, 'amigo2').setScale(0.4);

  // Cubo
  const cubo = this.add.image(400, 500, 'cubo').setScale(0.3);

  // Texto de instrucciones
  this.add.text(130, 20, 'Arrastra los animales y cuenta cuántos hay', {
    fontSize: '22px',
    fill: '#000'
  });

  // 🎵 Crear el objeto de música (aún no suena)
  musicaFondo = this.sound.add('musica', {
    loop: true,
    volume: 0.5
  });

  // 💡 Para evitar el bloqueo del navegador, empezamos la música tras un clic
  this.input.once('pointerdown', () => {
    if (!musicaFondo.isPlaying) {
      musicaFondo.play();
    }
  });

  // Crear animales
  const animales = [];
  // Número aleatorio de peces y tortugas (entre 1 y 10)
const numPeces = Phaser.Math.Between(1, 10);
const numTortugas = Phaser.Math.Between(1, 10);

  for (let i = 0; i < numPeces; i++) {
    const pez = this.add.image(Phaser.Math.Between(100, 700), Phaser.Math.Between(200, 400), 'pez')
      .setInteractive({ draggable: true })
      .setScale(0.1);
    animales.push(pez);
  }

  for (let i = 0; i < numTortugas; i++) {
    const tortuga = this.add.image(Phaser.Math.Between(100, 700), Phaser.Math.Between(200, 400), 'tortuga')
      .setInteractive({ draggable: true })
      .setScale(0.1);
    animales.push(tortuga);
  }

  // Hacer los objetos arrastrables
  this.input.setDraggable(animales);

  this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    gameObject.x = dragX;
    gameObject.y = dragY;
  });

  // Detectar si se sueltan sobre el cubo
  this.input.on('dragend', (pointer, gameObject) => {
    const distancia = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, cubo.x, cubo.y);
    if (distancia < 100) {
      if (gameObject.texture.key === 'pez') contadorPeces++;
      if (gameObject.texture.key === 'tortuga') contadorTortugas++;
      gameObject.destroy();
      actualizarTexto();
    }
  });

    // Fondo para el texto del contador
    fondoContador = this.add.rectangle(250, 110, 780, 40, 0x000000, 0.4); 
    // (x, y, ancho, alto, color hexadecimal, opacidad)

    // Texto encima del fondo
    textoContador = this.add.text(130, 100, '', { 
    fontSize: '22px', 
    fill: '#ffffff', 
    fontStyle: 'bold' 
    });

    // Traer el texto al frente
    textoContador.setDepth(1);

    actualizarTexto();
}

function update() {
  // Aquí podrías agregar animaciones o efectos
}


function actualizarTexto() {
  textoContador.setText(`PECES 🐠: ${contadorPeces}   |   TORTUGAS 🐢: ${contadorTortugas}`);
}
