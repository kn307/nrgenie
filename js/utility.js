//http://stackoverflow.com/a/3426956
function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

//http://stackoverflow.com/a/13542669
function shadeBlendConvert(p, from, to) {
    if (typeof(p) != "number" || p < -1 || p > 1 || typeof(from) != "string" || (from[0] != 'r' && from[0] != '#') || (typeof(to) != "string" && typeof(to) != "undefined"))return null; //ErrorCheck
    if (!this.sbcRip)this.sbcRip = function (d) {
        var l = d.length, RGB = new Object();
        if (l > 9) {
            d = d.split(",");
            if (d.length < 3 || d.length > 4)return null;//ErrorCheck
            RGB[0] = i(d[0].slice(4)), RGB[1] = i(d[1]), RGB[2] = i(d[2]), RGB[3] = d[3] ? parseFloat(d[3]) : -1;
        } else {
            if (l == 8 || l == 6 || l < 4)return null; //ErrorCheck
            if (l < 6)d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (l > 4 ? d[4] + "" + d[4] : ""); //3 digit
            d = i(d.slice(1), 16), RGB[0] = d >> 16 & 255, RGB[1] = d >> 8 & 255, RGB[2] = d & 255, RGB[3] = l == 9 || l == 5 ? r(((d >> 24 & 255) / 255) * 10000) / 10000 : -1;
        }
        return RGB;
    }
    var i = parseInt, r = Math.round, h = from.length > 9, h = typeof(to) == "string" ? to.length > 9 ? true : to == "c" ? !h : false : h, b = p < 0, p = b ? p * -1 : p, to = to && to != "c" ? to : b ? "#000000" : "#FFFFFF", f = sbcRip(from), t = sbcRip(to);
    if (!f || !t)return null; //ErrorCheck
    if (h)return "rgb(" + r((t[0] - f[0]) * p + f[0]) + "," + r((t[1] - f[1]) * p + f[1]) + "," + r((t[2] - f[2]) * p + f[2]) + (f[3] < 0 && t[3] < 0 ? ")" : "," + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000 : t[3] < 0 ? f[3] : t[3]) + ")");
    else return "#" + (0x100000000 + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 255) : t[3] > -1 ? r(t[3] * 255) : f[3] > -1 ? r(f[3] * 255) : 255) * 0x1000000 + r((t[0] - f[0]) * p + f[0]) * 0x10000 + r((t[1] - f[1]) * p + f[1]) * 0x100 + r((t[2] - f[2]) * p + f[2])).toString(16).slice(f[3] > -1 || t[3] > -1 ? 1 : 3);
}

// http://stackoverflow.com/a/21648508
/*function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
}*/

function hexToRgbA(hex,opacity){
    hex = hex.replace('#','');
    var r = parseInt(hex.substring(0, hex.length/3), 16);
    var g = parseInt(hex.substring(hex.length/3, 2*hex.length/3), 16);
    var b = parseInt(hex.substring(2*hex.length/3, 3*hex.length/3), 16);

    var result = 'rgba('+r+','+g+','+b+','+opacity+')';
    return result;
}

function getResourceIcon(resourceType) {
    switch(resourceType) {
        case "Oil":
            return "images/oilIcon.png";
        case "Wind":
            return "images/windIcon.png";
        case "Gas":
            return "images/gasIcon.png";
    }
}