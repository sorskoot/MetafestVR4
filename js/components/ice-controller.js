/// <reference path="../../deploy/wonderland.js" />

WL.registerComponent('ice-controller', {
    meltingDelta: { type: WL.Type.Float, default: 1.0 },
    freezingDelta: { type: WL.Type.Float, default: 10.0 },
    freezingPoint: { type: WL.Type.Float, default: 5.0 },
    iceCollider: { type: WL.Type.Object }
}, {
    init: function () {        
        this.meltingSpeed = 0;
        this.deltaScale = 1;
        
    },
    start: function () {
        this.collider = this.iceCollider.getComponent('collision');
        this.originalExtents = new Float32Array(this.collider.extents);
       
        game.registerIce(this);
    },
    update: function (dt) {
        if (this.meltingSpeed > 0) {
            this.deltaScale = 1 - dt * (this.meltingDelta * this.meltingSpeed) / 100;
        } else {            
            this.deltaScale = 1 - dt * (this.freezingDelta * (this.meltingSpeed-2)) / 100;            
        }
                    
        if (this.object.scalingWorld[0] < .1) {            
            game.unregisterIce(this);
            this.object.destroy();
        }else if (this.object.scalingWorld[0] > 1) {                                            
            this.collider.extents.set(this.originalExtents);
            this.object.resetScaling();
        }else{
            glMatrix.vec3.mul(
                this.collider.extents, 
                this.originalExtents,
                this.object.scalingWorld
                );            
            this.object.scale([this.deltaScale, 1, this.deltaScale])
        }
    },

    /**
     * sets the number of barrels to influence the speed of melting
     * @param {Number} count the number of barrels in the ocean
     */
    setBarrels: function (count) {
        this.meltingSpeed = count - this.freezingPoint;
    }


});