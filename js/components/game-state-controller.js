WL.registerComponent('game-state-controller', {
    TitleScreen: { type: WL.Type.Object, default: null },
    GameOverScreen: { type: WL.Type.Object, default: null },

}, {
    start: function () {
        this.titleMesh = this.TitleScreen.getComponent('mesh');
        this.titleMesh.active = true;
        this.lastState = GAME_STATES.TITLE;

        this.gameoverMesh = this.GameOverScreen.getComponent('mesh');
        this.gameoverMesh.active = false;
    },
    update: function (dt) {
        if (!WL.xrSession) {
            return;
        }
        if (game.state === GAME_STATES.PLAY) return;
        if (game.state === GAME_STATES.TITLE && this.lastState !== GAME_STATES.TITLE) {
            this.lastState = GAME_STATES.TITLE;
            this.titleMesh.active = true;
        }

        if (game.state === GAME_STATES.GAMEOVER && this.lastState !== GAME_STATES.GAMEOVER) {
            this.lastState = GAME_STATES.GAMEOVER;
            this.gameoverMesh.active = true;
        }


        for (let index = 0; index < WL.xrSession.inputSources.length; index++) {
            const inputSource = WL.xrSession.inputSources[index];
            if (inputSource.gamepad &&
                (
                    inputSource.gamepad.buttons[0].pressed ||
                    inputSource.gamepad.buttons[1].pressed ||
                    inputSource.gamepad.buttons[2].pressed ||
                    inputSource.gamepad.buttons[3].pressed
                )) {
                this.gameoverMesh.active = false;
                this.titleMesh.active = false;
                this.lastState = game.stateButtonPressed();
                return;
            }
        }

    },
});