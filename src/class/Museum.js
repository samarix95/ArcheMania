import { Container, Graphics, Text } from 'pixi.js';
import gsap from "gsap";

import * as CONFIG from '../config';
import OpenedCard from './OpenedCard';
import Button from './dialog/Button';

class Museum {
    constructor() {
        this.isCollapsed = true;
        this.museumPositionX = -CONFIG.CARD_HEIGHT;
    }

    Collapse() {
        const collapseButton = this.museumContainer.getChildAt(1);
        if (this.isCollapsed) {
            this.isCollapsed = false;
            collapseButton.getChildAt(1).text = '▲';
            this.museumPositionX = this.museumContainer.position.x + CONFIG.CARD_HEIGHT + 25;
            gsap.to(this.museumContainer, {
                x: this.museumContainer.position.x + CONFIG.CARD_HEIGHT + 25,
                duration: 0.1,
            });
        } else {
            this.isCollapsed = true;
            collapseButton.getChildAt(1).text = '▼';
            this.museumPositionX = this.museumContainer.position.x - CONFIG.CARD_HEIGHT - 25;
            gsap.to(this.museumContainer, {
                x: this.museumContainer.position.x - CONFIG.CARD_HEIGHT - 25,
                duration: 0.1,
            });
        }
    }

    Draw(museumCards) {
        this.museumContainer = new Container();
        this.museumContainer.position.set(this.museumPositionX, window.innerHeight - 25);
        this.museumContainer.angle = -90;

        const cardWidth = CONFIG.CARD_WIDTH * 0.7;
        const cardHeight = CONFIG.CARD_HEIGHT * 0.7;
        const cardOffset = 20;
        let totalScore = 0;

        const background = new Graphics();
        background.beginFill(0xe6e6fa)
            .drawRect(-25, -25, window.innerHeight, CONFIG.CARD_HEIGHT + 25)
            .endFill();
        this.museumContainer.addChildAt(background, 0);
        // ▼
        const collapseButton = new Button(window.innerHeight / 2, CONFIG.CARD_HEIGHT + 25, 80, 45, this.isCollapsed ? '▼' : '▲', this.Collapse.bind(this));
        this.museumContainer.addChildAt(collapseButton, 1);

        const totalText = new Text();
        totalText.position.set(cardOffset, 0);
        totalText.anchor.set(0, 0);
        totalText.angle = 90;
        this.museumContainer.addChild(totalText);

        museumCards.sort((a, b) => a.id - b.id)
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

        return this.museumContainer;
    }
}
export default Museum;