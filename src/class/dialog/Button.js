import { Container, Texture, Sprite, Text } from 'pixi.js';

class Button {
    constructor(posX, posY, width, height, buttonText, clickFunction) {
        this.buttonContainer = new Container();
        this.buttonSprite = new Sprite(Texture.from(require('../../images/button.png').default));
        this.buttonSprite.x = posX;
        this.buttonSprite.y = posY;
        this.buttonSprite.width = width;
        this.buttonSprite.height = height;
        this.buttonSprite.anchor.set(0.5, 0.5);
        this.buttonSprite.defaultTexture = Texture.from(require('../../images/button.png').default);
        this.buttonSprite.hoverTexture = Texture.from(require('../../images/button-hover.png').default);
        this.buttonSprite.clickTexture = Texture.from(require('../../images/button-click.png').default);
        this.buttonSprite.clickFunction = clickFunction;
        this.buttonSprite.interactive = true;
        this.buttonSprite.buttonMode = true;
        this.buttonSprite.on('pointerdown', this.onButtonDown)
        this.buttonSprite.on('pointerup', this.onButtonUp)
        this.buttonSprite.on('pointerupoutside', this.onButtonUp)
        this.buttonSprite.on('pointerover', this.onButtonOver)
        this.buttonSprite.on('pointerout', this.onButtonOut);
        this.buttonContainer.addChild(this.buttonSprite);

        this.text = new Text(buttonText);
        this.text.anchor.set(0.5, 0.5);
        this.text.x = posX;
        this.text.y = posY;
        this.buttonContainer.addChild(this.text);

        return this.buttonContainer;
    }

    onButtonDown() {
        this.isdown = true;
        this.texture = this.clickTexture
        this.alpha = 1;
    }

    onButtonUp() {
        if (this.isdown) {
            this.clickFunction();
        }
        // this.isdown = false;
        // if (this.isOver) {
        //     this.texture = this.hoverTexture;
        // } else {
        //     this.texture = this.defaultTexture;
        // }
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