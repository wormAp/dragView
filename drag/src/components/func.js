/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
(function (nameSpace) {
    nameSpace.func =  nameSpace.func || {};
    function canConfig() {
        return({
            getConfigs:function () {
                var self = this;
                var configs = this._componentMap.componentMapToConfig(this).filter(function (item) {
                    return item.configs.element.leaf && item.configs.element.rootKey===self._currentElement.parentKey;
                });
                return configs
            },
            setConfig:function (nextConfigs) {
                var self = this;
                nextConfigs.forEach(function (item) {
                    var element = self._componentMap.getComponent(item.key).getCurrentElement();
                    element[item.field] = item.value;
                })
            }
        });
    }
    nameSpace.func = {
        canConfig:canConfig
    }
})(window.YT.DataView);