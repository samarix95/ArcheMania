import PlayableCard from './PlayableCard.js';

class OpenedCard extends PlayableCard {
    constructor(id, name, image, score) {
        super(id, name, image);
        this.score = score;
        this.orderId = 0;
    }

    setOrderId(num) {
        this.orderId = num;
    }
}
export default OpenedCard;