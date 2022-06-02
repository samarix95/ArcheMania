import { Application, Graphics, Text, TextStyle, Texture, Sprite, Loader, Container, ParticleContainer } from 'pixi.js';
import cardTexture from './images/card-shirt-1.png';
import ahriTexture from './images/ahri-face.jpg';
import ikeTexture from './images/ike.jpg';
import pepeTexture from './images/pepe.png';
import pepeFunTexture from './images/pepe-1.png';

const app = new Application({
    width: 500,
    height: 500,
    backgroundAlpha: true,
    antialias: true
});

app.renderer.backgroundColor = 0x23395D;

app.renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(app.view);

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

// const style = new TextStyle({
//     fontFamily: 'Montserrat',
//     fontSize: 48,
//     fill: 'deepskyblue',
//     stroke: '#ffffff',
//     strokeThickness: 4,
//     dropShadow: true,
//     dropShadowDistance: 10,
//     dropShadowAngle: Math.PI / 2,
//     dropShadowBlur: 4,
//     dropShadowColor: '#000000'
// })
// const myText = new Text('Hello world!', style);
// app.stage.addChild(myText);

// myText.text = "Text changed";

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

const char1Sprite = Sprite.from(cardTexture);
app.stage.addChild(char1Sprite);

char1Sprite.scale.set(1.5, 1.5);
char1Sprite.position.set(300, 300);
char1Sprite.anchor.set(0.5, 0.5);
char1Sprite.rotation = 1;
char1Sprite.interactive = true;
char1Sprite.buttonMode = true;

char1Sprite.on('pointerdown', () => {
    char1Sprite.scale.x += 0.1;
    char1Sprite.scale.y += 0.1;
});

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowRight':
            char1Sprite.x += 5;
            break;
        case 'ArrowLeft':
            char1Sprite.x -= 5;
            break;
        default:
            break;
    }
});

const container = new Container();
const char2Sprite = Sprite.from(ahriTexture);
const char3Sprite = Sprite.from(ikeTexture);
container.addChild(char2Sprite);
container.addChild(char3Sprite);
app.stage.addChild(container);

char2Sprite.position.set(400, 300);
char2Sprite.scale.set(0.5, 0.5);

char3Sprite.scale.set(0.5, 0.5);

const particleContainer = new ParticleContainer(1000, {
    position: true,
    rotation: true,
    vertices: true,
    tint: true,
    uvs: true
});

const setup = (loader, resources) => {
    const char4Sprite = new Sprite(
        resources[pepeTexture].texture
    );
    char4Sprite.position.set(500, 500);
    char4Sprite.scale.set(0.2, 0.2);
    app.stage.addChild(char4Sprite);
};

const loader = Loader.shared;
loader.add([pepeTexture, pepeFunTexture])
    .load(setup);
loader.onLoad.add(() => {
    console.log("Textures loaded");
});
loader.onProgress.add(() => {
    console.log("Loading textures");
});
loader.onError.add(() => {
    console.error("Load textures error");
});
