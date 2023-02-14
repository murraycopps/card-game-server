import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { games, Game, Card, createGame, addPlayer } from "./games";

const app = express();
app.use(cors());


// create application/json parser
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/games', (req, res) => {
    res.send(games);
})

app.post('/games', jsonParser, (req, res) => {
    const name = req.body.name;
    if (!name) {
        res.status(400).send('Name is required');
        return;
    }
    const game = games.find(g => g.name === name);
    if (game) {
        res.status(400).send('Game already exists');
        return;
    }
    const newGame = createGame(name);
    res.send(newGame);
})


app.get('/games/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const game = games.find(g => g.id === id);
    if (game) {
        res.send(game);
    } else {
        res.status(404).send('Game not found');
    }
})

// join the game as a player
app.post('/games/:id/join', jsonParser, (req, res) => {
    const id = parseInt(req.params.id);
    const game = games.find(g => g.id === id);
    if (game) {
        const name = req.body.name;
        if (!name) {
            res.status(400).send('Name is required');
            return;
        }
        const player = game.players.find(p => p.name === name);
        if (player) {
            res.status(400).send('Player already exists');
            return;
        }
        const newPlayer = addPlayer(game, name);
        res.send(newPlayer);
    } else {
        res.status(404).send('Game not found');
    }
})

// if both players have played a card check which card is higher and give both cards to the winner
// if only one player has played a card, do nothing
// if neither player has played a card, do nothing
const checkForWinner = (game: Game) => {
    const player1 = game.players[0];
    const player2 = game.players[1];
    if (player1.playedCard && player2.playedCard) {

        if (player1.playedCard.number > player2.playedCard.number) {
            player1.cards.push(player1.playedCard);
            player1.cards.push(player2.playedCard);
        } else {
            player2.cards.push(player1.playedCard);
            player2.cards.push(player2.playedCard);
        }
        player1.playedCard = undefined;
        player2.playedCard = undefined;
        // check if either player has won
        if (player1.cards.length === 0) {
            game.winner = player1;
        }
        if (player2.cards.length === 0) {
            game.winner = player2;
        }
    }
}

// get the card that the player wants to play from the request body
// set the playedCard property on the player to the card they want to play
// call the checkForWinner function
// send the game back to the client
app.post('/games/:id/play', jsonParser, (req, res) => {
    const id = parseInt(req.params.id);
    const game = games.find(g => g.id === id);
    if (game) {
        const card = req.body.card;
        console.log(card);

        if (!card) {
            res.status(404).send('Card not found');
            return;
        }

        // find player with the card
        const player = game.players.find(p => p.cards.find(c => c.number === card.number && c.suit === card.suit));
        if (!player) {
            res.status(404).send('Player not found');
            return;
        }

        // if player has played a card already do nothing
        if (player.playedCard) {
            console.log(game)
            res.status(400).send('Player has already played a card');
            return;
        }
        player.playedCard = card;
        // remove card from player
        player.cards = player.cards.filter(c => c.number !== card.number || c.suit !== card.suit);
        checkForWinner(game);

        res.send(game);



    } else {
        res.status(404).send('Game not found');
    }
})


app.listen(5000, () => {
    console.log('Server is running...');
})
