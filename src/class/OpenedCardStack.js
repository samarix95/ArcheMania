import { Container } from 'pixi.js';

class OpenedCardStack {
    constructor(gameData) {
        this.gameData = gameData;
        this.cardsContainer = new Container();
        this.childStore = {};
        this.cardId = null;
        this.selectedCardsCount = 0;
        this.selectedTextObject = null;
        this.selectedText = "";
    }

    addText(textObject) {
        this.selectedTextObject = textObject;
        this.selectedText = textObject.text;
    }

    deleteCards(orderId) {
        const playerData = this.gameData.table.players[0];
        const lastIndex = Object.keys(this.childStore).length - 1;
        const toIndex = lastIndex - (orderId + 1);
        const foundCardIndex = playerData.playerCards.findIndex(x => x.card.id == this.cardId);
        this.selectedCardsCount = 0;

        for (let i = lastIndex; i > toIndex; i--) {
            this.cardsContainer.removeChild(this.childStore[i]);
            delete this.childStore[i];
            playerData.playerCards[foundCardIndex].count = playerData.playerCards[foundCardIndex].count - 1;
            this.selectedCardsCount++;
        }

        playerData.AddScore(playerData.playerCards[foundCardIndex].card.score[this.selectedCardsCount]);

        if (playerData.playerCards[foundCardIndex].count == 0) {
            playerData.playerCards.splice(foundCardIndex, 1);
        }

        this.gameData.Redraw();
    }

    onFocus(isFocus, orderId) {
        const playerData = this.gameData.table.players[0];
        const foundCardIndex = playerData.playerCards.findIndex(x => x.card.id == this.cardId);
        this.selectedCardsCount = 0;
        for (let i = 0; i <= orderId; i++) {
            const elementId = this.cardsContainer.getChildIndex(this.childStore[i]);
            const element = this.cardsContainer.getChildAt(elementId);
            if (isFocus) {
                this.selectedCardsCount++;
                element.scale.x += 0.01;
                element.scale.y += 0.01;
            } else {
                element.scale.x -= 0.01;
                element.scale.y -= 0.01;
            }
        }
        if (isFocus) {
            this.selectedTextObject.text = `Will save: ${playerData.playerCards[foundCardIndex].card.score[this.selectedCardsCount]}`;
        } else {
            this.selectedTextObject.text = this.selectedText;
        }
    }

    addCard(card) {
        this.cardId = card.id;
        card.cardSprite.on('click', () => this.deleteCards(card.orderId));
        card.cardSprite.on('mouseover', () => this.onFocus(true, card.orderId));
        card.cardSprite.on('mouseout', () => this.onFocus(false, card.orderId));
        this.childStore[card.orderId] = card.cardSprite;
        this.cardsContainer.addChild(card.cardSprite);
    }
}
export default OpenedCardStack;