import Card from './Card.js';

class PlayableCard extends Card {
    constructor(id, name, image) {
        super(id, name, image);
        this.cardSprite.interactive = true;
        this.cardSprite.buttonMode = true;
    }
}
export default PlayableCard;