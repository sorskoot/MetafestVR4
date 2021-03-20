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
        this.state = GAME_STATES.TITLE,
            this.animalCount = 0;
        this.animalPool = [];
        this.penguinPoolParent = null;
        this.polarbearPoolParent = null;
        document.body.onkeyup = () => {
            this.stateButtonPressed();
        }
        this.titleMusic = document.getElementById("titleMusic");
        this.titleMusic.volume = .5;
        this.gameMusic = document.getElementById("gameMusic");
        this.gameMusic.volume = .3;
        WL.onXRSessionStart.push(this.playMusic.bind(this));
        WL.onXRSessionEnd.push(this.stopMusic.bind(this));
    }

    playMusic() {
        if (this.state !== GAME_STATES.PLAY) {
            this.titleMusic.play();
            this.gameMusic.pause();
        } else {
            this.gameMusic.play();
            this.titleMusic.pause();
        }
    }
    stopMusic() {
        this.titleMusic.pause();
        this.gameMusic.pause();
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

        if (this.barrels.length > 25) {
            this.state = GAME_STATES.GAMEOVER;
        }
    }

    registerIce(iceController) {
        let index = this.iceControllers.push(iceController);
        iceController.setBarrels(this.barrels.length);
        // if (!this.isFirstIceRegistered) {
        //     this.isFirstIceRegistered = true;
        //     // iceController.isMelting = true;
        //     this.visibleIce[index - 1] = true;
        //     iceController.object.parent.getComponent('ice-drift').currentLength = 20;
        // }
        // else this.visibleIce[index - 1] = false;


    }

    iceAtDestination(iceController) {
        let index = this.iceControllers.findIndex(d => d._id === iceController._id);
        this.iceControllers[index].isMelting = true;
        this.iceControllers[index].barrelsAtStart = this.barrels.length;
        this.visibleIce[index] = true;
    }

    resetIce(iceController) {
        // this.iceControllers.splice(
        //     this.iceControllers.findIndex(d=>d._id === iceController._id), 1);        

        // make sure any existing animals fall off.

        iceController.reset();
        let penguin2 = this.getPenguinFromPool();
        if (!penguin2) return;
        iceController.addAnimal(penguin2);
        this.animalCount++;

        let bear = this.getPolarBearFromPool();
        if (!bear) return;
        iceController.addAnimal(bear);
        this.animalCount++;
    }

    /**
     * Handles game states when a button is pressen on the game over screen or
     * title screen.
     * @returns the new game state
     */
    stateButtonPressed() {
        this.reset();
        this.state = GAME_STATES.PLAY;
        this.score = 0;
        this.playMusic();
        return this.state;
    }

    reset() {
        this.waterLevel.reset();
        this.barrelSpawner.reset();
        for (let j = 0; j < this.animalPool.length; j++) {
            this.animalPool[j].reset();
        }
        this.animalCount = 0;
        this.barrels = [];
        for (let i = 0; i < this.iceControllers.length; i++) {
            const iceController = this.iceControllers[i];
            iceController.reset();
            let penguin = this.getPenguinFromPool();
            if (!penguin) return;
            iceController.addAnimal(penguin);
            this.animalCount++;

            let penguin2 = this.getPenguinFromPool();
            if (!penguin2) return;
            iceController.addAnimal(penguin2);
            this.animalCount++;

            let bear = this.getPolarBearFromPool();
            if (!bear) return;
            iceController.addAnimal(bear);
            this.animalCount++;
        }
        this.iceControllers[0].object.parent.getComponent('ice-drift').currentLength = 20;

    }

    animalRegister(animal) {
        if (animal.animalType === 0 && !this.polarbearPoolParent) {
            this.polarbearPoolParent = animal.object.parent;
        }
        if (animal.animalType === 1 && !this.penguinPoolParent) {
            this.penguinPoolParent = animal.object.parent;
        }
        this.animalPool.push(animal);
    }

    animalDied(animal) {
        animal.kill();
        animal.object.parent = animal.animalType === 0 ? this.polarbearPoolParent : this.penguinPoolParent;
        this.animalCount--;
        if (this.animalCount <= 0) {
            this.state = GAME_STATES.GAMEOVER;
        }
    }

    getPenguinFromPool() {
        let penguin = this.animalPool.find(d => d.isInPool === true && d.animalType === 1);
        if (penguin) {
            return penguin.spawn();
        }
    }

    getPolarBearFromPool() {
        let polarBear = this.animalPool.find(d => d.isInPool === true && d.animalType === 0);
        if (polarBear) {
            return polarBear.spawn();
        }
    }

    registerBarrelSpawner(barrelSpawner) {
        this.barrelSpawner = barrelSpawner;
    }
}

const game = new Game();