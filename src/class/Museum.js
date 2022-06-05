import { Container, Text } from 'pixi.js';

import * as CONFIG from '../config';
import OpenedCard from './OpenedCard';

class Museum {
    constructor(museumCards) {
        this.museumCards = museumCards;

        this.museumContainer = new Container();
        this.museumContainer.position.set(25, window.innerHeight - 25);
        this.museumContainer.angle = -90;

        this.Draw();

        return this.museumContainer;
    }

    Draw() {
        const cardWidth = CONFIG.CARD_WIDTH * 0.7;
        const cardHeight = CONFIG.CARD_HEIGHT * 0.7;
        const cardOffset = 20;
        let totalScore = 0;

        const totalText = new Text();
        totalText.position.set(cardOffset, 0);
        totalText.anchor.set(0, 0);
        totalText.angle = 90;
        this.museumContainer.addChild(totalText);

        this.museumCards.sort((a, b) => a.id - b.id)
            .map((item, key) => {
                totalScore += item.score;
                const savedCardContainer = new Container();

                const card = new OpenedCard(item.id, item.name, item.image);
                card.cardSprite.interactive = false;
                card.cardSprite.buttonMode = false;
                card.cardSprite.anchor.set(0, 0);
                card.cardSprite.position.set(cardOffset + key * (cardOffset + cardWidth), 0);
                card.cardSprite.width = cardWidth;
                card.cardSprite.height = cardHeight;

                const savedCardText = new Text(`×${item.count} = ${item.score}`);
                savedCardText.position.set(cardOffset + key * (cardOffset + cardWidth), cardHeight);
                savedCardText.anchor.set(0, 0);

                savedCardContainer.addChild(card.cardSprite, savedCardText);
                this.museumContainer.addChild(savedCardContainer);
            });

        totalText.text = `Total score: ${totalScore}`;
    }
}
export default Museum;