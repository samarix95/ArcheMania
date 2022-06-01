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

    GiveCard(playerId) {
        const gotCard = this.deck.GetCard();
        const player = this.players.find((player) => (player.id == playerId));
        player.AddCard(gotCard);
    }
}
export default Table;