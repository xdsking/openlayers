/**
 * Created by xuds on 2016/6/23.
 */
define(function (require, exports, module) {
    return{
        getLayers:function(){
           return  $.getJSON("data/layers.json");
        }
    }
});