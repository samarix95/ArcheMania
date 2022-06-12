import { Container, Texture, Sprite } from 'pixi.js';

class Button {
    constructor(posX, posY, width, height, onClick) {
        if (this.constructor == Button) {
            throw new Error(" Object of Abstract Class cannot be created");
        }
        this.textures = [
            Texture.from(require('../../images/button.png').default),
            Texture.from(require('../../images/button-hover.png').default),
            Texture.from(require('../../images/button-click.png').default)
        ]

        this.buttonSprite = new Sprite(this.textures[0]);
        this.buttonSprite.defaultTexture = this.textures[0];
        this.buttonSprite.hoverTexture = this.textures[1];
        this.buttonSprite.clickTexture = this.textures[2];
        this.buttonSprite.width = width;
        this.buttonSprite.height = height;
        this.buttonSprite.interactive = true;
        this.buttonSprite.buttonMode = true;
        this.buttonSprite.position.set(posX, posY);
        this.buttonSprite.anchor.set(0.5, 0.5);
        this.buttonSprite.onClick = onClick;
        this.buttonSprite.on('pointerdown', this.onButtonDown)
            .on('pointerup', this.onButtonUp)
            .on('pointerupoutside', this.onButtonUp)
            .on('pointerover', this.onButtonOver)
            .on('pointerout', this.onButtonOut);


        this.buttonContainer = new Container();
        this.buttonContainer.addChild(this.buttonSprite);
        this.buttonContainer.UpdatePosition = (posX, posY) => {
            this.buttonSprite.position.set(posX, posY)
        }
    }

    onButtonDown() {
        this.isdown = true;
        this.texture = this.clickTexture
        this.alpha = 1;
    }

    onButtonUp() {
        if (this.isdown) {
            this.onClick();
            this.isdown = false;
        }
    }

    onButtonOver() {
        this.isOver = true;
        if (this.isdown) {
            return;
        }
        this.texture = this.hoverTexture;
    }

    onButtonOut() {
        this.isOver = false;
        if (this.isdown) {
            return;
        }
        this.texture = this.defaultTexture;
    }
}
export default Button;