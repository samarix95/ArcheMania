import { Text } from 'pixi.js';

import Button from "./Button";

class ButtonText extends Button {
    constructor(posX, posY, width, height, onClick, buttonText) {
        super(posX, posY, width, height, onClick);

        this.text = new Text(buttonText);
        this.text.anchor.set(0.5, 0.5);
        this.text.x = posX;
        this.text.y = posY;

        this.buttonContainer.addChild(this.text);
        this.buttonContainer.UpdatePosition = (posX, posY) => {
            this.buttonSprite.position.set(posX, posY);
            this.text.x = posX;
            this.text.y = posY;
        }

        return this.buttonContainer;
    }
}
export default ButtonText;