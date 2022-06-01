import PlayableCard from './PlayableCard.js';
import { HAND_RECT_X, HAND_RECT_Y, HAND_WIDTH, HAND_HEIGH } from '../config.js';

class ClosedCard extends PlayableCard {
    constructor(id, name, image) {
        super(id, name, image);
        this.cardSprite.on('pointerdown', (e) => this.onDragStart(e, this.cardSprite));
        this.cardSprite.on('pointermove', () => this.onDragCardMove(this.cardSprite));
    }

    onDragStart(e, element) {
        element.data = e.data;
        element.alpha = 0.8;
    }

    onDragCardMove(element) {
        if (element.data) {
            var newPos = element.data.getLocalPosition(element.parent);
            element.x = newPos.x;
            element.y = newPos.y;

            const x1 = HAND_RECT_X,
                y1 = HAND_RECT_Y,
                x2 = HAND_RECT_X + HAND_WIDTH,
                y2 = HAND_RECT_Y + HAND_HEIGH,
                x = newPos.x,
                y = newPos.y;
            if (this.pointInRect({ x1, y1, x2, y2 }, { x, y })) {
                element.alpha = 0.5;
            } else {
                element.alpha = 0.8;
            }
        }
    }

    pointInRect({ x1, y1, x2, y2 }, { x, y }) {
        return (x > x1 && x < x2) && (y > y1 && y < y2);
    }
}
export default ClosedCard;