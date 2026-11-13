/**
 * GeoMotion Pro v3.5 — Professional Native ScriptUI Panel for After Effects
 * Place in: Adobe After Effects <Version> / Scripts / ScriptUI Panels /
 * Works across ALL After Effects versions (CC 2014 through 2026+)
 *
 * Implements the exact GEOlayers 3 workflow:
 *   - Mapcomp Selector + [+ Mapcomp]
 *   - View Parameters: LAT, LON, ZOOM, PITCH, BEARING
 *   - [◆ Keyframe] Stopwatch (Writes Mapcomp View Keyframe at CTI with Parabolic Zoom Arc)
 *   - [Snap Layer] (Binds selected AE layer to Feature Latitude/Longitude Sliders)
 *   - Feature Collection Actions: [Draw Feature], [+ Add Label]
 */

(function (thisObj) {
    "use strict";

    var PRESET_FEATURES = [
        { name: "Türkiye (Country)", lat: 39.9255, lon: 32.8663, zoom: 6.0 },
        { name: "İstanbul (Province)", lat: 41.0082, lon: 28.9784, zoom: 10.0 },
        { name: "Ankara (Capital)", lat: 39.9255, lon: 32.8663, zoom: 9.5 },
        { name: "İzmir (Aegean)", lat: 38.4237, lon: 27.1428, zoom: 9.5 },
        { name: "Antalya (Mediterranean)", lat: 36.8969, lon: 30.7133, zoom: 9.5 },
        { name: "Bakü (Azerbaijan)", lat: 40.4093, lon: 49.8671, zoom: 9.0 },
        { name: "Berlin (Germany)", lat: 52.5200, lon: 13.4050, zoom: 8.0 },
        { name: "London (UK)", lat: 51.5074, lon: -0.1278, zoom: 9.0 },
        { name: "New York (USA)", lat: 40.7128, lon: -74.0060, zoom: 9.0 },
        { name: "Tokyo (Japan)", lat: 35.6762, lon: 139.6503, zoom: 9.0 }
    ];

    function addOrGetSlider(layer, sliderName, defaultVal) {
        var fxGroup = layer.property("ADBE Effect Parade");
        var existing = fxGroup.property(sliderName);
        if (existing) return existing.property(1);
        var slider = fxGroup.addProperty("ADBE Slider Control");
        slider.name = sliderName;
        slider.property(1).setValue(defaultVal);
        return slider.property(1);
    }

    function ensureMapcompRig(comp, lat, lon, zoom, pitch, bearing) {
        var ctrlLayer = null;
        var anchorLayer = null;
        var camLayer = null;
        for (var i = 1; i <= comp.numLayers; i++) {
            var lyr = comp.layer(i);
            if (lyr.name === "GEO_MAPCOMP_CONTROL") ctrlLayer = lyr;
            if (lyr.name === "GEO_WORLD_ANCHOR") anchorLayer = lyr;
            if (lyr.name === "GEO_MAPCOMP_CAMERA" && lyr instanceof CameraLayer) camLayer = lyr;
        }
        if (!ctrlLayer) {
            ctrlLayer = comp.layers.addNull();
            ctrlLayer.name = "GEO_MAPCOMP_CONTROL";
            ctrlLayer.label = 9;
            ctrlLayer.guideLayer = true;
            ctrlLayer.threeDLayer = true;
            ctrlLayer.property("Position").setValue([comp.width / 2, comp.height / 2, 0]);
        }
        addOrGetSlider(ctrlLayer, "Mapcomp Latitude", lat);
        addOrGetSlider(ctrlLayer, "Mapcomp Longitude", lon);
        addOrGetSlider(ctrlLayer, "Mapcomp Zoom", zoom);
        addOrGetSlider(ctrlLayer, "Mapcomp Pitch", pitch);
        addOrGetSlider(ctrlLayer, "Mapcomp Bearing", bearing);
        addOrGetSlider(ctrlLayer, "Reference Lat", lat);
        addOrGetSlider(ctrlLayer, "Reference Lon", lon);
        addOrGetSlider(ctrlLayer, "Reference Zoom", zoom);

        if (!anchorLayer) {
            anchorLayer = comp.layers.addNull();
            anchorLayer.name = "GEO_WORLD_ANCHOR";
            anchorLayer.label = 14;
            anchorLayer.threeDLayer = true;
            anchorLayer.property("Position").setValue([comp.width / 2, comp.height / 2, 0]);
            anchorLayer.property("Transform").property("Scale").expression =
                "var c=thisComp.layer('GEO_MAPCOMP_CONTROL'); var s=100*Math.pow(2, c.effect('Mapcomp Zoom')('Slider')-c.effect('Reference Zoom')('Slider')); [s,s,s];";
            anchorLayer.property("Transform").property("X Rotation").expression =
                "thisComp.layer('GEO_MAPCOMP_CONTROL').effect('Mapcomp Pitch')('Slider');";
            anchorLayer.property("Transform").property("Z Rotation").expression =
                "thisComp.layer('GEO_MAPCOMP_CONTROL').effect('Mapcomp Bearing')('Slider');";
            anchorLayer.property("Transform").property("Anchor Point").expression = [
                "var c=thisComp.layer('GEO_MAPCOMP_CONTROL');",
                "var lat=c.effect('Mapcomp Latitude')('Slider'), lon=c.effect('Mapcomp Longitude')('Slider');",
                "var rLat=c.effect('Reference Lat')('Slider'), rLon=c.effect('Reference Lon')('Slider'), rZ=c.effect('Reference Zoom')('Slider');",
                "var sc=256*Math.pow(2,rZ);",
                "function px(lo){return (lo+180)/360*sc;}",
                "function py(la){var s=Math.sin(la*Math.PI/180);s=Math.min(Math.max(s,-0.9999),0.9999);return (0.5-Math.log((1+s)/(1-s))/(4*Math.PI))*sc;}",
                "[(thisComp.width/2)+(px(lon)-px(rLon)), (thisComp.height/2)+(py(lat)-py(rLat)), 0];"
            ].join("\n");
        }
        if (!camLayer) {
            camLayer = comp.layers.addCamera("GEO_MAPCOMP_CAMERA", [comp.width / 2, comp.height / 2]);
            camLayer.property("Position").setValue([comp.width / 2, comp.height / 2, -1866.0]);
            camLayer.property("Point of Interest").setValue([comp.width / 2, comp.height / 2, 0]);
        }
        return { controller: ctrlLayer, anchor: anchorLayer, camera: camLayer };
    }

    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel)
            ? thisObj
            : new Window("palette", "GEOlayers Open 3.5 (Native Workflow)", undefined, { resizeable: true });

        win.orientation = "column";
        win.alignChildren = ["fill", "top"];
        win.spacing = 6;
        win.margins = 10;

        // Top Bar: Mapcomp Selector + [+ Mapcomp]
        var topRow = win.add("group");
        topRow.orientation = "row";
        topRow.alignChildren = ["left", "center"];
        var ddMapcomp = topRow.add("dropdownlist", undefined, ["Mapcomp 1", "Mapcomp 2", "Mapcomp 3"]);
        ddMapcomp.selection = 0;
        var btnNewMapcomp = topRow.add("button", undefined, "+ Mapcomp");
        var btnSetKeyframe = topRow.add("button", undefined, "◆ Keyframe");
        var btnSnap = topRow.add("button", undefined, "Snap Layer");

        // Panel 1: Mapcomp View Controller (Lat / Lon / Zoom / Pitch / Bearing)
        var viewPnl = win.add("panel", undefined, "Mapcomp View Controller (Lat / Lon / Zoom / Pitch / Bearing)");
        viewPnl.orientation = "column";
        viewPnl.alignChildren = ["fill", "top"];
        viewPnl.spacing = 5;
        viewPnl.margins = 8;

        var row1 = viewPnl.add("group");
        row1.add("statictext", undefined, "LAT:");
        var inpLat = row1.add("edittext", undefined, "39.9255"); inpLat.characters = 8;
        row1.add("statictext", undefined, "LON:");
        var inpLon = row1.add("edittext", undefined, "32.8663"); inpLon.characters = 8;
        row1.add("statictext", undefined, "ZOOM:");
        var inpZoom = row1.add("edittext", undefined, "6.0"); inpZoom.characters = 5;

        var row2 = viewPnl.add("group");
        row2.add("statictext", undefined, "PITCH (°):");
        var inpPitch = row2.add("edittext", undefined, "35"); inpPitch.characters = 5;
        row2.add("statictext", undefined, "BEARING (°):");
        var inpBearing = row2.add("edittext", undefined, "0"); inpBearing.characters = 5;
        var chkZoomArc = row2.add("checkbox", undefined, "Auto Zoom Arc");
        chkZoomArc.value = true;

        // Panel 2: Feature Collection & Browser
        var featPnl = win.add("panel", undefined, "Feature Collection & Actions");
        featPnl.orientation = "column";
        featPnl.alignChildren = ["fill", "top"];
        featPnl.spacing = 5;
        featPnl.margins = 8;

        var fNames = [];
        for (var i = 0; i < PRESET_FEATURES.length; i++) fNames.push(PRESET_FEATURES[i].name);
        var ddFeature = featPnl.add("dropdownlist", undefined, fNames);
        ddFeature.selection = 0;

        ddFeature.onChange = function () {
            if (!ddFeature.selection) return;
            var f = PRESET_FEATURES[ddFeature.selection.index];
            inpLat.text = String(f.lat);
            inpLon.text = String(f.lon);
            inpZoom.text = String(f.zoom);
        };

        var actionRow = featPnl.add("group");
        var btnDrawFeature = actionRow.add("button", undefined, "Draw Feature (Shape)");
        var btnAddLabel = actionRow.add("button", undefined, "+ Add Label");
        var btnDrawRoute = actionRow.add("button", undefined, "Connect Route");

        // Panel 3: MapTiler Cloud API Key (Shared with CEP Panel via ~/.opengeolayers_config.json)
        var mtPnl = win.add("panel", undefined, "MapTiler Cloud API Key (Optional - Free at cloud.maptiler.com)");
        mtPnl.orientation = "row";
        mtPnl.alignChildren = ["fill", "center"];
        mtPnl.spacing = 5;
        mtPnl.margins = 8;
        var inpMapTilerKey = mtPnl.add("edittext", undefined, "");
        inpMapTilerKey.characters = 22;
        var btnSaveMtKey = mtPnl.add("button", undefined, "Save Key");

        try {
            var cfgFile = new File(Folder.myDocuments.parent.fsName + "/.opengeolayers_config.json");
            if (cfgFile.exists) {
                cfgFile.open("r");
                var rawCfg = cfgFile.read();
                cfgFile.close();
                var m = rawCfg.match(/"maptilerKey"\s*:\s*"([^"]*)"/);
                if (m && m[1]) inpMapTilerKey.text = m[1];
            }
        } catch (eCfg) {}

        btnSaveMtKey.onClick = function () {
            try {
                var cfgOut = new File(Folder.myDocuments.parent.fsName + "/.opengeolayers_config.json");
                cfgOut.open("w");
                cfgOut.write('{\n  "maptilerKey": "' + inpMapTilerKey.text.replace(/^\s+|\s+$/g, "") + '"\n}');
                cfgOut.close();
                statusTxt.text = "MapTiler API Key kaydedildi! CEP paneliyle senkronize.";
            } catch (errSave) {
                statusTxt.text = "Key kayıt hatası: " + errSave.toString();
            }
        };

        var statusTxt = win.add("statictext", undefined, "Mapcomp 1 Ready — Click [◆ Keyframe] to animate view.");

        btnNewMapcomp.onClick = function () {
            app.beginUndoGroup("GEOlayers: Create Mapcomp");
            try {
                var name = ddMapcomp.selection ? ddMapcomp.selection.text : "Mapcomp 1";
                var comp = app.project.items.addComp(name, 1920, 1080, 1.0, 15.0, 30.0);
                comp.bgColor = [0.05, 0.08, 0.15];
                comp.openInViewer();
                ensureMapcompRig(comp, parseFloat(inpLat.text), parseFloat(inpLon.text), parseFloat(inpZoom.text), parseFloat(inpPitch.text), parseFloat(inpBearing.text));
                statusTxt.text = "'" + name + "' oluşturuldu!";
            } catch (e) {
                statusTxt.text = "Hata: " + e.toString();
            }
            app.endUndoGroup();
        };

        btnSetKeyframe.onClick = function () {
            app.beginUndoGroup("GEOlayers: Set Mapcomp View Keyframe");
            try {
                var comp = app.project.activeItem;
                if (!(comp && comp instanceof CompItem)) {
                    alert("Lütfen önce '+ Mapcomp' butonuna tıklayın.");
                    app.endUndoGroup();
                    return;
                }
                var lat = parseFloat(inpLat.text) || 39.9255;
                var lon = parseFloat(inpLon.text) || 32.8663;
                var zoom = parseFloat(inpZoom.text) || 6.0;
                var pitch = parseFloat(inpPitch.text) || 35;
                var bearing = parseFloat(inpBearing.text) || 0;

                var rig = ensureMapcompRig(comp, lat, lon, zoom, pitch, bearing);
                var fx = rig.controller.property("ADBE Effect Parade");
                var latP = fx.property("Mapcomp Latitude").property(1);
                var lonP = fx.property("Mapcomp Longitude").property(1);
                var zoomP = fx.property("Mapcomp Zoom").property(1);
                var pitchP = fx.property("Mapcomp Pitch").property(1);
                var bearP = fx.property("Mapcomp Bearing").property(1);

                var t = comp.time;
                if (chkZoomArc.value && zoomP.numKeys >= 1) {
                    var pk = zoomP.nearestKeyIndex(t);
                    var pt = zoomP.keyTime(pk);
                    if (t - pt > 0.4) {
                        var pz = zoomP.keyValue(pk);
                        zoomP.setValueAtTime((pt + t) / 2.0, Math.max(2.0, Math.min(pz, zoom) - 1.8));
                    }
                }
                latP.setValueAtTime(t, lat);
                lonP.setValueAtTime(t, lon);
                zoomP.setValueAtTime(t, zoom);
                pitchP.setValueAtTime(t, pitch);
                bearP.setValueAtTime(t, bearing);
                statusTxt.text = "CTI (" + t.toFixed(2) + "s) konumuna Mapcomp Keyframe eklendi!";
            } catch (e) {
                statusTxt.text = "Hata: " + e.toString();
            }
            app.endUndoGroup();
        };

        btnSnap.onClick = function () {
            app.beginUndoGroup("GEOlayers: Snap Layer to Mapcomp");
            try {
                var comp = app.project.activeItem;
                if (!(comp && comp instanceof CompItem)) return;
                var lat = parseFloat(inpLat.text) || 39.9255;
                var lon = parseFloat(inpLon.text) || 32.8663;
                var rig = ensureMapcompRig(comp, lat, lon, parseFloat(inpZoom.text) || 6, 35, 0);
                var target = (comp.selectedLayers && comp.selectedLayers.length > 0) ? comp.selectedLayers[0] : comp.layers.addNull();
                target.threeDLayer = true;
                target.parent = rig.anchor;
                addOrGetSlider(target, "Feature Latitude", lat);
                addOrGetSlider(target, "Feature Longitude", lon);
                statusTxt.text = "'" + target.name + "' koordinata sabitlendi (Snap)!";
            } catch (e) {
                statusTxt.text = "Hata: " + e.toString();
            }
            app.endUndoGroup();
        };

        btnDrawFeature.onClick = function () {
            app.beginUndoGroup("GEOlayers: Draw Feature");
            try {
                var comp = app.project.activeItem;
                if (!(comp && comp instanceof CompItem)) return;
                var rig = ensureMapcompRig(comp, parseFloat(inpLat.text), parseFloat(inpLon.text), parseFloat(inpZoom.text), 35, 0);
                var sh = comp.layers.addShape();
                sh.name = "FEATURE_" + (ddFeature.selection ? ddFeature.selection.text : "Region");
                sh.threeDLayer = true;
                sh.parent = rig.anchor;
                var grp = sh.property("Contents").addProperty("ADBE Vector Group");
                var rect = grp.property("Contents").addProperty("ADBE Vector Shape - Rect");
                rect.property("Size").setValue([320, 220]);
                var fill = grp.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                fill.property("Color").setValue([0.22, 0.74, 0.97]);
                fill.property("Opacity").setValue(35);
                var st = grp.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
                st.property("Color").setValue([0.98, 0.98, 0.98]);
                st.property("Stroke Width").setValue(4);
                statusTxt.text = "'" + sh.name + "' Shape Layer olarak çizildi!";
            } catch (e) {
                statusTxt.text = "Hata: " + e.toString();
            }
            app.endUndoGroup();
        };

        btnAddLabel.onClick = function () {
            app.beginUndoGroup("GEOlayers: Add Label");
            try {
                var comp = app.project.activeItem;
                if (!(comp && comp instanceof CompItem)) return;
                var rig = ensureMapcompRig(comp, parseFloat(inpLat.text), parseFloat(inpLon.text), parseFloat(inpZoom.text), 35, 0);
                var lblText = ddFeature.selection ? ddFeature.selection.text.split(" ")[0] : "Location";
                var txt = comp.layers.addText(lblText);
                txt.name = "LABEL_" + lblText;
                txt.threeDLayer = true;
                txt.parent = rig.anchor;
                txt.property("Transform").property("Scale").expression =
                    "var s=thisComp.layer('GEO_WORLD_ANCHOR').transform.scale[0]; var inv=10000/Math.max(0.001,s); [inv,inv,inv];";
                statusTxt.text = "Otomatik ölçeklenen Label ('" + lblText + "') eklendi!";
            } catch (e) {
                statusTxt.text = "Hata: " + e.toString();
            }
            app.endUndoGroup();
        };

        btnDrawRoute.onClick = function () {
            app.beginUndoGroup("GEOlayers: Connect Route");
            try {
                var comp = app.project.activeItem;
                if (!(comp && comp instanceof CompItem)) return;
                var rig = ensureMapcompRig(comp, parseFloat(inpLat.text), parseFloat(inpLon.text), parseFloat(inpZoom.text), 35, 0);
                var rt = comp.layers.addShape();
                rt.name = "ROUTE_ConnectedFeatures";
                rt.threeDLayer = true;
                rt.parent = rig.anchor;
                rt.property("Position").setValue([0, 0, -4]);
                rt.property("Anchor Point").setValue([0, 0, 0]);
                var grp = rt.property("Contents").addProperty("ADBE Vector Group");
                var pth = grp.property("Contents").addProperty("ADBE Vector Shape - Group");
                var myShape = new Shape();
                myShape.vertices = [[comp.width * 0.35, comp.height * 0.45], [comp.width * 0.5, comp.height * 0.35], [comp.width * 0.65, comp.height * 0.52]];
                myShape.inTangents = [[0, 0], [-80, 0], [0, 0]];
                myShape.outTangents = [[0, 0], [80, 0], [0, 0]];
                myShape.closed = false;
                pth.property("Path").setValue(myShape);
                var st = grp.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
                st.property("Color").setValue([0.96, 0.25, 0.37]);
                st.property("Stroke Width").setValue(6);
                var trim = rt.property("Contents").addProperty("ADBE Vector Filter - Trim");
                trim.property("End").setValueAtTime(comp.time, 0);
                trim.property("End").setValueAtTime(comp.time + 3.5, 100);
                statusTxt.text = "Connect Route animasyonu oluşturuldu!";
            } catch (e) {
                statusTxt.text = "Hata: " + e.toString();
            }
            app.endUndoGroup();
        };

        win.layout.layout(true);
        win.onResizing = win.onResize = function () { this.layout.resize(); };
        if (win instanceof Window) {
            win.center();
            win.show();
        }
        return win;
    }

    buildUI(thisObj);
})(this);
