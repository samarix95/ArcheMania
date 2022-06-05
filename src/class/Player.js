class Player {
    constructor(id) {
        this.id = id;
        this.playerCards = [];
        this.savedCards = [];
        this.totalsScore = 0;
    }

    AddCard(card) {
        const foundIndex = this.playerCards.findIndex(x => x.card.id == card.id);
        if (foundIndex == -1) {
            this.playerCards.push({ "card": card, "count": 1 });
        } else {
            this.playerCards[foundIndex].count = this.playerCards[foundIndex].count + 1;
        }
    }

    SaveCard(cardData, count) {
        this.savedCards.push({
            id: cardData.card.id,
            image: cardData.card.image,
            name: cardData.card.name,
            count: count,
            score: cardData.card.score[count]
        });
    }

    AddScore(addValue) {
        this.totalsScore += addValue;
    }
}
export default Player;