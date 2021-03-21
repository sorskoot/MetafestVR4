const GAME_STATES = {
    TITLE: "TITLE_SCREEN",
    GAMEOVER: "GAME_OVER",
    PLAY: "PLAY",
    PAUSED: "PAUSED"
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
        WL.onXRSessionStart.push(this.enterXR.bind(this));
        WL.onXRSessionEnd.push(this.exitXR.bind(this));
    }

    enterXR() {
        if (this.state !== GAME_STATES.PLAY
            && this.state !== GAME_STATES.PAUSED) {
            this.titleMusic.play();
            this.gameMusic.pause();
        } else {
            if (this.state === GAME_STATES.PAUSED) {
                this.state = GAME_STATES.PLAY;
            }
            this.gameMusic.play();
            this.titleMusic.pause();
        }
    }
    exitXR() {
        if (this.state === GAME_STATES.PLAY) {
            this.state = GAME_STATES.PAUSED;
            console.log("Game Paused");
        }
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
        // reparent any existing animals to make them fall off the ice.
        const animalObject = objectUtils.getChildByName(iceController.object.parent, "Animals");
        const animalObjectChildren = animalObject.children;
        for (let i = 0; i < animalObjectChildren.length; i++) {
            animalObjectChildren[i].parent = iceController.parent.parent;
        }

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
        this.enterXR();
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
        this.iceControllers[0].startDrift();

        setTimeout(() => {
            this.iceControllers[1].startDrift();
        }, 5000);

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