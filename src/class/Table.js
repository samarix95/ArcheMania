import Deck from './Deck.js';

class Table {
    constructor() {
        this.players = [];
        this.deck = new Deck();
        this.Init();
    }

    Init() {
        this.deck.CreateDeck();
        this.deck.ShuffleDeck();
    }

    AddPlayer(player) {
        this.players.push(player);
    }

    EndGame() {
        this.players.map((player) => {
            player.playerCards.map((card, key) => {
                const cardCount = card.count;
                const scoreTable = card.card.score;

                const maxCount = Math.max.apply(null, Object.keys(scoreTable));
                const fullCnt = Math.floor(cardCount / maxCount);
                const part = cardCount - fullCnt * maxCount;

                for (let i = 0; i < fullCnt; i++) {
                    player.SaveCard(player.playerCards[key], maxCount);
                    player.AddScore(scoreTable[maxCount]);
                }

                for (let i = 0; i < part; i++) {
                    player.SaveCard(player.playerCards[key], part);
                    player.AddScore(scoreTable[part]);
                }
            });

            player.playerCards = [];
        });
    }

    GiveCard(playerId) {
        const gotCard = this.deck.GetCard();
        const player = this.players.find((player) => (player.id == playerId));
        player.AddCard(gotCard);

        if (this.deck.cards.length == 0) {
            this.EndGame();
        }
    }
}
export default Table;