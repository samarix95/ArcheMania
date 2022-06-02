import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { DIALOG_X_POS, DIALOG_Y_POS, DIALOG_WIDTH, DIALOG_HEIGHT, DIALOG_TEXT_PADDING } from '../../config.js';

import Button from "./Button";

class Dialog {
    constructor(dialogText = '', onYesAction = null, onNoAction = null, params = {}) {
        this.dialog = new Container();
        this.dialog.params = params;
        this.dialog.onYesAction = onYesAction == null ? () => { } : onYesAction;
        this.dialog.onNoAction = onNoAction == null ? () => { } : onNoAction;
        this.dialog.visible = false;

        this.dialogField = new Graphics();
        this.dialogField.beginFill(0xFF3FFF)
            .lineStyle(4, 0x0, .3)
            .drawRoundedRect(DIALOG_X_POS, DIALOG_Y_POS, DIALOG_WIDTH, DIALOG_HEIGHT, 15)
            .endFill();
        this.dialog.addChild(this.dialogField)

        this.text = new Text(dialogText, new TextStyle({
            fill: "#2c3e50",
            wordWrap: true,
            wordWrapWidth: DIALOG_WIDTH - DIALOG_TEXT_PADDING,
            fontSize: 17,
            lineHeight: 17 * 1.65,
            antialiasing: true
        }));
        this.text.anchor.set(0.5, 0.5);
        this.text.x = DIALOG_X_POS + DIALOG_WIDTH / 2;
        this.text.y = DIALOG_Y_POS + DIALOG_HEIGHT / 2;
        this.dialog.addChild(this.text);

        this.buttonYes = new Button(DIALOG_X_POS + DIALOG_WIDTH - 50, DIALOG_Y_POS + DIALOG_HEIGHT - 35, 80, 45, 'Yes', this.OnYes);
        this.dialog.addChild(this.buttonYes);

        this.buttonNo = new Button(DIALOG_X_POS + 50, DIALOG_Y_POS + DIALOG_HEIGHT - 35, 80, 45, 'No', this.OnNo);
        this.dialog.addChild(this.buttonNo);
        return this;
    }

    OnYes() {
        this.parent.parent.onYesAction(this.parent.parent.params);
        this.parent.parent.visible = false;
    }

    OnNo() {
        this.parent.parent.onNoAction(this.parent.parent.params);
        this.parent.parent.visible = false;
    }

    ShowDialog() {
        this.dialog.visible = true;
    }

    AddDialogText(text) {
        this.text.text = text;
    }

    AddOnYesAction(method) {
        this.dialog.onYesAction = method;
    }

    AddOnNoAction(method) {
        this.dialog.onNoAction = method;
    }

    SetParams(params) {
        this.dialog.params = params;
    }
}
export default Dialog;