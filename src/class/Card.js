import { Sprite } from 'pixi.js';
import * as CONFIG from '../config.js';

class Card {
    constructor(id, name, image) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.cardSprite = new Sprite.from(require('../images/' + image).default);
        this.cardSprite.width = CONFIG.CARD_WIDTH;
        this.cardSprite.height = CONFIG.CARD_HEIGHT;
        this.cardSprite.anchor.set(0.5, 0.5);
    }
}
export default Card;