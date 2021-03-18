const GAME_STATES = {
    TITLE: "TITLE_SCREEN",
    GAMEOVER: "GAME_OVER",
    PLAY: "PLAY"
}
class Game {
    constructor() {
        this.barrels = [];
        this.iceControllers = [];
        this.visibleIce = [];
        this.state = GAME_STATES.TITLE
    }

    registerWater(waterLevel) {
        this.waterLevel = waterLevel;
    }
    /**
     * 
     * @param {WL.Object} barrel 
     */
    removeBarrel(barrel) {
        this.barrels.splice(this.barrels.indexOf(barrel.objectId), 1);
        this.iceControllers.forEach(i => i.setBarrels(this.barrels.length));
        this.waterLevel.lower();
    }

    addBarrel(barrel) {
        this.barrels.push(barrel.objectId);
        this.waterLevel.rise();
        this.iceControllers.forEach(i => i.setBarrels(this.barrels.length));
        
        if(this.barrels.length > 25){
            this.state = GAME_STATES.GAMEOVER;
        }
    }

    registerIce(iceController) {
        let index = this.iceControllers.push(iceController);
        iceController.setBarrels(this.barrels.length);
        if (!this.isFirstIceRegistered) {
            this.isFirstIceRegistered = true;
            // iceController.isMelting = true;
            this.visibleIce[index - 1] = true;
            iceController.object.parent.getComponent('ice-drift').currentLength = 20;
        }
        else this.visibleIce[index - 1] = false;
    }

    iceAtDestination(iceController) {
        let index = this.iceControllers.findIndex(d => d._id === iceController._id);
        this.iceControllers[index].isMelting = true;
        this.iceControllers[index].barrelsAtStart = this.barrels.length;
        this.visibleIce[index] = true;
    }

    unregisterIce(iceController) {
        // this.iceControllers.splice(
        //     this.iceControllers.findIndex(d=>d._id === iceController._id), 1);        
        
    }

    /**
     * Handles game states when a button is pressen on the game over screen or
     * title screen.
     * @returns the new game state
     */
    stateButtonPressed() {
        this.state = GAME_STATES.PLAY;
        this.score = 0;
        return this.state;
    }
    
    animalSpawned(){        
        this.animalCount ++;
    }

    animalDied(){
        this.animalCount --;
        if(this.animalCount <= 0){
            this.state = GAME_STATES.GAMEOVER;
        }
    }
}

const game = new Game();