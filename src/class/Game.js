import { Graphics, Container, Text } from 'pixi.js';
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
    }

    Start() {
        const player1 = new Player(0);
        this.table.AddPlayer(player1);
        this.table.GiveCard(0);
        this.table.GiveCard(0);

        const rectangle = new Graphics();
        rectangle.beginFill(0xFFFFFF)
            .drawRect(CONFIG.HAND_RECT_X, CONFIG.HAND_RECT_Y, CONFIG.HAND_WIDTH, CONFIG.HAND_HEIGHT)
            .endFill();

        const cardLeftCntText = new Text(`Cards in deck: ${this.table.deck.cards.length}`);
        cardLeftCntText.anchor.set(0.5, 0.5);
        cardLeftCntText.position.set(window.innerWidth / 2, window.innerHeight / 4 + CONFIG.CARD_HEIGHT / 1.5);

        const closedBackCard = new Card(1000, "0", 'card-shirt-1.png');
        closedBackCard.cardSprite.position.set(window.innerWidth / 2, window.innerHeight / 4 - 10);

        this.backCardContainer.addChildAt(cardLeftCntText, 0);
        this.backCardContainer.addChildAt(closedBackCard.cardSprite, 1);

        const closedCard = new ClosedCard(1000, "0", 'card-shirt-1.png');
        closedCard.position.set(window.innerWidth / 2, window.innerHeight / 4);
        closedCard.on('pointerup', () => this.onDragCardEnd(closedCard));
        closedCard.on('pointerupoutside', () => this.onDragCardEnd(closedCard));
        closedCard.on('click', (e) => this.checkDClick(e, closedCard));
        
        this.museum = new Museum();

        this.app.stage.addChild(rectangle, this.backCardContainer, closedCard);
        this.Redraw();
    }

    checkDClick(e, element) {
        if (!this.timeOne) {
            this.timeOne = new Date().getTime();
            this.clickedDataPoint = e.data.global;
        } else {
            if (new Date().getTime() - this.timeOne < 500 && this.clickedDataPoint === e.data.global) {
                this.OpenCard(element);
            }
            this.timeOne = null;
            this.clickedDataPoint = null;
        }
    }

    onDragCardEnd(element) {
        if (element.dragging) {
            element.alpha = 1;
            element.data = null;
            element.dragging = false;

            if (element.isInRect) {
                this.OpenCard(element);
            }
            element.isInRect = false;
            element.position.set(window.innerWidth / 2, window.innerHeight / 4);
        }
    }

    OpenCard(element) {
        this.table.GiveCard(0);
        const text = this.backCardContainer.getChildAt(0);
        text.text = this.table.deck.cards.length != 0
            ? `Cards in deck: ${this.table.deck.cards.length}`
            : '';

        if (this.table.deck.cards.length == 1) {
            this.backCardContainer.removeChildAt(1);
        }

        if (this.table.deck.cards.length == 0) {
            this.app.stage.removeChild(element);
        }
        this.Redraw();
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
                // TODO: Should do it more clearly
                const xPos = (window.innerWidth / 2 + key * (CONFIG.CARD_WIDTH + CONFIG.CARD_OFFSET)) - (((player.length - 1) * (CONFIG.CARD_WIDTH + CONFIG.CARD_OFFSET)) / 2);
                const yPos = CONFIG.HAND_RECT_Y + CONFIG.HAND_HEIGHT / 2;

                for (let i = card.count - 1; i >= 0; i--) {
                    const newCard = new OpenedCard(card.card.id, card.card.name, card.card.image);
                    newCard.cardSprite.position.set(xPos, yPos - 15 * (i));
                    newCard.setOrderId(i);
                    openedCardStack.addCard(newCard);
                }

                const scoreCntText = new Text(``);
                scoreCntText.anchor.set(0.5, 0.5);
                scoreCntText.position.set(xPos, yPos + CONFIG.CARD_HEIGHT / 1.5);
                openedCardStack.addText(scoreCntText);

                this.drawable.push(scoreCntText);
                this.drawable.push(openedCardStack.cardsContainer);
                this.app.stage.addChild(scoreCntText, openedCardStack.cardsContainer);
            });

        const museum = this.museum.Draw(this.table.players[0].savedCards);

        this.drawable.push(museum);
        this.app.stage.addChild(museum);
    }
}
export default Game;