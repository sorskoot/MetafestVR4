/// <reference path="../../deploy/wonderland.js" />

WL.registerComponent('grab', {
    collisionGroup: { type: WL.Type.Int, default: 1 },
}, {
    init: function () {

    },    
    start: function () {
        this.input = this.object.getComponent("input");
        this.collisions = this.object.getComponent("collision")
        this.pickingActive = false;

    },    
    update: function (dt) {
        if(game.state !== GAME_STATES.PLAY) return;

        if (!this.input.xrInputSource) {
            return;
        }

        if (this.input.xrInputSource.gamepad.buttons[0].pressed && !this.pickingActive) {

            this.pickingActive = true;
            let overlaps = this.collisions.queryOverlaps();
            if (overlaps.length > 0) {
                this.draggingObj = overlaps[0].object;                
                const tags = this.draggingObj.getComponent('tags');
                if(tags && tags.hasTag('barrel')){
                    sfx.SplashSubtle.play();
                    game.removeBarrel(this.draggingObj);
                    this.draggingObj.destroy();                    
                    this.draggingObj=null;                    
                }
                else{
                    const animal = this.draggingObj.getComponent('animal');
                    if(animal.animalType === 0){
                        sfx.polarbear.play();
                    }else{
                        sfx.penguin.play();
                    }
                    animal.isHeld = true;
                    this.draggingObj.resetTransform();
                    this.draggingObj.parent = this.object;
                }
            }           
        }
        if (!this.input.xrInputSource.gamepad.buttons[0].pressed && this.pickingActive) {
            this.pickingActive = false;
            
            if(!this.draggingObj){
                return;
            }
            
            const animal = this.draggingObj.getComponent('animal');
            animal.isHeld = false;

            let wp = new Float32Array(3);
            this.draggingObj.getTranslationWorld(wp);
            let downDirection = [0, -1, 0];            
            let rayHit = WL.scene.rayCast(wp, downDirection, (1 << 2));

            if (rayHit.hitCount > 0) {
                
                let iceCollisionTransform = new Float32Array(3);
                rayHit.objects[0].getTranslationWorld(iceCollisionTransform);
                
                let animalsContainer = 
                    objectUtils.getChildByName(rayHit.objects[0].parent.parent,"Animals");
                console.log(animalsContainer);
                this.draggingObj.parent = animalsContainer;                
                this.draggingObj.setTranslationWorld(
                    [rayHit.locations[0][0]
                    ,rayHit.locations[0][1]+.1,
                    rayHit.locations[0][2]]);

                this.draggingObj = null;
            }else{
                this.draggingObj.destroy();
                console.log("Oh my god! You killed an animal You bastard!")
            }            
        }

    },
});