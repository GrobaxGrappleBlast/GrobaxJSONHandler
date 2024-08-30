"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSON_BASETYPES = exports.JSON_TAGS = exports.NoOutput = exports.BASE_SCHEME = void 0;
exports.BASE_SCHEME = '_base';
exports.NoOutput = {
    outError: function (msg) { },
    outLog: function (msg) { }
};
var JSON_TAGS;
(function (JSON_TAGS) {
    JSON_TAGS["JSON_PROPERTY"] = "JSON_PROPERTY";
    JSON_TAGS["JSON_PROPERTY_TYPED"] = "JSON_PROPERTY_TYPED";
    JSON_TAGS["JSON_PROPERTY_NAME_MAP_IN"] = "JSON_PROPERTY_NAME_MAP_IN";
    JSON_TAGS["JSON_PROPERTY_NAME_MAP_OUT"] = "JSON_PROPERTY_NAME_MAP_OUT";
    JSON_TAGS["JSON_PROPERTY_FUNC_MAP_IN"] = "JSON_PROPERTY_FUNC_MAP_IN";
    JSON_TAGS["JSON_PROPERTY_FUNC_MAP_OUT"] = "JSON_PROPERTY_FUNC_MAP_OUT";
    JSON_TAGS["JSON_PROPERTY_FORCE_BASE_TYPE"] = "JSON_PROPERTY_FORCE_BASE_TYPE";
    JSON_TAGS["JSON_PROPERTY_FORCE_ARRAY"] = "JSON_PROPERTY_FORCE_ARRAY";
    JSON_TAGS["JSON_OBJECT_ON_AFTER_DE_SERIALIZATION"] = "JSON_OBJECT_AFTER_DE_SERIALIZATION";
    JSON_TAGS["JSON_OBJECT_ON_BEFORE_SERIALIZATION"] = "JSON_OBJECT_ON_BEFORE_SERIALIZATION";
})(JSON_TAGS || (exports.JSON_TAGS = JSON_TAGS = {}));
var JSON_BASETYPES;
(function (JSON_BASETYPES) {
    JSON_BASETYPES["string"] = "string";
    JSON_BASETYPES["bool"] = "bool";
    JSON_BASETYPES["number"] = "number";
})(JSON_BASETYPES || (exports.JSON_BASETYPES = JSON_BASETYPES = {}));
