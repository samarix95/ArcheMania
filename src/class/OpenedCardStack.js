import { Container } from 'pixi.js';

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

        this.isMouseDown = false;
        document.addEventListener('mousedown', () => { this.isMouseDown = true });
        document.addEventListener('mouseup', () => { this.isMouseDown = false });
    }

    addCard(card) {
        this.cardId = card.id;
        card.cardSprite.on('click', () => this.deleteCards(card.orderId));
        card.cardSprite.on('mouseover', () => this.onFocus(true, card.orderId));
        card.cardSprite.on('mouseout', () => this.onFocus(false, card.orderId));
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

        this.dialog = new Dialog(
            `Would you like to send artifacts to museum [${this.selectedCardsCount}] for get ${this.selectedScore} score points?`,
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
        const lastIndex = Object.keys(this.childStore).length - 1;
        const toIndex = lastIndex - (orderId + 1);
        const foundCardIndex = this.playerData.playerCards.findIndex(x => x.card.id == this.cardId);
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
                        element.scale.x += 0.01;
                        element.scale.y += 0.01;
                    } else {
                        element.scale.x -= 0.01;
                        element.scale.y -= 0.01;
                    }
                }
            }

            this.selectedScore = cardData.score[this.selectedCardsCount];

            this.selectedTextObject.text = isFocus
                ? `Selected: ${this.selectedScore}`
                : this.selectedTextObject.text = this.selectedText;
        }
    }
}
export default OpenedCardStack;