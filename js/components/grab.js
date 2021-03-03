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

        if(this.draggingObj){
            // let position = new Float32Array(3);
            // position = this.object.getTranslationWorld(position);
            //this.draggingObj.resetTransform();
            //this.draggingObj.translate(position);
            
        }
        if (this.input.xrInputSource.gamepad.buttons[0].pressed && !this.pickingActive) {

            this.pickingActive = true;
            let overlaps = this.collions.queryOverlaps();
            if (overlaps.length > 0) {                
                // console.log(overlaps[0].object.name);
                this.draggingObj = overlaps[0].object;
                this.draggingObj.resetTransform();
                this.draggingObj.parent = this.object;
            }
            // let origin = [0, 0, 0];
            // glMatrix.quat2.getTranslation(origin, this.object.transformWorld);

            // let quat = this.object.transformWorld;

            // let forwardDirection = [0, 0, 0];
            // glMatrix.vec3.transformQuat(forwardDirection, [0, 0, -1], quat);
            // let rayHit = WL.scene.rayCast(origin, 
            //     forwardDirection, (1 << this.floorGroup)) ;

            // if (rayHit.hitCount > 0) {                
            //     console.log(rayHit);
            //     this.pickedObject = rayHit.objects[0];
            // }else{
            //     this.pickedObject = null;
            // }
        }
        if (!this.input.xrInputSource.gamepad.buttons[0].pressed && this.pickingActive) {
            this.pickingActive = false;
            this.draggingObj.parent = null;
            this.draggingObj = null;
            
            //     this.pickedObject.setTransformWorld(this.object.transformWorld);
        }

    },
});