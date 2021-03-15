WL.registerComponent('animal', {
    animalType: { type: WL.Type.Enum, values: ['polar bear', 'penguin'], default: 'polar bear' },
},
    {
        start: function () {
            this.counter = 0;
            this.isHeld = false;
        },        
        update: function (dt) {
            if(this.isHeld) return;
            this.counter += dt;

            if (this.counter >= .25) {
                this.counter = 0;
                
                let wp = new Float32Array(3);
                this.object.getTranslationWorld(wp);
                let downDirection = [0, -1, 0];
                let rayHit = WL.scene.rayCast(wp, downDirection, (1 << 2));
                if (rayHit.hitCount === 0) {
                    console.log('animal died');
                    this.object.destroy();
                }
            }
        },
    });