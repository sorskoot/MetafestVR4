const DEFAULT_WATER_LEVEL =.5;
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
    },

    reset:function(){
        this.object.setTranslationLocal([0,DEFAULT_WATER_LEVEL,0]);
    }    
});