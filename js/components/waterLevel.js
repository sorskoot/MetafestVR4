WL.registerComponent('water-level', {
    delta:{type:WL.Type.Float, default:0.02}
}, {
    init: function() {
        game.registerWater(this);
    }, 
    rise:function(){
        this.object.translate([0,this.delta,0]);
    },
    lower:function(){
        this.object.translate([0,-this.delta,0]);
    }
});