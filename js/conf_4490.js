/**
 *
 */
projection = new ol.proj.Projection({
    code: 'EPSG:4490',
    extent: [ -180, -90, 180, 90 ],
    units: ol.proj.METERS_PER_UNIT.degrees
});
ol.proj.addProjection(projection);
//重新定义生成类的getMetersPerUnit方法,EPSG:4490的地图半径是6378137
projection.getMetersPerUnit = function () {
    return 2 * Math.PI * 6378137 / 360;
};
//ol.proj.projections_['urn:ogc:def:crs:EPSG::4490'] = projection;
///////////////////////////////////////////////////////////////////////////////

var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
resolutions = new Array(20);
var matrixIds = new Array(20);
for (var z = 0; z < 20; ++z) {
    resolutions[z] = size / Math.pow(2, z + 1);
    matrixIds[z] = 'EPSG:4490:' + (z + 1);
}
var resolutions2 = new Array(3);
var matrixIds2 = new Array(3);
for (var j = 0; j < 3; ++j) {
    matrixIds2[j] = j + 18;
    resolutions2[j] = size / Math.pow(2, j + 18);
}

view = new ol.View({
    center: [ 120.00542, 30.37407 ],
    projection: projection,
    minZoom: 11,
    maxZoom: 20,
    extent: [ 119.54811, 29.92294, 120.50942, 30.69748 ],
    zoom: 11
});

function init_wmts() {
    map = new ol.Map({
        layers: [ new ol.layer.Tile({
            source: new ol.source.WMTS({
                url: 'http://dt.yuhang.gov.cn/geocloud/gwc/service/wmts',
                layer: 'YUHANG',
                matrixSet: 'EPSG:4490',
                format: 'image/png',
                projection: projection,
                tileGrid: new ol.tilegrid.WMTS({
                    origin: ol.extent.getTopLeft(projectionExtent),
                    resolutions: resolutions,
                    matrixIds: matrixIds
                }),
                style: 'default',
                wrapX: true
            })
        })
        ],
        target: 'map',
        /*controls : controls,*/
        view: view
    });

    createWMTSLayer();

    // 地图初始化完成之后
    /*afterInit();*/
}


/**
 * 加载基础地图图层
 */
function createWMTSLayer() {
    //
    var maxResolution = resolutions[16];
    var minResolution = resolutions[19];
    var tileGrid = new ol.tilegrid.WMTS({
        origin: ol.extent.getTopLeft(projectionExtent),
        resolutions: resolutions2,
        matrixIds: matrixIds2
    });

    createWMTSLayer = function (visible, layer, matrixSet) {
        return new ol.layer.Tile({
            maxResolution: maxResolution,
            minResolution: minResolution,
            visible: visible,
            source: new ol.source.WMTS({
                url: 'http://dt.yuhang.gov.cn:80/geocloud/wmts',
                layer: layer,
                matrixSet: matrixSet,
                format: 'image/png',
                projection: projection,
                tileGrid: tileGrid,
                style: 'default',
                wrapX: true
            })
        });
    };
    var layer_sldt = createWMTSLayer(true, 'yhemap', 'EPSG:4490_yhemap');
    var layer_slzj = createWMTSLayer(true, 'yhemapanno', 'EPSG:4490_yhemapanno');
    var layer_yxdt = createWMTSLayer(false, 'yhimgmap', 'EPSG:4490_yhimgmap');
    var layer_yxzj = createWMTSLayer(false, 'yhimgmapanno', 'EPSG:4490_yhimgmapanno');
    map.addLayer(layer_sldt);
    map.addLayer(layer_slzj);
    map.addLayer(layer_yxdt);
    map.addLayer(layer_yxzj);

    if ("undefined" !== typeof(baseLayerGroup)) {
        baseLayerGroup.addBaseLayer("sldt", layer_sldt);
        baseLayerGroup.addBaseLayer("sldt", layer_slzj);
        baseLayerGroup.addBaseLayer("yxdt", layer_yxdt);
        baseLayerGroup.addBaseLayer("yxdt", layer_yxzj);
    }

    //为map2添加矢量地图和影像地图
    if ("undefined" !== typeof(baseLayerGroup2)) {
        baseLayerGroup2['sldt'] = createWMTSLayer(false, 'yhemap', 'EPSG:4490_yhemap');
        baseLayerGroup2['yxdt'] = createWMTSLayer(false, 'yhimgmap', 'EPSG:4490_yhimgmap');
    }
}


var wgs84Sphere = new ol.Sphere(6378137);

/**
 * 计算线的长度
 * @param {ol.geom.LineString} line
 * @return {integer}
 */
function getLineLength(line) {
    var coordinates = line.getCoordinates();
    length = 0;
    var sourceProj = map.getView().getProjection();
    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        length += wgs84Sphere.haversineDistance(coordinates[i], coordinates[i + 1]);
    }
    return length;
}

/**
 * 计算面积
 * @param {ol.geom.Polygon} polygon
 * @return {integer}
 */
function getPolygonArea(polygon) {
    var coordinates = polygon.getLinearRing(0).getCoordinates();
    return Math.abs(wgs84Sphere.geodesicArea(coordinates));
}
