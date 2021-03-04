WL.registerComponent('tags', {
    tags: {type: WL.Type.String},
}, {  
    init:function(){
        this.internalTags = this.tags.split(/\W+/g);        
    },
    /**
     * 
     * @param {string} tag the tag to test
     */
    hasTag:function(tag){
        return !!~this.internalTags.indexOf(tag);
    }
});