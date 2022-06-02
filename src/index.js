import App from './class/App.js';
import Game from './class/Game.js';

const application = App.getInstance();
const game = new Game(application.app);
game.Start();
