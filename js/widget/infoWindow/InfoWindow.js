/**
 * Created by xuds on 2016/8/11.
 */
define(['css!infoWindow/infoWindow'], function () {
    /**
     *
     * @returns {*|jQuery|HTMLElement}
     */
    var popIns, map;
    var createDom = function () {
        var popup = '<div id="ol-popup" class="ol-popup"><a href="#" id="popup-closer" class="ol-popup-closer"></a><div class="popup-content"></div></div>';
        var $popup = $("#ol-popup");
        if (!$popup[0]) {
            $popup = $(popup).appendTo("body");
        }
        return $popup;
    };
    /**
     * @summary
     * @param $popup
     * @returns {ol.Overlay}
     */
    var addOverlay = function ($popup) {
        var container = $popup[0];
        var closer = $popup.find(".ol-popup-closer")[0];
        popIns = new ol.Overlay(({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        }));
        popIns.$content = $popup.find(".popup-content");
        closer.onclick = function () {
            popIns.setPosition(undefined);
            closer.blur();
            return false;
        };
        map.addOverlay(popIns);
        return popIns;
    };
    var getPropertyList = function (feature) {
        var propertyList = [];
        var fields = feature.fields, properties = feature.getProperties();
        if ($.isArray(fields)) {
            $.each(fields, function (index, item) {
                var value = properties[item.field];
                var label = item.alias || item.field;
                var propertyItem = {
                    label: label,
                    value: value || ""
                };
                if (item["type"]) {
                    $.extend(propertyItem, {
                        type: item["type"]
                    })
                }
                propertyList.push(propertyItem);

            });
        } else {
            $.each(properties, function (index, item) {
                if (typeof item != "object") {
                    propertyList.push({
                        label: index,
                        value: item
                    });
                }
            });
        }
        return propertyList;
    };
    var createInfoWindowForm = function (propertyList) {
        var $content = popIns.$content, $table = $("<table><tbody></tbody></table>");
        $content.empty().append($table);
        $.each(propertyList, function (index, item) {
            switch (item.type) {
                case "title":
                    var content = $("<div>", {
                        "class": "title",
                        innerHTML: item.value
                    })
                    $content.prepend('<div class="title">' + item.value + '</div>');
                    break;
                case "url":
                    if (!item.value.trim().startsWith("http")) {
                        item.value = "http://" + item.value;
                    }
                    $table.find("tbody").append('<tr><td class="label">' + item.label + '：</td><td class="url"><a target="_blank" href="' + item.value + '">' + item.value + '</a></td></tr>');
                    break;
                default:
                    $table.find("tbody").append('<tr> <td class="label">' + item.label + '：</td> <td class="value">' + item.value + '</td></tr>');
            }
        });
    };
    var setLabelSellWidth = function (propertyList) {
        var maxLength = 0, $content = popIns.$content;
        $.each(propertyList, function (index, item) {
            var length = 0, label = item.label;
            for (var i = 0; i < label.length; i++) {
                if (label.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
                    length += 2;
                else
                    length++;
            }
            maxLength = maxLength < length ? length : maxLength;
        });
        //maxLength = maxLength < item.label.length ? item.label.length : maxLength;
        $content.find(".label").css("width", (maxLength / 2 + 1) * 13 + "px");
    };
    return {
        init: function (params) {
            map = params.map;
            if (!map) {
                $.error("未传入map对象");
            }
            var $popup = createDom();
            return addOverlay($popup);
        },
        createContent: function (feature) {
            var propertyList = getPropertyList(feature);
            createInfoWindowForm(propertyList);
            setLabelSellWidth(propertyList);
        },
        hide: function () {
            if (!popIns) {
                $.error("未能找到InfoWindow对象");
                return;
            }
            popIns.setPosition(undefined);
        },
        show: function () {
            //TODO
        },
        destroy: function () {
            if (!popIns) {
                $.error("未能找到InfoWindow对象");
                return;
            }
            popIns.setPosition(undefined);
            popIns.$content.empty();
        }
    }
});