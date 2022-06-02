import { Graphics, Container, Text } from 'pixi.js';
import { CARD_WIDTH, CARD_OFFSET, HAND_WIDTH, HAND_HEIGHT, HAND_RECT_X, HAND_RECT_Y, CARD_HEIGHT } from '../config.js';

import Player from './Player';
import Table from './Table';
import Card from './Card';
import ClosedCard from './ClosedCard';
import OpenedCard from './OpenedCard';
import OpenedCardStack from './OpenedCardStack';

import Dialog from './dialog/Dialog.js';

class Game {
    constructor(app) {
        this.app = app;
        this.table = new Table();
        this.drawable = [];
        this.backCardContainer = new Container();

        // DoubleClick costyl
        this.timeOne = null;
        this.clickedDataPoint = null;

        this.dialogContainer = new Dialog();
    }

    Start() {
        const player1 = new Player(0);
        this.table.AddPlayer(player1);

        const rectangle = new Graphics();
        rectangle.beginFill(0xFFFFFF)
            .drawRect(HAND_RECT_X, HAND_RECT_Y, HAND_WIDTH, HAND_HEIGHT)
            .endFill();
        this.app.stage.addChild(rectangle);

        const cardLeftCntText = new Text(`Cards left: ${this.table.deck.cards.length}`);
        cardLeftCntText.anchor.set(0.5, 0.5);
        cardLeftCntText.position.set(
            window.innerWidth / 2,
            window.innerHeight / 4 + CARD_HEIGHT / 1.5
        );
        this.backCardContainer.addChildAt(cardLeftCntText, 0);

        const closedBackCard = new Card(1000, "0", 'card-shirt-1.png');
        closedBackCard.cardSprite.position.set(window.innerWidth / 2, window.innerHeight / 4 - 10);
        this.backCardContainer.addChildAt(closedBackCard.cardSprite, 1);

        this.app.stage.addChild(this.backCardContainer);

        const closedCard = new ClosedCard(1000, "0", 'card-shirt-1.png');
        closedCard.cardSprite.position.set(window.innerWidth / 2, window.innerHeight / 4);
        closedCard.cardSprite.on('pointerup', () => this.onDragCardEnd(closedCard));
        closedCard.cardSprite.on('pointerupoutside', () => this.onDragCardEnd(closedCard));
        closedCard.cardSprite.on('click', (e) => this.checkDClick(e, closedCard));
        this.app.stage.addChild(closedCard.cardSprite);

        this.app.stage.addChild(this.dialogContainer.dialog);
    }

    checkDClick(e, element) {
        if (!this.timeOne) {
            this.timeOne = new Date().getTime();
            this.clickedDataPoint = e.data.global;
        } else {
            if (new Date().getTime() - this.timeOne < 500 && this.clickedDataPoint === e.data.global) {
                this.table.GiveCard(0);
                const text = this.backCardContainer.getChildAt(0);
                text.text = `Cards left: ${this.table.deck.cards.length}`;

                if (this.table.deck.cards.length == 1) {
                    this.backCardContainer.removeChildAt(1);
                }

                if (this.table.deck.cards.length == 0) {
                    this.app.stage.removeChild(element.cardSprite);
                }
                this.Redraw();
            }
            this.timeOne = null;
            this.clickedDataPoint = null;
        }
    }

    onDragCardEnd(element) {
        if (element.cardSprite.dragging) {
            element.cardSprite.alpha = 1;
            element.cardSprite.data = null;
            element.cardSprite.dragging = false;

            const x1 = HAND_RECT_X,
                y1 = HAND_RECT_Y,
                x2 = HAND_RECT_X + HAND_WIDTH,
                y2 = HAND_RECT_Y + HAND_HEIGHT,
                x = element.cardSprite.x,
                y = element.cardSprite.y;

            if (element.pointInRect({ x1, y1, x2, y2 }, { x, y })) {
                this.table.GiveCard(0);
                const text = this.backCardContainer.getChildAt(0);
                text.text = `Cards left: ${this.table.deck.cards.length}`;

                if (this.table.deck.cards.length == 1) {
                    this.backCardContainer.removeChildAt(1);
                }

                if (this.table.deck.cards.length == 0) {
                    this.app.stage.removeChild(element.cardSprite);
                } else {
                    element.cardSprite.position.set(window.innerWidth / 2, window.innerHeight / 4);
                }
                this.Redraw();
            } else {
                element.cardSprite.position.set(window.innerWidth / 2, window.innerHeight / 4);
            }
        }
    }

    Redraw() {
        this.drawable.map(drawableCard => {
            this.app.stage.removeChild(drawableCard);
        });
        this.drawable = [];
        const player = this.table.players[0].playerCards;

        player.sort((a, b) => a.card.id - b.card.id)
            .map((card, key) => {
                const openedCardStack = new OpenedCardStack(this);
                const xPos = (window.innerWidth / 2 + key * (CARD_WIDTH + CARD_OFFSET)) -
                    (((player.length - 1) * (CARD_WIDTH + CARD_OFFSET)) / 2);
                const yPos = HAND_RECT_Y + HAND_HEIGHT / 2;

                let orderId = card.count - 1;
                for (let i = card.count - 1; i >= 0; i--) {
                    const newCard = new OpenedCard(card.card.id, card.card.name, card.card.image);
                    newCard.cardSprite.position.set(xPos, yPos - 15 * (i));
                    newCard.setOrderId(orderId);
                    openedCardStack.addCard(newCard);
                    orderId--;
                }

                const scoreCntText = new Text(`In stack: ${card.card.score[card.count]}`);
                scoreCntText.anchor.set(0.5, 0.5);
                scoreCntText.position.set(xPos, yPos + CARD_HEIGHT / 1.5);
                this.drawable.push(scoreCntText);
                this.app.stage.addChild(scoreCntText);

                openedCardStack.addText(scoreCntText);

                this.drawable.push(openedCardStack.cardsContainer);
                this.app.stage.addChild(openedCardStack.cardsContainer);

            });

        const totalScoreText = new Text(`Total score: ${this.table.players[0].totalsScore}`);
        totalScoreText.anchor.set(0.5, 0.5);
        totalScoreText.position.set(
            window.innerWidth / 2,
            window.innerHeight / 4 - CARD_HEIGHT / 1.5
        );
        this.app.stage.addChild(totalScoreText);
        this.drawable.push(totalScoreText);
    }
}
export default Game;