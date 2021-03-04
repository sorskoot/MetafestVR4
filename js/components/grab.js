/// <reference path="../../deploy/wonderland.js" />

WL.registerComponent('grab', {
    collisionGroup: { type: WL.Type.Int, default: 1 },
}, {
    init: function () {

    },
    start: function () {
        this.input = this.object.getComponent("input");
        this.collions = this.object.getComponent("collision")
        this.pickingActive = false;

    },
    update: function (dt) {

        if (!this.input.xrInputSource) {
            return;
        }

        if (this.input.xrInputSource.gamepad.buttons[0].pressed && !this.pickingActive) {

            this.pickingActive = true;
            let overlaps = this.collions.queryOverlaps();
            if (overlaps.length > 0) {
                this.draggingObj = overlaps[0].object;
                this.draggingObj.resetTransform();
                this.draggingObj.parent = this.object;
            }           
        }
        if (!this.input.xrInputSource.gamepad.buttons[0].pressed && this.pickingActive) {
            this.pickingActive = false;
            let wp = new Float32Array(3);
            this.draggingObj.getTranslationWorld(wp);
            let quat = this.draggingObj.transformWorld;
            let downDirection = [0, -1, 0];            
            let rayHit = WL.scene.rayCast(wp, downDirection, (1 << 2));

            if (rayHit.hitCount > 0) {
                let iceCollisionTransform = new Float32Array(3);
                rayHit.objects[0].getTranslationWorld(iceCollisionTransform);
                
                let animalsContainer = 
                    objectUtils.getChildByName(rayHit.objects[0].parent,"Animals");
                console.log(animalsContainer);
                this.draggingObj.parent = animalsContainer;                
                this.draggingObj.setTranslationWorld(
                    [rayHit.locations[0][0]
                    ,rayHit.locations[0][1]+.25,
                    rayHit.locations[0][2]]);

                this.draggingObj = null;
            }else{
                this.draggingObj.destroy();
                console.log("Oh my god! You killed a polar bear! You bastard!")
            }            
        }

    },
});