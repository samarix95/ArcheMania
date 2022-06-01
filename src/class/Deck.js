import cardDeck from '../card-deck.json'
import OpenedCard from './OpenedCard';

class Deck {
    constructor() {
        this.cards = [];
    }

    CreateDeck() {
        cardDeck.cards.map((item) => {
            for (let i = 0; i < item.count; i++) {
                this.cards.push(new OpenedCard(item.id, item.name, item.image, item.score));
            }
        });
    }

    ShuffleDeck() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }

    GetCard() {
        const card = this.cards.pop();
        return card;
    }
}
export default Deck;