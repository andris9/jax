var fs = require("fs");

module.exports = jax;

/**
 * Converts JSON to XML. Expects $t for text tags. First root object
 * is used as the XML root, other objects are discarded. 
 * 
 * @param {Object|String} JSON string or an object to be converted to XML
 * @return {String} XML output
 */
function jax(object){
    var rootElement,
        headParams = [],
        xml = "";

    if(typeof object == "string"){
        object = JSON.parse(object);
    }

    Object.keys(object).forEach(function(key){
        if(typeof object[key] != "object"){
            headParams.push(key.replace(/[\$]/g, ":")+'="'+escapeValue(object[key])+'"');
        }else{
            rootElement = {name: key, content: object[key]};
        }    
    });

    xml += "<?xml "+headParams.join(" ")+"?>";
    if(rootElement){
        xml += drawBranch(rootElement.name, rootElement.content);
    }

    return xml;
}

/**
 * Draws XML for a branch object, recursive function
 * 
 * @param {Object|String} Object to be converted to XML
 * @return {String} XML output
 */
function drawBranch(name, object, level){
    name = (name || "").replace(/[\$]/g, ":");
    level = level || 0;
    var branches = [], params = [], start, end;
    Object.keys(object).forEach(function(key){
        if(Array.isArray(object[key])){
            object[key].forEach(function(elm){
                branches.push(drawBranch(key, elm, level + 1));
            });
        }else if(typeof object[key] == "object"){
            branches.push(drawBranch(key, object[key], level + 1));
        }else if(key != "$t"){
            params.push(key.replace(/[\$]/g, ":")+'="'+escapeValue(object[key])+'"')
        }
    });
    
    if(object.$t){
        branches.unshift(escapeText(object.$t));
    }

    if(branches.length){
        start = "<" + name + (params.length?" "+params.join(" "):"") + ">";
        end = "</" + name + ">";
    }else{
        start = "<" + name + (params.length?" "+params.join(" "):"") + "/>";
        end = "";
    }
    return start + branches.join("") + end;
    
}

/**
 * Escapes text values ($t)
 *
 * @param {String} str String value to be escaped
 */
function escapeText(str){
    str = (str || "").toString().trim().
        replace(/&/g,"&amp;").
        replace(/</g,"&lt;").
        replace(/>/g,"&gt;");

    return str;
}

/**
 * Escapes attribute values
 *
 * @param {String} str String value to be escaped
 */
function escapeValue(str){
    str = (str || "").toString().trim().
        replace(/&/g,"&amp;").
        replace(/"/g,"&quot;").
        replace(/</g,"&lt;").
        replace(/>/g,"&gt;");

    return str;
}

