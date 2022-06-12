import { Container, Graphics, Text, TextStyle } from "pixi.js";
import * as CONFIG from '../../config';

import App from '../App';
import ButtonText from '../button/ButtonText';

class Dialog {
    constructor(dialogText = '', onYesAction = null, onNoAction = null, params = {}) {
        this.app = App.getInstance();
        this.params = params;
        this.onYesAction = onYesAction == null ? () => { } : onYesAction;
        this.onNoAction = onNoAction == null ? () => { } : onNoAction;

        this.dialogContainer = new Container();
        this.dialogContainer.position.set(window.innerWidth / 2 - CONFIG.DIALOG_WIDTH / 2, CONFIG.DIALOG_Y_POS);
        this.dialogContainer.visible = false;

        const dialogBackGround = new Graphics();
        dialogBackGround.beginFill(0xe6e6fa)
            .lineStyle(4, 0x0, .3)
            .drawRect(-(window.innerWidth / 2 - CONFIG.DIALOG_WIDTH / 2), -CONFIG.DIALOG_Y_POS, window.innerWidth, window.innerHeight)
            .endFill();
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

        const buttonYes = new ButtonText(CONFIG.DIALOG_WIDTH - CONFIG.DIALOG_PADDING, CONFIG.DIALOG_HEIGHT - 35, 80, 45, this.OnYesAction.bind(this), 'Yes');
        const buttonNo = new ButtonText(CONFIG.DIALOG_PADDING, CONFIG.DIALOG_HEIGHT - 35, 80, 45, this.OnNoAction.bind(this), 'No');

        this.dialogContainer.addChild(dialogBackGround, dialogField, text, buttonYes, buttonNo);

        window.addEventListener('resize', () => {
            this.dialogContainer.position.x = window.innerWidth / 2 - CONFIG.DIALOG_WIDTH / 2;
            dialogBackGround.clear();
            dialogBackGround.beginFill(0xe6e6fa)
                .lineStyle(4, 0x0, .3)
                .drawRect(-(window.innerWidth / 2 - CONFIG.DIALOG_WIDTH / 2), -(window.innerWidth / 2 - CONFIG.DIALOG_WIDTH / 2), window.innerWidth, window.innerHeight)
                .endFill();
        });

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