WL.registerComponent('barrel-spawner', {
    spawnrate: {type: WL.Type.Float, default: 1.0},
    barrelmesh:{type:WL.Type.Mesh, default:null},
    barrelmaterial:{type:WL.Type.Material, default:null},
    barrelsLayer:{type:WL.Type.Object}
}, {
    init: function() {
        
    },
    start: function() {
        this.counter = 0;
    },
    update: function(dt) {
        this.counter += dt;

        if(this.counter > this.spawnrate){
            this.counter=0;
            let barrel = WL.scene.addObject(barrelsLayer);

        }
    },
});