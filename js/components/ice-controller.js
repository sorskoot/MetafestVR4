/// <reference path="../../deploy/wonderland.js" />

WL.registerComponent('ice-controller', {
    meltingDelta: { type: WL.Type.Float, default: 5.0 },
    freezingDelta: { type: WL.Type.Float, default: 10.0 },
    freezingPoint: { type: WL.Type.Float, default: 5.0 },
    iceCollider: { type: WL.Type.Object },

}, {
    init: function () {
        this.meltingSpeed = 0;
        this.deltaScale = 1;
        this.isMelting = false;
        this.isVisible = false;
        this.barrelsAtStart = 0;
    },
    reset:function(){
        this.meltingSpeed = 0;
        this.deltaScale = 1;
        this.isMelting = false;
        this.isVisible = false;
        this.barrelsAtStart = 0;

        if(!this.collider){
            this.collider = this.iceCollider.getComponent('collision');
        }

        this.collider.extents.set(this.originalExtents);
        this.object.resetScaling();
        this.object.parent.getComponent('ice-drift').reset();
    },
    startDrift(){
        this.object.parent.getComponent('ice-drift').isDrifting = true;
    },
    addAnimal(animal){
        animal.object.parent = objectUtils.getChildByName(this.object.parent,"Animals");
    },
    start: function () {
        this.collider = this.iceCollider.getComponent('collision');
        this.originalExtents = new Float32Array(this.collider.extents);

        game.registerIce(this);
    },
    update: function (dt) {
        if(game.state !== GAME_STATES.PLAY) return;
        
        if (!this.isMelting) return;
        if (this.meltingSpeed > 0) {
            this.deltaScale = 1 - dt * this.meltingDelta / 100;
        } else {
            this.deltaScale = 1 - dt * -this.freezingDelta / 100;
        }

        glMatrix.vec3.mul(
            this.collider.extents,
            this.originalExtents,
            this.object.scalingWorld
        );
        this.object.scale([this.deltaScale, 1, this.deltaScale])

        if (this.object.scalingWorld[0] < .5) {
            game.resetIce(this);
        } else if (this.object.scalingWorld[0] > 1) {
            this.collider.extents.set(this.originalExtents);
            this.object.resetScaling();
        }
    },

    /**
     * sets the number of barrels to influence the speed of melting
     * @param {Number} count the number of barrels in the ocean
     */
    setBarrels: function (count) {
        this.meltingSpeed = (count - this.freezingPoint) < 0 ? -1 : 1;
    }
});