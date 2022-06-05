import { Application } from 'pixi.js';
import { APP_WIDTH, APP_HEIGHT } from '../config.js';

class App {
    constructor() {
        this.app = new Application({
            width: APP_WIDTH,
            height: APP_HEIGHT,
            backgroundAlpha: true,
            antialias: true
        });

        this.app.renderer.backgroundColor = 0x23395D;

        this.app.renderer.resize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this.app.view);
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new App();
        }

        return this.instance.app;
    }
}
export default App;