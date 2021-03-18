/// <reference path="../../deploy/wonderland.js" />

WL.registerComponent('barrel-spawner', {
    spawnrate: { type: WL.Type.Float, default: 5.0 },
    barrelmesh: { type: WL.Type.Mesh, default: null },
    barrelmaterial: { type: WL.Type.Material, default: null },
    barrelsLayer: { type: WL.Type.Object }
}, {
    init: function () {

    },
    start: function () {
        setInterval(this.spawn.bind(this), this.spawnrate * 1000);
    },
    spawn: function () {
        if (game.state !== GAME_STATES.PLAY) return;
        
        let barrel = WL.scene.addObject(this.barrelsLayer);
        let pos = [];
        this.object.getTranslationWorld(pos);
        barrel.setTranslationWorld([Math.random() + pos[0] - .5, pos[1], Math.random() + pos[2] - .5])
        barrel.transformWorld; // workaround to update;            
        let barrelMesh = WL.scene.addObject(barrel);
        let mesh = barrelMesh.addComponent('mesh');
        mesh.mesh = this.barrelmesh;
        mesh.material = this.barrelmaterial;
        barrelMesh.translate([0, -0.175, 0]);

        let collisionComponent = barrel.addComponent('collision');
        collisionComponent.collider = WL.Collider.Box;
        collisionComponent.group = (1 << 2) | (1 << 3);
        collisionComponent.extents = [0.11, 0.17, .11];
        collisionComponent.active = true;

        let anyCollisions = collisionComponent.queryOverlaps();

        if (anyCollisions.length >= 1) {
            barrel.destroy();
            return;
        }
        barrel.addComponent('float', { depth: .1 });
        barrel.addComponent('tags', { tags: 'barrel' });

        game.addBarrel(barrel);
    },
});