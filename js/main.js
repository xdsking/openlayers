/**
 * Created by xuds on 2016/6/23.
 */
requirejs.config({
    baseUrl: 'js/widget',
    paths: {
        lib: '../lib'
        /*jquery: "../lib/jQuery-1.11.1"*/
    }
});
requirejs(["layerStore", "layerFactory"],
    function (layerStore, layerFactory) {
        //获取图层数据
        layerStore.getLayers().done(function (layers) {
            if (layers.length > 0) {
                $.each(layers, function (index, layer) {
                    layerFactory.addLayer(map, layer);
                });
            }
        });
    });