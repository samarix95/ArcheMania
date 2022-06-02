import PlayableCard from './PlayableCard.js';
import { HAND_RECT_X, HAND_RECT_Y, HAND_WIDTH, HAND_HEIGHT } from '../config.js';

class ClosedCard extends PlayableCard {
    constructor(id, name, image) {
        super(id, name, image);
        this.cardSprite.on('pointerdown', (e) => this.onDragStart(e));
        this.cardSprite.on('pointermove', (e) => this.onDragCardMove());
    }

    onDragStart(e) {
        this.cardSprite.data = e.data;
        this.cardSprite.dragging = this.cardSprite.data.getLocalPosition(this.cardSprite.parent);
    }

    onDragCardMove(e) {
        if (this.cardSprite.dragging) {
            var newPos = this.cardSprite.data.getLocalPosition(this.cardSprite.parent);
            this.cardSprite.position.x += (newPos.x - this.cardSprite.dragging.x);
            this.cardSprite.position.y += (newPos.y - this.cardSprite.dragging.y);
            this.cardSprite.dragging = newPos;

            const x1 = HAND_RECT_X,
                y1 = HAND_RECT_Y,
                x2 = HAND_RECT_X + HAND_WIDTH,
                y2 = HAND_RECT_Y + HAND_HEIGHT,
                x = newPos.x,
                y = newPos.y;

            if (this.pointInRect({ x1, y1, x2, y2 }, { x, y })) {
                this.cardSprite.alpha = 0.5;
            } else {
                this.cardSprite.alpha = 1;
            }
        }
    }

    pointInRect({ x1, y1, x2, y2 }, { x, y }) {
        return (x > x1 && x < x2) && (y > y1 && y < y2);
    }
}
export default ClosedCard;