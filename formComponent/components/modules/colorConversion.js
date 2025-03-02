/**
 * @param {array} rgb (example: [255,255,255] or ['255','255','255'])
 * @returns string (example: '#ffffff')
 */
export function RGBToHex(rgb) {
    var r = parseInt(rgb[0])
    var g = parseInt(rgb[1])
    var b = parseInt(rgb[2])

    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return "#" + r + g + b;
}


/**
 * @param {string} hex (example: '#ffffff')
 * @returns array (example: [255,255,255])
 */
export function hexToRGB(hex) {
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (hex.length == 4) {
        r = "0x" + hex[1] + hex[1];
        g = "0x" + hex[2] + hex[2];
        b = "0x" + hex[3] + hex[3];

        // 6 digits
    } else if (hex.length == 7) {
        r = "0x" + hex[1] + hex[2];
        g = "0x" + hex[3] + hex[4];
        b = "0x" + hex[5] + hex[6];
    }

    return [+r,+g,+b];
}


/**
 * @param {array} rgb (example: [255,255,255] or ['255','255','255'])
 * @returns array (example: [0,'0%','100%'])
 */
export function RGBToHSL(rgb) {
    var r = parseInt(rgb[0])
    var g = parseInt(rgb[1])
    var b = parseInt(rgb[2])

    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        
    // Multiply l and s by 100
    s = +(s * 100).toFixed();
    l = +(l * 100).toFixed();

    return [h, s + "%", l + "%"];
}


/**
 * @param {array} hls (example: [0,0,100] or ['0','0%','100%'])
 * @returns array (example: [255,255,255])
 */
export function HSLToRGB(hsl) {
    var h = parseInt(hsl[0])
    var s = parseInt(hsl[1])
    var l = parseInt(hsl[2])

    // Must be fractions of 1
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r,g,b];
}


/**
 * @param {array} rgb (example: ['255','255','255'])
 * @returns true or false
 */
export function isRGBColor(rgb) {
    var r = parseInt(rgb[0])
    var g = parseInt(rgb[1])
    var b = parseInt(rgb[2])

    if (r <= 255 && g <= 255 && b <= 255) {
        return true
    } else {
        return false
    }
}


/**
 * @param {array} hsl (example: ['0','0%','100%'])
 * @returns true or false
 */
export function isHSLColor(hsl) {
    var h = parseInt(hsl[0])
    var s = parseInt(hsl[1])
    var l = parseInt(hsl[2])

    if (h <= 360 && s <= 100 && l <= 100) {
        return true
    } else {
        return false
    }
}