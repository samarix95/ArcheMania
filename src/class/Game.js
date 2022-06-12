import { Graphics, Container, Text, Loader, TilingSprite, Texture } from 'pixi.js';
import { Scrollbox } from 'pixi-scrollbox';
import gsap from 'gsap';
import * as CONFIG from '../config';

import Player from './Player';
import Table from './Table';
import Card from './Card';
import ClosedCard from './ClosedCard';
import OpenedCard from './OpenedCard';
import OpenedCardStack from './OpenedCardStack';
import Museum from './Museum';
import App from './App';

class Game {
    constructor() {
        this.app = App.getInstance();
        this.table = new Table();
        this.drawable = [];
        this.backCardContainer = new Container();

        // DoubleClick costyl
        this.timeOne = null;
        this.clickedDataPoint = null;

        window.addEventListener('resize', () => {
            this.Redraw();
        });
    }

    Start() {
        Loader.shared
            .add('museumBackground', require('../images/museum/background.jpg').default)
            .load((loader, resources) => {
                const player1 = new Player(0);
                this.table.AddPlayer(player1);
                this.table.GiveCard(0);
                this.table.GiveCard(0);
                this.table.GiveCard(0);
                this.table.GiveCard(0);
                this.table.GiveCard(0);
                this.table.GiveCard(0);
                this.table.GiveCard(0);
                this.table.GiveCard(0);
                this.table.GiveCard(0);
                this.table.GiveCard(0);
                this.table.GiveCard(0);
                this.table.GiveCard(0);
                this.table.GiveCard(0);
                this.table.GiveCard(0);
                this.table.GiveCard(0);
                this.table.GiveCard(0);

                const tsprite = new TilingSprite(
                    Texture.from(require('../images/hand/background.jpg').default),
                    window.innerWidth,
                    CONFIG.HAND_HEIGHT
                );
                tsprite.position.set(0, window.innerHeight - CONFIG.HAND_HEIGHT);
                this.app.stage.addChildAt(tsprite, 0);

                const hand = new Graphics();
                hand.beginFill(0xd6d5d2)
                    .drawRect(0, window.innerHeight - CONFIG.HAND_HEIGHT, window.innerWidth, CONFIG.HAND_HEIGHT)
                    .endFill();
                hand.alpha = 0;
                this.app.stage.addChildAt(hand, 1);

                const cardLeftCntText = new Text(`Cards in deck: ${this.table.deck.cards.length}`);
                cardLeftCntText.anchor.set(0.5, 0.5);
                cardLeftCntText.position.set(window.innerWidth / 2, window.innerHeight / 4 + CONFIG.CARD_HEIGHT / 1.5);

                this.backCardContainer.addChildAt(cardLeftCntText, 0);

                const closedBackCard = new Card(1000, "0", 'card-shirt-1.png');
                closedBackCard.cardSprite.position.set(window.innerWidth / 2, window.innerHeight / 4 - 10);

                this.backCardContainer.addChildAt(closedBackCard.cardSprite, 1);

                this.app.stage.addChild(this.backCardContainer);

                this.museum = new Museum(resources.museumBackground.texture);
                this.Redraw();

                window.addEventListener('resize', () => {
                    tsprite.position.set(0, window.innerHeight - CONFIG.HAND_HEIGHT);
                    tsprite.width = window.innerWidth;
                    tsprite.height = window.innerHeight - CONFIG.HAND_HEIGHT;
                    hand.clear();
                    hand.beginFill(0xd6d5d2)
                        .drawRect(0, window.innerHeight - CONFIG.HAND_HEIGHT, window.innerWidth, CONFIG.HAND_HEIGHT)
                        .endFill();
                    cardLeftCntText.position.x = window.innerWidth / 2;
                    cardLeftCntText.position.y = window.innerHeight / 4 + CONFIG.CARD_HEIGHT / 1.5;
                    closedBackCard.cardSprite.position.x = window.innerWidth / 2;
                    closedBackCard.cardSprite.position.y = window.innerHeight / 4 - 10;
                });
            });
    }

    checkDClick(e, element) {
        if (!this.timeOne) {
            this.timeOne = new Date().getTime();
            this.clickedDataPoint = e.data.global;
        } else {
            if (new Date().getTime() - this.timeOne < 500 && this.clickedDataPoint === e.data.global) {
                const card = this.OpenCard(element);
                card.cardSprite.position = element.position;
                this.app.stage.addChild(card.cardSprite);

                const cardStack = this.app.stage.children.find((item) => item.cardId == card.id);
                const stackCont = cardStack == undefined ? 0 : cardStack.children.length;
                const xPos = cardStack == undefined
                    ? window.innerWidth / 2
                    : cardStack.xPos;
                const yPos = cardStack == undefined
                    ? window.innerHeight - CONFIG.HAND_HEIGHT + CONFIG.HAND_HEIGHT / 2
                    : cardStack.yPos - 15 * stackCont;

                setTimeout(() => {
                    gsap.to(card.cardSprite, {
                        x: xPos,
                        y: yPos,
                        duration: 0.3,
                        onComplete: () => {
                            this.app.stage.removeChild(card.cardSprite);
                            this.Redraw();
                        }
                    })
                }, 300);
            }
            this.timeOne = null;
            this.clickedDataPoint = null;
        }
    }

    onDragCardEnd(element) {
        if (element.dragging) {
            const hand = this.app.stage.getChildAt(1);
            hand.alpha = 0;

            element.alpha = 1;
            element.data = null;
            element.dragging = false;

            if (element.isInRect) {
                const card = this.OpenCard(element);
                card.cardSprite.position = element.position;
                this.app.stage.addChild(card.cardSprite);

                const cardStack = this.app.stage.children.find((item) => item.cardId == card.id);
                const stackCont = cardStack == undefined ? 0 : cardStack.children.length;
                const xPos = cardStack == undefined
                    ? window.innerWidth / 2
                    : cardStack.xPos;
                const yPos = cardStack == undefined
                    ? window.innerHeight - CONFIG.HAND_HEIGHT + CONFIG.HAND_HEIGHT / 2
                    : cardStack.yPos - 15 * stackCont;

                setTimeout(() => {
                    gsap.to(card.cardSprite, {
                        x: xPos,
                        y: yPos,
                        duration: 0.2,
                        onComplete: () => {
                            this.app.stage.removeChild(card.cardSprite);
                            this.Redraw();
                        }
                    })
                }, 300);
            }
            element.isInRect = false;
            element.position.set(window.innerWidth / 2, window.innerHeight / 4);
        }
    }

    OpenCard(element) {
        const openedCard = this.table.GiveCard(0);
        const text = this.backCardContainer.getChildAt(0);
        text.text = this.table.deck.cards.length != 0
            ? `Cards in deck: ${this.table.deck.cards.length}`
            : '';

        if (this.table.deck.cards.length == 1) {
            this.app.stage.removeChild(this.backCardContainer);
        }

        if (this.table.deck.cards.length == 0) {
            this.app.stage.removeChild(element);
        }

        return openedCard;
    }

    Redraw() {
        this.drawable.map(drawableCard => {
            this.app.stage.removeChild(drawableCard);
        });
        this.drawable = [];

        const playerCards = this.table.players[0].playerCards;

        const CalcXPos = (key) => {
            // TODO: Should do it more clearly
            return (window.innerWidth / 2 + key * (CONFIG.CARD_WIDTH + CONFIG.CARD_OFFSET)) - (((playerCards.length - 1) * (CONFIG.CARD_WIDTH + CONFIG.CARD_OFFSET)) / 2);
        }

        const CalcYPos = () => {
            return window.innerHeight - CONFIG.HAND_HEIGHT + CONFIG.HAND_HEIGHT / 2;
        }

        if (CalcXPos(playerCards.length - 1) - CalcXPos(0) + CONFIG.CARD_WIDTH < window.innerWidth) {
            playerCards.sort((a, b) => a.card.id - b.card.id)
                .map((card, key) => {
                    const xPos = CalcXPos(key);
                    const yPos = CalcYPos();

                    const openedCardStack = new OpenedCardStack(this);
                    openedCardStack.cardsContainer.cardId = card.card.id;
                    openedCardStack.cardsContainer.xPos = xPos;
                    openedCardStack.cardsContainer.yPos = yPos;

                    for (let i = card.count - 1; i >= 0; i--) {
                        const newCard = new OpenedCard(card.card.id, card.card.name, card.card.image);
                        newCard.cardSprite.position.set(xPos, yPos - 15 * i);
                        newCard.setOrderId(i);
                        openedCardStack.addCard(newCard);

                        window.addEventListener('resize', () => {
                            newCard.cardSprite.position.x = CalcXPos(key);
                            newCard.cardSprite.position.y = CalcYPos() - 15 * i;
                        });
                    }

                    this.drawable.push(openedCardStack.cardsContainer);
                    this.app.stage.addChild(openedCardStack.cardsContainer);
                });
        } else {
            const scrollbox = new Scrollbox({
                boxWidth: window.innerWidth,
                boxHeight: window.innerHeight,
                overflowY: 'hidden',
                fade: true,
                scrollbarBackgroundAlpha: 0,
            });
            scrollbox.position.set(0, 0);
            playerCards.sort((a, b) => a.card.id - b.card.id)
                .map((card, key) => {
                    const xPos = key * (CONFIG.CARD_OFFSET + CONFIG.CARD_WIDTH) + CONFIG.CARD_WIDTH / 2;
                    const yPos = window.innerHeight - CONFIG.HAND_HEIGHT + CONFIG.HAND_HEIGHT / 2;

                    const openedCardStack = new OpenedCardStack(this);
                    openedCardStack.cardsContainer.cardId = card.card.id;
                    openedCardStack.cardsContainer.xPos = xPos;
                    openedCardStack.cardsContainer.yPos = yPos;

                    for (let i = card.count - 1; i >= 0; i--) {
                        const newCard = new OpenedCard(card.card.id, card.card.name, card.card.image);
                        newCard.cardSprite.position.set(xPos, yPos - 25 * i);
                        newCard.setOrderId(i);
                        openedCardStack.addCard(newCard);

                        window.addEventListener('resize', () => {
                            newCard.cardSprite.position.x = key * (CONFIG.CARD_OFFSET + CONFIG.CARD_WIDTH);
                            newCard.cardSprite.position.y = (window.innerHeight - CONFIG.HAND_HEIGHT + CONFIG.HAND_HEIGHT / 2) - 25 * i;
                        });
                    }

                    scrollbox.content.addChild(openedCardStack.cardsContainer);
                    scrollbox.update();
                });

            this.drawable.push(scrollbox);
            this.app.stage.addChild(scrollbox);
        }

        const museum = this.museum.Draw(this.table.players[0].savedCards);

        this.drawable.push(museum);
        this.app.stage.addChild(museum);

        if (this.table.deck.cards.length != 0) {
            const closedCard = new ClosedCard(1000, "0", 'card-shirt-1.png');
            closedCard.position.set(window.innerWidth / 2, window.innerHeight / 4);
            closedCard.on('pointerup', () => this.onDragCardEnd(closedCard));
            closedCard.on('pointerupoutside', () => this.onDragCardEnd(closedCard));
            closedCard.on('click', (e) => this.checkDClick(e, closedCard));
            this.drawable.push(closedCard);
            this.app.stage.addChild(closedCard);

            window.addEventListener('resize', () => {
                closedCard.position.x = window.innerWidth / 2;
                closedCard.position.y = window.innerHeight / 4;
            });
        }
    }
}
export default Game;