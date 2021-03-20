/// <reference path="../../deploy/wonderland.js" />

const POLARBEAR_Y = .92;
const PENGUIN_Y = .903;

WL.registerComponent('animal', {
    animalType: { type: WL.Type.Enum, values: ['polar bear', 'penguin'], default: 'polar bear' },
},
    {
        init:function(){
            this.originalParent = this.object.parent;
        },
        start: function () {

            this.counter = 0;
            this.isHeld = false;
            game.animalRegister(this);
            this.isInPool = true;
        },
        reset:function(){
            this.object.parent = this.originalParent;
            this.counter = 0;
            this.isHeld = false;            
            this.isInPool = true;
            this.object.translate([0,-1000,0]);
        },
        spawn: function () {
            this.isInPool = false;
            const rad = Math.random()*Math.PI*2;
            this.object.rotateAxisAngleDeg([0, 1, 0], Math.random()*360);
            this.object.setTranslationLocal([Math.sin(rad)*.5, this.animalType === 0 ? POLARBEAR_Y : PENGUIN_Y, Math.cos(rad)*.5]);
            
            return this;
        },
        kill: function () {
            this.isInPool = true;
        },
        update: function (dt) {
            if (this.isHeld || this.isInPool) return;

            this.counter += dt;

            if (this.counter >= .25) {
                this.counter = 0;

                let wp = new Float32Array(3);
                this.object.getTranslationWorld(wp);
                let downDirection = [0, -1, 0];
                let rayHit = WL.scene.rayCast(wp, downDirection, (1 << 2));
                if (rayHit.hitCount === 0) {
                    game.animalDied(this);
                    //this.object.destroy();
                }
            }
        },
    });