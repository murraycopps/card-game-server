type Game = {
    id: number;
    started: boolean;
    winner?: Player;
    name: string;
    players: Player[];
}

type Card = {
    number: number;
    suit: string;
}

type Player = {
    id: number;
    chosen: boolean;
    name: string;
    cards: Card[];
    playedCard?: Card;
}

const games: Game[] = []

const findMaxID = (): number => {
    let maxID = 0;
    games.forEach(game => {
        if (game.id > maxID) {
            maxID = game.id;
        }
    });
    return maxID;
}

const createGame = (name: string): Game => {
    const game: Game = {
        id: findMaxID() + 1,
        started: false,
        name: name,
        players: []
    }
    games.push(game);
    return game;
}

const addPlayer = (game: Game, name: string): Player => {
    const player: Player = {
        id: game.players.length + 1,
        chosen: false,
        name: name,
        cards: []
    }
    game.players.push(player);
    if(game.players.length === 2) {
        game.started = true;
        dealCards(game);
    }
    return player;
}


const dealCards = (game: Game) => {
    const cards: Card[] = [];
    for (let i = 2; i <= 14; i++) {
        cards.push({ number: i, suit: 'hearts' });
        cards.push({ number: i, suit: 'diamonds' });
        cards.push({ number: i, suit: 'clubs' });
        cards.push({ number: i, suit: 'spades' });
    }
    // shuffle the cards
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = cards[i];
        cards[i] = cards[j];
        cards[j] = temp;
    }
    // deal the cards
    for (let i = 0; i < cards.length; i++) {
        game.players[i % game.players.length].cards.push(cards[i]);
    }
}



export { games, createGame, Game, Card, Player, addPlayer }