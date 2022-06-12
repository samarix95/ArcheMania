import gsap from 'gsap';

import * as CONFIG from '../config';
import PlayableCard from './PlayableCard';
import App from './App';

class ClosedCard extends PlayableCard {
    constructor(id, name, image) {
        super(id, name, image);
        this.app = this.app = App.getInstance();
        this.cardSprite.on('pointerdown', (e) => this.onDragStart(e));
        this.cardSprite.on('pointermove', () => this.onDragCardMove());
        this.cardSprite.on('mouseover', () => this.onFocus(true, this.cardSprite));
        this.cardSprite.on('mouseout', () => this.onFocus(false, this.cardSprite));
        this.maxWidth = this.cardSprite.width + 5;
        this.maxHeight = this.cardSprite.height + 5;
        this.minWidth = this.cardSprite.width;
        this.minHeight = this.cardSprite.height;
        this.cardSprite.isInRect = false;
        return this.cardSprite;
    }

    onFocus(isFocus, element) {
        if (isFocus) {
            gsap.to(element, {
                width: this.maxWidth,
                height: this.maxHeight,
                duration: 0.05
            });
        } else {
            gsap.to(element, {
                width: this.minWidth,
                height: this.minHeight,
                duration: 0.05
            });
        }
    }

    onDragStart(e) {
        this.cardSprite.data = e.data;
        this.cardSprite.dragging = this.cardSprite.data.getLocalPosition(this.cardSprite.parent);
    }

    onDragCardMove() {
        if (this.cardSprite.dragging) {
            const hand = this.app.stage.getChildAt(1);
            var newPos = this.cardSprite.data.getLocalPosition(this.cardSprite.parent);
            this.cardSprite.position.x += (newPos.x - this.cardSprite.dragging.x);
            this.cardSprite.position.y += (newPos.y - this.cardSprite.dragging.y);
            this.cardSprite.dragging = newPos;

            const x1 = 0;
            const y1 = window.innerHeight - CONFIG.HAND_HEIGHT;
            const x2 = window.innerWidth;
            const y2 = window.innerHeight;
            const x = this.cardSprite.position.x;
            const y = this.cardSprite.position.y;

            if (this.pointInRect({ x1, y1, x2, y2 }, { x, y })) {
                hand.alpha = 0.3;
                this.cardSprite.isInRect = true;
            } else {
                hand.alpha = 0;
                this.cardSprite.isInRect = false;
            }
        }
    }

    pointInRect({ x1, y1, x2, y2 }, { x, y }) {
        return (x > x1 && x < x2) && (y > y1 && y < y2);
    }
}
export default ClosedCard;