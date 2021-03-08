class Game
{
    constructor(){
        this.barrels = [];
    }
    registerWater(waterLevel){
        this.waterLevel = waterLevel;
    }    
    /**
     * 
     * @param {WL.Object} barrel 
     */
    removeBarrel(barrel){
        this.barrels.splice(this.barrels.indexOf(barrel.objectId),1);
        
        this.waterLevel.lower();
    }

    addBarrel(barrel){
        this.barrels.push(barrel.objectId);
        
        this.waterLevel.rise();
    }
}

const game = new Game();