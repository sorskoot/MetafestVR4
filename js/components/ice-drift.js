WL.registerComponent('ice-drift', {
    startLocation: { type: WL.Type.Object },
    endLocation: { type: WL.Type.Object },
    speed: { type: WL.Type.Float, default: 5.0 },
    isDrifting: { type: WL.Type.Bool, default: false },
    iceController: {type: WL.Type.Object, default: null}
}, {
    init: function () {                   
        this.currentPosition = new Float32Array(3);
        this.fromPosition = [];
        this.startLocation.getTranslationWorld(this.fromPosition);

        this.toPosition = [];
        this.endLocation.getTranslationWorld(this.toPosition);

        glMatrix.vec3.sub(this.currentPosition, this.toPosition, this.fromPosition);
        this.fromToLength = glMatrix.vec3.length(this.currentPosition);
        this.currentLength = 0;
        
        this.object.setTranslationWorld(this.currentPosition);
    },

    update: function (dt) {
        if(game.state !== GAME_STATES.PLAY) return;
        if (this.isDrifting) {
            this.currentLength += dt * this.speed;
            let factor = this.currentLength / this.fromToLength;
            factor = Math.min(1.0, factor);
            glMatrix.vec3.lerp(this.currentPosition, this.fromPosition, this.toPosition, factor);
            let position = [];
            this.object.getTranslationWorld(position);
            //this.object.resetTranslationRotation();
            this.object.setTranslationWorld(
                [this.currentPosition[0],position[1],this.currentPosition[2]]);

            if (this.currentLength >= this.fromToLength) {
                game.iceAtDestination(this.iceController.getComponent('ice-controller'));
                this.isDrifting = false;                
            }
           
        }
    },
});