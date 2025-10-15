// ============================
// 🎬 ESCENA DE PORTADA
// ============================

'probando ++'
class PortadaScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PortadaScene' });
  }

  preload() {
    this.load.image('fondo1', 'assets/fondo1.png');
    this.load.image('tortuga', 'assets/tortuga.png');
    this.load.image('cubo', 'assets/cesta.png');
    this.load.audio('saludo', 'assets/saludo.mp3');
  }

  create() {
    this.add.image(500, 300, 'fondo1').setScale(0.7);

    // 🏷️ Título
    this.add.text(500, 200, '¡RESCATEMOS A LAS TORTUGAS MARINAS!', {
      fontSize: '30px',
      fill: '#000000ff',
      fontStyle: 'bold',
      fontFamily: 'Comic Sans MS',
      backgroundColor: '#FFF176'
    }).setOrigin(0.5);


    // 🧺 Cesta
    cubo = this.add.image(300, 420, 'cubo').setScale(0.5);

    // 🐢 Tortugas animadas dentro de la cesta
    for (let i = 0; i < 4; i++) {
      const tortuga = this.add.image(
        300 + Phaser.Math.Between(-50, 50),
        400 + Phaser.Math.Between(-30, 30),
        'tortuga'
      ).setScale(0.1);

      this.tweens.add({
        targets: tortuga,
        y: tortuga.y - Phaser.Math.Between(10, 30),
        duration: Phaser.Math.Between(800, 1500),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // 🔘 Botón "Empezar"
    boton = this.add.text(500, 520, 'EMPEZAR 🐢', {
      fontSize: '32px',
      backgroundColor: '#FFF176',
      fill: '#000000ff',
      padding: { x: 20, y: 10 },
      fontFamily: 'Comic Sans MS'
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('JuegoScene'));
  }
}

// ============================
// 🎮 ESCENA PRINCIPAL DEL JUEGO
// ============================
class JuegoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'JuegoScene' });
  }

  preload() {
    this.load.image('fondo', 'assets/fondo2.png');
    this.load.image('amigo2', 'assets/amigo2.png');
    this.load.image('huevoroto', 'assets/huevoroto.png');
    this.load.image('huevoentero', 'assets/huevoentero.png');
    this.load.image('tortuga', 'assets/tortuga.png');
    this.load.image('cubo', 'assets/cesta.png');
    this.load.image('piedra', 'assets/piedra.png');
    this.load.audio('musica', 'assets/musica.mp3');
    this.load.audio('saludo', 'assets/saludo.mp3');
    this.load.audio('audioSuma', 'assets/suma.mp3');
    this.load.audio('audioResta', 'assets/resta.mp3');
    this.load.image('bien', 'assets/bien.png');
    this.load.image('mal', 'assets/mal.png');
  }

  create() {
    this.add.image(500, 300, 'fondo').setScale(1);
    this.add.image(750, 400, 'amigo2').setScale(0.6);
    this.add.image(400, 500, 'piedra').setScale(0.4);
    cubo = this.add.image(500, 500, 'cubo').setScale(0.4);



    this.add.text(100, 20, '¡HOLA AMIGOS! ¿NOS AYUDÁIS A RESCATAR A LAS TORTUGAS?', {
      fontSize: '22px',
      fontStyle: 'bold',
      fill: '#000'
    });

    musicaFondo = this.sound.add('musica', { loop: true, volume: 0.5 });
    this.input.once('pointerdown', () => {
      if (!musicaFondo.isPlaying) musicaFondo.play();
    });

    // 🔊 Botón para audio saludo
    botonAudio = this.add.text(820, 20, '🔊 SALUDO', {
      fontSize: '24px',
      backgroundColor: '#FFEB3B',
      fill: '#000',
      padding: { x: 12, y: 6 },
      fontFamily: 'Comic Sans MS'
    })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        const saludo = this.sound.add('saludo');
        saludo.play();
      });

    // 🐢 Crear tortugas
    const numTortugas = Phaser.Math.Between(4, 10);
    totalAnimales = numTortugas;
    const animales = [];

    for (let i = 0; i < numTortugas; i++) {
      const tortuga = this.add.image(
        Phaser.Math.Between(50, 400),
        Phaser.Math.Between(400, 550),
        'tortuga'
      ).setInteractive({ draggable: true }).setScale(0.11);
      animales.push(tortuga);
    }

    this.input.setDraggable(animales);

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    listenerDragEnd = (pointer, gameObject) => {
      const distancia = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, cubo.x, cubo.y);
      if (distancia < 100) {
        contadorTortugas++;
        gameObject.destroy();
        actualizarTexto();

        if (contadorTortugas === totalAnimales && juegoActivo) {
          juegoActivo = false;
          crearBotones(this);
        }
      }
    };
    this.input.on('dragend', listenerDragEnd);

    // 🧮 Fondo y texto contador
    fondoContador = this.add.rectangle(260, 160, 300, 40, 0xFFF9A6, 0.8);
    textoContador = this.add.text(130, 150, '', {
      fontSize: '26px',
      fill: '#000',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    });
    textoContador.setDepth(1);
    actualizarTexto();
  }

  update() {}
}

// ============================
// VARIABLES GLOBALES
// ============================
let contadorTortugas = 0;
let contadorOperacion = 0;
let textoContador, fondoContador, cubo;
let musicaFondo, botonAudio;
let botonSumar, botonRestar, botonReiniciar;
let listenerDragEnd;
let totalAnimales = 0;
let juegoActivo = true;
let pecesOperacion = [];
let textoProblema;
let total = 0;

// ============================
// FUNCIONES AUXILIARES
// ============================
function actualizarTexto() {
  textoContador.setText(`TORTUGAS 🐢: ${contadorTortugas}`);
}

function crearBotones(scene) {
  botonSumar = scene.add.text(200, 200, 'SUMAR ➕', {
    fontSize: '28px',
    backgroundColor: '#00ff00',
    padding: 10
  })
    .setInteractive()
    .on('pointerdown', () => iniciarOperacion(scene, 'sumar'));

  botonRestar = scene.add.text(500, 200, 'RESTAR ➖', {
    fontSize: '28px',
    backgroundColor: '#ff5555',
    padding: 10
  })
    .setInteractive()
    .on('pointerdown', () => iniciarOperacion(scene, 'restar'));
}

function iniciarOperacion(scene, tipo) {
  
  // Desactivamos solo el evento global de conteo,
  // pero mantenemos los eventos de arrastre activos
  scene.input.off('dragend', listenerDragEnd);

  botonSumar?.destroy();
  botonRestar?.destroy();
  botonReiniciar?.destroy();

   // Eliminar texto de problema anterior
  textoProblema?.destroy();
  contadorTortugas = 0;
  contadorPeces = 0;
  contadorOperacion = 0;
  actualizarTexto();
  const narracion = scene.sound.add(tipo === 'sumar' ? 'audioSuma' : 'audioResta');
  narracion.play();
  let tortugas = Phaser.Math.Between(2, 5);
  let huevorotos = Phaser.Math.Between(2, 5);
  let huevoentero = Phaser.Math.Between(3, 6);
  let huevoroto = Phaser.Math.Between(2, Math.max(1, huevoentero - 2));
  total = (tipo === 'sumar') ? huevorotos + tortugas : Math.abs(huevoentero - huevoroto);  
  textoProblema = scene.add.text(100, 50,
    (tipo === 'sumar')
      ? `Tenemos  ${tortugas} tortugas atascadas entre las rocas  y  ${huevorotos} tortugas naciendo de su huevo. ¿Cuántas tortugas hay en total? Mételas en la cesta`
      : `Si tenemos ${huevoentero} huevos cerrados y quitamos ${huevoroto} huevos abiertos. ¿Cuántos huevos cerrados quedan en el nido?`,
    { fontSize: '22px', fill: '#000', wordWrap: { width: 600 } }
  );

  if (tipo === 'restar') {
    total = huevoroto;
    contadorTortugas = huevoentero + huevoroto;
  }
  // Crear peces para arrastrar en la operación
  pecesOperacion = [];
  // Peces de la chica
  if (tipo === 'sumar') {
    // Solo generamos los huevos enteros
    for (let i = 0; i < tortugas; i++) {
        const huevo = scene.add.image(
            Phaser.Math.Between(300, 400), 
            Phaser.Math.Between(500, 550),
            'tortuga'
        ).setInteractive({ draggable: true }).setScale(0.1);
        pecesOperacion.push(huevo);
    }

    for (let i = 0; i < huevorotos; i++) {
        const huevo = scene.add.image(
            Phaser.Math.Between(100, 200), 
            Phaser.Math.Between(500, 550),
            'huevoroto'
        ).setInteractive({ draggable: true }).setScale(0.15);
        pecesOperacion.push(huevo);
    }
  } else {
    // Generamos huevos rotos y enteros para la resta
    // Huevos rotos (izquierda)
    for (let i = 0; i < huevoroto; i++) {
        const huevo = scene.add.image(
            Phaser.Math.Between(300, 400), 
            Phaser.Math.Between(400, 500),
            'huevoroto'
        ).setInteractive({ draggable: true }).setScale(0.11);
        pecesOperacion.push(huevo);
    }

    // Huevos enteros (derecha)
    for (let i = 0; i < huevoentero; i++) {
        const huevo = scene.add.image(
            Phaser.Math.Between(100, 200), 
            Phaser.Math.Between(400, 500),
            'huevoentero'
        ).setInteractive({ draggable: true }).setScale(0.2);
        pecesOperacion.push(huevo);
    }
  }

  scene.input.setDraggable(pecesOperacion);

  // Habilitamos arrastre individual
  scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    gameObject.x = dragX;
    gameObject.y = dragY;
  });
  actualizarTexto();
  pecesOperacion.forEach(pez => {
    pez.on('dragend', (pointer) => {
        const distancia = Phaser.Math.Distance.Between(pez.x, pez.y, cubo.x, cubo.y);
        if (distancia < 100) {
          if (tipo === 'restar') {
            contadorTortugas--;
            contadorOperacion++;
          }
          else{
            contadorTortugas++;
            contadorOperacion++;
          }
        

        // Animación de caída al cubo antes de destruir
        scene.tweens.add({
            targets: pez,
            x: cubo.x,
            y: cubo.y + 20,
            scale: 0.05,
            alpha: 0,
            duration: 300,
            onComplete: () => {
            pez.destroy();
            actualizarTexto();

            // ✅ Botón comprobar
            
            botonComprobar = scene.add.text(700, 500, 'COMPROBAR ✅', {
              fontSize: '26px',
              backgroundColor: '#FFEB3B',
              padding: 10
            })
              .setInteractive()
              .on('pointerdown', () => verificarResultado(scene));
            }
        });
        }
    });
  });

  
}

function verificarResultado(scene) {
  const exito = contadorOperacion === total;
  const img = scene.add.image(500, 300, exito ? 'bien' : 'mal').setScale(0.5);
  const texto = scene.add.text(500, 500,
    exito ? '¡Genial, lo has conseguido! 🎉' : 'Está mal, inténtalo de nuevo 😅',
    { fontSize: '26px', fill: '#000', fontFamily: 'Comic Sans MS' }
  ).setOrigin(0.5);

  scene.time.delayedCall(2500, () => {
    img.destroy();
    texto.destroy();
    mostrarResultado(scene);
  });
}

function mostrarResultado(scene) {
  botonComprobar.destroy();
  const mensajeFinal = scene.add.text(130, 200, '¡Muy bien! ¿Qué quieres hacer ahora?', 
    { fontSize: '26px', fill: '#000', wordWrap: { width: 400 } });

  botonSumar = scene.add.text(150, 350, 'SUMAR ➕', { 
    fontSize: '28px', backgroundColor: '#00ff00', padding: 10 
  })
  .setInteractive()
  .on('pointerdown', () => {
    mensajeFinal.destroy();
    pecesOperacion.forEach(p => p.destroy());
    iniciarOperacion(scene, 'sumar');
  });

  botonRestar = scene.add.text(400, 350, 'RESTAR ➖', { 
    fontSize: '28px', backgroundColor: '#ff5555', padding: 10 
  })
  .setInteractive()
  .on('pointerdown', () => {
    mensajeFinal.destroy();
    pecesOperacion.forEach(p => p.destroy());
    iniciarOperacion(scene, 'restar');
  });

  botonReiniciar = scene.add.text(275, 450, 'EMPEZAR DE NUEVO 🔄', { 
    fontSize: '28px', backgroundColor: '#00aaff', padding: 10 
  })
  .setInteractive()
  .on('pointerdown', () => {
    location.reload();
  });
}

// ============================
// CONFIGURACIÓN DEL JUEGO
// ============================
const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 600,
  backgroundColor: '#AEEEEE',
  parent: 'game-container',
  scene: [PortadaScene, JuegoScene]
};

const game = new Phaser.Game(config);
