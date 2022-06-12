import { Sprite, Texture } from 'pixi.js';

import Button from "./Button";

class ButtonImage extends Button {
    constructor(posX, posY, width, height, onClick, buttonImage, imageWidth, imageHeight) {
        super(posX, posY, width, height, onClick);

        this.sprite = new Sprite.from(buttonImage);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.width = imageWidth;
        this.sprite.height = imageHeight;
        this.sprite.x = posX;
        this.sprite.y = posY;
        this.sprite.setNewTexture = this.setNewTexture;

        this.buttonContainer.addChild(this.sprite);
        this.buttonContainer.UpdatePosition = (posX, posY) => {
            this.buttonSprite.position.set(posX, posY);
            this.sprite.x = posX;
            this.sprite.y = posY;
        }

        return this.buttonContainer;
    }

    setNewTexture(image) {
        const texture = Texture.from(image);
        this.texture = texture;
    }
}
export default ButtonImage;