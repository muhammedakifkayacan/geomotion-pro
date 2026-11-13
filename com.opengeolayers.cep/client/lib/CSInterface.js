/**
 * Adobe CEP CSInterface Library (v11.0 Compatible)
 * Open-Source Standalone Wrapper for Adobe After Effects CEP Panels
 * Automatically detects CEP Host vs Browser Standalone Preview mode.
 */
(function (window) {
    'use strict';

    function CSInterface() {
        this.hostEnvironment = window.__adobe_cep__
            ? JSON.parse(window.__adobe_cep__.getHostEnvironment())
            : null;
    }

    CSInterface.prototype.isInsideAE = function () {
        return typeof window.__adobe_cep__ !== 'undefined';
    };

    CSInterface.prototype.evalScript = function (script, callback) {
        if (typeof callback !== 'function') {
            callback = function () {};
        }
        if (window.__adobe_cep__) {
            window.__adobe_cep__.evalScript(script, callback);
        } else {
            console.log('[Simulated AE ExtendScript Call]:', script.substring(0, 140) + '...');
            setTimeout(function () {
                callback(JSON.stringify({
                    ok: true,
                    simulated: true,
                    message: 'Tarayıcı Önizleme Modu: Komut başarıyla simüle edildi (After Effects içinde gerçek katman oluşturur).'
                }));
            }, 350);
        }
    };

    CSInterface.prototype.getSystemPath = function (pathType) {
        if (window.__adobe_cep__) {
            return window.__adobe_cep__.getSystemPath(pathType);
        }
        return '/tmp/OpenGeoLayersCache';
    };

    CSInterface.prototype.openURLInDefaultBrowser = function (url) {
        if (window.cep && window.cep.util && window.cep.util.openURLInDefaultBrowser) {
            window.cep.util.openURLInDefaultBrowser(url);
        } else {
            window.open(url, '_blank');
        }
    };

    CSInterface.prototype.addEventListener = function (type, listener, obj) {
        if (window.__adobe_cep__) {
            window.__adobe_cep__.addEventListener(type, listener, obj);
        }
    };

    var SystemPath = {
        USER_DATA: "userData",
        COMMON_FILES: "commonFiles",
        MY_DOCUMENTS: "myDocuments",
        APPLICATION: "application",
        EXTENSION: "extension",
        HOST_APPLICATION: "hostApplication"
    };
    window.SystemPath = SystemPath;
    CSInterface.prototype.SystemPath = SystemPath;

    window.CSInterface = CSInterface;
})(window);
