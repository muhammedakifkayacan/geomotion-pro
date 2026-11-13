/**
 * OpenGeoLayers 3 Pro v4.5 — Authentic GEOlayers 3 ExtendScript Host Engine
 * Compatible with ALL Adobe After Effects Versions (CC 2014 - 2027+)
 *
 * Key Upgrades in v4.5:
 *   1. Fixes 3D Plane Slicing & Venetian-Blind Tile Orientation Bug:
 *      - Resets Orientation=[0,0,0] and X/Y/Z Rotation=0 on every layer parented to GEO_WORLD_ANCHOR
 *      - Converts MAPCOMP_BASE_CANVAS to a 2D Backdrop Layer at the bottom of the stack
 *        so it can NEVER intersect or slice through tilted 3D map layers in Classic 3D or Advanced 3D!
 *   2. Seamless Full-Frame Stitched Atlas Support (2304x1792 px + Horizon Base Atlas):
 *      - Eliminates 256x256 tile seams, gaps, and small 768x768 patches
 *   3. Binary Magic Byte Validator (\x89PNG vs \xFF\xD8\xFF JPEG) to prevent 5027 :: 12
 */

/* eslint-disable no-var, vars-on-top */

if (typeof JSON === "undefined") {
    JSON = {};
}
(function () {
    "use strict";
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var gap, indent, meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", "\"": "\\\"", "\\": "\\\\" }, rep;
    function quote(s) {
        escapable.lastIndex = 0;
        return escapable.test(s) ? "\"" + s.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + "\"" : "\"" + s + "\"";
    }
    function str(key, holder) {
        var i, k, v, length, mind = gap, partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") value = value.toJSON(key);
        if (typeof rep === "function") value = rep.call(holder, key, value);
        switch (typeof value) {
        case "string": return quote(value);
        case "number": return isFinite(value) ? String(value) : "null";
        case "boolean":
        case "null": return String(value);
        case "object":
            if (!value) return "null";
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === "[object Array]") {
                length = value.length;
                for (i = 0; i < length; i += 1) partial[i] = str(i, value) || "null";
                v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }
            for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                    v = str(k, value);
                    if (v) partial.push(quote(k) + (gap ? ": " : ":") + v);
                }
            }
            v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }
    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function (value, replacer, space) {
            var i; gap = ""; indent = "";
            if (typeof space === "number") { for (i = 0; i < space; i += 1) indent += " "; }
            else if (typeof space === "string") { indent = space; }
            rep = replacer;
            return str("", { "": value });
        };
    }
    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text) {
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            return eval("(" + text + ")");
        };
    }
})();

var GeoMotionHost = (function () {
    "use strict";

    function hexToRgb(hex) {
        var clean = String(hex || "#38bdf8").replace("#", "");
        if (clean.length === 3) {
            clean = clean.charAt(0) + clean.charAt(0) + clean.charAt(1) + clean.charAt(1) + clean.charAt(2) + clean.charAt(2);
        }
        var num = parseInt(clean, 16);
        if (isNaN(num)) return [0.22, 0.74, 0.97];
        return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
    }

    function rgbToHex(rgb) {
        if (!rgb || rgb.length < 3) return "#0b1120";
        function c(v) {
            var hex = Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }
        return "#" + c(rgb[0]) + c(rgb[1]) + c(rgb[2]);
    }

    function getAllProjectMapcompNames() {
        var names = [];
        if (!app.project) return names;
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (item instanceof CompItem) {
                var isGeo = false;
                if (item.name.indexOf("Mapcomp") === 0) isGeo = true;
                for (var l = 1; l <= item.numLayers; l++) {
                    var ln = item.layer(l).name;
                    if (ln === "MAP_CAMERA_CONTROLLER" || ln === "GEO_MAPCOMP_CONTROL" || ln === "MAP_WORLD_ANCHOR" || ln === "GEO_WORLD_ANCHOR") {
                        isGeo = true;
                        break;
                    }
                }
                if (isGeo) names.push(item.name);
            }
        }
        return names;
    }

    function latLonToCompXY(lat, lon, centerLat, centerLon, zoom, compW, compH) {
        var scale = 256 * Math.pow(2, zoom);
        function px(lo) { return (lo + 180.0) / 360.0 * scale; }
        function py(la) {
            var s = Math.sin(la * Math.PI / 180.0);
            s = Math.min(Math.max(s, -0.9999), 0.9999);
            return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * scale;
        }
        return [
            (compW / 2.0) + (px(lon) - px(centerLon)),
            (compH / 2.0) + (py(lat) - py(centerLat))
        ];
    }

    function applyEasyEase(prop) {
        try {
            var easeIn = new KeyframeEase(0, 75);
            var easeOut = new KeyframeEase(0, 75);
            for (var k = 1; k <= prop.numKeys; k++) {
                try {
                    prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
                } catch (eInterp) {}
                if (prop.propertyValueType === PropertyValueType.OneD) {
                    prop.setTemporalEaseAtKey(k, [easeIn], [easeOut]);
                } else if (prop.propertyValueType === PropertyValueType.TwoD) {
                    prop.setTemporalEaseAtKey(k, [easeIn, easeIn], [easeOut, easeOut]);
                } else if (prop.propertyValueType === PropertyValueType.ThreeD) {
                    prop.setTemporalEaseAtKey(k, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
                }
            }
        } catch (e) {}
    }

    function addOrGetSlider(layer, sliderName, defaultVal) {
        var fxGroup = layer.property("ADBE Effect Parade");
        var existing = fxGroup.property(sliderName);
        if (existing) return existing.property(1);
        var slider = fxGroup.addProperty("ADBE Slider Control");
        slider.name = sliderName;
        slider.property(1).setValue(defaultVal);
        return slider.property(1);
    }

    /**
     * Attaches a 3D layer to GEO_WORLD_ANCHOR and zeroes out AE's automatic
     * parent-compensation Orientation ([325, 0, 0]) so the layer lies 100% flat
     * and coplanar on the tilted 3D map plane!
     */
    function attachCoplanarToAnchor(layer, anchorLayer, posArray, scaleArray) {
        layer.threeDLayer = true;
        layer.parent = anchorLayer;
        try {
            if (anchorLayer && anchorLayer.motionBlur) {
                layer.motionBlur = true;
            }
        } catch (eMb) {}
        var tr = layer.property("Transform");
        try {
            if (tr.property("Orientation")) tr.property("Orientation").setValue([0, 0, 0]);
            if (tr.property("X Rotation")) tr.property("X Rotation").setValue(0);
            if (tr.property("Y Rotation")) tr.property("Y Rotation").setValue(0);
            if (tr.property("Z Rotation")) tr.property("Z Rotation").setValue(0);
        } catch (e) {}
        if (posArray) {
            tr.property("Position").setValue(posArray);
        }
        if (scaleArray) {
            tr.property("Scale").setValue(scaleArray);
        }
    }

    function validateAndPrepareTileFile(rawPath) {
        try {
            var f = new File(rawPath);
            if (!f.exists || f.length < 128) {
                return null;
            }
            f.encoding = "BINARY";
            if (!f.open("r")) {
                return null;
            }
            var header = f.read(8);
            f.close();
            if (!header || header.length < 4) {
                return null;
            }

            var b0 = header.charCodeAt(0) & 0xFF;
            var b1 = header.charCodeAt(1) & 0xFF;
            var b2 = header.charCodeAt(2) & 0xFF;
            var b3 = header.charCodeAt(3) & 0xFF;

            var isPng = (b0 === 0x89 && b1 === 0x50 && b2 === 0x4E && b3 === 0x47);
            var isJpg = (b0 === 0xFF && b1 === 0xD8 && b2 === 0xFF);

            if (!isPng && !isJpg) {
                return null;
            }

            var lowerPath = String(rawPath).toLowerCase();
            if (isJpg && lowerPath.indexOf(".png") !== -1) {
                var jpgPath = String(rawPath).replace(/\.png$/i, ".jpg");
                var jpgFile = new File(jpgPath);
                f.copy(jpgFile);
                return jpgFile.exists ? jpgFile : null;
            }
            if (isPng && (lowerPath.indexOf(".jpg") !== -1 || lowerPath.indexOf(".jpeg") !== -1)) {
                var pngPath = String(rawPath).replace(/\.jpe?g$/i, ".png");
                var pngFile = new File(pngPath);
                f.copy(pngFile);
                return pngFile.exists ? pngFile : null;
            }

            return f;
        } catch (err) {
            return null;
        }
    }

    function ensureMapcompRig(comp, viewData) {
        viewData = viewData || {};
        var initLat = (viewData.centerLat !== undefined) ? parseFloat(viewData.centerLat) : 39.9255;
        var initLon = (viewData.centerLon !== undefined) ? parseFloat(viewData.centerLon) : 32.8663;
        var initZoom = (viewData.zoom !== undefined) ? Math.max(2.8, parseFloat(viewData.zoom)) : 6.0;
        var initPitch = (viewData.pitch !== undefined) ? parseFloat(viewData.pitch) : 35.0;
        var initBearing = (viewData.bearing !== undefined) ? parseFloat(viewData.bearing) : 0.0;

        // Clean up any legacy v3.0 layers that could slice 3D space
        for (var cIdx = comp.numLayers; cIdx >= 1; cIdx--) {
            var oldName = comp.layer(cIdx).name;
            if (oldName === "GEO_BASE_OCEAN" || oldName === "GEO_MAP_CONTROLLER" || oldName === "GEO_LATLON_GRID") {
                comp.layer(cIdx).remove();
            }
        }

        var ctrlLayer = null;
        var anchorLayer = null;
        var camLayer = null;
        var bgCanvasLayer = null;

        for (var i = 1; i <= comp.numLayers; i++) {
            var lyr = comp.layer(i);
            if (lyr.name === "MAP_CAMERA_CONTROLLER" || lyr.name === "GEO_MAPCOMP_CONTROL") {
                ctrlLayer = lyr;
                ctrlLayer.name = "MAP_CAMERA_CONTROLLER";
            }
            if (lyr.name === "MAP_WORLD_ANCHOR" || lyr.name === "GEO_WORLD_ANCHOR") {
                anchorLayer = lyr;
                anchorLayer.name = "MAP_WORLD_ANCHOR";
            }
            if ((lyr.name === "MAP_3D_CAMERA" || lyr.name === "GEO_MAPCOMP_CAMERA") && lyr instanceof CameraLayer) {
                camLayer = lyr;
                camLayer.name = "MAP_3D_CAMERA";
            }
            if (lyr.name === "MAP_BACKGROUND_CANVAS" || lyr.name === "MAPCOMP_BASE_CANVAS") {
                bgCanvasLayer = lyr;
                bgCanvasLayer.name = "MAP_BACKGROUND_CANVAS";
            }
        }

        if (!ctrlLayer) {
            ctrlLayer = comp.layers.addNull();
            ctrlLayer.name = "MAP_CAMERA_CONTROLLER";
            ctrlLayer.label = 13; // Yellow / Gold in After Effects
            ctrlLayer.comment = "Animate Camera & Map movement here (Latitude, Longitude, Zoom, Pitch, Bearing)";
            ctrlLayer.guideLayer = true;
            ctrlLayer.threeDLayer = true;
            ctrlLayer.property("Position").setValue([comp.width / 2, comp.height / 2, 0]);
            ctrlLayer.property("Opacity").setValue(0);
        } else {
            ctrlLayer.name = "MAP_CAMERA_CONTROLLER";
            ctrlLayer.comment = "Animate Camera & Map movement here (Latitude, Longitude, Zoom, Pitch, Bearing)";
        }

        addOrGetSlider(ctrlLayer, "Mapcomp Latitude", initLat);
        addOrGetSlider(ctrlLayer, "Mapcomp Longitude", initLon);
        addOrGetSlider(ctrlLayer, "Mapcomp Zoom", initZoom);
        addOrGetSlider(ctrlLayer, "Mapcomp Pitch", initPitch);
        addOrGetSlider(ctrlLayer, "Mapcomp Bearing", initBearing);
        addOrGetSlider(ctrlLayer, "Reference Lat", initLat);
        addOrGetSlider(ctrlLayer, "Reference Lon", initLon);
        addOrGetSlider(ctrlLayer, "Reference Zoom", initZoom);

        if (!anchorLayer) {
            anchorLayer = comp.layers.addNull();
            anchorLayer.name = "MAP_WORLD_ANCHOR";
            anchorLayer.label = 14; // Lavender
            anchorLayer.comment = "Internal 3D Coordinate Anchor (Parent for all map layers)";
            anchorLayer.guideLayer = true;
            anchorLayer.threeDLayer = true;
            anchorLayer.property("Position").setValue([comp.width / 2, comp.height / 2, 0]);
            anchorLayer.property("Opacity").setValue(0);
        } else {
            anchorLayer.name = "MAP_WORLD_ANCHOR";
            anchorLayer.comment = "Internal 3D Coordinate Anchor (Parent for all map layers)";
        }

        // Always keep MAP_WORLD_ANCHOR expressions up to date:
        // 1) Scale Z stays at 100% ([s, s, 100]) so Z-offsets never get multiplied by 512x at Zoom 15!
        anchorLayer.property("Transform").property("Scale").expression = [
            "function getCtrl(){ try { return thisComp.layer('MAP_CAMERA_CONTROLLER'); } catch(e){ return thisComp.layer('GEO_MAPCOMP_CONTROL'); } }",
            "var ctrl = getCtrl();",
            "var z = Math.max(2.8, ctrl.effect('Mapcomp Zoom')('Slider'));",
            "var refZ = ctrl.effect('Reference Zoom')('Slider');",
            "var s = 100 * Math.pow(2, z - refZ);",
            "[s, s, 100];"
        ].join("\n");

        anchorLayer.property("Transform").property("X Rotation").expression = [
            "function getCtrl(){ try { return thisComp.layer('MAP_CAMERA_CONTROLLER'); } catch(e){ return thisComp.layer('GEO_MAPCOMP_CONTROL'); } }",
            "getCtrl().effect('Mapcomp Pitch')('Slider');"
        ].join("\n");

        anchorLayer.property("Transform").property("Z Rotation").expression = [
            "function getCtrl(){ try { return thisComp.layer('MAP_CAMERA_CONTROLLER'); } catch(e){ return thisComp.layer('GEO_MAPCOMP_CONTROL'); } }",
            "getCtrl().effect('Mapcomp Bearing')('Slider');"
        ].join("\n");

        // 2) Exponential Zoom-Synchronized Panning (Van Wijk & Nuij / GEOlayers 3 trajectory):
        //    When zooming between two keyframes with different zoom levels, pans smoothly in
        //    proportion to the current field of view (2^-z) so the camera zooms out from the
        //    origin keyframe before sweeping across the map!
        anchorLayer.property("Transform").property("Anchor Point").expression = [
            "function getCtrl(){ try { return thisComp.layer('MAP_CAMERA_CONTROLLER'); } catch(e){ return thisComp.layer('GEO_MAPCOMP_CONTROL'); } }",
            "var ctrl = getCtrl();",
            "var latP = ctrl.effect('Mapcomp Latitude')('Slider');",
            "var lonP = ctrl.effect('Mapcomp Longitude')('Slider');",
            "var zP = ctrl.effect('Mapcomp Zoom')('Slider');",
            "var refLat = ctrl.effect('Reference Lat')('Slider');",
            "var refLon = ctrl.effect('Reference Lon')('Slider');",
            "var refZ = ctrl.effect('Reference Zoom')('Slider');",
            "var lat = latP.value;",
            "var lon = lonP.value;",
            "if (zP.numKeys >= 2 && latP.numKeys >= 2 && lonP.numKeys >= 2) {",
            "    var nk = zP.nearestKey(time);",
            "    var k1 = (nk.time <= time) ? nk.index : Math.max(1, nk.index - 1);",
            "    var k2 = Math.min(zP.numKeys, k1 + 1);",
            "    if (k1 !== k2) {",
            "        var t1 = zP.key(k1).time;",
            "        var t2 = zP.key(k2).time;",
            "        if (time > t1 && time < t2) {",
            "            var z1 = zP.key(k1).value;",
            "            var z2 = zP.key(k2).value;",
            "            var zCur = Math.max(2.8, zP.value);",
            "            if (Math.abs(z1 - z2) > 1.2) {",
            "                var s1 = Math.pow(2, -z1);",
            "                var s2 = Math.pow(2, -z2);",
            "                var sCur = Math.pow(2, -zCur);",
            "                var w = Math.min(1, Math.max(0, (sCur - s1) / (s2 - s1)));",
            "                var la1 = latP.valueAtTime(t1);",
            "                var la2 = latP.valueAtTime(t2);",
            "                var lo1 = lonP.valueAtTime(t1);",
            "                var lo2 = lonP.valueAtTime(t2);",
            "                lat = la1 + (la2 - la1) * w;",
            "                lon = lo1 + (lo2 - lo1) * w;",
            "            }",
            "        }",
            "    }",
            "}",
            "var scale = 256 * Math.pow(2, refZ);",
            "function px(lo){ return (lo + 180.0) / 360.0 * scale; }",
            "function py(la){ var s = Math.sin(la * Math.PI / 180.0); s = Math.min(Math.max(s, -0.9999), 0.9999); return (0.5 - Math.log((1+s)/(1-s)) / (4 * Math.PI)) * scale; }",
            "var dx = px(lon) - px(refLon);",
            "var dy = py(lat) - py(refLat);",
            "[(thisComp.width / 2) + dx, (thisComp.height / 2) + dy, 0];"
        ].join("\n");

        if (!camLayer) {
            camLayer = comp.layers.addCamera("MAP_3D_CAMERA", [comp.width / 2, comp.height / 2]);
            camLayer.comment = "3D Camera for Mapcomp";
            camLayer.property("Position").setValue([comp.width / 2, comp.height / 2, -1866.0]);
            camLayer.property("Point of Interest").setValue([comp.width / 2, comp.height / 2, 0]);
        } else {
            camLayer.name = "MAP_3D_CAMERA";
        }

        // Ensure MAP_BACKGROUND_CANVAS is a pure 2D backdrop layer near the bottom of the layer stack
        // so it can NEVER slice through tilted 3D layers!
        if (!bgCanvasLayer) {
            bgCanvasLayer = comp.layers.addSolid(
                hexToRgb(viewData.bgColor || "#0b1120"),
                "MAP_BACKGROUND_CANVAS",
                comp.width,
                comp.height,
                1.0
            );
            bgCanvasLayer.comment = "2D Background Canvas (Solid Color)";
        } else {
            bgCanvasLayer.name = "MAP_BACKGROUND_CANVAS";
        }
        }
        bgCanvasLayer.parent = null;
        bgCanvasLayer.threeDLayer = false;
        bgCanvasLayer.property("Position").setValue([comp.width / 2, comp.height / 2]);
        bgCanvasLayer.property("Scale").setValue([100, 100]);
        bgCanvasLayer.moveToEnd();

        // Apply Composition & Layer Motion Blur
        var enableMotionBlur = (viewData.motionBlur !== false);
        try {
            comp.motionBlur = enableMotionBlur;
            if (anchorLayer) anchorLayer.motionBlur = enableMotionBlur;
            if (viewData.shutterAngle) {
                comp.shutterAngle = parseFloat(viewData.shutterAngle);
            }
            if (viewData.shutterPhase) {
                comp.shutterPhase = parseFloat(viewData.shutterPhase);
            }
        } catch (eMbComp) {}

        return {
            controller: ctrlLayer,
            anchor: anchorLayer,
            camera: camLayer,
            bgCanvas: bgCanvasLayer,
            refLat: ctrlLayer.property("ADBE Effect Parade").property("Reference Lat").property(1).value,
            refLon: ctrlLayer.property("ADBE Effect Parade").property("Reference Lon").property(1).value,
            refZoom: ctrlLayer.property("ADBE Effect Parade").property("Reference Zoom").property(1).value
        };
    }

    function getOrCreateActiveGeoComp(options) {
        options = options || {};
        var compName = options.compName || "Mapcomp 1";
        var width = parseInt(options.width, 10) || 1920;
        var height = parseInt(options.height, 10) || 1080;
        var duration = parseFloat(options.duration) || 15.0;
        var fps = parseFloat(options.fps) || 30.0;

        var active = app.project.activeItem;
        if (active && active instanceof CompItem) {
            return active;
        }
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (item instanceof CompItem && item.name === compName) {
                item.openInViewer();
                return item;
            }
        }
        var newComp = app.project.items.addComp(compName, width, height, 1.0, duration, fps);
        newComp.openInViewer();
        return newComp;
    }

    function ensureMapAttribution(comp, attributionText) {
        var attrName = "MAP_ATTRIBUTION_CREDIT";
        var existing = null;
        for (var i = 1; i <= comp.numLayers; i++) {
            var lName = comp.layer(i).name;
            if (lName === "MAP_ATTRIBUTION_CREDIT" || lName === "GEO_MAP_ATTRIBUTION") {
                existing = comp.layer(i);
                existing.name = "MAP_ATTRIBUTION_CREDIT";
                break;
            }
        }
        var txt = attributionText || "© OpenStreetMap contributors • CARTO • Esri";
        if (!existing) {
            existing = comp.layers.addText(txt);
            existing.name = attrName;
            existing.comment = "Map Data Attribution Credit";
            existing.label = 8;
        }
        var srcProp = existing.property("Source Text");
        var doc = srcProp.value;
        doc.text = txt;
        doc.fontSize = 14;
        doc.fillColor = [0.75, 0.8, 0.88];
        doc.justification = ParagraphJustification.LEFT_JUSTIFY;
        srcProp.setValue(doc);
        existing.property("Transform").property("Position").setValue([24, comp.height - 20]);
        existing.property("Transform").property("Opacity").setValue(65);
        existing.moveToBeginning();
    }

    return {
        getHostStatus: function () {
            try {
                var active = app.project ? app.project.activeItem : null;
                var hasComp = (active && active instanceof CompItem);
                var currentTime = hasComp ? active.time.toFixed(2) + "s" : "0.00s";
                return JSON.stringify({
                    ok: true,
                    aeVersion: app.version,
                    hasActiveComp: hasComp,
                    compName: hasComp ? active.name : "Mapcomp 1",
                    cti: currentTime,
                    motionBlur: hasComp ? active.motionBlur : true
                });
            } catch (err) {
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        setMapcompMotionBlur: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Toggle Motion Blur");
            try {
                var data = JSON.parse(payloadJson || "{}");
                var comp = getOrCreateActiveGeoComp(data);
                var enabled = (data.motionBlur !== false && data.enabled !== false);
                comp.motionBlur = enabled;
                if (data.shutterAngle) {
                    try { comp.shutterAngle = parseFloat(data.shutterAngle); } catch (e) {}
                }
                if (data.shutterPhase) {
                    try { comp.shutterPhase = parseFloat(data.shutterPhase); } catch (e) {}
                }
                for (var i = 1; i <= comp.numLayers; i++) {
                    var l = comp.layer(i);
                    var nm = l.name;
                    if (nm.indexOf("MAP_TILES_") === 0 || nm.indexOf("MAPCOMP_ATLAS_") === 0 || nm === "MAP_WORLD_ANCHOR" || nm === "GEO_WORLD_ANCHOR" || nm.indexOf("BOUNDARY_") === 0 || nm.indexOf("FEATURE_") === 0 || nm.indexOf("ROUTE_") === 0 || nm.indexOf("PIN_") === 0 || nm.indexOf("LABEL_") === 0) {
                        try { l.motionBlur = enabled; } catch (e2) {}
                    }
                }
                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    motionBlur: enabled,
                    message: "Motion Blur " + (enabled ? "Etkinleştirildi (Açık)" : "Devre Dışı Bırakıldı (Kapalı)")
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        getMapcompViewsForFinalize: function (payloadJson) {
            try {
                var data = JSON.parse(payloadJson || "{}");
                var active = app.project ? app.project.activeItem : null;
                var curLat = parseFloat(data.centerLat) || 39.9255;
                var curLon = parseFloat(data.centerLon) || 32.8663;
                var curZoom = Math.min(18, Math.max(3, Math.round(parseFloat(data.zoom) || 6)));

                var views = [];

                function toTileXY(lat, lon, z) {
                    var n = Math.pow(2, z);
                    var x = Math.floor((lon + 180.0) / 360.0 * n);
                    var latRad = lat * Math.PI / 180.0;
                    var y = Math.floor((1.0 - Math.log(Math.tan(latRad) + 1.0 / Math.cos(latRad)) / Math.PI) / 2.0 * n);
                    return { x: x, y: y };
                }

                function addUniqueView(lat, lon, z, role, timeSec) {
                    var clampedZ = Math.min(18, Math.max(2, Math.round(z)));
                    var txy = toTileXY(lat, lon, clampedZ);
                    for (var i = 0; i < views.length; i++) {
                        var ex = views[i];
                        if (ex.zoom === clampedZ && ex.role !== "HORIZON_BASE" && role !== "HORIZON_BASE") {
                            var exTxy = toTileXY(ex.lat, ex.lon, clampedZ);
                            // A 9x7 stitched atlas covers +-4 tiles in X and +-3 tiles in Y.
                            // If two views at the same zoom are within 1 tile in X and Y, merge/center them!
                            if (Math.abs(exTxy.x - txy.x) <= 1 && Math.abs(exTxy.y - txy.y) <= 1) {
                                return;
                            }
                        }
                    }
                    views.push({
                        lat: lat,
                        lon: lon,
                        zoom: clampedZ,
                        role: role || "DETAIL",
                        time: (timeSec !== undefined) ? Number(timeSec.toFixed(2)) : 0
                    });
                }

                // Evaluates the exact camera Lat/Lon/Zoom at time t, matching GEO_WORLD_ANCHOR's
                // exponential zoom-synchronized panning trajectory!
                function evalEffectiveViewAtTime(latProp, lonProp, zoomProp, t) {
                    var lat = latProp.valueAtTime(t, false);
                    var lon = lonProp.valueAtTime(t, false);
                    var zCur = zoomProp.valueAtTime(t, false);

                    if (zoomProp.numKeys >= 2 && latProp.numKeys >= 2 && lonProp.numKeys >= 2) {
                        var nk = zoomProp.nearestKeyIndex(t);
                        var k1 = (zoomProp.keyTime(nk) <= t) ? nk : Math.max(1, nk - 1);
                        var k2 = Math.min(zoomProp.numKeys, k1 + 1);
                        if (k1 !== k2) {
                            var t1 = zoomProp.keyTime(k1);
                            var t2 = zoomProp.keyTime(k2);
                            if (t > t1 && t < t2) {
                                var z1 = zoomProp.keyValue(k1);
                                var z2 = zoomProp.keyValue(k2);
                                if (Math.abs(z1 - z2) > 1.2) {
                                    var s1 = Math.pow(2, -z1);
                                    var s2 = Math.pow(2, -z2);
                                    var sCur = Math.pow(2, -zCur);
                                    var w = Math.min(1, Math.max(0, (sCur - s1) / (s2 - s1)));
                                    var la1 = latProp.valueAtTime(t1, false);
                                    var la2 = latProp.valueAtTime(t2, false);
                                    var lo1 = lonProp.valueAtTime(t1, false);
                                    var lo2 = lonProp.valueAtTime(t2, false);
                                    lat = la1 + (la2 - la1) * w;
                                    lon = lo1 + (lo2 - lo1) * w;
                                }
                            }
                        }
                    }
                    return { lat: lat, lon: lon, zoom: zCur };
                }

                if (active && active instanceof CompItem) {
                    var ctrlLayer = null;
                    for (var i = 1; i <= active.numLayers; i++) {
                        var lName = active.layer(i).name;
                        if (lName === "MAP_CAMERA_CONTROLLER" || lName === "GEO_MAPCOMP_CONTROL") {
                            ctrlLayer = active.layer(i);
                            break;
                        }
                    }

                    if (ctrlLayer) {
                        // Ensure GEO_WORLD_ANCHOR expressions are upgraded before finalizing
                        ensureMapcompRig(active, data);

                        var fx = ctrlLayer.property("ADBE Effect Parade");
                        var latProp = fx.property("Mapcomp Latitude").property(1);
                        var lonProp = fx.property("Mapcomp Longitude").property(1);
                        var zoomProp = fx.property("Mapcomp Zoom").property(1);

                        var totalKeys = Math.max(latProp.numKeys, Math.max(lonProp.numKeys, zoomProp.numKeys));

                        if (totalKeys > 0) {
                            // 1. Collect all unique keyframe timestamps across Lat, Lon, and Zoom
                            var rawTimes = [];
                            var propList = [latProp, lonProp, zoomProp];
                            for (var p = 0; p < propList.length; p++) {
                                var pr = propList[p];
                                for (var k = 1; k <= pr.numKeys; k++) {
                                    rawTimes.push(pr.keyTime(k));
                                }
                            }
                            rawTimes.sort(function (a, b) { return a - b; });

                            var keyTimes = [];
                            for (var rt = 0; rt < rawTimes.length; rt++) {
                                if (keyTimes.length === 0 || Math.abs(rawTimes[rt] - keyTimes[keyTimes.length - 1]) > 0.02) {
                                    keyTimes.push(rawTimes[rt]);
                                }
                            }

                            // 2. Add every Keyframe view FIRST (100% priority regardless of where CTI is!)
                            for (var kt = 0; kt < keyTimes.length; kt++) {
                                var kv = evalEffectiveViewAtTime(latProp, lonProp, zoomProp, keyTimes[kt]);
                                addUniqueView(kv.lat, kv.lon, Math.round(kv.zoom), "KEYFRAME", keyTimes[kt]);
                            }

                            // 3. Sample transitions between consecutive keyframes [tA -> tB]
                            for (var seg = 0; seg < keyTimes.length - 1; seg++) {
                                var tA = keyTimes[seg];
                                var tB = keyTimes[seg + 1];
                                var zA = Math.round(zoomProp.valueAtTime(tA, false));
                                var zB = Math.round(zoomProp.valueAtTime(tB, false));
                                var sampleSteps = 32;
                                for (var s = 1; s < sampleSteps; s++) {
                                    var tSample = tA + (tB - tA) * (s / sampleSteps);
                                    var sv = evalEffectiveViewAtTime(latProp, lonProp, zoomProp, tSample);
                                    var rZoom = Math.round(sv.zoom);
                                    // Include every 2-zoom-level step along zoom transitions (e.g. 15 -> 13 -> 11 -> 9 -> 7 -> 6)
                                    // plus the midpoint of any pan or zoom-arc segment
                                    var isEvenZoomStep = (Math.abs(rZoom - zA) >= 2 && Math.abs(rZoom - zB) >= 1 && (Math.abs(rZoom - zA) % 2 === 0));
                                    var isMidpoint = (s === Math.floor(sampleSteps / 2));
                                    if (isEvenZoomStep || isMidpoint) {
                                        addUniqueView(sv.lat, sv.lon, rZoom, "TRANSITION", tSample);
                                    }
                                }
                            }
                        } else {
                            // No keyframes: use controller's static view
                            curLat = latProp.value;
                            curLon = lonProp.value;
                            curZoom = Math.min(18, Math.max(3, Math.round(zoomProp.value)));
                            addUniqueView(curLat, curLon, curZoom, "DETAIL", active.time);
                        }
                    }
                }

                if (views.length === 0) {
                    addUniqueView(curLat, curLon, curZoom, "DETAIL", 0);
                }

                // Compute min/max zoom and average center across all collected views
                var minZ = 18;
                var maxZ = 2;
                var sumLat = 0;
                var sumLon = 0;
                for (var vIdx = 0; vIdx < views.length; vIdx++) {
                    var vz = views[vIdx].zoom;
                    if (vz < minZ) minZ = vz;
                    if (vz > maxZ) maxZ = vz;
                    sumLat += views[vIdx].lat;
                    sumLon += views[vIdx].lon;
                }
                var avgLat = sumLat / views.length;
                var avgLon = sumLon / views.length;

                // Mark upper zoom atlases (z > minZ) for soft outer-edge feathering so multi-zoom transitions are 100% seamless
                for (var fIdx = 0; fIdx < views.length; fIdx++) {
                    views[fIdx].featherEdges = (views[fIdx].zoom > minZ);
                }

                // Add Continental / Global Horizon Base Atlas at max(2, minZ - 2)
                var horizonZoom = Math.max(2, minZ - 2);
                if (horizonZoom < minZ) {
                    views.push({
                        lat: avgLat,
                        lon: avgLon,
                        zoom: horizonZoom,
                        role: "HORIZON_BASE",
                        featherEdges: false,
                        time: 0
                    });
                }

                return JSON.stringify({
                    ok: true,
                    keyframeCount: views.length,
                    minZoom: minZ,
                    maxZoom: maxZ,
                    views: views
                });
            } catch (err) {
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        createGeoMapComp: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Create Mapcomp");
            try {
                var data = JSON.parse(payloadJson);
                var comp = app.project.items.addComp(
                    data.compName || "Mapcomp 1",
                    parseInt(data.width, 10) || 1920,
                    parseInt(data.height, 10) || 1080,
                    1.0,
                    parseFloat(data.duration) || 15.0,
                    parseFloat(data.fps) || 30.0
                );
                comp.bgColor = hexToRgb(data.bgColor || "#0b1120");
                comp.openInViewer();

                ensureMapcompRig(comp, data);

                if (data.showAttribution !== false) {
                    ensureMapAttribution(comp, data.attributionText);
                }

                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    compName: comp.name,
                    message: "'" + comp.name + "' oluşturuldu! (Finalize butonuna basarak yüksek çözünürlüklü haritayı işleyebilirsiniz)"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        setMapcompViewKeyframe: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Set Mapcomp View / Keyframe");
            try {
                var data = JSON.parse(payloadJson || "{}");
                var comp = getOrCreateActiveGeoComp(data);
                var rig = ensureMapcompRig(comp, data);
                var ctrl = rig.controller;
                var fx = ctrl.property("ADBE Effect Parade");

                var latProp = fx.property("Mapcomp Latitude").property(1);
                var lonProp = fx.property("Mapcomp Longitude").property(1);
                var zoomProp = fx.property("Mapcomp Zoom").property(1);
                var pitchProp = fx.property("Mapcomp Pitch").property(1);
                var bearingProp = fx.property("Mapcomp Bearing").property(1);

                var lat = (data.centerLat !== undefined) ? parseFloat(data.centerLat) : ((data.lat !== undefined) ? parseFloat(data.lat) : 0);
                var lon = (data.centerLon !== undefined) ? parseFloat(data.centerLon) : ((data.lon !== undefined) ? parseFloat(data.lon) : 0);
                var zoom = Math.max(2.8, Math.min(19.0, (data.zoom !== undefined) ? parseFloat(data.zoom) : ((data.z !== undefined) ? parseFloat(data.z) : 6.0)));
                var pitch = (data.pitch !== undefined) ? parseFloat(data.pitch) : 0;
                var bearing = (data.bearing !== undefined) ? parseFloat(data.bearing) : 0;

                var isExplicitKeyframe = (data.setKeyframe === true || data.isKeyframe === true || data.time !== undefined);
                if (data.setKeyframe === false && data.time === undefined) {
                    isExplicitKeyframe = false;
                }

                if (data.clearOldKeyframes === true) {
                    while (latProp.numKeys > 0) latProp.removeKey(1);
                    while (lonProp.numKeys > 0) lonProp.removeKey(1);
                    while (zoomProp.numKeys > 0) zoomProp.removeKey(1);
                    while (pitchProp.numKeys > 0) pitchProp.removeKey(1);
                    while (bearingProp.numKeys > 0) bearingProp.removeKey(1);
                }

                if (isExplicitKeyframe) {
                    var t = (data.time !== undefined) ? parseFloat(data.time) : comp.time;
                    if (isNaN(t) || t < 0) t = 0;

                    // If setting a keyframe ahead in time (e.g. t = 2.2s) and there are no keyframes yet,
                    // anchor an initial keyframe at t = 0s using current slider values!
                    if (zoomProp.numKeys === 0 && t > 0.05) {
                        var baseLat = latProp.value;
                        var baseLon = lonProp.value;
                        var baseZ = zoomProp.value;
                        var baseP = pitchProp.value;
                        var baseB = bearingProp.value;
                        latProp.setValueAtTime(0, baseLat);
                        lonProp.setValueAtTime(0, baseLon);
                        zoomProp.setValueAtTime(0, baseZ);
                        pitchProp.setValueAtTime(0, baseP);
                        bearingProp.setValueAtTime(0, baseB);
                        applyEasyEase(latProp);
                        applyEasyEase(lonProp);
                        applyEasyEase(zoomProp);
                        applyEasyEase(pitchProp);
                        applyEasyEase(bearingProp);
                    }

                    if (data.autoZoomArc && zoomProp.numKeys >= 1) {
                        var prevK = zoomProp.nearestKeyIndex(t);
                        var prevT = zoomProp.keyTime(prevK);
                        if (Math.abs(t - prevT) > 0.4) {
                            var prevZ = zoomProp.keyValue(prevK);
                            var midT = (prevT + t) / 2.0;
                            var arcDrop = parseFloat(data.arcDrop || 1.8);
                            var midZ = Math.max(2.8, Math.min(prevZ, zoom) - arcDrop);
                            zoomProp.setValueAtTime(midT, midZ);
                        }
                    }

                    latProp.setValueAtTime(t, lat);
                    lonProp.setValueAtTime(t, lon);
                    zoomProp.setValueAtTime(t, zoom);
                    pitchProp.setValueAtTime(t, pitch);
                    bearingProp.setValueAtTime(t, bearing);

                    applyEasyEase(latProp);
                    applyEasyEase(lonProp);
                    applyEasyEase(zoomProp);
                    applyEasyEase(pitchProp);
                    applyEasyEase(bearingProp);

                    try { comp.time = t; } catch (eT) {}

                    app.endUndoGroup();
                    return JSON.stringify({
                        ok: true,
                        keyTime: t.toFixed(2),
                        numKeys: zoomProp.numKeys,
                        message: "CTI (" + t.toFixed(2) + "s) konumuna Mapcomp View Keyframe (◆) eklendi!"
                    });
                } else {
                    if (latProp.numKeys === 0) latProp.setValue(lat);
                    if (lonProp.numKeys === 0) lonProp.setValue(lon);
                    if (zoomProp.numKeys === 0) zoomProp.setValue(zoom);
                    if (pitchProp.numKeys === 0) pitchProp.setValue(pitch);
                    if (bearingProp.numKeys === 0) bearingProp.setValue(bearing);
                    app.endUndoGroup();
                    return JSON.stringify({
                        ok: true,
                        message: "Mapcomp görünümü canlı senkronize edildi."
                    });
                }
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        snapSelectedLayerToMapcomp: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Pin / Snap Layer to Mapcomp");
            try {
                var data = JSON.parse(payloadJson);
                var comp = getOrCreateActiveGeoComp(data);
                var rig = ensureMapcompRig(comp, data);

                var selected = comp.selectedLayers;
                var targetLayer = null;
                if (selected && selected.length > 0 && selected[0] !== rig.controller && selected[0] !== rig.anchor && selected[0] !== rig.bgCanvas) {
                    targetLayer = selected[0];
                } else {
                    targetLayer = comp.layers.addNull();
                    targetLayer.name = "PINNED_LAYER (" + (data.label || "Target") + ")";
                }

                attachCoplanarToAnchor(targetLayer, rig.anchor, null, null);

                addOrGetSlider(targetLayer, "Feature Latitude", parseFloat(data.lat || data.centerLat));
                addOrGetSlider(targetLayer, "Feature Longitude", parseFloat(data.lon || data.centerLon));
                addOrGetSlider(targetLayer, "Altitude Offset (Z)", parseFloat(data.zOffset || -4));

                targetLayer.property("Transform").property("Position").expression = [
                    "function getCtrl(){ try { return thisComp.layer('MAP_CAMERA_CONTROLLER'); } catch(e){ return thisComp.layer('GEO_MAPCOMP_CONTROL'); } }",
                    "var ctrl = getCtrl();",
                    "var refLat = ctrl.effect('Reference Lat')('Slider');",
                    "var refLon = ctrl.effect('Reference Lon')('Slider');",
                    "var refZ = ctrl.effect('Reference Zoom')('Slider');",
                    "var myLat = effect('Feature Latitude')('Slider');",
                    "var myLon = effect('Feature Longitude')('Slider');",
                    "var myZ = effect('Altitude Offset (Z)')('Slider');",
                    "var scale = 256 * Math.pow(2, refZ);",
                    "function px(lo){ return (lo + 180.0) / 360.0 * scale; }",
                    "function py(la){ var s = Math.sin(la * Math.PI / 180.0); s = Math.min(Math.max(s, -0.9999), 0.9999); return (0.5 - Math.log((1+s)/(1-s)) / (4 * Math.PI)) * scale; }",
                    "[(thisComp.width / 2) + (px(myLon) - px(refLon)), (thisComp.height / 2) + (py(myLat) - py(refLat)), myZ];"
                ].join("\n");

                if (data.maintainScale !== false) {
                    targetLayer.property("Transform").property("Scale").expression = [
                        "function getAnchor(){ try { return thisComp.layer('MAP_WORLD_ANCHOR'); } catch(e){ return thisComp.layer('GEO_WORLD_ANCHOR'); } }",
                        "var s = getAnchor().transform.scale[0];",
                        "var inv = 10000 / Math.max(0.001, s);",
                        "[inv, inv, inv];"
                    ].join("\n");
                }

                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    layerName: targetLayer.name,
                    message: "'" + targetLayer.name + "' katmanı coğrafi koordinata sabitlendi!"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        /**
         * Finalize Mapcomp (Seamless Full-Frame Atlas + Horizon Base Pyramid):
         *   - Removes all previous TILE_ and MAPCOMP_ATLAS_ layers cleanly
         *   - Imports seamless stitched 2304x1792 PNG Atlases (Detail + Horizon Base)
         *   - Enforces Orientation=[0,0,0] via attachCoplanarToAnchor so tiles NEVER tilt like Venetian blinds!
         *   - Keeps MAPCOMP_BASE_CANVAS as a 2D layer at the very bottom of the comp
         */
        importMapTileGrid: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Finalize Mapcomp");
            try {
                var data = JSON.parse(payloadJson);
                var comp = getOrCreateActiveGeoComp(data);
                var rig = ensureMapcompRig(comp, data);

                var folderName = "GeoMotion_Finalized_Atlases";
                var tileFolder = null;
                for (var f = 1; f <= app.project.numItems; f++) {
                    if (app.project.item(f) instanceof FolderItem && app.project.item(f).name === folderName) {
                        tileFolder = app.project.item(f);
                        break;
                    }
                }
                if (!tileFolder) tileFolder = app.project.items.addFolder(folderName);

                // Remove old TILE_ or MAPCOMP_ATLAS_ layers before placing fresh finalized atlases
                for (var idx = comp.numLayers; idx >= 1; idx--) {
                    var nm = comp.layer(idx).name;
                    if (nm.indexOf("TILE_") === 0 || nm.indexOf("MAPCOMP_ATLAS_") === 0) {
                        comp.layer(idx).remove();
                    }
                }

                var importedCount = 0;
                var tiles = data.tiles || [];

                // Sort tiles so HIGHER zoom (Detail / Keyframe) is added first and LOWER zoom (Horizon Base) is placed behind it
                tiles.sort(function (a, b) {
                    if (a.role === "HORIZON_BASE" && b.role !== "HORIZON_BASE") return 1;
                    if (b.role === "HORIZON_BASE" && a.role !== "HORIZON_BASE") return -1;
                    return (parseFloat(b.z) || 0) - (parseFloat(a.z) || 0);
                });

                var maxTileZoom = 2;
                var minDetailZoom = 18;
                for (var m = 0; m < tiles.length; m++) {
                    var tz = parseFloat(tiles[m].z) || 6;
                    if (tz > maxTileZoom) maxTileZoom = tz;
                    if (tiles[m].role !== "HORIZON_BASE" && tz < minDetailZoom) {
                        minDetailZoom = tz;
                    }
                }
                if (minDetailZoom > maxTileZoom) minDetailZoom = maxTileZoom;

                for (var i = 0; i < tiles.length; i++) {
                    var t = tiles[i];
                    var validFile = validateAndPrepareTileFile(t.filePath);
                    if (!validFile) continue;

                    try {
                        var io = new ImportOptions(validFile);
                        var footage = app.project.importFile(io);
                        footage.parentFolder = tileFolder;

                        var tileZoom = parseFloat(t.z || data.zoom || 6);
                        var zoomScaleFactor = Math.pow(2, rig.refZoom - tileZoom) * 100.0;
                        var isBase = (t.role === "HORIZON_BASE");

                        var layer = comp.layers.add(footage);
                        var roleTag = isBase ? "HORIZON" : (t.role || "DETAIL");
                        layer.name = "MAP_TILES_" + roleTag + "_Z" + tileZoom + "_" + (i + 1);
                        layer.comment = "Stitched Map Tile (Zoom " + tileZoom + ")";

                        var xy = latLonToCompXY(t.centerLat, t.centerLon, rig.refLat, rig.refLon, rig.refZoom, comp.width, comp.height);
                        // Monotonic 3D Z-depth ordering: higher zoom in front (Z=0.0), lower zoom slightly behind
                        // so Classic 3D and Advanced 3D NEVER have Z-fighting across multi-keyframe zoom levels!
                        var zPos = isBase
                            ? ((maxTileZoom - tileZoom) * 0.15 + 1.0)
                            : ((maxTileZoom - tileZoom) * 0.15 + (i * 0.01));

                        attachCoplanarToAnchor(
                            layer,
                            rig.anchor,
                            [xy[0], xy[1], zPos],
                            [zoomScaleFactor, zoomScaleFactor, 100]
                        );

                        // Dynamic Multi-Zoom Opacity Blend for upper zoom atlases (tileZoom > minDetailZoom):
                        // Stays 100% opaque at & above tileZoom, and fades smoothly to 0% as camera zooms out
                        // to (tileZoom - 2.2), revealing the 100%-opaque lower-zoom atlas directly underneath!
                        if (!isBase && tileZoom > minDetailZoom && data.multiZoomBlend !== false) {
                            layer.property("Transform").property("Opacity").expression = [
                                "function getCtrl(){ try { return thisComp.layer('MAP_CAMERA_CONTROLLER'); } catch(e){ return thisComp.layer('GEO_MAPCOMP_CONTROL'); } }",
                                "var z = getCtrl().effect('Mapcomp Zoom')('Slider');",
                                "linear(z, " + (tileZoom - 2.2).toFixed(2) + ", " + (tileZoom - 0.35).toFixed(2) + ", 0, 100);"
                            ].join("\n");
                        } else {
                            layer.property("Transform").property("Opacity").setValue(100);
                        }

                        // Move right above MAPCOMP_BASE_CANVAS (which is at the bottom)
                        layer.moveToEnd();
                        importedCount++;
                    } catch (importErr) {}
                }

                // Always ensure 2D MAPCOMP_BASE_CANVAS is the absolute last layer at the bottom of the comp
                if (rig.bgCanvas) {
                    rig.bgCanvas.moveToEnd();
                }

                if (data.showAttribution !== false) {
                    ensureMapAttribution(comp, data.attributionText);
                }

                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    importedCount: importedCount,
                    message: "Finalize tamamlandı: Tam ekran kesintisiz " + importedCount + " Harita Atlası (2304x1792px) sahneye işlendi!"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        drawGeoJSONBoundary: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Draw Feature Shape Layer");
            try {
                var data = JSON.parse(payloadJson);
                var comp = getOrCreateActiveGeoComp(data);
                var rig = ensureMapcompRig(comp, data);

                var shapeLayer = comp.layers.addShape();
                shapeLayer.name = "BOUNDARY_" + (data.name || "GeoFeature");
                shapeLayer.comment = "Geographic Boundary Vector (Shape Layer)";
                shapeLayer.label = 11;
                shapeLayer.property("Transform").property("Anchor Point").setValue([0, 0, 0]);
                attachCoplanarToAnchor(shapeLayer, rig.anchor, [0, 0, -2], [100, 100, 100]);

                var polygons = data.polygons || [];
                var contents = shapeLayer.property("Contents");
                var isClosed = (data.closed !== false);

                for (var p = 0; p < polygons.length; p++) {
                    var ring = polygons[p];
                    if (!ring || ring.length < 2) continue;

                    var group = contents.addProperty("ADBE Vector Group");
                    group.name = "Path_" + (p + 1);
                    var groupContents = group.property("Contents");

                    var pathProp = groupContents.addProperty("ADBE Vector Shape - Group");
                    var myShape = new Shape();
                    var vertices = [];

                    var step = ring.length > 450 ? Math.ceil(ring.length / 450) : 1;
                    for (var idx = 0; idx < ring.length; idx += step) {
                        var pt = ring[idx];
                        var xy = latLonToCompXY(pt[1], pt[0], rig.refLat, rig.refLon, rig.refZoom, comp.width, comp.height);
                        vertices.push([xy[0], xy[1]]);
                    }

                    myShape.vertices = vertices;
                    myShape.closed = isClosed;
                    pathProp.property("Path").setValue(myShape);

                    if (isClosed && data.fillEnabled !== false && parseFloat(data.fillOpacity) > 0) {
                        var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
                        fill.property("Color").setValue(hexToRgb(data.fillColor || "#38bdf8"));
                        var targetFillOp = parseFloat(data.fillOpacity) || 35;
                        var fillOpProp = fill.property("Opacity");
                        if (data.animateTrim) {
                            var tStart = comp.time;
                            var trimDur = parseFloat(data.animDuration) || 2.5;
                            fillOpProp.setValueAtTime(tStart + trimDur * 0.55, 0);
                            fillOpProp.setValueAtTime(tStart + trimDur, targetFillOp);
                            applyEasyEase(fillOpProp);
                        } else {
                            fillOpProp.setValue(targetFillOp);
                        }
                    }

                    if (data.strokeEnabled !== false && parseFloat(data.strokeWidth) > 0) {
                        var stroke = groupContents.addProperty("ADBE Vector Graphic - Stroke");
                        stroke.property("Color").setValue(hexToRgb(data.strokeColor || "#f8fafc"));
                        stroke.property("Stroke Width").setValue(parseFloat(data.strokeWidth) || 3.5);
                        stroke.property("Line Cap").setValue(2);
                        stroke.property("Line Join").setValue(2);
                        if (data.dashed) {
                            var dashes = stroke.property("Dashes");
                            var d1 = dashes.addProperty("ADBE Vector Stroke Dash 1");
                            d1.setValue(16);
                        }
                    }
                }

                if (data.animateTrim) {
                    var trim = contents.addProperty("ADBE Vector Filter - Trim");
                    var endProp = trim.property("End");
                    var t0 = comp.time;
                    endProp.setValueAtTime(t0, 0);
                    endProp.setValueAtTime(t0 + (parseFloat(data.animDuration) || 2.5), 100);
                    applyEasyEase(endProp);
                }

                if (data.extrudeDepth && parseFloat(data.extrudeDepth) > 0) {
                    try {
                        var geom = shapeLayer.property("Geometry Options");
                        if (geom && geom.property("Extrusion Depth")) {
                            geom.property("Extrusion Depth").setValue(parseFloat(data.extrudeDepth));
                        }
                    } catch (eGeom) {}
                }

                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    layerName: shapeLayer.name,
                    message: "Feature ('" + shapeLayer.name + "') AE Shape Layer olarak Mapcomp'a çizildi!"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        drawAnimatedRoute: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Connect Features Route");
            try {
                var data = JSON.parse(payloadJson);
                var comp = getOrCreateActiveGeoComp(data);
                var rig = ensureMapcompRig(comp, data);

                var coords = data.coordinates || [];
                if (coords.length < 2) {
                    return JSON.stringify({ ok: false, error: "Rota için en az 2 koordinat gereklidir." });
                }

                var routeLayer = comp.layers.addShape();
                routeLayer.name = "ROUTE_" + (data.routeName || "ConnectedPath");
                routeLayer.comment = "Animated Route Vector Path";
                routeLayer.label = 10;
                routeLayer.property("Transform").property("Anchor Point").setValue([0, 0, 0]);
                attachCoplanarToAnchor(routeLayer, rig.anchor, [0, 0, -4], [100, 100, 100]);

                var contents = routeLayer.property("Contents");
                var group = contents.addProperty("ADBE Vector Group");
                group.name = "RouteVector";
                var gContents = group.property("Contents");

                var pathGroup = gContents.addProperty("ADBE Vector Shape - Group");
                var myShape = new Shape();
                var vertices = [];

                var step = coords.length > 300 ? Math.ceil(coords.length / 300) : 1;
                for (var i = 0; i < coords.length; i += step) {
                    var c = coords[i];
                    var xy = latLonToCompXY(c[1], c[0], rig.refLat, rig.refLon, rig.refZoom, comp.width, comp.height);
                    vertices.push([xy[0], xy[1]]);
                }
                var lastC = coords[coords.length - 1];
                var lastXY = latLonToCompXY(lastC[1], lastC[0], rig.refLat, rig.refLon, rig.refZoom, comp.width, comp.height);
                vertices.push([lastXY[0], lastXY[1]]);

                if (data.routeMode === "flight" && vertices.length === 2) {
                    var p0 = vertices[0];
                    var p1 = vertices[1];
                    var dx = p1[0] - p0[0];
                    var dy = p1[1] - p0[1];
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    var mid = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - dist * 0.28];
                    vertices = [p0, mid, p1];
                    myShape.inTangents = [[0, 0], [-dx * 0.2, 0], [0, 0]];
                    myShape.outTangents = [[0, 0], [dx * 0.2, 0], [0, 0]];
                }

                myShape.vertices = vertices;
                myShape.closed = false;
                pathGroup.property("Path").setValue(myShape);

                var stroke = gContents.addProperty("ADBE Vector Graphic - Stroke");
                stroke.property("Color").setValue(hexToRgb(data.strokeColor || "#f43f5e"));
                stroke.property("Stroke Width").setValue(parseFloat(data.strokeWidth) || 6.0);
                stroke.property("Line Cap").setValue(2);
                stroke.property("Line Join").setValue(2);

                if (data.dashed) {
                    var dashes = stroke.property("Dashes");
                    var dashProp = dashes.addProperty("ADBE Vector Stroke Dash 1");
                    dashProp.setValue(18);
                }

                var trim = contents.addProperty("ADBE Vector Filter - Trim");
                var endProp = trim.property("End");
                var startTime = comp.time;
                var duration = parseFloat(data.duration) || 4.0;
                endProp.setValueAtTime(startTime, 0);
                endProp.setValueAtTime(startTime + duration, 100);
                applyEasyEase(endProp);

                if (data.addHeadMarker !== false) {
                    var headLayer = comp.layers.addShape();
                    headLayer.name = "ROUTE_TRACKER_" + (data.routeName || "Tracker");
                    headLayer.comment = "Tracker Pin Following Route";
                    attachCoplanarToAnchor(headLayer, rig.anchor, [0, 0, -6], [100, 100, 100]);

                    var hGroup = headLayer.property("Contents").addProperty("ADBE Vector Group");
                    var ellipse = hGroup.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
                    ellipse.property("Size").setValue([22, 22]);
                    var hFill = hGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                    hFill.property("Color").setValue([1, 1, 1]);
                    var hStroke = hGroup.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
                    hStroke.property("Color").setValue(hexToRgb(data.strokeColor || "#f43f5e"));
                    hStroke.property("Stroke Width").setValue(5);

                    var posProp = headLayer.property("Transform").property("Position");
                    var sampleCount = Math.min(vertices.length, 32);
                    for (var s = 0; s < sampleCount; s++) {
                        var vIdx = Math.min(vertices.length - 1, Math.floor((s / (sampleCount - 1)) * (vertices.length - 1)));
                        var vPt = vertices[vIdx];
                        var tKey = startTime + (s / (sampleCount - 1)) * duration;
                        posProp.setValueAtTime(tKey, [vPt[0], vPt[1], -6]);
                    }
                }

                if (data.cameraFollowRoute) {
                    var ctrl = rig.controller;
                    var fx = ctrl.property("ADBE Effect Parade");
                    var latP = fx.property("Mapcomp Latitude").property(1);
                    var lonP = fx.property("Mapcomp Longitude").property(1);
                    var firstC = coords[0];
                    latP.setValueAtTime(startTime, firstC[1]);
                    lonP.setValueAtTime(startTime, firstC[0]);
                    latP.setValueAtTime(startTime + duration, lastC[1]);
                    lonP.setValueAtTime(startTime + duration, lastC[0]);
                    applyEasyEase(latP);
                    applyEasyEase(lonP);
                }

                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    layerName: routeLayer.name,
                    message: "Connect Features ('" + routeLayer.name + "') Mapcomp'a çizildi!"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        addGeoPinLabel: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Add Label Template");
            try {
                var data = JSON.parse(payloadJson);
                var comp = getOrCreateActiveGeoComp(data);
                var rig = ensureMapcompRig(comp, data);

                var xy = latLonToCompXY(
                    parseFloat(data.lat),
                    parseFloat(data.lon),
                    rig.refLat,
                    rig.refLon,
                    rig.refZoom,
                    comp.width,
                    comp.height
                );

                var pinLayer = comp.layers.addShape();
                pinLayer.name = "PIN_" + (data.title || "Place");
                pinLayer.comment = "3D Billboard Location Pin";
                pinLayer.label = 14;
                attachCoplanarToAnchor(pinLayer, rig.anchor, [xy[0], xy[1], -8], [100, 100, 100]);

                if (data.autoCounterScale !== false) {
                    pinLayer.property("Transform").property("Scale").expression = [
                        "function getAnchor(){ try { return thisComp.layer('MAP_WORLD_ANCHOR'); } catch(e){ return thisComp.layer('GEO_WORLD_ANCHOR'); } }",
                        "var s = getAnchor().transform.scale[0];",
                        "var inv = 10000 / Math.max(0.001, s);",
                        "[inv, inv, inv];"
                    ].join("\n");
                }

                if (data.counterRotate !== false) {
                    pinLayer.property("Transform").property("Z Rotation").expression = [
                        "function getCtrl(){ try { return thisComp.layer('MAP_CAMERA_CONTROLLER'); } catch(e){ return thisComp.layer('GEO_MAPCOMP_CONTROL'); } }",
                        "-getCtrl().effect('Mapcomp Bearing')('Slider');"
                    ].join("\n");
                    pinLayer.property("Transform").property("X Rotation").expression = [
                        "function getCtrl(){ try { return thisComp.layer('MAP_CAMERA_CONTROLLER'); } catch(e){ return thisComp.layer('GEO_MAPCOMP_CONTROL'); } }",
                        "-getCtrl().effect('Mapcomp Pitch')('Slider');"
                    ].join("\n");
                }

                var contents = pinLayer.property("Contents");
                var style = data.style || "location";

                if (style === "location") {
                    // 1. Ground Contact Shadow
                    var shadowGrp = contents.addProperty("ADBE Vector Group");
                    shadowGrp.name = "GroundShadow";
                    var sEllipse = shadowGrp.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
                    sEllipse.property("Size").setValue([20, 8]);
                    sEllipse.property("Position").setValue([0, 0]);
                    var sFill = shadowGrp.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                    sFill.property("Color").setValue([0, 0, 0]);
                    sFill.property("Opacity").setValue(35);

                    // 2. Teardrop Location Marker Body (points to [0, 0])
                    var pinGrp = contents.addProperty("ADBE Vector Group");
                    pinGrp.name = "LocationPinBody";
                    var pShapeProp = pinGrp.property("Contents").addProperty("ADBE Vector Shape - Group");
                    var pShape = new Shape();
                    pShape.vertices = [
                        [0, 0],
                        [-14, -22],
                        [-14, -34],
                        [0, -48],
                        [14, -34],
                        [14, -22]
                    ];
                    pShape.inTangents = [
                        [0, 0],
                        [-2, 4],
                        [0, -7],
                        [-8, 0],
                        [0, 7],
                        [2, -4]
                    ];
                    pShape.outTangents = [
                        [0, 0],
                        [0, -7],
                        [0, -7],
                        [8, 0],
                        [0, 7],
                        [-2, 4]
                    ];
                    pShape.closed = true;
                    pShapeProp.property("Path").setValue(pShape);

                    var pinFill = pinGrp.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                    pinFill.property("Color").setValue(hexToRgb(data.color || "#ef4444"));

                    var pinStroke = pinGrp.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
                    pinStroke.property("Color").setValue([1, 1, 1]);
                    pinStroke.property("Stroke Width").setValue(2.5);

                    // 3. Inner White Dot
                    var innerDot = pinGrp.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
                    innerDot.property("Size").setValue([11, 11]);
                    innerDot.property("Position").setValue([0, -34]);
                    var inFill = pinGrp.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                    inFill.property("Color").setValue([1, 1, 1]);
                }

                if (style === "radar" || style === "hud") {
                    var radarGrp = contents.addProperty("ADBE Vector Group");
                    radarGrp.name = "RadarPulse";
                    var rEllipse = radarGrp.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
                    rEllipse.property("Size").setValue([60, 60]);
                    var rStroke = radarGrp.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
                    rStroke.property("Color").setValue(hexToRgb(data.color || "#38bdf8"));
                    rStroke.property("Stroke Width").setValue(2.5);
                    radarGrp.property("Transform").property("Scale").expression =
                        "var s = (time * 85) % 100; [40 + s * 1.4, 40 + s * 1.4];";
                    radarGrp.property("Transform").property("Opacity").expression =
                        "var s = (time * 85) % 100; 100 - s;";
                }

                if (style === "callout") {
                    var boxGrp = contents.addProperty("ADBE Vector Group");
                    boxGrp.name = "VoxCalloutBg";
                    var rect = boxGrp.property("Contents").addProperty("ADBE Vector Shape - Rect");
                    var boxW = Math.max(140, String(data.title || "Place").length * 18);
                    rect.property("Size").setValue([boxW, 46]);
                    rect.property("Position").setValue([0, -42]);
                    rect.property("Roundness").setValue(8);
                    var bFill = boxGrp.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                    bFill.property("Color").setValue([0.07, 0.1, 0.16]);
                    bFill.property("Opacity").setValue(88);
                    var bStroke = boxGrp.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
                    bStroke.property("Color").setValue(hexToRgb(data.color || "#38bdf8"));
                    bStroke.property("Stroke Width").setValue(2);
                }

                if (style !== "location") {
                    var dotGrp = contents.addProperty("ADBE Vector Group");
                    dotGrp.name = "PinCore";
                    if (style === "capital") {
                        var star = dotGrp.property("Contents").addProperty("ADBE Vector Shape - Star");
                        star.property("Points").setValue(5);
                        star.property("Outer Radius").setValue(14);
                        star.property("Inner Radius").setValue(6);
                    } else {
                        var cEllipse = dotGrp.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
                        cEllipse.property("Size").setValue([18, 18]);
                    }
                    var cFill = dotGrp.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                    cFill.property("Color").setValue(hexToRgb(data.color || "#38bdf8"));
                    var cStroke = dotGrp.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
                    cStroke.property("Color").setValue([1, 1, 1]);
                    cStroke.property("Stroke Width").setValue(3);
                }

                if (data.title) {
                    var textStr = data.title + (data.subtitle ? ("\r" + data.subtitle) : "");
                    var textLayer = comp.layers.addText(textStr);
                    textLayer.name = "PIN_TEXT_" + data.title;
                    textLayer.comment = "Location Text Label for " + data.title;
                    var textProp = textLayer.property("Source Text");
                    var textDoc = textProp.value;
                    textDoc.fontSize = parseFloat(data.fontSize) || 28;
                    textDoc.fillColor = [1, 1, 1];
                    textDoc.strokeColor = [0.03, 0.05, 0.1];
                    textDoc.strokeWidth = 3.5;
                    textDoc.applyStroke = true;
                    textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;

                    // Modern clean Sans-Serif font hierarchy
                    var sansFonts = ["Arial-BoldMT", "Helvetica-Bold", "SegoeUI-Bold", "SFProDisplay-Bold", "ArialMT", "Helvetica"];
                    for (var sf = 0; sf < sansFonts.length; sf++) {
                        try {
                            textDoc.font = sansFonts[sf];
                            break;
                        } catch (eFont) {}
                    }
                    textProp.setValue(textDoc);

                    var textYOffset = (style === "location") ? -56 : -32;
                    attachCoplanarToAnchor(textLayer, pinLayer, [0, textYOffset, -2], [100, 100, 100]);
                }

                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    message: "Label Template ('" + (data.title || "Konum") + "') Mapcomp'a eklendi!"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        drawHelplinesGrid: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Draw Helplines & Graticule");
            try {
                var data = JSON.parse(payloadJson || "{}");
                var comp = getOrCreateActiveGeoComp(data);
                var rig = ensureMapcompRig(comp, data);

                var gridLayer = comp.layers.addShape();
                gridLayer.name = "MAP_LAT_LON_GRID";
                gridLayer.comment = "Latitude / Longitude Graticule Lines";
                gridLayer.label = 13;
                gridLayer.property("Transform").property("Anchor Point").setValue([0, 0, 0]);
                attachCoplanarToAnchor(gridLayer, rig.anchor, [0, 0, -1], [100, 100, 100]);
                gridLayer.property("Transform").property("Opacity").setValue(32);

                var contents = gridLayer.property("Contents");
                var grp = contents.addProperty("ADBE Vector Group");
                grp.name = "LatLonGrid";
                var gContents = grp.property("Contents");

                var stepDeg = parseFloat(data.stepDeg || 5.0);
                var cLat = rig.refLat;
                var cLon = rig.refLon;

                for (var dLat = -15; dLat <= 15; dLat += stepDeg) {
                    var pA = latLonToCompXY(cLat + dLat, cLon - 20, rig.refLat, rig.refLon, rig.refZoom, comp.width, comp.height);
                    var pB = latLonToCompXY(cLat + dLat, cLon + 20, rig.refLat, rig.refLon, rig.refZoom, comp.width, comp.height);
                    var shLat = gContents.addProperty("ADBE Vector Shape - Group");
                    var sLat = new Shape();
                    sLat.vertices = [pA, pB];
                    sLat.closed = false;
                    shLat.property("Path").setValue(sLat);
                }

                for (var dLon = -20; dLon <= 20; dLon += stepDeg) {
                    var pC = latLonToCompXY(cLat - 15, cLon + dLon, rig.refLat, rig.refLon, rig.refZoom, comp.width, comp.height);
                    var pD = latLonToCompXY(cLat + 15, cLon + dLon, rig.refLat, rig.refLon, rig.refZoom, comp.width, comp.height);
                    var shLon = gContents.addProperty("ADBE Vector Shape - Group");
                    var sLon = new Shape();
                    sLon.vertices = [pC, pD];
                    sLon.closed = false;
                    shLon.property("Path").setValue(sLon);
                }

                var stroke = gContents.addProperty("ADBE Vector Graphic - Stroke");
                stroke.property("Color").setValue(hexToRgb(data.color || "#38bdf8"));
                stroke.property("Stroke Width").setValue(1.5);
                var dashes = stroke.property("Dashes");
                var dProp = dashes.addProperty("ADBE Vector Stroke Dash 1");
                dProp.setValue(8);

                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    message: "Coğrafi Helplines & Enlem/Boylam Izgarası (Graticule) Mapcomp'a çizildi!"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        animateCameraFlyTo: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Mapcomp Fly-To Transition");
            try {
                var data = JSON.parse(payloadJson);
                var comp = getOrCreateActiveGeoComp(data);
                var rig = ensureMapcompRig(comp, data);
                var ctrl = rig.controller;
                var fx = ctrl.property("ADBE Effect Parade");

                var latProp = fx.property("Mapcomp Latitude").property(1);
                var lonProp = fx.property("Mapcomp Longitude").property(1);
                var zoomProp = fx.property("Mapcomp Zoom").property(1);
                var pitchProp = fx.property("Mapcomp Pitch").property(1);
                var bearingProp = fx.property("Mapcomp Bearing").property(1);

                var t0 = comp.time;
                var dur = parseFloat(data.duration) || 4.0;
                var midT = t0 + dur / 2.0;
                var t1 = t0 + dur;

                var startZoom = parseFloat(data.fromZoom || data.zoom || 9);
                var endZoom = parseFloat(data.toZoom || data.zoom || 9);
                var arcMinZoom = Math.max(2.8, Math.min(startZoom, endZoom) - parseFloat(data.zoomArcDrop || 2.5));

                latProp.setValueAtTime(t0, parseFloat(data.fromLat));
                lonProp.setValueAtTime(t0, parseFloat(data.fromLon));
                zoomProp.setValueAtTime(t0, startZoom);
                pitchProp.setValueAtTime(t0, parseFloat(data.fromPitch || 25));
                bearingProp.setValueAtTime(t0, parseFloat(data.fromBearing || 0));

                zoomProp.setValueAtTime(midT, arcMinZoom);
                pitchProp.setValueAtTime(midT, parseFloat(data.peakPitch || 50));

                latProp.setValueAtTime(t1, parseFloat(data.toLat));
                lonProp.setValueAtTime(t1, parseFloat(data.toLon));
                zoomProp.setValueAtTime(t1, endZoom);
                pitchProp.setValueAtTime(t1, parseFloat(data.toPitch || 40));
                bearingProp.setValueAtTime(t1, parseFloat(data.toBearing || 15));

                applyEasyEase(latProp);
                applyEasyEase(lonProp);
                applyEasyEase(zoomProp);
                applyEasyEase(pitchProp);
                applyEasyEase(bearingProp);

                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    message: "Mapcomp Fly-To geçişi (Lat/Lon/Zoom/Pitch/Bearing Keyframe'leri) oluşturuldu!"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        create3DTerrainMesh: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: 3D Terrain Relief");
            try {
                var data = JSON.parse(payloadJson);
                var comp = getOrCreateActiveGeoComp(data);
                var rig = ensureMapcompRig(comp, data);

                var samples = data.samples || [];
                var exaggeration = parseFloat(data.exaggeration) || 2.5;

                var terrainLayer = comp.layers.addShape();
                terrainLayer.name = "TERRAIN_DEM_" + (data.regionName || "Relief");
                terrainLayer.label = 13;
                terrainLayer.property("Transform").property("Anchor Point").setValue([0, 0, 0]);
                attachCoplanarToAnchor(terrainLayer, rig.anchor, [0, 0, -2], [100, 100, 100]);

                var contents = terrainLayer.property("Contents");
                for (var i = 0; i < samples.length; i++) {
                    var s = samples[i];
                    var xy = latLonToCompXY(s.lat, s.lon, rig.refLat, rig.refLon, rig.refZoom, comp.width, comp.height);
                    var elevHeight = Math.max(4, (parseFloat(s.elevation) || 100) * 0.08 * exaggeration);

                    var barGrp = contents.addProperty("ADBE Vector Group");
                    barGrp.name = "Elev_" + Math.round(s.elevation) + "m";
                    var rect = barGrp.property("Contents").addProperty("ADBE Vector Shape - Rect");
                    rect.property("Size").setValue([18, elevHeight]);
                    rect.property("Position").setValue([xy[0], xy[1] - elevHeight / 2]);

                    var fill = barGrp.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                    var norm = Math.min(1.0, Math.max(0.0, (parseFloat(s.elevation) || 0) / 2500.0));
                    fill.property("Color").setValue([0.15 + norm * 0.75, 0.75 - norm * 0.35, 0.45 - norm * 0.25]);
                }

                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    message: samples.length + " noktalı 3D DEM Rölyef Katmanı Mapcomp'a eklendi!"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        createGeoDataChart: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Data-Driven Style Chart");
            try {
                var data = JSON.parse(payloadJson);
                var comp = getOrCreateActiveGeoComp(data);
                var rig = ensureMapcompRig(comp, data);

                var items = data.items || [];
                var maxVal = 1;
                for (var m = 0; m < items.length; m++) {
                    if (parseFloat(items[m].value) > maxVal) maxVal = parseFloat(items[m].value);
                }

                var t0 = comp.time;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var xy = latLonToCompXY(item.lat, item.lon, rig.refLat, rig.refLon, rig.refZoom, comp.width, comp.height);
                    var ratio = (parseFloat(item.value) || 0) / maxVal;
                    var barHeight = Math.max(20, ratio * 240);

                    var barLayer = comp.layers.addShape();
                    barLayer.name = "DATA_STYLE_" + item.name + " (" + item.value + ")";
                    attachCoplanarToAnchor(barLayer, rig.anchor, [xy[0], xy[1], -10], [100, 100, 100]);

                    var grp = barLayer.property("Contents").addProperty("ADBE Vector Group");
                    var rect = grp.property("Contents").addProperty("ADBE Vector Shape - Rect");
                    rect.property("Size").setValue([30, barHeight]);
                    rect.property("Position").setValue([0, -barHeight / 2]);
                    rect.property("Roundness").setValue(6);

                    var fill = grp.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                    fill.property("Color").setValue(hexToRgb(item.color || "#38bdf8"));

                    var scaleProp = barLayer.property("Transform").property("Scale");
                    scaleProp.setValueAtTime(t0 + i * 0.12, [100, 0, 100]);
                    scaleProp.setValueAtTime(t0 + i * 0.12 + 0.8, [100, 100, 100]);
                    applyEasyEase(scaleProp);
                }

                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    message: items.length + " bölgeli Data-Driven Choropleth/Bar katmanı Mapcomp'a eklendi!"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        getMapcompDetails: function (payloadJson) {
            try {
                var data = JSON.parse(payloadJson || "{}");
                var comp = getOrCreateActiveGeoComp(data);
                return JSON.stringify({
                    ok: true,
                    name: comp.name,
                    width: comp.width,
                    height: comp.height,
                    fps: comp.frameRate,
                    duration: comp.duration,
                    bgColor: rgbToHex(comp.bgColor),
                    motionBlur: comp.motionBlur,
                    shutterAngle: comp.shutterAngle,
                    shutterPhase: comp.shutterPhase,
                    numLayers: comp.numLayers,
                    allMapcomps: getAllProjectMapcompNames()
                });
            } catch (err) {
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        resizeMapcomp: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Resize Mapcomp");
            try {
                var data = JSON.parse(payloadJson || "{}");
                var comp = getOrCreateActiveGeoComp(data);
                var newW = parseInt(data.width, 10) || comp.width;
                var newH = parseInt(data.height, 10) || comp.height;
                var newFps = parseFloat(data.fps) || comp.frameRate;
                var newDur = parseFloat(data.duration) || comp.duration;

                comp.width = newW;
                comp.height = newH;
                comp.frameRate = newFps;
                comp.duration = newDur;
                if (data.bgColor) comp.bgColor = hexToRgb(data.bgColor);

                var halfW = newW / 2;
                var halfH = newH / 2;

                // Re-center controller, anchor & solid canvas
                for (var i = 1; i <= comp.numLayers; i++) {
                    var l = comp.layer(i);
                    var ln = l.name;
                    if (ln === "MAP_CAMERA_CONTROLLER" || ln === "GEO_MAPCOMP_CONTROL" || ln === "MAP_WORLD_ANCHOR" || ln === "GEO_WORLD_ANCHOR") {
                        try { l.property("Position").setValue([halfW, halfH, 0]); } catch (e) {}
                    }
                    if (ln === "MAP_BACKGROUND_CANVAS" || ln === "MAPCOMP_BASE_CANVAS") {
                        try {
                            l.property("Position").setValue([halfW, halfH]);
                            var src = l.source;
                            if (src && !(src instanceof CompItem)) {
                                src.width = newW;
                                src.height = newH;
                            }
                        } catch (e2) {}
                    }
                    if (ln === "MAP_ATTRIBUTION_CREDIT" || ln === "GEO_MAP_ATTRIBUTION") {
                        try { l.property("Position").setValue([newW - 20, newH - 20]); } catch (e3) {}
                    }
                }

                if (data.motionBlur !== undefined) {
                    try { comp.motionBlur = (data.motionBlur === true || data.motionBlur === "true"); } catch (emb) {}
                }
                if (data.shutterAngle !== undefined) {
                    try { comp.shutterAngle = parseFloat(data.shutterAngle); } catch (esa) {}
                }
                if (data.shutterPhase !== undefined) {
                    try { comp.shutterPhase = parseFloat(data.shutterPhase); } catch (esp) {}
                }

                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    compName: comp.name,
                    width: comp.width,
                    height: comp.height,
                    fps: comp.frameRate,
                    duration: comp.duration,
                    message: "'" + comp.name + "' ölçüleri " + comp.width + "x" + comp.height + " (" + comp.frameRate + " FPS) olarak güncellendi!"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        duplicateMapcomp: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Duplicate Mapcomp");
            try {
                var data = JSON.parse(payloadJson || "{}");
                var comp = getOrCreateActiveGeoComp(data);
                var newComp = comp.duplicate();

                var targetName = data.targetName || (comp.name + " (" + (data.presetLabel || "Copy") + ")");
                newComp.name = targetName;

                var newW = parseInt(data.width, 10) || comp.width;
                var newH = parseInt(data.height, 10) || comp.height;
                newComp.width = newW;
                newComp.height = newH;
                if (data.fps) newComp.frameRate = parseFloat(data.fps);
                if (data.duration) newComp.duration = parseFloat(data.duration);
                if (data.bgColor) newComp.bgColor = hexToRgb(data.bgColor);

                var halfW = newW / 2;
                var halfH = newH / 2;

                // Re-center rig in the duplicated comp and optionally clean atlas tiles
                for (var i = newComp.numLayers; i >= 1; i--) {
                    var l = newComp.layer(i);
                    if (data.cleanAtlas && (l.name.indexOf("MAP_TILES_") === 0 || l.name.indexOf("MAPCOMP_ATLAS_") === 0)) {
                        l.remove();
                        continue;
                    }
                    var ln = l.name;
                    if (ln === "MAP_CAMERA_CONTROLLER" || ln === "GEO_MAPCOMP_CONTROL" || ln === "MAP_WORLD_ANCHOR" || ln === "GEO_WORLD_ANCHOR") {
                        try { l.property("Position").setValue([halfW, halfH, 0]); } catch (e) {}
                    }
                    if (ln === "MAP_BACKGROUND_CANVAS" || ln === "MAPCOMP_BASE_CANVAS") {
                        try {
                            l.property("Position").setValue([halfW, halfH]);
                            var src = l.source;
                            if (src && !(src instanceof CompItem)) {
                                src.width = newW;
                                src.height = newH;
                            }
                        } catch (e2) {}
                    }
                    if (ln === "MAP_ATTRIBUTION_CREDIT" || ln === "GEO_MAP_ATTRIBUTION") {
                        try { l.property("Position").setValue([newW - 20, newH - 20]); } catch (e3) {}
                    }
                }

                newComp.openInViewer();
                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    compName: newComp.name,
                    width: newComp.width,
                    height: newComp.height,
                    fps: newComp.frameRate,
                    duration: newComp.duration,
                    message: "'" + newComp.name + "' (" + newComp.width + "x" + newComp.height + ") başarıyla çoğaltıldı ve açıldı!"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        applyCinematicEaseToMapcomp: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Apply Cinematic Ease");
            try {
                var data = JSON.parse(payloadJson || "{}");
                var comp = getOrCreateActiveGeoComp(data);
                var rig = ensureMapcompRig(comp, data);
                var fx = rig.controller.property("ADBE Effect Parade");
                var props = ["Mapcomp Latitude", "Mapcomp Longitude", "Mapcomp Zoom", "Mapcomp Pitch", "Mapcomp Bearing"];
                var infl = Math.min(100, Math.max(10, parseFloat(data.influence) || 75));
                var count = 0;

                for (var p = 0; p < props.length; p++) {
                    var sl = fx.property(props[p]);
                    if (!sl) continue;
                    var prop = sl.property(1);
                    if (!prop || prop.numKeys < 1) continue;
                    for (var k = 1; k <= prop.numKeys; k++) {
                        var easeIn = new KeyframeEase(0, infl);
                        var easeOut = new KeyframeEase(0, infl);
                        prop.setTemporalEaseAtKey(k, [easeIn], [easeOut]);
                        count++;
                    }
                }

                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    count: count,
                    message: count + " adet keyframe'e Sinematik Yumuşatma (% " + infl + " Ease) uygulandı!"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        reverseMapcompKeyframes: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Reverse Keyframes");
            try {
                var data = JSON.parse(payloadJson || "{}");
                var comp = getOrCreateActiveGeoComp(data);
                var rig = ensureMapcompRig(comp, data);
                var fx = rig.controller.property("ADBE Effect Parade");
                var props = ["Mapcomp Latitude", "Mapcomp Longitude", "Mapcomp Zoom", "Mapcomp Pitch", "Mapcomp Bearing"];

                var minT = 999999;
                var maxT = -999999;
                for (var p = 0; p < props.length; p++) {
                    var sl = fx.property(props[p]);
                    if (!sl) continue;
                    var prp = sl.property(1);
                    for (var k = 1; k <= prp.numKeys; k++) {
                        var kt = prp.keyTime(k);
                        if (kt < minT) minT = kt;
                        if (kt > maxT) maxT = kt;
                    }
                }

                if (minT >= maxT) {
                    app.endUndoGroup();
                    return JSON.stringify({ ok: false, error: "Tersine çevrilecek keyframe aralığı bulunamadı." });
                }

                for (var p2 = 0; p2 < props.length; p2++) {
                    var sl2 = fx.property(props[p2]);
                    if (!sl2) continue;
                    var prp2 = sl2.property(1);
                    if (prp2.numKeys < 2) continue;
                    var keysData = [];
                    for (var k2 = 1; k2 <= prp2.numKeys; k2++) {
                        keysData.push({
                            val: prp2.keyValue(k2),
                            newTime: maxT - (prp2.keyTime(k2) - minT)
                        });
                    }
                    while (prp2.numKeys > 0) {
                        prp2.removeKey(1);
                    }
                    for (var d = 0; d < keysData.length; d++) {
                        prp2.setValueAtTime(keysData[d].newTime, keysData[d].val);
                        applyEasyEase(prp2);
                    }
                }

                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    message: "Harita animasyon keyframe'leri tersine çevrildi (Reverse Anim)!"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        timeStretchMapcompKeyframes: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Time Stretch Keyframes");
            try {
                var data = JSON.parse(payloadJson || "{}");
                var comp = getOrCreateActiveGeoComp(data);
                var rig = ensureMapcompRig(comp, data);
                var fx = rig.controller.property("ADBE Effect Parade");
                var props = ["Mapcomp Latitude", "Mapcomp Longitude", "Mapcomp Zoom", "Mapcomp Pitch", "Mapcomp Bearing"];
                var factor = parseFloat(data.factor) || 1.0;
                if (factor <= 0) factor = 1.0;

                var minT = 999999;
                for (var p = 0; p < props.length; p++) {
                    var sl = fx.property(props[p]);
                    if (!sl) continue;
                    var prp = sl.property(1);
                    for (var k = 1; k <= prp.numKeys; k++) {
                        var kt = prp.keyTime(k);
                        if (kt < minT) minT = kt;
                    }
                }
                if (minT === 999999) minT = 0;

                var maxNewT = 0;
                for (var p2 = 0; p2 < props.length; p2++) {
                    var sl2 = fx.property(props[p2]);
                    if (!sl2) continue;
                    var prp2 = sl2.property(1);
                    if (prp2.numKeys < 1) continue;
                    var keysData = [];
                    for (var k2 = 1; k2 <= prp2.numKeys; k2++) {
                        var oldT = prp2.keyTime(k2);
                        var newT = minT + (oldT - minT) * factor;
                        if (newT > maxNewT) maxNewT = newT;
                        keysData.push({ val: prp2.keyValue(k2), time: newT });
                    }
                    while (prp2.numKeys > 0) {
                        prp2.removeKey(1);
                    }
                    for (var d = 0; d < keysData.length; d++) {
                        prp2.setValueAtTime(keysData[d].time, keysData[d].val);
                        applyEasyEase(prp2);
                    }
                }

                if (maxNewT > comp.duration) {
                    comp.duration = Math.ceil(maxNewT + 1);
                }

                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    newDuration: comp.duration,
                    message: "Keyframe zamanlaması " + factor + "x oranında esnetildi (Yeni Süre: " + comp.duration + "s)!"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        toggleMapcompLayerLock: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Toggle Layer Lock");
            try {
                var data = JSON.parse(payloadJson || "{}");
                var comp = getOrCreateActiveGeoComp(data);
                var lockState = (data.lock !== undefined) ? (data.lock === true || data.lock === "true") : true;
                var count = 0;
                for (var i = 1; i <= comp.numLayers; i++) {
                    var l = comp.layer(i);
                    var nm = l.name;
                    if (nm.indexOf("MAP_TILES_") === 0 || nm.indexOf("MAPCOMP_ATLAS_") === 0 || nm === "MAP_WORLD_ANCHOR" || nm === "GEO_WORLD_ANCHOR" || nm === "MAP_BACKGROUND_CANVAS" || nm === "MAPCOMP_BASE_CANVAS" || nm === "MAP_ATTRIBUTION_CREDIT" || nm === "GEO_MAP_ATTRIBUTION") {
                        l.locked = lockState;
                        count++;
                    }
                }
                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    locked: lockState,
                    message: count + " adet harita katmanı " + (lockState ? "kilitlendi (Düzenleme koruması açık)" : "kilidi açıldı")
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        },

        toggleMapcompDraftMode: function (payloadJson) {
            app.beginUndoGroup("GeoMotion: Toggle Draft Mode");
            try {
                var data = JSON.parse(payloadJson || "{}");
                var comp = getOrCreateActiveGeoComp(data);
                var enableAtlas = (data.draftMode === true || data.draftMode === "true") ? false : true;
                var count = 0;
                for (var i = 1; i <= comp.numLayers; i++) {
                    var l = comp.layer(i);
                    if (l.name.indexOf("MAP_TILES_") === 0 || l.name.indexOf("MAPCOMP_ATLAS_") === 0) {
                        l.enabled = enableAtlas;
                        count++;
                    }
                }
                app.endUndoGroup();
                return JSON.stringify({
                    ok: true,
                    draftMode: !enableAtlas,
                    message: enableAtlas ? "Normal Render Modu: Atlaslar görünür." : "⚡ Turbo Draft Modu: Atlaslar gizlendi, 60 FPS akıcı önizleme aktif!"
                });
            } catch (err) {
                app.endUndoGroup();
                return JSON.stringify({ ok: false, error: err.toString() });
            }
        }
    };
})();

var OpenGeoLayersHost = GeoMotionHost;
$.global.GeoMotionHost = GeoMotionHost;
$.global.OpenGeoLayersHost = GeoMotionHost;
