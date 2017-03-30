/**
 * Created by xuds on 2016/6/23.
 */
requirejs.config({
    baseUrl: 'js/widget',
    paths: {
        lib: '../lib'
        /*jquery: "../lib/jQuery-1.11.1"*/
    },
    map: {
        '*': {
            'css': 'require-css/css.min'
        }
    }
});
require(["infoWindow/InfoWindow"],
    function (InfoWindow) {
        var popIns = InfoWindow.init({
            map: map
        });
        map.on("singleclick", function (evt) {
            var feature = map.forEachFeatureAtPixel(evt.pixel,
                function (feature) {
                    return feature;
                });
            if (feature) {
                var coordinate = feature.getGeometry().getCoordinates();
                InfoWindow.createContent(feature, popIns);
                popIns.setOffset([0, -34]);
                popIns.setPosition(coordinate);
            }
        });
        $("#hideInfoWindow").click(function () {
            InfoWindow.hide();
        });
        $("#destroyInfoWindow").click(function () {
            InfoWindow.destroy();
        });
    });

$(map.getViewport()).on('mousemove', function (e) {
    var pixel = map.getEventPixel(e.originalEvent);
    var feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        return feature;
    });
    if (feature) {
        require(["cursorManager/CursorManager"], function (CursorManager) {
            CursorManager.setCursor("map", "pointer");
        });
    } else {
        require(["cursorManager/CursorManager"], function (CursorManager) {
            CursorManager.setIconCursor2Map("cur_MeasureDistance.cur");
        });
    }
});