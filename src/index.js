import App from './class/App.js';
import Game from './class/Game.js';

const application = App.getInstance();
const game = new Game(application.app);
game.Start();

// const gameBoard = new Board(app);
// gameBoard.addPlayer(player1);
// gameBoard.start();

// const loaderSetup = (loader, resources) => {
// };

// const loader = Loader.shared;
// loader.add([])
//     .load(loaderSetup);

// loader.onLoad.add(() => {
//     console.log("Textures loaded");
// });

// loader.onProgress.add(() => {
//     console.log("Loading textures");
// });

// loader.onError.add(() => {
//     console.error("Load textures error");
// });

// document.addEventListener('keydown', (e) => {
//     switch (e.key) {
//         case 'ArrowRight':
//             char1Sprite.x += 5;
//             break;
//         case 'ArrowLeft':
//             char1Sprite.x -= 5;
//             break;
//         default:
//             break;
//     }
// });

// const poly = new Graphics();
// poly.beginFill(0xFF66FF)
//     .lineStyle(4, 0xFFEA00, 1)
//     .drawPolygon([
//         600, 50,
//         800, 150,
//         900, 300,
//         400, 400
//     ])
//     .endFill();

// const cirle = new Graphics();
// cirle.beginFill(0x22AACC)
//     .lineStyle(4, 0xFFEA00, 1)
//     .drawCircle(440, 200, 80)
//     .endFill();

// app.stage.addChild(cirle);
// app.stage.addChild(poly);

// const loop = (delta) => {
//     const rectangle = new Graphics();
//     rectangle.beginFill(0xFFFFFF)
//         .drawRect(Math.random() * app.screen.width, Math.random() * app.screen.height, 10, 10)
//         .endFill();

//     app.stage.addChild(rectangle);
// }

// app.ticker.add(delta => loop(delta));

// const char1Texure = Texture.from(cardTexture);
// const char1Sprite = new Sprite(char1Texure);

// const container = new Container();
// const char2Sprite = Sprite.from(ahriTexture);
// const char3Sprite = Sprite.from(ikeTexture);
// container.addChild(char2Sprite);
// container.addChild(char3Sprite);
// app.stage.addChild(container);

// char2Sprite.position.set(400, 300);
// char2Sprite.scale.set(0.5, 0.5);

// char3Sprite.scale.set(0.5, 0.5);

// const particleContainer = new ParticleContainer(1000, {
//     position: true,
//     rotation: true,
//     vertices: true,
//     tint: true,
//     uvs: true
// });
