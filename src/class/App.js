import { Application } from 'pixi.js';

class App {
    constructor() {
        this.app = new Application({
            autoResize: true,
            backgroundAlpha: true,
            antialias: true
        });
        this.app.renderer.backgroundColor = 0x00ffff;
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.app.view);

        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        });
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new App();
        }

        return this.instance.app;
    }
}
export default App;