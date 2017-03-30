/**
 * Created by xuds on 2016/4/7.
 */
var aa={
    style: (function () {
        var someStyle = [new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'blue'
            }),
            stroke: new ol.style.Stroke({
                color: 'olive',
                width: 1
            })
        })];
        var otherStyle = [new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'red'
            })
        })];
        return function (feature, resolution) {
            if (feature.get('class') === "someClass") {
                return someStyle;
            } else {
                return otherStyle;
            }
        };
    }())
};