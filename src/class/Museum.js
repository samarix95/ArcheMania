import { Container, Graphics, Text, Sprite } from 'pixi.js';
import { Scrollbox } from 'pixi-scrollbox';
import gsap from 'gsap';

import * as CONFIG from '../config';
import OpenedCard from './OpenedCard';
import Button from './dialog/Button';

class Museum {
    constructor() {
        this.isCollapsed = true;
        this.museumPositionY = window.innerHeight;
    }

    Collapse() {
        const collapseButton = this.museumContainer.getChildAt(2);
        if (this.isCollapsed) {
            this.isCollapsed = false;
            collapseButton.getChildAt(1).text = '▼';
            this.museumPositionY = this.museumContainer.position.y - CONFIG.CARD_HEIGHT;
            gsap.to(this.museumContainer, {
                y: this.museumContainer.position.y - CONFIG.CARD_HEIGHT,
                duration: 0.1,
            });
        } else {
            this.isCollapsed = true;
            collapseButton.getChildAt(1).text = '▲';
            this.museumPositionY = this.museumContainer.position.y + CONFIG.CARD_HEIGHT;
            gsap.to(this.museumContainer, {
                y: this.museumContainer.position.y + CONFIG.CARD_HEIGHT,
                duration: 0.1,
            });
        }
    }

    Draw(museumCards) {
        this.museumContainer = new Container();
        this.museumContainer.position.set(0, this.museumPositionY);

        const cardsContainer = new Container();
        const cardWidth = CONFIG.CARD_WIDTH * 0.7;
        const cardHeight = CONFIG.CARD_HEIGHT * 0.7;
        const cardOffset = 10;
        let totalScore = 0;

        const background = new Graphics();
        background.beginFill(0x001ab0)
            .drawRect(0, 0, window.innerWidth, CONFIG.CARD_HEIGHT)
            .endFill();
        this.museumContainer.addChildAt(background, 0);

        museumCards.sort((a, b) => a.id - b.id)
            .map((item, key) => {
                totalScore += item.score;
                const savedCardContainer = new Container();
                savedCardContainer.position.set(key * (cardOffset + CONFIG.CARD_HEIGHT), 0);

                const cardBackground = new Sprite.from(require('../images/museum/background.jpg').default);
                cardBackground.width = CONFIG.CARD_HEIGHT;
                cardBackground.height = CONFIG.CARD_HEIGHT;
                savedCardContainer.addChild(cardBackground);

                const card = new OpenedCard(item.id, item.name, item.image);
                card.cardSprite.interactive = false;
                card.cardSprite.buttonMode = false;
                card.cardSprite.width = cardWidth;
                card.cardSprite.height = cardHeight;
                card.cardSprite.position.set(savedCardContainer.width / 2 - cardWidth / 4, savedCardContainer.height / 2);
                card.cardSprite.anchor.set(0.5, 0.5);
                savedCardContainer.addChild(card.cardSprite);

                const savedCardText = new Text(`×${item.count} = ${item.score}`);
                savedCardText.position.set(savedCardContainer.width / 2 + cardWidth / 2, savedCardContainer.height / 2);
                savedCardText.anchor.set(0.5, 0.5);
                savedCardText.angle = 90;
                savedCardContainer.addChild(savedCardText);

                cardsContainer.addChild(savedCardContainer);
            });

        const scrollbox = new Scrollbox({
            boxWidth: window.innerWidth,
            boxHeight: CONFIG.CARD_HEIGHT,
            overflowY: 'hidden',
            fade: true,
            scrollbarBackgroundAlpha: 0,
        });
        scrollbox.position.set(0, 0);
        scrollbox.content.addChild(cardsContainer);
        scrollbox.update();

        this.museumContainer.addChildAt(scrollbox, 1);

        const collapseButton = new Button(window.innerWidth / 2, -25, 80, 45, this.isCollapsed ? '▲' : '▼', this.Collapse.bind(this));
        this.museumContainer.addChildAt(collapseButton, 2);

        const totalText = new Text(`Total score: ${totalScore}`);
        totalText.position.set(cardOffset, -25);
        totalText.anchor.set(0, 0.5);
        this.museumContainer.addChild(totalText);

        return this.museumContainer;
    }
}
export default Museum;