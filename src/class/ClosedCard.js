import PlayableCard from './PlayableCard.js';
import * as CONFIG from '../config.js';

class ClosedCard extends PlayableCard {
    constructor(id, name, image) {
        super(id, name, image);
        this.cardSprite.on('pointerdown', (e) => this.onDragStart(e));
        this.cardSprite.on('pointermove', () => this.onDragCardMove());
        this.cardSprite.isInRect = false;
        return this.cardSprite;
    }

    onDragStart(e) {
        this.cardSprite.data = e.data;
        this.cardSprite.dragging = this.cardSprite.data.getLocalPosition(this.cardSprite.parent);
    }

    onDragCardMove() {
        if (this.cardSprite.dragging) {
            var newPos = this.cardSprite.data.getLocalPosition(this.cardSprite.parent);
            this.cardSprite.position.x += (newPos.x - this.cardSprite.dragging.x);
            this.cardSprite.position.y += (newPos.y - this.cardSprite.dragging.y);
            this.cardSprite.dragging = newPos;

            const x1 = CONFIG.HAND_RECT_X,
                y1 = CONFIG.HAND_RECT_Y,
                x2 = CONFIG.HAND_RECT_X + CONFIG.HAND_WIDTH,
                y2 = CONFIG.HAND_RECT_Y + CONFIG.HAND_HEIGHT,
                x = newPos.x,
                y = newPos.y;

            if (this.pointInRect({ x1, y1, x2, y2 }, { x, y })) {
                this.cardSprite.alpha = 0.5;
                this.cardSprite.isInRect = true;
            } else {
                this.cardSprite.alpha = 1;
                this.cardSprite.isInRect = false;
            }
        }
    }

    pointInRect({ x1, y1, x2, y2 }, { x, y }) {
        return (x > x1 && x < x2) && (y > y1 && y < y2);
    }
}
export default ClosedCard;