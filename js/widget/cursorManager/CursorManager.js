/**
 * Created by xuds on 2016/8/15.
 */
define(["require"], function (require) {
    var _cursor;
    var _setCursor = function (element, value, isurl) {
        var target;
        if (ol.Map.prototype.isPrototypeOf(element)) {
            target = element.getTarget();
        } else {
            target = element;
        }
        var $target = typeof target === "string" ? $("#" + target) : $(target);
        if (isurl) {
            var cursor = require.toUrl("./images/" + value);
            $target.css("cursor", "url('" + cursor + "'),default");
            _cursor="url('" + cursor + "'),default";
        } else {
            $target.css("cursor", value);
            _cursor=value;
        }
    };
    return {
        /**
         * @summary 设置鼠标样式
         * @param element<map||id||dom||$>
         * @param value<string>
         * @param isurl<bool>
         */
        setCursor: function (element, value, isurl) {
            _setCursor(element, value, isurl);

        },
        setIconCursor2Map: function(url){
            var target=map.getTarget()||$("#map");
            var $target = typeof target === "string" ? $("#" + target) : $(target);
            _setCursor($target,url,true);
        },
        getCursor:function(){
            return _cursor;
        }
    }
});