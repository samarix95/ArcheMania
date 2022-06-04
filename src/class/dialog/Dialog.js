import { Container, Graphics, Text, TextStyle } from "pixi.js";
import * as CONFIG from '../../config.js';

import App from '../App.js';
import Button from './Button';

class Dialog {
    constructor(dialogText = '', onYesAction = null, onNoAction = null, params = {}) {
        this.app = App.getInstance();
        this.params = params;
        this.onYesAction = onYesAction == null ? () => { } : onYesAction;
        this.onNoAction = onNoAction == null ? () => { } : onNoAction;

        this.dialogContainer = new Container();
        this.dialogContainer.position.set(CONFIG.DIALOG_X_POS, CONFIG.DIALOG_Y_POS);
        this.dialogContainer.visible = false;

        const dialogBackGround = new Graphics();
        dialogBackGround.beginFill(0xe6e6fa)
            .lineStyle(4, 0x0, .3)
            .drawRect(-CONFIG.DIALOG_X_POS, -CONFIG.DIALOG_Y_POS, window.innerWidth, window.innerHeight)
            .endFill()
        dialogBackGround.alpha = 0.5;
        dialogBackGround.interactive = true;

        const dialogField = new Graphics();
        dialogField.beginFill(0xe6e6fa)
            .lineStyle(4, 0x0, .3)
            .drawRoundedRect(0, 0, CONFIG.DIALOG_WIDTH, CONFIG.DIALOG_HEIGHT, 15)
            .endFill();

        const text = new Text(dialogText, new TextStyle({
            fill: "#2c3e50",
            wordWrap: true,
            wordWrapWidth: CONFIG.DIALOG_WIDTH - CONFIG.DIALOG_TEXT_MARGIN,
            fontSize: 17,
            lineHeight: 17 * 1.65,
            antialiasing: true
        }));
        text.position.set(CONFIG.DIALOG_WIDTH / 2, CONFIG.DIALOG_PADDING);
        text.anchor.set(0.5, 0.5);

        const buttonYes = new Button(CONFIG.DIALOG_WIDTH - CONFIG.DIALOG_PADDING, CONFIG.DIALOG_HEIGHT - 35, 80, 45, 'Yes', this.OnYesAction.bind(this));
        const buttonNo = new Button(CONFIG.DIALOG_PADDING, CONFIG.DIALOG_HEIGHT - 35, 80, 45, 'No', this.OnNoAction.bind(this));

        this.dialogContainer.addChild(dialogBackGround, dialogField, text, buttonYes, buttonNo);
        return this;
    }

    ShowDialog() {
        this.dialogContainer.visible = true;
        this.app.stage.addChild(this.dialogContainer);
    }

    HideDialog() {
        this.dialogContainer.visible = false;
        this.app.stage.removeChild(this.dialogContainer);
    }

    OnYesAction() {
        this.onYesAction(this.params);
        this.HideDialog();
    }

    OnNoAction() {
        this.onNoAction(this.params);
        this.HideDialog();
    }
}
export default Dialog;