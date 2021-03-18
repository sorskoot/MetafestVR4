/// <reference path="../../deploy/wonderland.js" />

const objectUtils = {
    /**
     * Finds a child by a specified name
     * @param {WL.Object} object object to get a child from
     * @param {string} name name of the child to search
     * @returns {WL.Object} child with name
     */
    getChildByName: function (object, name) {
        return object.children.find(function (d) { return d.name === name });
    },

}