import { Sprite } from 'pixi.js';
import { CARD_WIDTH, CARD_HEIGHT } from '../config.js';

class Card {
    constructor(id, name, image) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.cardSprite = new Sprite.from(require('../images/' + image).default);
        this.cardSprite.width = CARD_WIDTH;
        this.cardSprite.height = CARD_HEIGHT;
        this.cardSprite.anchor.set(0.5, 0.5);
    }
}
export default Card;