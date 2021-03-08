/// <reference path="../../deploy/wonderland.js" />

WL.registerComponent('barrel-spawner', {
    spawnrate: {type: WL.Type.Float, default: 3.0},
    barrelmesh:{type:WL.Type.Mesh, default:null},
    barrelmaterial:{type:WL.Type.Material, default:null},
    barrelsLayer:{type:WL.Type.Object}
}, {
    init: function() {
        
    },
    start: function() {      
        setInterval(this.spawn.bind(this),this.spawnrate*1000);
    },
    spawn: function() {      
            let barrel = WL.scene.addObject(this.barrelsLayer);          
            barrel.translate([Math.random()*6-3,0,Math.random()*6-3])
            barrel.transformWorld; // workaround to update;            
            let barrelMesh = WL.scene.addObject(barrel);
            let mesh = barrelMesh.addComponent('mesh');
            mesh.mesh = this.barrelmesh;
            mesh.material = this.barrelmaterial;
            barrelMesh.translate([0,-0.175,0]);

            let collisionComponent = barrel.addComponent('collision');
            collisionComponent.collider = WL.Collider.Box;
            collisionComponent.group = 1 << 2;
            collisionComponent.extents = [0.11, 0.17, .11];
            collisionComponent.active = true;
            
            let anyCollisions = collisionComponent.queryOverlaps();

            if(anyCollisions.length>=1 ){                                
                barrel.destroy();
                return;
            }          
            barrel.addComponent('float',{depth:.1});
            barrel.addComponent('tags',{tags:'barrel'});

            game.addBarrel(barrel);        
    },
});