import { Container } from 'pixi.js';
import gsap from 'gsap';

import Dialog from './dialog/Dialog.js';

class OpenedCardStack {
    constructor(gameData) {
        this.gameData = gameData;
        this.playerData = this.gameData.table.players[0];

        this.cardsContainer = new Container();

        this.childStore = {};
        this.cardId = null;

        this.selectedCardsCount = 0;
        this.selectedScore = 0;
        this.selectedTextObject = null;
        this.selectedText = "";

        this.maxWidth = 0;
        this.maxHeight = 0;
        this.minWidth = 0;
        this.minHeight = 0;

        this.isMouseDown = false;
        document.addEventListener('mousedown', () => { this.isMouseDown = true });
        document.addEventListener('mouseup', () => { this.isMouseDown = false });
    }

    addCard(card) {
        this.cardId = card.id;
        card.cardSprite.on('click', () => this.deleteCards(card.orderId));
        card.cardSprite.on('mouseover', () => this.onFocus(true, card.orderId));
        card.cardSprite.on('mouseout', () => this.onFocus(false, card.orderId));

        this.maxWidth = card.cardSprite.width + 10;
        this.maxHeight = card.cardSprite.height + 10;
        this.minWidth = card.cardSprite.width;
        this.minHeight = card.cardSprite.height;

        this.childStore[card.orderId] = card.cardSprite;
        this.cardsContainer.addChild(card.cardSprite);
    }

    addText(textObject) {
        this.selectedTextObject = textObject;
        this.selectedText = textObject.text;
    }

    deleteCards(orderId) {
        const foundCardIndex = this.playerData.playerCards.findIndex(x => x.card.id == this.cardId);
        const cardData = this.playerData.playerCards[foundCardIndex].card;
        const maxCount = Math.max.apply(null, Object.keys(cardData.score));

        orderId = orderId > maxCount - 1 ? maxCount - 1 : orderId;

        for (let i = 0; i <= orderId; i++) {
            const element = this.cardsContainer.getChildAt(this.cardsContainer.getChildIndex(this.childStore[i]));

            gsap.to(element, {
                width: this.minWidth,
                height: this.minHeight,
                duration: 0.1,
                repeat: 1,
                yoyo: true,
            });
        }

        this.dialog = new Dialog(
            `Would you like to send ${this.selectedCardsCount} parts of the ${cardData.name} to museum and get ${this.selectedScore} score points?`,
            this.applySaveCards.bind(this),
            this.cancelSaveCards.bind(this),
            {
                orderId: orderId,
                selectedScore: this.selectedScore
            }
        );
        this.dialog.ShowDialog();
    }

    applySaveCards(params) {
        const orderId = params.orderId;
        const foundCardIndex = this.playerData.playerCards.findIndex(x => x.card.id == this.cardId);
        const lastIndex = Object.keys(this.childStore).length - 1;
        const toIndex = lastIndex - (orderId + 1);
        this.selectedCardsCount = 0;

        for (let i = lastIndex; i > toIndex; i--) {
            this.cardsContainer.removeChild(this.childStore[i]);
            delete this.childStore[i];
            this.playerData.playerCards[foundCardIndex].count = this.playerData.playerCards[foundCardIndex].count - 1;
            this.selectedCardsCount++;
        }

        this.gameData.table.players[0].SaveCard(this.playerData.playerCards[foundCardIndex], this.selectedCardsCount);
        this.playerData.AddScore(params.selectedScore);

        if (this.playerData.playerCards[foundCardIndex].count == 0) {
            this.playerData.playerCards.splice(foundCardIndex, 1);
        }

        delete this.dialog;
        this.gameData.Redraw();
    }

    cancelSaveCards() {
        delete this.dialog;
    }

    onFocus(isFocus, orderId) {
        if (!this.isMouseDown) {
            const foundCardIndex = this.playerData.playerCards.findIndex(x => x.card.id == this.cardId);
            const cardData = this.playerData.playerCards[foundCardIndex].card;
            const maxCount = Math.max.apply(null, Object.keys(cardData.score));

            this.selectedCardsCount = 0;

            for (let i = 0; i <= orderId; i++) {
                if (i < maxCount) {
                    const element = this.cardsContainer.getChildAt(this.cardsContainer.getChildIndex(this.childStore[i]));

                    if (isFocus) {
                        this.selectedCardsCount++;
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
            }

            this.selectedScore = cardData.score[this.selectedCardsCount];

            this.selectedTextObject.text = isFocus
                ? `Selected: ${this.selectedScore}`
                : '';
        }
    }
}
export default OpenedCardStack;