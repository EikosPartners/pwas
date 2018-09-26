(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("tick42-glue", [], factory);
	else if(typeof exports === 'object')
		exports["tick42-glue"] = factory();
	else
		root["tick42-glue"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 69);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// some small useful functions (so we don't reference underscore or lodash)
Object.defineProperty(exports, "__esModule", { value: true });
function isNumber(arg) {
    return typeof arg === "number";
}
exports.isNumber = isNumber;
function isString(arg) {
    return typeof arg === "string";
}
exports.isString = isString;
function isObject(arg) {
    return typeof arg === "object" && arg !== null;
}
exports.isObject = isObject;
function isArray(arg) {
    // TODO optimize
    if (Array.isArray) {
        return Array.isArray(arg);
    }
    return toString.call(arg) === "[object Array]";
}
exports.isArray = isArray;
function isUndefined(arg) {
    return typeof arg === "undefined";
}
exports.isUndefined = isUndefined;
function isUndefinedOrNull(arg) {
    return !arg || typeof arg === "undefined";
}
exports.isUndefinedOrNull = isUndefinedOrNull;
/**
 *  Checks if an object is empty (has no properties)
 * @private
 */
function isEmpty(arg) {
    for (var prop in arg) {
        if (arg.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
}
exports.isEmpty = isEmpty;
function isFunction(arg) {
    return !!(arg && arg.constructor && arg.call && arg.apply);
}
exports.isFunction = isFunction;
function some(array, predicate) {
    for (var index = 0; index < array.length; index++) {
        if (predicate(array[index], index)) {
            return true;
        }
    }
    return false;
}
exports.some = some;
function first(array, predicate) {
    for (var index = 0; index < array.length; index++) {
        if (predicate(array[index], index)) {
            return array[index];
        }
    }
    return undefined;
}
exports.first = first;
function ifNotUndefined(what, doWithIt) {
    if (typeof what !== "undefined") {
        doWithIt(what);
    }
}
exports.ifNotUndefined = ifNotUndefined;
function promisify(promise, successCallback, errorCallback) {
    "use strict";
    if (typeof successCallback !== "function" && typeof errorCallback !== "function") {
        return promise;
    }
    if (typeof successCallback !== "function") {
        successCallback = function () { return; };
    }
    else if (typeof errorCallback !== "function") {
        errorCallback = function () { return; };
    }
    promise.then(successCallback, errorCallback);
}
exports.promisify = promisify;
//# sourceMappingURL=util.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function createRegistry() {
    var callbacks = {};
    function add(key, callback) {
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey) {
            callbacksForKey = [];
            callbacks[key] = callbacksForKey;
        }
        callbacksForKey.push(callback);
        return function () {
            var allForKey = callbacks[key];
            if (!allForKey) {
                return;
            }
            allForKey = allForKey.filter(function (item) {
                return item !== callback;
            });
            callbacks[key] = allForKey;
        };
    }
    function execute(key) {
        var argumentsArr = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            argumentsArr[_i - 1] = arguments[_i];
        }
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey || callbacksForKey.length === 0) {
            return [];
        }
        var results = [];
        callbacksForKey.forEach(function (callback) {
            try {
                var result = callback.apply(undefined, argumentsArr);
                results.push(result);
            }
            catch (err) {
                results.push(undefined);
            }
        });
        return results;
    }
    function clear() {
        callbacks = {};
    }
    return {
        add: add,
        execute: execute,
        clear: clear
    };
}
;
createRegistry.default = createRegistry;
module.exports = createRegistry;
//# sourceMappingURL=index.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EntityEvent = /** @class */ (function () {
    function EntityEvent(entitiy, context) {
        this.entity = entitiy;
        this.context = context;
    }
    return EntityEvent;
}());
exports.EntityEvent = EntityEvent;
var EntityEventContext = /** @class */ (function () {
    function EntityEventContext(eventType) {
        this.type = eventType;
    }
    return EntityEventContext;
}());
exports.EntityEventContext = EntityEventContext;
var ActivityStatusChangeEventContext = /** @class */ (function (_super) {
    __extends(ActivityStatusChangeEventContext, _super);
    function ActivityStatusChangeEventContext(newStatus, oldStatus) {
        var _this = _super.call(this, EntityEventType.StatusChange) || this;
        _this.newStatus = newStatus;
        _this.oldStatus = oldStatus;
        return _this;
    }
    return ActivityStatusChangeEventContext;
}(EntityEventContext));
exports.ActivityStatusChangeEventContext = ActivityStatusChangeEventContext;
var ActivityContextChangedEventContext = /** @class */ (function (_super) {
    __extends(ActivityContextChangedEventContext, _super);
    function ActivityContextChangedEventContext(context) {
        var _this = _super.call(this, EntityEventType.ActivityContextChange) || this;
        _this.context = typeof context === "string" ? JSON.parse(context) : context;
        return _this;
    }
    return ActivityContextChangedEventContext;
}(EntityEventContext));
exports.ActivityContextChangedEventContext = ActivityContextChangedEventContext;
var EntityEventType = /** @class */ (function () {
    function EntityEventType() {
    }
    EntityEventType.Added = "added";
    EntityEventType.Removed = "removed";
    EntityEventType.Updated = "updated";
    EntityEventType.Closed = "closed";
    EntityEventType.StatusChange = "statusChange";
    EntityEventType.ActivityContextChange = "activityContextUpdate";
    EntityEventType.ActivityWindowEvent = "activityWindowEvent";
    // #deleteme TODO: these are not implemented in HC
    EntityEventType.ActivityWindowJoinedActivity = "joined";
    EntityEventType.ActivityWindowLeftActivity = "left";
    return EntityEventType;
}());
exports.EntityEventType = EntityEventType;
var ActivityState = /** @class */ (function () {
    function ActivityState() {
    }
    ActivityState.Created = "created";
    ActivityState.Started = "started";
    ActivityState.Destroyed = "destroyed";
    return ActivityState;
}());
exports.ActivityState = ActivityState;
//# sourceMappingURL=entityEvent.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* tslint:disable */
Object.defineProperty(exports, "__esModule", { value: true });
var util = __webpack_require__(0);
var LogLevel = /** @class */ (function () {
    function LogLevel() {
    }
    LogLevel.Trace = "trace";
    LogLevel.Debug = "debug";
    LogLevel.Info = "info";
    LogLevel.Warn = "warn";
    LogLevel.Error = "error";
    return LogLevel;
}());
exports.LogLevel = LogLevel;
var Logger = /** @class */ (function () {
    function Logger(name) {
        this._name = name;
        // we have a glue logger let's create a new logger for it
        if (!util.isUndefinedOrNull(Logger.GlueLogger)) {
            this._glueLogger = Logger.GlueLogger.subLogger(name);
        }
    }
    Logger.GetNamed = function (name) {
        return new Logger(name);
    };
    Logger.Get = function (owner) {
        return new Logger(Logger.GetTypeName(owner));
    };
    Logger.prototype.trace = function (message) {
        if (!util.isUndefinedOrNull(this._glueLogger)) {
            this._glueLogger.trace(message);
        }
        else {
            if (Logger.Level === LogLevel.Trace) {
                console.info(this._getMessage(message, LogLevel.Trace));
            }
        }
    };
    Logger.prototype.debug = function (message) {
        if (!util.isUndefinedOrNull(this._glueLogger)) {
            this._glueLogger.debug(message);
        }
        else {
            if (Logger.Level === LogLevel.Debug ||
                Logger.Level === LogLevel.Trace) {
                console.info(this._getMessage(message, LogLevel.Debug));
            }
        }
    };
    Logger.prototype.info = function (message) {
        if (!util.isUndefinedOrNull(this._glueLogger)) {
            this._glueLogger.info(message);
        }
        else {
            if (Logger.Level === LogLevel.Debug ||
                Logger.Level === LogLevel.Trace ||
                Logger.Level === LogLevel.Info) {
                console.info(this._getMessage(message, LogLevel.Info));
            }
        }
    };
    Logger.prototype.warn = function (message) {
        if (!util.isUndefinedOrNull(this._glueLogger)) {
            this._glueLogger.warn(message);
        }
        else {
            if (Logger.Level === LogLevel.Debug ||
                Logger.Level === LogLevel.Trace ||
                Logger.Level === LogLevel.Info ||
                Logger.Level === LogLevel.Warn) {
                console.info(this._getMessage(message, LogLevel.Info));
            }
        }
    };
    Logger.prototype.error = function (message) {
        if (!util.isUndefinedOrNull(this._glueLogger)) {
            this._glueLogger.error(message);
        }
        else {
            console.error(this._getMessage(message, LogLevel.Error));
            console.trace();
        }
    };
    Logger.prototype._getMessage = function (message, level) {
        return "[" + level + "] " + this._name + " - " + message;
    };
    /**
     * Returns the function name for a given object (same as constructor.name but cross-browser)
     */
    Logger.GetTypeName = function (object) {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec(object.constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    };
    Logger.Level = LogLevel.Info;
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CallbackFactory = __webpack_require__(1);
var WindowStore = /** @class */ (function () {
    function WindowStore() {
        this.waitForTimeoutInMilliseconds = 60000;
        this._windows = {};
        this._pendingWindows = {};
        this._pendingWindowsStates = {};
        this._registry = CallbackFactory();
    }
    WindowStore.prototype.init = function (logger) {
        this._logger = logger;
    };
    // Returns a window which either in Ready OR NOT 'ready' state (when the window is NOT marked with readyToShow)
    WindowStore.prototype.get = function (id) {
        return this._windows[id] || this._pendingWindows[id];
    };
    // Returns a window which is in 'ready' state (when the window is marked with readyToShow)
    WindowStore.prototype.getIfReady = function (id) {
        return this._windows[id];
    };
    Object.defineProperty(WindowStore.prototype, "list", {
        get: function () {
            return this._windows;
        },
        enumerable: true,
        configurable: true
    });
    WindowStore.prototype.add = function (window) {
        var isExist = this._pendingWindows[window.API.id] ? true : false;
        if (isExist) {
            this._logger.error("trying to add window with id " + window.API.id + " from windowStore, which already exists");
            return;
        }
        this._pendingWindows[window.API.id] = window;
        this._pendingWindowsStates[window.API.id] = {
            ready: false,
            urlChanged: false,
        };
        this._registry.execute("on-added", window);
    };
    WindowStore.prototype.remove = function (window) {
        delete this._windows[window.API.id];
        delete this._pendingWindows[window.API.id];
        delete this._pendingWindowsStates[window.API.id];
        this._registry.execute("on-removed", window);
    };
    WindowStore.prototype.setReadyState = function (windowId) {
        var targetWindowState = this._pendingWindowsStates[windowId];
        if (typeof targetWindowState === "undefined") {
            return;
        }
        targetWindowState.ready = true;
        if (targetWindowState.urlChanged) {
            this.markReadyToShow(windowId);
        }
    };
    WindowStore.prototype.setUrlChangedState = function (windowId) {
        var targetWindowState = this._pendingWindowsStates[windowId];
        if (typeof targetWindowState === "undefined") {
            return;
        }
        targetWindowState.urlChanged = true;
        if (targetWindowState.ready) {
            this.markReadyToShow(windowId);
        }
    };
    WindowStore.prototype.waitFor = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var un;
            var timeout = setTimeout(function () {
                un();
                reject("waitFor timed out.");
            }, _this.waitForTimeoutInMilliseconds);
            var win = _this._windows[id];
            if (win) {
                clearTimeout(timeout);
                resolve(win.API);
            }
            else {
                un = _this.onReadyWindow(function (w) {
                    if (w.API.id !== id) {
                        return;
                    }
                    clearTimeout(timeout);
                    un();
                    resolve(w.API);
                });
            }
        });
    };
    WindowStore.prototype.onReadyWindow = function (callback) {
        return this._registry.add("on-ready", callback);
    };
    WindowStore.prototype.onAdded = function (callback) {
        return this._registry.add("on-added", callback);
    };
    WindowStore.prototype.onRemoved = function (callback) {
        return this._registry.add("on-removed", callback);
    };
    // newly created windows now need to hear both "ready" and "urlChanged" events in otder to be markedReadyToShow
    WindowStore.prototype.markReadyToShow = function (windowId) {
        if (this._pendingWindows[windowId]) {
            this._windows[windowId] = this._pendingWindows[windowId];
            delete this._pendingWindows[windowId];
            delete this._pendingWindowsStates[windowId];
        }
        this._registry.execute("on-ready", this._windows[windowId]);
    };
    return WindowStore;
}());
exports.WindowStore = WindowStore;
exports.default = new WindowStore();
//# sourceMappingURL=store.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ShutdownMethodName = "T42.ACS.Shutdown";
exports.FeedackMethodName = "T42.ACS.Feedback";
exports.GetConfigurationRegionMethodName = "T42.ACS.GetConfigurationRegion";
exports.SetConfigurationRegionMethodName = "T42.ACS.SetConfigurationRegion";
exports.GetUserMethodName = "T42.ACS.GetUser";
exports.GetBranchesMethodName = "T42.ACS.GetBranches";
exports.GetCurrentBranchMethodName = "T42.ACS.GetCurrentBranch";
exports.SetCurrentBranchMethodName = "T42.ACS.SetCurrentBranch";
exports.GetFunctionalEntitlementMethodName = "T42.ACS.GetFunctionalEntitlement";
exports.CanIMethodName = "T42.ACS.CanI";
exports.StartApplicationMethodName = "T42.ACS.StartApplication";
exports.StopApplicationMethodName = "T42.ACS.StopApplication";
exports.ActivateApplicationMethodName = "T42.ACS.ActivateApplication";
exports.RunApplicationMethodName = "T42.ACS.RunApplication";
exports.OnEventMethodName = "T42.ACS.OnEvent";
exports.GetApplicationsMethodName = "T42.ACS.GetApplications";
//# sourceMappingURL=agm-names.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomFromSeed = __webpack_require__(35);

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

module.exports = {
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base class for activity entities with reference to the activity manager
 * @private
 */
var ActivityEntity = /** @class */ (function () {
    function ActivityEntity(id) {
        this._id = id;
    }
    Object.defineProperty(ActivityEntity.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the properties of the current object using the properties of another object
     * These two should have the same id.
     */
    ActivityEntity.prototype._update = function (other) {
        if (other._id !== this._id) {
            throw Error("Can not update from entity with different id.");
        }
        this._updateCore(other);
    };
    ActivityEntity.prototype._updateCore = function (other) {
        return;
    };
    ActivityEntity.prototype._beforeDelete = function (other) {
        return;
    };
    return ActivityEntity;
}());
exports.default = ActivityEntity;
//# sourceMappingURL=activityEntity.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util = __webpack_require__(0);
var nextTick = function (cb) {
    setTimeout(cb, 0);
};
/**
 * Convert a Promise to node style callback
 * @private
 */
function nodeify(promise, callback) {
    if (!util.isFunction(callback)) {
        return promise;
    }
    promise.then(function (resp) {
        nextTick(function () {
            callback(null, resp);
        });
    }, function (err) {
        nextTick(function () {
            callback(err, null);
        });
    });
}
exports.nodeify = nodeify;
//# sourceMappingURL=promiseExtensions.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util = __webpack_require__(0);
var util_1 = __webpack_require__(0);
// A helper class that provides lame activity AGM implementation
// Can be initialized with or without activity - in case no activity (independent windows outside activity) only
// subset of the methods work
var ActivityAGM = /** @class */ (function () {
    function ActivityAGM(activity) {
        this._activity = activity;
    }
    ActivityAGM.prototype.register = function (definition, handler) {
        this._ensureHasAgm();
        ActivityAGM.AGM.register(definition, handler);
    };
    ActivityAGM.prototype.servers = function () {
        this._ensureHasAgm();
        if (util.isUndefinedOrNull(this._activity)) {
            // or return ActivityAGM.AGM.servers()
            return [];
        }
        return this._activity.windows.map(function (w) {
            return w.instance;
        });
    };
    ActivityAGM.prototype.methods = function () {
        var _this = this;
        this._ensureHasAgm();
        if (util.isUndefinedOrNull(this._activity)) {
            // or return ActivityAGM.AGM.methods()
            return [];
        }
        var windows = this._activity.windows;
        var methodNames = [];
        var methods = [];
        // get all windows and their methods, then assemble distinct methods
        windows.forEach(function (window) {
            var windowMethods = _this.methodsForWindow(window);
            windowMethods.forEach(function (currentWindowMethod) {
                if (methodNames.indexOf(currentWindowMethod.name) === -1) {
                    methodNames.push(currentWindowMethod.name);
                    methods.push(currentWindowMethod);
                }
            });
        });
        return methods;
    };
    ActivityAGM.prototype.methodsForWindow = function (window) {
        this._ensureHasAgm();
        // get instance and use agm to get methods for instance
        if (!window.instance) {
            return [];
        }
        return ActivityAGM.AGM.methodsForInstance(window.instance);
    };
    /** Possible invoke targets
     *
     * "activity.all" - [default]
     * "activity.best"
     * ActivityWindow
     * [ActivityWindow] -
     *
     * classic AGM
     * "all" - agm all
     * "best" - agm best
     * instance - agm
     * [ instances ]
     *
     */
    ActivityAGM.prototype.invoke = function (methodName, arg, target, options, success, error) {
        this._ensureHasAgm();
        var activityServers = this.servers();
        var serversToInvokeAgainst = [];
        if (util.isUndefinedOrNull(target)) {
            target = "activity.all";
        }
        if (util.isString(target)) {
            if (target === "activity.all") {
                serversToInvokeAgainst = activityServers;
            }
            else if (target === "activity.best") {
                var potentialTargets = activityServers.filter(function (server) {
                    var methods = ActivityAGM.AGM.methodsForInstance(server);
                    return methods.filter(function (m) {
                        return m.name === methodName;
                    }).length > 0;
                });
                if (potentialTargets.length > 0) {
                    serversToInvokeAgainst = [potentialTargets[0]];
                }
            }
            else if (target === "all" || target === "best") {
                return util_1.promisify(ActivityAGM.AGM.invoke(methodName, arg, target, options), success, error);
            }
            else {
                throw new Error("Invalid invoke target " + target);
            }
        }
        else if (util.isArray(target)) {
            // if the array is not empty
            if (target.length >= 0) {
                var firstElem = target[0];
                // check argument type
                if (this._isInstance(firstElem)) {
                    serversToInvokeAgainst = target.map(function (instance) { return instance; });
                }
                else if (this._isActivityWindow(firstElem)) {
                    serversToInvokeAgainst = target.map(function (win) { return win.instance; });
                }
                else {
                    throw new Error("Unknown target object");
                }
            }
        }
        else {
            if (this._isInstance(target)) {
                serversToInvokeAgainst = [target];
            }
            else if (this._isActivityWindow(target)) {
                serversToInvokeAgainst = [target.instance];
            }
            else {
                throw new Error("Unknown target object");
            }
        }
        throw new Error("Not implemented");
        // return promisify(ActivityAGM.AGM.invoke(methodName, arg, serversToInvokeAgainst, options), success, error);
    };
    ActivityAGM.prototype.unregister = function (definition) {
        this._ensureHasAgm();
        return ActivityAGM.AGM.unregister(definition);
    };
    ActivityAGM.prototype.createStream = function (methodDefinition, subscriptionAddedHandler, subscriptionRemovedHandler) {
        this._ensureHasAgm();
        ActivityAGM.AGM.createStream(methodDefinition, {
            subscriptionAddedHandler: subscriptionAddedHandler,
            subscriptionRemovedHandler: subscriptionRemovedHandler,
            subscriptionRequestHandler: undefined
        });
    };
    ActivityAGM.prototype.subscribe = function (methodDefinition, parameters, target) {
        this._ensureHasAgm();
        // #deleteme TODO: check servers needed?
        // const servers = this.servers();
        return ActivityAGM.AGM.subscribe(methodDefinition, parameters);
    };
    ActivityAGM.prototype._ensureHasAgm = function () {
        if (util.isUndefinedOrNull(ActivityAGM.AGM)) {
            throw new Error("Agm should be configured to be used in activity");
        }
    };
    ActivityAGM.prototype._isInstance = function (obj) {
        // lame check
        return obj.application !== undefined;
    };
    ActivityAGM.prototype._isActivityWindow = function (obj) {
        return obj.instance !== undefined;
    };
    return ActivityAGM;
}());
exports.ActivityAGM = ActivityAGM;
//# sourceMappingURL=activityAGM.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var activityEntity_1 = __webpack_require__(7);
var util_1 = __webpack_require__(0);
/**
 * An activity type is a definition template for an activity, consisting of a collection of window types,
 * their layout and an initial activity context.
 *
 * @module activityType
 */
var ActivityType = /** @class */ (function (_super) {
    __extends(ActivityType, _super);
    function ActivityType(name, ownerWindow, helperWindows, description) {
        var _this = _super.call(this, name) || this;
        _this._name = name;
        _this._description = description;
        _this._ownerWindow = ownerWindow;
        _this._helperWindows = helperWindows || [];
        return _this;
    }
    Object.defineProperty(ActivityType.prototype, "name", {
        /**
         * @var {string} name Name of the activity type
         */
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityType.prototype, "description", {
        /**
         * @var {string} description description for the activity type
         */
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityType.prototype, "helperWindows", {
        /**
         * A list of window types that should be created when initiating a new instance of that activity type
         * @var {windowDefinition[]} helperWindows
         */
        get: function () {
            return this._helperWindows;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityType.prototype, "ownerWindow", {
        /**
         * @var {windowDefinition} ownerWindow Returns the definition of the owner window for that activity type
         */
        get: function () {
            return this._ownerWindow;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initiates a new activity of this type
     *
     * @function initiate
     * @param {object} context The initial context to be used for the new activity
     * @param callback
     * @param configuration
     * @returns {Promise<activity>}
     */
    ActivityType.prototype.initiate = function (context, callback, configuration) {
        return this._manager.initiate(this._name, context, callback, configuration);
    };
    ActivityType.prototype._updateCore = function (other) {
        var _this = this;
        _super.prototype._updateCore.call(this, other);
        util_1.ifNotUndefined(other._description, function (x) { return _this._description = x; });
        util_1.ifNotUndefined(other._ownerWindow, function (x) { return _this._ownerWindow = x; });
        util_1.ifNotUndefined(other._helperWindows, function (x) { return _this._helperWindows = x; });
    };
    return ActivityType;
}(activityEntity_1.default));
exports.default = ActivityType;
//# sourceMappingURL=activityType.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function objectValues(source) {
    if (!source) {
        return [];
    }
    return Object.keys(source).map(function (key) { return source[key]; });
}
exports.objectValues = objectValues;
function objectClone(obj) {
    var result;
    try {
        result = JSON.parse(JSON.stringify(obj || {}));
    }
    catch (error) {
        result = {};
    }
    return result;
}
exports.objectClone = objectClone;
//# sourceMappingURL=helper.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomByte = __webpack_require__(34);

function encode(lookup, number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + lookup( ( (number >> (4 * loopCounter)) & 0x0f ) | randomByte() );
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = encode;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var entityEvent_1 = __webpack_require__(2);
var activityStatus_1 = __webpack_require__(14);
var activityType_1 = __webpack_require__(10);
var windowType_1 = __webpack_require__(17);
var activity_1 = __webpack_require__(15);
var activityWindow_1 = __webpack_require__(16);
var logger_1 = __webpack_require__(3);
var readyMarker_1 = __webpack_require__(18);
var util = __webpack_require__(0);
/**
 * HtmlContainer (HC) bridge
 * @private
 * @module hcBridge
 */
var HCBridge = /** @class */ (function () {
    function HCBridge(agm, windows, appManagerGetter, mode, typesToTrack) {
        // HC constants
        this._activityTypeEntityName = "activityType";
        this._windowTypeEntityName = "windowType";
        this._activityEntityName = "activity";
        this._windowEntityName = "activityWindow";
        this._logger = logger_1.Logger.Get("hcBridge");
        // event sequences
        this._lastSeq = 0;
        this._eventQueue = [];
        this._activityTypeCallbacks = [];
        this._windowTypeCallbacks = [];
        this._activityCallbacks = [];
        this._windowCallbacks = [];
        this._agm = agm;
        this._windows = windows;
        this._appManagerGetter = appManagerGetter;
        this._mode = mode;
        this._typesToTrack = typesToTrack;
    }
    /**
     *  Convert an ActivityType entity coming from HC to ActivityType
     */
    HCBridge._hcToJsActivityType = function (hcActType) {
        return new activityType_1.default(hcActType.name, hcActType.ownerWindowType, hcActType.helperWindowTypes, hcActType.description);
    };
    HCBridge._getURLParameter = function (name) {
        return decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [, ""])[1].replace(/\+/g, "%20")) || null;
    };
    Object.defineProperty(HCBridge.prototype, "bridgeType", {
        get: function () {
            return "HC";
        },
        enumerable: true,
        configurable: true
    });
    HCBridge.prototype.joinActivity = function (activityId, windowId) {
        throw new Error("Not implemented");
    };
    HCBridge.prototype.leaveActivity = function (activityId, windowId) {
        throw new Error("Not implemented");
    };
    HCBridge.prototype.init = function () {
        var _this = this;
        this._readyMarker = new readyMarker_1.ReadyMarker("HC Bridge", 1);
        this._htmlContainer = window.htmlContainer.activityFacade;
        if (this._htmlContainer.subscribeForJoinBreakEvents) {
            this._htmlContainer.subscribeForJoinBreakEvents(function (e) {
                _this._handleGenericEvents(e);
            });
        }
        var options = this._agm ? this._agm.instance : undefined;
        var initFunc = this._htmlContainer.init;
        if (this._htmlContainer.init2) {
            initFunc = this._htmlContainer.init2;
            options = {
                jsAgmInstance: options,
                glueVersion: 3,
                mode: this._mode,
                typesToTrack: this._typesToTrack
            };
        }
        initFunc(options, this._hcEventHandler.bind(this), // event listener
        function () {
            _this._readyMarker.signal("Init done from HC");
        }, function (error) {
            _this._readyMarker.error(error);
        });
    };
    HCBridge.prototype.ready = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._readyMarker.setCallback(function (err) {
                if (!err) {
                    resolve(_this);
                }
                else {
                    _this._logger.error("Error initializing HC bridge - " + err);
                    reject(_this._readyMarker.getError());
                }
            });
        });
    };
    HCBridge.prototype._handleGenericEvents = function (event) {
        this._processEventBySeq(event);
    };
    HCBridge.prototype._hcEventHandler = function (eventJson) {
        this._logger.trace(eventJson);
        var event = JSON.parse(eventJson);
        this._processEventBySeq(event);
    };
    HCBridge.prototype._processEventBySeq = function (event) {
        var seq = event.sequence;
        if (seq === this._lastSeq + 1) {
            // if this is the event we expect process it
            this._processEvent(event);
            this._lastSeq++;
            // empty the next items in the queue - if any
            var nextEvent = this._eventQueue[seq + 1];
            if (!util.isUndefined(nextEvent)) {
                this._logger.debug("replaying message number " + seq);
                this._processEventBySeq(nextEvent);
                delete this._eventQueue[seq + 1];
            }
        }
        else {
            // save in the queue
            this._eventQueue[seq] = event;
            this._logger.debug("Got out of order event with number " + seq + ". Will wait for previous event(s) before replaying.");
        }
    };
    HCBridge.prototype._processEvent = function (event) {
        if (event.genericEvent) {
            this._processGenericEvent(event);
            return;
        }
        var entityType = event.entityType;
        var eventContext = this._convertContext(event.context);
        var entity;
        switch (entityType) {
            case this._activityTypeEntityName:
                entity = HCBridge._hcToJsActivityType(event.entity);
                this._publishActivityTypeStatusChange(entity, eventContext);
                break;
            case this._windowTypeEntityName:
                entity = this._hcToJsWindowType(event.entity);
                this._publishWindowTypeStatusChange(entity, eventContext);
                break;
            case this._activityEntityName:
                entity = this._hcToJsActivity(event.entity);
                this._publishActivityStatusChange(entity, eventContext);
                break;
            case this._windowEntityName:
                entity = this._hcToJsWindow(event.entity);
                this._publishActivityWindowEvent(entity, eventContext);
                break;
        }
    };
    HCBridge.prototype._processGenericEvent = function (event) {
        var info = event.data;
        if (event.type === "ActivitiesAttached") {
            if (this._activitiesAttachedHandler) {
                this._activitiesAttachedHandler(info);
            }
        }
        else if (event.type === "ActivitiesDetached") {
            if (this._activitiesDetached) {
                this._activitiesDetached(info);
            }
        }
        else if (event.type === "ActivityAttachedDescriptorsRefreshed") {
            if (this._activityAttachedDescriptorsRefreshed) {
                this._activityAttachedDescriptorsRefreshed(info);
            }
        }
    };
    HCBridge.prototype._convertContext = function (hcContext) {
        if (hcContext.type === entityEvent_1.EntityEventType.StatusChange) {
            var oldStatus = new activityStatus_1.ActivityStatus(hcContext.oldStatus.state, hcContext.oldStatus.statusMessage, hcContext.oldStatus.statusTime);
            var newStatus = new activityStatus_1.ActivityStatus(hcContext.newStatus.state, hcContext.newStatus.statusMessage, hcContext.newStatus.statusTime);
            return new entityEvent_1.ActivityStatusChangeEventContext(newStatus, oldStatus);
        }
        else if (hcContext.type === entityEvent_1.EntityEventType.ActivityWindowEvent) {
            return new entityEvent_1.EntityEventContext(hcContext.event);
        }
        else if (hcContext.type === entityEvent_1.EntityEventType.ActivityContextChange) {
            return new entityEvent_1.ActivityContextChangedEventContext(hcContext.newContext);
        }
        return new entityEvent_1.EntityEventContext(hcContext.type);
    };
    /**
     *  Convert an Activity entity from HC to Activity
     */
    HCBridge.prototype._hcToJsActivity = function (hcAct) {
        var window = hcAct.owner ? this._hcToJsWindow(hcAct.owner) : null;
        var windowId = window ? window.id : null;
        var status = new activityStatus_1.ActivityStatus(hcAct.status.state, hcAct.status.statusMessage, hcAct.status.statusTime);
        var context = JSON.parse(hcAct.context);
        return new activity_1.default(hcAct.id, hcAct.type.name, status, context, windowId);
    };
    /**
     *  Convert a WindowType entity coming from HC to WindowType
     */
    HCBridge.prototype._hcToJsWindowType = function (hcWinType) {
        var _this = this;
        if (util.isUndefined(hcWinType.factories)) {
            hcWinType.factories = [];
        }
        // lazy init
        if (!this._appByWindowTypeGetter) {
            if (!this._appManagerGetter) {
                this._appByWindowTypeGetter = function () { return undefined; };
            }
            this._appByWindowTypeGetter = function (wt) {
                var appMgr = _this._appManagerGetter();
                return appMgr.applications().filter(function (app) { return app.activityWindowType === wt; })[0];
            };
        }
        return new windowType_1.default(hcWinType.name, this._appByWindowTypeGetter);
    };
    // /** Convert a WindowFactory entity coming from HC to WindowFactory */
    // static _hcToJsWindowTypeFactory(hcWinTypeFactory: any): WindowFactory {
    //   return new ProxyWindowFactory(hcWinTypeFactory.description);
    // }
    HCBridge.prototype.getActivityTypes = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // get all from HC
            _this._htmlContainer.getActivityTypes(function (infos) {
                // transform to Activity Js Entities
                var result = infos.map(function (info) { return HCBridge._hcToJsActivityType(info); });
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    };
    HCBridge.prototype.registerActivityType = function (activityTypeName, ownerWindow, helperWindows, layoutConfig, description) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (helperWindows === undefined) {
                helperWindows = [];
            }
            var config = {
                name: activityTypeName,
                ownerWindowType: ownerWindow,
                helperWindowTypes: helperWindows,
                description: description,
                layoutConfig: JSON.stringify(layoutConfig)
            };
            // pass create request to HC
            _this._htmlContainer.registerActivityType(JSON.stringify(config), function (info) {
                // transform to Activity Js Entity
                var newActivityType = HCBridge._hcToJsActivityType(info);
                resolve(newActivityType);
            }, function (error) {
                reject(error);
            });
        });
    };
    HCBridge.prototype.unregisterActivityType = function (activityTypeName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // pass create request to HC
            _this._htmlContainer.unregisterActivityType(activityTypeName, 
            /*( info )*/ function () {
                resolve();
            }, function (error) {
                reject(error);
            });
        });
    };
    HCBridge.prototype.getWindowTypes = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // get all from HC
            _this._htmlContainer.getWindowTypes(function (infos) {
                // transform to Activity Js Entities
                var result = infos.map(function (info) { return _this._hcToJsWindowType(info); });
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    };
    HCBridge.prototype.registerWindowFactory = function (windowTypeName, factory, parameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (util.isUndefinedOrNull(windowTypeName)) {
                reject("windowTypeName should be provided");
                return;
            }
            // pass create request to HC
            _this._htmlContainer.registerWindowFactory(windowTypeName, factory.create.bind(factory), 
            /*(info)*/ function () {
                resolve();
            }, function (error) {
                reject(error);
            });
        });
    };
    HCBridge.prototype.initiateActivity = function (activityType, context, configuration) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (util.isUndefinedOrNull(activityType)) {
                reject("windowTypeName should be provided");
                return;
            }
            if (util.isUndefinedOrNull(context)) {
                context = {};
            }
            // pass create request to HC
            _this._htmlContainer.initiate(activityType, JSON.stringify(context), function (activityId) {
                resolve(activityId);
            }, function (error) {
                reject(error);
            });
        });
    };
    HCBridge.prototype.getAnnouncementInfo = function () {
        var hc = window.htmlContainer;
        var context = hc.getContext();
        var result = { activityWindowId: "", activityWindowType: "", activityWindowIndependent: false, activityWindowName: "" };
        if (!context.activityId) {
            // in case we're not in activity just return. this will
            // lead to window not registering itself
            return result;
        }
        result.activityWindowType = context.activityWindowType;
        if (util.isUndefined(result.activityWindowType)) {
            result.activityWindowType = HCBridge._getURLParameter("activityWindowType");
        }
        result.activityWindowId = context.activityWindowId;
        if (util.isUndefined(result.activityWindowId)) {
            result.activityWindowId = HCBridge._getURLParameter("activityWindowId");
        }
        result.activityWindowIndependent = context.activityWindowIndependent;
        if (util.isUndefined(result.activityWindowIndependent)) {
            // TODO parse
            // result.activityWindowIndependent = this._getURLParameter("activityWindowIndependent");
        }
        result.activityWindowName = context.activityWindowName;
        if (util.isUndefined(result.activityWindowName)) {
            result.activityWindowName = HCBridge._getURLParameter("activityWindowName");
        }
        return result;
    };
    HCBridge.prototype.announceWindow = function (windowType, activityWindowId) {
        var _this = this;
        if (util.isUndefined(windowType)) {
            throw new Error("can not determine window type");
        }
        if (util.isUndefined(windowType)) {
            throw new Error("can not determine window activityWindowId");
        }
        this._htmlContainer.announceWindow(windowType, activityWindowId, function (error) {
            _this._logger.error("Error announcing activity window with id '" + activityWindowId + "'. " + error);
        });
    };
    HCBridge.prototype.getActivities = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // get all from HC
            _this._logger.trace("Executing getActivities()");
            _this._htmlContainer.getActivities(function (activitiesStr) {
                // transform to Activity Js Entities
                _this._logger.trace("Got getActivities() :" + activitiesStr);
                var activities = JSON.parse(activitiesStr);
                var result = activities.map(function (act) { return _this._hcToJsActivity(act); });
                resolve(result);
            }, function (error) {
                _this._logger.trace("Error in getActivities() :" + error);
                reject(error);
            });
        });
    };
    HCBridge.prototype.updateActivityContext = function (activity, context, fullReplace, removedKeys) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (util.isUndefined(removedKeys)) {
                removedKeys = [];
            }
            var options = {
                fullReplace: fullReplace,
                removedKeys: removedKeys
            };
            _this._htmlContainer.setActivityContext(activity.id, JSON.stringify(context), JSON.stringify(options), function (newContextString) {
                // receives the new context as string
                var newContext = JSON.parse(newContextString);
                resolve(newContext);
            }, function (error) { return reject(error); });
        });
    };
    HCBridge.prototype.getActivityWindows = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // get all from HC
            _this._htmlContainer.getWindows(function (windows) {
                // transform to Activity Js Entities
                var result = windows.map(function (wind) { return _this._hcToJsWindow(wind); });
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    };
    HCBridge.prototype.stopActivity = function (activity) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._htmlContainer.stopActivity(activity.id, function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    };
    HCBridge.prototype.unregisterWindowFactory = function (windowTypeName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._htmlContainer.registerWindowFactory(windowTypeName, 
            /*(info)*/ function () {
                resolve();
            }, function (error) {
                reject(error);
            });
        });
    };
    HCBridge.prototype.createWindow = function (id, windowDefinition) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var objToSend = windowDefinition;
            var functionToUse = _this._htmlContainer.createWindow2;
            if (!functionToUse) {
                functionToUse = _this._htmlContainer.createWindow;
                objToSend = JSON.stringify(windowDefinition);
            }
            functionToUse(id, objToSend, function (newId) {
                resolve(newId);
            }, function (error) {
                reject(error);
            });
        });
    };
    HCBridge.prototype.createStackedWindows = function (id, windowDefinitions, timeout) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var objToSend = windowDefinitions;
            var functionToUse = _this._htmlContainer.createStackedWindows2;
            if (!functionToUse) {
                functionToUse = _this._htmlContainer.createStackedWindows;
                objToSend = JSON.stringify(windowDefinitions);
            }
            functionToUse(id, objToSend, timeout, function (newId) {
                resolve(newId);
            }, function (error) {
                reject(error);
            });
        });
    };
    HCBridge.prototype.onActivityTypeStatusChange = function (callback) {
        this._activityTypeCallbacks.push(callback);
    };
    HCBridge.prototype.onWindowTypeStatusChange = function (callback) {
        this._windowTypeCallbacks.push(callback);
    };
    HCBridge.prototype.onActivityStatusChange = function (callback) {
        this._activityCallbacks.push(callback);
    };
    HCBridge.prototype.onActivityWindowChange = function (callback) {
        this._windowCallbacks.push(callback);
    };
    HCBridge.prototype.getWindowBounds = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._htmlContainer.getWindowBounds(id, function (bounds) {
                resolve(bounds);
            }, function (err) {
                reject(err);
            });
        });
    };
    HCBridge.prototype.setWindowBounds = function (id, bounds) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._htmlContainer.setWindowBounds(id, JSON.stringify(bounds), function () {
                resolve();
            }, function (err) {
                reject(err);
            });
        });
    };
    HCBridge.prototype.registerWindow = function (type, name, independent) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._htmlContainer.registerWindow(type, name, independent, function (id) {
                resolve(id);
            }, function (error) {
                reject(error);
            });
        });
    };
    HCBridge.prototype.closeWindow = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._htmlContainer.closeWindow(id, function () {
                resolve();
            }, function (err) {
                reject(err);
            });
        });
    };
    HCBridge.prototype.activateWindow = function (id, focus) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._htmlContainer.activateWindow(id, focus, function () {
                resolve();
            }, function (err) {
                reject(err);
            });
        });
    };
    HCBridge.prototype.setWindowVisibility = function (id, visible) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._htmlContainer.setWindowVisibility(id, visible, function () {
                resolve();
            }, function (err) {
                reject(err);
            });
        });
    };
    HCBridge.prototype.cloneActivity = function (id, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._htmlContainer.cloneActivity(id, options, function (activityId) {
                resolve(activityId);
            }, function (err) {
                reject(err);
            });
        });
    };
    HCBridge.prototype._publishStatusChange = function (entity, context, callbacks) {
        var entityEvent = new entityEvent_1.EntityEvent(entity, context);
        callbacks.forEach(function (callback) {
            callback(entityEvent);
        });
    };
    HCBridge.prototype._publishActivityTypeStatusChange = function (at, context) {
        this._publishStatusChange(at, context, this._activityTypeCallbacks);
    };
    HCBridge.prototype._publishWindowTypeStatusChange = function (wt, context) {
        this._publishStatusChange(wt, context, this._windowTypeCallbacks);
    };
    HCBridge.prototype._publishActivityStatusChange = function (act, context) {
        this._publishStatusChange(act, context, this._activityCallbacks);
    };
    HCBridge.prototype._publishActivityWindowEvent = function (w, context) {
        this._publishStatusChange(w, context, this._windowCallbacks);
    };
    HCBridge.prototype.attachActivities = function (from, to, tag) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._htmlContainer.attachActivities(from, to, tag, function (state) {
                resolve(state);
            }, function (err) {
                reject(err);
            });
        });
    };
    HCBridge.prototype.detachActivities = function (activityId, newActivityInfo) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._htmlContainer.detachActivities(activityId, newActivityInfo, function (newActivityId) {
                resolve(newActivityId);
            }, function (err) {
                reject(err);
            });
        });
    };
    HCBridge.prototype.onActivitiesAttached = function (callback) {
        this._activitiesAttachedHandler = callback;
    };
    HCBridge.prototype.onActivitiesDetached = function (callback) {
        this._activitiesDetached = callback;
    };
    HCBridge.prototype.onActivityAttachedDescriptorsRefreshed = function (callback) {
        this._activityAttachedDescriptorsRefreshed = callback;
    };
    HCBridge.prototype.getAttachedDescriptors = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this._htmlContainer.getAttachedDescriptors) {
                // support for container that does not have descriptors
                resolve([]);
                return;
            }
            _this._htmlContainer.getAttachedDescriptors(function (result) {
                resolve(result);
            }, function (err) {
                reject(err);
            });
        });
    };
    /**
     *  Convert a ActivityWindow entity coming from HC to ActivityWindow
     */
    HCBridge.prototype._hcToJsWindow = function (hcWindow) {
        var _this = this;
        var windowGetter = function () { return undefined; };
        if (this._windows) {
            if (hcWindow.hcWindowId) {
                windowGetter = function () { return _this._windows.list().filter(function (w) { return w.id === hcWindow.hcWindowId; })[0]; };
            }
            else {
                // backward compatibility for HC < 1.58
                windowGetter = function () { return _this._windows.list().filter(function (w) { return w.application === hcWindow.instance.application; })[0]; };
            }
        }
        return new activityWindow_1.default(hcWindow.id, hcWindow.name, hcWindow.type, hcWindow.activityId, hcWindow.instance, hcWindow.isIndependent, windowGetter, hcWindow.hcWindowId);
    };
    return HCBridge;
}());
exports.default = HCBridge;
//# sourceMappingURL=hcBridge.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @typedef {Object} activityStatus Defines activity instance status
 * @property {string} state Current state
 * @property {string} message Message
 * @property {Date} time Time of the last status update
 */
var ActivityStatus = /** @class */ (function () {
    function ActivityStatus(state, message, time) {
        this.state = state;
        this.message = message;
        this.time = time;
    }
    ActivityStatus.prototype.getState = function () {
        return this.state;
    };
    ActivityStatus.prototype.getMessage = function () {
        return this.message;
    };
    ActivityStatus.prototype.getTime = function () {
        return this.time;
    };
    return ActivityStatus;
}());
exports.ActivityStatus = ActivityStatus;
//# sourceMappingURL=activityStatus.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var activityEntity_1 = __webpack_require__(7);
var activityAGM_1 = __webpack_require__(9);
var attachedActivityDescriptor_1 = __webpack_require__(46);
var promiseExtensions_1 = __webpack_require__(8);
var util_1 = __webpack_require__(0);
/**
 * Activity is an instance of an activity type just like an object is an instance of a class
 * in class-based languages (and just like ‘John’ is an instance of a 'Person’).
 *
 * Activity is often used as a synonym for activity instance.
 *
 * Each activity instance has a single owner window and can optionally have one or more helper windows.
 *
 * @module activity
 */
var Activity = /** @class */ (function (_super) {
    __extends(Activity, _super);
    function Activity(id, actType, status, context, ownerId) {
        var _this = _super.call(this, id) || this;
        _this._id = id;
        _this._actType = actType;
        _this._status = status;
        _this._context = context || {};
        _this._ownerId = ownerId;
        _this._agm = new activityAGM_1.ActivityAGM(_this);
        return _this;
    }
    Object.defineProperty(Activity.prototype, "type", {
        /**
         * Activity type
         * @var {module:activityType} type
         */
        get: function () {
            if (this._manager) {
                return this._manager.getActivityType(this._actType);
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "context", {
        /**
         * Get current activity context. To update use updateContext , to replace setContext
         * @var {object} context
         */
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "status", {
        /**
         * Get activity status
         * @var {activityStatus} status
         */
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "owner", {
        /**
         * The owner window
         * @var {module:activityWindow} owner
         */
        get: function () {
            if (!this._ownerId) {
                return null;
            }
            return this._manager.getWindows({ id: this._ownerId })[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "windows", {
        /**
         * All windows participating in the activity
         * @var {module:activityWindow[]} windows
         */
        get: function () {
            return this._manager.getWindows({ activityId: this._id });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "agm", {
        /**
         * @var {module:activityAGM} agm
         */
        get: function () {
            return this._agm;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Joins a specific window to the activity
     *
     * @private
     * @function join
     * @param window    The window to join
     * @param callback  (Optional) Result callback
     * @returns         Promise for ActivityWindow
     */
    Activity.prototype.addWindow = function (window, callback) {
        return this._manager.addWindowToActivity(this, window, callback);
    };
    /**
     * Creates a new window and joins it to the activity
     *
     * @function createWindow
     * @param {string|windowDefinition} windowType The type of the window to be created
     * @param callback
     * @returns {Promise<module:activityWindow>}
     */
    Activity.prototype.createWindow = function (windowType, callback) {
        return this._manager.createWindow(this, windowType, callback);
    };
    /**
     * Creates a stacked set of windows and joins them to the
     *
     * @function createStackedWindows
     * @param {string[] | windowDefinition[]} windowTypes The types of the windows to be created
     * @param {number} timeout
     * @param callback
     * @returns {Promise<module:activityWindow[]>}
     */
    Activity.prototype.createStackedWindows = function (windowTypes, timeout, callback) {
        return this._manager.createStackedWindows(this, windowTypes, timeout, callback);
    };
    /**
     * Removes a window from the activity
     *
     * @private
     * @param window
     * @param callback
     * @returns     Promise for ActivityWindow
     */
    Activity.prototype.leave = function (window, callback) {
        return this._manager.leaveWindowFromActivity(this, window, callback);
    };
    /**
     * Get all windows participating in the activity from a given type
     *
     * @param {string} windowType
     * @returns {module:activityWindow[]}
     */
    Activity.prototype.getWindowsByType = function (windowType) {
        var filter = { activityId: this._id, type: windowType };
        return this._manager.getWindows(filter);
    };
    /**
     * Replaces the activity context with a new one.
     *
     * @function setContext
     * @param {object} context   The new context
     * @param callback
     * @returns {Promise<Object>}
     */
    Activity.prototype.setContext = function (context, callback) {
        return this._manager.setActivityContext(this, context, callback);
    };
    /**
     * Updates activity context using the properties from the context argument.
     * If old context is {a:1, b:2, c:3} and invoking updateContext({b:3, c:null}) will result a context
     * be {a:1, b:3}
     *
     * @function updateContext
     * @param {object} context
     * @param callback
     * @return {Promise<object>}
     */
    Activity.prototype.updateContext = function (context, callback) {
        return this._manager.updateActivityContext(this, context, callback);
    };
    /**
     * Subscribe for status change events
     *
     * @function onStatusChange
     *
     * @param {activityStatusChangeHandler} handler Handler function that will receive status notifications
     */
    Activity.prototype.onStatusChange = function (handler) {
        var _this = this;
        return this._manager.subscribeActivityEvents(function (a, ns, os) {
            if (a.id === _this.id) {
                handler(a, ns, os);
            }
        });
    };
    /**
     * Subscribe for window related events, like joined, removed from activity
     *
     * @function onWindowEvent
     * @param {windowEventHandler} handler Handler function that will receive windows events
     */
    Activity.prototype.onWindowEvent = function (handler) {
        var _this = this;
        return this._manager.subscribeWindowEvents(function (a, w, e) {
            if (a.id === _this.id) {
                handler(a, w, e);
            }
        });
    };
    /**
     * Subscribe for context updates
     *
     * @function onContextChanged
     * @param {contextChangedHandler} handler Handler function that will receive context related events
     */
    Activity.prototype.onContextChanged = function (handler) {
        var _this = this;
        this._manager.subscribeActivityContextChanged(function (act, context) {
            if (act.id === _this.id) {
                handler(context, act);
            }
        });
        try {
            // replay the context at the time of subscribing, swallow user exceptions
            handler(this.context, this);
        }
        catch (e) {
            return;
        }
    };
    /**
     * Stops the activity
     * @function stop
     */
    Activity.prototype.stop = function () {
        this._manager.stopActivity(this);
    };
    /**
     * Clones the activity into a new one
     * @function clone
     * @param {CloneOptions} options
     */
    Activity.prototype.clone = function (options) {
        return this._manager.clone(this, options);
    };
    Activity.prototype.attach = function (activity, tag) {
        var activityId;
        if (typeof activity === "string") {
            activityId = activity;
        }
        else {
            activityId = activity.id;
        }
        return this._manager.attachActivities(activityId, this.id, tag);
    };
    Activity.prototype.onActivityAttached = function (callback) {
        var _this = this;
        this._manager.subscribeActivitiesAttached(function (newActId, oldActId, descriptor) {
            if (newActId !== _this._id) {
                return;
            }
            callback(descriptor);
        });
    };
    Activity.prototype.onDetached = function (callback) {
        var _this = this;
        this._manager.subscribeActivitiesDetached(function (newAct, originalActivity, state) {
            if (originalActivity.id !== _this._id) {
                return;
            }
            callback(newAct, state);
        });
    };
    Activity.prototype._updateCore = function (other) {
        var _this = this;
        _super.prototype._updateCore.call(this, other);
        util_1.ifNotUndefined(other._actType, function (x) { return _this._actType = x; });
        util_1.ifNotUndefined(other._context, function (x) { return _this._context = x; });
        util_1.ifNotUndefined(other._ownerId, function (x) { return _this._ownerId = x; });
        if (other._status && (!this._status || (this._status.state !== other._status.state))) {
            this._status = other._status;
        }
    };
    Activity.prototype._updateDescriptors = function (allStates) {
        var _this = this;
        this._attached = allStates.map(function (s) {
            return new attachedActivityDescriptor_1.AttachedActivityDescriptor(_this._manager, _this._id, s);
        });
    };
    Object.defineProperty(Activity.prototype, "attached", {
        get: function () {
            return this._attached;
        },
        enumerable: true,
        configurable: true
    });
    Activity.prototype.setFrameColor = function (color, callback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var callbacksToWait = _this.windows.length;
            if (callbacksToWait === 0) {
                resolve(_this);
            }
            _this.windows.forEach(function (w) {
                w.underlyingWindow.setFrameColor(color, function () {
                    callbacksToWait--;
                    if (callbacksToWait <= 0) {
                        resolve(_this);
                    }
                });
            });
            setTimeout(function () {
                if (callbacksToWait > 0) {
                    reject(_this.id + " - timed out waiting for setFrameColor with" + color);
                }
            }, 5000);
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    Activity.prototype.getFrameColor = function () {
        if (!this.windows || this.windows.length === 0) {
            return "";
        }
        return this.windows[0].underlyingWindow.frameColor;
    };
    return Activity;
}(activityEntity_1.default));
exports.default = Activity;
//# sourceMappingURL=activity.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var activityEntity_1 = __webpack_require__(7);
var logger_1 = __webpack_require__(3);
var util = __webpack_require__(0);
var util_1 = __webpack_require__(0);
var entityEvent_1 = __webpack_require__(2);
/**
 * A window participating in an activity
 *
 * @module activityWindow
 */
var ActivityWindow = /** @class */ (function (_super) {
    __extends(ActivityWindow, _super);
    function ActivityWindow(id, name, type, activityId, instance, isIndependent, windowGetter, hcWindowId) {
        var _this = _super.call(this, id) || this;
        _this._logger = logger_1.Logger.Get("window");
        _this._type = type;
        _this._activityId = activityId;
        _this._name = name;
        _this._instance = instance;
        _this._isIndependent = isIndependent;
        _this._windowGetter = windowGetter;
        _this._hcWindowId = hcWindowId;
        return _this;
    }
    /**
     * Return window's title
     * @function getBounds
     * @return {Promise<WindowBounds>}
     */
    ActivityWindow.prototype.getBounds = function () {
        return this._manager.getWindowBounds(this.id);
    };
    Object.defineProperty(ActivityWindow.prototype, "name", {
        /**
         * @var {string} name The window name
         */
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityWindow.prototype, "isIndependent", {
        /**
         * @var {bool} isIndependent True if this is an independent window
         */
        get: function () {
            return this._isIndependent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityWindow.prototype, "type", {
        /**
         * @var {module:windowType} type The window type
         */
        get: function () {
            if (this._manager) {
                return this._manager.getWindowType(this._type);
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityWindow.prototype, "activity", {
        /**
         * @var {module:activity} activity The activity that the window is part of
         */
        get: function () {
            if (util.isUndefined(this._activityId)) {
                return undefined;
            }
            return this._manager.getActivityById(this._activityId);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityWindow.prototype, "isOwner", {
        /**
         * @var {bool} isOwner True if the window is the owner of the activity.
         */
        get: function () {
            var act = this.activity;
            if (util.isUndefined(act)) {
                return false;
            }
            return act.owner.id === this.id;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets window's visibility
     *
     * @function setVisible
     * @param {boolean} isVisible
     * @returns {Promise<module:activityWindow>}
     */
    ActivityWindow.prototype.setVisible = function (isVisible, callback) {
        return this._manager.setWindowVisibility(this.id, isVisible);
    };
    /**
     * Activate window
     * @function activate
     * @param {boolean} focus If true then activate window with focus otherwise activate window without focus
     */
    ActivityWindow.prototype.activate = function (focus) {
        return this._manager.activateWindow(this.id, focus);
    };
    /**
     * Sets window's bounds
     * @function setBounds
     *
     * @param {bounds} bounds The new bounds to be applied
     * @returns  {Promise<module:activityWindow>}
     */
    ActivityWindow.prototype.setBounds = function (bounds, callback) {
        return this._manager.setWindowBounds(this.id, bounds, callback);
    };
    /**
     * Closes the window
     *
     * @function close
     * @returns {Promise}
     */
    ActivityWindow.prototype.close = function () {
        return this._manager.closeWindow(this.id);
    };
    Object.defineProperty(ActivityWindow.prototype, "instance", {
        /**
         * @var {agmInstance} instance The agm instance of that window. You can use this to invoke AGM methods against that window
         */
        get: function () {
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityWindow.prototype, "underlyingWindow", {
        /**
         * Returns the window as object from Windows API (glue.windows).
         *
         * @var {window} underlyingWindow
         */
        get: function () {
            var window = this._windowGetter();
            if (!window) {
                // we don't have the window object any more, let's return as much as we can
                return {
                    id: this._hcWindowId
                };
            }
            return window;
        },
        enumerable: true,
        configurable: true
    });
    ActivityWindow.prototype.onActivityJoined = function (callback) {
        this._subscribeForActivityWindowEvent(entityEvent_1.EntityEventType.ActivityWindowJoinedActivity, callback);
    };
    ActivityWindow.prototype.onActivityRemoved = function (callback) {
        this._subscribeForActivityWindowEvent(entityEvent_1.EntityEventType.ActivityWindowLeftActivity, callback);
    };
    ActivityWindow.prototype._updateCore = function (other) {
        var _this = this;
        util_1.ifNotUndefined(other._activityId, function (x) { return _this._activityId = x; });
        util_1.ifNotUndefined(other._isIndependent, function (x) { return _this._isIndependent = x; });
        util_1.ifNotUndefined(other._hcWindowId, function (x) { return _this._hcWindowId = x; });
        util_1.ifNotUndefined(other._type, function (x) { return _this._type = x; });
        util_1.ifNotUndefined(other._name, function (x) { return _this._name = x; });
        if (!util.isUndefinedOrNull(other._instance)) {
            this._instance = other._instance;
        }
    };
    ActivityWindow.prototype._subscribeForActivityWindowEvent = function (eventName, callback) {
        var _this = this;
        this._manager.subscribeWindowEvents(function (activity, window, event) {
            // ignore events not related to this window
            if (window.id !== _this.id) {
                return;
            }
            if (event === eventName) {
                callback(activity);
            }
        });
    };
    ActivityWindow.prototype._beforeDelete = function (other) {
        this._hcWindowId = other._hcWindowId;
    };
    return ActivityWindow;
}(activityEntity_1.default));
exports.default = ActivityWindow;
//# sourceMappingURL=activityWindow.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var activityEntity_1 = __webpack_require__(7);
/**
 * A window type is a definition of a window, typically configured in ACS.
 *
 * @module windowType
 */
var WindowType = /** @class */ (function (_super) {
    __extends(WindowType, _super);
    function WindowType(name, appByWindowTypeGetter) {
        var _this = _super.call(this, name) || this;
        _this._name = name;
        _this._appByWindowTypeGetter = appByWindowTypeGetter;
        return _this;
    }
    Object.defineProperty(WindowType.prototype, "name", {
        /**
         * Name of the window type
         * @var {string} name
         */
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WindowType.prototype, "config", {
        /**
         * Returns the ACS configuration related to this window type (as application object from AppManager API)
         * @returns {any}
         */
        get: function () {
            return this._appByWindowTypeGetter(this._name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WindowType.prototype, "windows", {
        /**
         * @var {activityWindow[]} windows All windows from that type
         */
        get: function () {
            return this._manager.getWindows({ type: this._name });
        },
        enumerable: true,
        configurable: true
    });
    WindowType.prototype.create = function (activity, configuration) {
        var definition = Object.assign({ type: this.name, name: this.name, isIndependent: false }, configuration);
        return this._manager.createWindow(activity, definition);
    };
    return WindowType;
}(activityEntity_1.default));
exports.default = WindowType;
//# sourceMappingURL=windowType.js.map

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(3);
var util = __webpack_require__(0);
/**
 * Class that can be used as a marker for successful completion of a set of events
 * @private
 * @module readyMarker
 */
var ReadyMarker = /** @class */ (function () {
    /**
     * Creates new marker
     * @param name Name of the marker, useful in logging
     * @param signalsToWait Number of signals(events) that needs to be signaled (completed) before the marker is set as completed
     */
    function ReadyMarker(name, signalsToWait) {
        this._logger = logger_1.Logger.Get("ReadyMarker [" + name + "]");
        this._logger.debug("Initializing ready marker for '" + name + "' with " + signalsToWait + " signals to wait");
        if (signalsToWait <= 0) {
            throw new Error("Invalid signal number. Should be > 0");
        }
        this._signals = signalsToWait;
        this._callbacks = [];
        this._name = name;
    }
    /**
     * Adds a new callback that will be notified when the events are completed (success) or some error happened
     */
    ReadyMarker.prototype.setCallback = function (callback) {
        if (this.isSet()) {
            callback(undefined);
            return;
        }
        else if (this.isError()) {
            callback(this._error);
            return;
        }
        this._callbacks.push(callback);
    };
    /**
     * Signals for a completion of an event. If this is the last event success callbacks will be called
     */
    ReadyMarker.prototype.signal = function (message) {
        this._logger.debug("Signaled - " + message + " - signals left " + (this._signals - 1));
        this._signals--;
        if (this._signals < 0) {
            throw new Error("Error in ready marker '" + this._name + " - signals are " + this._signals);
        }
        if (this.isSet()) {
            this._callbacks.forEach(function (callback) {
                callback(undefined);
            });
        }
    };
    /**
     * Signals for an error in some of the events. This will notify all callbacks that the marker has failed
     */
    ReadyMarker.prototype.error = function (error) {
        this._error = error;
        this._callbacks.forEach(function (errorCallback) {
            errorCallback(error);
        });
    };
    /**
     * Checks if the marker is set (completed)
     */
    ReadyMarker.prototype.isSet = function () {
        if (this.isError()) {
            return false;
        }
        return this._signals === 0;
    };
    /**
     * Checks if the marker has failed (some of the events has failed)
     */
    ReadyMarker.prototype.isError = function () {
        return !util.isUndefined(this._error);
    };
    /**
     * Returns the last reported error (undefined if no error)
     */
    ReadyMarker.prototype.getError = function () {
        return this._error;
    };
    return ReadyMarker;
}());
exports.ReadyMarker = ReadyMarker;
//# sourceMappingURL=readyMarker.js.map

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// https://confluence.tick42.com:8443/display/TD/Global+Gateway+Domain#GlobalGatewayDomain-Contexts
exports.GW_MESSAGE_CREATE_CONTEXT = "create-context";
exports.GW_MESSAGE_ACTIVITY_CREATED = "created";
exports.GW_MESSAGE_ACTIVITY_DESTROYED = "destroyed";
exports.GW_MESSAGE_CONTEXT_CREATED = "context-created";
exports.GW_MESSAGE_CONTEXT_ADDED = "context-added";
exports.GW_MESSAGE_SUBSCRIBE_CONTEXT = "subscribe-context";
exports.GW_MESSAGE_SUBSCRIBED_CONTEXT = "subscribed-context";
exports.GW_MESSAGE_UNSUBSCRIBE_CONTEXT = "unsubscribe-context";
exports.GW_MESSAGE_DESTROY_CONTEXT = "destroy-context";
exports.GW_MESSAGE_CONTEXT_DESTROYED = "context-destroyed";
exports.GW_MESSAGE_UPDATE_CONTEXT = "update-context";
exports.GW_MESSAGE_CONTEXT_UPDATED = "context-updated";
exports.GW_MESSAGE_JOINED_ACTIVITY = "joined";
//# sourceMappingURL=gw3Messages.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var msg = __webpack_require__(19);
exports.ContextMessageReplaySpec = {
    get name() {
        return "context";
    },
    get types() {
        return [
            msg.GW_MESSAGE_CREATE_CONTEXT,
            msg.GW_MESSAGE_ACTIVITY_CREATED,
            msg.GW_MESSAGE_ACTIVITY_DESTROYED,
            msg.GW_MESSAGE_CONTEXT_CREATED,
            msg.GW_MESSAGE_CONTEXT_ADDED,
            msg.GW_MESSAGE_SUBSCRIBE_CONTEXT,
            msg.GW_MESSAGE_SUBSCRIBED_CONTEXT,
            msg.GW_MESSAGE_UNSUBSCRIBE_CONTEXT,
            msg.GW_MESSAGE_DESTROY_CONTEXT,
            msg.GW_MESSAGE_CONTEXT_DESTROYED,
            msg.GW_MESSAGE_UPDATE_CONTEXT,
            msg.GW_MESSAGE_CONTEXT_UPDATED,
            msg.GW_MESSAGE_JOINED_ACTIVITY
        ];
    }
};
//# sourceMappingURL=contextMessageReplaySpec.js.map

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LayoutImpl = /** @class */ (function () {
    function LayoutImpl(data) {
        this.name = data.name;
        this.type = data.type;
        this.components = data.components;
        this.context = data.context;
    }
    return LayoutImpl;
}());
exports.default = LayoutImpl;
//# sourceMappingURL=layout.js.map

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// provides a unified way to access layouts array
var LayoutStore = /** @class */ (function () {
    function LayoutStore() {
        this.layouts = [];
    }
    LayoutStore.prototype.removeWhere = function (condition) {
        this.layouts = this.layouts.filter(condition);
    };
    LayoutStore.prototype.add = function (item) {
        this.layouts.push(item);
    };
    Object.defineProperty(LayoutStore.prototype, "all", {
        get: function () {
            return this.layouts;
        },
        enumerable: true,
        configurable: true
    });
    LayoutStore.prototype.where = function (condition) {
        return this.layouts.filter(condition);
    };
    LayoutStore.prototype.first = function (condition) {
        return this.where(condition)[0];
    };
    return LayoutStore;
}());
exports.LayoutStore = LayoutStore;
exports.default = new LayoutStore();
//# sourceMappingURL=store.js.map

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// A simple transformation that makes object to start with lowercase
// Note that this is not full implementation as it supports only:
// undefined, null, arrays, number, string, bool. Anything out of this
// list is considered Object
function transformACSLayout(something) {
    if (!something) {
        return something;
    }
    if (Array.isArray(something)) {
        return something.map(function (item) {
            return transformACSLayout(item);
        });
    }
    if (typeof something === "string" || typeof something === "number" || typeof something === "boolean") {
        return something;
    }
    var initial = {};
    return Object.keys(something).reduce(function (accumulator, current) {
        var value = something[current];
        var convertedValue = transformACSLayout(value);
        var key = current;
        if (current[0].toLowerCase() !== current[0]) {
            key = current[0].toLowerCase() + current.substr(1);
        }
        accumulator[key] = convertedValue;
        return accumulator;
    }, initial);
}
exports.default = transformACSLayout;
//# sourceMappingURL=transform.js.map

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CallbackFactory = __webpack_require__(1);
var store_1 = __webpack_require__(4);
exports.default = (function (id, options, executor, logger, appManagerGetter) {
    var _registry = CallbackFactory();
    var _logger = logger.subLogger("window " + id);
    var _name = options.name;
    var _mode = options.mode;
    var _url = options.url;
    var _title = options.title;
    var _context = options.context || {};
    var _bounds = options.bounds;
    var _frameColor = options.frameColor;
    var _focus = options.focus;
    var _neighbours = options.neighbours || {};
    var _groupId = options.groupId;
    var _isGroupHeaderVisible = options.isGroupHeaderVisible;
    var _isTabHeaderVisible = options.isTabHeaderVisible;
    var _isTabSelected = options.isTabSelected;
    var _settings = options.settings;
    // is Window visible
    var _isVisible = options.isVisible;
    // Window state Collapsed | Expanded
    var isCollapsed = options.isCollapsed;
    // Window state normal | maximized | minimized
    var _windowState = options.state;
    // tabGroupId only for window with 'Tab' mode
    var _tabGroupId = options.tabGroupId;
    // window is locked or unlocked;
    var _isLocked = options.isLocked;
    var _group;
    var resultWindow;
    // Holding all frame buttons
    var _frameButtons = [];
    //#region "AGM methods"
    function close(success, error) {
        return new Promise(function (resolve, reject) {
            executor.close(resultWindow)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function navigate(newUrl, success, error) {
        return new Promise(function (resolve, reject) {
            executor.navigate(resultWindow, newUrl)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function setStyle(style, success, error) {
        return new Promise(function (resolve, reject) {
            executor.setStyle(resultWindow, style)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function setTitle(newTitle, success, error) {
        return new Promise(function (resolve, reject) {
            executor.setTitle(resultWindow, newTitle)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
        // OpTION 2
        // const promise = executor.setTitle(resultWindow, newTitle)
        // return promisify
    }
    function moveResize(dimensions, success, error) {
        return new Promise(function (resolve, reject) {
            executor.moveResize(resultWindow, dimensions)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function addFrameButton(buttonInfo, success, error) {
        return new Promise(function (resolve, reject) {
            if (typeof buttonInfo === "undefined") {
                if (typeof error === "function") {
                    error("No button info");
                    return;
                }
                reject("No button info");
                return;
            }
            if (buttonInfo.buttonId === undefined) {
                if (typeof error === "function") {
                    error("No buttonId");
                    return;
                }
                reject("No buttonId");
                return;
            }
            if (buttonInfo.imageBase64 === undefined) {
                if (typeof error === "function") {
                    error("No imageBase64");
                    return;
                }
                reject("No imageBase64");
                return;
            }
            executor.addFrameButton(resultWindow, buttonInfo)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function removeFrameButton(buttonId, success, error) {
        return new Promise(function (resolve, reject) {
            if (buttonId === undefined || buttonId === "") {
                if (typeof error === "function") {
                    error("No buttonId");
                    return;
                }
                reject("No buttonId");
                return;
            }
            executor.removeFrameButton(resultWindow, buttonId)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function activate(success, error) {
        return new Promise(function (resolve, reject) {
            executor.activate(resultWindow)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function focus(success, error) {
        return new Promise(function (resolve, reject) {
            executor.focus(resultWindow)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function maximizeRestore(success, error) {
        return new Promise(function (resolve, reject) {
            executor.maximizeRestore(resultWindow)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function maximize(success, error) {
        return new Promise(function (resolve, reject) {
            executor.maximize(resultWindow)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function restore(success, error) {
        return new Promise(function (resolve, reject) {
            executor.restore(resultWindow)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function minimize(success, error) {
        return new Promise(function (resolve, reject) {
            executor.minimize(resultWindow)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function collapse(success, error) {
        return new Promise(function (resolve, reject) {
            executor.collapse(resultWindow)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function expand(success, error) {
        return new Promise(function (resolve, reject) {
            executor.expand(resultWindow)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function toggleCollapse(success, error) {
        return new Promise(function (resolve, reject) {
            executor.toggleCollapse(resultWindow)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function snap(target, direction, success, error) {
        return new Promise(function (resolve, reject) {
            executor.snap(resultWindow, target, direction)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function attachTab(tab, index, success, error) {
        return new Promise(function (resolve, reject) {
            executor.attachTab(resultWindow, tab, index)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function detachTab(opt, success, error) {
        return new Promise(function (resolve, reject) {
            executor.detachTab(resultWindow, opt)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function setVisible(toBeVisible, success, error) {
        return new Promise(function (resolve, reject) {
            executor.setVisible(resultWindow, toBeVisible)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function showLoader(loader) {
        return new Promise(function (resolve, reject) {
            executor.showLoader(resultWindow, loader)
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    }
    function hideLoader() {
        return new Promise(function (resolve, reject) {
            executor.hideLoader(resultWindow)
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    }
    function updateContext(context, success, error) {
        return new Promise(function (resolve, reject) {
            executor.updateContext(resultWindow, context)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function lock(success, error) {
        return new Promise(function (resolve, reject) {
            executor.lock(resultWindow)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function unlock(success, error) {
        return new Promise(function (resolve, reject) {
            executor.unlock(resultWindow)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function getIcon(success, error) {
        return new Promise(function (resolve, reject) {
            // agm.invoke("T42.Wnd.GetIcon", { windowId: resultWindow.id }, "best", {}, successHandler, error);
            executor.getIcon(resultWindow)
                .then(function (icon) {
                if (typeof success === "function") {
                    success(icon);
                }
                resolve(icon);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function setIcon(base64Image, success, error) {
        return new Promise(function (resolve, reject) {
            executor.setIcon(resultWindow, base64Image)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function setFrameColor(frameColor, success, error) {
        return new Promise(function (resolve, reject) {
            executor.setFrameColor(resultWindow, frameColor)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    function setTabHeaderVisible(toBeTabHeaderVisible, success, error) {
        return new Promise(function (resolve, reject) {
            executor.setTabHeaderVisible(resultWindow, toBeTabHeaderVisible)
                .then(function () {
                if (typeof success === "function") {
                    success(resultWindow);
                }
                resolve(resultWindow);
            })
                .catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
                reject(e);
            });
        });
    }
    //#endregion "AGM methods"
    //#region "Events"
    function onTitleChanged(callback) {
        callback(resultWindow.title, resultWindow);
        return _registry.add("onTitleChanged", callback);
    }
    function onClose(callback) {
        return _registry.add("onClose", callback);
    }
    function onUrlChanged(callback) {
        return _registry.add("onUrlChanged", callback);
    }
    function onFrameButtonAdded(callback) {
        return _registry.add("onFrameButtonAdded", callback);
    }
    function onFrameButtonRemoved(callback) {
        return _registry.add("onFrameButtonRemoved", callback);
    }
    function onFrameButtonClicked(callback) {
        return _registry.add("onFrameButtonClicked", callback);
    }
    function onCollapsed(callback) {
        if (isCollapsed) {
            callback(resultWindow);
        }
        return _registry.add("collapsed", callback);
    }
    function onExpanded(callback) {
        if (!isCollapsed) {
            callback(resultWindow);
        }
        return _registry.add("expanded", callback);
    }
    function onMaximized(callback) {
        if (_windowState === "maximized") {
            callback(resultWindow);
        }
        return _registry.add("maximized", callback);
    }
    function onMinimized(callback) {
        if (_windowState === "minimized") {
            callback(resultWindow);
        }
        return _registry.add("minimized", callback);
    }
    function onNormal(callback) {
        if (_windowState === "normal") {
            callback(resultWindow);
        }
        return _registry.add("normal", callback);
    }
    function onAttached(callback) {
        return _registry.add("attached", callback);
    }
    function onDetached(callback) {
        return _registry.add("detached", callback);
    }
    function onVisibilityChanged(callback) {
        return _registry.add("visibility-changed", callback);
    }
    function onContextUpdated(callback) {
        return _registry.add("context-updated", callback);
    }
    function onLockingChanged(callback) {
        return _registry.add("lock-changed", callback);
    }
    function onBoundsChanged(callback) {
        return _registry.add("bounds-changed", callback);
    }
    function onFocusChanged(callback) {
        return _registry.add("focus-changed", callback);
    }
    function onFrameColorChanged(callback) {
        return _registry.add("frame-color-changed", callback);
    }
    function onTabHeaderVisibilityChanged(callback) {
        return _registry.add("tab-header-visibility-changed", callback);
    }
    function onWindowAttached(callback) {
        return _registry.add("window-attached", callback);
    }
    function onWindowDetached(callback) {
        return _registry.add("window-detached", callback);
    }
    function onGroupChanged(callback) {
        return _registry.add("group-changed", callback);
    }
    function onTabSelectionChanged(callback) {
        return _registry.add("tab-selection-changed", callback);
    }
    //#endregion "Events"
    //#region "Stream function"
    function handleTitleChanged(newTitle) {
        _title = newTitle;
        _registry.execute("onTitleChanged", newTitle, resultWindow);
    }
    function handleUrlChanged(newUrl) {
        _url = newUrl;
        _registry.execute("onUrlChanged", newUrl, resultWindow);
    }
    function handleVisibilityChanged(isVisible) {
        if (isVisible === _isVisible) {
            return;
        }
        _isVisible = isVisible;
        _registry.execute("visibility-changed", resultWindow);
    }
    function handleWindowSettingsChanged(settings) {
        _settings = settings;
        _registry.execute("settings-changed", resultWindow);
    }
    function handleContextUpdated(context) {
        _context = context;
        _registry.execute("context-updated", _context, resultWindow);
    }
    function handleWindowClose() {
        if (resultWindow.id === undefined) {
            return;
        }
        resultWindow.id = undefined;
        _registry.execute("onClose", resultWindow);
    }
    function handleFrameButtonAdded(frameButton) {
        var buttonObj = ["buttonId", "imageBase64", "order", "tooltip"].reduce(function (memo, k) {
            memo[k] = frameButton[k];
            return memo;
        }, {});
        var frameButtonsIds = _frameButtons.map(function (btn) {
            return btn.buttonId;
        });
        if (frameButtonsIds.indexOf(frameButton.buttonId) === -1) {
            _frameButtons.push(buttonObj);
        }
        _registry.execute("onFrameButtonAdded", buttonObj, resultWindow);
    }
    function handleFrameButtonRemoved(frameButton) {
        var button;
        _frameButtons = _frameButtons.reduce(function (memo, btn) {
            if (btn.buttonId === frameButton.buttonId) {
                button = btn;
            }
            else {
                memo.push(btn);
            }
            return memo;
        }, []);
        if (button !== undefined) {
            _registry.execute("onFrameButtonRemoved", button, resultWindow);
        }
    }
    function handleFrameButtonClicked(frameButton) {
        var button = _frameButtons.filter(function (btn) {
            return btn.buttonId === frameButton.buttonId;
        });
        if (button.length > 0) {
            _registry.execute("onFrameButtonClicked", button[0], resultWindow);
        }
    }
    function handleWindowChangeState(state) {
        if (state === "collapsed") {
            isCollapsed = true;
        }
        else if (state === "expanded") {
            isCollapsed = false;
        }
        else {
            _windowState = state;
        }
        _registry.execute(state, resultWindow);
    }
    function handleFrameIsLockedChanged(isLocked) {
        _isLocked = isLocked;
        _registry.execute("lock-changed", resultWindow);
    }
    function handleBoundsChanged(bounds) {
        if (_bounds.top === bounds.top && _bounds.left === bounds.left && _bounds.width === bounds.width && _bounds.height === bounds.height) {
            return;
        }
        _bounds.top = bounds.top;
        _bounds.left = bounds.left;
        _bounds.width = bounds.width;
        _bounds.height = bounds.height;
        _registry.execute("bounds-changed", resultWindow);
    }
    function handleFocusChanged(isFocused) {
        _focus = isFocused;
        _registry.execute("focus-changed", resultWindow);
    }
    function handleFrameColorChanged(frameColor) {
        _frameColor = frameColor;
        _registry.execute("frame-color-changed", resultWindow);
    }
    function handleFrameAttached(tabGroupId, isTabHeaderVisible) {
        _tabGroupId = tabGroupId;
        _isTabHeaderVisible = isTabHeaderVisible;
    }
    function handleCompositionChanged(neighbours, groupId) {
        _neighbours = neighbours || {};
        _groupId = groupId;
    }
    function handleGroupHeaderVisibilityChanged(isGroupHeaderVisible) {
        _isGroupHeaderVisible = isGroupHeaderVisible;
    }
    function handleTabHeaderVisibilityChanged(isTabHeaderVisible) {
        if (_isTabHeaderVisible !== isTabHeaderVisible) {
            _isTabHeaderVisible = isTabHeaderVisible;
            _registry.execute("tab-header-visibility-changed", resultWindow);
        }
    }
    function handleFrameSelectionChanged(newWindow, prevWindow) {
        var selectedWindow;
        if (typeof newWindow !== "undefined" && newWindow === id) {
            _isTabSelected = true;
            selectedWindow = resultWindow;
        }
        else {
            _isTabSelected = false;
            selectedWindow = store_1.default.get(newWindow) ? store_1.default.get(newWindow).API : undefined;
        }
        var previousWindow = store_1.default.get(prevWindow) ? store_1.default.get(prevWindow).API : undefined;
        _registry.execute("tab-selection-changed", selectedWindow, previousWindow, resultWindow);
    }
    function handleAttached(newTabGroupId, tabHeaderVisible) {
        _tabGroupId = newTabGroupId;
        _isTabHeaderVisible = tabHeaderVisible;
        _registry.execute("attached", resultWindow);
    }
    function handleWindowAttached(win) {
        _registry.execute("window-attached", win);
    }
    function handleDetached(tabGroupId) {
        _tabGroupId = tabGroupId;
        _registry.execute("detached", resultWindow);
    }
    function handleWindowDetached(win) {
        _registry.execute("window-detached", win);
    }
    //#endregion "Stream function"
    //#region "Group Events"
    function handleGroupChanged(newGroup, oldGroup) {
        logger.trace("handle group changed to win: " + id + " with group id: " + newGroup.id);
        _group = newGroup;
        _groupId = newGroup.id;
        _registry.execute("group-changed", resultWindow, newGroup, oldGroup);
    }
    // This is used to set the relation from window to corespondent group API, it could be undefined, if the window is removed from group
    function handleGroupAssociation(group) {
        if (group) {
            _logger.trace("setting group to win: " + id + " with group id: " + group.id);
        }
        _group = group;
    }
    //#region "Internal function"
    function getAllTabs() {
        var allWindows = store_1.default.list;
        return Object.keys(allWindows).reduce(function (memo, win) {
            var window = allWindows[win];
            if (window
                && window.API.tabGroupId
                && typeof window.API.tabGroupId !== "undefined"
                && typeof resultWindow.tabGroupId !== "undefined"
                && window.API.tabGroupId === resultWindow.tabGroupId) {
                memo.push(window.API);
            }
            return memo;
        }, []);
    }
    function mapWindowIdsToWindowObjects(windowIdArr) {
        return windowIdArr.reduce(function (memo, winId) {
            var window = store_1.default.get(winId);
            if (window) {
                memo.push(window.API);
            }
            return memo;
        }, []);
    }
    function getNeighboursByDirection(direction) {
        var windowIds = _neighbours[direction];
        if (typeof windowIds !== "undefined") {
            return mapWindowIdsToWindowObjects(windowIds);
        }
    }
    function getApplicationName() {
        if (_context._APPLICATION_NAME) {
            return _context._APPLICATION_NAME;
        }
        if (_context && _context._t42 && _context._t42.application) {
            return _context._t42.application;
        }
        var info = getWindowInfo();
        if (!info) {
            return undefined;
        }
        return info.applicationName;
    }
    function getWindowInfo() {
        if (typeof window.glue42gd !== "undefined" && window.glue42gd.getWindowInfo) {
            var info = window.glue42gd.getWindowInfo(id);
            if (!info) {
                return undefined;
            }
            else {
                return info;
            }
        }
    }
    //#endregion "Internal function"
    //#region "API"
    resultWindow = {
        get name() {
            return _name;
        },
        get application() {
            var appManager = appManagerGetter();
            return appManager ? appManager.application(getApplicationName()) : undefined;
        },
        get hostInstance() {
            return executor.hostInstance;
        },
        get agmInstance() {
            var appName = getApplicationName();
            return appName ? { application: appName } : undefined;
        },
        get url() {
            return _url;
        },
        id: id,
        get title() {
            return _title;
        },
        get windowStyleAttributes() {
            return _settings;
        },
        get settings() {
            return _settings;
        },
        get tabGroupId() {
            return _tabGroupId;
        },
        get frameButtons() {
            return _frameButtons;
        },
        get mode() {
            return _mode;
        },
        get state() {
            return _windowState;
        },
        get isCollapsed() {
            return isCollapsed;
        },
        get isVisible() {
            return _isVisible;
        },
        get isLocked() {
            return _isLocked;
        },
        get context() {
            return _context;
        },
        get bounds() {
            return _bounds;
        },
        get isFocused() {
            return _focus;
        },
        get frameColor() {
            return _frameColor;
        },
        get opened() {
            return resultWindow.id !== undefined;
        },
        get group() {
            return _group;
        },
        get groupId() {
            return _groupId;
        },
        get topNeighbours() {
            return getNeighboursByDirection("top");
        },
        get leftNeighbours() {
            return getNeighboursByDirection("left");
        },
        get rightNeighbours() {
            return getNeighboursByDirection("right");
        },
        get bottomNeighbours() {
            return getNeighboursByDirection("bottom");
        },
        get isGroupHeaderVisible() {
            return _isGroupHeaderVisible;
        },
        get activityId() {
            if (_context._t42) {
                return _context._t42.activityId;
            }
            var info = getWindowInfo();
            if (!info) {
                return undefined;
            }
            return info.activityId;
        },
        get activityWindowId() {
            if (_context._t42) {
                return _context._t42.activityWindowId;
            }
            var info = getWindowInfo();
            if (!info) {
                return undefined;
            }
            return info.activityWindowId;
        },
        maximize: maximize,
        restore: restore,
        minimize: minimize,
        maximizeRestore: maximizeRestore,
        collapse: collapse,
        expand: expand,
        toggleCollapse: toggleCollapse,
        focus: focus,
        activate: activate,
        moveResize: moveResize,
        setTitle: setTitle,
        setStyle: setStyle,
        navigate: navigate,
        addFrameButton: addFrameButton,
        removeFrameButton: removeFrameButton,
        setVisible: setVisible,
        close: close,
        snap: snap,
        showLoader: showLoader,
        hideLoader: hideLoader,
        updateContext: updateContext,
        lock: lock,
        unlock: unlock,
        getIcon: getIcon,
        setIcon: setIcon,
        setFrameColor: setFrameColor,
        attachTab: attachTab,
        detachTab: detachTab,
        setTabHeaderVisible: setTabHeaderVisible,
        onClose: onClose,
        onUrlChanged: onUrlChanged,
        onTitleChanged: onTitleChanged,
        onFrameButtonAdded: onFrameButtonAdded,
        onFrameButtonRemoved: onFrameButtonRemoved,
        onFrameButtonClicked: onFrameButtonClicked,
        onCollapsed: onCollapsed,
        onExpanded: onExpanded,
        onMinimized: onMinimized,
        onMaximized: onMaximized,
        onNormal: onNormal,
        onAttached: onAttached,
        onDetached: onDetached,
        onVisibilityChanged: onVisibilityChanged,
        onContextUpdated: onContextUpdated,
        onLockingChanged: onLockingChanged,
        onBoundsChanged: onBoundsChanged,
        onFrameColorChanged: onFrameColorChanged,
        onFocusChanged: onFocusChanged,
        onGroupChanged: onGroupChanged,
        onWindowAttached: onWindowAttached,
        onWindowDetached: onWindowDetached,
        onTabSelectionChanged: onTabSelectionChanged,
        onTabHeaderVisibilityChanged: onTabHeaderVisibilityChanged,
        get tabs() {
            return getAllTabs();
        },
        get isTabHeaderVisible() {
            return _isTabHeaderVisible;
        },
        get isTabSelected() {
            return _isTabSelected;
        },
    };
    //#endregion "API"
    //#endregion "Group Events"
    var events = {
        handleWindowClose: handleWindowClose,
        handleWindowChangeState: handleWindowChangeState,
        handleTitleChanged: handleTitleChanged,
        handleVisibilityChanged: handleVisibilityChanged,
        handleUrlChanged: handleUrlChanged,
        handleWindowSettingsChanged: handleWindowSettingsChanged,
        handleContextUpdated: handleContextUpdated,
        handleFrameIsLockedChanged: handleFrameIsLockedChanged,
        handleBoundsChanged: handleBoundsChanged,
        handleFocusChanged: handleFocusChanged,
        handleFrameButtonAdded: handleFrameButtonAdded,
        handleFrameButtonRemoved: handleFrameButtonRemoved,
        handleFrameButtonClicked: handleFrameButtonClicked,
        handleFrameColorChanged: handleFrameColorChanged,
        handleFrameAttached: handleFrameAttached,
        handleFrameSelectionChanged: handleFrameSelectionChanged,
        handleCompositionChanged: handleCompositionChanged,
        handleGroupHeaderVisibilityChanged: handleGroupHeaderVisibilityChanged,
        handleTabHeaderVisibilityChanged: handleTabHeaderVisibilityChanged,
        handleGroupChanged: handleGroupChanged,
        handleGroupAssociation: handleGroupAssociation,
        handleAttached: handleAttached,
        handleDetached: handleDetached,
        handleWindowAttached: handleWindowAttached,
        handleWindowDetached: handleWindowDetached,
    };
    return {
        API: resultWindow,
        Events: events,
    };
});
//# sourceMappingURL=window.js.map

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tick42_glue_core_1 = __webpack_require__(37);
var main_1 = __webpack_require__(48);
var main_2 = __webpack_require__(55);
var contextMessageReplaySpec_1 = __webpack_require__(20);
var main_3 = __webpack_require__(63);
var main_4 = __webpack_require__(77);
var main_5 = __webpack_require__(66);
var pjson = __webpack_require__(26);
var config_1 = __webpack_require__(57);
exports.default = (function (options) {
    // get config object
    // basically selecting some properties (and defaulting them)
    // it's used to extract things like layouts, appManager, activities etc things
    // that glueCore itself doesn't know about
    options = options || {};
    var glueConfig = config_1.default(options);
    options.gateway = options.gateway || {};
    options.gateway.replaySpecs = options.gateway.replaySpecs || [];
    options.gateway.replaySpecs.push(contextMessageReplaySpec_1.ContextMessageReplaySpec);
    // Init the GLUE namespace
    var hc = typeof window !== "undefined" && window.htmlContainer;
    var _appManager;
    var _activity;
    var _contexts;
    var _windows;
    // dependency graph:
    //   contexts: nothing
    //   windows: agm, appManager (via getter)
    //   activities: contexts, agm, logger, windows, appManager (via getter)
    //   appManager: agm, windows, logger, activities
    //   layouts: agm, appManager, logger
    function createWindows(core) {
        if (glueConfig.windows) {
            var windowsLogger = getLibLogger("windows", core.logger, glueConfig.windows);
            _windows = main_4.default(core.agm, windowsLogger, function () {
                return _appManager;
            });
            debugLog(_windows);
            return _windows;
        }
    }
    function createActivities(core) {
        if (glueConfig.activities) {
            if ((hc && hc.activityFacade) ||
                (main_1.ActivityModule.checkIsUsingGW3Implementation &&
                    main_1.ActivityModule.checkIsUsingGW3Implementation(core.connection))) {
                var activityLogger = getLibLogger("activity", core.logger, glueConfig.activities);
                _activity = new main_1.ActivityModule({
                    connection: core.connection,
                    contexts: _contexts,
                    agm: core.agm,
                    logger: activityLogger,
                    logLevel: "info",
                    disableAutoAnnounce: false,
                    disposeRequestHandling: "ignore",
                    announcementInfo: null,
                    windows: _windows,
                    appManagerGetter: function () {
                        return _appManager;
                    },
                    mode: glueConfig.activities.mode,
                    typesToTrack: glueConfig.activities.typesToTrack,
                    activityId: typeof window !== "undefined" && window.glue42gd && window.glue42gd.activityInfo && window.glue42gd.activityInfo.activityId
                }).api;
                debugLog(_activity);
                return _activity;
            }
        }
    }
    function createAppManager(core) {
        if (!glueConfig.appManager) {
            return;
        }
        var logger = getLibLogger("appManager", core.logger, glueConfig.appManager);
        // AppManager v3
        _appManager = main_2.default({
            agm: core.agm,
            windows: _windows,
            logger: logger,
            activities: _activity,
            mode: glueConfig.appManager.mode
        });
        debugLog(_appManager);
        return _appManager;
    }
    function createContexts(core) {
        var needsContexts = glueConfig.contexts ||
            // NB: GW3 activity uses tick42-contexts
            (glueConfig.activities &&
                main_1.ActivityModule.checkIsUsingGW3Implementation &&
                main_1.ActivityModule.checkIsUsingGW3Implementation(core.connection));
        if (needsContexts) {
            var logger = getLibLogger("contexts", core.logger, glueConfig.contexts);
            _contexts = new main_3.ContextsModule({
                connection: core.connection,
                logger: logger
            });
            debugLog(_contexts);
            return _contexts;
            // NB: The shared contexts data is part of the global domain,
            // which is joined implicitly and there is no 'Success' message
            // to indicate that the initial state has arrived.
            // We're relying on the fact that none of the other Glue libs
            // rely on the shared contexts' state, and that the 'contexts'
            // lib is created first so any other domain's success message
            // will arrive after our state, so the contexts will be visible
            // when the Glue promise resolves.
        }
        else {
            var replayer = core.connection.replayer;
            if (replayer) {
                replayer.drain(contextMessageReplaySpec_1.ContextMessageReplaySpec.name, null);
            }
        }
    }
    function createLayouts(core) {
        if (!glueConfig.layouts) {
            return;
        }
        var logger = getLibLogger("layouts", core.logger, glueConfig.layouts);
        var lay = main_5.default({
            agm: core.agm,
            appManager: _appManager,
            activityGetter: function () { return _activity; },
            logger: logger,
            mode: glueConfig.layouts.mode,
        });
        debugLog(lay);
        return lay;
    }
    function getLibLogger(loggerName, logger, config) {
        var newLogger = logger.subLogger(loggerName);
        if (config && config.logger) {
            var loggerConfig = config.logger;
            if (loggerConfig.console) {
                newLogger.consoleLevel(loggerConfig.console);
            }
            if (loggerConfig.publish) {
                newLogger.publishLevel(loggerConfig.publish);
            }
            if (loggerConfig.metrics) {
                newLogger.metricsLevel(loggerConfig.metrics);
            }
        }
        return newLogger;
    }
    var ext = {
        // define extra libraries for glue-core to raise
        libs: [
            { name: "contexts", create: createContexts },
            { name: "windows", create: createWindows },
            { name: "activities", create: createActivities },
            { name: "appManager", create: createAppManager },
            { name: "layouts", create: createLayouts },
        ],
        version: pjson.version,
        enrichGlue: function (glue) {
            // put some data to config
            glue.config.contexts = glueConfig.contexts;
            glue.config.activities = glueConfig.activities;
            glue.config.windows = glueConfig.windows;
            glue.config.appManager = glueConfig.appManager;
            glue.config.layouts = glueConfig.layouts;
        },
    };
    var currentLog = [];
    if (typeof window !== "undefined") {
        if (!window.glueFactoryLog) {
            window.glueFactoryLog = [];
        }
        window.glueFactoryLog.push(currentLog);
    }
    function debugLog(entry) {
        currentLog.push(entry);
    }
    return tick42_glue_core_1.default(options, ext);
});
//# sourceMappingURL=glue.js.map

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = {"name":"tick42-glue","description":"Tick42 GLUE","version":"4.0.0-beta.31","main":"./dist/node/tick42-glue.js","browser":"./dist/web/tick42-glue.js","types":"./glue.d.ts","docName":"Glue","scripts":{"init-dev-mode":"node ./build/scripts/init-dev-mode.js","remove-installed-dependencies":"node ./build/scripts/remove-installed-dependencies.js","clean":"node ./build/scripts/clean.js","file-versionify":"node ./build/scripts/file-versionify.js","pre:build":"npm run tslint && tsc && set NODE_ENV=development && npm run clean","tslint":"tslint -t codeFrame ./src/**/*.ts","tslint:fix":"tslint -t codeFrame --fix ./src/**/*.ts","watch":"onchange ./src/**/*.ts -- npm run build:dev","build:dev":"npm run pre:build && set NODE_ENV=development && webpack && npm run file-versionify","build:prod":"npm run pre:build && set NODE_ENV=development && webpack && set NODE_ENV=production && webpack && npm run file-versionify","docs":"typedoc --options typedoc.json ./src","prepublish":"npm run build:prod","test":"npm run build:dev && mocha ./tests","test:only":"mocha ./tests","generate-docs":"tick42-reference-docs -p g4e -m tick42-agm,tick42-windows,tick42-app-manager,tick42-activity,tick42-layouts,tick42-metrics,tick42-contexts,tick42-logger,tick42-gateway-connection"},"repository":{"type":"git","url":"https://stash.tick42.com:8443/scm/ofgw/js-glue.git"},"author":{"name":"Tick42","url":"http://www.glue42.com"},"license":"ISC","dependencies":{"@types/object-assign":"^4.0.30","@types/shortid":"0.0.29","callback-registry":"^2.3.1","es6-promise":"^4.1.1","object-assign":"^4.1.1","shortid":"^2.2.8","tick42-glue-core":"^3.12.2","tick42-promisify":"^1.0.3"},"devDependencies":{"chai":"^4.1.0","glue-docs-reference-generator":"*","mocha":"^2.4.5","onchange":"3.*","pre-commit":"^1.1.3","readline-sync":"^1.4.5","shelljs":"^0.6.0","tick42-gateway":"^0.2.2","tick42-webpack-config":"4.1.6","tslint":"^5.5.0","typedoc":"^0.9.0","typescript":"^2.5.3","webpack":"2.3.3"}}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(32);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var encode = __webpack_require__(12);
var alphabet = __webpack_require__(6);

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {

    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + encode(alphabet.lookup, version);
    str = str + encode(alphabet.lookup, clusterWorkerId);
    if (counter > 0) {
        str = str + encode(alphabet.lookup, counter);
    }
    str = str + encode(alphabet.lookup, seconds);

    return str;
}

module.exports = build;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(6);

/**
 * Decode the id to get the version and worker
 * Mainly for debugging and testing.
 * @param id - the shortid-generated id.
 */
function decode(id) {
    var characters = alphabet.shuffled();
    return {
        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
    };
}

module.exports = decode;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(6);
var encode = __webpack_require__(12);
var decode = __webpack_require__(31);
var build = __webpack_require__(30);
var isValid = __webpack_require__(33);

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = __webpack_require__(36) || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.decode = decode;
module.exports.isValid = isValid;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(6);

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var characters = alphabet.characters();
    var len = id.length;
    for(var i = 0; i < len;i++) {
        if (characters.indexOf(id[i]) === -1) {
            return false;
        }
    }
    return true;
}

module.exports = isShortId;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

function randomByte() {
    if (!crypto || !crypto.getRandomValues) {
        return Math.floor(Math.random() * 256) & 0x30;
    }
    var dest = new Uint8Array(1);
    crypto.getRandomValues(dest);
    return dest[0] & 0x30;
}

module.exports = randomByte;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = 0;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("tick42-glue-core", [], factory);
	else if(typeof exports === 'object')
		exports["tick42-glue-core"] = factory();
	else
		root["tick42-glue-core"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 65);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.4+314e4831
 */

(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && "function" === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var TRY_CATCH_ERROR = { error: null };

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    TRY_CATCH_ERROR.error = error;
    return TRY_CATCH_ERROR;
  }
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === TRY_CATCH_ERROR) {
      reject(promise, TRY_CATCH_ERROR.error);
      TRY_CATCH_ERROR.error = null;
    } else if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = void 0,
      failed = void 0;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    return promise.then(function (value) {
      return constructor.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      return constructor.resolve(callback()).then(function () {
        throw reason;
      });
    });
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));



//# sourceMappingURL=es6-promise.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), __webpack_require__(3)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function createRegistry() {
    var callbacks = {};
    function add(key, callback) {
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey) {
            callbacksForKey = [];
            callbacks[key] = callbacksForKey;
        }
        callbacksForKey.push(callback);
        return function () {
            var allForKey = callbacks[key];
            if (!allForKey) {
                return;
            }
            allForKey = allForKey.filter(function (item) {
                return item !== callback;
            });
            callbacks[key] = allForKey;
        };
    }
    function execute(key) {
        var argumentsArr = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            argumentsArr[_i - 1] = arguments[_i];
        }
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey || callbacksForKey.length === 0) {
            return [];
        }
        var results = [];
        callbacksForKey.forEach(function (callback) {
            try {
                var result = callback.apply(undefined, argumentsArr);
                results.push(result);
            }
            catch (err) {
                results.push(undefined);
            }
        });
        return results;
    }
    function clear() {
        callbacks = {};
    }
    return {
        add: add,
        execute: execute,
        clear: clear
    };
}
;
createRegistry.default = createRegistry;
module.exports = createRegistry;
//# sourceMappingURL=index.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    DEFAULT: 0,
    STRING: 1,
    NUMBER: 2,
    COUNT: 3,
    RATE: 4,
    STATISTICS: 6,
    TIMESTAMP: 7,
    ADDRESS: 8,
    TIMESPAN: 10,
    OBJECT: 11
};
//# sourceMappingURL=metric-types.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    validate: function (definition, parent, transport) {
        // TODO: Add validation for parent, transport, system
        if (definition === null || typeof definition !== "object") {
            throw new Error("Missing definition");
        }
        if (parent === null || typeof parent !== "object") {
            throw new Error("Missing parent");
        }
        if (transport === null || typeof transport !== "object") {
            throw new Error("Missing transport");
        }
    },
};
//# sourceMappingURL=helpers.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var shortid = __webpack_require__(7);
exports.default = shortid;
//# sourceMappingURL=random.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function convertInfoToInstance(info) {
    if (typeof info !== "object") {
        info = {};
    }
    return {
        application: info.ApplicationName,
        environment: info.Environment,
        machine: info.MachineName,
        pid: info.ProcessId,
        region: info.Region,
        service: info.ServiceName,
        user: info.UserName,
        started: info.ProcessStartTime,
    };
}
exports.convertInfoToInstance = convertInfoToInstance;
function isStreamingFlagSet(flags) {
    if (typeof flags !== "number" || isNaN(flags)) {
        return false;
    }
    // checking the largest Bit using bitwise ops
    var mask = 32;
    // tslint:disable-next-line:no-bitwise
    var result = flags & mask;
    return result === mask;
}
exports.isStreamingFlagSet = isStreamingFlagSet;
function convertInstance(instance) {
    return {
        ApplicationName: instance.application,
        ProcessId: instance.pid,
        MachineName: instance.machine,
        UserName: instance.user,
        Environment: instance.environment,
        Region: instance.region,
    };
}
exports.convertInstance = convertInstance;
//# sourceMappingURL=helpers.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(17);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomFromSeed = __webpack_require__(20);

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

module.exports = {
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function default_1(promise, successCallback, errorCallback) {
    if (typeof successCallback !== "function" && typeof errorCallback !== "function") {
        return promise;
    }
    if (typeof successCallback !== "function") {
        successCallback = function () { };
    }
    else if (typeof errorCallback !== "function") {
        errorCallback = function () { };
    }
    promise.then(successCallback, errorCallback);
}
exports.default = default_1;
//# sourceMappingURL=promisify.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ServerSubscription = /** @class */ (function () {
    function ServerSubscription(protocol, repoMethod, subscription) {
        this.protocol = protocol;
        this.repoMethod = repoMethod;
        this.subscription = subscription;
    }
    Object.defineProperty(ServerSubscription.prototype, "stream", {
        get: function () { return this.repoMethod.stream; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerSubscription.prototype, "arguments", {
        get: function () { return this.subscription.arguments || {}; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerSubscription.prototype, "branchKey", {
        get: function () { return this.subscription.branchKey; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerSubscription.prototype, "instance", {
        get: function () { return this.subscription.instance; },
        enumerable: true,
        configurable: true
    });
    ServerSubscription.prototype.close = function () {
        this.protocol.server.closeSingleSubscription(this.repoMethod, this.subscription);
    };
    ServerSubscription.prototype.push = function (data) {
        this.protocol.server.pushDataToSingle(this.repoMethod, this.subscription, data);
    };
    return ServerSubscription;
}());
exports.default = ServerSubscription;
//# sourceMappingURL=subscription.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var callback_registry_1 = __webpack_require__(1);
/**
 * A template for gateway connections - this is extended from specific protocols and transports.
 */
var ConnectionImpl = /** @class */ (function () {
    function ConnectionImpl(settings) {
        // The message handlers that have to be executed for each received message
        this.messageHandlers = {};
        this.ids = 1;
        this.registry = callback_registry_1.default();
        this._connected = false;
        this._settings = settings;
    }
    ConnectionImpl.prototype.init = function (transport, protocol) {
        this._protocol = protocol;
        this._transport = transport;
        this._transport.onConnectedChanged(this.handleConnectionChanged.bind(this));
        this._transport.onMessage(this.handleTransportMessage.bind(this));
    };
    ConnectionImpl.prototype.send = function (product, type, message, id, options) {
        // create a message using the protocol
        if (this._transport.isObjectBasedTransport) {
            var msg = this._protocol.createObjectMessage(product, type, message, id);
            return this._transport.sendObject(msg, product, type, options);
        }
        else {
            var strMessage = this._protocol.createStringMessage(product, type, message, id);
            return this._transport.send(strMessage, product, type, options);
        }
    };
    ConnectionImpl.prototype.on = function (product, type, messageHandler) {
        type = type.toLowerCase();
        if (this.messageHandlers[type] === undefined) {
            this.messageHandlers[type] = {};
        }
        var id = this.ids++;
        this.messageHandlers[type][id] = messageHandler;
        return {
            type: type,
            id: id,
        };
    };
    // Remove a handler
    ConnectionImpl.prototype.off = function (info) {
        delete this.messageHandlers[info.type.toLowerCase()][info.id];
    };
    Object.defineProperty(ConnectionImpl.prototype, "isConnected", {
        get: function () {
            return this._connected;
        },
        enumerable: true,
        configurable: true
    });
    ConnectionImpl.prototype.connected = function (callback) {
        if (this._connected) {
            callback(this._settings.ws || this._settings.http);
        }
        return this.registry.add("connected", callback);
    };
    ConnectionImpl.prototype.disconnected = function (callback) {
        return this.registry.add("disconnected", callback);
    };
    ConnectionImpl.prototype.login = function (authRequest) {
        // open the protocol in case it was closed by explicity logout
        this._transport.open();
        return this._protocol.login(authRequest);
    };
    ConnectionImpl.prototype.logout = function () {
        this._protocol.logout();
        this._transport.close();
    };
    ConnectionImpl.prototype.loggedIn = function (callback) {
        return this._protocol.loggedIn(callback);
    };
    Object.defineProperty(ConnectionImpl.prototype, "protocolVersion", {
        get: function () {
            return this._settings.protocolVersion || 1;
        },
        enumerable: true,
        configurable: true
    });
    ConnectionImpl.prototype.toAPI = function () {
        var that = this;
        return {
            send: that.send.bind(that),
            on: that.on.bind(that),
            off: that.off.bind(that),
            login: that.login.bind(that),
            logout: that.logout.bind(that),
            loggedIn: that.loggedIn.bind(that),
            connected: that.connected.bind(that),
            disconnected: that.disconnected.bind(that),
            get protocolVersion() {
                return that.protocolVersion;
            }
        };
    };
    ConnectionImpl.prototype.distributeMessage = function (message, type) {
        // Retrieve handlers for the message type
        var handlers = this.messageHandlers[type.toLowerCase()];
        if (handlers !== undefined) {
            // Execute them
            Object.keys(handlers).forEach(function (handlerId) {
                var handler = handlers[handlerId];
                if (handler !== undefined) {
                    handler(message);
                }
            });
        }
    };
    ConnectionImpl.prototype.handleConnectionChanged = function (connected) {
        if (this._connected === connected) {
            return;
        }
        this._connected = connected;
        if (connected) {
            this.registry.execute("connected");
        }
        else {
            this.registry.execute("disconnected");
        }
    };
    ConnectionImpl.prototype.handleTransportMessage = function (msg) {
        var msgObj;
        if (typeof msg === "string") {
            msgObj = this._protocol.processStringMessage(msg);
        }
        else {
            msgObj = this._protocol.processObjectMessage(msg);
        }
        this.distributeMessage(msgObj.msg, msgObj.msgType);
    };
    return ConnectionImpl;
}());
exports.default = ConnectionImpl;
//# sourceMappingURL=connection.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = __webpack_require__(79);
var main_2 = __webpack_require__(51);
var main_3 = __webpack_require__(64);
var main_4 = __webpack_require__(31);
var config_1 = __webpack_require__(48);
var dummyConnection_1 = __webpack_require__(61);
var timer_1 = __webpack_require__(82);
var GlueCore = function (userConfig, ext) {
    var hc;
    var glue42gd;
    if (typeof window !== "undefined") {
        hc = window.htmlContainer;
        glue42gd = window.glue42gd;
    }
    var glueInitTimer = timer_1.default();
    userConfig = userConfig || {};
    ext = ext || {};
    var internalConfig = config_1.default(userConfig, ext, hc, glue42gd);
    // Init the GLUE namespace
    var _connection;
    var _agm;
    var _logger;
    var _rootMetrics;
    var _metrics;
    var libs = {};
    function registerLib(name, inner, t) {
        inner.initStartTime = t.startTime;
        if (inner.ready) {
            inner.ready().then(function () {
                inner.initTime = t.stop();
                inner.initEndTime = t.endTime;
            });
        }
        else {
            inner.initTime = t.stop();
            inner.initEndTime = t.endTime;
        }
        libs[name] = inner;
        GlueCore[name] = inner;
    }
    function setupConnection() {
        var initTimer = timer_1.default();
        internalConfig.connection.logger = _logger.subLogger("connection");
        _connection = main_2.default(internalConfig.connection);
        var authPromise = Promise.resolve(internalConfig.auth);
        // no auth - what we do in different protocol versions
        if (internalConfig.connection && !internalConfig.auth) {
            var protocolVersion = internalConfig.connection.protocolVersion;
            // v1 or no protocol version - we don't need auth in that case
            if (!protocolVersion || protocolVersion === 1) {
                registerLib("connection", _connection, initTimer);
                return Promise.resolve({});
            }
            // v2 requires auth
            if (protocolVersion === 2) {
                return Promise.reject("You need to provide auth information");
            }
            // v3 if running in gd pull off gw token. If not in gd reject
            if (protocolVersion === 3) {
                if (glue42gd) {
                    authPromise = glue42gd.getGWToken().then(function (token) {
                        return {
                            gatewayToken: token
                        };
                    });
                }
                else {
                    return Promise.reject("You need to provide auth information");
                }
            }
        }
        return authPromise
            .then(function (authConfig) {
            // convert the authConfig to AuthRequest object
            var authRequest;
            if (typeof authConfig === "string" || typeof authConfig === "number") {
                authRequest = {
                    token: authConfig
                };
            }
            else if (Object.prototype.toString.call(authConfig) === "[object Object]") {
                authRequest = authConfig;
            }
            else {
                throw new Error("Invalid auth object - " + JSON.stringify(authConfig));
            }
            return authRequest;
        })
            .then(function (authRequest) {
            // do the login
            return _connection.login(authRequest);
        })
            .then(function (identity) {
            if (identity) {
                if (identity.machine) {
                    internalConfig.agm.instance.machine = identity.machine;
                }
                if (identity.user) {
                    internalConfig.agm.instance.user = identity.user;
                }
            }
            registerLib("connection", _connection, initTimer);
            return internalConfig;
        });
    }
    function setupLogger() {
        // Logger
        var initTimer = timer_1.default();
        var loggerConfig = {
            identity: internalConfig.identity,
            getConnection: function () {
                return _connection || dummyConnection_1.default;
            },
            publish: internalConfig.logger.publish || "off",
            console: internalConfig.logger.console || "info",
            metrics: (internalConfig.metrics && internalConfig.logger.metrics) || "off"
        };
        _logger = main_3.default(loggerConfig);
        registerLib("logger", _logger, initTimer);
        return Promise.resolve(undefined);
    }
    function setupMetrics() {
        if (internalConfig.metrics) {
            var initTimer = timer_1.default();
            _rootMetrics = main_1.default({
                identity: internalConfig.metrics.identity,
                connection: internalConfig.metrics ? _connection : dummyConnection_1.default,
                logger: _logger.subLogger("metrics")
            });
            _metrics = _rootMetrics.subSystem("App");
            // Creating subsystem for reporting and feature metric
            var reportingSystem_1 = _metrics.subSystem("reporting");
            var def_1 = {
                name: "features",
                conflation: 1 /* TickByTick */,
            };
            var _featureMetric_1;
            _metrics.featureMetric = function (name, action, payload) {
                if (typeof name === "undefined" || name === "") {
                    throw new Error("name is mandatory");
                }
                else if (typeof action === "undefined" || action === "") {
                    throw new Error("action is mandatory");
                }
                else if (typeof payload === "undefined" || payload === "") {
                    throw new Error("payload is mandatory");
                }
                if (!_featureMetric_1) {
                    _featureMetric_1 = reportingSystem_1.objectMetric(def_1, { name: name, action: action, payload: payload });
                }
                else {
                    _featureMetric_1.update({
                        name: name,
                        action: action,
                        payload: payload
                    });
                }
            };
            _logger.metricsLevel("warn", _metrics.parent.subSystem("LogEvents"));
            registerLib("metrics", _metrics, initTimer);
        }
        return Promise.resolve(undefined);
    }
    function setupAGM() {
        var initTimer = timer_1.default();
        // AGM
        var agmConfig = {
            instance: internalConfig.agm.instance,
            connection: _connection,
            logger: _logger.subLogger("agm"),
            metrics: undefined,
            forceGW: internalConfig.connection && internalConfig.connection.force
        };
        if (internalConfig.metrics) {
            agmConfig.metrics = _rootMetrics.subSystem("AGM");
        }
        return new Promise(function (resolve, reject) {
            main_4.default(agmConfig)
                .then(function (agmLib) {
                _agm = agmLib;
                registerLib("agm", _agm, initTimer);
                resolve(internalConfig);
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    }
    function setupExternalLibs(externalLibs) {
        try {
            externalLibs.forEach(function (lib) {
                setupExternalLib(lib.name, lib.create);
            });
            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    function setupExternalLib(name, createCallback) {
        var initTimer = timer_1.default();
        var lib = createCallback(libs);
        if (lib) {
            registerLib(name, lib, initTimer);
        }
    }
    function waitForLibs() {
        // get all libs that have ready promises and wait for these to be ready
        var libsReadyPromises = Object.keys(libs).map(function (key) {
            var lib = libs[key];
            return lib.ready ?
                lib.ready() : Promise.resolve();
        });
        return Promise.all(libsReadyPromises);
    }
    function constructGlueObject() {
        var feedbackFunc = function () {
            if (!_agm) {
                return;
            }
            _agm.invoke("T42.ACS.Feedback", {}, "best");
        };
        var info = { glueVersion: internalConfig.version };
        glueInitTimer.stop();
        var glue = {
            feedback: feedbackFunc,
            info: info,
            version: internalConfig.version,
            userConfig: userConfig
        };
        // ver performance
        glue.performance = {
            get browser() {
                return window.performance.timing;
            },
            get memory() {
                return window.performance.memory;
            },
            get initTimes() {
                var result = Object.keys(glue)
                    .filter(function (key) {
                    if (key === "initTimes") {
                        return false;
                    }
                    return glue[key].initTime;
                })
                    .map(function (key) {
                    return {
                        name: key,
                        time: glue[key].initTime,
                        startTime: glue[key].initStartTime,
                        endTime: glue[key].initEndTime
                    };
                });
                // add glue
                result.push({
                    name: "glue",
                    startTime: glueInitTimer.startTime,
                    endTime: glueInitTimer.endTime,
                    time: glueInitTimer.period
                });
                return result;
            }
        };
        // attach each lib to glue && attach versions to info object
        Object.keys(libs).forEach(function (key) {
            var lib = libs[key];
            glue[key] = lib;
            info[key] = lib.version;
        });
        // push perf data to hc if needed
        if (hc && hc.perfDataNeeded && hc.updatePerfData) {
            var delay = hc.perfDataDelay || 100;
            setTimeout(function () {
                hc.updatePerfData(glue.performance);
            }, delay);
        }
        // construct the config object to be exposed to end user
        // transfer config keys from internalConfig and then ext
        glue.config = {};
        if (ext.enrichGlue) {
            ext.enrichGlue(glue);
        }
        Object.keys(internalConfig).forEach(function (k) {
            glue.config[k] = internalConfig[k];
        });
        if (ext.extOptions) {
            Object.keys(ext.extOptions).forEach(function (k) {
                glue.config[k] = ext.extOptions[k];
            });
        }
        return glue;
    }
    return setupLogger()
        .then(setupConnection)
        .then(setupMetrics)
        .then(setupAGM)
        .then(function () {
        return setupExternalLibs(internalConfig.libs || []);
    })
        .then(waitForLibs)
        .then(constructGlueObject)
        .catch(function (err) {
        // if there is some some error include the libs object for debugging purposes
        return Promise.reject({
            err: err,
            libs: libs
        });
    });
};
exports.default = GlueCore;
//# sourceMappingURL=glue.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)["Promise"]))

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = {
	"name": "tick42-glue-core",
	"version": "3.13.0",
	"description": "Glue42 core library including logger, connection, agm and metrics",
	"main": "./dist/node/tick42-glue-core.js",
	"types": "./glue.d.ts",
	"browser": "./dist/web/tick42-glue-core.js",
	"scripts": {
		"init-dev-mode": "node ./build/scripts/init-dev-mode.js",
		"remove-installed-dependencies": "node ./build/scripts/remove-installed-dependencies.js",
		"clean": "node ./build/scripts/clean.js",
		"pre:build": "npm run clean && npm run tslint && tsc && set NODE_ENV=development",
		"file-versionify": "node ./build/scripts/file-versionify.js",
		"tslint": "tslint -t codeFrame ./src/**.ts",
		"tslint:fix": "tslint -t codeFrame --fix ./src/**.ts",
		"watch": "onchange ./src/**/*.ts -- npm run build:dev",
		"build:dev": "npm run pre:build && set NODE_ENV=development && webpack && npm run file-versionify",
		"build:prod": "npm run pre:build && set NODE_ENV=development && webpack && set NODE_ENV=production && webpack && npm run file-versionify",
		"docs": "typedoc --options typedoc.json ./src",
		"prepublish": "npm run build:prod && npm run test:only",
		"test": "npm run build:dev && npm run test:only",
		"test:only": "mocha ./tests/ --recursive",
		"test:core": "mocha ./tests/core",
		"test:agm": "mocha ./tests/agm"
	},
	"repository": {
		"type": "git",
		"url": "https://stash.tick42.com/scm/tg/js-glue-core.git"
	},
	"author": {
		"name": "Tick42",
		"url": "http://www.glue42.com"
	},
	"license": "ISC",
	"dependencies": {
		"callback-registry": "^2.3.1",
		"es6-promise": "^4.1.0",
		"shortid": "^2.2.6",
		"util-deprecate": "^1.0.2",
		"ws": "^0.7.2"
	},
	"devDependencies": {
		"@types/shortid": "0.0.29",
		"archiver": "^1.3.0",
		"babel-core": "^6.25.0",
		"babel-loader": "^6.4.1",
		"babel-plugin-add-module-exports": "^0.2.1",
		"babel-preset-es2015": "^6.16.0",
		"babel-preset-stage-2": "^6.22.0",
		"chai": "^4.0.2",
		"deep-equal": "^1.0.1",
		"mocha": "^2.5.3",
		"onchange": "3.*",
		"pre-commit": "^1.1.3",
		"readline-sync": "^1.4.5",
		"shelljs": "^0.6.0",
		"tick42-gateway": "^0.2.2",
		"tick42-webpack-config": "4.1.6",
		"tslint": "^5.4.3",
		"typedoc": "^0.5.10",
		"typescript": "^2.6.2",
		"webpack": "2.3.3"
	}
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(8);

/**
 * Decode the id to get the version and worker
 * Mainly for debugging and testing.
 * @param id - the shortid-generated id.
 */
function decode(id) {
    var characters = alphabet.shuffled();
    return {
        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
    };
}

module.exports = decode;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomByte = __webpack_require__(19);

function encode(lookup, number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + lookup( ( (number >> (4 * loopCounter)) & 0x0f ) | randomByte() );
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = encode;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(8);
var encode = __webpack_require__(16);
var decode = __webpack_require__(15);
var isValid = __webpack_require__(18);

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = __webpack_require__(21) || 0;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function generate() {

    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + encode(alphabet.lookup, version);
    str = str + encode(alphabet.lookup, clusterWorkerId);
    if (counter > 0) {
        str = str + encode(alphabet.lookup, counter);
    }
    str = str + encode(alphabet.lookup, seconds);

    return str;
}


/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}


// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.decode = decode;
module.exports.isValid = isValid;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(8);

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var characters = alphabet.characters();
    var len = id.length;
    for(var i = 0; i < len;i++) {
        if (characters.indexOf(id[i]) === -1) {
            return false;
        }
    }
    return true;
}

module.exports = isShortId;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

function randomByte() {
    if (!crypto || !crypto.getRandomValues) {
        return Math.floor(Math.random() * 256) & 0x30;
    }
    var dest = new Uint8Array(1);
    crypto.getRandomValues(dest);
    return dest[0] & 0x30;
}

module.exports = randomByte;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = 0;


/***/ }),
/* 22 */
/***/ (function(module, exports) {


/**
 * Module dependencies.
 */

var global = (function() { return this; })();

/**
 * WebSocket constructor.
 */

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Module exports.
 */

module.exports = WebSocket ? ws : null;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object) opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = __webpack_require__(24);
var server_1 = __webpack_require__(45);
var AGMImpl = /** @class */ (function () {
    function AGMImpl(protocol, clientRepository, serverRepository, instance, configuration) {
        this.protocol = protocol;
        this.clientRepository = clientRepository;
        this.serverRepository = serverRepository;
        this.instance = instance;
        this.configuration = configuration;
        this.client = new client_1.default(protocol, clientRepository, instance, configuration);
        this.server = new server_1.default(protocol, serverRepository, instance, configuration);
    }
    AGMImpl.prototype.serverRemoved = function (callback) {
        return this.client.serverRemoved(callback);
    };
    AGMImpl.prototype.serverAdded = function (callback) {
        return this.client.serverAdded(callback);
    };
    AGMImpl.prototype.serverMethodRemoved = function (callback) {
        return this.client.serverMethodRemoved(callback);
    };
    AGMImpl.prototype.serverMethodAdded = function (callback) {
        return this.client.serverMethodAdded(callback);
    };
    AGMImpl.prototype.methodRemoved = function (callback) {
        return this.client.methodRemoved(callback);
    };
    AGMImpl.prototype.methodAdded = function (callback) {
        return this.client.methodAdded(callback);
    };
    AGMImpl.prototype.methodsForInstance = function (instance) {
        return this.client.methodsForInstance(instance);
    };
    AGMImpl.prototype.methods = function (methodFilter) {
        return this.client.methods(methodFilter);
    };
    AGMImpl.prototype.servers = function (methodFilter) {
        return this.client.servers(methodFilter);
    };
    AGMImpl.prototype.subscribe = function (method, options, successCallback, errorCallback) {
        return this.client.subscribe(method, options, successCallback, errorCallback);
    };
    AGMImpl.prototype.createStream = function (streamDef, callbacks, successCallback, errorCallback) {
        return this.server.createStream(streamDef, callbacks, successCallback, errorCallback);
    };
    AGMImpl.prototype.unregister = function (methodFilter) {
        return this.server.unregister(methodFilter);
    };
    AGMImpl.prototype.registerAsync = function (methodDefinition, callback) {
        return this.server.registerAsync(methodDefinition, callback);
    };
    AGMImpl.prototype.register = function (methodDefinition, callback) {
        return this.server.register(methodDefinition, callback);
    };
    AGMImpl.prototype.invoke = function (methodFilter, argumentObj, target, additionalOptions, success, error) {
        return this.client.invoke(methodFilter, argumentObj, target, additionalOptions, success, error);
    };
    AGMImpl.prototype.updateInstance = function (newInstance) {
        if (this.instance.machine === undefined) {
            this.instance.machine = newInstance.MachineName || newInstance.machine;
        }
        if (this.instance.user === undefined) {
            this.instance.user = newInstance.UserName || newInstance.user;
        }
        if (this.instance.environment === undefined) {
            this.instance.environment = newInstance.Environment || newInstance.environment;
        }
        if (this.instance.region === undefined) {
            this.instance.region = newInstance.Region || newInstance.region;
        }
    };
    return AGMImpl;
}());
exports.default = AGMImpl;
//# sourceMappingURL=agm.js.map

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
/*
  The AGM Client analyses server presences, collects information about their methods and allows users to invoke these methods.
 */
var invoke_1 = __webpack_require__(25);
var promisify_1 = __webpack_require__(9);
var Client = /** @class */ (function () {
    function Client(protocol, repo, instance, configuration) {
        this.protocol = protocol;
        this.repo = repo;
        this.instance = instance;
        this.configuration = configuration;
        // Instantiate the module that handles method execution and responses
        this.clientInvocations = new invoke_1.default(protocol);
    }
    /**
     * Subscribes to an AGM streaming method
     */
    Client.prototype.subscribe = function (method, options, successCallback, errorCallback) {
        // options can have arguments:{}, target: 'best'/'all'/{server_instance}, waitTimeoutMs:3000
        var _this = this;
        var callProtocolSubscribe = function (targetServers, stream, successProxy, errorProxy) {
            _this.protocol.client.subscribe(stream, options.arguments, targetServers, { methodResponseTimeout: options.waitTimeoutMs }, successProxy, errorProxy);
        };
        var promise = new Promise(function (resolve, reject) {
            var successProxy = function (sub) {
                resolve(sub);
            };
            var errorProxy = function (err) {
                reject(err);
            };
            var methodDef;
            if (typeof method === "string") {
                methodDef = { name: method };
            }
            else {
                methodDef = method;
            }
            if (options === undefined) {
                options = {};
            }
            var target = options.target;
            if (target === undefined) {
                target = "best";
            }
            if (typeof target === "string" && target !== "all" && target !== "best") {
                reject({ message: '"' + target + '" is not a valid target. Valid targets are "all", "best", or an instance.' });
            }
            if (options.methodResponseTimeout === undefined) {
                // legacy support
                options.methodResponseTimeout = options.method_response_timeout;
                if (options.methodResponseTimeout === undefined) {
                    // fallback to default
                    options.methodResponseTimeout = _this.configuration.methodResponseTimeout;
                }
            }
            if (options.waitTimeoutMs === undefined) {
                // legacy support
                options.waitTimeoutMs = options.wait_for_method_timeout;
                if (options.waitTimeoutMs === undefined) {
                    // fallback to default
                    options.waitTimeoutMs = _this.configuration.waitTimeoutMs;
                }
            }
            var delayStep = 500;
            var delayTillNow = 0;
            // don't check if the method is streaming or not, subscribing to non-streaming method has to invoke it
            // get all servers that have method(s) matching the filter
            var currentServers = _this.getServerMethodsByFilterAndTarget(methodDef, target);
            if (currentServers.length > 0) {
                callProtocolSubscribe(currentServers, currentServers[0].methods[0], successProxy, errorProxy);
            }
            else {
                var retry_1 = function () {
                    delayTillNow += delayStep;
                    // get all servers that have method(s) matching the filter
                    currentServers = _this.getServerMethodsByFilterAndTarget(methodDef, target);
                    if (currentServers.length > 0) {
                        var streamInfo = currentServers[0].methods[0];
                        callProtocolSubscribe(currentServers, streamInfo, successProxy, errorProxy);
                    }
                    else if (delayTillNow >= options.waitTimeoutMs) {
                        var def = typeof method === "string" ? { name: method } : method;
                        var info = {
                            id: undefined,
                            info: def,
                            getInfoForUser: function () {
                                return methodDef;
                            },
                            protocolState: undefined,
                        };
                        callProtocolSubscribe(currentServers, info, successProxy, errorProxy);
                    }
                    else {
                        setTimeout(retry_1, delayStep);
                    }
                };
                setTimeout(retry_1, delayStep);
            }
        });
        return promisify_1.default(promise, successCallback, errorCallback);
    };
    /**
     * Returns all servers. If methodFilter is specified will return a list of servers
     * having a method matching the filter.
     */
    Client.prototype.servers = function (methodFilter) {
        return this.getServers(methodFilter).map(function (serverMethodMap) {
            return serverMethodMap.server.getInfoForUser();
        });
    };
    /**
     * Returns all methods that match the given filter. If no filter specified returns all methods.
     */
    Client.prototype.methods = function (methodFilter) {
        return this.getMethods(methodFilter).map(function (m) {
            return m.getInfoForUser();
        });
    };
    /**
     * Returns all agm method registered by some server
     */
    Client.prototype.methodsForInstance = function (instance) {
        return this.getMethodsForInstance(instance).map(function (m) {
            return m.getInfoForUser();
        });
    };
    /**
     * Called when a method is added for the first time by any application
     */
    Client.prototype.methodAdded = function (callback) {
        return this.repo.onMethodAdded(function (method) {
            callback(method.getInfoForUser());
        });
    };
    /**
     * Called when a method is removed from the last application offering it
     * @function methodRemoved
     * @param {MethodCallback} callback
     */
    Client.prototype.methodRemoved = function (callback) {
        return this.repo.onMethodRemoved(function (method) {
            callback(method.getInfoForUser());
        });
    };
    /**
     * Called when an application offering methods (server) is discovered
     * @param {InstanceCallback} callback Callback that will be invoked with the {@link Instance} of the new sever
     */
    Client.prototype.serverAdded = function (callback) {
        return this.repo.onServerAdded(function (server) {
            callback(server.getInfoForUser());
        });
    };
    /**
     * Called when an app offering methods stops offering them or exits
     * @param {InstanceCallback} callback Callback that will be invoked with the {@link Instance} of the removed server
     */
    Client.prototype.serverRemoved = function (callback) {
        return this.repo.onServerRemoved(function (server, reason) {
            callback(server.getInfoForUser(), reason);
        });
    };
    /**
     * Called when a method is offered by an application. This will be called for each server offering the method
     * where {@link methodAdded} will be called only for the first time the method is registered.
     *
     * @param {ServerMethodCallback} callback
     */
    Client.prototype.serverMethodAdded = function (callback) {
        return this.repo.onServerMethodAdded(function (server, method) {
            callback({ server: server.getInfoForUser(), method: method.getInfoForUser() });
        });
    };
    /**
     * Called when a server stops offering a method
     * @param {ServerMethodCallback} callback
     */
    Client.prototype.serverMethodRemoved = function (callback) {
        return this.repo.onServerMethodRemoved(function (server, method) {
            callback({ server: server.getInfoForUser(), method: method.getInfoForUser() });
        });
    };
    /**
     * Invokes an AGM method
     * @param {MethodDefinition} methodFilter Method to invoke
     * @param {Object} argumentObj Arguments for the invocation
     * @param {Instance|Instance[]|string} [target] Defines which server(s) to target with the invocation - can be one of:
     * * ’best' - executes the method on the best (or first) server
     * * 'all' - executes the method on all servers offering it
     * * AGM instance (or a subset, used for filtering), e.g. { application: 'appName' }
     * * an array of AGM instances/filters
     * @param {InvocationOptions} [additionalOptions] Additional options for the invocation
     * @param {function} [success] - (use this if you prefer callback style instead of promises)
     * Callback that will be called with {@link InvocationResult} object when the invocation is successful
     * @param {function} [error] -  (use this if you prefer callback style instead of promises)
     * Callback that will be called with {@link InvocationError} object when the invocation is not successful
     * @returns {Promise<InvocationResult>}
     * @example
     * glue.agm.invoke(
     *   'Sum',
     *   { a: 37, b: 5 }) // everything else is optional
     *   .then(
     *      function(result) {
     *      console.log('37 + 5 = ' + result.returned.answer)
     *   })
     *   .catch(
     *      function(err) {
     *      console.error('Failed to execute Sum' + err.message)
     *   })
     */
    Client.prototype.invoke = function (methodFilter, argumentObj, target, additionalOptions, success, error) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var successProxy = function (args) {
                // var parsed = JSON.parse(args);
                resolve(args);
            };
            var errorProxy = function (err) {
                // var parsed = JSON.parse(args);
                reject(err);
            };
            // Add default params
            if (!argumentObj) {
                argumentObj = {};
            }
            if (!target) {
                target = "best";
            }
            if (typeof target === "string" && target !== "all" && target !== "best") {
                reject({ message: '"' + target + '" is not a valid target. Valid targets are "all" and "best".' });
            }
            if (!additionalOptions) {
                additionalOptions = {};
            }
            if (additionalOptions.methodResponseTimeoutMs === undefined) {
                // legacy support
                additionalOptions.methodResponseTimeoutMs = additionalOptions.method_response_timeout;
                if (additionalOptions.methodResponseTimeoutMs === undefined) {
                    // fallback to default
                    additionalOptions.methodResponseTimeoutMs = _this.configuration.methodResponseTimeout;
                }
            }
            if (additionalOptions.waitTimeoutMs === undefined) {
                // legacy support
                additionalOptions.waitTimeoutMs = additionalOptions.wait_for_method_timeout;
                if (additionalOptions.waitTimeoutMs === undefined) {
                    // fallback to default
                    additionalOptions.waitTimeoutMs = _this.configuration.waitTimeoutMs;
                }
            }
            if (additionalOptions.waitTimeoutMs !== undefined && typeof additionalOptions.waitTimeoutMs !== "number") {
                reject({ message: '"' + additionalOptions.waitTimeoutMs + '" is not a valid number for \'waitTimeoutMs\'' });
                return;
            }
            // Check if the arguments are an object
            if (typeof argumentObj !== "object") {
                reject({ message: "The method arguments must be an object." });
                return;
            }
            if (typeof methodFilter === "string") {
                methodFilter = { name: methodFilter };
            }
            var serversMethodMap = _this.getServerMethodsByFilterAndTarget(methodFilter, target);
            if (serversMethodMap.length === 0) {
                _this.invokeUnExisting(methodFilter, argumentObj, target, additionalOptions, successProxy, errorProxy);
            }
            else if (serversMethodMap.length === 1) {
                var serverMethodPair = serversMethodMap[0];
                _this.clientInvocations.invoke(serverMethodPair.methods[0], argumentObj, serverMethodPair.server, additionalOptions, successProxy, errorProxy);
            }
            else {
                _this.invokeOnAll(serversMethodMap, argumentObj, additionalOptions, successProxy, errorProxy);
            }
        });
        return promisify_1.default(promise, success, error);
    };
    /**
     * Called when the user tries to invoke a method which does not exist
     */
    Client.prototype.invokeUnExisting = function (methodFilter, argumentObj, target, additionalOptions, success, error) {
        var _this = this;
        var callError = function () {
            error({
                method: methodFilter,
                called_with: argumentObj,
                message: "Can not find a method matching " + JSON.stringify(methodFilter) + " with server filter " + JSON.stringify(target),
                executed_by: undefined,
                returned: undefined,
                status: undefined,
            });
        };
        if (additionalOptions.waitTimeoutMs === 0) {
            callError();
        }
        else {
            var delayStep_1 = 500;
            var delayTillNow_1 = 0;
            var retry_2 = function () {
                delayTillNow_1 += delayStep_1;
                // get all servers that have method(s) matching the filter
                var serversMethodMap = _this.getServerMethodsByFilterAndTarget(methodFilter, target);
                if (serversMethodMap.length > 0) {
                    _this.invoke(methodFilter, argumentObj, target, additionalOptions, success, error);
                }
                else if (delayTillNow_1 >= additionalOptions.waitTimeoutMs) {
                    callError();
                }
                else {
                    setTimeout(retry_2, delayStep_1);
                }
            };
            setTimeout(retry_2, delayStep_1);
        }
    };
    /**
     * Calls a method for all servers and unifies the results they return into one:
     */
    Client.prototype.invokeOnAll = function (serverMethodsMap, argumentObj, additionalOptions, success, error) {
        var _this = this;
        // Here we will store the results that the getServers return
        var successes = [];
        var errors = [];
        // These are the callbacks
        var successCallback = function (result) {
            successes.push(result);
            sendResponse();
        };
        var errorCallback = function (err) {
            errors.push(err);
            sendResponse();
        };
        // Calls the main success and error callbacks with the aggregated results
        var sendResponse = function () {
            // wait till everybody is finished
            if (successes.length + errors.length < serverMethodsMap.length) {
                return;
            }
            // Execute the "success" callback
            if (successes.length !== 0) {
                var result_1 = successes.reduce(function (obj, invResult) {
                    obj.method = invResult.method;
                    obj.called_with = invResult.called_with;
                    obj.returned = invResult.returned;
                    obj.all_return_values.push({
                        executed_by: invResult.executed_by,
                        returned: invResult.returned,
                        called_with: invResult.called_with,
                        method: invResult.method,
                        message: undefined,
                        status: undefined,
                    });
                    obj.executed_by = invResult.executed_by;
                    return obj;
                }, { all_return_values: [] });
                // If we get errors from one of the getServers add them to the success object that will be resolved.
                if (errors.length !== 0) {
                    result_1.all_errors = [];
                    errors.forEach(function (obj) {
                        result_1.all_errors.push({
                            // executed_by : obj.executed_by, // we don't get executed_by object from the error clientInvocations
                            name: obj.method.name,
                            message: obj.message,
                        });
                    });
                }
                success(result_1);
            }
            else if (errors.length !== 0) {
                error(errors.reduce(function (obj, currentError) {
                    obj.method = currentError.method;
                    obj.called_with = currentError.called_with;
                    obj.message = currentError.message;
                    obj.all_errors.push({
                        executed_by: currentError.executed_by,
                        message: currentError.message,
                    });
                    // obj.executed_by = success.executed_by;
                    return obj;
                }, { all_errors: [] }));
            }
        };
        // Call the method for all targets
        serverMethodsMap.forEach(function (serverMethodsPair) {
            _this.clientInvocations.invoke(serverMethodsPair.methods[0], argumentObj, serverMethodsPair.server, additionalOptions, successCallback, errorCallback);
        });
    };
    /**
     * Filters an array of servers and returns the ones which match the target criteria
     */
    Client.prototype.filterByTarget = function (target, serverMethodMap) {
        var _this = this;
        // If the user specified target as string:
        var targetServerMethod = [];
        if (typeof target === "string") {
            if (target === "all") {
                targetServerMethod = serverMethodMap;
            }
            else if (target === "best") {
                // check if there is a server with the same machine as us
                var matchingMachine = serverMethodMap.filter(function (serverMethodPair) {
                    var serverInfo = serverMethodPair.server.info;
                    return serverInfo.machine === _this.instance.machine;
                })[0];
                if (matchingMachine) {
                    return [matchingMachine];
                }
                targetServerMethod = serverMethodMap[0] !== undefined ? [serverMethodMap[0]] : []; // If the user specified the target as server filter
            }
        }
        else {
            if (!Array.isArray(target)) {
                target = [target];
            }
            if (Array.isArray(target)) {
                // Retrieve all getServers that match the filters
                targetServerMethod = target.reduce(function (matches, filter) {
                    // Add matches for each filter
                    var myMatches = serverMethodMap.filter(function (serverMethodPair) {
                        return _this.instanceMatch(filter, serverMethodPair.server.info);
                    });
                    return matches.concat(myMatches);
                }, []);
            }
        }
        return targetServerMethod;
    };
    /**
     * Matches a server definition against a server filter
     */
    Client.prototype.instanceMatch = function (instanceFilter, instanceDefinition) {
        return this.containsProps(instanceFilter, instanceDefinition);
    };
    /**
     * Matches a method definition against a method filter
     */
    Client.prototype.methodMatch = function (methodFilter, methodDefinition) {
        return this.containsProps(methodFilter, methodDefinition);
    };
    /**
     * Checks if all properties of filter match properties in object
     */
    Client.prototype.containsProps = function (filter, object) {
        return Object.keys(filter).reduce(function (match, prop) {
            // ignore undefined properties and functions
            if (!filter[prop] || typeof filter[prop] === "function") {
                return match;
            }
            if (filter[prop].constructor === RegExp) {
                if (!filter[prop].test(object[prop])) {
                    return false;
                }
                else {
                    return match;
                }
            }
            else {
                if (String(filter[prop]).toLowerCase() !== String(object[prop]).toLowerCase()) {
                    return false;
                }
                else {
                    return match;
                }
            }
        }, true);
    };
    Client.prototype.getMethods = function (methodFilter) {
        var _this = this;
        if (methodFilter === undefined) {
            return this.repo.getMethods();
        }
        if (typeof methodFilter === "string") {
            methodFilter = { name: methodFilter };
        }
        return this.repo.getMethods().filter(function (method) {
            return _this.methodMatch(methodFilter, method.info);
        });
    };
    Client.prototype.getMethodsForInstance = function (instanceFilter) {
        var _this = this;
        var allServers = this.repo.getServers();
        var matchingServers = allServers.filter(function (server) {
            return _this.instanceMatch(instanceFilter, server.info);
        });
        if (matchingServers.length === 0) {
            return [];
        }
        var resultMethodsObject = {};
        if (matchingServers.length === 1) {
            resultMethodsObject = matchingServers[0].methods;
        }
        else {
            // we have more than one server matching, join all methods
            matchingServers.forEach(function (server) {
                Object.keys(server.methods).forEach(function (methodKey) {
                    var method = server.methods[methodKey];
                    resultMethodsObject[method.id] = method;
                });
            });
        }
        // transform the object to array
        return Object.keys(resultMethodsObject)
            .map(function (key) {
            return resultMethodsObject[key];
        });
    };
    Client.prototype.getServers = function (methodFilter) {
        var _this = this;
        var servers = this.repo.getServers();
        // No method - get all getServers
        if (methodFilter === undefined) {
            return servers.map(function (server) {
                return { server: server };
            });
        }
        // Non-existing method - return an empty array
        var methods = this.getMethods(methodFilter);
        if (methods === undefined) {
            return [];
        }
        return servers.reduce(function (prev, current) {
            var methodsForServer = _this.repo.getServerMethodsById(current.id);
            var matchingMethods = methodsForServer.filter(function (method) {
                return _this.methodMatch(methodFilter, method.info);
            });
            if (matchingMethods.length > 0) {
                prev.push({ server: current, methods: matchingMethods });
            }
            return prev;
        }, []);
    };
    /**
     * Returns an array of server-methods pairs for all servers that match the target and have at lease one method matching the method filter
     */
    Client.prototype.getServerMethodsByFilterAndTarget = function (methodFilter, target) {
        // get all servers that have method(s) matching the filter
        var serversMethodMap = this.getServers(methodFilter);
        // filter the server-method map by target
        return this.filterByTarget(target, serversMethodMap);
    };
    return Client;
}());
exports.default = Client;
//# sourceMappingURL=client.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)["Promise"]))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This module handles AGM method invocations - validating
 * inputs and delegating to protocol
 */
var random_1 = __webpack_require__(5);
var ClientInvocations = /** @class */ (function () {
    function ClientInvocations(_protocol) {
        var _this = this;
        this._protocol = _protocol;
        /** Store pending callback */
        this._pendingCallbacks = {};
        // subscribe for invocation results
        _protocol.client.onInvocationResult(function (invocationId, executedBy, status, result, resultMessage) { return _this.processInvocationResult(invocationId, executedBy, status, result, resultMessage); });
    }
    /**
     * Invokes an AGM method to a single AGM server, given valid input.
     */
    ClientInvocations.prototype.invoke = function (method, argumentsObj, target, stuff, success, error) {
        // Generate a unique invocation ID, for this invocation
        var invocationId = random_1.default();
        // Register the user's callbacks
        this.registerInvocation(invocationId, {
            method: method,
            calledWith: argumentsObj,
        }, success, error, stuff.methodResponseTimeoutMs);
        this._protocol.client.invoke(invocationId, method, argumentsObj, target, stuff);
    };
    /**
     * Register invocation so we can find it later when invocation result is received
     */
    ClientInvocations.prototype.registerInvocation = function (invocationId, invocationInfo, success, error, timeout) {
        var _this = this;
        // Adds the callbacks
        this._pendingCallbacks[invocationId] = { invocationInfo: invocationInfo, success: success, error: error };
        // Schedules to throw a timeout if nobody answers
        setTimeout(function () {
            if (_this._pendingCallbacks[invocationId] === undefined) {
                return;
            }
            error({
                method: invocationInfo.method.getInfoForUser(),
                called_with: invocationInfo.calledWith,
                executed_by: undefined,
                status: undefined,
                returned: undefined,
                message: "Invocation timeout (" + timeout + " ms) reached",
            });
            delete _this._pendingCallbacks[invocationId];
        }, timeout);
    };
    /**
     * Process invocation result received from protocol
     */
    ClientInvocations.prototype.processInvocationResult = function (invocationId, executedBy, status, result, resultMessage) {
        // Finds the appropriate callback
        var callback = this._pendingCallbacks[invocationId];
        if (callback === undefined) {
            return;
        }
        // If the server returned success, execute the success callback
        if (status === 0 && typeof callback.success === "function") {
            // Execute the success callback
            callback.success({
                method: callback.invocationInfo.method.getInfoForUser(),
                called_with: callback.invocationInfo.calledWith,
                executed_by: executedBy,
                returned: result,
                message: resultMessage,
                status: status,
            });
            // Else, return an error
        }
        else if (typeof callback.error === "function") {
            callback.error({
                method: callback.invocationInfo.method.getInfoForUser(),
                called_with: callback.invocationInfo.calledWith,
                executed_by: executedBy,
                message: resultMessage,
                // log_details: message.ResultLogDetails,
                status: status,
                returned: result,
            });
        }
        // Finally, remove the callbacks
        delete this._pendingCallbacks[invocationId];
    };
    return ClientInvocations;
}());
exports.default = ClientInvocations;
//# sourceMappingURL=invoke.js.map

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Repository holding servers and methods visible by this peer including those created by the peer itself.
 */
var callback_registry_1 = __webpack_require__(1);
var ClientRepository = /** @class */ (function () {
    function ClientRepository() {
        // each server has format {id:'', info:{}, methods:{}}
        // where methods has format {id:'', info:{}}
        this.servers = {};
        // object keyed by method id - value is number of servers that offer that method
        this.methodsCount = {};
        // store for callbacks
        this.callbacks = callback_registry_1.default();
    }
    // add a new server to internal collection
    ClientRepository.prototype.addServer = function (info, serverId) {
        var _this = this;
        var current = this.servers[serverId];
        if (current) {
            return current.id;
        }
        var serverEntry = {
            id: serverId,
            info: info,
            methods: {},
            getInfoForUser: function () {
                var serverInfo = _this.createUserServerInfo(serverEntry.info);
                serverInfo.getMethods = function () {
                    return _this.getServerMethodsById(serverEntry.id).map(function (m) {
                        return m.getInfoForUser();
                    });
                };
                serverInfo.getStreams = function () {
                    return _this.getServerMethodsById(serverEntry.id)
                        .filter(function (method) {
                        return method.info.supportsStreaming;
                    })
                        .map(function (m) {
                        return m.getInfoForUser();
                    });
                };
                return serverInfo;
            },
        };
        this.servers[serverId] = serverEntry;
        this.callbacks.execute("onServerAdded", serverEntry);
        return serverId;
    };
    ClientRepository.prototype.removeServerById = function (id, reason) {
        var _this = this;
        var server = this.servers[id];
        Object.keys(server.methods).forEach(function (methodId) {
            _this.removeServerMethod(id, methodId);
        });
        delete this.servers[id];
        this.callbacks.execute("onServerRemoved", server, reason);
    };
    ClientRepository.prototype.addServerMethod = function (serverId, method, protocolState) {
        if (!protocolState) {
            protocolState = {};
        }
        var server = this.servers[serverId];
        if (!server) {
            throw new Error("server does not exists");
        }
        var methodId = this.createMethodId(method);
        // server already has that method
        if (server.methods[methodId]) {
            return;
        }
        var that = this;
        var methodEntity = {
            id: methodId,
            info: method,
            getInfoForUser: function () {
                var result = that.createUserMethodInfo(methodEntity.info);
                result.getServers = function () {
                    return that.getServersByMethod(methodId);
                };
                return result;
            },
            protocolState: protocolState,
        };
        server.methods[methodId] = methodEntity;
        // increase the ref and notify listeners
        if (!this.methodsCount[methodId]) {
            this.methodsCount[methodId] = 0;
            this.callbacks.execute("onMethodAdded", methodEntity);
        }
        this.methodsCount[methodId] = this.methodsCount[methodId] + 1;
        this.callbacks.execute("onServerMethodAdded", server, methodEntity);
    };
    ClientRepository.prototype.createMethodId = function (methodInfo) {
        // Setting properties to defaults:
        var accepts = methodInfo.accepts !== undefined ? methodInfo.accepts : "";
        var returns = methodInfo.returns !== undefined ? methodInfo.returns : "";
        return (methodInfo.name + accepts + returns).toLowerCase();
    };
    ClientRepository.prototype.removeServerMethod = function (serverId, methodId) {
        var server = this.servers[serverId];
        if (!server) {
            throw new Error("server does not exists");
        }
        var method = server.methods[methodId];
        delete server.methods[methodId];
        // update ref counting
        this.methodsCount[methodId] = this.methodsCount[methodId] - 1;
        if (this.methodsCount[methodId] === 0) {
            this.callbacks.execute("onMethodRemoved", method);
        }
        this.callbacks.execute("onServerMethodRemoved", server, method);
    };
    ClientRepository.prototype.getMethods = function () {
        var _this = this;
        var allMethods = {};
        Object.keys(this.servers).forEach(function (serverId) {
            var server = _this.servers[serverId];
            Object.keys(server.methods).forEach(function (methodId) {
                var method = server.methods[methodId];
                allMethods[method.id] = method;
            });
        });
        var methodsAsArray = Object.keys(allMethods).map(function (id) {
            return allMethods[id];
        });
        return methodsAsArray;
    };
    ClientRepository.prototype.getServers = function () {
        var _this = this;
        var allServers = [];
        Object.keys(this.servers).forEach(function (serverId) {
            var server = _this.servers[serverId];
            allServers.push(server);
        });
        return allServers;
    };
    ClientRepository.prototype.getServerMethodsById = function (serverId) {
        var server = this.servers[serverId];
        return Object.keys(server.methods).map(function (id) {
            return server.methods[id];
        });
    };
    ClientRepository.prototype.onServerAdded = function (callback) {
        var unsubscribeFunc = this.callbacks.add("onServerAdded", callback);
        // replay all servers
        this.getServers().forEach(function (server) {
            callback(server);
        });
        return unsubscribeFunc;
    };
    ClientRepository.prototype.onMethodAdded = function (callback) {
        var unsubscribeFunc = this.callbacks.add("onMethodAdded", callback);
        // reply all existing methods
        this.getMethods().forEach(function (method) {
            callback(method);
        });
        return unsubscribeFunc;
    };
    ClientRepository.prototype.onServerMethodAdded = function (callback) {
        var unsubscribeFunc = this.callbacks.add("onServerMethodAdded", callback);
        // replay all existing server methods
        this.getServers().forEach(function (server) {
            var methods = server.methods;
            Object.keys(methods).forEach(function (methodId) {
                callback(server, methods[methodId]);
            });
        });
        return unsubscribeFunc;
    };
    ClientRepository.prototype.onMethodRemoved = function (callback) {
        var unsubscribeFunc = this.callbacks.add("onMethodRemoved", callback);
        return unsubscribeFunc;
    };
    ClientRepository.prototype.onServerRemoved = function (callback) {
        var unsubscribeFunc = this.callbacks.add("onServerRemoved", callback);
        return unsubscribeFunc;
    };
    ClientRepository.prototype.onServerMethodRemoved = function (callback) {
        var unsubscribeFunc = this.callbacks.add("onServerMethodRemoved", callback);
        return unsubscribeFunc;
    };
    ClientRepository.prototype.getServerById = function (id) {
        return this.servers[id];
    };
    ClientRepository.prototype.reset = function () {
        this.servers = {};
        this.methodsCount = {};
    };
    /**
     * Transforms internal server object to user object
     */
    ClientRepository.prototype.createUserServerInfo = function (serverInfo) {
        return {
            machine: serverInfo.machine,
            pid: serverInfo.pid,
            user: serverInfo.user,
            application: serverInfo.application,
            environment: serverInfo.environment,
            region: serverInfo.region,
            instance: serverInfo.instance,
            windowId: serverInfo.windowId,
            peerId: serverInfo.peerId,
        };
    };
    /**
     * Transforms internal method object to user object
     */
    ClientRepository.prototype.createUserMethodInfo = function (methodInfo) {
        var result = {
            name: methodInfo.name,
            accepts: methodInfo.accepts,
            returns: methodInfo.returns,
            description: methodInfo.description,
            displayName: methodInfo.displayName,
            objectTypes: methodInfo.objectTypes,
            supportsStreaming: methodInfo.supportsStreaming,
        };
        // now add some legacy stuff
        result.object_types = methodInfo.objectTypes;
        result.display_name = methodInfo.objectTypes;
        result.version = methodInfo.objectTypes;
        return result;
    };
    ClientRepository.prototype.getServersByMethod = function (id) {
        var _this = this;
        var allServers = [];
        Object.keys(this.servers).forEach(function (serverId) {
            var server = _this.servers[serverId];
            Object.keys(server.methods).forEach(function (methodId) {
                if (methodId === id) {
                    allServers.push(server.getInfoForUser());
                }
            });
        });
        return allServers;
    };
    return ClientRepository;
}());
exports.default = ClientRepository;
//# sourceMappingURL=repository.js.map

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var promisify_1 = __webpack_require__(9);
var NativeAGM = /** @class */ (function () {
    function NativeAGM(instance, helpers, agmFacade) {
        this.instance = instance;
        this.helpers = helpers;
        this.agmFacade = agmFacade;
        this.protocolVersion = this.agmFacade.protocolVersion;
    }
    NativeAGM.prototype.register = function (name, handler) {
        var methodInfoAsObject = this.helpers.stringToObject(name, "name");
        this.helpers.validateMethodInfo(methodInfoAsObject);
        if (this.protocolVersion && this.protocolVersion >= 3) {
            // for newer HC use the version where we don't pass arguments as JSON (because of different issues)
            this.agmFacade.register(JSON.stringify(methodInfoAsObject), handler, true); // return as objects
        }
        else {
            this.agmFacade.register(JSON.stringify(methodInfoAsObject), function (arg, caller) {
                var methodResult = handler(JSON.parse(arg), caller);
                return JSON.stringify(methodResult);
            });
        }
    };
    NativeAGM.prototype.registerAsync = function (name, handler) {
        if (!this.agmFacade.registerAsync) {
            throw new Error("not supported in that version of HtmlContainer");
        }
        var methodInfoAsObject = this.helpers.stringToObject(name, "name");
        this.helpers.validateMethodInfo(methodInfoAsObject);
        this.agmFacade.registerAsync(methodInfoAsObject, function (args, instance, tracker) {
            // execute the user callback
            handler(args, instance, function (successArgs) {
                tracker.success(successArgs);
            }, function (error) {
                tracker.error(error);
            });
        });
    };
    NativeAGM.prototype.unregister = function (definition) {
        this.agmFacade.unregister(JSON.stringify(this.helpers.stringToObject(definition, "name")));
    };
    NativeAGM.prototype.invoke = function (method, argumentObj, target, options, success, error) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (argumentObj === undefined) {
                argumentObj = {};
            }
            if (typeof argumentObj !== "object") {
                reject({ message: "The method arguments must be an object." });
            }
            if (options === undefined) {
                options = {};
            }
            target = _this.helpers.targetArgToObject(target);
            if (_this.agmFacade.invoke2) {
                // invoke ver2 - do not stringify arguments and result values
                _this.agmFacade.invoke2(JSON.stringify(_this.helpers.stringToObject(method, "name")), argumentObj, JSON.stringify(target), JSON.stringify(options), function (a) {
                    resolve(a);
                }, function (err) {
                    reject(err);
                });
            }
            else {
                var successProxy = void 0;
                var errorProxy = void 0;
                successProxy = function (args) {
                    var parsed = JSON.parse(args);
                    resolve(parsed);
                };
                errorProxy = function (args) {
                    var parsed = JSON.parse(args);
                    reject(parsed);
                };
                _this.agmFacade.invoke(JSON.stringify(_this.helpers.stringToObject(method, "name")), JSON.stringify(argumentObj), JSON.stringify(target), JSON.stringify(options), successProxy, errorProxy);
            }
        });
        return promisify_1.default(promise, success, error);
    };
    NativeAGM.prototype.createStream = function (methodDefinition, options, successCallback, errorCallback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (typeof methodDefinition === "string") {
                methodDefinition = {
                    name: methodDefinition,
                    getServers: function () { return []; },
                };
            }
            if (!options) {
                options = {
                    subscriptionRequestHandler: undefined,
                    subscriptionAddedHandler: undefined,
                    subscriptionRemovedHandler: undefined,
                };
            }
            _this.agmFacade.createStream2(JSON.stringify(methodDefinition), 
            // TODO - wrap to transform params
            options.subscriptionRequestHandler, 
            // TODO - wrap to transform params
            options.subscriptionAddedHandler, 
            // TODO - wrap to transform params
            options.subscriptionRemovedHandler, 
            // success handler
            function (stream) {
                resolve(stream);
            }, 
            // error handler
            function (error) {
                reject(error);
            });
        });
        return promisify_1.default(promise, successCallback, errorCallback);
    };
    NativeAGM.prototype.subscribe = function (methodDefinition, parameters, successCallback, errorCallback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (typeof methodDefinition === "undefined") {
                reject("method definition param is required");
            }
            if (parameters === undefined) {
                parameters = {};
            }
            parameters.args = JSON.stringify(parameters.arguments || {});
            parameters.target = _this.helpers.targetArgToObject(parameters.target);
            var name;
            if (typeof methodDefinition === "string") {
                name = methodDefinition;
            }
            else {
                name = methodDefinition.name;
            }
            _this.agmFacade.subscribe2(name, JSON.stringify(parameters), function (sub) {
                resolve(sub);
            }, function (error) {
                reject(error);
            });
        });
        return promisify_1.default(promise, successCallback, errorCallback);
    };
    NativeAGM.prototype.servers = function (filter) {
        var _this = this;
        var jsonResult = this.agmFacade.servers(JSON.stringify(this.helpers.stringToObject(filter, "name")));
        var parsedResult = this.helpers.agmParse(jsonResult);
        return parsedResult.map(function (server) {
            return _this.transformServerObject(server);
        });
    };
    NativeAGM.prototype.methods = function (filter) {
        var _this = this;
        var jsonResult = this.agmFacade.methods(JSON.stringify(this.helpers.stringToObject(filter, "name")));
        var parsedResult = this.helpers.agmParse(jsonResult);
        return parsedResult.map(function (method) {
            return _this.transformMethodObject(method);
        });
    };
    NativeAGM.prototype.methodAdded = function (callback) {
        var _this = this;
        var subscribed = true;
        this.agmFacade.methodAdded(function (method) {
            if (subscribed) {
                callback(_this.transformMethodObject(method));
            }
        });
        return function () {
            subscribed = false;
        };
    };
    NativeAGM.prototype.methodRemoved = function (callback) {
        var _this = this;
        var subscribed = true;
        this.agmFacade.methodRemoved(function (method) {
            if (subscribed) {
                callback(_this.transformMethodObject(method));
            }
        });
        return function () {
            subscribed = false;
        };
    };
    NativeAGM.prototype.serverAdded = function (callback) {
        var _this = this;
        var subscribed = true;
        this.agmFacade.serverAdded(function (server) {
            if (subscribed) {
                callback(_this.transformServerObject(server));
            }
        });
        return function () {
            subscribed = false;
        };
    };
    NativeAGM.prototype.serverRemoved = function (callback) {
        var _this = this;
        var subscribed = true;
        this.agmFacade.serverRemoved(function (server) {
            if (subscribed) {
                callback(_this.transformServerObject(server));
            }
        });
        return function () {
            subscribed = false;
        };
    };
    NativeAGM.prototype.serverMethodAdded = function (callback) {
        var _this = this;
        var subscribed = true;
        this.agmFacade.serverMethodAdded(function (info) {
            if (subscribed) {
                callback({
                    server: _this.transformServerObject(info.server),
                    method: _this.transformMethodObject(info.method),
                });
            }
        });
        return function () {
            subscribed = false;
        };
    };
    NativeAGM.prototype.serverMethodRemoved = function (callback) {
        var _this = this;
        var subscribed = true;
        this.agmFacade.serverMethodRemoved(function (info) {
            if (subscribed) {
                callback({
                    server: _this.transformServerObject(info.server),
                    method: _this.transformMethodObject(info.method),
                });
            }
        });
        return function () {
            subscribed = false;
        };
    };
    NativeAGM.prototype.methodsForInstance = function (server) {
        var jsonResult = this.agmFacade.methodsForInstance(JSON.stringify(server));
        var methods = this.helpers.agmParse(jsonResult);
        return methods.map(this.transformMethodObject);
    };
    NativeAGM.prototype.transformMethodObject = function (method) {
        var _this = this;
        if (!method) {
            return undefined;
        }
        if (!method.displayName) {
            method.displayName = method.display_name;
        }
        if (!method.objectTypes) {
            method.objectTypes = method.object_types;
        }
        method.getServers = function () {
            return _this.servers(method.name);
        };
        return method;
    };
    NativeAGM.prototype.transformServerObject = function (server) {
        var _this = this;
        if (!server) {
            return undefined;
        }
        server.getMethods = function () {
            return _this.methodsForInstance(server);
        };
        server.getStreams = function () {
            return _this.methodsForInstance(server).filter(function (method) {
                return method.supportsStreaming;
            });
        };
        return server;
    };
    return NativeAGM;
}());
exports.NativeAGM = NativeAGM;
//# sourceMappingURL=agm.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)["Promise"]))

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Helpers = /** @class */ (function () {
    function Helpers(facade) {
        this.facade = facade;
        this.dateTimeIdentifier = facade.jsonValueDatePrefix;
        this.lenOfIdentifier = this.dateTimeIdentifier.length;
    }
    // helper function for parsing dates properly
    Helpers.prototype.agmParse = function (str) {
        var _this = this;
        return JSON.parse(str, function (k, v) {
            if (typeof v !== "string") {
                return v;
            }
            // pre-seed - this should be a bit faster than indexOf
            if (v[0] !== _this.dateTimeIdentifier[0]) {
                return v;
            }
            if (v.indexOf(_this.dateTimeIdentifier) !== 0) {
                return v;
            }
            var unixTimestampMs = v.substr(_this.lenOfIdentifier);
            return new Date(parseFloat(unixTimestampMs));
        });
    };
    /**
     * Converts a target argument to object ready to be passed to Agm facade
     * @param target
     */
    Helpers.prototype.targetArgToObject = function (target) {
        var _this = this;
        target = target || "best";
        if (typeof target === "string") {
            if (target !== "all" && target !== "best") {
                throw new Error(target + " is not a valid target. Valid targets are 'all' and 'best'");
            }
            return { target: target };
        }
        else {
            if (!Array.isArray(target)) {
                target = [target];
            }
            target = target.map(function (e) {
                return _this.convertInstanceToRegex(e);
            });
            return { serverFilter: target };
        }
    };
    Helpers.prototype.convertInstanceToRegex = function (instance) {
        var instanceConverted = {};
        Object.keys(instance).forEach(function (key) {
            var propValue = instance[key];
            instanceConverted[key] = propValue;
            if (typeof propValue === "undefined" || propValue === null) {
                return;
            }
            if (typeof propValue === "string" && propValue !== "") {
                // do exact matching if user passed a string
                instanceConverted[key] = "^" + instance[key] + "$";
            }
            else if (instance[key].constructor === RegExp) {
                instanceConverted[key] = instance[key].source;
            }
            else {
                instanceConverted[key] = instance[key];
            }
        });
        return instanceConverted;
    };
    Helpers.prototype.validateMethodInfo = function (methodInfo) {
        if (typeof methodInfo === "undefined") {
            throw Error("methodInfo is required argument");
        }
        if (!methodInfo.name) {
            throw Error("methodInfo object must contain name property");
        }
        if (methodInfo.objectTypes) {
            methodInfo.object_types = methodInfo.objectTypes;
        }
        if (methodInfo.displayName) {
            methodInfo.display_name = methodInfo.displayName;
        }
    };
    Helpers.prototype.stringToObject = function (param, stringPropName) {
        if (typeof param === "string") {
            var obj = {};
            obj[stringPropName] = param;
            return obj;
        }
        return param;
    };
    return Helpers;
}());
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var agm_1 = __webpack_require__(27);
var helpers_1 = __webpack_require__(28);
function default_1(configuration) {
    // date parsing
    var facade = global.htmlContainer.jsAgmFacade;
    var cfgAsString = createConfig(configuration);
    return new Promise(function (resolve, reject) {
        // create new AGM façade for this instance
        var successInit = function (instance) {
            var nativeAGM = new agm_1.NativeAGM(instance, new helpers_1.Helpers(facade), facade);
            // deprecated API
            nativeAGM.create_stream = nativeAGM.createStream;
            nativeAGM.methods_for_instance = nativeAGM.methodsForInstance;
            nativeAGM.method_added = nativeAGM.methodAdded;
            nativeAGM.method_removed = nativeAGM.methodRemoved;
            nativeAGM.server_added = nativeAGM.serverAdded;
            nativeAGM.server_removed = nativeAGM.serverRemoved;
            nativeAGM.server_method_added = nativeAGM.serverMethodAdded;
            nativeAGM.server_method_removed = nativeAGM.serverMethodRemoved;
            resolve(nativeAGM);
        };
        if (facade.protocolVersion && facade.protocolVersion >= 5 && facade.initAsync) {
            facade.initAsync(cfgAsString, successInit, function (err) {
                reject(err);
            });
        }
        else {
            var instance = facade.init(cfgAsString);
            successInit(instance);
        }
    });
}
exports.default = default_1;
var createConfig = function (configuration) {
    // add metrics
    if (configuration !== undefined && configuration.metrics !== undefined) {
        configuration.metrics.metricsIdentity = configuration.metrics.identity;
        // quick and dirty - we need to stringify the configuration so we need to replace the metrics object (which has circular references)
        // with an object that holds only the properties needed
        var metricsConfig = {
            metricsIdentity: configuration.metrics.metricsIdentity,
            path: configuration.metrics.path,
        };
        configuration.metrics = metricsConfig;
    }
    // remove the logger - we don't need it in HC and has circular references
    delete configuration.logger;
    return JSON.stringify(configuration);
};
//# sourceMappingURL=native.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(0)["Promise"]))

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = __webpack_require__(5);
/**
 * Each AGM application is identified by its AGM instance, which is a set of known key/value pairs.
 *
 */
function createOwnInstance(userSubmittedProperties, resolvedIdentity, peerId) {
    var document = global.document || global.process;
    // Generate default instance properties
    var instance = {
        application: document.title + random_1.default(),
        pid: Math.floor(Math.random() * 10000000000),
    };
    // Set peerId
    instance.peerId = peerId;
    // Apply user-submitted instance properties
    if (typeof userSubmittedProperties === "object") {
        if (userSubmittedProperties.application !== undefined) {
            instance.application = userSubmittedProperties.application;
        }
        instance.machine = userSubmittedProperties.machine;
        instance.user = userSubmittedProperties.user;
        instance.environment = userSubmittedProperties.environment;
        instance.region = userSubmittedProperties.region;
    }
    // Apply resolved identity (GW3 case)
    if (typeof resolvedIdentity !== "undefined") {
        instance.user = resolvedIdentity.user;
        instance.instance = resolvedIdentity.instance;
        instance.application = resolvedIdentity.application;
        instance.pid = resolvedIdentity.process;
        instance.machine = resolvedIdentity.machine;
        instance.environment = resolvedIdentity.environment;
        instance.region = resolvedIdentity.region;
        instance.windowId = resolvedIdentity.windowId;
    }
    return instance;
}
exports.createOwnInstance = createOwnInstance;
//# sourceMappingURL=instance.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var instance_1 = __webpack_require__(30);
var native_1 = __webpack_require__(29);
var factory_1 = __webpack_require__(34);
var factory_2 = __webpack_require__(39);
var agm_1 = __webpack_require__(23);
var repository_1 = __webpack_require__(26);
var repository_2 = __webpack_require__(43);
exports.default = (function (configuration) {
    if (!configuration.forceGW && global.htmlContainer !== undefined) {
        return native_1.default(configuration);
    }
    if (typeof configuration === "undefined") {
        throw new Error("configuration is required");
    }
    if (typeof configuration.connection === "undefined") {
        throw new Error("configuration.connections is required");
    }
    var connection = configuration.connection;
    if (typeof configuration.methodResponseTimeout !== "number") {
        configuration.methodResponseTimeout = 3000;
    }
    if (typeof configuration.waitTimeoutMs !== "number") {
        configuration.waitTimeoutMs = 3000;
    }
    // Initialize our modules
    // TODO - FIX ME
    var myIdentity = connection.resolvedIdentity;
    var myInstance = instance_1.createOwnInstance(configuration.instance, myIdentity, connection.peerId);
    var clientRepository = new repository_1.default();
    var serverRepository = new repository_2.default();
    var protocolPromise;
    var agmImpl;
    if (connection.protocolVersion === 3) {
        protocolPromise = factory_2.default(myInstance, connection, clientRepository, serverRepository, configuration, function () { return agmImpl; });
    }
    else {
        protocolPromise = factory_1.default(myInstance, connection, clientRepository, serverRepository, configuration, function () { return agmImpl; });
    }
    return new Promise(function (resolve, reject) {
        // wait for protocol to resolve
        protocolPromise.then(function (protocol) {
            agmImpl = new agm_1.default(protocol, clientRepository, serverRepository, myInstance, configuration);
            resolve(agmImpl);
        }).catch(function (err) {
            reject(err);
        });
    });
});
//# sourceMappingURL=main.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(0)["Promise"]))

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = __webpack_require__(5);
var helpers_1 = __webpack_require__(6);
var STATUS_AWAITING_ACCEPT = "awaitingAccept"; // not even one server has accepted yet
var STATUS_SUBSCRIBED = "subscribed"; // at least one server has responded as 'Accepting'
var ERR_MSG_SUB_FAILED = "Subscription failed.";
var ERR_MSG_SUB_REJECTED = "Subscription rejected.";
var ON_CLOSE_MSG_SERVER_INIT = "ServerInitiated";
var ON_CLOSE_MSG_CLIENT_INIT = "ClientInitiated";
var ClientStreaming = /** @class */ (function () {
    function ClientStreaming(configuration, instance, sendRequest, nextResponseSubject) {
        this.configuration = configuration;
        this.instance = instance;
        this.sendRequest = sendRequest;
        this.nextResponseSubject = nextResponseSubject;
        this.subscriptionsList = {};
    }
    ClientStreaming.prototype.subscribe = function (stream, args, targetServers, options, success, error) {
        var _this = this;
        if (targetServers.length === 0) {
            error({
                method: stream.getInfoForUser(),
                message: ERR_MSG_SUB_FAILED + " No available servers matched the target params.",
                called_with: args,
            });
            return;
        }
        // This same Id will be passed to all the servers (as 'InvocationId')
        // so they can respond back with it during the initial handshake
        var subscriptionId = "subscriptionId_" + random_1.default();
        // Register the user's callbacks
        var pendingSub = this.registerSubscription(subscriptionId, stream, args, success, error, options.methodResponseTimeout);
        if (typeof pendingSub !== "object") {
            error({
                method: stream.getInfoForUser(),
                message: ERR_MSG_SUB_FAILED + " Unable to register the user callbacks.",
                called_with: args,
            });
            return;
        }
        // Send a subscription request to each server
        targetServers.forEach(function (target) {
            // Get a response subject for this invocation
            var responseSubject = _this.nextResponseSubject();
            var requestSubject = stream.info.requestSubject;
            // Add server to the list of ones the client is expecting a response from
            pendingSub.trackedServers.push({
                server: undefined,
                streamId: undefined,
                streamSubjects: {
                    global: undefined,
                    private: undefined,
                },
                methodRequestSubject: requestSubject,
                methodResponseSubject: responseSubject,
            });
            // Construct a message
            var message = {
                EventStreamAction: 1,
                MethodRequestSubject: requestSubject,
                MethodResponseSubject: responseSubject,
                Client: helpers_1.convertInstance(_this.instance),
                Context: {
                    ArgumentsJson: args,
                    InvocationId: subscriptionId,
                    MethodName: stream.info.name,
                    ExecutionServer: target.server.info,
                    Timeout: options.methodResponseTimeout,
                },
            };
            // Send it
            _this.sendRequest(message);
        });
    };
    ClientStreaming.prototype.processPublisherMsg = function (msg) {
        if (!(msg && msg.EventStreamAction && msg.EventStreamAction !== 0)) {
            return;
        }
        if (msg.EventStreamAction === 2) {
            this.serverIsKickingASubscriber(msg);
        }
        else if (msg.EventStreamAction === 3) {
            this.serverAcknowledgesGoodSubscription(msg);
        }
        else if (msg.EventStreamAction === 5) {
            this.serverHasPushedSomeDataIntoTheStream(msg);
        }
    };
    ClientStreaming.prototype.registerSubscription = function (subscriptionId, method, args, success, error, timeout) {
        var _this = this;
        this.subscriptionsList[subscriptionId] = {
            status: STATUS_AWAITING_ACCEPT,
            method: method,
            arguments: args,
            success: success,
            error: error,
            trackedServers: [],
            handlers: {
                onData: [],
                onClosed: [],
            },
            queued: {
                data: [],
                closers: [],
            },
            timeoutId: undefined,
        };
        this.subscriptionsList[subscriptionId].timeoutId = setTimeout(function () {
            if (_this.subscriptionsList[subscriptionId] === undefined) {
                return; // no such subscription
            }
            var subscription = _this.subscriptionsList[subscriptionId];
            if (subscription.status === STATUS_AWAITING_ACCEPT) {
                error({
                    method: method,
                    called_with: args,
                    message: ERR_MSG_SUB_FAILED + " Subscription attempt timed out after " + timeout + "ms.",
                });
                // None of the target servers has answered the subscription attempt
                delete _this.subscriptionsList[subscriptionId];
            }
            else if (subscription.status === STATUS_SUBSCRIBED &&
                subscription.trackedServers.length > 0) {
                // Clean the trackedServers, removing those without valid streamId
                subscription.trackedServers = subscription.trackedServers.filter(function (server) {
                    return (typeof server.streamId === "string" && server.streamId !== "");
                });
                subscription.timeoutId = undefined;
                if (subscription.trackedServers.length === 0) {
                    // TODO this might be dead-code, where is closers.push?
                    // There are no open streams, some servers accepted then closed very quickly
                    // (that's why the status changed but there's no good server with a StreamId)
                    // call the onClosed handlers
                    var closersCount = subscription.queued.closers.length;
                    var closingServer_1 = (closersCount > 0) ? subscription.queued.closers[closersCount - 1] : null;
                    subscription.handlers.onClosed.forEach(function (callback) {
                        if (typeof callback === "function") {
                            callback({
                                message: ON_CLOSE_MSG_SERVER_INIT,
                                requestArguments: subscription.arguments,
                                server: closingServer_1,
                                stream: subscription.method,
                            });
                        }
                    });
                    delete _this.subscriptionsList[subscriptionId];
                }
            }
        }, timeout);
        return this.subscriptionsList[subscriptionId];
    };
    ClientStreaming.prototype.serverIsKickingASubscriber = function (msg) {
        // Note: this might be either the server rejecting a subscription request OR closing an existing subscription
        var _this = this;
        // Get ALL subscriptions
        var keys = Object.keys(this.subscriptionsList);
        // If it is a rejection there may be an InvocationId, it can narrow the search
        if (typeof msg.InvocationId === "string" && msg.InvocationId !== "") {
            keys = keys.filter(function (k) { return k === msg.InvocationId; });
        }
        var deletionsList = [];
        // Find the kicking/rejecting server and remove it from the subscription.trackedServers[]
        keys.forEach(function (key) {
            if (typeof _this.subscriptionsList[key] !== "object") {
                return;
            }
            _this.subscriptionsList[key].trackedServers = _this.subscriptionsList[key].trackedServers.filter(function (server) {
                var isRejecting = (server.methodRequestSubject === msg.MethodRequestSubject && server.methodResponseSubject === msg.MethodResponseSubject);
                var isKicking = (server.streamId === msg.StreamId &&
                    (server.streamSubjects.global === msg.EventStreamSubject || server.streamSubjects.private === msg.EventStreamSubject));
                var isRejectingOrKicking = isRejecting || isKicking;
                return !isRejectingOrKicking;
            });
            if (_this.subscriptionsList[key].trackedServers.length === 0) {
                deletionsList.push(key);
            }
        });
        // Call onClosed OR error()
        // and remove the subscription
        deletionsList.forEach(function (key) {
            if (typeof _this.subscriptionsList[key] !== "object") {
                return;
            }
            if (_this.subscriptionsList[key].status === STATUS_AWAITING_ACCEPT &&
                typeof _this.subscriptionsList[key].timeoutId === "number") {
                var reason = (typeof msg.ResultMessage === "string" && msg.ResultMessage !== "") ?
                    ' Publisher said "' + msg.ResultMessage + '".' :
                    " No reason given.";
                var callArgs = typeof _this.subscriptionsList[key].arguments === "object" ?
                    JSON.stringify(_this.subscriptionsList[key].arguments) :
                    "{}";
                _this.subscriptionsList[key].error(ERR_MSG_SUB_REJECTED + reason + " Called with:" + callArgs);
                clearTimeout(_this.subscriptionsList[key].timeoutId);
            }
            else {
                // The timeout may or may not have expired yet,
                // but the status is 'subscribed' and trackedServers is now empty
                _this.subscriptionsList[key].handlers.onClosed.forEach(function (callback) {
                    if (typeof callback !== "function") {
                        return;
                    }
                    callback({
                        message: ON_CLOSE_MSG_SERVER_INIT,
                        requestArguments: _this.subscriptionsList[key].arguments,
                        server: helpers_1.convertInfoToInstance(msg.Server),
                        stream: _this.subscriptionsList[key].method,
                    });
                });
            }
            delete _this.subscriptionsList[key];
        });
    };
    // action 3
    ClientStreaming.prototype.serverAcknowledgesGoodSubscription = function (msg) {
        var _this = this;
        var subscriptionId = msg.InvocationId;
        var subscription = this.subscriptionsList[subscriptionId];
        if (typeof subscription !== "object") {
            return;
        }
        var acceptingServer = subscription.trackedServers.filter(function (server) {
            return (server.methodRequestSubject === msg.MethodRequestSubject &&
                server.methodResponseSubject === msg.MethodResponseSubject);
        })[0];
        if (typeof acceptingServer !== "object") {
            return;
        }
        var isFirstResponse = (subscription.status === STATUS_AWAITING_ACCEPT);
        subscription.status = STATUS_SUBSCRIBED;
        var privateStreamSubject = this.generatePrivateStreamSubject(subscription.method.name);
        if (typeof acceptingServer.streamId === "string" && acceptingServer.streamId !== "") {
            return; // already accepted previously
        }
        acceptingServer.server = helpers_1.convertInfoToInstance(msg.Server);
        acceptingServer.streamId = msg.StreamId;
        acceptingServer.streamSubjects.global = msg.EventStreamSubject;
        acceptingServer.streamSubjects.private = privateStreamSubject;
        // acceptingServer.methodResponseSubject stays the same
        var confirmatoryRequest = {
            EventStreamAction: 3,
            EventStreamSubject: privateStreamSubject,
            StreamId: msg.StreamId,
            MethodRequestSubject: msg.MethodRequestSubject,
            MethodResponseSubject: acceptingServer.methodResponseSubject,
            Client: helpers_1.convertInstance(this.instance),
            Context: {
                ArgumentsJson: subscription.arguments,
                MethodName: subscription.method.name,
            },
        };
        this.sendRequest(confirmatoryRequest);
        if (isFirstResponse) {
            // Pass in the subscription object
            subscription.success({
                onData: function (dataCallback) {
                    if (typeof dataCallback !== "function") {
                        throw new TypeError("The data callback must be a function.");
                    }
                    this.handlers.onData.push(dataCallback);
                    if (this.handlers.onData.length === 1 && this.queued.data.length > 0) {
                        this.queued.data.forEach(function (dataItem) {
                            dataCallback(dataItem);
                        });
                    }
                }.bind(subscription),
                onClosed: function (closedCallback) {
                    if (typeof closedCallback !== "function") {
                        throw new TypeError("The callback must be a function.");
                    }
                    this.handlers.onClosed.push(closedCallback);
                }.bind(subscription),
                onFailed: function () { },
                close: function () { return _this.closeSubscription(subscription, subscriptionId); },
                requestArguments: subscription.arguments,
                serverInstance: helpers_1.convertInfoToInstance(msg.Server),
                stream: subscription.method,
            });
        }
    };
    // action 5
    ClientStreaming.prototype.serverHasPushedSomeDataIntoTheStream = function (msg) {
        var _loop_1 = function (key) {
            if (this_1.subscriptionsList.hasOwnProperty(key) && typeof this_1.subscriptionsList[key] === "object") {
                var isPrivateData = void 0;
                var trackedServersFound = this_1.subscriptionsList[key].trackedServers.filter(function (ls) {
                    return (ls.streamId === msg.StreamId &&
                        (ls.streamSubjects.global === msg.EventStreamSubject ||
                            ls.streamSubjects.private === msg.EventStreamSubject));
                });
                if (trackedServersFound.length === 0) {
                    isPrivateData = undefined;
                }
                else if (trackedServersFound[0].streamSubjects.global === msg.EventStreamSubject) {
                    isPrivateData = false;
                }
                else if (trackedServersFound[0].streamSubjects.private === msg.EventStreamSubject) {
                    isPrivateData = true;
                }
                if (isPrivateData !== undefined) {
                    // create the arrivedData object
                    var receivedStreamData_1 = {
                        data: msg.ResultContextJson,
                        server: helpers_1.convertInfoToInstance(msg.Server),
                        requestArguments: this_1.subscriptionsList[key].arguments || {},
                        message: msg.ResultMessage,
                        private: isPrivateData,
                    };
                    var onDataHandlers = this_1.subscriptionsList[key].handlers.onData;
                    var queuedData = this_1.subscriptionsList[key].queued.data;
                    if (Array.isArray(onDataHandlers)) {
                        if (onDataHandlers.length > 0) {
                            onDataHandlers.forEach(function (callback) {
                                if (typeof callback === "function") {
                                    callback(receivedStreamData_1);
                                }
                            });
                        }
                        else {
                            queuedData.push(receivedStreamData_1);
                        }
                    }
                }
            }
        };
        var this_1 = this;
        // Find the subscription of interest by trawling the dictionary
        for (var key in this.subscriptionsList) {
            _loop_1(key);
        } // end for-in
    };
    /** (subscription) Methods */
    ClientStreaming.prototype.closeSubscription = function (sub, subId) {
        var _this = this;
        var responseSubject = this.nextResponseSubject();
        sub.trackedServers.forEach(function (server) {
            _this.sendRequest({
                EventStreamAction: 2,
                Client: helpers_1.convertInstance(_this.instance),
                MethodRequestSubject: server.methodRequestSubject,
                MethodResponseSubject: responseSubject,
                StreamId: server.streamId,
                EventStreamSubject: server.streamSubjects.private,
            });
        });
        // Call the onClosed handlers
        sub.handlers.onClosed.forEach(function (callback) {
            if (typeof callback === "function") {
                callback({
                    message: ON_CLOSE_MSG_CLIENT_INIT,
                    requestArguments: sub.arguments || {},
                    server: sub.trackedServers[sub.trackedServers.length - 1].server,
                    stream: sub.method,
                });
            }
        });
        delete this.subscriptionsList[subId];
    };
    ClientStreaming.prototype.generatePrivateStreamSubject = function (methodName) {
        var appInfo = helpers_1.convertInstance(this.instance);
        return "ESSpriv-jsb_" +
            appInfo.ApplicationName +
            "_on_" +
            methodName +
            "_" +
            random_1.default();
    };
    return ClientStreaming;
}());
exports.default = ClientStreaming;
//# sourceMappingURL=client-streaming.js.map

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = __webpack_require__(5);
var callback_registry_1 = __webpack_require__(1);
var client_streaming_1 = __webpack_require__(32);
var helpers_1 = __webpack_require__(6);
var numberMissingHeartbeatsToRemove = 3;
var ClientProtocol = /** @class */ (function () {
    function ClientProtocol(connection, instance, configuration, repository) {
        var _this = this;
        this.connection = connection;
        this.instance = instance;
        this.configuration = configuration;
        this.repository = repository;
        this.respCounter = 0;
        this.callbacks = callback_registry_1.default();
        this.timers = {};
        this.timers = {};
        this.streaming = new client_streaming_1.default(configuration, instance, function (msg) {
            connection.send("agm", "MethodInvocationRequestMessage", msg);
        }, function () { return _this.nextResponseSubject(); });
        this.listenForEvents();
    }
    ClientProtocol.prototype.subscribe = function (stream, args, targetServers, options, success, error) {
        this.streaming.subscribe(stream, args, targetServers, options, success, error);
    };
    ClientProtocol.prototype.onInvocationResult = function (callback) {
        this.callbacks.add("onResult", callback);
    };
    ClientProtocol.prototype.invoke = function (id, method, args, target, stuff) {
        var methodInfo = method.info;
        // Construct a message
        var message = {
            MethodRequestSubject: methodInfo.requestSubject,
            MethodResponseSubject: this.nextResponseSubject(),
            Client: helpers_1.convertInstance(this.instance),
            Context: {
                ArgumentsJson: args,
                InvocationId: id,
                MethodName: methodInfo.name,
                ExecutionServer: target.info,
                Timeout: stuff.methodResponseTimeoutMs,
            },
        };
        this.connection.send("agm", "MethodInvocationRequestMessage", message);
    };
    ClientProtocol.prototype.nextResponseSubject = function () {
        return "resp_" + (this.respCounter++) + "_" + random_1.default();
    };
    ClientProtocol.prototype.createServerInfo = function (instance) {
        return {
            machine: instance.MachineName,
            pid: instance.ProcessId,
            user: instance.UserName,
            application: instance.ApplicationName,
            environment: instance.Environment,
            region: instance.Region,
        };
    };
    ClientProtocol.prototype.createMethod = function (methodInfo) {
        var method = methodInfo.Method;
        return {
            name: method.Name,
            accepts: method.InputSignature,
            returns: method.ResultSignature,
            requestSubject: methodInfo.MethodRequestSubject,
            description: method.Description,
            displayName: method.DisplayName,
            version: method.Version,
            objectTypes: method.ObjectTypeRestrictions,
            supportsStreaming: helpers_1.isStreamingFlagSet(method.Flags),
        };
    };
    // Generates a unique ID for a server
    ClientProtocol.prototype.createServerId = function (serverInfo) {
        if (serverInfo === undefined) {
            return undefined;
        }
        return [serverInfo.application,
            serverInfo.user,
            serverInfo.machine,
            serverInfo.started,
            serverInfo.pid].join("/").toLowerCase();
    };
    ClientProtocol.prototype.processServerPresence = function (presence, isPresence) {
        var instance = presence.Instance;
        var serverInfo = this.createServerInfo(instance);
        var serverId = this.createServerId(serverInfo);
        if (isPresence) {
            // test
            // console.debug(new Date(), '  heard presence');
            // if (instance.ApplicationName === 'Dummy server') {
            //     console.debug(new Date(), '  got Dummy server presence', presence);
            // }
            serverId = this.repository.addServer(serverInfo, serverId);
            if (presence.PublishingInterval) {
                this.scheduleTimeout(serverId, presence.PublishingInterval);
            }
        }
        else if (presence.PublishingInterval === 0) {
            // Good bye message from Gateway
            var server = this.repository.getServerById(serverId);
            if (typeof server !== "undefined") {
                this.repository.removeServerById(serverId);
            }
        }
        // Finally, update the methods
        if (presence.MethodDefinitions !== undefined) {
            this.updateServerMethods(serverId, presence.MethodDefinitions);
        }
    };
    // This function sets a timeout which removes the server unless - the function is called again before the timeout is over
    ClientProtocol.prototype.scheduleTimeout = function (serverId, duration) {
        var _this = this;
        if (duration === -1) {
            return;
        }
        // Stop the previous timeout
        var timer = this.timers[serverId];
        if (timer !== undefined) {
            clearTimeout(timer);
        }
        // Set a new one
        this.timers[serverId] = setTimeout(function () {
            _this.repository.removeServerById(serverId);
        }, duration * (numberMissingHeartbeatsToRemove + 1));
    };
    // Updates the methods of a server
    ClientProtocol.prototype.updateServerMethods = function (serverId, newMethods) {
        var _this = this;
        // Get an array of the methods the server had before we started this
        var oldMethods = this.repository.getServerMethodsById(serverId);
        // Get an array of the methods that the server has now
        var newMethodsReduced = newMethods
            .map(function (nm) { return _this.createMethod(nm); })
            .reduce(function (obj, method) {
            var methodId = _this.repository.createMethodId(method);
            obj[methodId] = method;
            return obj;
        }, {});
        // For each of the old methods
        oldMethods.forEach(function (method) {
            // Check if it is still there
            if (newMethodsReduced[method.id] === undefined) {
                // If it isn't, remove it
                _this.repository.removeServerMethod(serverId, method.id);
            }
            else {
                // If it is there in both the old array and the new one, we don't need to add it again
                delete newMethodsReduced[method.id];
            }
        });
        // Now add the new methods
        Object.keys(newMethodsReduced).forEach(function (key) {
            var method = newMethodsReduced[key];
            _this.repository.addServerMethod(serverId, method);
        });
    };
    ClientProtocol.prototype.handleInvokeResultMessage = function (message) {
        // Delegate streaming-related messages to streaming
        if (message && message.EventStreamAction && message.EventStreamAction !== 0) {
            this.streaming.processPublisherMsg(message);
            return;
        }
        var server = message.Server ? this.createServerInfo(message.Server) : undefined;
        // parse the result
        var result = message.ResultContextJson;
        // If the result is an empty object, there is no result
        if (result && Object.keys(result).length === 0) {
            result = undefined;
        }
        this.callbacks.execute("onResult", message.InvocationId, server, message.Status, result, message.ResultMessage);
    };
    ClientProtocol.prototype.listenForEvents = function () {
        var _this = this;
        this.connection.on("agm", "ServerPresenceMessage", function (msg) {
            _this.processServerPresence(msg, true);
        });
        this.connection.on("agm", "ServerHeartbeatMessage", function (msg) {
            _this.processServerPresence(msg, false);
        });
        this.connection.on("agm", "MethodInvocationResultMessage", function (msg) {
            _this.handleInvokeResultMessage(msg);
        });
    };
    return ClientProtocol;
}());
exports.default = ClientProtocol;
//# sourceMappingURL=client.js.map

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __webpack_require__(36);
var client_1 = __webpack_require__(33);
function default_1(instance, connection, clientRepository, serverRepository, configuration, getAGM) {
    var unsubscribe = connection.on("agm", "Instance", function (newInstance) {
        getAGM().updateInstance(newInstance);
        connection.off(unsubscribe);
    });
    var server = new server_1.default(connection, instance, configuration, serverRepository);
    var client = new client_1.default(connection, instance, configuration, clientRepository);
    return new Promise(function (resolve) {
        resolve({
            server: server,
            client: client,
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=factory.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)["Promise"]))

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = __webpack_require__(5);
var helpers_1 = __webpack_require__(6);
var ServerStreaming = /** @class */ (function () {
    function ServerStreaming(connection, instance) {
        this.connection = connection;
        this.instance = instance;
    }
    ServerStreaming.prototype.isStreamMsg = function (msg, method) {
        return (msg &&
            msg.EventStreamAction &&
            msg.EventStreamAction !== 0 &&
            typeof method === "object" &&
            method.definition.supportsStreaming === true);
    };
    ServerStreaming.prototype.pushData = function (streamingMethod, data, branches) {
        var _this = this;
        if (typeof streamingMethod !== "object" || !Array.isArray(streamingMethod.protocolState.branchKeyToStreamIdMap)) {
            return;
        }
        // TODO validate data is a plain object
        if (typeof data !== "object") {
            throw new Error("Invalid arguments. Data must be an object.");
        }
        if (typeof branches === "string") {
            branches = [branches]; // user wants to push to single branch
        }
        else if (!Array.isArray(branches) || branches.length <= 0) {
            branches = null;
        }
        // get the StreamId's from the method's branch map
        var streamIdList = streamingMethod.protocolState.branchKeyToStreamIdMap
            .filter(function (br) {
            return (branches === null || (Boolean(br) && typeof br.key === "string" && branches.indexOf(br.key) >= 0));
        }).map(function (br) {
            return br.streamId;
        });
        var server = helpers_1.convertInstance(this.instance);
        streamIdList.forEach(function (streamId) {
            _this.sendResult({
                EventStreamAction: 5,
                EventStreamSubject: streamingMethod.protocolState.globalEventStreamSubject,
                MethodName: streamingMethod.protocolState.method.Method.Name,
                MethodRequestSubject: streamingMethod.protocolState.method.MethodRequestSubject,
                ResultContextJson: data,
                Server: server,
                StreamId: streamId,
            });
        });
    };
    ServerStreaming.prototype.closeAllSubscriptions = function (streamingMethod, branchKey) {
        var _this = this;
        if (typeof streamingMethod !== "object" || !Array.isArray(streamingMethod.protocolState.branchKeyToStreamIdMap)) {
            return;
        }
        var streamList = streamingMethod.protocolState.branchKeyToStreamIdMap;
        if (typeof branchKey === "string") {
            streamList = streamingMethod.protocolState.branchKeyToStreamIdMap.filter(function (br) {
                return (typeof br === "object" && br.key === branchKey);
            });
        }
        // TODO: consider getting the unique branch keys from 'live subscribers'
        streamList.forEach(function (br) {
            var streamId = br.streamId;
            _this.sendResult({
                EventStreamAction: 2,
                EventStreamSubject: streamingMethod.protocolState.globalEventStreamSubject,
                MethodName: streamingMethod.protocolState.method.Method.Name,
                MethodRequestSubject: streamingMethod.protocolState.method.MethodRequestSubject,
                Server: helpers_1.convertInstance(_this.instance),
                StreamId: streamId,
                Status: 0,
            });
        });
    };
    ServerStreaming.prototype.getBranchList = function (streamingMethod) {
        if (typeof streamingMethod !== "object") {
            return [];
        }
        return this.getUniqueBranchNames(streamingMethod);
        // TODO the agm-api passes each sub to protocol methods for creating the sub front obj
    };
    ServerStreaming.prototype.getSubscriptionList = function (streamingMethod, branchKey) {
        if (typeof streamingMethod !== "object") {
            return [];
        }
        var subscriptions = [];
        if (typeof branchKey !== "string") {
            subscriptions = streamingMethod.protocolState.subscriptions;
        }
        else {
            subscriptions = streamingMethod.protocolState.subscriptions.filter(function (sub) {
                return sub.branchKey === branchKey;
            });
        }
        return subscriptions;
    };
    ServerStreaming.prototype.onSubAdded = function (handlerFunc) {
        if (typeof handlerFunc !== "function") {
            return;
        }
        this.subAddedHandler = handlerFunc;
    };
    ServerStreaming.prototype.onSubRemoved = function (handlerFunc) {
        if (typeof handlerFunc !== "function") {
            return;
        }
        this.subRemovedHandler = handlerFunc;
    };
    ServerStreaming.prototype.onSubRequest = function (handlerFunc) {
        if (typeof handlerFunc !== "function") {
            return;
        }
        this.requestHandler = handlerFunc;
    };
    ServerStreaming.prototype.generateNewStreamId = function (streamingMethodName) {
        var appInfo = helpers_1.convertInstance(this.instance);
        return "streamId-jsb_of_" +
            streamingMethodName +
            "__by_" +
            appInfo.ApplicationName +
            "_" +
            random_1.default();
    };
    ServerStreaming.prototype.rejectRequest = function (requestContext, streamingMethod, reason) {
        if (typeof reason !== "string") {
            reason = "";
        }
        var msg = requestContext.msg;
        this.sendResult({
            EventStreamAction: 2,
            EventStreamSubject: streamingMethod.protocolState.globalEventStreamSubject,
            // InvocationId: msg.Context.InvocationId,
            MethodName: streamingMethod.protocolState.method.Method.Name,
            MethodRequestSubject: streamingMethod.protocolState.method.MethodRequestSubject,
            MethodResponseSubject: msg.MethodResponseSubject,
            MethodVersion: streamingMethod.protocolState.method.Method.Version,
            ResultMessage: reason,
            Server: helpers_1.convertInstance(this.instance),
            StreamId: "default_rejection_streamId",
        });
    };
    ServerStreaming.prototype.pushDataToSingle = function (streamingMethod, subscription, data) {
        // TODO validate data is a plain object
        if (typeof data !== "object") {
            throw new Error("Invalid arguments. Data must be an object.");
        }
        this.sendResult({
            EventStreamAction: 5,
            EventStreamSubject: subscription.privateEventStreamSubject,
            MethodName: streamingMethod.protocolState.method.Method.Name,
            MethodRequestSubject: streamingMethod.protocolState.method.MethodRequestSubject,
            ResultContextJson: data,
            Server: helpers_1.convertInstance(this.instance),
            StreamId: subscription.streamId,
        });
    };
    ServerStreaming.prototype.closeSingleSubscription = function (streamingMethod, subscription) {
        this.closeIndividualSubscription(streamingMethod, subscription.streamId, subscription.privateEventStreamSubject, true);
    };
    /** (request) Methods */
    ServerStreaming.prototype.acceptRequestOnBranch = function (requestContext, streamingMethod, branch) {
        if (typeof branch !== "string") {
            branch = "";
        }
        var streamId = this.getStreamId(streamingMethod, branch);
        var msg = requestContext.msg;
        this.sendResult({
            EventStreamAction: 3,
            EventStreamSubject: streamingMethod.protocolState.globalEventStreamSubject,
            InvocationId: msg.Context.InvocationId,
            MethodName: streamingMethod.protocolState.method.Method.Name,
            MethodRequestSubject: streamingMethod.protocolState.method.MethodRequestSubject,
            MethodResponseSubject: msg.MethodResponseSubject,
            MethodVersion: streamingMethod.protocolState.method.Method.Version,
            ResultMessage: "Accepted",
            Server: helpers_1.convertInstance(this.instance),
            StreamId: streamId,
        });
    };
    ServerStreaming.prototype.processSubscriberMsg = function (msg, streamingMethod) {
        if (!(msg && msg.EventStreamAction && msg.EventStreamAction !== 0)) {
            return;
        }
        if (msg.EventStreamAction === 1) {
            this.clientWishesToSubscribe(msg, streamingMethod);
        }
        else if (msg.EventStreamAction === 2) {
            this.clientWishesToUnsubscribe(msg, streamingMethod);
        }
        else if (msg.EventStreamAction === 3) {
            this.clientAcknowledgesItDidSubscribe(msg, streamingMethod);
        }
        else if (msg.EventStreamAction === 4) {
            this.clientPerSubHeartbeat(msg);
        }
    };
    ServerStreaming.prototype.sendResult = function (message) {
        if (typeof message !== "object") {
            throw new Error("Invalid message.");
        }
        if (typeof message.Status !== "number") {
            message.Status = 0;
        }
        this.connection.send("agm", "MethodInvocationResultMessage", message);
    };
    /** msg 'Request' Actions */
    // action 1
    ServerStreaming.prototype.clientWishesToSubscribe = function (msg, streamingMethod) {
        var requestContext = {
            msg: msg,
            arguments: msg.Context.ArgumentsJson || {},
            instance: helpers_1.convertInfoToInstance(msg.Client),
        };
        if (typeof this.requestHandler === "function") {
            this.requestHandler(requestContext, streamingMethod);
        }
    };
    // action 2
    ServerStreaming.prototype.clientWishesToUnsubscribe = function (msg, streamingMethod) {
        if (!(streamingMethod &&
            Array.isArray(streamingMethod.protocolState.subscriptions) &&
            streamingMethod.protocolState.subscriptions.length > 0)) {
            return;
        }
        this.closeIndividualSubscription(streamingMethod, msg.StreamId, msg.EventStreamSubject, false);
    };
    // action 3
    ServerStreaming.prototype.clientAcknowledgesItDidSubscribe = function (msg, streamingMethod) {
        // Client indicates it is listening to a specific StreamId
        if (typeof msg.StreamId !== "string" || msg.StreamId === "") {
            return;
        }
        var branchKey = this.getBranchKey(streamingMethod, msg.StreamId);
        if (typeof branchKey !== "string") {
            return;
        }
        if (!Array.isArray(streamingMethod.protocolState.subscriptions)) {
            return;
        }
        var subscription = {
            branchKey: branchKey,
            instance: helpers_1.convertInfoToInstance(msg.Client),
            arguments: msg.Context.ArgumentsJson,
            streamId: msg.StreamId,
            privateEventStreamSubject: msg.EventStreamSubject,
            methodResponseSubject: msg.MethodResponseSubject,
        };
        // Subscription back-obj is stored
        streamingMethod.protocolState.subscriptions.push(subscription);
        if (typeof this.subAddedHandler === "function") {
            this.subAddedHandler(subscription, streamingMethod);
        }
    };
    // action 4
    ServerStreaming.prototype.clientPerSubHeartbeat = function (msg) {
        // A client may have multiple subscriptions, each one having its own heartbeat
        // Currently not implemented by the GW or the client
    };
    ServerStreaming.prototype.getBranchKey = function (streamingMethod, streamId) {
        if (typeof streamId !== "string" || typeof streamingMethod !== "object") {
            return;
        }
        var needle = streamingMethod.protocolState.branchKeyToStreamIdMap.filter(function (branch) {
            return branch.streamId === streamId;
        })[0];
        if (typeof needle !== "object" || typeof needle.key !== "string") {
            return;
        }
        return needle.key;
    };
    ServerStreaming.prototype.getStreamId = function (streamingMethod, branchKey) {
        if (typeof branchKey !== "string") {
            branchKey = "";
        }
        var needleBranch = streamingMethod.protocolState.branchKeyToStreamIdMap.filter(function (branch) {
            return branch.key === branchKey;
        })[0];
        var streamId = (needleBranch ? needleBranch.streamId : undefined);
        if (typeof streamId !== "string" || streamId === "") {
            streamId = this.generateNewStreamId(streamingMethod.protocolState.method.Method.Name);
            streamingMethod.protocolState.branchKeyToStreamIdMap.push({ key: branchKey, streamId: streamId });
        }
        return streamId;
    };
    /** (subscription) Methods */
    ServerStreaming.prototype.closeIndividualSubscription = function (streamingMethod, streamId, privateEventStreamSubject, sendKickMessage) {
        var subscription = streamingMethod.protocolState.subscriptions.filter(function (subItem) {
            return (subItem.privateEventStreamSubject === privateEventStreamSubject &&
                subItem.streamId === streamId);
        })[0];
        if (typeof subscription !== "object") {
            return; // unrecognised subscription
        }
        var initialLength = streamingMethod.protocolState.subscriptions.length;
        streamingMethod.protocolState.subscriptions = streamingMethod.protocolState.subscriptions.filter(function (subItem) {
            return !(subItem.privateEventStreamSubject === subscription.privateEventStreamSubject &&
                subItem.streamId === subscription.streamId);
        });
        var filteredLength = streamingMethod.protocolState.subscriptions.length;
        if (filteredLength !== (initialLength - 1)) {
            return; // the subscription wasn't removed
        }
        if (sendKickMessage === true) {
            this.sendResult({
                EventStreamAction: 2,
                EventStreamSubject: privateEventStreamSubject,
                MethodName: streamingMethod.protocolState.method.Method.Name,
                MethodRequestSubject: streamingMethod.protocolState.method.MethodRequestSubject,
                MethodResponseSubject: subscription.methodResponseSubject,
                MethodVersion: streamingMethod.protocolState.method.Method.Version,
                ResponseContextJson: {},
                Server: helpers_1.convertInstance(this.instance),
                StreamId: subscription.streamId,
                Status: 0,
            });
        }
        if (typeof this.subRemovedHandler === "function") {
            this.subRemovedHandler(subscription, streamingMethod);
        }
    };
    // Returns the names of branches for which there are live subscriptions
    ServerStreaming.prototype.getUniqueBranchNames = function (streamingMethod) {
        var keysWithDuplicates = streamingMethod.protocolState.subscriptions.map(function (sub) {
            var result = null;
            if (typeof sub === "object" && typeof sub.branchKey === "string") {
                result = sub.branchKey;
            }
            return result;
        });
        var seen = [];
        var branchArray = keysWithDuplicates.filter(function (bKey) {
            if (bKey === null || seen.indexOf(bKey) >= 0) {
                return false;
            }
            seen.push(bKey);
            return true;
        });
        return branchArray;
    };
    return ServerStreaming;
}());
exports.default = ServerStreaming;
//# sourceMappingURL=server-streaming.js.map

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = __webpack_require__(5);
var server_streaming_1 = __webpack_require__(35);
var callback_registry_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(6);
var HeartbeatInterval = 5000;
var PresenceInterval = 10000;
var ServerProtocol = /** @class */ (function () {
    function ServerProtocol(connection, instance, configuration, serverRepository) {
        var _this = this;
        this.connection = connection;
        this.instance = instance;
        this.serverRepository = serverRepository;
        this.invocationMessagesMap = {}; // {invocationId: Invocation_RequestMessage}
        this.reqCounter = 0;
        this.callbacks = callback_registry_1.default();
        this.streaming = new server_streaming_1.default(connection, instance);
        connection.on("agm", "MethodInvocationRequestMessage", function (msg) { return _this.handleMethodInvocationMessage(msg); });
        this.sendHeartbeat();
        if (this.heartbeatTimer === undefined) {
            this.heartbeatTimer = setInterval(function () { return _this.sendHeartbeat(); }, HeartbeatInterval);
        }
        this.getBranchList = this.streaming.getBranchList;
        this.getSubscriptionList = this.streaming.getSubscriptionList;
        this.closeAllSubscriptions = this.streaming.closeAllSubscriptions;
        this.closeSingleSubscription = this.streaming.closeSingleSubscription;
        this.pushDataToSingle = this.streaming.pushDataToSingle;
        this.pushData = this.streaming.pushData;
        this.onSubRequest = this.streaming.onSubRequest;
        this.acceptRequestOnBranch = this.streaming.acceptRequestOnBranch;
        this.rejectRequest = this.streaming.rejectRequest;
        this.onSubAdded = this.streaming.onSubAdded;
        this.onSubRemoved = this.streaming.onSubRemoved;
    }
    ServerProtocol.prototype.unregister = function (info) {
        this.sendPresence();
    };
    ServerProtocol.prototype.register = function (repoMethod, success, error) {
        // Get a request subject for this method
        var reqSubj = this.nextRequestSubject();
        repoMethod.protocolState.method = this.createNewMethodMessage(repoMethod.definition, reqSubj, false);
        this.announceNewMethod();
        success();
    };
    /** Create a streaming method */
    ServerProtocol.prototype.createStream = function (repoMethod, success, error) {
        var reqSubj = this.nextRequestSubject();
        var streamConverted = this.createNewMethodMessage(repoMethod.definition, reqSubj, true);
        // Used for presences
        repoMethod.protocolState.method = streamConverted;
        // Utility things for this protocol
        repoMethod.protocolState.globalEventStreamSubject = repoMethod.definition.name + ".jsStream." + random_1.default();
        repoMethod.protocolState.subscriptions = [];
        repoMethod.protocolState.branchKeyToStreamIdMap = []; // [ {branchKey: '', streamId: 'strj_nds7`8`6y2378yb'}, {...}, ...]
        this.announceNewMethod();
        success();
    };
    ServerProtocol.prototype.onInvoked = function (callback) {
        this.callbacks.add("onInvoked", callback);
    };
    ServerProtocol.prototype.methodInvocationResult = function (executedMethod, invocationId, err, result) {
        var message = this.invocationMessagesMap[invocationId];
        if (!message) {
            return;
        }
        // Don't send result if the client does not require it
        if (message.MethodResponseSubject === "null") {
            return;
        }
        if (executedMethod === undefined) {
            return;
        }
        var resultMessage = {
            MethodRequestSubject: message.MethodRequestSubject,
            MethodResponseSubject: message.MethodResponseSubject,
            MethodName: executedMethod.protocolState.method.Method.Name,
            InvocationId: invocationId,
            ResultContextJson: result,
            Server: helpers_1.convertInstance(this.instance),
            ResultMessage: err,
            Status: err ? 1 : 0,
        };
        // Send result
        this.connection.send("agm", "MethodInvocationResultMessage", resultMessage);
        delete this.invocationMessagesMap[invocationId];
    };
    ServerProtocol.prototype.nextRequestSubject = function () {
        return "req_" + (this.reqCounter++) + "_" + random_1.default();
    };
    // Sends a heartbeat
    ServerProtocol.prototype.sendHeartbeat = function () {
        this.connection.send("agm", "ServerHeartbeatMessage", this.constructHeartbeat());
    };
    // Constructs a heartbeat message
    ServerProtocol.prototype.constructHeartbeat = function () {
        return {
            PublishingInterval: HeartbeatInterval,
            Instance: helpers_1.convertInstance(this.instance),
        };
    };
    // Constructs a presence message
    ServerProtocol.prototype.constructPresence = function () {
        var methods = this.serverRepository.getList();
        return {
            PublishingInterval: PresenceInterval,
            Instance: helpers_1.convertInstance(this.instance),
            MethodDefinitions: methods.map(function (m) { return m.protocolState.method; }),
        };
    };
    // Sends a presence
    ServerProtocol.prototype.sendPresence = function () {
        this.connection.send("agm", "ServerPresenceMessage", this.constructPresence());
    };
    ServerProtocol.prototype.announceNewMethod = function () {
        var _this = this;
        // Send presence so the clients know we have it
        this.sendPresence();
        // Start sending presence regularly (if we aren't already doing it)
        if (this.presenceTimer === undefined) {
            this.presenceTimer = setInterval(function () { return _this.sendPresence(); }, PresenceInterval);
        }
    };
    // Listens for method invocations
    ServerProtocol.prototype.handleMethodInvocationMessage = function (message) {
        var subject = message.MethodRequestSubject;
        var methodList = this.serverRepository.getList();
        var method = methodList.filter(function (m) {
            return m.protocolState.method.MethodRequestSubject === subject;
        })[0];
        // Stop if the message isn't for us
        if (method === undefined) {
            return;
        }
        // TODO see if have to move this earlier - i.e. if some messages from Client don't have MethodRequestSubject
        // Check if message is stream-related : defer to streaming module
        if (this.streaming.isStreamMsg(message, method)) {
            this.streaming.processSubscriberMsg(message, method);
            return;
        }
        var invocationId = message.Context.InvocationId;
        this.invocationMessagesMap[invocationId] = message;
        var invocationArgs = {
            args: message.Context.ArgumentsJson,
            instance: helpers_1.convertInfoToInstance(message.Client),
        };
        this.callbacks.execute("onInvoked", method, invocationId, invocationArgs);
    };
    ServerProtocol.prototype.createNewMethodMessage = function (methodIdentifier, subject, stream) {
        // If we are given a string instead of an object, we presume that is the method's name:
        if (typeof methodIdentifier === "string") {
            methodIdentifier = { name: methodIdentifier };
        }
        // Set default values
        if (typeof methodIdentifier.version !== "number") {
            methodIdentifier.version = 0;
        }
        // Convert the method definition to the format that AGM requires
        return {
            Method: {
                Name: methodIdentifier.name,
                InputSignature: methodIdentifier.accepts,
                ResultSignature: methodIdentifier.returns,
                Description: methodIdentifier.description,
                DisplayName: methodIdentifier.displayName,
                Version: methodIdentifier.version,
                ObjectTypeRestrictions: methodIdentifier.objectTypes,
                Flags: stream ? 32 : undefined,
            },
            MethodRequestSubject: subject,
        };
    };
    return ServerProtocol;
}());
exports.default = ServerProtocol;
//# sourceMappingURL=server.js.map

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var STATUS_AWAITING_ACCEPT = "awaitingAccept"; // not even one server has accepted yet
var STATUS_SUBSCRIBED = "subscribed"; // at least one server has responded as 'Accepting'
var ERR_MSG_SUB_FAILED = "Subscription failed.";
var ERR_MSG_SUB_REJECTED = "Subscription rejected.";
var ON_CLOSE_MSG_SERVER_INIT = "ServerInitiated";
var ON_CLOSE_MSG_CLIENT_INIT = "ClientInitiated";
/**
 * Handles registering methods and sending data to clients
 */
var ClientStreaming = /** @class */ (function () {
    function ClientStreaming(instance, session, repository, logger) {
        var _this = this;
        this.instance = instance;
        this.session = session;
        this.repository = repository;
        this.logger = logger;
        this.subscriptionsList = {};
        this.subscriptionIdToLocalKeyMap = {};
        this.nextSubLocalKey = 0;
        this.handleErrorSubscribing = function (errorResponse) {
            var tag = errorResponse._tag;
            var subLocalKey = tag.subLocalKey;
            var pendingSub = _this.subscriptionsList[subLocalKey];
            if (typeof pendingSub !== "object") {
                return;
            }
            pendingSub.trackedServers = pendingSub.trackedServers.filter(function (server) {
                return server.serverId !== tag.serverId;
            });
            if (pendingSub.trackedServers.length <= 0) {
                clearTimeout(pendingSub.timeoutId);
                if (pendingSub.status === STATUS_AWAITING_ACCEPT) {
                    // Reject with reason
                    var reason = (typeof errorResponse.reason === "string" && errorResponse.reason !== "") ?
                        ' Publisher said "' + errorResponse.reason + '".' :
                        " No reason given.";
                    var callArgs = typeof pendingSub.arguments === "object" ?
                        JSON.stringify(pendingSub.arguments) :
                        "{}";
                    pendingSub.error({
                        message: ERR_MSG_SUB_REJECTED + reason + " Called with:" + callArgs,
                        called_with: pendingSub.arguments,
                        method: pendingSub.method.getInfoForUser(),
                    });
                }
                else if (pendingSub.status === STATUS_SUBSCRIBED) {
                    // The timeout may or may not have expired yet,
                    // but the status is 'subscribed' and trackedServers is now empty
                    _this.callOnClosedHandlers(pendingSub);
                }
                delete _this.subscriptionsList[subLocalKey];
            }
        };
        this.handleSubscribed = function (msg) {
            var subLocalKey = msg._tag.subLocalKey;
            var pendingSub = _this.subscriptionsList[subLocalKey];
            if (typeof pendingSub !== "object") {
                return;
            }
            var serverId = msg._tag.serverId;
            // Add a subscription_id to this trackedServer
            var acceptingServer = pendingSub.trackedServers
                .filter(function (server) {
                return server.serverId === serverId;
            })[0];
            if (typeof acceptingServer !== "object") {
                return;
            }
            acceptingServer.subscriptionId = msg.subscription_id;
            _this.subscriptionIdToLocalKeyMap[msg.subscription_id] = subLocalKey;
            var isFirstResponse = (pendingSub.status === STATUS_AWAITING_ACCEPT);
            pendingSub.status = STATUS_SUBSCRIBED;
            var that = _this;
            if (isFirstResponse) {
                // Pass in the subscription object
                pendingSub.success({
                    onData: function (dataCallback) {
                        if (typeof dataCallback !== "function") {
                            throw new TypeError("The data callback must be a function.");
                        }
                        pendingSub.handlers.onData.push(dataCallback);
                        if (pendingSub.handlers.onData.length === 1 && pendingSub.queued.data.length > 0) {
                            pendingSub.queued.data.forEach(function (dataItem) {
                                dataCallback(dataItem);
                            });
                        }
                    },
                    onClosed: function (closedCallback) {
                        if (typeof closedCallback !== "function") {
                            throw new TypeError("The callback must be a function.");
                        }
                        pendingSub.handlers.onClosed.push(closedCallback);
                    },
                    onFailed: function () {
                        /* Will not be implemented for browser. */
                    },
                    close: function () { return that.closeSubscription(subLocalKey); },
                    requestArguments: pendingSub.arguments,
                    serverInstance: that.repository.getServerById(serverId).getInfoForUser(),
                    stream: pendingSub.method.info,
                });
            }
        };
        this.handleEventData = function (msg) {
            var subLocalKey = _this.subscriptionIdToLocalKeyMap[msg.subscription_id];
            if (typeof subLocalKey === "undefined") {
                return;
            }
            var subscription = _this.subscriptionsList[subLocalKey];
            if (typeof subscription !== "object") {
                return;
            }
            var trackedServersFound = subscription.trackedServers.filter(function (server) {
                return server.subscriptionId === msg.subscription_id;
            });
            if (trackedServersFound.length !== 1) {
                return;
            }
            var isPrivateData = msg.oob && msg.snapshot;
            var sendingServerId = trackedServersFound[0].serverId;
            // Create the arrivedData object, new object for each handler call
            var receivedStreamData = function () {
                return {
                    data: msg.data,
                    server: _this.repository.getServerById(sendingServerId).getInfoForUser(),
                    requestArguments: subscription.arguments || {},
                    message: null,
                    private: isPrivateData,
                };
            };
            var onDataHandlers = subscription.handlers.onData;
            var queuedData = subscription.queued.data;
            if (onDataHandlers.length > 0) {
                onDataHandlers.forEach(function (callback) {
                    if (typeof callback === "function") {
                        callback(receivedStreamData());
                    }
                });
            }
            else {
                queuedData.push(receivedStreamData());
            }
        };
        this.handleSubscriptionCancelled = function (msg) {
            var subLocalKey = _this.subscriptionIdToLocalKeyMap[msg.subscription_id];
            if (typeof subLocalKey === "undefined") {
                return;
            }
            var subscription = _this.subscriptionsList[subLocalKey];
            if (typeof subscription !== "object") {
                return;
            }
            // Filter tracked servers
            var expectedNewLength = subscription.trackedServers.length - 1;
            subscription.trackedServers = subscription.trackedServers.filter(function (server) {
                if (server.subscriptionId === msg.subscription_id) {
                    subscription.queued.closers.push(server.serverId);
                    return false;
                }
                else {
                    return true;
                }
            });
            // Check if a server was actually removed
            if (subscription.trackedServers.length !== expectedNewLength) {
                return;
            }
            // Check if this was the last remaining server
            if (subscription.trackedServers.length <= 0) {
                clearTimeout(subscription.timeoutId);
                _this.callOnClosedHandlers(subscription);
                delete _this.subscriptionsList[subLocalKey];
            }
            delete _this.subscriptionIdToLocalKeyMap[msg.subscription_id];
        };
        session.on("subscribed", this.handleSubscribed);
        session.on("event", this.handleEventData);
        session.on("subscription-cancelled", this.handleSubscriptionCancelled);
    }
    ClientStreaming.prototype.subscribe = function (streamingMethod, argumentObj, targetServers, stuff, success, error) {
        var _this = this;
        if (targetServers.length === 0) {
            error({
                method: streamingMethod.getInfoForUser(),
                called_with: argumentObj,
                message: ERR_MSG_SUB_FAILED + " No available servers matched the target params.",
            });
            return;
        }
        // Note: used to find the subscription in subList. Do not confuse it with the gw-generated subscription_id
        var subLocalKey = this.getNextSubscriptionLocalKey();
        var pendingSub = this.registerSubscription(subLocalKey, streamingMethod, argumentObj, success, error, stuff.methodResponseTimeout);
        if (typeof pendingSub !== "object") {
            error({
                method: streamingMethod.getInfoForUser(),
                called_with: argumentObj,
                message: ERR_MSG_SUB_FAILED + " Unable to register the user callbacks.",
            });
            return;
        }
        targetServers.forEach(function (target) {
            var serverId = target.server.id;
            pendingSub.trackedServers.push({
                serverId: serverId,
                subscriptionId: undefined,
            });
            var msg = {
                type: "subscribe",
                server_id: serverId,
                method_id: streamingMethod.protocolState.id,
                arguments_kv: argumentObj,
            };
            _this.session.send(msg, { serverId: serverId, subLocalKey: subLocalKey })
                .then(function (m) { return _this.handleSubscribed(m); })
                .catch(function (err) { return _this.handleErrorSubscribing(err); });
        });
    };
    ClientStreaming.prototype.getNextSubscriptionLocalKey = function () {
        var current = this.nextSubLocalKey;
        this.nextSubLocalKey += 1;
        return current;
    };
    ClientStreaming.prototype.registerSubscription = function (subLocalKey, method, args, success, error, timeout) {
        var _this = this;
        this.subscriptionsList[subLocalKey] = {
            status: STATUS_AWAITING_ACCEPT,
            method: method,
            arguments: args,
            success: success,
            error: error,
            trackedServers: [],
            handlers: {
                onData: [],
                onClosed: [],
            },
            queued: {
                data: [],
                closers: [],
            },
            timeoutId: undefined,
        };
        this.subscriptionsList[subLocalKey].timeoutId = setTimeout(function () {
            if (_this.subscriptionsList[subLocalKey] === undefined) {
                return; // no such subscription
            }
            var pendingSub = _this.subscriptionsList[subLocalKey];
            if (pendingSub.status === STATUS_AWAITING_ACCEPT) {
                error({
                    method: method.getInfoForUser(),
                    called_with: args,
                    message: ERR_MSG_SUB_FAILED + " Subscription attempt timed out after " + timeout + " ms.",
                });
                // None of the target servers has answered the subscription attempt
                delete _this.subscriptionsList[subLocalKey];
            }
            else if (pendingSub.status === STATUS_SUBSCRIBED && pendingSub.trackedServers.length > 0) {
                // Clean the trackedServers, removing those without valid streamId
                pendingSub.trackedServers = pendingSub.trackedServers.filter(function (server) {
                    return (typeof server.subscriptionId !== "undefined");
                });
                delete pendingSub.timeoutId;
                if (pendingSub.trackedServers.length <= 0) {
                    // There are no open streams, some servers accepted then closed very quickly
                    //  (that's why the status changed but there's no good server with a StreamId)
                    // call the onClosed handlers
                    _this.callOnClosedHandlers(pendingSub);
                    delete _this.subscriptionsList[subLocalKey];
                }
            }
        }, timeout);
        return this.subscriptionsList[subLocalKey];
    };
    ClientStreaming.prototype.callOnClosedHandlers = function (subscription, reason) {
        var closersCount = subscription.queued.closers.length;
        var closingServerId = (closersCount > 0) ? subscription.queued.closers[closersCount - 1] : null;
        var closingServer = null;
        if (typeof closingServerId === "number") {
            closingServer = this.repository.getServerById(closingServerId).getInfoForUser();
        }
        subscription.handlers.onClosed.forEach(function (callback) {
            if (typeof callback !== "function") {
                return;
            }
            callback({
                message: reason || ON_CLOSE_MSG_SERVER_INIT,
                requestArguments: subscription.arguments,
                server: closingServer,
                stream: subscription.method,
            });
        });
    };
    ClientStreaming.prototype.closeSubscription = function (subLocalKey) {
        var _this = this;
        var subscription = this.subscriptionsList[subLocalKey];
        if (typeof subscription !== "object") {
            return;
        }
        // Tell each server that we're unsubscribing
        subscription.trackedServers.forEach(function (server) {
            if (typeof server.subscriptionId === "undefined") {
                return;
            }
            _this.session.sendFireAndForget({
                type: "unsubscribe",
                subscription_id: server.subscriptionId,
                reason_uri: "",
                reason: ON_CLOSE_MSG_CLIENT_INIT,
            });
            delete _this.subscriptionIdToLocalKeyMap[server.subscriptionId];
        });
        subscription.trackedServers = [];
        this.callOnClosedHandlers(subscription, ON_CLOSE_MSG_CLIENT_INIT);
        delete this.subscriptionsList[subLocalKey];
    };
    return ClientStreaming;
}());
exports.default = ClientStreaming;
//# sourceMappingURL=client-streaming.js.map

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var callback_registry_1 = __webpack_require__(1);
var client_streaming_1 = __webpack_require__(37);
/**
 * Handles session lifetime and events
 */
var ClientProtocol = /** @class */ (function () {
    function ClientProtocol(instance, session, repository, logger) {
        var _this = this;
        this.instance = instance;
        this.session = session;
        this.repository = repository;
        this.logger = logger;
        this.callbacks = callback_registry_1.default();
        session.on("peer-added", function (msg) { return _this.handlePeerAdded(msg); });
        session.on("peer-removed", function (msg) { return _this.handlePeerRemoved(msg); });
        session.on("methods-added", function (msg) { return _this.handleMethodsAddedMessage(msg); });
        session.on("methods-removed", function (msg) { return _this.handleMethodsRemovedMessage(msg); });
        this.streaming = new client_streaming_1.default(instance, session, repository, logger);
    }
    ClientProtocol.prototype.subscribe = function (stream, args, targetServers, options, success, error) {
        this.streaming.subscribe(stream, args, targetServers, options, success, error);
    };
    ClientProtocol.prototype.invoke = function (id, method, args, target) {
        var _this = this;
        var serverId = target.id;
        var methodId = method.protocolState.id;
        var msg = {
            type: "call",
            server_id: serverId,
            method_id: methodId,
            arguments_kv: args,
        };
        // we transfer the invocation id as tag
        this.session.send(msg, { invocationId: id, serverId: serverId })
            .then(function (m) { return _this.handleResultMessage(m); })
            .catch(function (err) { return _this.handleInvocationError(err); });
    };
    ClientProtocol.prototype.onInvocationResult = function (callback) {
        this.callbacks.add("onResult", callback);
    };
    ClientProtocol.prototype.handlePeerAdded = function (msg) {
        var newPeerId = msg.new_peer_id;
        var remoteId = msg.identity;
        var pid = Number(remoteId.process);
        var serverInfo = {
            machine: remoteId.machine,
            pid: isNaN(pid) ? remoteId.process : pid,
            instance: remoteId.instance,
            application: remoteId.application,
            environment: remoteId.environment,
            region: remoteId.region,
            user: remoteId.user,
            windowId: remoteId.windowId,
            peerId: newPeerId,
        };
        this.repository.addServer(serverInfo, newPeerId);
    };
    ClientProtocol.prototype.handlePeerRemoved = function (msg) {
        var removedPeerId = msg.removed_id;
        var reason = msg.reason;
        this.repository.removeServerById(removedPeerId, reason);
    };
    ClientProtocol.prototype.handleMethodsAddedMessage = function (msg) {
        var _this = this;
        var serverId = msg.server_id;
        var methods = msg.methods;
        methods.forEach(function (method) {
            var methodInfo = {
                name: method.name,
                displayName: method.display_name,
                description: method.description,
                version: method.version,
                objectTypes: method.object_types,
                accepts: method.input_signature,
                returns: method.result_signature,
                supportsStreaming: typeof method.flags !== "undefined" ? method.flags.streaming : false,
            };
            _this.repository.addServerMethod(serverId, methodInfo, { id: method.id });
        });
    };
    ClientProtocol.prototype.handleMethodsRemovedMessage = function (msg) {
        var _this = this;
        var serverId = msg.server_id;
        var methodIdList = msg.methods;
        var server = this.repository.getServerById(serverId);
        var serverMethodKeys = Object.keys(server.methods);
        serverMethodKeys.forEach(function (methodKey) {
            var method = server.methods[methodKey];
            if (methodIdList.indexOf(method.protocolState.id) > -1) {
                _this.repository.removeServerMethod(serverId, methodKey);
            }
        });
    };
    ClientProtocol.prototype.handleResultMessage = function (msg) {
        var invocationId = msg._tag.invocationId;
        var result = msg.result;
        var serverId = msg._tag.serverId;
        var server = this.repository.getServerById(serverId);
        this.callbacks.execute("onResult", invocationId, server.getInfoForUser(), 0, result, "");
    };
    ClientProtocol.prototype.handleInvocationError = function (msg) {
        // TODO check for log level
        this.logger.debug("handle invocation error " + JSON.stringify(msg));
        var invocationId = msg._tag.invocationId;
        var serverId = msg._tag.serverId;
        var server = this.repository.getServerById(serverId);
        var message = msg.reason;
        var context = msg.context;
        this.callbacks.execute("onResult", invocationId, server.getInfoForUser(), 1, context, message);
    };
    return ClientProtocol;
}());
exports.default = ClientProtocol;
//# sourceMappingURL=client.js.map

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __webpack_require__(41);
var client_1 = __webpack_require__(38);
function default_1(instance, connection, clientRepository, serverRepository, libConfig, getAGM) {
    var logger = libConfig.logger.subLogger("gw3-protocol");
    var resolveReadyPromise;
    var readyPromise = new Promise(function (resolve) {
        resolveReadyPromise = resolve;
    });
    // start domain join handshake
    var session = connection.domain("agm", logger.subLogger("domain"), ["subscribed"]);
    var server = new server_1.default(instance, session, clientRepository, serverRepository, logger.subLogger("server"));
    var client = new client_1.default(instance, session, clientRepository, logger.subLogger("client"));
    function handleReconnect() {
        // we're reconnecting
        logger.info("reconnected - will replay registered methods and subscriptions");
        // Client side
        clientRepository.reset();
        // add our server
        clientRepository.addServer(instance, connection.peerId);
        // TODO - re-subscribe for streams
        // server side
        var registeredMethods = serverRepository.getList();
        serverRepository.reset();
        // replay server methods
        registeredMethods.forEach(function (method) {
            var def = method.definition;
            if (method.theFunction.userCallback) {
                getAGM().register(def, method.theFunction.userCallback);
            }
            else if (method.theFunction.userCallbackAsync) {
                getAGM().registerAsync(def, method.theFunction.userCallbackAsync);
            }
        });
    }
    function handleInitialJoin() {
        clientRepository.addServer(instance, connection.peerId);
        resolveReadyPromise({
            client: client,
            server: server,
        });
        resolveReadyPromise = undefined;
    }
    session.onJoined(function (reconnect) {
        if (reconnect) {
            handleReconnect();
        }
        else {
            handleInitialJoin();
        }
    });
    session.join();
    return readyPromise;
}
exports.default = default_1;
//# sourceMappingURL=factory.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)["Promise"]))

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var callback_registry_1 = __webpack_require__(1);
var SUBSCRIPTION_REQUEST = "onSubscriptionRequest";
var SUBSCRIPTION_ADDED = "onSubscriptionAdded";
var SUBSCRIPTION_REMOVED = "onSubscriptionRemoved";
/**
 * Handles registering methods and sending data to clients
 */
var ServerStreaming = /** @class */ (function () {
    function ServerStreaming(instance, session, repository, serverRepository, logger) {
        var _this = this;
        this.instance = instance;
        this.session = session;
        this.repository = repository;
        this.serverRepository = serverRepository;
        this.logger = logger;
        this.ERR_URI_SUBSCRIPTION_FAILED = "com.tick42.agm.errors.subscription.failure";
        this.callbacks = callback_registry_1.default();
        this.nextStreamId = 0;
        session.on("add-interest", function (msg) { _this.handleAddInterest(msg); });
        session.on("remove-interest", function (msg) { _this.handleRemoveInterest(msg); });
    }
    ServerStreaming.prototype.acceptRequestOnBranch = function (requestContext, streamingMethod, branch) {
        if (typeof branch !== "string") {
            branch = "";
        }
        if (typeof streamingMethod.protocolState.subscriptionsMap !== "object") {
            throw new TypeError("The streaming method is missing its subscriptions.");
        }
        if (!Array.isArray(streamingMethod.protocolState.branchKeyToStreamIdMap)) {
            throw new TypeError("The streaming method is missing its branches.");
        }
        var streamId = this.getStreamId(streamingMethod, branch);
        // Add a new subscription to the method
        var key = requestContext.msg.subscription_id;
        var subscription = {
            id: key,
            arguments: requestContext.arguments,
            instance: requestContext.instance,
            branchKey: branch,
            streamId: streamId,
            subscribeMsg: requestContext.msg,
        };
        streamingMethod.protocolState.subscriptionsMap[key] = subscription;
        // Inform the gw
        this.session.sendFireAndForget({
            type: "accepted",
            subscription_id: key,
            stream_id: streamId,
        });
        // Pass state above-protocol for user objects
        this.callbacks.execute(SUBSCRIPTION_ADDED, subscription, streamingMethod);
    };
    ServerStreaming.prototype.rejectRequest = function (requestContext, streamingMethod, reason) {
        if (typeof reason !== "string") {
            reason = "";
        }
        this.sendSubscriptionFailed("Subscription rejected by user. " + reason, requestContext.msg.subscription_id);
    };
    ServerStreaming.prototype.pushData = function (streamingMethod, data, branches) {
        var _this = this;
        if (typeof streamingMethod !== "object" || !Array.isArray(streamingMethod.protocolState.branchKeyToStreamIdMap)) {
            return;
        }
        // TODO validate data is a plain object
        if (typeof data !== "object") {
            throw new Error("Invalid arguments. Data must be an object.");
        }
        if (typeof branches === "string") {
            branches = [branches]; // user wants to push to single branch
        }
        else if (!Array.isArray(branches) || branches.length <= 0) {
            branches = null;
        }
        // get the StreamId's from the method's branch map
        var streamIdList = streamingMethod.protocolState.branchKeyToStreamIdMap
            .filter(function (br) {
            return (branches === null || (Boolean(br) && typeof br.key === "string" && branches.indexOf(br.key) >= 0));
        }).map(function (br) {
            return br.streamId;
        });
        streamIdList.forEach(function (streamId) {
            var publishMessage = {
                type: "publish",
                stream_id: streamId,
                // sequence: null,  // the streamingMethod might be used for this
                // snapshot: false, // ...and this
                data: data,
            };
            _this.session.sendFireAndForget(publishMessage);
        });
    };
    ServerStreaming.prototype.pushDataToSingle = function (method, subscription, data) {
        // TODO validate data is a plain object
        if (typeof data !== "object") {
            throw new Error("Invalid arguments. Data must be an object.");
        }
        var postMessage = {
            type: "post",
            subscription_id: subscription.id,
            // sequence: null,  // the streamingMethod might be used for this
            // snapshot: false, // ...and this
            data: data,
        };
        this.session.sendFireAndForget(postMessage);
    };
    ServerStreaming.prototype.closeSingleSubscription = function (streamingMethod, subscription) {
        delete streamingMethod.protocolState.subscriptionsMap[subscription.id];
        var dropSubscriptionMessage = {
            type: "drop-subscription",
            subscription_id: subscription.id,
            reason: "Server dropping a single subscription",
        };
        this.session.sendFireAndForget(dropSubscriptionMessage);
        var subscriber = subscription.instance;
        this.callbacks.execute(SUBSCRIPTION_REMOVED, subscription, streamingMethod);
    };
    ServerStreaming.prototype.closeMultipleSubscriptions = function (streamingMethod, branchKey) {
        var _this = this;
        if (typeof streamingMethod !== "object" || typeof streamingMethod.protocolState.subscriptionsMap !== "object") {
            return;
        }
        var subscriptionsToClose = Object.keys(streamingMethod.protocolState.subscriptionsMap)
            .map(function (key) {
            return streamingMethod.protocolState.subscriptionsMap[key];
        });
        if (typeof branchKey === "string") {
            subscriptionsToClose = subscriptionsToClose.filter(function (sub) {
                return sub.branchKey === branchKey;
            });
        }
        subscriptionsToClose.forEach(function (subscription) {
            delete streamingMethod.protocolState.subscriptionsMap[subscription.id];
            var drop = {
                type: "drop-subscription",
                subscription_id: subscription.id,
                reason: "Server dropping all subscriptions on stream_id: " + subscription.streamId,
            };
            _this.session.sendFireAndForget(drop);
        });
    };
    ServerStreaming.prototype.getSubscriptionList = function (streamingMethod, branchKey) {
        if (typeof streamingMethod !== "object") {
            return [];
        }
        var subscriptions = [];
        var allSubscriptions = Object.keys(streamingMethod.protocolState.subscriptionsMap)
            .map(function (key) {
            return streamingMethod.protocolState.subscriptionsMap[key];
        });
        if (typeof branchKey !== "string") {
            subscriptions = allSubscriptions;
        }
        else {
            subscriptions = allSubscriptions.filter(function (sub) {
                return sub.branchKey === branchKey;
            });
        }
        return subscriptions;
    };
    ServerStreaming.prototype.getBranchList = function (streamingMethod) {
        if (typeof streamingMethod !== "object") {
            return [];
        }
        var allSubscriptions = Object.keys(streamingMethod.protocolState.subscriptionsMap)
            .map(function (key) {
            return streamingMethod.protocolState.subscriptionsMap[key];
        });
        var keysWithDuplicates = allSubscriptions.map(function (sub) {
            var result = null;
            if (typeof sub === "object" && typeof sub.branchKey === "string") {
                result = sub.branchKey;
            }
            return result;
        });
        var seen = [];
        var branchArray = keysWithDuplicates.filter(function (bKey) {
            if (bKey === null || seen.indexOf(bKey) >= 0) {
                return false;
            }
            seen.push(bKey);
            return true;
        });
        return branchArray;
    };
    ServerStreaming.prototype.onSubAdded = function (callback) {
        this.onSubscriptionLifetimeEvent(SUBSCRIPTION_ADDED, callback);
    };
    ServerStreaming.prototype.onSubRequest = function (callback) {
        this.onSubscriptionLifetimeEvent(SUBSCRIPTION_REQUEST, callback);
    };
    ServerStreaming.prototype.onSubRemoved = function (callback) {
        this.onSubscriptionLifetimeEvent(SUBSCRIPTION_REMOVED, callback);
    };
    ServerStreaming.prototype.handleRemoveInterest = function (msg) {
        var streamingMethod = this.serverRepository.getById(msg.method_id);
        if (typeof msg.subscription_id !== "string" ||
            typeof streamingMethod !== "object" ||
            typeof streamingMethod.protocolState.subscriptionsMap[msg.subscription_id] !== "object") {
            return;
        }
        var subscription = streamingMethod.protocolState.subscriptionsMap[msg.subscription_id];
        delete streamingMethod.protocolState.subscriptionsMap[msg.subscription_id];
        this.callbacks.execute(SUBSCRIPTION_REMOVED, subscription, streamingMethod);
    };
    ServerStreaming.prototype.onSubscriptionLifetimeEvent = function (eventName, handlerFunc) {
        this.callbacks.add(eventName, handlerFunc);
    };
    // TODO there are many of these incrementing integer id's -> make a helper module
    ServerStreaming.prototype.getNextStreamId = function () {
        return this.nextStreamId++ + "";
    };
    /**
     * Processes a subscription request
     */
    ServerStreaming.prototype.handleAddInterest = function (msg) {
        var caller = this.repository.getServerById(msg.caller_id);
        var instance = (typeof caller.getInfoForUser === "function") ? caller.getInfoForUser() : null;
        // call subscriptionRequestHandler
        var requestContext = {
            msg: msg,
            arguments: msg.arguments_kv || {},
            instance: instance,
        };
        var streamingMethod = this.serverRepository.getById(msg.method_id);
        if (streamingMethod === undefined) {
            var errorMsg = "No method with id " + msg.method_id + " on this server.";
            this.sendSubscriptionFailed(errorMsg, msg.subscription_id);
            return;
        }
        if (streamingMethod.protocolState.subscriptionsMap &&
            streamingMethod.protocolState.subscriptionsMap[msg.subscription_id]) {
            this.sendSubscriptionFailed("A subscription with id " + msg.subscription_id + " already exists.", msg.subscription_id);
            return;
        }
        this.callbacks.execute(SUBSCRIPTION_REQUEST, requestContext, streamingMethod);
    };
    ServerStreaming.prototype.sendSubscriptionFailed = function (reason, subscriptionId) {
        var errorMessage = {
            type: "error",
            reason_uri: this.ERR_URI_SUBSCRIPTION_FAILED,
            reason: reason,
            request_id: subscriptionId,
        };
        this.session.sendFireAndForget(errorMessage);
    };
    ServerStreaming.prototype.getStreamId = function (streamingMethod, branchKey) {
        if (typeof branchKey !== "string") {
            branchKey = "";
        }
        var needleBranch = streamingMethod.protocolState.branchKeyToStreamIdMap.filter(function (branch) {
            return branch.key === branchKey;
        })[0];
        var streamId = (needleBranch ? needleBranch.streamId : undefined);
        if (typeof streamId !== "string" || streamId === "") {
            streamId = this.getNextStreamId();
            streamingMethod.protocolState.branchKeyToStreamIdMap.push({ key: branchKey, streamId: streamId });
        }
        return streamId;
    };
    return ServerStreaming;
}());
exports.default = ServerStreaming;
//# sourceMappingURL=server-streaming.js.map

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var callback_registry_1 = __webpack_require__(1);
var server_streaming_1 = __webpack_require__(40);
var ServerProtocol = /** @class */ (function () {
    function ServerProtocol(instance, session, clientRepository, serverRepository, logger) {
        var _this = this;
        this.session = session;
        this.clientRepository = clientRepository;
        this.serverRepository = serverRepository;
        this.logger = logger;
        this.callbacks = callback_registry_1.default();
        this.streaming = new server_streaming_1.default(instance, session, clientRepository, serverRepository, logger);
        this.session.on("invoke", function (msg) { return _this.handleInvokeMessage(msg); });
    }
    ServerProtocol.prototype.createStream = function (repoMethod, success, error) {
        var isStreaming = true;
        // Utility things for this protocol
        repoMethod.protocolState.subscriptionsMap = {}; // ~subscription_id~ : {id:~, branchKey: '~', arguments: {~}, instance:{~}, etc.}
        repoMethod.protocolState.branchKeyToStreamIdMap = []; // [ {branchKey: '', streamId: 7}, {...}, ...]
        this.register(repoMethod, success, error, isStreaming);
    };
    ServerProtocol.prototype.register = function (repoMethod, success, error, isStreaming) {
        var _this = this;
        var methodDef = repoMethod.definition;
        // TODO review, why is this type of closure necessary
        repoMethod.protocolState.registrationCallbacks = {
            success: success,
            fail: error,
        };
        var flags = { streaming: isStreaming || false };
        this.logger.debug('registering method "' + methodDef.name + '"');
        var registerMsg = {
            type: "register",
            methods: [{
                    id: repoMethod.repoId,
                    name: methodDef.name,
                    display_name: methodDef.displayName,
                    description: methodDef.description,
                    version: methodDef.version,
                    flags: flags,
                    object_types: methodDef.objectTypes || methodDef.object_types,
                    input_signature: methodDef.accepts,
                    result_signature: methodDef.returns,
                    restrictions: undefined,
                }],
        };
        this.session.send(registerMsg, { methodId: repoMethod.repoId })
            .then(function (msg) { return _this.handleRegisteredMessage(msg); })
            .catch(function (err) { return _this.handleErrorRegister(err); });
    };
    ServerProtocol.prototype.onInvoked = function (callback) {
        this.callbacks.add("onInvoked", callback);
    };
    ServerProtocol.prototype.methodInvocationResult = function (method, invocationId, err, result) {
        var msg;
        if (err) {
            msg = {
                type: "error",
                request_id: invocationId,
                reason_uri: "agm.errors.client_error",
                reason: err,
                context: result,
                peer_id: undefined,
            };
        }
        else {
            msg = {
                type: "yield",
                invocation_id: invocationId,
                peer_id: this.session.peerId,
                result: result,
                request_id: undefined,
            };
        }
        this.session.sendFireAndForget(msg);
    };
    ServerProtocol.prototype.unregister = function (method) {
        var msg = {
            type: "unregister",
            methods: [method.repoId],
        };
        this.session.send(msg);
    };
    ServerProtocol.prototype.getBranchList = function (method) {
        return this.streaming.getBranchList(method);
    };
    ServerProtocol.prototype.getSubscriptionList = function (method, branchKey) {
        return this.streaming.getSubscriptionList(method, branchKey);
    };
    ServerProtocol.prototype.closeAllSubscriptions = function (method, branchKey) {
        this.streaming.closeMultipleSubscriptions(method, branchKey);
    };
    ServerProtocol.prototype.pushData = function (method, data, branches) {
        this.streaming.pushData(method, data, branches);
    };
    ServerProtocol.prototype.pushDataToSingle = function (method, subscription, data) {
        this.streaming.pushDataToSingle(method, subscription, data);
    };
    ServerProtocol.prototype.closeSingleSubscription = function (method, subscription) {
        this.streaming.closeSingleSubscription(method, subscription);
    };
    ServerProtocol.prototype.acceptRequestOnBranch = function (requestContext, method, branch) {
        this.streaming.acceptRequestOnBranch(requestContext, method, branch);
    };
    ServerProtocol.prototype.rejectRequest = function (requestContext, method, reason) {
        this.streaming.rejectRequest(requestContext, method, reason);
    };
    ServerProtocol.prototype.onSubRequest = function (callback) {
        this.streaming.onSubRequest(callback);
    };
    ServerProtocol.prototype.onSubAdded = function (callback) {
        this.streaming.onSubAdded(callback);
    };
    ServerProtocol.prototype.onSubRemoved = function (callback) {
        this.streaming.onSubRemoved(callback);
    };
    ServerProtocol.prototype.handleRegisteredMessage = function (msg) {
        var methodId = msg._tag.methodId;
        var repoMethod = this.serverRepository.getById(methodId);
        if (repoMethod && repoMethod.protocolState.registrationCallbacks) {
            this.logger.debug("registered method " + repoMethod.definition.name + " with id " + methodId);
            repoMethod.protocolState.registrationCallbacks.success();
        }
    };
    ServerProtocol.prototype.handleErrorRegister = function (msg) {
        this.logger.warn(JSON.stringify(msg));
        var methodId = msg._tag.methodId;
        var repoMethod = this.serverRepository.getById(methodId);
        if (repoMethod && repoMethod.protocolState.registrationCallbacks) {
            this.logger.debug("failed to register method " + repoMethod.definition.name + " with id " + methodId);
            repoMethod.protocolState.registrationCallbacks.fail();
        }
    };
    ServerProtocol.prototype.handleInvokeMessage = function (msg) {
        var invocationId = msg.invocation_id;
        var callerId = msg.caller_id;
        var methodId = msg.method_id;
        var args = msg.arguments_kv;
        this.logger.debug('received invocation for method id "' + methodId + '" from peer ' + callerId);
        var methodList = this.serverRepository.getList();
        var method = methodList.filter(function (m) {
            return m.repoId === methodId;
        })[0];
        // Stop if the message isn't for us
        if (method === undefined) {
            return;
        }
        var client = this.clientRepository.getServerById(callerId);
        var invocationArgs = { args: args, instance: client.getInfoForUser() };
        this.callbacks.execute("onInvoked", method, invocationId, invocationArgs);
    };
    return ServerProtocol;
}());
exports.default = ServerProtocol;
//# sourceMappingURL=server.js.map

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var subscription_1 = __webpack_require__(10);
var ServerBranch = /** @class */ (function () {
    function ServerBranch(key, protocol, repoMethod) {
        this.key = key;
        this.protocol = protocol;
        this.repoMethod = repoMethod;
    }
    ServerBranch.prototype.subscriptions = function () {
        var _this = this;
        var subList = this.protocol.server.getSubscriptionList(this.repoMethod, this.key);
        return subList.map(function (sub) {
            return new subscription_1.default(_this.protocol, _this.repoMethod, sub);
        });
    };
    ServerBranch.prototype.close = function () {
        this.protocol.server.closeAllSubscriptions(this.repoMethod, this.key);
    };
    ServerBranch.prototype.push = function (data) {
        this.protocol.server.pushData(this.repoMethod, data, [this.key]);
    };
    return ServerBranch;
}());
exports.default = ServerBranch;
//# sourceMappingURL=branch.js.map

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ServerRepository = /** @class */ (function () {
    function ServerRepository() {
        this.nextId = 0;
        this.methods = [];
    }
    ServerRepository.prototype.add = function (method) {
        if (typeof method !== "object") {
            return;
        }
        if (method.repoId !== undefined) {
            return;
        }
        // id should be a string
        method.repoId = String(this.nextId);
        this.nextId += 1;
        this.methods.push(method);
        return method;
    };
    ServerRepository.prototype.remove = function (repoId) {
        if (typeof repoId !== "string") {
            return new TypeError("Expecting a string");
        }
        this.methods = this.methods.filter(function (m) {
            return m.repoId !== repoId;
        });
    };
    ServerRepository.prototype.getById = function (id) {
        if (typeof id !== "string") {
            return undefined;
        }
        return this.methods.filter(function (m) {
            return m.repoId === id;
        })[0];
    };
    ServerRepository.prototype.getList = function () {
        return this.methods.map(function (m) { return m; });
    };
    ServerRepository.prototype.length = function () {
        return this.methods.length;
    };
    ServerRepository.prototype.reset = function () {
        this.methods = [];
    };
    return ServerRepository;
}());
exports.default = ServerRepository;
//# sourceMappingURL=repository.js.map

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Request = /** @class */ (function () {
    function Request(protocol, repoMethod, requestContext) {
        this.protocol = protocol;
        this.repoMethod = repoMethod;
        this.requestContext = requestContext;
        this.arguments = requestContext.arguments;
        this.instance = requestContext.instance;
    }
    Request.prototype.accept = function () {
        this.protocol.server.acceptRequestOnBranch(this.requestContext, this.repoMethod, "");
    };
    Request.prototype.acceptOnBranch = function (branch) {
        this.protocol.server.acceptRequestOnBranch(this.requestContext, this.repoMethod, branch);
    };
    Request.prototype.reject = function (reason) {
        this.protocol.server.rejectRequest(this.requestContext, this.repoMethod, reason);
    };
    return Request;
}());
exports.default = Request;
//# sourceMappingURL=request.js.map

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var promisify_1 = __webpack_require__(9);
var streaming_1 = __webpack_require__(47);
var stream_1 = __webpack_require__(46);
/*
 The AGM Server allows users register AGM methods.
 It exposes these methods to AGM clients (using presence messages) and listens for their invocation
 */
var Server = /** @class */ (function () {
    function Server(protocol, serverRepository, instance, configuration) {
        this.protocol = protocol;
        this.serverRepository = serverRepository;
        this.instance = instance;
        this.configuration = configuration;
        this.invocations = 0;
        // Save the reference to the metric function if it exists
        if (configuration.metrics !== undefined) {
            this.metric = configuration.metrics.numberMetric.bind(configuration.metrics);
        }
        // An array of the server's methods
        this.streaming = new streaming_1.default(protocol, this);
        this.protocol.server.onInvoked(this.onMethodInvoked.bind(this));
    }
    /**
     * Registers a new agm method
     * @param {MethodDefinition} methodDefinition
     * @param {MethodHandler} callback Callback that will be called when the AGM server is invoked
     */
    Server.prototype.register = function (methodDefinition, callback) {
        var wrappedCallbackFunction = function (context, resultCallback) {
            // get the result as direct invocation of the callback and return it using resultCallback
            try {
                var result = callback(context.args, context.instance);
                resultCallback(null, result);
            }
            catch (e) {
                resultCallback(e, e);
            }
        };
        wrappedCallbackFunction.userCallback = callback;
        this.registerCore(methodDefinition, wrappedCallbackFunction);
    };
    // registers a new async agm method (the result can be returned in async way)
    Server.prototype.registerAsync = function (methodDefinition, callback) {
        var wrappedCallback = function (context, resultCallback) {
            // invoke the callback passing success and error callbacks
            try {
                callback(context.args, context.instance, function (result) {
                    resultCallback(null, result);
                }, function (e) {
                    resultCallback(e, e);
                });
            }
            catch (e) {
                resultCallback(e, null);
            }
        };
        wrappedCallback.userCallbackAsync = callback;
        this.registerCore(methodDefinition, wrappedCallback);
    };
    // Registers a new streaming agm method
    Server.prototype.createStream = function (streamDef, callbacks, successCallback, errorCallback) {
        var _this = this;
        // in callbacks we have subscriptionRequestHandler, subscriptionAddedHandler, subscriptionRemovedHandler
        var promise = new Promise(function (resolve, reject) {
            if (typeof streamDef === "string") {
                if (streamDef === "") {
                    reject("Invalid stream name - can not be empty");
                }
                streamDef = { name: streamDef };
            }
            streamDef.supportsStreaming = true;
            // User-supplied subscription callbacks
            if (!callbacks) {
                callbacks = {};
            }
            if (typeof callbacks.subscriptionRequestHandler !== "function") {
                callbacks.subscriptionRequestHandler = function (request) {
                    request.accept();
                };
            }
            var repoMethod = {
                definition: streamDef,
                streamCallbacks: callbacks,
                protocolState: {},
            };
            // Add the method
            _this.serverRepository.add(repoMethod);
            _this.protocol.server.createStream(repoMethod, function () {
                _this.metric("Registered methods", _this.serverRepository.length());
                var streamFrontObject = new stream_1.default(_this.protocol, repoMethod, _this);
                repoMethod.stream = streamFrontObject;
                resolve(streamFrontObject);
            }, function (err) {
                _this.serverRepository.remove(repoMethod.repoId);
                reject(err);
            });
        });
        return promisify_1.default(promise, successCallback, errorCallback);
    };
    // TODO add success/fail here and at gw1+2 implementations?
    // Unregisters a previously registered AGM method
    Server.prototype.unregister = function (methodFilter) {
        var _this = this;
        if (typeof methodFilter === "string") {
            methodFilter = { name: methodFilter };
        }
        var methodsToBeRemoved = this.serverRepository.getList().filter(function (method) {
            return _this.containsProps(methodFilter, method.definition);
        });
        // update repository
        methodsToBeRemoved.forEach(function (method) {
            _this.serverRepository.remove(method.repoId);
            _this.protocol.server.unregister(method);
        });
        this.metric("Registered methods", this.serverRepository.length());
    };
    // Core method for registering agm method
    Server.prototype.registerCore = function (methodDefinition, theFunction) {
        var _this = this;
        // transform the definition
        if (typeof methodDefinition === "string") {
            methodDefinition = { name: methodDefinition };
        }
        // Add the method ()
        var repoMethod = this.serverRepository.add({
            definition: methodDefinition,
            theFunction: theFunction,
            protocolState: {},
        });
        this.protocol.server.register(repoMethod, function () {
            _this.metric("Registered methods", _this.serverRepository.length());
        }, function () {
            _this.serverRepository.remove(repoMethod.repoId);
        });
    };
    /**
     * Checks if all properties of filter match properties in object
     */
    Server.prototype.containsProps = function (filter, object) {
        var match = true;
        Object.keys(filter).forEach(function (prop) {
            if (filter[prop] !== object[prop]) {
                match = false;
            }
        });
        return match;
    };
    Server.prototype.onMethodInvoked = function (methodToExecute, invocationId, invocationArgs) {
        var _this = this;
        this.metric("Invocations count", this.invocations++);
        if (!methodToExecute) {
            return;
        }
        // Execute it and save the result
        methodToExecute.theFunction(invocationArgs, function (err, result) {
            if (err) {
                // handle error case
                if (typeof err.message === "string") {
                    err = err.message;
                }
                else if (typeof err !== "string") {
                    err = "<>";
                }
            }
            // The AGM library only transfers objects. If the result is not an object, put it in one
            if (!result || typeof result !== "object" || result.constructor === Array) {
                result = { _result: result };
            }
            _this.protocol.server.methodInvocationResult(methodToExecute, invocationId, err, result);
        });
    };
    return Server;
}());
exports.default = Server;
//# sourceMappingURL=server.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)["Promise"]))

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var subscription_1 = __webpack_require__(10);
var branch_1 = __webpack_require__(42);
var ServerStream = /** @class */ (function () {
    function ServerStream(protocol, repoMethod, server) {
        this.protocol = protocol;
        this.repoMethod = repoMethod;
        this.server = server;
        this.def = repoMethod.definition;
    }
    Object.defineProperty(ServerStream.prototype, "name", {
        get: function () { return this.def.name; },
        enumerable: true,
        configurable: true
    });
    ServerStream.prototype.branches = function (key) {
        var _this = this;
        var bList = this.protocol.server.getBranchList(this.repoMethod);
        if (key) {
            if (bList.indexOf(key) > -1) {
                return new branch_1.default(key, this.protocol, this.repoMethod);
            }
            return undefined;
        }
        else {
            return bList.map(function (branchKey) {
                return new branch_1.default(branchKey, _this.protocol, _this.repoMethod);
            });
        }
    };
    ServerStream.prototype.subscriptions = function () {
        var _this = this;
        var subList = this.protocol.server.getSubscriptionList(this.repoMethod);
        return subList.map(function (sub) {
            return new subscription_1.default(_this.protocol, _this.repoMethod, sub);
        });
    };
    Object.defineProperty(ServerStream.prototype, "definition", {
        get: function () {
            var def2 = this.def;
            return {
                accepts: def2.accepts,
                description: def2.description,
                displayName: def2.displayName,
                name: def2.name,
                objectTypes: def2.objectTypes,
                returns: def2.returns,
                supportsStreaming: def2.supportsStreaming,
            };
        },
        enumerable: true,
        configurable: true
    });
    ServerStream.prototype.close = function () {
        this.protocol.server.closeAllSubscriptions(this.repoMethod);
        this.server.unregister(this.repoMethod.definition);
    };
    ServerStream.prototype.push = function (data, branches) {
        if (typeof branches !== "string" && !Array.isArray(branches) && branches !== undefined) {
            throw new Error("invalid branches should be string or string array");
        }
        // TODO validate if is plain object
        if (typeof data !== "object") {
            throw new Error("Invalid arguments. Data must be an object.");
        }
        this.protocol.server.pushData(this.repoMethod, data, branches);
    };
    return ServerStream;
}());
exports.default = ServerStream;
//# sourceMappingURL=stream.js.map

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var subscription_1 = __webpack_require__(10);
var request_1 = __webpack_require__(44);
/*
 The streaming module defines the user objects relevant to the streaming api, and
 attaches to relevant events exposed by the protocol.
 */
var ServerStreaming = /** @class */ (function () {
    function ServerStreaming(protocol, server) {
        var _this = this;
        this.protocol = protocol;
        this.server = server;
        /** Attach to stream 'events' */
        protocol.server.onSubRequest(function (rc, rm) { return _this.handleSubRequest(rc, rm); });
        protocol.server.onSubAdded(function (sub, rm) { return _this.handleSubAdded(sub, rm); });
        protocol.server.onSubRemoved(function (sub, rm) { return _this.handleSubRemoved(sub, rm); });
    }
    ServerStreaming.prototype.handleSubRequest = function (requestContext, repoMethod) {
        if (!(repoMethod &&
            repoMethod.streamCallbacks &&
            typeof repoMethod.streamCallbacks.subscriptionRequestHandler === "function")) {
            return;
        }
        var request = new request_1.default(this.protocol, repoMethod, requestContext);
        repoMethod.streamCallbacks.subscriptionRequestHandler(request);
    };
    ServerStreaming.prototype.handleSubAdded = function (subscription, repoMethod) {
        if (!(repoMethod &&
            repoMethod.streamCallbacks &&
            typeof repoMethod.streamCallbacks.subscriptionAddedHandler === "function")) {
            return;
        }
        var sub = new subscription_1.default(this.protocol, repoMethod, subscription);
        repoMethod.streamCallbacks.subscriptionAddedHandler(sub);
    };
    ServerStreaming.prototype.handleSubRemoved = function (subscription, repoMethod) {
        if (!(repoMethod &&
            repoMethod.streamCallbacks &&
            typeof repoMethod.streamCallbacks.subscriptionRemovedHandler === "function")) {
            return;
        }
        var sub = new subscription_1.default(this.protocol, repoMethod, subscription);
        repoMethod.streamCallbacks.subscriptionRemovedHandler(sub);
    };
    return ServerStreaming;
}());
exports.default = ServerStreaming;
//# sourceMappingURL=streaming.js.map

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {
Object.defineProperty(exports, "__esModule", { value: true });
var shortid_1 = __webpack_require__(7);
var pjson = __webpack_require__(14);
function default_1(configuration, ext, hc, glue42gd) {
    if (typeof window !== "undefined") {
        global = global || window; // ... Safari WebView
    }
    global = global || {}; // ... a bit paranoid
    var uid = shortid_1.generate();
    // when searching for a configuration value check the following chain until the value is resolved:
    //
    // 1. global.GLUE_CONFIG            - a way to override user preferences. Use case is GLUE Mobile
    // 2. userConfig                    - user configuration
    // 3. global.GLUE_DEFAULT_CONFIG    - a way to dynamically override hard coded defaults
    // 4. hardDefaults                  - glue.js hard coded defaults
    var masterConfig = global.GLUE_CONFIG || {};
    var dynamicDefaults = global.GLUE_DEFAULT_CONFIG || {};
    var hardDefaults = getHardDefaults();
    var metricsIdentity = {
        system: getConfigProp("metrics", "system"),
        service: getConfigProp("metrics", "service"),
        instance: getConfigProp("metrics", "instance")
    };
    function getMetrics() {
        return ifNotFalse(getConfigProp("metrics"), {
            identity: metricsIdentity
        });
    }
    function getGateway() {
        function detectNode() {
            // Only Node.JS has a process variable that is of [[Class]] process
            try {
                return Object.prototype.toString.call(global.process) === "[object process]";
            }
            catch (e) {
                // catch all
            }
            return false;
        }
        var force = getConfigProp("gateway", "force");
        var gw = hc === undefined || force;
        if (gw) {
            var gwConfig = getConfigProp("gateway");
            var protocolVersion = getConfigProp("gateway", "protocolVersion");
            var reconnectInterval = getConfigProp("gateway", "reconnectInterval");
            var reconnectAttempts = getConfigProp("gateway", "reconnectAttempts");
            var ws = gwConfig.ws;
            var http = gwConfig.http;
            var inproc = gwConfig.inproc;
            // if not we will select endpoint for him
            if (!ws && !http && !inproc) {
                if (detectNode() || ("WebSocket" in window && window.WebSocket.CLOSING === 2)) {
                    // if in node, or we have WebSockets use ws
                    ws = getConfigProp("gateway", "ws");
                }
                else {
                    // fallback to http
                    http = getConfigProp("gateway", "http");
                }
            }
            var windowId = void 0;
            var pid = void 0;
            if (hc) {
                windowId = hc.windowId;
            }
            else if (typeof glue42gd !== "undefined") {
                windowId = glue42gd.windowId;
                pid = glue42gd.pid;
            }
            else if (detectNode()) {
                pid = process.pid;
            }
            return {
                identity: {
                    application: getApplication(),
                    windowId: windowId,
                    process: pid,
                },
                reconnectInterval: reconnectInterval,
                ws: ws,
                http: http,
                gw: inproc,
                protocolVersion: protocolVersion,
                reconnectAttempts: reconnectAttempts,
                force: true,
                replaySpecs: getConfigProp("gateway", "replaySpecs")
            };
        }
        return {};
    }
    function getLogger() {
        return getConfigProp("logger");
    }
    function getAgm() {
        return ifNotFalse(configuration.agm, {
            instance: {
                application: getApplication()
            }
        });
    }
    function getApplication() {
        return getConfigProp("application");
    }
    function getAuth() {
        return getConfigProp("auth");
    }
    function getHardDefaults() {
        function getMetricsDefaults() {
            var documentTitle = typeof document !== "undefined" ? document.title : "unknown";
            // check for empty titles
            documentTitle = documentTitle || "none";
            if (typeof hc === "undefined") {
                return {
                    system: "Connect.Browser",
                    service: configuration.application || documentTitle,
                    instance: "~" + uid
                };
            }
            if (typeof hc.metricsFacade.getIdentity !== "undefined") {
                var identity = hc.metricsFacade.getIdentity();
                return {
                    system: identity.system,
                    service: identity.service,
                    instance: identity.instance
                };
            }
            // backward compatibility for HC <= 1.60
            return {
                system: "HtmlContainer." + hc.containerName,
                service: "JS." + hc.browserWindowName,
                instance: "~" + hc.machineName
            };
        }
        function getGatewayDefaults() {
            function isSecureConnection(protocolVersion) {
                // GW2 and lower in JPM don't have SSL certificates
                if (protocolVersion && protocolVersion <= 2) {
                    return false;
                }
                if (typeof window !== "undefined" && window.location) {
                    return window.location.protocol !== "http:";
                }
                // Defaults to secure for node env.
                return true;
            }
            // GD2
            var defaultProtocol = 1;
            var gatewayURL = "localhost:22037";
            // build URI based on if running in secure connection
            var isSSL = isSecureConnection(defaultProtocol);
            var defaultWs = isSSL ? "wss://" + gatewayURL : "ws://" + gatewayURL;
            var defaultHttp = isSSL ? "https://" + gatewayURL : "http://" + gatewayURL;
            if (glue42gd) {
                // GD3
                defaultProtocol = 3;
                defaultWs = glue42gd.gwURL;
            }
            return {
                ws: defaultWs,
                http: defaultHttp,
                protocolVersion: defaultProtocol,
                reconnectInterval: 1000
            };
        }
        function getDefaultApplicationName() {
            if (hc) {
                return hc.containerName + "." + hc.browserWindowName;
            }
            if (glue42gd) {
                return glue42gd.appName;
            }
            if (typeof window !== "undefined" && typeof document !== "undefined") {
                return (window.agm_application || document.title) + uid;
            }
            else {
                return "NodeJS" + uid;
            }
        }
        function getDefaultLogger() {
            return {
                publish: "off",
                console: "info",
                metrics: "off",
            };
        }
        return {
            application: getDefaultApplicationName(),
            metrics: getMetricsDefaults(),
            agm: {},
            gateway: getGatewayDefaults(),
            logger: getDefaultLogger(),
        };
    }
    function getConfigProp(prop1, prop2) {
        var masterConfigProp1 = masterConfig[prop1];
        var userProp1 = configuration[prop1];
        var dynamicDefaultsProp1 = dynamicDefaults[prop1];
        var hardDefaultsProp1 = hardDefaults[prop1];
        if (prop2) {
            if (masterConfigProp1 && masterConfigProp1[prop2] !== undefined) {
                return masterConfigProp1[prop2];
            }
            if (userProp1 && userProp1[prop2] !== undefined) {
                return userProp1[prop2];
            }
            if (dynamicDefaultsProp1 && dynamicDefaultsProp1[prop2] !== undefined) {
                return dynamicDefaultsProp1[prop2];
            }
            if (hardDefaultsProp1 && hardDefaultsProp1[prop2] !== undefined) {
                return hardDefaultsProp1[prop2];
            }
        }
        else {
            if (masterConfigProp1 !== undefined) {
                return masterConfigProp1;
            }
            if (userProp1 !== undefined) {
                return userProp1;
            }
            if (dynamicDefaultsProp1 !== undefined) {
                return dynamicDefaultsProp1;
            }
            if (hardDefaultsProp1 !== undefined) {
                return hardDefaultsProp1;
            }
        }
        return undefined;
    }
    function ifNotFalse(what, then) {
        if (typeof what === "boolean" && !what) {
            return undefined;
        }
        else {
            return then;
        }
    }
    return {
        identity: metricsIdentity,
        application: getApplication(),
        auth: getAuth(),
        logger: getLogger(),
        connection: getGateway(),
        metrics: getMetrics(),
        agm: getAgm(),
        version: ext.version || pjson.version,
        libs: ext.libs
    };
}
exports.default = default_1;
//# sourceMappingURL=config.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(11)))

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MessageReplayerImpl = /** @class */ (function () {
    function MessageReplayerImpl(specs) {
        this.specsNames = [];
        this.messages = {};
        this.subs = {};
        this.subsRefCount = {};
        this.specs = {};
        for (var _i = 0, specs_1 = specs; _i < specs_1.length; _i++) {
            var spec = specs_1[_i];
            this.specs[spec.name] = spec;
            this.specsNames.push(spec.name);
        }
    }
    MessageReplayerImpl.prototype.init = function (connection) {
        var _this = this;
        this.connection = connection;
        for (var _i = 0, _a = this.specsNames; _i < _a.length; _i++) {
            var name_1 = _a[_i];
            var _loop_1 = function (type) {
                var refCount = this_1.subsRefCount[type];
                if (!refCount) {
                    refCount = 0;
                }
                refCount += 1;
                this_1.subsRefCount[type] = refCount;
                if (refCount > 1) {
                    return "continue";
                }
                var sub = connection.on("glue-core", type, function (msg) { return _this.processMessage(type, msg); });
                this_1.subs[type] = sub;
            };
            var this_1 = this;
            for (var _b = 0, _c = this.specs[name_1].types; _b < _c.length; _b++) {
                var type = _c[_b];
                _loop_1(type);
            }
        }
    };
    MessageReplayerImpl.prototype.processMessage = function (type, msg) {
        if (this.isDone || !msg) {
            return;
        }
        for (var _i = 0, _a = this.specsNames; _i < _a.length; _i++) {
            var name_2 = _a[_i];
            if (this.specs[name_2].types.indexOf(type) !== -1) {
                var messages = this.messages[name_2] || [];
                this.messages[name_2] = messages;
                messages.push(msg);
            }
        }
    };
    MessageReplayerImpl.prototype.drain = function (name, callback) {
        if (callback) {
            (this.messages[name] || []).forEach(callback);
        }
        delete this.messages[name];
        for (var _i = 0, _a = this.specs[name].types; _i < _a.length; _i++) {
            var type = _a[_i];
            this.subsRefCount[type] -= 1;
            if (this.subsRefCount[type] <= 0) {
                this.connection.off(this.subs[type]);
                delete this.subs[type];
                delete this.subsRefCount[type];
            }
        }
        delete this.specs[name];
        if (!this.specs.length) {
            this.isDone = true;
        }
    };
    return MessageReplayerImpl;
}());
exports.MessageReplayerImpl = MessageReplayerImpl;
//# sourceMappingURL=MessageReplayer.js.map

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var connection_1 = __webpack_require__(12);
var MessageReplayer_1 = __webpack_require__(49);
var GW3ConnectionImpl = /** @class */ (function (_super) {
    __extends(GW3ConnectionImpl, _super);
    function GW3ConnectionImpl(settings) {
        var _this = _super.call(this, settings) || this;
        if (settings.replaySpecs &&
            settings.replaySpecs.length) {
            _this.replayer = new MessageReplayer_1.MessageReplayerImpl(settings.replaySpecs);
        }
        return _this;
    }
    GW3ConnectionImpl.prototype.init = function (transport, protocol) {
        _super.prototype.init.call(this, transport, protocol);
        if (this.replayer) {
            this.replayer.init(this);
        }
        this.gw3Protocol = protocol;
    };
    GW3ConnectionImpl.prototype.toAPI = function () {
        var that = this;
        var superAPI = _super.prototype.toAPI.call(this);
        return {
            domain: that.domain.bind(that),
            get peerId() { return that.peerId; },
            get token() { return that.token; },
            get info() { return that.info; },
            get resolvedIdentity() { return that.resolvedIdentity; },
            get availableDomains() { return that.availableDomains; },
            get gatewayToken() { return that.gatewayToken; },
            get replayer() { return that.replayer; },
            on: superAPI.on,
            send: superAPI.send,
            off: superAPI.off,
            login: superAPI.login,
            logout: superAPI.logout,
            loggedIn: superAPI.loggedIn,
            connected: superAPI.connected,
            disconnected: superAPI.disconnected,
            authToken: that.authToken.bind(that),
            get protocolVersion() { return superAPI.protocolVersion; },
        };
    };
    GW3ConnectionImpl.prototype.domain = function (domain, logger, successMessages, errorMessages) {
        return this.gw3Protocol.domain(domain, logger, successMessages, errorMessages);
    };
    GW3ConnectionImpl.prototype.authToken = function () {
        return this.gw3Protocol.authToken();
    };
    return GW3ConnectionImpl;
}(connection_1.default));
exports.default = GW3ConnectionImpl;
//# sourceMappingURL=gw3Connection.js.map

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
var connection_1 = __webpack_require__(12);
var gw3_1 = __webpack_require__(54);
var hc_1 = __webpack_require__(56);
var ws_1 = __webpack_require__(60);
var gw3Connection_1 = __webpack_require__(50);
var gw1_1 = __webpack_require__(52);
var hc_2 = __webpack_require__(57);
var gw2_1 = __webpack_require__(53);
var inproc_1 = __webpack_require__(59);
var http_1 = __webpack_require__(58);
/**
 * Check readme.md for detailed description
 */
exports.default = (function (settings) {
    settings = settings || {};
    settings.reconnectAttempts = settings.reconnectAttempts || 10;
    settings.reconnectInterval = settings.reconnectInterval || 500;
    var connection = new connection_1.default(settings);
    var logger = settings.logger;
    if (!logger) {
        throw new Error("please pass a logger object");
    }
    // by default use gw1 protocol and hc transport
    var protocol = new hc_1.default();
    var transport = new hc_2.default();
    var outsideHC = global.htmlContainer === undefined || settings.force;
    if (outsideHC) {
        if (settings.gw && settings.gw.facade && settings.gw.token && settings.protocolVersion === 3) {
            transport = new inproc_1.default(settings.gw.token, settings.gw.facade, logger.subLogger("inproc"));
        }
        else if (settings.ws !== undefined) {
            transport = new ws_1.default(settings, logger.subLogger("ws"));
        }
        else if (settings.http !== undefined) {
            transport = new http_1.default(settings, logger.subLogger("http"));
        }
        else {
            throw new Error("No connection information specified");
        }
        // if running in the browser - let's check which protocol version user wants
        if (settings.protocolVersion === 3) {
            var gw3Connection = new gw3Connection_1.default(settings);
            var gw3Port = gw3_1.default(gw3Connection, settings, logger.subLogger("gw3"));
            gw3Connection.init(transport, gw3Port);
            return gw3Connection.toAPI();
        }
        else if (settings.protocolVersion === 2) {
            protocol = new gw2_1.default(connection);
        }
        else {
            protocol = new gw1_1.default();
        }
    }
    connection.init(transport, protocol);
    return connection.toAPI();
});
//# sourceMappingURL=main.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Connection to gateway V1 - the one that runs on the desktop without authentication
 */
var GW1Protocol = /** @class */ (function () {
    function GW1Protocol() {
    }
    GW1Protocol.prototype.processStringMessage = function (message) {
        // GW1 messages have the following structure
        // {message: object, type: string}
        // so type is outside the message
        var messageObj = JSON.parse(message);
        return {
            msg: messageObj.message,
            msgType: messageObj.type,
        };
    };
    GW1Protocol.prototype.createStringMessage = function (product, type, message, id) {
        return JSON.stringify({
            type: type,
            message: message,
            id: id,
        });
    };
    GW1Protocol.prototype.login = function (message) {
        return Promise.resolve({ application: undefined });
    };
    GW1Protocol.prototype.logout = function () {
        // Do nothing
    };
    GW1Protocol.prototype.loggedIn = function (callback) {
        callback();
        return function () {
            // do nothing
        };
    };
    GW1Protocol.prototype.processObjectMessage = function (message) {
        throw new Error("not supported");
    };
    GW1Protocol.prototype.createObjectMessage = function (product, type, message, id) {
        throw new Error("not supported");
    };
    return GW1Protocol;
}());
exports.default = GW1Protocol;
//# sourceMappingURL=gw1.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)["Promise"]))

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var MESSAGE_LOGIN = "LOGIN";
var MESSAGE_LOGIN_RESPONSE = "LOGIN_RESPONSE";
var MESSAGE_LOGIN_TOKEN = "LOGIN_TOKEN";
var MESSAGE_LOGOUT = "LOGOUT";
var MESSAGE_SEND = "SEND";
// Connection to gateway V2 - gw1 +  authentication
var GW2Protocol = /** @class */ (function () {
    function GW2Protocol(connection) {
        this.connection = connection;
    }
    GW2Protocol.prototype.processStringMessage = function (message) {
        // GW2 messages have the following structure
        // {message: object, type: string}
        // so type is outside the message
        // This is the same protocol sa GW1 except for SEND messages :(
        // They have different structure because of authentication
        var messageObj = JSON.parse(message);
        if (messageObj.type === MESSAGE_SEND) {
            // GW2 introduces a new
            return {
                msg: messageObj.data.message,
                msgType: messageObj.data.type,
            };
        }
        return {
            msg: messageObj,
            msgType: messageObj.type,
        };
    };
    GW2Protocol.prototype.createStringMessage = function (product, type, message, id) {
        // GW2 message madness bellow
        // LOGIN and LOGOUT are kind of special
        if (type === MESSAGE_LOGIN) {
            return JSON.stringify(message);
        }
        if (type === MESSAGE_LOGOUT) {
            return JSON.stringify({ type: "LOGOUT" });
        }
        return JSON.stringify({
            type: MESSAGE_SEND,
            sessionCookie: this.sessionCookie,
            data: {
                type: type,
                message: message,
                id: id,
            },
        });
    };
    GW2Protocol.prototype.login = function (message) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request;
            if (message.token) {
                request = {
                    token: message.token,
                    type: MESSAGE_LOGIN_TOKEN,
                };
            }
            else if (message.username) {
                request = {
                    user: message.username,
                    password: message.password,
                    type: MESSAGE_LOGIN,
                };
            }
            else {
                throw new Error("Invalid auth message" + JSON.stringify(message));
            }
            var lrSubs = _this.connection.on("", MESSAGE_LOGIN_RESPONSE, function (response) {
                _this.connection.off(lrSubs);
                if (response && !response.errorMessage) {
                    _this.sessionCookie = response.sessionCookie;
                    resolve(response);
                }
                else {
                    reject(response);
                }
            });
            _this.connection.send("", "LOGIN", request);
        });
    };
    GW2Protocol.prototype.logout = function () {
        this.connection.send("", "LOGOUT", {});
    };
    GW2Protocol.prototype.loggedIn = function (callback) {
        callback();
        return function () {
            // do nothing
        };
    };
    GW2Protocol.prototype.processObjectMessage = function (message) {
        throw new Error("not supported");
    };
    GW2Protocol.prototype.createObjectMessage = function (product, type, message, id) {
        throw new Error("not supported");
    };
    return GW2Protocol;
}());
exports.default = GW2Protocol;
//# sourceMappingURL=gw2.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)["Promise"]))

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var gw3Domain_1 = __webpack_require__(55);
var callback_registry_1 = __webpack_require__(1);
function default_1(connection, settings, logger) {
    var datePrefix = "#T42_DATE#";
    var datePrefixLen = datePrefix.length;
    var dateMinLen = datePrefixLen + 1; // prefix + at least one char (1970/01/01 = 0)
    var datePrefixFirstChar = datePrefix[0];
    var registry = callback_registry_1.default();
    var globalDomain;
    /* Flag indicating if the user is currently logged in */
    var isLoggedIn = false;
    /*
     * If true(default) the user wants to be connected.
     * If the user explicitly calls logout this will become false.
     * This is used to determine if it should retry trying to login.
     */
    var shouldTryLogin = true;
    /* True only if this is the initial login attempt. */
    var initialLogin = true;
    var initialLoginAttempts = 3;
    var initialLoginAttemptsInterval = 500;
    var sessions = [];
    var loginConfig;
    connection.disconnected(handleDisconnected.bind(this));
    ping();
    function processStringMessage(message) {
        var msg = JSON.parse(message, function (key, value) {
            // check for date - we have custom protocol for dates
            if (typeof value !== "string") {
                return value;
            }
            if (value.length < dateMinLen) {
                return value;
            }
            if (value[0] !== datePrefixFirstChar) {
                return value;
            }
            if (value.substring(0, datePrefixLen) !== datePrefix) {
                return value;
            }
            try {
                var milliseconds = parseInt(value.substring(datePrefixLen, value.length), 10);
                if (isNaN(milliseconds)) {
                    return value;
                }
                return new Date(milliseconds);
            }
            catch (ex) {
                return value;
            }
        });
        return {
            msg: msg,
            msgType: msg.type,
        };
    }
    function createStringMessage(product, type, message, id) {
        var oldToJson = Date.prototype.toJSON;
        try {
            Date.prototype.toJSON = function () {
                return datePrefix + this.getTime();
            };
            var result = JSON.stringify(message);
            return result;
        }
        finally {
            Date.prototype.toJSON = oldToJson;
        }
    }
    function processObjectMessage(message) {
        if (!message.type) {
            throw new Error("Object should have type property");
        }
        return {
            msg: message,
            msgType: message.type,
        };
    }
    function createObjectMessage(product, type, message, id) {
        return message;
    }
    function login(config) {
        logger.debug("logging in...");
        loginConfig = config;
        if (!loginConfig) {
            // in case of no auth send empty username and password
            loginConfig = { username: "", password: "" };
        }
        shouldTryLogin = true;
        return new Promise(function (resolve, reject) {
            var authentication = {};
            connection.gatewayToken = config.gatewayToken;
            if (connection.gatewayToken) {
                authentication.method = "gateway-token";
                authentication.token = connection.gatewayToken;
            }
            else if (config.token) {
                authentication.method = "access-token";
                authentication.token = config.token;
            }
            else if (config.username) {
                authentication.method = "secret";
                authentication.login = config.username;
                authentication.secret = config.password;
            }
            else {
                throw new Error("invalid auth message" + JSON.stringify(config));
            }
            var helloMsg = {
                type: "hello",
                identity: settings.identity,
                authentication: authentication,
            };
            globalDomain = gw3Domain_1.default("global", connection, logger, [
                "welcome",
                "token"
            ]);
            var sendOptions = { skipPeerId: true };
            if (initialLogin) {
                sendOptions.retryInterval = settings.reconnectInterval;
                sendOptions.maxRetries = settings.reconnectAttempts;
            }
            globalDomain.send(helloMsg, undefined, sendOptions)
                .then(function (msg) {
                // we've logged in once - set this to false for the rest of the lifetime
                initialLogin = false;
                logger.debug("login successful with PeerId " + msg.peer_id);
                connection.peerId = msg.peer_id;
                connection.resolvedIdentity = msg.resolved_identity;
                connection.availableDomains = msg.available_domains;
                if (msg.options) {
                    connection.token = msg.options.access_token;
                    connection.info = msg.options.info;
                }
                setLoggedIn(true);
                resolve(msg.resolved_identity);
            })
                .catch(function (err) {
                logger.error("error sending hello message - " + err);
                reject(err);
            });
        });
    }
    function logout() {
        logger.debug("logging out...");
        shouldTryLogin = false;
        // go through all sessions and leave the corresponding domain
        sessions.forEach(function (session) {
            session.leave();
        });
    }
    function loggedIn(callback) {
        if (isLoggedIn) {
            callback();
        }
        return registry.add("onLoggedIn", callback);
    }
    function domain(domainName, domainLogger, successMessages, errorMessages) {
        var session = sessions.filter(function (s) { return s.domain === domainName; })[0];
        if (!session) {
            session = gw3Domain_1.default(domainName, connection, domainLogger, successMessages, errorMessages);
            sessions.push(session);
        }
        return session;
    }
    function handleDisconnected() {
        setLoggedIn(false);
        var tryToLogin = shouldTryLogin;
        if (tryToLogin && initialLogin) {
            if (initialLoginAttempts <= 0) {
                return;
            }
            initialLoginAttempts--;
        }
        logger.debug("disconnected - will try new login?" + shouldTryLogin);
        if (shouldTryLogin) {
            connection.login(loginConfig)
                .catch(function () {
                setTimeout(handleDisconnected, 1000);
            });
        }
    }
    function setLoggedIn(value) {
        isLoggedIn = value;
        if (isLoggedIn) {
            registry.execute("onLoggedIn");
        }
    }
    // ping the server every 30 sec
    function ping() {
        if (isLoggedIn) {
            connection.send("", "", { type: "ping" });
        }
        setTimeout(ping, 30 * 1000);
    }
    function authToken() {
        var createTokenReq = {
            type: "create-token"
        };
        return globalDomain.send(createTokenReq)
            .then(function (res) {
            return res.token;
        });
    }
    return {
        processStringMessage: processStringMessage,
        createStringMessage: createStringMessage,
        createObjectMessage: createObjectMessage,
        processObjectMessage: processObjectMessage,
        login: login,
        logout: logout,
        loggedIn: loggedIn,
        domain: domain,
        authToken: authToken,
    };
}
exports.default = default_1;
//# sourceMappingURL=gw3.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)["Promise"]))

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var callbackRegistry = __webpack_require__(1);
var shortid_1 = __webpack_require__(7);
/**
 * Handles domain session lifetime and events for a given connection/domain pair
 */
function default_1(domain, connection, logger, successMessages, errorMessages) {
    if (domain == null) {
        domain = "global";
    }
    var isJoined = false;
    var tryReconnecting = false;
    /** holds latest options passed to join - used when doing reconnects */
    var _latestOptions;
    // #deleteme TODO: verify this gets properly set to true
    var _connectionOn = false;
    var callbacks = callbackRegistry();
    // attach event handlers to connection
    connection.disconnected(handleConnectionDisconnected);
    connection.loggedIn(handleConnectionLoggedIn);
    connection.on(domain, "success", function (msg) { return handleSuccessMessage(msg); });
    connection.on(domain, "error", function (msg) { return handleErrorMessage(msg); });
    connection.on(domain, "result", function (msg) { return handleSuccessMessage(msg); });
    if (successMessages) {
        successMessages.forEach(function (sm) {
            connection.on(domain, sm, function (msg) { return handleSuccessMessage(msg); });
        });
    }
    if (errorMessages) {
        errorMessages.forEach(function (sm) {
            connection.on(domain, sm, function (msg) { return handleErrorMessage(msg); });
        });
    }
    var requestsMap = {};
    function join(options) {
        _latestOptions = options;
        return new Promise(function (resolve, reject) {
            if (isJoined) {
                resolve();
            }
            var joinPromise;
            if (domain === "global") {
                joinPromise = _connectionOn ? Promise.resolve({}) : Promise.reject("not connected to gateway");
            }
            else {
                logger.debug("joining " + domain);
                var joinMsg = {
                    type: "join",
                    destination: domain,
                    domain: "global",
                    options: options,
                };
                // #deleteme TODO: what happens if multiple clients try to open the same domain?
                // e.g. contexts
                joinPromise = send(joinMsg);
            }
            joinPromise
                .then(function () {
                handleJoined();
                resolve();
            })
                .catch(function (err) {
                logger.debug("error joining " + domain + " domain: " + JSON.stringify(err));
                reject(err);
            });
        });
    }
    // terminology: join vs leave (domain), connect vs login vs disconnect (to/from GW)
    function leave() {
        if (domain === "global") {
            return;
        }
        logger.debug("stopping session " + domain + "...");
        var leaveMsg = {
            type: "leave",
            destination: domain,
            domain: "global",
        };
        // #deleteme - handling
        send(leaveMsg).then(function () {
            isJoined = false;
            callbacks.execute("onLeft");
        });
    }
    function handleJoined() {
        logger.debug("joined " + domain);
        isJoined = true;
        var wasReconnect = tryReconnecting;
        tryReconnecting = false;
        callbacks.execute("onJoined", wasReconnect);
    }
    function handleConnectionDisconnected() {
        _connectionOn = false;
        logger.warn("connection is down");
        isJoined = false;
        tryReconnecting = true;
        callbacks.execute("onLeft", { disconnected: true });
    }
    function handleConnectionLoggedIn() {
        _connectionOn = true;
        if (tryReconnecting) {
            logger.info("connection is now up - trying to reconnect...");
            join(_latestOptions);
        }
    }
    function onJoined(callback) {
        if (isJoined) {
            callback(false);
        }
        return callbacks.add("onJoined", callback);
    }
    function onLeft(callback) {
        if (!isJoined) {
            callback();
        }
        return callbacks.add("onLeft", callback);
    }
    function handleErrorMessage(msg) {
        if (domain !== msg.domain) {
            return;
        }
        var requestId = msg.request_id;
        var entry = requestsMap[requestId];
        if (!entry) {
            return;
        }
        entry.error(msg);
    }
    function handleSuccessMessage(msg) {
        if (msg.domain !== domain) {
            return;
        }
        var requestId = msg.request_id;
        var entry = requestsMap[requestId];
        if (!entry) {
            return;
        }
        entry.success(msg);
    }
    function getNextRequestId() {
        return shortid_1.generate();
    }
    /**
     * Send a message
     * @param msg message to send
     * @param tag a custom object (tag) - it will be transferred to success/error callback
     * @param success
     * @param error
     */
    function send(msg, tag, options) {
        options = options || {};
        // Allows function caller to override request_id
        msg.request_id = msg.request_id || getNextRequestId();
        // Allows function caller to override domain (join/leave messages are in global domain)
        msg.domain = msg.domain || domain;
        if (!options.skipPeerId) {
            msg.peer_id = connection.peerId;
        }
        var requestId = msg.request_id;
        return new Promise(function (resolve, reject) {
            requestsMap[requestId] = {
                success: function (successMsg) {
                    delete requestsMap[requestId];
                    successMsg._tag = tag;
                    resolve(successMsg);
                },
                error: function (errorMsg) {
                    logger.warn("GW error - " + JSON.stringify(errorMsg) + " for request " + JSON.stringify(msg));
                    delete requestsMap[requestId];
                    errorMsg._tag = tag;
                    reject(errorMsg);
                },
            };
            connection
                .send(domain, domain, msg, undefined, options)
                .catch(function (err) {
                requestsMap[requestId].error({ err: err });
            });
        });
    }
    function sendFireAndForget(msg) {
        // Allows function caller to override request_id
        msg.request_id = msg.request_id ? msg.request_id : getNextRequestId();
        // Allows function caller to override domain (join/leave messages are in global domain)
        msg.domain = msg.domain || domain;
        msg.peer_id = connection.peerId;
        connection.send(domain, domain, msg);
    }
    return {
        join: join,
        leave: leave,
        onJoined: onJoined,
        onLeft: onLeft,
        send: send,
        sendFireAndForget: sendFireAndForget,
        on: function (type, callback) {
            connection.on(domain, type, callback);
        },
        loggedIn: function (callback) { return connection.loggedIn(callback); },
        connected: function (callback) { return connection.connected(callback); },
        disconnected: function (callback) { return connection.disconnected(callback); },
        get peerId() {
            return connection.peerId;
        },
        get domain() {
            return domain;
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=gw3Domain.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)["Promise"]))

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Connection to HC
 */
var HCProtocol = /** @class */ (function () {
    function HCProtocol() {
    }
    HCProtocol.prototype.processStringMessage = function (message) {
        var messageObj = JSON.parse(message);
        return {
            msg: messageObj,
            msgType: messageObj.type,
        };
    };
    HCProtocol.prototype.createStringMessage = function (product, type, message, id) {
        return JSON.stringify(message);
    };
    HCProtocol.prototype.login = function (message) {
        return Promise.resolve({ application: undefined });
    };
    HCProtocol.prototype.logout = function () {
        // Do nothing
    };
    HCProtocol.prototype.loggedIn = function (callback) {
        callback();
        return function () {
            // do nothing
        };
    };
    HCProtocol.prototype.processObjectMessage = function (message) {
        throw new Error("not supported");
    };
    HCProtocol.prototype.createObjectMessage = function (product, type, message, id) {
        throw new Error("not supported");
    };
    return HCProtocol;
}());
exports.default = HCProtocol;
//# sourceMappingURL=hc.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)["Promise"]))

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Connection to HtmlContainer
 */
var HCTransport = /** @class */ (function () {
    function HCTransport() {
        this.connectionId = Math.floor(1e10 * Math.random()).toString();
    }
    HCTransport.prototype.send = function (message, product, type) {
        if (product === "metrics") {
            global.htmlContainer.metricsFacade.send(type, message);
        }
        else if (product === "log") {
            global.htmlContainer.loggingFacade.send(type, message);
        }
        return Promise.resolve(undefined);
    };
    HCTransport.prototype.onConnectedChanged = function (callback) {
        // always connected;
        callback(true);
    };
    HCTransport.prototype.onMessage = function (callback) {
        // dummy implementation
        // hc transports are one way only
    };
    HCTransport.prototype.close = function () {
        // do nothing
    };
    HCTransport.prototype.open = function () {
        // do nothing
    };
    return HCTransport;
}());
exports.default = HCTransport;
//# sourceMappingURL=hc.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(0)["Promise"]))

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise, global) {
Object.defineProperty(exports, "__esModule", { value: true });
var callback_registry_1 = __webpack_require__(1);
var HTTPTransport = /** @class */ (function () {
    function HTTPTransport(settings, logger) {
        this.registry = callback_registry_1.default();
        this.url = settings.http;
        // polling interval in ms, default is 1 second
        this.interval = settings.httpInterval || 1000;
        this.logger = logger;
        this.logger.debug("Attempting connection to Gateway via HTTP with url " + this.url + " on interval " + this.interval + " ms");
    }
    HTTPTransport.prototype.close = function () {
        // Do nothing
    };
    HTTPTransport.prototype.open = function () {
        // do nothing
    };
    HTTPTransport.prototype.onConnectedChanged = function (callback) {
        callback(true);
    };
    HTTPTransport.prototype.onMessage = function (callback) {
        this.registry.add("onMessage", callback);
    };
    HTTPTransport.prototype.send = function (msg) {
        this.httpPost(this.url, msg);
        return Promise.resolve(undefined);
    };
    /**
     * Polls data from a given url on some interval
     * @param url       Base server url. A sequence url param may be added based on the seq param
     * @param interval  Interval (in ms) between polling requestts
     * @param seq       Next sequence number we should ask for (if 0 the server will return the last known message)
     * @param ondata    Data callback
     */
    HTTPTransport.prototype.poll = function (url, interval, seq, ondata) {
        var _this = this;
        // construct the get Url - if seq != 0 add as url param to get
        // only messages after this sequence
        var getUrl = url;
        if (seq !== 0) {
            getUrl = url + "?sequence=" + seq + "&no-cache=" + new Date().getTime();
        }
        // create a request
        var xmlhttp = this.createCORSRequest("GET", getUrl, function () {
            if (seq === 0) {
                _this.logger.debug("Connected to Gateway on " + url);
            }
            var message = JSON.parse(xmlhttp.responseText);
            // the server returns the number of the next sequence that we must query for
            var nextSeq = message.nextSequence;
            // call user callback
            ondata(message.data);
            // re-schedule
            setTimeout(function () {
                _this.poll(url, interval, nextSeq, ondata);
            }, _this.interval);
        });
        xmlhttp.onerror = function (ev) {
            // tslint:disable-next-line:no-console
            console.log("Error polling data from http server " + getUrl + " -  + " + ev);
            // re-schedule
            setTimeout(function () {
                _this.poll(url, interval, seq, ondata);
            }, _this.interval);
        };
        xmlhttp.send();
    };
    /**
     * POSTs a message to a given url
     */
    HTTPTransport.prototype.httpPost = function (url, message) {
        // create a request
        var xmlhttp = this.createCORSRequest("POST", url);
        xmlhttp.send(message);
    };
    /**
     * Creates CORS request (cross domain requests) for different browsers - XMLHttpRequest withCredentials
     * for Chrome and FF and XDomainRequest for IE
     */
    HTTPTransport.prototype.createCORSRequest = function (method, url, resultCallback) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // Check if the XMLHttpRequest object has a "withCredentials" property.
            // "withCredentials" only exists on XMLHTTPRequest2 objects.
            xhr.open(method, url, true);
            if (typeof resultCallback !== "undefined") {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        resultCallback();
                    }
                };
            }
        }
        else if (typeof global.XDomainRequest !== "undefined") {
            // Otherwise, check if XDomainRequest.
            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
            xhr = new global.XDomainRequest();
            xhr.open(method, url);
            if (typeof resultCallback !== "undefined") {
                xhr.onload = resultCallback;
            }
        }
        else {
            // Otherwise, CORS is not supported by the browser.
            xhr = null;
        }
        return xhr;
    };
    return HTTPTransport;
}());
exports.default = HTTPTransport;
//# sourceMappingURL=http.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)["Promise"], __webpack_require__(3)))

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var callback_registry_1 = __webpack_require__(1);
/**
 * Inproc transport for GW3
 */
var Inproc = /** @class */ (function () {
    function Inproc(token, gw, logger) {
        this.registry = callback_registry_1.default();
        this.gw = gw;
        this.gwToken = token;
        this.logger = logger;
        this.connectToken = this.gw.connect(this.gwToken, this.messageHandler.bind(this));
    }
    Object.defineProperty(Inproc.prototype, "isObjectBasedTransport", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Inproc.prototype.sendObject = function (msg) {
        this.logger.debug(JSON.stringify(msg));
        this.gw.send(this.connectToken, msg);
        return Promise.resolve(undefined);
    };
    Inproc.prototype.send = function (msg, product, type) {
        return Promise.reject("not supported");
    };
    Inproc.prototype.onMessage = function (callback) {
        return this.registry.add("onMessage", callback);
    };
    Inproc.prototype.onConnectedChanged = function (callback) {
        callback(true);
    };
    Inproc.prototype.close = function () {
        // DO NOTHING
    };
    Inproc.prototype.open = function () {
        // do nothing
    };
    Inproc.prototype.messageHandler = function (msg) {
        if (this.logger.consoleLevel() === "trace") {
            this.logger.debug(JSON.stringify(msg));
        }
        this.registry.execute("onMessage", msg);
    };
    return Inproc;
}());
exports.default = Inproc;
//# sourceMappingURL=inproc.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)["Promise"]))

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var callback_registry_1 = __webpack_require__(1);
var WebSocket = isNode() ? __webpack_require__(22) : global.WebSocket;
function isNode() {
    // Only Node.JS has a process variable that is of [[Class]] process
    try {
        return Object.prototype.toString.call(global.process) === "[object process]";
    }
    catch (e) {
        return false;
    }
}
var WS = /** @class */ (function () {
    function WS(settings, logger) {
        /**
         * If the flag is true the connection should keep trying to connect.
         * If false the user explicitly closed it and it should not reconnect
         */
        this._running = true;
        this._initied = false;
        this._registry = callback_registry_1.default();
        this._settings = settings;
        this._logger = logger;
    }
    WS.prototype.onMessage = function (callback) {
        return this._registry.add("onMessage", callback);
    };
    // Create a function for sending a message
    WS.prototype.send = function (msg, product, type, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            options = options || {};
            _this.waitForSocketConnection(function () {
                try {
                    _this._ws.send(msg);
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            }, reject, options.maxRetries, options.retryInterval);
        });
    };
    WS.prototype.open = function () {
        this._running = true;
    };
    WS.prototype.close = function () {
        this._running = false;
        this._ws.close();
    };
    WS.prototype.onConnectedChanged = function (callback) {
        return this._registry.add("onConnectedChanged", callback);
    };
    WS.prototype.initiateSocket = function () {
        var _this = this;
        this._logger.debug("initiating _ws to " + this._settings.ws + "...");
        this._ws = new WebSocket(this._settings.ws);
        this._ws.onerror = function (err) {
            _this.notifyStatusChanged(false, err);
        };
        this._ws.onclose = function () {
            _this._logger.debug("_ws closed");
            _this.notifyStatusChanged(false);
        };
        // Log on connection
        this._ws.onopen = function () {
            _this._logger.debug("_ws opened");
            _this.notifyStatusChanged(true);
        };
        // Attach handler
        this._ws.onmessage = function (message) {
            _this._registry.execute("onMessage", message.data);
        };
    };
    // Holds callback execution until socket connection is established.
    WS.prototype.waitForSocketConnection = function (callback, failed, retriesLeft, retryInterval) {
        var _this = this;
        if (!callback) {
            callback = function () { };
        }
        if (!failed) {
            failed = function () { };
        }
        if (retryInterval === undefined) {
            retryInterval = this._settings.reconnectInterval;
        }
        if (retriesLeft !== undefined) {
            if (retriesLeft === 0) {
                failed("wait for socket on " + this._settings.ws + " failed - no more retries left");
                return;
            }
            this._logger.debug("will retry " + retriesLeft + " more times (every " + retryInterval + " ms)");
        }
        // check if we're still running
        if (!this._running) {
            failed("wait for socket on " + this._settings.ws + " failed - socket closed by user");
            return;
        }
        if (!this._ws || this._ws.readyState > 1) {
            // > 1 means closing or closed
            this.initiateSocket();
        }
        else if (this._ws.readyState === 1) {
            return callback();
        }
        setTimeout(function () {
            var retries = retriesLeft === undefined ? undefined : retriesLeft - 1;
            _this.waitForSocketConnection(callback, failed, retries, retryInterval);
        }, retryInterval); // wait X milliseconds for the connection...
    };
    WS.prototype.notifyStatusChanged = function (status, reason) {
        this._registry.execute("onConnectedChanged", status, reason);
    };
    return WS;
}());
exports.default = WS;
//# sourceMappingURL=ws.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(0)["Promise"]))

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var connection = {
    protocolVersion: -1,
    send: function (product, type, message, id, options) {
        return Promise.resolve(undefined);
    },
    on: function (product, type, messageHandler) {
        return { type: "1", id: 1 };
    },
    off: function (info) {
    },
    login: function (message) {
        return undefined;
    },
    logout: function () {
    },
    loggedIn: function (callback) {
        return undefined;
    },
    connected: function (callback) {
        return undefined;
    },
    disconnected: function (callback) {
        return undefined;
    },
};
exports.default = connection;
//# sourceMappingURL=dummyConnection.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)["Promise"]))

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel = /** @class */ (function () {
    function LogLevel() {
    }
    LogLevel.canPublish = function (level, restriction) {
        var levelIdx = LogLevel.order.indexOf(level);
        var restrictionIdx = LogLevel.order.indexOf(restriction);
        return levelIdx >= restrictionIdx;
    };
    LogLevel.off = "off";
    LogLevel.trace = "trace";
    LogLevel.debug = "debug";
    LogLevel.info = "info";
    LogLevel.warn = "warn";
    LogLevel.error = "error";
    LogLevel.order = [LogLevel.trace, LogLevel.debug, LogLevel.info, LogLevel.warn, LogLevel.error, LogLevel.off];
    return LogLevel;
}());
exports.default = LogLevel;
//# sourceMappingURL=levels.js.map

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var levels_1 = __webpack_require__(62);
var LoggerImpl = /** @class */ (function () {
    function LoggerImpl(name, parent, metricSystem) {
        this._subloggers = [];
        this._name = name;
        this._parent = parent;
        if (parent) {
            this._path = parent.path + "." + name;
        }
        else {
            this._path = name;
        }
        this._loggerFullName = "[" + this._path + "]";
        // create metric system
        if (typeof metricSystem !== "undefined") {
            this.metricsLevel("warn", metricSystem.subSystem(name));
        }
    }
    Object.defineProperty(LoggerImpl.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoggerImpl.prototype, "path", {
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    LoggerImpl.prototype.subLogger = function (name) {
        // Check if the sublogger is already created
        var existingSub = this._subloggers.filter(function (subLogger) {
            return subLogger.name === name;
        })[0];
        if (existingSub !== undefined) {
            return existingSub;
        }
        // Check if the name isn't the same as one of the parent properties
        Object.keys(this).forEach(function (key) {
            if (key === name) {
                throw new Error("This sub logger name is not allowed.");
            }
        });
        var sub = new LoggerImpl(name, this);
        // add sublogger to subloggers array
        this._subloggers.push(sub);
        return sub;
    };
    LoggerImpl.prototype.publishLevel = function (level) {
        if (level !== null && level !== undefined) {
            this._publishLevel = level;
        }
        return this._publishLevel || this._parent.publishLevel();
    };
    LoggerImpl.prototype.consoleLevel = function (level) {
        if (level !== null && level !== undefined) {
            this._consoleLevel = level;
        }
        return this._consoleLevel || this._parent.consoleLevel();
    };
    LoggerImpl.prototype.metricsLevel = function (level, metricsSystem) {
        if (level !== null && level !== undefined) {
            this._metricLevel = level;
        }
        if (metricsSystem !== undefined) {
            if (typeof metricsSystem === "object" && typeof metricsSystem.objectMetric === "function") {
                this._metricSystem = metricsSystem;
            }
            else {
                throw new Error("Please specify metric system");
            }
        }
        return this._metricLevel || this._parent.metricsLevel();
    };
    LoggerImpl.prototype.log = function (message, level) {
        this.publishMessage(level || levels_1.default.info, message);
    };
    LoggerImpl.prototype.trace = function (message) {
        this.log(message, levels_1.default.trace);
    };
    LoggerImpl.prototype.debug = function (message) {
        this.log(message, levels_1.default.debug);
    };
    LoggerImpl.prototype.info = function (message) {
        this.log(message, levels_1.default.info);
    };
    LoggerImpl.prototype.warn = function (message) {
        this.log(message, levels_1.default.warn);
    };
    LoggerImpl.prototype.error = function (message) {
        this.log(message, levels_1.default.error);
    };
    LoggerImpl.prototype.toAPIObject = function () {
        var that = this;
        return {
            name: this.name,
            subLogger: this.subLogger.bind(that),
            publishLevel: this.publishLevel.bind(that),
            consoleLevel: this.consoleLevel.bind(that),
            metricsLevel: this.metricsLevel.bind(that),
            log: this.log.bind(that),
            trace: this.trace.bind(that),
            debug: this.debug.bind(that),
            info: this.info.bind(that),
            warn: this.warn.bind(that),
            error: this.error.bind(that),
        };
    };
    LoggerImpl.prototype.publishMessage = function (level, message) {
        // Retrieve logger name and levels
        var loggerName = this._loggerFullName;
        // Add stack trace if the message is an error
        if (level === levels_1.default.error) {
            var e = new Error();
            if (e.stack) {
                message = message + "\n" +
                    (e.stack.split("\n").slice(3).join("\n"));
            }
        }
        // Publish in console
        if (levels_1.default.canPublish(level, this.consoleLevel())) {
            var toPrint = loggerName + ": " + message;
            switch (level) {
                case levels_1.default.trace:
                    // tslint:disable-next-line:no-console
                    console.trace(toPrint);
                    break;
                case levels_1.default.debug:
                    if (console.debug) {
                        // tslint:disable-next-line:no-console
                        console.debug(toPrint);
                    }
                    else {
                        // tslint:disable-next-line:no-console
                        console.log(toPrint);
                    }
                    break;
                case levels_1.default.info:
                    // tslint:disable-next-line:no-console
                    console.info(toPrint);
                    break;
                case levels_1.default.warn:
                    // tslint:disable-next-line:no-console
                    console.warn(toPrint);
                    break;
                case levels_1.default.error:
                    // tslint:disable-next-line:no-console
                    console.error(toPrint);
                    break;
            }
        }
        // Publish in file
        if (levels_1.default.canPublish(level, this.publishLevel())) {
            LoggerImpl.GetConnection().send("log", "LogMessage", {
                instance: LoggerImpl.Instance,
                level: levels_1.default.order.indexOf(level),
                logger: loggerName,
                message: message,
            });
        }
        // Publish in metrics
        if (levels_1.default.canPublish(level, this.metricsLevel())) {
            if (this._metricSystem !== undefined) {
                this._metricSystem.objectMetric("LogMessage", {
                    Level: level,
                    Logger: loggerName,
                    Message: message,
                    Time: new Date(),
                });
                if (level === levels_1.default.error) {
                    this._metricSystem.setState(100, message);
                }
            }
        }
    };
    return LoggerImpl;
}());
exports.default = LoggerImpl;
//# sourceMappingURL=logger.js.map

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(63);
exports.default = (function (settings) {
    // Convert instance to string, throw exceptions if it is not full
    var identity = settings.identity;
    if (!identity) {
        throw new Error("identity is missing");
    }
    var identityStr = identity.system + "\\" + identity.service + "\\" + identity.instance;
    logger_1.default.Instance = identityStr;
    logger_1.default.GetConnection = settings.getConnection;
    var mainLogger = new logger_1.default("main");
    mainLogger.publishLevel(settings.publish || "off");
    mainLogger.consoleLevel(settings.console || "info");
    mainLogger.metricsLevel(settings.metrics || "off");
    var apiLogger = mainLogger.toAPIObject();
    return apiLogger;
});
//# sourceMappingURL=main.js.map

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var glue_1 = __webpack_require__(13);
if (typeof window !== "undefined") {
    window.GlueCore = glue_1.default;
}
// add default library for ES6 modules
glue_1.default.default = glue_1.default;
module.exports = glue_1.default;
//# sourceMappingURL=main.js.map

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(4);
var metric_types_1 = __webpack_require__(2);
function addressMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || "";
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var system = parent;
    var repo = parent.repo;
    var conflation = definition.conflation;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.ADDRESS;
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
        // NOTE: Optionally return the updated metric here.
    }
    function getValueType() {
        return undefined;
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        type: type,
        conflation: conflation,
        get value() {
            return _value;
        },
        get path() {
            return _path;
        },
        update: update,
        getValueType: getValueType,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = addressMetric;
//# sourceMappingURL=address.js.map

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(4);
var metric_types_1 = __webpack_require__(2);
function countMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || 0;
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.COUNT;
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
        // NOTE: Optionally return the updated metric here.
    }
    function getValueType() {
        return undefined;
    }
    function incrementBy(num) {
        update(_value + num);
    }
    function increment() {
        incrementBy(1);
    }
    function decrement() {
        incrementBy(-1);
    }
    function decrementBy(num) {
        incrementBy(num * -1);
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        type: type,
        conflation: conflation,
        get path() {
            return _path;
        },
        get value() {
            return _value;
        },
        update: update,
        getValueType: getValueType,
        incrementBy: incrementBy,
        increment: increment,
        decrement: decrement,
        decrementBy: decrementBy,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = countMetric;
//# sourceMappingURL=count.js.map

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(4);
var metric_types_1 = __webpack_require__(2);
function numberMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _path = parent.path.slice(0);
    var _value = value || 0;
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.NUMBER;
    _path.push(parent.name);
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
        // NOTE: Optionally return the updated metric here.
    }
    function getValueType() {
        return undefined;
    }
    function incrementBy(num) {
        update(_value + num);
    }
    function increment() {
        incrementBy(1);
    }
    function decrement() {
        incrementBy(-1);
    }
    function decrementBy(num) {
        incrementBy(num * -1);
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        conflation: conflation,
        get value() {
            return _value;
        },
        type: type,
        get path() {
            return _path;
        },
        update: update,
        getValueType: getValueType,
        incrementBy: incrementBy,
        increment: increment,
        decrement: decrement,
        decrementBy: decrementBy,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = numberMetric;
//# sourceMappingURL=number.js.map

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metric_types_1 = __webpack_require__(2);
var helpers_1 = __webpack_require__(4);
function objectMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || "";
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.OBJECT;
    function update(newValue) {
        mergeValues(newValue);
        _transport.updateMetric(me);
        // NOTE: Optionally return the updated metric here.
    }
    function getValueType() {
        return undefined;
    }
    function mergeValues(values) {
        return Object.keys(_value).forEach(function (k) {
            if (typeof values[k] !== "undefined") {
                _value[k] = values[k];
            }
        });
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        type: type,
        conflation: conflation,
        get value() {
            return _value;
        },
        get path() {
            return _path;
        },
        update: update,
        getValueType: getValueType,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = objectMetric;
//# sourceMappingURL=object.js.map

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(4);
var metric_types_1 = __webpack_require__(2);
function rateMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || "";
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.RATE;
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
        // NOTE: Optionally return the updated metric here.
    }
    function getValueType() {
        return undefined;
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        type: type,
        conflation: conflation,
        get value() {
            return _value;
        },
        get path() {
            return _path;
        },
        update: update,
        getValueType: getValueType,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = rateMetric;
//# sourceMappingURL=rate.js.map

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(4);
var metric_types_1 = __webpack_require__(2);
function statisticsMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || "";
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.STATISTICS;
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
        // NOTE: Optionally return the updated metric here.
    }
    function getValueType() {
        return undefined;
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        type: type,
        conflation: conflation,
        get value() {
            return _value;
        },
        get path() {
            return _path;
        },
        update: update,
        getValueType: getValueType,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = statisticsMetric;
//# sourceMappingURL=statistics.js.map

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(4);
var metric_types_1 = __webpack_require__(2);
function stringMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || "";
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.STRING;
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
        // NOTE: Optionally return the updated metric here.
    }
    function getValueType() {
        return undefined;
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        conflation: conflation,
        get value() {
            return _value;
        },
        get path() {
            return _path;
        },
        type: type,
        update: update,
        getValueType: getValueType,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = stringMetric;
//# sourceMappingURL=string.js.map

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(4);
var metric_types_1 = __webpack_require__(2);
function timespanMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || "";
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.TIMESPAN;
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
        // NOTE: Optionally return the updated metric here.
    }
    function start() {
        update(true);
    }
    function stop() {
        update(false);
    }
    function getValueType() {
        return undefined;
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        type: type,
        conflation: conflation,
        get value() {
            return _value;
        },
        get path() {
            return _path;
        },
        update: update,
        start: start,
        stop: stop,
        getValueType: getValueType,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = timespanMetric;
//# sourceMappingURL=timespan.js.map

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(4);
var metric_types_1 = __webpack_require__(2);
function timestampMetric(definition, parent, transport, value) {
    helpers_1.default.validate(definition, parent, transport);
    var _transport = transport;
    var _value = value || "";
    var _path = parent.path.slice(0);
    _path.push(parent.name);
    var name = definition.name;
    var description = definition.description;
    var period = definition.period;
    var resolution = definition.resolution;
    var conflation = definition.conflation;
    var system = parent;
    var repo = parent.repo;
    var id = parent.path + "/" + name;
    var type = metric_types_1.default.TIMESTAMP;
    function update(newValue) {
        _value = newValue;
        _transport.updateMetric(me);
        // NOTE: Optionally return the updated metric here.
    }
    function now() {
        update(new Date());
    }
    function getValueType() {
        return undefined;
    }
    var me = {
        name: name,
        description: description,
        period: period,
        resolution: resolution,
        system: system,
        repo: repo,
        id: id,
        type: type,
        conflation: conflation,
        get value() {
            return _value;
        },
        get path() {
            return _path;
        },
        update: update,
        now: now,
        getValueType: getValueType,
    };
    _transport.createMetric(me);
    return me;
}
exports.default = timestampMetric;
//# sourceMappingURL=timestamp.js.map

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var serializer_1 = __webpack_require__(76);
function default_1(connection, config) {
    var DEFAULT_HEARTBEAT_INTERVAL = 3000;
    if (!connection || typeof connection !== "object") {
        throw new Error("Connection is required parameter");
    }
    var _connection = connection;
    var heartbeatInterval = config.heartbeatInterval || DEFAULT_HEARTBEAT_INTERVAL;
    var send = function (type, message) {
        _connection.send("metrics", type, message);
    };
    function sendFull(repo) {
        if (!repo.root) {
            return;
        }
        if (repo.root.subSystems.length === 0) {
            return;
        }
        sendFullSystem(repo.root);
    }
    function sendFullSystem(system) {
        createSystem(system);
        system.subSystems.forEach(function (sub) {
            sendFullSystem(sub);
        });
        system.metrics.forEach(function (metric) {
            createMetric(metric);
        });
    }
    function heartbeat(repo) {
        send("HeartbeatMetrics", {
            publishingInterval: heartbeatInterval,
            instance: repo.instance,
        });
    }
    function createSystem(system) {
        if (system.parent !== undefined) {
            send("CreateMetricSystem", {
                id: system.id,
                instance: system.repo.instance,
                definition: {
                    name: system.name,
                    description: system.description,
                    path: system.path,
                },
            });
        }
    }
    function updateSystem(system, state) {
        send("UpdateMetricSystem", {
            id: system.id,
            instance: system.repo.instance,
            state: state,
        });
    }
    function createMetric(metric) {
        send("CreateMetric", serializer_1.default(metric));
    }
    function updateMetric(metric) {
        send("UpdateMetric", serializer_1.default(metric));
    }
    function init(repo) {
        heartbeat(repo);
        _connection.on("metrics", "MetricsSnapshotRequest", function (instanceInfo) {
            if (instanceInfo.Instance !== repo.instance) {
                return;
            }
            sendFull(repo);
        });
        if (typeof window !== "undefined" && typeof window.htmlContainer === "undefined") {
            setInterval(function () {
                heartbeat(repo);
            }, heartbeatInterval);
        }
    }
    var me = {
        createSystem: createSystem,
        updateSystem: updateSystem,
        createMetric: createMetric,
        updateMetric: updateMetric,
        init: init,
    };
    return me;
}
exports.default = default_1;
//# sourceMappingURL=gw1.js.map

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metric_types_1 = __webpack_require__(2);
function metricToMessage(metric) {
    var definition = getMetricDefinition(metric.name, metric.value, metric.path, metric.type, metric.description, metric.period, metric.resolution, metric.conflation);
    function getMetricDefinition(name, value, path, type, description, period, resolution, conflation) {
        var _definition = {
            name: name,
            description: description,
            type: type ? type : getTypeFromValue(value),
            path: path,
            resolution: resolution,
            period: period,
            conflation: conflation,
        };
        if (_definition.type === metric_types_1.default.OBJECT) {
            _definition.Composite = Object.keys(value).reduce(function (arr, key) {
                var val = value[key];
                arr.push(getMetricDefinition(key, val, path));
                return arr;
            }, []);
        }
        return _definition;
    }
    function serializeValue(value, _metric) {
        if (value && value.constructor === Date) {
            return {
                value: {
                    type: _valueTypes.indexOf("date"),
                    value: value.valueOf(),
                    isArray: false,
                },
            };
        }
        if (typeof value === "object") {
            return {
                CompositeValue: Object.keys(value).reduce(function (arr, key) {
                    var val = serializeValue(value[key]);
                    val.InnerMetricName = key;
                    arr.push(val);
                    return arr;
                }, []),
            };
        }
        var valueType = _metric ? _metric.getValueType() : undefined;
        valueType = valueType || _valueTypes.indexOf(typeof value);
        return {
            value: {
                type: valueType,
                value: value,
                isArray: false,
            },
        };
    }
    function getTypeFromValue(value) {
        var typeAsString = value.constructor === Date ? "timestamp" : typeof value;
        switch (typeAsString) {
            case "string":
                return metric_types_1.default.STRING;
            case "number":
                return metric_types_1.default.NUMBER;
            case "timestamp":
                return metric_types_1.default.TIMESTAMP;
            case "object":
                return metric_types_1.default.OBJECT;
        }
        return 0;
    }
    var _valueTypes = [
        "boolean",
        "int",
        "number",
        "long",
        "string",
        "date",
        "object",
    ];
    return {
        id: metric.id,
        instance: metric.repo.instance,
        definition: definition,
        value: serializeValue(metric.value, metric),
    };
}
exports.default = metricToMessage;
//# sourceMappingURL=serializer.js.map

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var serializer_1 = __webpack_require__(78);
function default_1(connection, config) {
    if (!connection || typeof connection !== "object") {
        throw new Error("Connection is required parameter");
    }
    var joinPromise;
    var session;
    var init = function (repo) {
        var resolveReadyPromise;
        joinPromise = new Promise(function (resolve) {
            resolveReadyPromise = resolve;
        });
        session = connection.domain("metrics", config.logger);
        session.onJoined(function (reconnect) {
            if (!reconnect) {
                resolveReadyPromise();
                resolveReadyPromise = undefined;
            }
            // Creating root state metric
            var rootStateMetric = {
                name: "/State",
                type: "object",
                composite: {
                    Description: {
                        type: "string",
                        description: "",
                    },
                    Value: {
                        type: "number",
                        description: "",
                    },
                },
                description: "System state",
                context: {},
            };
            var defineRootMetricsMsg = {
                type: "define",
                metrics: [rootStateMetric],
            };
            session.send(defineRootMetricsMsg);
            if (reconnect) {
                replayRepo(repo);
            }
        });
        session.join(config.identity);
    };
    var replayRepo = function (repo) {
        replaySystem(repo.root);
    };
    var replaySystem = function (system) {
        // replay system
        createSystem(system);
        // replay all metrics in the system
        system.metrics.forEach(function (m) {
            createMetric(m);
        });
        // replay all sub-systems
        system.subSystems.forEach(function (ss) {
            replaySystem(ss);
        });
    };
    var createSystem = function (system) {
        if (system.parent === undefined) {
            return;
        }
        joinPromise.then(function () {
            var metric = {
                name: serializer_1.normalizeMetricName(system.path.join("/") + "/" + system.name + "/State"),
                type: "object",
                composite: {
                    Description: {
                        type: "string",
                        description: "",
                    },
                    Value: {
                        type: "number",
                        description: "",
                    },
                },
                description: "System state",
                context: {},
            };
            var createMetricsMsg = {
                type: "define",
                metrics: [metric],
            };
            session.send(createMetricsMsg);
        });
    };
    var updateSystem = function (system, state) {
        joinPromise.then(function () {
            var shadowedUpdateMetric = {
                type: "publish",
                values: [{
                        name: serializer_1.normalizeMetricName(system.path.join("/") + "/" + system.name + "/State"),
                        value: {
                            Description: state.description,
                            Value: state.state,
                        },
                        timestamp: Date.now(),
                    }],
            };
            session.send(shadowedUpdateMetric);
            var stateObj = serializer_1.composeMsgForRootStateMetric(system);
            var rootMetric = {
                type: "publish",
                peer_id: connection.peerId,
                values: [{
                        name: "/State",
                        value: {
                            Description: stateObj.description,
                            Value: stateObj.value,
                        },
                        timestamp: Date.now(),
                    }],
            };
            session.send(rootMetric);
        });
    };
    var createMetric = function (metric) {
        joinPromise.then(function () {
            var m = serializer_1.serializeMetric(metric);
            var createMetricsMsg = {
                type: "define",
                metrics: [m],
            };
            session.send(createMetricsMsg);
            if (typeof metric.value !== "undefined") {
                updateMetric(metric);
            }
        });
    };
    var updateMetric = function (metric) {
        joinPromise.then(function () {
            var value = serializer_1.getMetricValueByType(metric);
            var publishMetricsMsg = {
                type: "publish",
                values: [{
                        name: serializer_1.normalizeMetricName(metric.path.join("/") + "/" + metric.name),
                        value: value,
                        timestamp: Date.now(),
                    }],
            };
            session.send(publishMetricsMsg);
        });
    };
    return {
        init: init,
        createSystem: createSystem,
        updateSystem: updateSystem,
        createMetric: createMetric,
        updateMetric: updateMetric,
    };
}
exports.default = default_1;
//# sourceMappingURL=gw3.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)["Promise"]))

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metric_types_1 = __webpack_require__(2);
function getMetricTypeByValue(metric) {
    if (metric.value.constructor === Date || metric.type === metric_types_1.default.TIMESPAN || metric.type === metric_types_1.default.TIMESTAMP) {
        return "timestamp";
    }
    else if (typeof metric.value === "number") {
        return "number";
    }
    else if (typeof metric.value === "string" || metric.type === metric_types_1.default.RATE) {
        return "string";
    }
    else if (typeof metric.value === "object") {
        return "object";
    }
}
function getTypeByValue(value) {
    if (value.constructor === Date) {
        return "timestamp";
    }
    else if (typeof value === "number") {
        return "number";
    }
    else if (typeof value === "string") {
        return "string";
    }
    else if (typeof value === "object") {
        return "object";
    }
    else {
        return "string";
    }
}
function serializeMetric(metric) {
    var serializedMetrics = {};
    var type = getMetricTypeByValue(metric);
    if (type === "object") {
        var values = Object.keys(metric.value).reduce(function (memo, key) {
            var innerType = getTypeByValue(metric.value[key]);
            if (innerType === "object") {
                var composite = defineNestedComposite(metric.value[key]);
                memo[key] = {
                    type: "object",
                    description: "",
                    context: {},
                    composite: composite,
                };
            }
            else {
                memo[key] = {
                    type: innerType,
                    description: "",
                    context: {},
                };
            }
            return memo;
        }, {});
        serializedMetrics.composite = values;
    }
    serializedMetrics.name = normalizeMetricName(metric.path.join("/") + "/" + metric.name);
    serializedMetrics.type = type;
    serializedMetrics.description = metric.description;
    serializedMetrics.context = {};
    return serializedMetrics;
}
exports.serializeMetric = serializeMetric;
function defineNestedComposite(values) {
    return Object.keys(values).reduce(function (memo, key) {
        var type = getTypeByValue(values[key]);
        if (type === "object") {
            memo[key] = {
                type: "object",
                description: "",
                context: {},
                composite: defineNestedComposite(values[key]),
            };
        }
        else {
            memo[key] = {
                type: type,
                description: "",
                context: {},
            };
        }
        return memo;
    }, {});
}
function normalizeMetricName(name) {
    if (typeof name !== "undefined" && name.length > 0 && name[0] !== "/") {
        return "/" + name;
    }
    else {
        return name;
    }
}
exports.normalizeMetricName = normalizeMetricName;
function getMetricValueByType(metric) {
    var type = getMetricTypeByValue(metric);
    if (type === "timestamp") {
        return Date.now();
    }
    else {
        return publishNestedComposite(metric.value);
    }
}
exports.getMetricValueByType = getMetricValueByType;
function publishNestedComposite(values) {
    if (typeof values !== "object") {
        return values;
    }
    return Object.keys(values).reduce(function (memo, key) {
        var value = values[key];
        if (typeof value === "object" && value.constructor !== Date) {
            memo[key] = publishNestedComposite(value);
        }
        else if (value.constructor === Date) {
            memo[key] = new Date(value).getTime();
        }
        else if (value.constructor === Boolean) {
            memo[key] = value.toString();
        }
        else {
            memo[key] = value;
        }
        return memo;
    }, {});
}
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
function getHighestState(arr) {
    return arr.sort(function (a, b) {
        return b.state - a.state;
    })[0];
}
function aggregateDescription(arr) {
    var msg = "";
    arr.forEach(function (m, idx, a) {
        var path = m.path.join(".");
        if (idx === a.length - 1) {
            msg += path + "." + m.name + ": " + m.description;
        }
        else {
            msg += path + "." + m.name + ": " + m.description + ",";
        }
    });
    if (msg.length > 100) {
        return msg.slice(0, 100) + "...";
    }
    else {
        return msg;
    }
}
function composeMsgForRootStateMetric(system) {
    var aggregatedState = system.root.getAggregateState();
    var merged = flatten(aggregatedState);
    var highestState = getHighestState(merged);
    var aggregateDesc = aggregateDescription(merged);
    return {
        description: aggregateDesc,
        value: highestState.state,
    };
}
exports.composeMsgForRootStateMetric = composeMsgForRootStateMetric;
//# sourceMappingURL=serializer.js.map

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gw1_1 = __webpack_require__(75);
var gw3_1 = __webpack_require__(77);
var repository_1 = __webpack_require__(80);
exports.default = (function (settings) {
    var options = {
        connection: settings.connection,
        identity: settings.identity,
        logger: settings.logger,
        heartbeatInterval: settings.heartbeatInterval,
        settings: {},
        clickStream: settings.clickStream,
    };
    if (!options.connection || typeof options.connection !== "object") {
        throw new Error("Connection is required parameter");
    }
    var _protocol;
    if (options.connection.protocolVersion === 3) {
        _protocol = gw3_1.default(options.connection, settings);
    }
    else {
        _protocol = gw1_1.default(options.connection, settings);
    }
    var repo = repository_1.default(options, _protocol);
    var rootSystem = repo.root;
    return rootSystem; // System
});
//# sourceMappingURL=main.js.map

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var system_1 = __webpack_require__(81);
function repository(options, protocol) {
    if (!options.identity) {
        throw new Error("Identity missing from metrics configuration");
    }
    if (!options.identity.service || typeof options.identity.service !== "string") {
        throw new Error("Service missing or invalid in metrics identity configuration");
    }
    if (!options.identity.system || typeof options.identity.system !== "string") {
        throw new Error("System missing or invalid in metrics identity configuration");
    }
    if (!options.identity.instance || typeof options.identity.instance !== "string") {
        throw new Error("Instance missing or invalid in metrics identity configuration");
    }
    var identity = options.identity;
    var instance = options.identity.system + "/" + options.identity.service + "/" + options.identity.instance;
    function _initSystemMetrics(rootSystem, useClickStream) {
        // Create some system metrics
        if (typeof navigator !== "undefined") {
            rootSystem.stringMetric("UserAgent", navigator.userAgent);
        }
        if (useClickStream && typeof document !== "undefined") {
            var clickStream_1 = rootSystem.subSystem("ClickStream");
            var documentClickHandler = function (e) {
                if (!e.target) {
                    return;
                }
                var target = e.target;
                clickStream_1.objectMetric("LastBrowserEvent", {
                    type: "click",
                    timestamp: new Date(),
                    target: {
                        className: e.target ? target.className : "",
                        id: target.id,
                        type: "<" + target.tagName.toLowerCase() + ">",
                        href: target.href || "",
                    },
                });
            };
            // Create click stream record
            clickStream_1.objectMetric("Page", {
                title: document.title,
                page: window.location.href,
            });
            if (document.addEventListener) {
                document.addEventListener("click", documentClickHandler);
            }
            else {
                // For IE versions prior to IE9, attachEvent method should be used to register the specified listener
                // to the EventTarget it is called on, for others addEventListener should be used.
                // (<any>document)
                document.attachEvent("onclick", documentClickHandler);
            }
        }
        var startTime = rootSystem.stringMetric("StartTime", (new Date()).toString());
        var urlMetric = rootSystem.stringMetric("StartURL", "");
        var appNameMetric = rootSystem.stringMetric("AppName", "");
        if (typeof window !== "undefined") {
            if (typeof window.location !== "undefined") {
                var startUrl = window.location.href;
                urlMetric.update(startUrl);
            }
            var windowAsAny = window;
            if (typeof windowAsAny.glue42gd !== "undefined") {
                appNameMetric.update(windowAsAny.glue42gd.appName);
            }
        }
    }
    var me = {
        identity: identity,
        instance: instance,
        get root() {
            return _root;
        },
    };
    protocol.init(me);
    var _root = system_1.default("", me, protocol);
    _initSystemMetrics(_root, options.clickStream || options.clickStream === undefined);
    return me;
}
exports.default = repository;
//# sourceMappingURL=repository.js.map

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var address_1 = __webpack_require__(66);
var count_1 = __webpack_require__(67);
var number_1 = __webpack_require__(68);
var object_1 = __webpack_require__(69);
var rate_1 = __webpack_require__(70);
var statistics_1 = __webpack_require__(71);
var string_1 = __webpack_require__(72);
var timespan_1 = __webpack_require__(73);
var timestamp_1 = __webpack_require__(74);
var metric_types_1 = __webpack_require__(2);
function system(name, repo, protocol, parent, description) {
    // Validation
    // if (!name) throw new Error("Name is required. ");
    if (!repo) {
        throw new Error("Repository is required");
    }
    if (!protocol) {
        throw new Error("Transport is required");
    }
    var _transport = protocol;
    var _name = name;
    var _description = description || "";
    var _repo = repo;
    var _parent = parent;
    var _path = _buildPath(parent);
    var _state = {};
    var id = _arrayToString(_path, "/") + name;
    var identity = repo.identity;
    var root = repo.root;
    var _subSystems = [];
    var _metrics = [];
    function subSystem(nameSystem, descriptionSystem) {
        if (!nameSystem || nameSystem.length === 0) {
            throw new Error("name is required");
        }
        var match = _subSystems.filter(function (s) { return s.name === nameSystem; });
        if (match.length > 0) {
            return match[0];
        }
        var _system = system(nameSystem, _repo, _transport, me, descriptionSystem);
        _subSystems.push(_system);
        return _system;
    }
    function setState(state, stateDescription) {
        _state = { state: state, description: stateDescription };
        _transport.updateSystem(me, _state);
    }
    function stringMetric(definition, value) {
        return _getOrCreateMetric.call(me, definition, metric_types_1.default.STRING, value, function (metricDef) { return string_1.default(metricDef, me, _transport, value); });
    }
    function numberMetric(definition, value) {
        return _getOrCreateMetric.call(me, definition, metric_types_1.default.NUMBER, value, function (metricDef) { return number_1.default(metricDef, me, _transport, value); });
    }
    function countMetric(definition, value) {
        return _getOrCreateMetric.call(this, definition, metric_types_1.default.COUNT, value, function (metricDef) { return count_1.default(metricDef, me, _transport, value); });
    }
    function addressMetric(definition, value) {
        return _getOrCreateMetric.call(this, definition, metric_types_1.default.ADDRESS, value, function (metricDef) { return address_1.default(metricDef, me, _transport, value); });
    }
    function objectMetric(definition, value) {
        return _getOrCreateMetric.call(this, definition, metric_types_1.default.OBJECT, value, function (metricDef) { return object_1.default(metricDef, me, _transport, value); });
    }
    function timespanMetric(definition, value) {
        return _getOrCreateMetric.call(this, definition, metric_types_1.default.TIMESPAN, value, function (metricDef) { return timespan_1.default(metricDef, me, _transport, value); });
    }
    function timestampMetric(definition, value) {
        return _getOrCreateMetric.call(this, definition, metric_types_1.default.TIMESTAMP, value, function (metricDef) { return timestamp_1.default(metricDef, me, _transport, value); });
    }
    function rateMetric(definition, value) {
        return _getOrCreateMetric.call(this, definition, metric_types_1.default.RATE, value, function (metricDef) { return rate_1.default(metricDef, me, _transport, value); });
    }
    function statisticsMetric(definition, value) {
        return _getOrCreateMetric.call(this, definition, metric_types_1.default.STATISTICS, value, function (metricDef) { return statistics_1.default(metricDef, me, _transport, value); });
    }
    function _unionToMetricDef(def) {
        var metricDefinition = {};
        // NOTE: Handle undefined
        if (typeof def === "string") {
            metricDefinition.name = def;
        }
        else {
            metricDefinition = def;
        }
        if (metricDefinition.name === undefined) {
            throw new Error("Metric name is required");
        }
        return metricDefinition;
    }
    function _getOrCreateMetric(definition, expectedType, value, createMetric) {
        var metricDefinition = _unionToMetricDef(definition);
        var matching = _metrics.filter(function (shadowedMetric) { return shadowedMetric.name === metricDefinition.name; });
        if (matching.length > 0) {
            var existing = matching[0];
            if (existing.type !== expectedType) {
                // NOTE: Extend the error with the already defined metric?
                throw new Error("A metric named " + metricDefinition.name + " is already defined with different type.");
            }
            if (typeof value !== "undefined") {
                existing.update(value);
            }
            return existing;
        }
        var metric = createMetric(metricDefinition);
        _metrics.push(metric);
        return metric;
    }
    function _buildPath(shadowedSystem) {
        if (!shadowedSystem || !shadowedSystem.parent) {
            return [];
        }
        var path = _buildPath(shadowedSystem.parent);
        path.push(shadowedSystem.name);
        return path;
    }
    function _arrayToString(path, separator) {
        return ((path && path.length > 0) ? path.join(separator) : "");
    }
    function getAggregateState() {
        var aggState = [];
        if (Object.keys(_state).length > 0) {
            aggState.push({
                name: _name,
                path: _path,
                state: _state.state,
                description: _state.description,
            });
        }
        _subSystems.forEach(function (shadowedSubSystem) {
            var result = shadowedSubSystem.getAggregateState();
            if (result.length > 0) {
                aggState.push.apply(aggState, result);
            }
        });
        return aggState;
    }
    var me = {
        get name() {
            return _name;
        },
        get description() {
            return _description;
        },
        get repo() {
            return _repo;
        },
        get parent() {
            return _parent;
        },
        path: _path,
        id: id,
        identity: identity,
        root: root,
        get subSystems() {
            return _subSystems;
        },
        get metrics() {
            return _metrics;
        },
        subSystem: subSystem,
        getState: function () {
            return _state;
        },
        setState: setState,
        stringMetric: stringMetric,
        statisticsMetric: statisticsMetric,
        rateMetric: rateMetric,
        timestampMetric: timestampMetric,
        timespanMetric: timespanMetric,
        objectMetric: objectMetric,
        addressMetric: addressMetric,
        countMetric: countMetric,
        numberMetric: numberMetric,
        getAggregateState: getAggregateState,
    };
    _transport.createSystem(me);
    return me;
}
exports.default = system;
//# sourceMappingURL=system.js.map

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    function now() {
        return new Date().getTime();
    }
    var startTime = now();
    var endTime;
    var period;
    function stop() {
        endTime = now();
        period = now() - startTime;
        return period;
    }
    return {
        get startTime() {
            return startTime;
        },
        get endTime() {
            return endTime;
        },
        get period() {
            return period;
        },
        stop: stop
    };
}
exports.default = default_1;
//# sourceMappingURL=timer.js.map

/***/ })
/******/ ]);
});
//# sourceMappingURL=tick42-glue-core.js.map

/***/ }),
/* 38 */
/***/ (function(module, exports) {

var isFunction = function isFunction (arg) {return !!(arg && arg.constructor && arg.call && arg.apply);}
var nextTick = function nextTick (cb) { setTimeout(cb, 0); };

module.exports = function (promise, successCallback, errorCallback) {
    'use strict';
    if (!isFunction(successCallback) && !isFunction(errorCallback)) {
        return promise;
    }

    if (!isFunction(successCallback)) {
        successCallback = function () {};
    } else if (!isFunction(errorCallback)) {
        errorCallback = function () {};        
    }

    promise.then(successCallback, errorCallback);
}


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var promiseExtensions_1 = __webpack_require__(8);
var activityManagementAPI_1 = __webpack_require__(40);
var activityAGM_1 = __webpack_require__(9);
/**
 * The entry points of activities API - accessible from glue.activities
 *
 * @module activities
 */
var ActivityAPI = /** @class */ (function () {
    function ActivityAPI(manager, my) {
        this._mgr = manager;
        this._my = my;
        this.all = new activityManagementAPI_1.ActivityManagementAPI(manager, my);
    }
    /**
     * The entry point for your activity code.
     *
     * @function ready
     * @returns {Promise<module:activities>} A promise for activity API
     */
    ActivityAPI.prototype.ready = function (callback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this._mgr.ready()
                .then(function () {
                resolve(_this);
            })
                .catch(function (err) {
                reject(err);
            });
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    Object.defineProperty(ActivityAPI.prototype, "my", {
        /**
         * A lightweight, single activity oriented subset of the API which should be used by most activity applications
         *
         * @var {module:my} my
         */
        get: function () {
            return this._my;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityAPI.prototype, "aware", {
        /**
         * True if the current window is activity aware - meaning that the window has been created as
         * an activity participant - either a helper or an independent window.
         * Check this after the API is ready.
         *
         * @var {bool} aware
         */
        get: function () {
            return this._my.window !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityAPI.prototype, "inActivity", {
        /**
         * Returns true if the current window is activity aware and is currently participating in activity
         *
         * @var {bool} inActivity
         */
        get: function () {
            return this.aware && this._my.activity !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityAPI.prototype, "agm", {
        /**
         * Defines an Activity-specific version of the AGM API which:
         * * restricts method registrations to activity-only windows
         * * restricts method discovery and invocation to activity-only methods, unless you explicitly specify otherwise
         * Other than that, the API is pretty much the same.
         *
         * @var  {module:activityAGM} agm
         *
         */
        get: function () {
            if (!this.aware) {
                // no agm if not activity aware
                return undefined;
            }
            if (!this.inActivity) {
                // if we're not in activity no
                return new activityAGM_1.ActivityAGM(null);
            }
            return this._my.activity.agm;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a list of frame colors that can be used as activity frame colors
     *
     * @returns {string[]}
     */
    ActivityAPI.prototype.getAvailableFrameColors = function () {
        var frameColors;
        var hc = window.htmlContainer;
        if (hc) {
            frameColors = hc.getFrameColors();
        }
        frameColors = frameColors || [];
        return frameColors;
    };
    return ActivityAPI;
}());
exports.ActivityAPI = ActivityAPI;
//# sourceMappingURL=activityAPI.js.map

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util = __webpack_require__(0);
var ActivityManagementAPI = /** @class */ (function () {
    function ActivityManagementAPI(manager, my) {
        this._m = manager;
        this._my = my;
        this.activityTypes = {
            get: this._getActivityTypesWrapper.bind(this),
            register: this._m.registerActivityType.bind(this._m),
            unregister: this._m.unregisterActivityType.bind(this._m),
            subscribe: this._m.subscribeActivityTypeEvents.bind(this._m),
            unsubscribe: undefined,
            initiate: this._m.initiate.bind(this._m)
        };
        this.windowTypes = {
            get: this._getWindowTypesWrapper.bind(this),
            registerFactory: this._m.registerWindowFactory.bind(this._m),
            unregisterFactory: this._m.unregisterWindowFactory.bind(this._m),
            subscribe: this._m.subscribeWindowTypeEvents.bind(this._m),
            unsubscribe: undefined
        };
        this.windows = {
            get: this._m.getWindows.bind(this._m),
            subscribe: this._m.subscribeWindowEvents.bind(this._m),
            announce: this._m.announceWindow.bind(this._m),
            unsubscribe: undefined,
            create: this._m.createWindow.bind(this._m)
        };
        this.instances = {
            get: this._m.getActivities.bind(this._m),
            subscribe: this._m.subscribeActivityEvents.bind(this._m),
            unsubscribe: undefined
        };
    }
    ActivityManagementAPI.prototype.onAttached = function (callback) {
        this._m.subscribeActivitiesAttached(callback);
    };
    ActivityManagementAPI.prototype.onDetached = function (callback) {
        this._m.subscribeActivitiesDetached(callback);
    };
    ActivityManagementAPI.prototype.onActivityFrameColorChanged = function (callback) {
        this._m.subscribeActivityFrameColorChanged(callback);
    };
    ActivityManagementAPI.prototype._getActivityTypesWrapper = function (name) {
        if (util.isUndefined(name)) {
            return this._m.getActivityTypes();
        }
        return this._m.getActivityType(name);
    };
    ActivityManagementAPI.prototype._getWindowTypesWrapper = function (name) {
        if (util.isUndefined(name)) {
            return this._m.getWindowTypes();
        }
        return this._m.getWindowType(name);
    };
    return ActivityManagementAPI;
}());
exports.ActivityManagementAPI = ActivityManagementAPI;
//# sourceMappingURL=activityManagementAPI.js.map

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var entityEvent_1 = __webpack_require__(2);
var logger_1 = __webpack_require__(3);
var util = __webpack_require__(0);
/**
 * A lightweight, single activity oriented subset of the API which should be used by most activity applications.
 * Provides access to the activity of your application (my.activity) and shortcuts to the most commonly used methods
 * (e.g. my.createWindow is a shortcut for my.activity.createWindow)
 *
 * @module my
 */
var ActivityMy = /** @class */ (function () {
    function ActivityMy(manager, windows) {
        var _this = this;
        this._myAttached = [];
        this._myDetached = [];
        this._myAttachedTo = [];
        this._myDetachedFrom = [];
        this._myActivityFrameColorChanged = [];
        this._myActivityJoinedCallbacks = [];
        this._myActivityRemovedCallbacks = [];
        this._myContextUpdateCallbacks = [];
        this._logger = logger_1.Logger.Get(this);
        this._m = manager;
        manager.ready()
            .then(function (am) {
            // Subscribe for events for driving "my" logic
            am.subscribeActivityContextChanged(_this._subscribeMyContextChanged.bind(_this));
            am.subscribeWindowEvents(_this._subscribeMyWindowEvent.bind(_this));
            am.subscribeActivitiesAttached(_this._subscribeActivitiesAttached.bind(_this));
            am.subscribeActivitiesDetached(_this._subscribeActivitiesDetached.bind(_this));
            if (windows) {
                windows.onWindowFrameColorChanged(_this._subscribeWindowFrameColorChanged.bind(_this));
            }
        });
    }
    Object.defineProperty(ActivityMy.prototype, "window", {
        /**
         * The current activity window; can be undefined (if the window is not part of any activity)
         *
         * @var {Window} window
         */
        get: function () {
            if (util.isUndefinedOrNull(this._w)) {
                var announcedWindows = this._m.announcedWindows;
                if (announcedWindows.length > 0) {
                    this._w = announcedWindows[0];
                }
            }
            return this._w;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityMy.prototype, "activity", {
        /**
         * The current activity that the application participates in.
         * Can be undefined (if currently not part of any activity)
         *
         * @var {module:activity} activity
         */
        get: function () {
            var myWin = this.window;
            if (util.isUndefinedOrNull(myWin)) {
                return undefined;
            }
            return myWin.activity;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new window and joins it to the activity
     *
     * @function createWindow
     * @param {string| windowDefinition} windowType The type of the window to be created
     * @returns {Promise<module:activityWindow>}
     */
    ActivityMy.prototype.createWindow = function (windowType) {
        return this._m.createWindow(this.activity, windowType);
    };
    /**
     * Creates a stacked set of windows and joins them to the
     *
     * @function createStackedWindows
     * @param {string[] | windowDefinition[]} windowTypes The types of the windows to be created
     * @param {number} timeout
     * @returns {Promise<module:activityWindow[]>}
     */
    ActivityMy.prototype.createStackedWindows = function (windowTypes, timeout) {
        return this._m.createStackedWindows(this.activity, windowTypes, timeout);
    };
    Object.defineProperty(ActivityMy.prototype, "context", {
        /**
         * The current activity context. To update use my.updateContext, to replace my.setContext
         *
         * @var {object} context
         */
        get: function () {
            var activity = this.activity;
            if (util.isUndefined(activity)) {
                return {};
            }
            return activity.context;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates activity context using the properties from the context argument.
     * If old context is {a:1, b:2, c:3} and invoking updateContext({b:3, c:null}) will result a context
     * be {a:1, b:3}
     *
     * @function updateContext
     * @param {object} context
     * @return {Promise<object>}
     */
    ActivityMy.prototype.updateContext = function (context, callback) {
        var activity = this.activity;
        if (util.isUndefined(activity)) {
            return new Promise(function (resolve, reject) {
                reject("Not in activity");
            });
        }
        return activity.updateContext(context, callback);
    };
    /**
     * Replaces the activity context with a new one.
     *
     * @function setContext
     * @param {object} context   The new context
     * @returns {Promise<Object>}
     */
    ActivityMy.prototype.setContext = function (context, callback) {
        var activity = this.activity;
        if (util.isUndefined(activity)) {
            return new Promise(function (resolve, reject) {
                reject("Not in activity");
            });
        }
        return activity.setContext(context, callback);
    };
    ActivityMy.prototype.onActivityJoined = function (callback) {
        this._myActivityJoinedCallbacks.push(callback);
        // replay joined event
        var myWin = this.window;
        if (!util.isUndefinedOrNull(myWin) && !util.isUndefinedOrNull(myWin.activity)) {
            callback(myWin.activity);
        }
    };
    ActivityMy.prototype.onActivityLeft = function (callback) {
        this._myActivityRemovedCallbacks.push(callback);
    };
    /**
     * Subscribe for context updates
     *
     * @function onContextChanged
     * @param {contextChangedHandler} callback Handler function that will receive context related events
     */
    ActivityMy.prototype.onContextChanged = function (callback) {
        this._myContextUpdateCallbacks.push(callback);
        // publish initial event
        var myWin = this.window;
        if (util.isUndefinedOrNull(myWin)) {
            return;
        }
        var activity = myWin.activity;
        if (util.isUndefinedOrNull(activity)) {
            return;
        }
        // NB: either the callback is added before the activity is recorded in the API, or
        // the activity is recorded before the callback
        // in the former case, when the activity is seen, the callback will be invoked in _notifyMyContextChanged
        // in the latter, the callback will be invoked here
        // in both cases, the callback will be invoked at least once as soon as an activity is recorded
        // see "long analysis for callback behavior in GW3: several cases" for full explanation
        callback(activity.context, activity.context, [], activity);
    };
    ActivityMy.prototype.clone = function (options, callback) {
        var act = this.activity;
        return this._m.clone(act, options, callback);
    };
    ActivityMy.prototype.attach = function (activity, tag) {
        var activityId;
        if (typeof activity === "string") {
            activityId = activity;
        }
        else {
            activityId = activity.id;
        }
        return this._m.attachActivities(activityId, this.activity.id, tag);
    };
    ActivityMy.prototype.onActivityAttached = function (callback) {
        this._myAttached.push(callback);
    };
    ActivityMy.prototype.onActivityDetached = function (callback) {
        this._myDetached.push(callback);
    };
    ActivityMy.prototype.onAttachedToActivity = function (callback) {
        this._myAttachedTo.push(callback);
    };
    ActivityMy.prototype.onDetachedFromActivity = function (callback) {
        this._myDetachedFrom.push(callback);
    };
    Object.defineProperty(ActivityMy.prototype, "attached", {
        get: function () {
            if (!this.activity) {
                return [];
            }
            return this.activity.attached;
        },
        enumerable: true,
        configurable: true
    });
    ActivityMy.prototype.setFrameColor = function (color, callback) {
        if (this.activity) {
            return this.activity.setFrameColor(color, callback);
        }
        else {
            return Promise.resolve(null);
        }
    };
    ActivityMy.prototype.getFrameColor = function () {
        if (this.activity) {
            return this.activity.getFrameColor();
        }
        return "";
    };
    ActivityMy.prototype.onFrameColorChanged = function (callback) {
        this._myActivityFrameColorChanged.push(callback);
    };
    ActivityMy.prototype._subscribeMyContextChanged = function (activity, context, delta, removed) {
        var myWin = this.window;
        if (util.isUndefinedOrNull(myWin)) {
            return;
        }
        var myActivity = myWin.activity;
        if (util.isUndefinedOrNull(myActivity)) {
            return;
        }
        // ignore events not related to my activity
        if (activity.id !== myActivity.id) {
            return;
        }
        this._notifyMyContextChanged(activity, context, delta, removed);
    };
    ActivityMy.prototype._subscribeMyWindowEvent = function (activity, window, event) {
        if (util.isUndefinedOrNull(this.window)) {
            return;
        }
        // ignore events not related to my window
        if (this.window.id !== window.id) {
            return;
        }
        if (event === entityEvent_1.EntityEventType.ActivityWindowJoinedActivity) {
            this._notifyMyWindowEvent(activity, this._myActivityJoinedCallbacks);
            // NB: tick42-contexts doesn't raise automatically an update event on join if the snapshot matches
            // the currently recorded data
            // revisited: however, it is pushing an update on subscribe() (which is performed by js-activity)
            // long analysis for callback behavior in GW3: several cases
            // 1 client calls onContextChanged before joined-activity arrives
            // then callback is pushed but onContextChanged callback call is skipped
            //    1-1 js-activity handles joined-activity first; it calls js-context subscribe
            //    1-1-1 js-context has not seen the activity so far so it doesn't invoke an update
            //    however, js-context then handles joined-activity and raises an update
            //    1-1-2 js-context has seen the activity, so it raises an update
            //    js-context then handles joined-activity and doesn't raise a second update unless the received snapshot is
            //    different from the last seen context value (can this even happen?)
            //    1-2 js-context handles joined-activity first
            //    since js-activity is not subscribed, whether it raises an update or not, it's not propagated
            //    js-activity then handles joined-activity, performs a subscribe and js-context raises an update
            // 2 joined-activity arrives, whatever updates are raised by js-activity's subscribe() or js-context's
            // message handler are not propagated since the callback is not pushed, client then calls onContextChanged,
            // and the callback is called inside that
            // also, the callback cannot be invoked first in 1 then 2 or first 2 then 1
            // => in all cases, a callback is called exactly once as soon as (it's subscribed && the activity is joined)
            // (in 1-1-2 it *might* be possible to be called twice, first with a slightly out of date context,
            // then with the joined-activity snapshot, see "different from the last seen context value", but it's unlikely,
            // and not a real issue anyway)
            // in the HC case, however, case 1 doesn't work since js-context doesn't raise updates on subscribe() nor
            // joining the activity (#deleteme TODO LATER MINOR: verify), so we need to raise it ourselves
            // 2017-09-08: final revisit (@vnikolov)
            // since SBGW_D-163 allows automatic subscription to contexts of pre-existing activities, 1-1-2 no longer works
            // (we might have already seen the latest state before joined-activity so no update will be raised)
            // for this reason I'm invoking notifyMyContextChanged unconditionally - so we might have multiple
            // invocations; if this turns into a problem we might add a guard inside notifyMyContextChanged that
            // checks we're not raising it twice with the same context value
            //
            // we might also get a duplicate raise if the sender of an update is also subscribed to the context
            // if (this._m.usingHc) {
            this._notifyMyContextChanged(activity, activity.context, null, null);
            // }
            // #deleteme TODO LATER MAJOR: what about the cases when we're not watching foreign activity contexts?
        }
        else if (event === entityEvent_1.EntityEventType.ActivityWindowLeftActivity) {
            this._notifyMyWindowEvent(activity, this._myActivityRemovedCallbacks);
            // #deleteme TODO LATER MINOR: should we send null update here?
        }
    };
    ActivityMy.prototype._notifyMyWindowEvent = function (activity, callbackStore) {
        var _this = this;
        callbackStore.forEach(function (element) {
            try {
                element(activity, event);
            }
            catch (e) {
                _this._logger.warn("error in user callback " + e);
            }
        });
    };
    ActivityMy.prototype._notifyMyContextChanged = function (activity, context, delta, removed) {
        var _this = this;
        delta = delta || {};
        removed = removed || [];
        this._myContextUpdateCallbacks.forEach(function (element) {
            try {
                element(context, delta, removed, activity);
            }
            catch (e) {
                _this._logger.warn("error in user callback " + e);
            }
        });
    };
    ActivityMy.prototype._notifyAttached = function (state) {
        var _this = this;
        this._myAttached.forEach(function (cb) {
            try {
                cb(state);
            }
            catch (e) {
                _this._logger.warn("error in user callback " + e);
            }
        });
    };
    ActivityMy.prototype._notifyDetached = function (state) {
        var _this = this;
        this._myDetached.forEach(function (cb) {
            try {
                cb(state);
            }
            catch (e) {
                _this._logger.warn("error in user callback " + e);
            }
        });
    };
    ActivityMy.prototype._notifyAttachedTo = function (state) {
        var _this = this;
        this._myAttachedTo.forEach(function (cb) {
            try {
                cb(_this.activity, state);
            }
            catch (e) {
                _this._logger.warn("error in user callback " + e);
            }
        });
    };
    ActivityMy.prototype._notifyDetachedFrom = function (detached, existing, state) {
        var _this = this;
        this._myDetachedFrom.forEach(function (cb) {
            try {
                cb(detached, existing, state);
            }
            catch (e) {
                _this._logger.warn("error in user callback " + e);
            }
        });
    };
    ActivityMy.prototype._subscribeActivitiesAttached = function (newAct, state) {
        var myWin = this.window;
        if (util.isUndefinedOrNull(myWin)) {
            return;
        }
        var myActivity = myWin.activity;
        if (util.isUndefinedOrNull(myActivity)) {
            return;
        }
        // ignore events not related to my activity
        if (newAct.id !== myActivity.id) {
            return;
        }
        if (state.windowIds.indexOf(myWin.id) >= 0) {
            this._notifyAttachedTo(state);
            return;
        }
        this._notifyAttached(state);
    };
    ActivityMy.prototype._subscribeActivitiesDetached = function (newAct, oldAct, state) {
        var myWin = this.window;
        if (util.isUndefinedOrNull(myWin)) {
            return;
        }
        var myActivity = myWin.activity;
        if (util.isUndefinedOrNull(myActivity)) {
            return;
        }
        // ignore events not related to my activity
        if (oldAct.id === myActivity.id) {
            this._notifyDetached(state);
        }
        if (newAct.id === myActivity.id) {
            this._notifyDetachedFrom(newAct, oldAct, state);
        }
    };
    ActivityMy.prototype._subscribeWindowFrameColorChanged = function (window) {
        var act = this.activity;
        if (!act) {
            return;
        }
        if (!act.owner) {
            return;
        }
        if (act.owner.underlyingWindow.id === window.id) {
            this._myActivityFrameColorChanged.forEach(function (callback) {
                callback(window.frameColor);
            });
        }
    };
    return ActivityMy;
}());
exports.default = ActivityMy;
//# sourceMappingURL=activityMyAPI.js.map

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gw3Bridge_1 = __webpack_require__(43);
var hcBridge_1 = __webpack_require__(13);
var activityMyAPI_1 = __webpack_require__(41);
var activityManager_1 = __webpack_require__(44);
var activityAPI_1 = __webpack_require__(39);
var activityAGM_1 = __webpack_require__(9);
var logger_1 = __webpack_require__(3);
var util = __webpack_require__(0);
var promiseExtensions_1 = __webpack_require__(8);
/**
 * Activity context update handler - used when we want to subscribe for context changes in a specific activity
 *
 * @callback contextChangedHandler
 * @param {Object} context The full context of the activity after the update
 * @param {Object} delta The delta (contains the added/removed keys at top level)
 * @param {string[]} removed  Array of keys that were removed from context
 * @param {module:activity} activity The activity instance that owns the context
 *
 */
/**
 * @callback windowEventHandler Handler for ActivityWindow events - e.g window joined to activity, window removed from
 * activity
 * @param {module:activity} activity
 * @param {module:activityWindow} window
 * @param {string} event 'joined' or 'removed'
 */
/**
 * @callback activityStatusChangeHandler Handler for activity status changed events
 * @param {module:activity} activity
 * @param {activityStatus} newStatus
 * @param {activityStatus} oldStatus
 *
 */
/**
 * @typedef {Object} windowDefinition
 * @property {string} type
 * @property {string} name
 * @property {Object} arguments
 */
/**
 * @typedef {Object} bounds
 * @param {number} top
 * @param {number} left
 * @param {number} width
 * @param {number} height
 *
 */
/**
 * @typedef {Object} agmInstance
 * @param {string} application
 * @param {string} pid
 * @param {string} machine
 * @param {string} user
 * @param {string} environment
 * @param {string} region
 */
// Factory function for activity API
var ActivityModule = /** @class */ (function () {
    function ActivityModule(config) {
        var _this = this;
        if (!config) {
            throw new Error("config can not be null");
        }
        // set log level
        if (!util.isUndefined(config.logLevel)) {
            logger_1.Logger.Level = config.logLevel;
        }
        if (!util.isUndefinedOrNull(config.logger)) {
            logger_1.Logger.GlueLogger = config.logger;
        }
        // choose the correct bridge
        var bridge;
        this._isUsingHCImplementation = ActivityModule.checkIsUsingHCImplementation /*( config.connection )*/();
        this._isUsingGW3Implementation = ActivityModule.checkIsUsingGW3Implementation(config.connection);
        if (this._isUsingHCImplementation) {
            bridge = new hcBridge_1.default(undefined, config.windows, config.appManagerGetter, config.mode, config.typesToTrack);
        }
        else if (this._isUsingGW3Implementation) {
            bridge = new gw3Bridge_1.default(config.connection, config.logger, config.contexts, config);
        }
        else {
            throw new Error("Unable to instantiate activity bridge implementation");
        }
        if (!bridge) {
            throw new Error("A bridge to native activity is needed to create activity lib.");
        }
        activityAGM_1.ActivityAGM.AGM = config.agm;
        var activityManager = new activityManager_1.default(bridge, !config.disableAutoAnnounce, config.windows);
        var my = new activityMyAPI_1.default(activityManager, config.windows);
        this._api = new activityAPI_1.ActivityAPI(activityManager, my);
        this._readyPromise = activityManager.ready().then(function (_) { return _this; });
    }
    ActivityModule.checkIsUsingHCImplementation /*( connection *)*/ = function () {
        return typeof window !== "undefined" && !util.isUndefined(window.htmlContainer);
    };
    ActivityModule.checkIsUsingGW3Implementation = function (connection) {
        return connection.protocolVersion === 3;
    };
    Object.defineProperty(ActivityModule.prototype, "api", {
        get: function () {
            return this._api;
        },
        set: function (value) {
            this._api = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityModule.prototype, "isUsingHCImplementation", {
        get: function () {
            return this._isUsingHCImplementation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityModule.prototype, "isUsingGW3Implementation", {
        get: function () {
            return this._isUsingGW3Implementation;
        },
        enumerable: true,
        configurable: true
    });
    ActivityModule.prototype.ready = function (callback) {
        return promiseExtensions_1.nodeify(this._readyPromise, callback);
    };
    return ActivityModule;
}());
exports.ActivityModule = ActivityModule;
//# sourceMappingURL=activityModule.js.map

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var activityType_1 = __webpack_require__(10);
var windowType_1 = __webpack_require__(17);
var entityEvent_1 = __webpack_require__(2);
var activity_1 = __webpack_require__(15);
var activityWindow_1 = __webpack_require__(16);
var activityStatus_1 = __webpack_require__(14);
var gwMessageSuccess = "success";
var gwMmessageError = "error";
var gwMessageAddActivityTypes = "add-types";
var gwMmessageActivityTypesAdded = "types-added";
var gwMessageRemoveActivityTypes = "remove-types";
var gwMessageActivityTypesRemoved = "types-removed";
var gwMessageActivityCreated = "created";
var gwMessageActivityDestroyed = "destroyed";
var gwMessageActivityInitiated = "initiated";
var gwMmessageJoinActivity = "join-activity";
var gwMessageJoinedActivity = "joined";
var gwMessageActivityJoined = "activity-joined";
var gwMessageLeaveActivity = "leave-activity";
var gwMessageActivityLeft = "left";
var gwNmessageMergeActivities = "merge";
var gwMessageSplitActivities = "split";
var gwMessageChildrenChanged = "children-changed";
var gwMessageAddPeerFactories = "add-peer-factories";
var gwMessagePeerFactoriesAdded = "peer-factories-added";
var gwMessageRemovePeerFactories = "remove-peer-factories";
var gwMessagePeerFactoriesRemoved = "peer-factories-removed";
var gwMessageCreateActivity = "create";
var gwMessageCreatePeer = "create-peer";
var gwMessagePeerRequested = "peer-requested";
var gwMessageReady = "ready";
var gwMessagePeerCreated = "peer-created";
var gwMessageDestroyActivity = "destroy";
var gwMessageDisposePeer = "dispose-peer";
var GW3Bridge = /** @class */ (function () {
    function GW3Bridge(connection, logger, contexts, config) {
        var _this = this;
        // callbacks
        this._activityChangeCallbacks = [];
        this._activityTypeStatusChangeCallbacks = [];
        this._activityWindowChangeCallbacks = [];
        this._windowTypeStatusChangeCallbacks = [];
        // state tracking
        this._peerIdAndFactoryIdToPeerType = {};
        this._peerFactoriesRegisteredByUs = {};
        this._gw3Subscriptions = [];
        this._contextSubscriptions = {};
        this._activityTypesInitiatedFromMe = {};
        this._config = config;
        this._connection = connection;
        this._logger = logger;
        this._contexts = contexts;
        this._readyPromise = new Promise(function (resolve /*, reject */) {
            _this._readyPromiseResolve = resolve;
        });
        this._gw3Session = connection.domain("activity", logger.subLogger("session:com.tick42.activity"), ["joined", "initiated", "peer-created"]);
    }
    GW3Bridge.activityTypeGwMessageEntityToActivityType = function (entity, description) {
        var nameToWindowType = function (windowName) {
            return new windowType_1.default(windowName, undefined);
        };
        return new activityType_1.default(entity.name, entity.owner_type && nameToWindowType(entity.owner_type), entity.helper_types && entity.helper_types.map(nameToWindowType), description);
    };
    GW3Bridge.peerFactoryGwMessageEntityToWindowType = function (entity) {
        return new windowType_1.default(entity.peer_type, 
        /* #deleteme TODO: appmanager configuration? */ function (_) { return undefined; });
    };
    GW3Bridge.activityGwMessageToActivity = function (msg, status) {
        var ownerId = msg.owner !== undefined ? msg.owner.peer_id : undefined;
        return new activity_1.default(msg.activity_id, msg.activity_type, status, msg.context_snapshot, ownerId);
    };
    GW3Bridge.activityToActivityStatusChangeEvent = function (act) {
        return new entityEvent_1.EntityEvent(act, new entityEvent_1.ActivityStatusChangeEventContext(act.status, undefined));
    };
    Object.defineProperty(GW3Bridge.prototype, "bridgeType", {
        get: function () {
            return "GW3";
        },
        enumerable: true,
        configurable: true
    });
    GW3Bridge.prototype.init = function () {
        var _this = this;
        // activity types
        this.forwardActivityTypeMessagesToStatusEventHandlers();
        // activities
        this.subscribe(gwMessageActivityCreated, this.handleActivityCreatedMessage);
        this.subscribe(gwMessageActivityDestroyed, this.handleActivityDestroyedMessage);
        this.forwardActivityMessagesToStatusEventHandlers();
        this.forwardActivityCreatedAndJoinedActivityToActivityWindowEventHandlers();
        // window types / peer factories
        // NB: this forward must happen before the handlePeerFactoriesRemoved subscription
        // since the latter clears state which is used by peerFactoryIdAndOwnerIdToWindowType
        this.forwardPeerFactoryMessagesToStatusEventHandlers();
        this.forwardPeerFactoryMessagesToPeerFactoryRequests();
        this.subscribe(gwMessagePeerFactoriesAdded, this.handlePeerFactoriesAdded);
        this.subscribe(gwMessagePeerFactoriesRemoved, this.handlePeerFactoriesRemoved);
        // activity windows
        this.forwardActivityWindowMessagesToEventHandlers();
        //
        this.subscribe(gwMessageDisposePeer, 
        /*(msg)*/ function () {
            if (_this._config.disposeRequestHandling === "dispose") {
                _this.dispose();
                return;
            }
            // #deleteme TODO: maybe leave activity before dying?
            if (_this._config.disposeRequestHandling === "exit") {
                if (typeof window !== "undefined" &&
                    typeof window.close === "function") {
                    window.close();
                    return;
                }
                if (typeof process !== "undefined" &&
                    typeof process.exit === "function") {
                    process.exit();
                    return;
                }
            }
        });
        // #deleteme TODO: logging
        // start domain join handshake
        this._gw3Session.onJoined(function () {
            if (_this._config.mode === "trackMyOnly" ||
                _this._config.mode === "trackMyTypeAndInitiatedFromMe") {
                _this._readyPromiseResolve(_this);
            }
            else {
                _this._gw3Session
                    .send({
                    type: "subscribe",
                    activity_types: (_this._config.mode === "trackAll" ? [] :
                        _this._config.mode === "trackTypes" ? _this._config.typesToTrack : [])
                })
                    .then(function () {
                    _this._readyPromiseResolve(_this);
                });
            }
        });
        this._gw3Session.join();
    };
    GW3Bridge.prototype.dispose = function () {
        var _this = this;
        this._gw3Subscriptions.forEach(function (sub) { return sub && _this._connection.off(sub); });
        this._gw3Subscriptions.length = 0;
        // this._contexts.dispose();
    };
    // ActivityBridge interface
    GW3Bridge.prototype.ready = function () {
        return this._readyPromise;
    };
    GW3Bridge.prototype.onActivityTypeStatusChange = function (callback) {
        this._activityTypeStatusChangeCallbacks.push(callback);
    };
    GW3Bridge.prototype.registerActivityType = function (activityTypeName, ownerWindow, helperWindows, config, description) {
        var _this = this;
        var entity = {};
        entity.name = activityTypeName;
        var toActivityPeerConfig = function (windowDefinition) { return ({ type: windowDefinition.type, name: windowDefinition.name, configuration: windowDefinition }); };
        entity.owner_type = toActivityPeerConfig(ownerWindow);
        entity.helper_types = helperWindows.map(toActivityPeerConfig);
        return this._gw3Session
            .send({
            type: gwMessageAddActivityTypes,
            types: [entity]
        })
            .then(function () {
            var activityType = GW3Bridge.activityTypeGwMessageEntityToActivityType(entity, description);
            _this.invokeCallbacks(_this._activityTypeStatusChangeCallbacks, new entityEvent_1.EntityEvent(activityType, new entityEvent_1.EntityEventContext(entityEvent_1.EntityEventType.Added)), gwMessageAddActivityTypes);
            return activityType;
        });
    };
    GW3Bridge.prototype.unregisterActivityType = function (activityTypeName) {
        var _this = this;
        return this._gw3Session
            .send({
            type: gwMessageRemoveActivityTypes,
            types: [activityTypeName]
        })
            .then(function () {
            var activityType = new activityType_1.default(activityTypeName, undefined, undefined, undefined);
            _this.invokeCallbacks(_this._activityTypeStatusChangeCallbacks, new entityEvent_1.EntityEvent(activityType, new entityEvent_1.EntityEventContext(entityEvent_1.EntityEventType.Removed)), gwMessageAddActivityTypes);
        });
    };
    GW3Bridge.prototype.onWindowTypeStatusChange = function (callback) {
        this._windowTypeStatusChangeCallbacks.push(callback);
    };
    // NB: in GW3, peer factories have ids separate from the ids of the peers they create
    // in this implementation we keep the two equal for simplicity
    // NB: we assume only one peer will register a peer factory for a given type; otherwise the
    // add/remove window types event logic will get messy
    GW3Bridge.prototype.registerWindowFactory = function (windowType, factory, parameters) {
        var _this = this;
        if (this._peerFactoriesRegisteredByUs[windowType]) {
            return Promise.reject(new Error("Factory for windowType " + windowType + " already registered."));
        }
        this._peerFactoriesRegisteredByUs[windowType] = factory;
        // #deleteme TODO: review success/failure code paths
        // #deleteme TODO: should we create the window type here?
        var entity = {
            id: windowType,
            peer_type: windowType,
            configuration: parameters
        };
        return this._gw3Session.send({
            type: gwMessageAddPeerFactories,
            factories: [entity]
        })
            .then(function () {
            _this.invokeCallbacks(_this._windowTypeStatusChangeCallbacks, new entityEvent_1.EntityEvent(GW3Bridge.peerFactoryGwMessageEntityToWindowType(entity), new entityEvent_1.EntityEventContext(entityEvent_1.EntityEventType.Added)), gwMessageAddPeerFactories);
        })
            .catch(function () {
            delete _this._peerFactoriesRegisteredByUs[windowType];
        });
    };
    GW3Bridge.prototype.unregisterWindowFactory = function (windowType) {
        var _this = this;
        var factory = this._peerFactoriesRegisteredByUs[windowType];
        if (!factory) {
            return Promise.reject(new Error("Factory for windowType " + windowType + " not registered."));
        }
        delete this._peerFactoriesRegisteredByUs[windowType];
        return this._gw3Session.send({
            type: gwMessageRemovePeerFactories,
            factory_ids: [windowType]
        }).then(function () {
            _this.invokeCallbacks(_this._windowTypeStatusChangeCallbacks, new entityEvent_1.EntityEvent(new windowType_1.default(windowType, undefined), new entityEvent_1.EntityEventContext(entityEvent_1.EntityEventType.Removed)), gwMessageAddPeerFactories);
        });
    };
    GW3Bridge.prototype.onActivityStatusChange = function (callback) {
        this._activityChangeCallbacks.push(callback);
    };
    GW3Bridge.prototype.initiateActivity = function (activityType, context, configuration) {
        var _this = this;
        return this.sendCreateAndMapResultingMessagesToPromise({
            type: gwMessageCreateActivity,
            activity_type: activityType,
            initial_context: context,
            configuration: configuration && configuration.map(function (wd) { return ({ type: wd.type, name: wd.name, configuration: wd }); })
        }, gwMessageActivityInitiated, function (msg, requestId) { return msg.request_id === requestId; }, gwMessageActivityCreated, function (msg, requestId, initMsg) { return msg.activity_id === initMsg.activity_id; }, gwMessageActivityDestroyed, function (msg, requestId, initMsg) { return msg.activity_id === initMsg.activity_id; }, function (msg) { return msg.activity_id; }).then(function (id) {
            if (_this._config.mode === "trackMyTypeAndInitiatedFromMe") {
                if (!_this._activityTypesInitiatedFromMe[activityType]) {
                    _this._activityTypesInitiatedFromMe[activityType] = true;
                    return _this._gw3Session
                        .send({
                        type: "subscribe",
                        activity_types: [activityType]
                    })
                        .then(function () {
                        return id;
                    });
                }
            }
            return id;
        });
    };
    GW3Bridge.prototype.stopActivity = function (activity) {
        return this._gw3Session.send({
            type: gwMessageDestroyActivity,
            activity_id: activity.id,
            // #deleteme TODO: reason
            reason_uri: "com.tick42.glue.activity.constants.destroyReason.general",
            reason: "Destroying activity"
        }).then(function (_) { return true; });
    };
    GW3Bridge.prototype.updateActivityContext = function (activity, context, fullReplace, removedKeys) {
        if (fullReplace) {
            // this will currently fail on GW3
            return this._contexts.set(activity.id, context);
        }
        else {
            removedKeys = removedKeys || [];
            for (var _i = 0, removedKeys_1 = removedKeys; _i < removedKeys_1.length; _i++) {
                var x = removedKeys_1[_i];
                context[x] = null;
            }
            return this._contexts.update(activity.id, context);
        }
    };
    GW3Bridge.prototype.announceWindow = function (windowType, activityWindowId) {
        // in the GW3 case we are only joined to an activity after we announce ourselves
        // so all announcement calls should go in 'registerWindow', not here
        // (registerWindow registers a window that's not part of an activity, at least yet)
        throw new Error("Invalid operation 'announceWindow' for GW3 protocol");
    };
    GW3Bridge.prototype.registerWindow = function (type, name, independent) {
        var shouldSendReady = this._connection.gatewayToken;
        var peerId = this._connection.peerId;
        if (shouldSendReady) {
            this._gw3Session.send({
                type: gwMessageReady,
            });
        }
        this.invokeCallbacks(this._activityWindowChangeCallbacks, new entityEvent_1.EntityEvent(new activityWindow_1.default(peerId, name, type, undefined, undefined, independent, this.generateWindowGetter(peerId), undefined), new entityEvent_1.EntityEventContext(entityEvent_1.EntityEventType.Added)), "register window");
        return Promise.resolve(peerId);
    };
    GW3Bridge.prototype.onActivityWindowChange = function (callback) {
        this._activityWindowChangeCallbacks.push(callback);
    };
    GW3Bridge.prototype.createWindow = function (activityId, windowDefinition) {
        var _this = this;
        // if the user hasn't provided a layout option but has some of left,top,width,height
        // insert a layout
        if (!windowDefinition.layout) {
            if (windowDefinition.left || windowDefinition.width || windowDefinition.height || windowDefinition.top) {
                windowDefinition.layout = {
                    mode: "pixels",
                    cellSize: 1,
                };
            }
        }
        return this.sendCreateAndMapResultingMessagesToPromise({
            type: gwMessageCreatePeer,
            peer_type: windowDefinition.type,
            configuration: windowDefinition,
            activity_id: activityId,
        }, undefined, undefined, gwMessagePeerCreated, function (msg, requestId) { return msg.request_id === requestId; }, undefined, undefined, function (msg) { return msg.created_id; })
            .then(function (id) {
            return _this.joinActivity(activityId, id)
                .then(function () {
                return id;
            });
        });
    };
    GW3Bridge.prototype.closeWindow = function (id) {
        return this._gw3Session.send({
            destroy_peer_id: id
        }).then(function (_) { return undefined; });
    };
    GW3Bridge.prototype.getAnnouncementInfo = function () {
        var activityId = this._config.activityId || (this._config.announcementInfo && this._config.announcementInfo.activityId);
        var activityWindowType = (this._config.announcementInfo && this._config.announcementInfo.activityWindowType);
        var activityWindowIndependent = (this._config.announcementInfo && this._config.announcementInfo.activityWindowIndependent);
        var activityWindowName = (this._config.announcementInfo && this._config.announcementInfo.activityWindowName);
        if (typeof window !== "undefined" &&
            typeof window.location !== "undefined" &&
            window.location.search &&
            typeof URLSearchParams === "function") {
            var searchParams = new URLSearchParams(location.search.slice(1));
            activityWindowType = activityWindowType || searchParams.get("t42PeerType");
            activityWindowType = activityWindowType || searchParams.get("t42ActivityWindowType");
            if (typeof activityWindowIndependent === "undefined") {
                activityWindowIndependent = searchParams.get("t42ActivityWindowIndependent");
            }
            activityWindowName = activityWindowName || searchParams.get("t42ActivityWindowName");
            activityId = activityId || searchParams.get("t42ActivityId");
        }
        activityWindowType = activityWindowType || "unknown";
        activityWindowIndependent = activityWindowIndependent || false;
        activityWindowName = activityWindowName || this._connection.peerId;
        return {
            activityWindowId: undefined,
            activityId: activityId,
            activityWindowType: activityWindowType,
            activityWindowIndependent: activityWindowIndependent,
            activityWindowName: activityWindowName,
        };
    };
    GW3Bridge.prototype.joinActivity = function (activityId, windowId) {
        var _this = this;
        return this._gw3Session.send({
            type: gwMmessageJoinActivity,
            target_id: windowId,
            activity_id: activityId
        }).then(function () {
            _this.invokeCallbacks(_this._activityWindowChangeCallbacks, new entityEvent_1.EntityEvent(new activityWindow_1.default(windowId, undefined, undefined, activityId, undefined, undefined, _this.generateWindowGetter(windowId), undefined), new entityEvent_1.EntityEventContext(entityEvent_1.EntityEventType.ActivityWindowJoinedActivity)), "activity joined - ActivityWindow");
            _this.invokeCallbacks(_this._activityChangeCallbacks, new entityEvent_1.EntityEvent(new activity_1.default(activityId, undefined, new activityStatus_1.ActivityStatus("created", undefined, undefined), undefined, undefined), new entityEvent_1.EntityEventContext(entityEvent_1.EntityEventType.Updated)), "activity joined - Activity");
        });
    };
    GW3Bridge.prototype.leaveActivity = function (activityId, windowId) {
        var _this = this;
        return this._gw3Session.send({
            type: gwMessageLeaveActivity,
            target_id: windowId,
            activity_id: activityId
        }).then(function () {
            _this.invokeCallbacks(_this._activityWindowChangeCallbacks, new entityEvent_1.EntityEvent(new activityWindow_1.default(windowId, undefined, undefined, null, undefined, undefined, _this.generateWindowGetter(windowId), undefined), new entityEvent_1.EntityEventContext(entityEvent_1.EntityEventType.ActivityWindowLeftActivity)), "activity left - ActivityWindow");
            _this.invokeCallbacks(_this._activityChangeCallbacks, new entityEvent_1.EntityEvent(new activity_1.default(activityId, undefined, new activityStatus_1.ActivityStatus("created", undefined, undefined), undefined, undefined), new entityEvent_1.EntityEventContext(entityEvent_1.EntityEventType.Updated)), "activity left - Activity");
        });
    };
    // purposefully returning empty arrays
    GW3Bridge.prototype.getActivityTypes = function () {
        return Promise.resolve([]);
    };
    GW3Bridge.prototype.getWindowTypes = function () {
        return Promise.resolve([]);
    };
    GW3Bridge.prototype.getActivities = function () {
        return Promise.resolve([]);
    };
    GW3Bridge.prototype.getActivityWindows = function () {
        return Promise.resolve([]);
    };
    // N/A
    // #deleteme TODO: ignore for now
    // POSTPONED
    GW3Bridge.prototype.createStackedWindows = function (id, windowDefinitions, timeout) {
        return undefined;
    };
    // POSTPONED
    GW3Bridge.prototype.getWindowBounds = function (id) {
        return undefined;
    };
    // POSTPONED
    GW3Bridge.prototype.setWindowBounds = function (id, bounds) {
        return undefined;
    };
    // POSTPONED
    GW3Bridge.prototype.activateWindow = function (id, focus) {
        return undefined;
    };
    // POSTPONED
    GW3Bridge.prototype.setWindowVisibility = function (id, visible) {
        return undefined;
    };
    // POSTPONED
    GW3Bridge.prototype.cloneActivity = function (id, cloneOptions) {
        return undefined;
    };
    // POSTPONED
    GW3Bridge.prototype.attachActivities = function (from, to, tag) {
        return this._gw3Session.send({
            type: gwNmessageMergeActivities,
            into: to,
            merge: from
        });
    };
    // POSTPONED
    GW3Bridge.prototype.detachActivities = function (activityId, newActivityInfo) {
        return this._gw3Session.send({
            type: gwMessageSplitActivities,
            from: activityId,
        }).then(function () { return ""; });
    };
    // POSTPONED
    GW3Bridge.prototype.onActivitiesAttached = function (callback) {
        // POSTPONED
    };
    // POSTPONED
    GW3Bridge.prototype.onActivitiesDetached = function (callback) {
        // POSTPONED
    };
    GW3Bridge.prototype.onActivityAttachedDescriptorsRefreshed = function (callback) {
        // POSTPONED
    };
    // POSTPONED
    GW3Bridge.prototype.getAttachedDescriptors = function () {
        return Promise.resolve([]);
    };
    // helpers
    // Protocol handling
    GW3Bridge.prototype.getRandomRequestId = function () {
        return this._connection.peerId + ":" + Math.floor(Math.random() * 1e9) + "";
    };
    GW3Bridge.prototype.forwardAddedAndRemovedMessagesToEventHandler = function (addedMessageType, removedMessageType, mapper, handlers) {
        var getGetEntityEvent = function (isAdded) { return function (entity) { return new entityEvent_1.EntityEvent(entity, new entityEvent_1.EntityEventContext(isAdded ?
            entityEvent_1.EntityEventType.Added :
            entityEvent_1.EntityEventType.Removed)); }; };
        var sub1;
        var sub2;
        sub1 = addedMessageType && this.forwardMessageToEventHandler(addedMessageType, function (msg) { return mapper(msg, true); }, getGetEntityEvent(true), handlers);
        sub2 = removedMessageType && this.forwardMessageToEventHandler(removedMessageType, function (msg) { return mapper(msg, false); }, getGetEntityEvent(false), handlers);
        return [sub1, sub2].filter(function (x) { return x; });
    };
    GW3Bridge.prototype.forwardMessageToEventHandler = function (messageType, mapper, getEntityEvent, handler) {
        return this.subscribe(messageType, function (msg) {
            mapper(msg)
                .forEach(function (ent) {
                return handler.forEach(function (h) { return h(getEntityEvent(ent, msg)); });
            });
        });
    };
    GW3Bridge.prototype.sendCreateAndMapResultingMessagesToPromise = function (msg, initiatedMessageType, initiatedMessageFilter, createdMessageType, createdMessageFilter, cancelledMessageType, cancelledMessageFilter, createdMessageToPromiseResolution) {
        var _this = this;
        var reqId = this.getRandomRequestId();
        var resolveCreatedPromise;
        var rejectCreatedPromise;
        var createdPromise = new Promise(function (resolve, reject) {
            resolveCreatedPromise = resolve;
            rejectCreatedPromise = reject;
        });
        var initiatedMessageAck = null;
        var initiatedSubscription;
        var createdSubscription;
        var cancelledSubscription;
        var errorSubscription;
        var dropSubscriptions = function () {
            _this.dropSubscription(initiatedSubscription);
            _this.dropSubscription(createdSubscription);
            _this.dropSubscription(cancelledSubscription);
            _this.dropSubscription(errorSubscription);
        };
        initiatedSubscription = initiatedMessageType &&
            this.subscribe(initiatedMessageType, function (msg4) {
                if (!initiatedMessageFilter(msg4, reqId)) {
                    return;
                }
                initiatedMessageAck = msg4;
                _this.dropSubscription(initiatedSubscription);
            });
        createdSubscription =
            this.subscribe(createdMessageType, function (msg1) {
                if (!createdMessageFilter(msg1, reqId, initiatedMessageAck)) {
                    return;
                }
                resolveCreatedPromise(createdMessageToPromiseResolution(msg1));
                // #deleteme TODO review
            });
        cancelledSubscription = cancelledMessageType &&
            this.subscribe(cancelledMessageType, function (msg2) {
                if (!cancelledMessageFilter(msg2, reqId, initiatedMessageAck)) {
                    return;
                }
                rejectCreatedPromise(msg2);
                // #deleteme TODO review
            });
        errorSubscription = cancelledMessageType &&
            this.subscribe(gwMmessageError, function (msg3) {
                if (msg3.request_id !== reqId) {
                    return;
                }
                rejectCreatedPromise(msg3);
                // #deleteme TODO review
            });
        msg.request_id = reqId;
        // #deleteme TODO: review promise chains/callbacks
        var toReturn = this._gw3Session
            .send(msg)
            .then(function () {
            return createdPromise;
        });
        toReturn.then(dropSubscriptions, dropSubscriptions);
        return toReturn;
    };
    // Entity Mapping
    GW3Bridge.prototype.peerFactoryIdAndOwnerIdToWindowType = function (factoryId, ownerId) {
        var peerType = this._peerIdAndFactoryIdToPeerType[ownerId + ":" + factoryId];
        if (!peerType) {
            return null;
        }
        else {
            return new windowType_1.default(peerType, undefined);
        }
    };
    GW3Bridge.prototype.subscribe = function (messageType, handler) {
        var _this = this;
        var sub = this._connection.on(
        // #deleteme TODO:  first arg
        "js-activity", messageType, function (msg) { return handler.bind(_this)(msg); });
        this._gw3Subscriptions.push(sub);
        return sub;
    };
    GW3Bridge.prototype.dropSubscription = function (subscription) {
        if (subscription) {
            this._connection.off(subscription);
            delete this._gw3Subscriptions[this._gw3Subscriptions.indexOf(subscription)];
        }
    };
    GW3Bridge.prototype.invokeCallbacks = function (callbacks, event, description) {
        var _this = this;
        callbacks.forEach(function (cb) {
            try {
                cb(event);
            }
            catch (err) {
                _this._logger.error("Error in " + (description || event.context.type) + " callback: " + JSON.stringify(err));
            }
        });
    };
    GW3Bridge.prototype.handleActivityCreatedMessage = function (msg) {
        if (!msg.context_id) {
            this._logger.error("Activity created with unknown context_id: " + msg.activity_id);
        }
        else {
            this.subscribeToContext(msg);
        }
    };
    GW3Bridge.prototype.subscribeToContext = function (msg) {
        var _this = this;
        var activityId = msg.activity_id;
        this._contextSubscriptions[activityId] =
            this._contexts.subscribe(activityId, function (data) {
                var event = new entityEvent_1.EntityEvent(new activity_1.default(activityId, undefined, undefined, data, undefined), new entityEvent_1.ActivityContextChangedEventContext(data));
                _this.invokeCallbacks(_this._activityChangeCallbacks, event, "context updated");
            });
    };
    GW3Bridge.prototype.handleActivityDestroyedMessage = function (msg) {
        var unsubscribeContext = this._contextSubscriptions[msg.activity_id];
        if (typeof unsubscribeContext === "function") {
            unsubscribeContext();
        }
        delete this._contextSubscriptions[msg.activity_id];
    };
    GW3Bridge.prototype.handlePeerFactoriesAdded = function (msg) {
        var _this = this;
        msg.factories.forEach(function (entity) {
            _this._peerIdAndFactoryIdToPeerType[msg.owner_id + ":" + entity.id] = entity.peer_type;
        });
    };
    GW3Bridge.prototype.handlePeerFactoriesRemoved = function (msg) {
        var _this = this;
        msg.factory_ids.forEach(function (factoryId) {
            delete _this._peerIdAndFactoryIdToPeerType[msg.owner_id + ":" + factoryId];
        });
    };
    GW3Bridge.prototype.forwardActivityTypeMessagesToStatusEventHandlers = function () {
        this.forwardAddedAndRemovedMessagesToEventHandler(gwMmessageActivityTypesAdded, gwMessageActivityTypesRemoved, function (msg, isAdded) { return isAdded
            ? msg.types.map(function (t) { return GW3Bridge.activityTypeGwMessageEntityToActivityType(t, undefined); })
            : msg.types.map(function (t) { return new activityType_1.default(t.name, undefined, undefined, undefined); }); }, this._activityTypeStatusChangeCallbacks);
    };
    GW3Bridge.prototype.forwardActivityCreatedAndJoinedActivityToActivityWindowEventHandlers = function () {
        var _this = this;
        // if we're created as part of this activity, the JOINED ACTIVITY is
        // the first time we'll hear about it; so let's record the participants
        for (var _i = 0, _a = [gwMessageActivityCreated, gwMessageJoinedActivity]; _i < _a.length; _i++) {
            var activityCreatedMessage = _a[_i];
            this.forwardMessageToEventHandler(activityCreatedMessage, function (msg) {
                return ([msg.owner])
                    .concat(msg.participants || [])
                    .map(function (info) { return new activityWindow_1.default(info.peer_id, info.name, info.type, msg.activity_id, undefined, undefined, _this.generateWindowGetter(info.peer_id), undefined); });
            }, function (ent, msg) { return new entityEvent_1.EntityEvent(ent, new entityEvent_1.EntityEventContext(entityEvent_1.EntityEventType.ActivityWindowJoinedActivity)); }, this._activityWindowChangeCallbacks);
        }
    };
    GW3Bridge.prototype.forwardActivityMessagesToStatusEventHandlers = function () {
        // see dot-net-activity\Activity\ActivityState.cs
        for (var _i = 0, _a = [gwMessageActivityCreated, gwMessageJoinedActivity]; _i < _a.length; _i++) {
            var createdMessage = _a[_i];
            this.forwardMessageToEventHandler(createdMessage, function (msg) { return [GW3Bridge.activityGwMessageToActivity(msg, new activityStatus_1.ActivityStatus("started" /* #deleteme todo */, "", new Date()))]; }, function (ent, msg) { return GW3Bridge.activityToActivityStatusChangeEvent(ent); }, this._activityChangeCallbacks);
        }
        this.forwardMessageToEventHandler(gwMessageActivityDestroyed, function (msg) { return [GW3Bridge.activityGwMessageToActivity(msg, new activityStatus_1.ActivityStatus("destroyed" /* #deleteme todo */, msg.reason, new Date()))]; }, function (ent, msg) { return GW3Bridge.activityToActivityStatusChangeEvent(ent); }, this._activityChangeCallbacks);
        this.forwardMessageToEventHandler(gwMessageActivityInitiated, function (msg) { return [GW3Bridge.activityGwMessageToActivity(msg, new activityStatus_1.ActivityStatus("created" /* #deleteme todo */, "", new Date()))]; }, function (ent, msg) { return GW3Bridge.activityToActivityStatusChangeEvent(ent); }, this._activityChangeCallbacks);
    };
    GW3Bridge.prototype.forwardPeerFactoryMessagesToStatusEventHandlers = function () {
        var _this = this;
        this.forwardAddedAndRemovedMessagesToEventHandler(gwMessagePeerFactoriesAdded, gwMessagePeerFactoriesRemoved, function (msg, isAdded) { return isAdded
            ? msg.factories.map(GW3Bridge.peerFactoryGwMessageEntityToWindowType)
            : msg.factory_ids.map(function (id) { return _this.peerFactoryIdAndOwnerIdToWindowType(id, msg.owner_id); }).filter(function (x) { return x != null; }); }, this._windowTypeStatusChangeCallbacks);
    };
    GW3Bridge.prototype.forwardPeerFactoryMessagesToPeerFactoryRequests = function () {
        var _this = this;
        this.subscribe(gwMessagePeerRequested, function (msg) {
            var factory = _this._peerFactoriesRegisteredByUs[msg.peer_factory];
            if (!factory) {
                _this._gw3Session.send({
                    type: gwMmessageError,
                    request_id: msg.request_id,
                    reason: "Unknown peer factory " + msg.peer_factory
                });
                return;
            }
            try {
                var configuration = msg.configuration || {};
                // NB: peer factories (or whoever they're delegating to) need to support whatever activity
                // environment (GW3, HC) we're targeting when they're creating peers
                // the manager is env agnostic, the bridge will augment the configuration with whatever's required
                // NB: also, since peers are requested in two ways (single peer with just its configuration,
                // or peer created as part of new activity, where the factory receives the aggregate config of
                // all peers, combined from ADD ACTIVITY TYPE and CREATE ACTIVITY), the peer factories need to
                // be able to handle both configuration structures intelligently.
                configuration.gateway_token = configuration.gateway_token || msg.gateway_token;
                configuration.peer_factory = configuration.peer_factory || msg.peer_factory;
                var promise = factory.create({
                    activityId: msg.activity.id,
                    type: msg.activity.type,
                    gwToken: configuration.gateway_token,
                    configuration: configuration,
                });
                if (promise && promise.then && promise.catch) {
                    promise.catch(function (err) { return _this._gw3Session.send({
                        type: gwMmessageError,
                        request_id: msg.request_id,
                        reason: err && (err.message || JSON.stringify(err))
                    }); });
                }
            }
            catch (err) {
                _this._gw3Session.send({
                    type: gwMmessageError,
                    request_id: msg.request_id,
                    reason: err && (err.message || JSON.stringify(err))
                });
            }
        });
    };
    GW3Bridge.prototype.forwardActivityWindowMessagesToEventHandlers = function () {
        var _this = this;
        var _loop_1 = function (joinedMessage) {
            this_1.subscribe(joinedMessage, function (msg) {
                var joinedId = (joinedMessage === gwMessageActivityJoined) ? msg.joined_id : msg.peer_id;
                var joinedType = (joinedMessage === gwMessageActivityJoined) ? msg.joined_type : msg.peer_type;
                var joinedName = (joinedMessage === gwMessageActivityJoined) ? msg.joined_name : msg.peer_name;
                var entity = new activityWindow_1.default(joinedId, joinedName, joinedType /* for ACTIVITY JOINED */, msg.activity_id, undefined, undefined, _this.generateWindowGetter(joinedId), undefined);
                if (!_this._contextSubscriptions[msg.activity_id]) {
                    _this.subscribeToContext(msg);
                }
                _this.invokeCallbacks(_this._activityWindowChangeCallbacks, new entityEvent_1.EntityEvent(entity, new entityEvent_1.EntityEventContext(entityEvent_1.EntityEventType.ActivityWindowJoinedActivity)), joinedMessage);
            });
        };
        var this_1 = this;
        for (var _i = 0, _a = [gwMessageActivityJoined, gwMessageJoinedActivity]; _i < _a.length; _i++) {
            var joinedMessage = _a[_i];
            _loop_1(joinedMessage);
        }
        this.subscribe(gwMessageActivityLeft, function (msg) {
            var entity = new activityWindow_1.default(msg.left_id, undefined, undefined, null, undefined, undefined, _this.generateWindowGetter(msg.left_id), undefined);
            _this.invokeCallbacks(_this._activityWindowChangeCallbacks, new entityEvent_1.EntityEvent(entity, new entityEvent_1.EntityEventContext(entityEvent_1.EntityEventType.ActivityWindowLeftActivity)), gwMessageActivityLeft);
        });
        this.forwardAddedAndRemovedMessagesToEventHandler(gwMessagePeerCreated, undefined, function (msg) { return [
            new activityWindow_1.default(msg.created_id, undefined /* #deleteme TODO:  we should know the name if any */, undefined /* #deleteme TODO:  we should know the type */, undefined, undefined, undefined, _this.generateWindowGetter(msg.created_id), undefined)
        ]; }, this._activityWindowChangeCallbacks);
    };
    GW3Bridge.prototype.generateWindowGetter = function (peerId) {
        var _this = this;
        return function () {
            var server = _this._config.agm.servers().filter(function (s) { return s.peerId === peerId; })[0];
            if (!server) {
                return;
            }
            var windowId = server.windowId;
            return _this._config.windows.list().filter(function (w) { return w.id === windowId; })[0];
        };
    };
    return GW3Bridge;
}());
exports.default = GW3Bridge;
//# sourceMappingURL=gw3Bridge.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(28)))

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var entityEvent_1 = __webpack_require__(2);
var activityType_1 = __webpack_require__(10);
var promiseExtensions_1 = __webpack_require__(8);
var readyMarker_1 = __webpack_require__(18);
var entityObservableCollection_1 = __webpack_require__(47);
var logger_1 = __webpack_require__(3);
var util = __webpack_require__(0);
var localWindowFactory_1 = __webpack_require__(45);
var entityEvent_2 = __webpack_require__(2);
var hcBridge_1 = __webpack_require__(13);
var ActivityManager = /** @class */ (function () {
    function ActivityManager(bridge, autoAnnounce, windows) {
        var _this = this;
        this._logger = logger_1.Logger.Get("activityManager");
        this._announcedWindows = [];
        this._attachedCallbacks = [];
        this._detachedCallbacks = [];
        this._frameColorChangesCallbacks = [];
        this._bridge = bridge;
        this._activityTypes = new entityObservableCollection_1.EntityObservableCollection(function (e) { return _this._grabEntity(e); });
        this._windowTypes = new entityObservableCollection_1.EntityObservableCollection(function (e) { return _this._grabEntity(e); });
        this._activities = new entityObservableCollection_1.EntityObservableCollection(function (e) { return _this._grabEntity(e); });
        this._windows = new entityObservableCollection_1.EntityObservableCollection(function (e) { return _this._grabEntity(e); });
        // signals to wait for - get AT, get WT, get Activities and get Windows
        this._dataReadyMarker = new readyMarker_1.ReadyMarker("Activity Manager Data", ["GetActivityTypes", "GetWindowTypes", "GetActivities", "GetWindows"].length);
        this._descriptorsMarker = new readyMarker_1.ReadyMarker("Attached Activities Descriptors", ["GetDescriptors"].length);
        // waiting for activity data first
        // NB: in the GW3 case, we don't have the ability to request data at will
        // but need wait for delta messages
        // So GW3Bridge returns empty arrays from the get() calls
        // We're relying on the fact that the GW3 "domain joined" ACK message
        // will only arrive after we got all activity state,
        // so when the bridge.ready() promise resolves, we already have the data;
        // then _getInitialData() will be called and only then will _dataReadyMarker resolve
        if (autoAnnounce) {
            // if auto announce replace the ready marker, so:
            // 1) wait for data
            // 2) get descriptors
            // 3) announce the current window
            this._readyMarker = new readyMarker_1.ReadyMarker("Activity Manager Announce", ["Announcement"].length);
            this._dataReadyMarker.setCallback(function (dataErr) {
                if (dataErr) {
                    _this._readyMarker.error(dataErr);
                }
                _this._descriptorsMarker.setCallback(function (err) {
                    if (err) {
                        _this._readyMarker.error(err);
                    }
                    _this._logger.debug("Auto announcing window");
                    // signal no matter if it failed or not
                    _this.announceWindow()
                        .then(function (w) {
                        // NB: this creates glue.activities.my.window
                        _this._announcedWindows.push(w);
                        _this._readyMarker.signal("Successfully announced window with id '" + w.id + "'");
                    })
                        .catch(function (errCatch) {
                        _this._logger.debug("Will not announce window - " + errCatch);
                        _this._readyMarker.signal();
                    });
                });
                _this.refreshDescriptors();
            });
        }
        else {
            // TODO: not sure if this still works
            this._readyMarker = this._dataReadyMarker;
        }
        this._bridge.onActivitiesAttached(function (e) {
            _this._handleActivitiesAttached(e);
        });
        this._bridge.onActivitiesDetached(function (e) {
            _this._handleActivitiesDetached(e);
        });
        this._bridge.onActivityAttachedDescriptorsRefreshed(function (e) {
            _this._handleActivityDescriptorsRefreshed(e);
        });
        if (windows) {
            windows.onWindowFrameColorChanged(this._handleWindowFrameColorChanged.bind(this));
        }
        // initialize the bridge
        this._bridge.init();
        // NB: there is no race condition here.
        // Since browser/Node JS is a single-threaded environment, assuming no events on _bridge
        // fire inside .init(), this subscribe will catch anything that comes between it and the init() call
        this._subscribeForData();
        // NB: in GW3 case, the initial state messages after a JOIN come in before the JOIN's SUCCESS
        // message (see https://confluence.tick42.com:8443/display/TD/Global+Gateway+Domain#GlobalGatewayDomain-JOIN)
        // so the .ready().then() callback will only get invoked after we've received the initial domain
        // state. We need to be ready to handle events before that, hence the _subscribeForData() above.
        // wait for it to become ready and then start getting/subscribing for data
        this._bridge
            .ready()
            .then(function (aw) {
            _this._getInitialData();
        })
            .catch(function (error) {
            // tslint:disable-next-line
            console.log(error);
        });
    }
    Object.defineProperty(ActivityManager.prototype, "usingHc", {
        get: function () {
            return this._bridge.bridgeType === "HC";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityManager.prototype, "announcedWindows", {
        get: function () {
            return this._announcedWindows;
        },
        set: function (v) {
            throw new Error("not allowed");
        },
        enumerable: true,
        configurable: true
    });
    ActivityManager.prototype.ready = function (callback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this._readyMarker.setCallback(function (err) {
                if (!err) {
                    resolve(_this);
                }
                else {
                    reject(_this._readyMarker.getError());
                }
            });
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    /**
     * @returns All known activity types
     */
    ActivityManager.prototype.getActivityTypes = function () {
        return this._activityTypes.get();
    };
    /**
     * Gets ActivityType by name
     * @param name  Name to search for
     * @returns     If found the @type ActivityType; otherwise undefined
     */
    ActivityManager.prototype.getActivityType = function (name) {
        return this._activityTypes.getByName(name);
    };
    /**
     * Registers a new activity type
     * @param activityTypeName      The name of the activity type to be created
     * @param ownerWindowType       The type of the owner window or a WindowDefinition for the owner window
     * @param helperWindowTypes     Types of helper windows (or WindowDefinitions for helper windows) for that activity type
     * @param config                (HC only, deprecated) Layout config
     * @param description           (HC only, deprecated) Description for the new activity type
     * @param callback              (Optional) Callback for results - if not specified the method will return a promise
     */
    ActivityManager.prototype.registerActivityType = function (activityTypeName, ownerWindowType, helperWindowTypes, config, description, callback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            // activityTypeName checks
            if (util.isUndefinedOrNull(activityTypeName)) {
                reject("activityTypeName argument can not be undefined");
                return;
            }
            if (!util.isString(activityTypeName)) {
                reject("activityTypeName should be string");
                return;
            }
            // check if type is already defined
            var actType = _this.getActivityType(activityTypeName);
            if (!util.isUndefinedOrNull(actType)) {
                reject("Activity type '" + activityTypeName + "' already exists");
                return;
            }
            // ownerWindowType checks
            var ownerDefinition;
            if (util.isUndefined(ownerWindowType)) {
                reject("Owner window type can not be undefined");
                return;
            }
            if (util.isString(ownerWindowType)) {
                ownerDefinition = { type: ownerWindowType, name: "", isIndependent: false, arguments: {} };
            }
            else {
                ownerDefinition = ownerWindowType;
            }
            // helperWindowTypes checks
            var helperDefinitions = [];
            if (!util.isUndefined(helperWindowTypes) && util.isArray(helperWindowTypes)) {
                // tslint:disable-next-line
                for (var index in helperWindowTypes) {
                    var item = helperWindowTypes[index];
                    if (util.isString(item)) {
                        var definition = {
                            type: item,
                            name: "",
                            isIndependent: false,
                            arguments: {},
                            relativeTo: "",
                            relativeDirection: "",
                            windowStyleAttributes: {}
                        };
                        helperDefinitions.push(definition);
                    }
                    else {
                        helperDefinitions.push(item);
                    }
                }
            }
            // redirect to bridge
            _this._bridge
                .registerActivityType(activityTypeName, ownerDefinition, helperDefinitions, config, description)
                .then(function (activityType) {
                // add to from collections
                _this._grabEntity(activityType);
                resolve(activityType);
            })
                .catch(function (error) {
                reject(error);
            });
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    /**
     * Unregister existing activity type
     * @param type The name of the activity type to be removed
     */
    ActivityManager.prototype.unregisterActivityType = function (type, callback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            // check if type is defined
            var actType = _this.getActivityType(type);
            if (util.isUndefined(actType)) {
                reject("Activity type '" + type + "' does not exists");
                return;
            }
            _this._bridge.unregisterActivityType(type).then(function () { return resolve(actType); }, reject);
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    /**
     * Initiates a new activity from the given type.
     * @param activityType  The ActivityType to initiate
     * @param context       The initial context of the activity
     * @param callback      Callback for result
     * @param configuration Optional configuration passed to window/peer factories for the new activity's participants
     * @returns             Promise for activity
     */
    ActivityManager.prototype.initiate = function (activityType, context, callback, configuration) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            // check if type is defined
            var actType = _this.getActivityType(activityType);
            if (util.isUndefined(actType)) {
                reject("Activity type '" + activityType + "' does not exists");
                return;
            }
            _this._bridge
                .initiateActivity(activityType, context, configuration)
                .then(function (actId) {
                _this._activities
                    .getOrWait(actId)
                    .then(function (act) {
                    resolve(act);
                })
                    .catch(function (err) { return reject(err); });
            })
                .catch(function (err) {
                reject(err);
            });
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    ActivityManager.prototype.subscribeActivityTypeEvents = function (handler) {
        this._activityTypes.subscribe(function (at, context) {
            handler(at, context.type);
        });
    };
    /**
     * @returns All known WindowTypes
     */
    ActivityManager.prototype.getWindowTypes = function () {
        return this._windowTypes.get();
    };
    /**
     * Gets WindowType by name
     * @param name  The name of the type @type WindowType
     * @returns     WindowType if found; undefined otherwise
     */
    ActivityManager.prototype.getWindowType = function (name) {
        return this._windowTypes.getByName(name);
    };
    /**
     * Registers a factory for a given WindowType. The factory will be called once window of that type is requested
     * @param windowType   Window type that will be constructed from the factory. Can be a string (name of the window type)
     * or object that has name, description properties
     * @param factoryMethod      The factory that will construct Windows of that type
     * @param description
     * @param callback
     * @param configuration
     * @returns {}
     */
    ActivityManager.prototype.registerWindowFactory = function (windowType, factoryMethod, callback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (util.isUndefinedOrNull(windowType)) {
                reject("no windowType specified");
                return;
            }
            if (util.isObject(windowType)) {
                windowType = windowType.getName();
            }
            else if (!util.isString(windowType)) {
                reject("windowType should be string or object that has getName method");
                return;
            }
            var factory = new localWindowFactory_1.LocalWindowFactory(factoryMethod);
            _this._bridge
                .registerWindowFactory(windowType, factory)
                .then(function (v) {
                resolve(v);
            })
                .catch(function (err) {
                reject(err);
            });
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    /**
     * Unregisters all factories for a given WindowType.
     * @param windowType   Window type that is constructed from the factory.
     * @param callback
     * @returns {}
     */
    ActivityManager.prototype.unregisterWindowFactory = function (windowType, callback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (util.isUndefinedOrNull(windowType)) {
                reject("no windowType specified");
                return;
            }
            if (!util.isString(windowType)) {
                reject("windowType should be a string");
                return;
            }
            _this._bridge
                .unregisterWindowFactory(windowType)
                .then(function (v) {
                resolve(v);
            })
                .catch(function (err) {
                reject(err);
            });
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    /**
     * @returns All started activities
     * @param activityType Can be a string or @type ActivityType. If string a new activityType will be created using the string for name.
     * @returns Array of Activity objects
     */
    ActivityManager.prototype.getActivities = function (activityType) {
        var act = this._activities.get();
        if (!activityType) {
            return act;
        }
        var types = activityType;
        if (util.isString(activityType)) {
            types = [activityType];
        }
        else if (activityType instanceof activityType_1.default) {
            types = [activityType.name];
        }
        else if (activityType instanceof Array) {
            // TODO check if string array or array of ActivityTypes
        }
        else {
            throw new Error("Invalid input argument 'activityType' = " + activityType);
        }
        return act.filter(function (at) {
            var type = at.type;
            return util.some(types, function (t) {
                return type.id === t.id;
            });
        });
    };
    /**
     * Returns Activity by ID
     */
    ActivityManager.prototype.getActivityById = function (id) {
        return this._activities.getByName(id);
    };
    /**
     * Initialises activity for the current window - by doing this the window is announced as activity aware to the other participants
     * @param windowType            Type of window
     * @param activityWindowId      The id of the window that was created
     * @returns {}                  Promise for an activity window (joined to an activity, if the activity creation fails the promise will be rejected)
     */
    ActivityManager.prototype.announceWindow = function (activityWindowId, windowType) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            // get the announcement info from the bridge (e.g. the context in HC) - this will be used if no arguments passed
            var announcementInfo = _this._bridge.getAnnouncementInfo();
            if (util.isUndefined(activityWindowId)) {
                activityWindowId = announcementInfo.activityWindowId;
            }
            if (util.isUndefined(windowType)) {
                windowType = announcementInfo.activityWindowType;
            }
            if (util.isUndefinedOrNull(windowType)) {
                throw new Error("Can not announce - unknown windowType");
            }
            var activityId = announcementInfo && announcementInfo.activityId;
            // We cover two cases here:
            // * no activityWindowId supplied (neither in arguments or announcement info) - in that case we register new window by type. Most of the time this is the case when an independent window is created outside activity
            // * activityWindowId supplied - window created as part of activity creation
            // NB: in GW3, windows are created standalone, and receive 'JOINED' after they send a 'READY'
            // so we always go in 'if' case, not 'else'
            if (util.isUndefinedOrNull(activityWindowId)) {
                _this._logger.debug("Registering window with type:'" + windowType + "', name:'" + announcementInfo.activityWindowName + "', ind.:'" + announcementInfo.activityWindowIndependent + "'");
                // register new window created outside activity
                _this._bridge.registerWindow(windowType, announcementInfo.activityWindowName, announcementInfo.activityWindowIndependent)
                    .then(_this._windows.getOrWait.bind(_this._windows))
                    .then(function (w) {
                    if (activityId) {
                        return _this._activities.getOrWait(activityId).then(function (_) { return w; });
                    }
                    else {
                        return w;
                    }
                })
                    .then(function (w) {
                    resolve(w);
                })
                    .catch(function (err) {
                    _this._logger.error(err);
                });
            }
            else {
                // announce new window created in an activity creation process
                _this._logger.debug("Announcing window with id '" + activityWindowId + "' and type '" + windowType + "'");
                // check if the window is already created -
                var currentWindow = _this._windows.getByName(activityWindowId);
                if (!util.isUndefinedOrNull(currentWindow)) {
                    _this._logger.debug("Window with id '" + activityWindowId + "' already announced - reusing the window");
                    resolve(currentWindow);
                    return;
                }
                // window events handler
                var windowEventHandler_1 = function (a, w, e) {
                    if (activityWindowId === w.id) {
                        if (typeof htmlContainer !== "undefined") {
                            _this._logger.trace("Got HC event for id '" + activityWindowId + "'");
                            resolve(w);
                            _this.unsubscribeWindowEvents(windowEventHandler_1);
                        }
                        else if (e === entityEvent_1.EntityEventType.ActivityWindowJoinedActivity) {
                            var activity = w.activity;
                            if (util.isUndefined(activity)) {
                                reject("UNDEFINED ACTIVITY");
                            }
                            _this._logger.trace("Got joined event for id '" + activityWindowId + "'");
                            resolve(w);
                            _this.unsubscribeWindowEvents(windowEventHandler_1);
                        }
                    }
                };
                _this.subscribeWindowEvents(windowEventHandler_1);
                _this._logger.trace("Waiting for joined event for id '" + activityWindowId + "'");
                _this._bridge.announceWindow(windowType, activityWindowId);
            }
        });
        return promise;
    };
    /**
     * Allows you to subscribe for windows events, e.g. window type registered
     * @param handler   The handler to receive notifications
     * @returns {}
     */
    ActivityManager.prototype.subscribeWindowTypeEvents = function (handler) {
        this._windowTypes.subscribe(function (wt, context) {
            handler(wt, context.type);
        });
    };
    /**
     * Subscribe for activity status events
     * @param handler Handler function that will receive status notifications
     * @returns {}
     */
    ActivityManager.prototype.subscribeActivityEvents = function (handler) {
        var _this = this;
        return this._activities.subscribe(function (act, context) {
            if (context.type === entityEvent_1.EntityEventType.StatusChange) {
                var p = context;
                handler(act, p.newStatus, p.oldStatus);
            }
            // implicitly leave the activity on destroy
            if (context.type === entityEvent_1.EntityEventType.Removed ||
                (context.type === entityEvent_1.EntityEventType.StatusChange &&
                    context.newStatus.getState() === entityEvent_2.ActivityState.Destroyed)) {
                for (var _i = 0, _a = _this._windows.get(); _i < _a.length; _i++) {
                    var window_1 = _a[_i];
                    if (window_1.activity && window_1.activity.id === act.id) {
                        _this._windows.process(new entityEvent_1.EntityEvent(window_1, new entityEvent_1.EntityEventContext(entityEvent_1.EntityEventType.ActivityWindowLeftActivity)));
                    }
                }
            }
        });
    };
    /**
     * Allows you to subscribe for windows events, e.g. window joining to activity
     * @param handler   The handler to receive notifications
     * @returns {}
     */
    ActivityManager.prototype.subscribeWindowEvents = function (handler) {
        return this._windows.subscribe(function (window, context) {
            var eventType = context.type;
            if (eventType === entityEvent_1.EntityEventType.Added) {
                // rename added to opened (because added is misleading - semantically it's the opposite of remove);
                eventType = "opened";
            }
            handler(window.activity, window, eventType);
        });
    };
    ActivityManager.prototype.unsubscribeWindowEvents = function (handler) {
        // this._windows.unsubscribe(handler);
    };
    /**
     * Creates a new window from a given type and joins it to an activity
     *
     * @param activity      Activity to join the window to
     * @param windowType    The window type to join (string or window definition)
     * @param callback      (Optional) Result callback
     * @returns             Promise for ActivityWindow
     */
    ActivityManager.prototype.createWindow = function (activity, windowTypeOrConfiguration, callback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (util.isUndefinedOrNull(windowTypeOrConfiguration)) {
                reject("windowType is undefined");
            }
            var windowDefinition;
            if (util.isString(windowTypeOrConfiguration)) {
                windowDefinition = { type: windowTypeOrConfiguration, name: "", isIndependent: false, arguments: {} };
            }
            else {
                windowDefinition = windowTypeOrConfiguration;
            }
            var relativeToWindow;
            if (!util.isUndefinedOrNull(windowDefinition.relativeTo)) {
                relativeToWindow = windowDefinition.relativeTo;
                if (typeof relativeToWindow === "string") {
                    var windows = _this.getWindows({ type: relativeToWindow });
                    if (!util.isUndefinedOrNull(windows) && windows.length > 0) {
                        windowDefinition.relativeTo = windows[0].id;
                    }
                }
                else if (!util.isUndefinedOrNull(relativeToWindow.type)) {
                    var windows = _this.getWindows({ type: relativeToWindow.type });
                    if (!util.isUndefinedOrNull(windows) && windows.length > 0) {
                        windowDefinition.relativeTo = windows[0].id;
                    }
                }
                else if (!util.isUndefinedOrNull(relativeToWindow.windowId)) {
                    windowDefinition.relativeTo = relativeToWindow.windowId;
                }
            }
            _this._bridge.createWindow(activity && activity.id, windowDefinition)
                .then(function (wid) {
                _this._logger.debug("Window created, waiting for window entity with id " + wid);
                var handler = function (window, context) {
                    // wait until the window has activity property (this means it was joined)
                    if (window.id === wid && (!activity || window.activity)) {
                        _this._logger.debug("Got entity window with id " + wid);
                        resolve(window);
                        _this._windows.unsubscribe(handler);
                    }
                };
                // if we can not get the window right away, wait for event
                _this._windows.subscribe(handler);
            })
                .catch(function (err) {
                reject(err);
            });
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    /**
     * Creates relative windows from a given types and joins them to an activity
     *
     * @param activity               Activity to join relative windows to
     * @param relativeWindowTypes    Relative window types to join (string or window definitions array)
     * @param callback               (Optional) Result callback
     * @returns                      Promise for ActivityWindow
     */
    ActivityManager.prototype.createStackedWindows = function (activity, relativeWindowTypes, timeout, callback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (util.isUndefinedOrNull(activity)) {
                reject("activity is undefined");
            }
            if (util.isUndefinedOrNull(relativeWindowTypes)) {
                reject("relativeWindowTypes is undefined");
            }
            if (!Array.isArray(relativeWindowTypes)) {
                reject("relativeWindowTypes has to be array");
            }
            if (util.isUndefinedOrNull(timeout)) {
                timeout = 20000; // default timeout: 20 seconds
            }
            var relativeWindows = [];
            relativeWindowTypes.forEach(function (element) {
                var windowDefinition;
                if (util.isString(element)) {
                    windowDefinition = { type: element, name: "", isIndependent: false, arguments: {} };
                }
                else {
                    windowDefinition = element;
                }
                var relativeToWindow;
                if (!util.isUndefinedOrNull(windowDefinition.relativeTo)) {
                    // this can not be string, converted in the prev. layer
                    relativeToWindow = windowDefinition.relativeTo;
                    if (!util.isUndefinedOrNull(relativeToWindow.type)) {
                        windowDefinition.relativeTo = relativeToWindow.type;
                    }
                    else if (!util.isUndefinedOrNull(relativeToWindow.windowId)) {
                        var windows = _this.getWindows({ id: relativeToWindow.windowId });
                        if (!util.isUndefinedOrNull(windows) && windows.length > 0) {
                            windowDefinition.relativeTo = windows[0].type.name;
                            windowDefinition.useExisting = true;
                        }
                    }
                }
                relativeWindows.push(windowDefinition);
            });
            _this._bridge.createStackedWindows(activity.id, relativeWindows, timeout)
                .then(function (wid) {
                var activityWindows = [];
                var alreadyCreated = [];
                var handler = function (window, context) {
                    // wait until the window has activity property (this means it was joined)
                    if (wid.indexOf(window.id) >= 0 && alreadyCreated.indexOf(window.id) < 0 && window.activity) {
                        this._logger.debug("Got entity window with id " + wid);
                        activityWindows.push(window);
                        alreadyCreated.push(window.id);
                        if (activityWindows.length === wid.length) {
                            resolve(activityWindows);
                            this._windows.unsubscribe(handler);
                        }
                    }
                }.bind(_this);
                // if we can not get the window right away, wait for event
                _this._windows.subscribe(handler);
            })
                .catch(function (err) {
                reject(err);
            });
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    /**
     * Joins a new window from a given type to the activity
     *
     * @param activity      Activity to join the window to
     * @param window        The window to join
     * @param callback      (Optional) Result callback
     * @returns             Promise for ActivityWindow
     */
    ActivityManager.prototype.addWindowToActivity = function (activity, window, callback) {
        var toReturn = this._bridge.joinActivity(activity.id, window.id)
            .then(function () { return window; });
        promiseExtensions_1.nodeify(toReturn, callback);
        return toReturn;
    };
    /**
     * Removes a window from the activity
     *
     * @param activity  Activity to remove the window from
     * @param           The window to remove
     * @param           (Optional) Result callback
     * @returns         Promise for ActivityWindow
     */
    ActivityManager.prototype.leaveWindowFromActivity = function (activity, window, callback) {
        var toReturn = this._bridge.leaveActivity(activity.id, window.id)
            .then(function () { return window; });
        promiseExtensions_1.nodeify(toReturn, callback);
        return toReturn;
    };
    /**
     * Replaces the activity context
     * @param activity  Activity
     * @param context   The new context
     * @param callback  (Optional) Result callback
     * @returns         Promise for Activity
     */
    ActivityManager.prototype.setActivityContext = function (activity, context, callback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (util.isUndefinedOrNull(activity)) {
                reject("activity can not be null");
            }
            // TODO: duplication with updateActivityContext
            // DONE: verify is the change visible here when 'updateActivityContext' resolves?
            _this._bridge
                .updateActivityContext(activity, context, true)
                .then(function (_) {
                resolve(activity);
            })
                .catch(function (err) {
                reject(err);
            });
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    /**
     * Updates activity context using the properties from  context argument.
     * If old context is {a:1, b:2, c:3} and invoking updateContext({b:3, c:null}) will result a context
     * be {a:1, b:3}
     *
     * @param activity
     * @param context
     * @param callback
     */
    ActivityManager.prototype.updateActivityContext = function (activity, context, callback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (util.isUndefinedOrNull(activity)) {
                reject("activity can not be null");
            }
            var removedKeys = [];
            for (var key in context) {
                if (context.hasOwnProperty(key) && context[key] === null) {
                    removedKeys.push(key);
                }
            }
            for (var _i = 0, removedKeys_1 = removedKeys; _i < removedKeys_1.length; _i++) {
                var removedKey = removedKeys_1[_i];
                delete context[removedKey];
            }
            _this._bridge
                .updateActivityContext(activity, context, false, removedKeys)
                .then(function (_) {
                // DONE: verify is the change already visible here when 'updateActivityContext' resolves?
                resolve(activity);
            })
                .catch(function (err) {
                reject(err);
            });
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    /**
     * Subscribe for activity context update events
     *
     * @param activity  Activity
     * @param handler   Handler function that will receive context related events
     * @returns {}
     */
    ActivityManager.prototype.subscribeActivityContextChanged = function (handler) {
        this._activities.subscribe(function (act, context) {
            if (context.type === entityEvent_1.EntityEventType.ActivityContextChange) {
                var updateContext = context;
                handler(act, act.context);
            }
        });
    };
    /**
     * Stops an activity
     * @returns {}
     */
    ActivityManager.prototype.stopActivity = function (activity, callback) {
        var promise = this._bridge.stopActivity(activity);
        return promiseExtensions_1.nodeify(promise, callback);
    };
    /**
     * Returns activity windows based on some filter. If no filter supplied all activity windows are returned.
     * @param filter  Filter that
     * @returns Array of ActivityWindows that match the filter object
     */
    ActivityManager.prototype.getWindows = function (filter) {
        if (util.isUndefined(filter)) {
            return this._windows.get();
        }
        if (!util.isUndefined(filter.id)) {
            return [this._windows.getByName(filter.id)];
        }
        var allWindows = this._windows.get();
        return allWindows.filter(function (w) {
            if (!util.isUndefined(filter.type) && w.type.id !== filter.type) {
                return false;
            }
            if (!util.isUndefined(filter.name) && w.name !== filter.name) {
                return false;
            }
            if (!util.isUndefined(filter.activityId)) {
                if (util.isUndefinedOrNull(w.activity)) {
                    return false;
                }
                if (w.activity.id !== filter.activityId) {
                    return false;
                }
            }
            return true;
        });
    };
    ActivityManager.prototype.getWindowBounds = function (id) {
        return this._bridge.getWindowBounds(id);
    };
    ActivityManager.prototype.setWindowBounds = function (id, bounds, callback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this._bridge.setWindowBounds(id, bounds)
                .then(function () { return resolve(); })
                .catch(function (err) { return reject(err); });
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    ActivityManager.prototype.closeWindow = function (id) {
        return this._bridge.closeWindow(id);
    };
    ActivityManager.prototype.activateWindow = function (id, focus) {
        return this._bridge.activateWindow(id, focus);
    };
    ActivityManager.prototype.setWindowVisibility = function (id, visible) {
        return this._bridge.setWindowVisibility(id, visible);
    };
    ActivityManager.prototype.clone = function (activity, cloneOptions, callback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (!activity) {
                reject("activity can not be null");
            }
            _this._bridge.cloneActivity(activity.id, cloneOptions)
                .then(function (activityId) {
                _this._activities
                    .getOrWait(activityId)
                    .then(function (act) {
                    resolve(act);
                })
                    .catch(function (err) { return reject(err); });
            })
                .catch(function (err) { return reject(err); });
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    ActivityManager.prototype.attachActivities = function (from, to, tag, callback) {
        var _this = this;
        tag = tag || {};
        var promise = new Promise(function (resolve, reject) {
            var fromActivity = _this._activities.getByName(from);
            if (!fromActivity) {
                reject("can not find activity with id " + from);
                return;
            }
            var toActivity = _this._activities.getByName(to);
            if (!toActivity) {
                reject("can not find activity with id " + to);
                return;
            }
            return _this._bridge.attachActivities(from, to, tag)
                .then(function (data) {
                var newActId = data.to;
                var state = data.descriptor;
                var allStates = data.descriptors;
                _this._activities.getOrWait(newActId).then(function (act) {
                    act._updateDescriptors(allStates);
                    var stateWrapped = act.attached.filter(function (u) { return u.ownerId === state.ownerId; })[0];
                    resolve(stateWrapped);
                });
            })
                .catch(function (err) {
                reject(err);
            });
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    ActivityManager.prototype.detachActivities = function (activityId, descriptor, callback) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            return _this._bridge.detachActivities(activityId, descriptor)
                .then(/*(params)*/ function () {
                // #deleteme TODO: deal with this
                var oldActId = undefined; // params.oldActivityId;
                var newActId = undefined; // params.newActivityId;
                var descriptors = undefined; // params.descriptors;
                _this._activities
                    .getOrWait(oldActId)
                    .then(function (oldAct) {
                    oldAct._updateDescriptors(descriptors);
                    _this._activities
                        .getOrWait(newActId)
                        .then(function (newAct) {
                        resolve(newAct);
                    });
                })
                    .catch(function (err) { return reject(err); });
            })
                .catch(function (err) {
                reject(err);
            });
        });
        return promiseExtensions_1.nodeify(promise, callback);
    };
    ActivityManager.prototype.subscribeActivitiesAttached = function (callback) {
        this._attachedCallbacks.push(callback);
    };
    ActivityManager.prototype.subscribeActivitiesDetached = function (callback) {
        this._detachedCallbacks.push(callback);
    };
    ActivityManager.prototype.subscribeActivityFrameColorChanged = function (callback) {
        this._frameColorChangesCallbacks.push(callback);
    };
    /** Assigns a manager to a given ActivityEntity */
    ActivityManager.prototype._grabEntity = function (entity) {
        entity._manager = this;
    };
    ActivityManager.prototype._getInitialData = function () {
        var _this = this;
        this._logger.debug("Request initial data...");
        // NB: there's no possibility for duplicate entities from events that have come
        // in between _bridge.init() and _bridge.ready()'s resolve, since the ObservableCollections
        // coalesce items by id.
        this._bridge.getActivityTypes()
            .then(function (at) {
            _this._activityTypes.add(at);
            _this._dataReadyMarker.signal("Got act types");
        })
            .catch(function (error) {
            _this._logger.error(error);
            _this._dataReadyMarker.error("Can not initialize ActivityManager - error getting activity types -" + error);
        });
        this._bridge.getWindowTypes()
            .then(function (wt) {
            _this._windowTypes.add(wt);
            _this._dataReadyMarker.signal("Got window types");
        })
            .catch(function (error) {
            _this._logger.error(error);
            _this._dataReadyMarker.error("Can not initialize ActivityManager - error getting window types  " + error);
        });
        this._bridge.getActivities()
            .then(function (ac) {
            _this._activities.add(ac);
            _this._dataReadyMarker.signal("Got activities");
        })
            .catch(function (error) {
            _this._logger.error(error);
            _this._dataReadyMarker.error("Can not initialize ActivityManager - error getting activity instances -" + error);
        });
        this._bridge.getActivityWindows()
            .then(function (aw) {
            _this._windows.add(aw);
            _this._dataReadyMarker.signal("Got windows");
        })
            .catch(function (error) {
            _this._logger.error(error);
            _this._dataReadyMarker.error("Can not initialize ActivityManager - error getting activity windows -" + error);
        });
    };
    ActivityManager.prototype._subscribeForData = function () {
        var _this = this;
        this._logger.debug("Subscribe for data...");
        // NB: there's no possibility for duplicate entities from events that have come
        // in between _bridge.init() and _bridge.ready()'s resolve, since the ObservableCollections
        // coalesce items by id.
        this._bridge.onActivityTypeStatusChange(function (event) {
            _this._activityTypes.process(event);
        });
        this._bridge.onWindowTypeStatusChange(function (event) {
            _this._windowTypes.process(event);
        });
        this._bridge.onActivityStatusChange(function (event) {
            var activity = _this._activities.process(event);
            if (event.context.type === entityEvent_1.EntityEventType.ActivityWindowJoinedActivity &&
                activity &&
                activity.context &&
                _this._bridge instanceof hcBridge_1.default) {
                // for parity with older code which explicitly sent a context update to subscribers
                // upon joining an activity
                _this._activities.process(new entityEvent_1.EntityEvent(activity, new entityEvent_1.ActivityContextChangedEventContext(activity.context)));
            }
        });
        this._bridge.onActivityWindowChange(function (event) {
            _this._windows.process(event);
        });
    };
    ActivityManager.prototype._handleActivitiesAttached = function (data) {
        var _this = this;
        var newActId = data.to;
        var descriptor = data.descriptor;
        var descriptors = data.descriptors;
        this._activities.getOrWait(newActId).then(function (act) {
            act._updateDescriptors(descriptors);
            var descriptorAsObjectFromAPI = act.attached.filter(function (u) { return u.ownerId === descriptor.ownerId; })[0];
            _this._attachedCallbacks.forEach(function (callback) {
                try {
                    callback(act, descriptorAsObjectFromAPI);
                }
                catch (err) {
                    return;
                }
            });
        });
    };
    ActivityManager.prototype._handleActivitiesDetached = function (data) {
        var _this = this;
        var oldActId = data.oldActivityId;
        var newActId = data.newActivityId;
        var descriptors = data.descriptors;
        var descriptor = data.descriptor;
        this._activities.getOrWait(oldActId).then(function (oldAct) {
            oldAct._updateDescriptors(descriptors);
            _this._activities.getOrWait(newActId).then(function (newAct) {
                _this._detachedCallbacks.forEach(function (callback) {
                    try {
                        callback(newAct, oldAct, descriptor);
                    }
                    catch (err) {
                        return;
                    }
                });
            });
        });
    };
    ActivityManager.prototype._handleActivityDescriptorsRefreshed = function (data) {
        var id = data.id;
        var descriptors = data.descriptors;
        var act = this._activities.getByName(id);
        if (act) {
            act._updateDescriptors(descriptors);
        }
    };
    ActivityManager.prototype.refreshDescriptors = function () {
        var _this = this;
        this._bridge.getAttachedDescriptors()
            .then(function (map) {
            // populate descriptors
            if (map) {
                Object.keys(map).forEach(function (key) {
                    var actId = key;
                    var descriptors = map[key];
                    var act = _this._activities.getByName(actId);
                    if (act) {
                        act._updateDescriptors(descriptors);
                    }
                });
            }
            _this._descriptorsMarker.signal("Successfully got descriptors");
        })
            .catch(function (err) {
            _this._descriptorsMarker.error("failed to get descriptors - " + err);
        });
    };
    ActivityManager.prototype._handleWindowFrameColorChanged = function (win) {
        if (!win.activityId) {
            return;
        }
        var act = this._activities.getByName(win.activityId);
        if (!act) {
            return;
        }
        // notify for the owner only
        if (!act.owner) {
            return;
        }
        if (act.owner.underlyingWindow.id !== win.id) {
            return;
        }
        this._frameColorChangesCallbacks.forEach(function (callback) {
            try {
                callback(act, win.frameColor);
            }
            catch (e) {
                return;
            }
        });
    };
    return ActivityManager;
}());
exports.default = ActivityManager;
//# sourceMappingURL=activityManager.js.map

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LocalWindowFactory = /** @class */ (function () {
    function LocalWindowFactory(createFunction) {
        this.createFunction = createFunction;
        this.createFunction = createFunction;
    }
    LocalWindowFactory.prototype.create = function (activityInfo) {
        return this.createFunction(activityInfo);
    };
    return LocalWindowFactory;
}());
exports.LocalWindowFactory = LocalWindowFactory;
//# sourceMappingURL=localWindowFactory.js.map

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AttachedActivityDescriptor = /** @class */ (function () {
    function AttachedActivityDescriptor(manager, ownerActivityId, state) {
        this._manager = manager;
        this._ownerActivityId = ownerActivityId;
        this._state = state;
    }
    Object.defineProperty(AttachedActivityDescriptor.prototype, "ownerId", {
        get: function () {
            return this._state.ownerId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttachedActivityDescriptor.prototype, "windowIds", {
        get: function () {
            return this._state.windowIds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttachedActivityDescriptor.prototype, "frameColor", {
        get: function () {
            return this._state.frameColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttachedActivityDescriptor.prototype, "context", {
        get: function () {
            return this._state.context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttachedActivityDescriptor.prototype, "tag", {
        get: function () {
            return this._state.tag;
        },
        enumerable: true,
        configurable: true
    });
    AttachedActivityDescriptor.prototype.detach = function (descriptor) {
        var _this = this;
        descriptor = descriptor || {};
        var merged = {};
        Object.keys(this._state).forEach(function (prop) {
            merged[prop] = _this._state[prop];
        });
        merged.context = descriptor.context || merged.context;
        merged.frameColor = descriptor.frameColor || merged.frameColor;
        return this._manager.detachActivities(this._ownerActivityId, merged);
    };
    return AttachedActivityDescriptor;
}());
exports.AttachedActivityDescriptor = AttachedActivityDescriptor;
//# sourceMappingURL=attachedActivityDescriptor.js.map

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var entityEvent_1 = __webpack_require__(2);
var entityEvent_2 = __webpack_require__(2);
/**
 * Collection of ActivityEntities that provides change notifications
 * @module entityCollection
 * @private
 */
var EntityObservableCollection = /** @class */ (function () {
    function EntityObservableCollection(processNew) {
        this._items = {};
        this._listeners = [];
        this._processNew = processNew;
    }
    /**
     * Adds one item to the collection
     */
    EntityObservableCollection.prototype.addOne = function (item) {
        this.add([item]);
    };
    /**
     * Adds an array of items to the collection
     */
    EntityObservableCollection.prototype.add = function (items) {
        var _this = this;
        items.forEach(function (element) {
            _this.process(new entityEvent_1.EntityEvent(element, new entityEvent_1.EntityEventContext(entityEvent_1.EntityEventType.Added)));
        });
    };
    /**
     * Process existing EntityEvent
     */
    EntityObservableCollection.prototype.process = function (event) {
        var context = event.context;
        var type = context.type;
        var entity = event.entity;
        // here we're populating some data which particular implementations (e.g.
        // GW3) can't provide
        // TODO: extract these cases into external filters
        // activity status change without old status?
        // grab it from the existing entity
        if (type === entityEvent_1.EntityEventType.StatusChange &&
            !context.oldStatus) {
            var act = this._items[entity.id];
            if (act) {
                context.oldStatus = act.status;
            }
        }
        // the GW3 bridge notifies us of possible status changes (it's mostly stateless so
        // it can't/doesn't distinguish between JOINED ACTIVITY for an activity we already
        // know about vs a brand new activity. for this reason, we just coalesce status
        // updates which indicate the same state.
        if (type === entityEvent_1.EntityEventType.StatusChange &&
            context.oldStatus &&
            context.newStatus &&
            context.oldStatus.state ===
                context.newStatus.state) {
            context.type = entityEvent_1.EntityEventType.Updated;
        }
        // coalesce multiple joined/left events
        //
        if (type === entityEvent_1.EntityEventType.ActivityWindowJoinedActivity &&
            this._items[entity.id] &&
            this._items[entity.id].activity) {
            context.type = entityEvent_1.EntityEventType.Updated;
        }
        if (type === entityEvent_1.EntityEventType.ActivityWindowLeftActivity &&
            this._items[entity.id] &&
            !this._items[entity.id].activity) {
            context.type = entityEvent_1.EntityEventType.Updated;
        }
        // update internal collections (adding the entity or updating existing entity). From that
        // point start using the internalEntity
        // NB: undefined properties are coalesced, null properties represent removals
        var internalEntity = this._updateInternalCollections(entity, type, context);
        this._notifyListeners(internalEntity, context);
        return internalEntity;
    };
    /**
     * Gets all items from the collection.
     */
    EntityObservableCollection.prototype.get = function () {
        var result = [];
        for (var key in this._items) {
            if (this._items.hasOwnProperty(key)) {
                var element = this._items[key];
                result.push(element);
            }
        }
        return result;
    };
    /**
     * Gets item by name/id
     * @param name  Name/id of the item to get
     * @returns     Item if found; undefined if not
     */
    EntityObservableCollection.prototype.getByName = function (name) {
        // this does not work for some reason
        // return this._items[name];
        for (var key in this._items) {
            if (key === name) {
                return this._items[key];
            }
        }
        return undefined;
    };
    /**
     * Gets a item if in the collection or waits for it to appear
     * @param name
     * @returns {Promise<T>}
     */
    EntityObservableCollection.prototype.getOrWait = function (name) {
        var _this = this;
        return new Promise(function (resolve) {
            var entityAddedHandler = function (entity) {
                if (entity.id !== name) {
                    return;
                }
                resolve(entity);
                _this.unsubscribe(entityAddedHandler);
            };
            _this.subscribe(entityAddedHandler);
            // try to get right away - if not here wait for it to appear
            var window = _this.getByName(name);
            if (window) {
                _this.unsubscribe(entityAddedHandler);
                resolve(window);
                return;
            }
        });
    };
    /**
     * Subscribes a listener for changes
     * @param handler Callback for changes
     */
    EntityObservableCollection.prototype.subscribe = function (handler) {
        var _this = this;
        this._listeners.push(handler);
        // replay existing items for new subscribers
        Object.keys(this._items).forEach(function (key) {
            var element = _this._items[key];
            handler(element, new entityEvent_1.EntityEventContext(entityEvent_1.EntityEventType.Added.toString()));
        });
        return function () {
            _this.unsubscribe(handler);
        };
    };
    /**
     *  Unsubscribes a listener
     */
    EntityObservableCollection.prototype.unsubscribe = function (handler) {
        var index = this._listeners.indexOf(handler);
        if (index !== -1) {
            this._listeners.splice(index, 1);
        }
    };
    /**
     * Notify all listeners for some event
     */
    EntityObservableCollection.prototype._notifyListeners = function (entity, context) {
        this._listeners.forEach(function (listener) {
            try {
                listener(entity, context);
            }
            catch (e) {
                return;
            }
        });
    };
    /**
     * Update internal collections (usually after some kind of modification event has arrived)
     */
    EntityObservableCollection.prototype._updateInternalCollections = function (entity, type, context) {
        var entityAsAny = entity;
        // #deleteme TODO: refactor - currently we apply some rules for each type
        var isActivityDestroy = (type === entityEvent_1.EntityEventType.StatusChange &&
            entityAsAny.status &&
            entityAsAny.status.state === entityEvent_2.ActivityState.Destroyed) ||
            (type === entityEvent_1.EntityEventType.StatusChange &&
                context &&
                context.newStatus &&
                context.newStatus.state === entityEvent_2.ActivityState.Destroyed);
        // #deleteme TODO: verify this stuff
        // windows have two states - removed from activity and closed (TODO: this only works in GD 2.1 and later)
        var isWindowClose = type === entityEvent_1.EntityEventType.Closed;
        var isTypeRemove = type === entityEvent_1.EntityEventType.Removed && typeof entityAsAny.isIndependent === "undefined";
        if (isTypeRemove || isWindowClose || isActivityDestroy) {
            var oldEntity = this._items[entity.id];
            delete this._items[entity.id];
            // on remove return the input entity
            this._processNew(entity);
            if (oldEntity) {
                entity._beforeDelete(oldEntity);
            }
            return entity;
        }
        else {
            var key = entity.id;
            // if new object add, otherwise clone object properties
            if (!this._items.hasOwnProperty(key)) {
                this._processNew(entity);
                this._items[entity.id] = entity;
            }
            else {
                this._items[entity.id]._update(entity);
            }
        }
        return this._items[entity.id];
    };
    return EntityObservableCollection;
}());
exports.EntityObservableCollection = EntityObservableCollection;
//# sourceMappingURL=entityObservableCollection.js.map

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var activityModule_1 = __webpack_require__(42);
exports.ActivityModule = activityModule_1.ActivityModule;
//# sourceMappingURL=main.js.map

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var application_1 = __webpack_require__(50);
var callback_registry_1 = __webpack_require__(1);
var instance_1 = __webpack_require__(54);
var AppManagerImpl = /** @class */ (function () {
    function AppManagerImpl(_agm, _activities, _windows, _logger) {
        var _this = this;
        this._agm = _agm;
        this._activities = _activities;
        this._windows = _windows;
        this._logger = _logger;
        this._apps = {};
        this._instances = [];
        this._registry = callback_registry_1.default();
        this.application = function (name) {
            return _this._apps[name];
        };
        this.applications = function () {
            return Object.keys(_this._apps).map(function (k) { return _this._apps[k]; });
        };
        this.instances = function () {
            return _this._instances;
        };
        this.getMyInstance = function () {
            if (typeof glue42gd !== "undefined") {
                // GD3 check
                var instanceId_1 = glue42gd.appInstanceId;
                return _this._instances.filter(function (i) { return i.id === instanceId_1; })[0];
            }
            if (typeof htmlContainer !== "undefined") {
                var myWindowId_1 = htmlContainer.windowId;
                var matchingInstances = _this._instances.filter(function (i) { return i.id === myWindowId_1; });
                if (matchingInstances.length < 2) {
                    return matchingInstances[0];
                }
                // If we have two matches - this can happen only when asking for the window
                // of activity owner - so return the instance that is not activity instance
                return matchingInstances.filter(function (i) { return !i.isActivityInstance; })[0];
            }
            return undefined;
        };
        this.handleAppAdded = function (props) {
            var id = _this._getAppId(props);
            _this._logger.trace("adding app " + id);
            _this._apps[id] = new application_1.default(_this, id, _this._agm);
            var app = _this._updateAppFromProps(props);
            _this._registry.execute("appAdded", app);
        };
        this.handleAppUpdated = function (props) {
            // TODO: check side effects, is this._apps updated?
            var app = _this._updateAppFromProps(props);
            _this._registry.execute("appChanged", app);
        };
        this.handleAppRemoved = function (props) {
            var id = _this._getAppId(props);
            _this._logger.trace("removing app " + id);
            var app = _this.application(id);
            // remove all instances related to the app
            _this._instances = _this._instances.filter(function (i) { return i.application.name !== app.name; });
            delete _this._apps[id];
            _this._registry.execute("appRemoved", app);
        };
        this.handleAppReady = function (props) {
            var id = _this._getAppId(props);
            var app = _this._getAppOrThrow(id);
            app.updateFromProps(props);
            if (app.available) {
                _this._registry.execute("appAvailable", app);
            }
            else {
                _this._registry.execute("appUnavailable", app);
            }
        };
        this.handleInstanceStarted = function (props) {
            _this._logger.trace("started app " + props.Name + " " + props.Id);
            var id = _this._getInstanceId(props);
            var app = _this.application(_this._getInstanceAppName(props));
            var instance = new instance_1.default(id, app, _this, _this._agm, _this._activities, _this._windows);
            _this._updateInstanceFromProps(instance, props);
            _this._instances.push(instance);
            _this._registry.execute("instanceStarted", instance);
        };
        this.handleInstanceStopped = function (props) {
            _this._logger.trace("failed to start app " + props.Name + " " + props.Id);
            var id = _this._getInstanceId(props);
            var appName = _this._getInstanceAppName(props);
            var instance = _this._getInstanceOrThrow(id, appName);
            _this._instances = _this._instances.filter(function (i) { return !_this._matchInstance(i, id, appName); });
            _this._registry.execute("instanceStopped", instance);
            instance.done();
        };
        this.handleInstanceAgmServerReady = function (props) {
            var id = _this._getInstanceId(props);
            var appName = _this._getInstanceAppName(props);
            var instance = _this._getInstanceOrThrow(id, appName);
            instance.updateAgmInstanceFromProps(props);
            _this._registry.execute("instanceAgmServerReady", instance);
        };
        this.handleInstanceStartFailed = function (props) {
            var id = _this._getInstanceId(props);
            var app = _this.application(_this._getInstanceAppName(props));
            var startFailed = true;
            var instance = new instance_1.default(id, app, undefined, undefined, undefined, undefined, startFailed);
            _this._updateInstanceFromProps(instance, props);
            _this._registry.execute("instanceStartFailed", instance);
        };
        this.handleInstanceUpdated = function (props) {
            var id = _this._getInstanceId(props);
            var app = _this._getInstanceAppName(props);
            var instance = _this._getInstanceOrThrow(id, app);
            _this._updateInstanceFromProps(instance, props);
        };
        /** Event subscription methods */
        this.onInstanceStarted = function (callback) {
            _this._replay(_this._instances, callback);
            return _this._registry.add("instanceStarted", callback);
        };
        this.onInstanceStartFailed = function (callback) {
            return _this._registry.add("instanceStartFailed", callback);
        };
        this.onInstanceStopped = function (callback) {
            return _this._registry.add("instanceStopped", callback);
        };
        this.onInstanceUpdated = function (callback) {
            return _this._registry.add("instanceChanged", callback);
        };
        this.onInstanceAgmServerReady = function (callback) {
            return _this._registry.add("instanceAgmServerReady", callback);
        };
        this.onAppAdded = function (callback) {
            _this._replay(_this._apps, callback);
            return _this._registry.add("appAdded", callback);
        };
        this.onAppRemoved = function (callback) {
            return _this._registry.add("appRemoved", callback);
        };
        this.onAppAvailable = function (callback) {
            return _this._registry.add("appAvailable", callback);
        };
        this.onAppUnavailable = function (callback) {
            return _this._registry.add("appUnavailable", callback);
        };
        this.onAppChanged = function (callback) {
            return _this._registry.add("appChanged", callback);
        };
        //
    }
    AppManagerImpl.prototype._getAppOrThrow = function (id) {
        var result = this.application(id);
        if (!result) {
            throw Error("app with id " + id + " not found");
        }
        return result;
    };
    AppManagerImpl.prototype._getAppId = function (props) {
        return props.Name;
    };
    AppManagerImpl.prototype._matchInstance = function (instance, id, appName) {
        return instance.id === id && instance.application.name === appName;
    };
    AppManagerImpl.prototype._getInstanceByIdAndName = function (id, appName) {
        var _this = this;
        return this._instances.filter(function (i) { return _this._matchInstance(i, id, appName); })[0];
    };
    AppManagerImpl.prototype._getInstanceOrThrow = function (id, appName) {
        var result = this._getInstanceByIdAndName(id, appName);
        if (!result) {
            throw Error("instance with id " + id + " not found");
        }
        return result;
    };
    AppManagerImpl.prototype._getInstanceId = function (props) {
        return props.Id;
    };
    AppManagerImpl.prototype._getInstanceAppName = function (props) {
        return props.Name;
    };
    AppManagerImpl.prototype._updateAppFromProps = function (props) {
        var id = this._getAppId(props);
        this._logger.trace("updating app with  + " + id + ", " + props);
        var app = this._getAppOrThrow(id);
        app.updateFromProps(props);
        return app;
    };
    AppManagerImpl.prototype._updateInstanceFromProps = function (instance, props) {
        this._logger.trace("updating instance with " + this._getInstanceId(props) + " for app " + this._getInstanceAppName(props));
        instance.updateFromProps(props);
    };
    AppManagerImpl.prototype._replay = function (itemsToReplay, callback) {
        if (itemsToReplay) {
            // if not array transform to array using Object.values
            if (Array.isArray(itemsToReplay)) {
                itemsToReplay.forEach(function (item) { return callback(item); });
            }
            else {
                var itemsToReplayArr = Object.keys(itemsToReplay).map(function (key) { return itemsToReplay[key]; });
                itemsToReplayArr.forEach(function (item) { return callback(item); });
            }
        }
    };
    return AppManagerImpl;
}());
exports.default = AppManagerImpl;
//# sourceMappingURL=app-manager.js.map

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AgmNames = __webpack_require__(5);
var callback_registry_1 = __webpack_require__(1);
var helper_1 = __webpack_require__(11);
var ApplicationImpl = /** @class */ (function () {
    function ApplicationImpl(_appManager, _name, _agm) {
        // TODO: Replace string events with constants. The string declaration of the registry event name should only ever appear once. Ever. Period.
        var _this = this;
        this._appManager = _appManager;
        this._name = _name;
        this._agm = _agm;
        this._registry = callback_registry_1.default();
        // subscribe for events from app-manager
        _appManager.onInstanceStarted(function (instance) {
            if (instance.application.name !== _this._name) {
                return;
            }
            _this._registry.execute("instanceStarted", instance);
        });
        _appManager.onInstanceStopped(function (instance) {
            if (instance.application.name !== _this._name) {
                return;
            }
            _this._registry.execute("instanceStopped", instance);
        });
        _appManager.onAppRemoved(function (app) {
            if (app.name !== _this._name) {
                return;
            }
            _this._registry.execute("appRemoved", app);
        });
        _appManager.onAppChanged(function (app) {
            if (app.name !== _this._name) {
                return;
            }
            _this._registry.execute("appChanged", app);
        });
        _appManager.onAppAvailable(function (app) {
            if (app.name !== _this._name) {
                return;
            }
            _this._registry.execute("appAvailable", app);
        });
        _appManager.onAppUnavailable(function (app) {
            if (app.name !== _this._name) {
                return;
            }
            _this._registry.execute("appUnavailable", app);
        });
    }
    Object.defineProperty(ApplicationImpl.prototype, "name", {
        get: function () { return this._name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "title", {
        get: function () { return this._props.Title; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "version", {
        get: function () { return this._props.Version; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "autoStart", {
        get: function () { return this._props.AutoStart; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "isShell", {
        get: function () { return this._props.IsShell; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "caption", {
        get: function () { return this._props.Caption; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "hidden", {
        get: function () { return this._props.IsHidden; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "container", {
        get: function () { return this._props.ApplicationName; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "activityType", {
        get: function () { return this._props.ActivityType; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "activityWindowType", {
        get: function () { return this._props.ActivityWindowType; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "windowSettings", {
        get: function () {
            if (!this._props.Arguments) {
                return {};
            }
            return helper_1.objectClone(this._props.Arguments);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "allowMultiple", {
        get: function () { return this._props.AllowMultiple; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "available", {
        get: function () { return this._props.IsReady || false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "icon", {
        get: function () { return this._props.Icon; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "iconURL", {
        get: function () { return this._props.IconUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "sortOrder", {
        get: function () { return this._props.SortOrder; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "userProperties", {
        get: function () {
            if (!this._props.UserProperties) {
                return {};
            }
            return helper_1.objectClone(this._props.UserProperties);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "isActivity", {
        get: function () {
            return this._props.ActivityType !== undefined && this._props.ActivityType !== "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "configuration", {
        get: function () {
            return {
                autoStart: this._props.AutoStart,
                caption: this._props.Caption,
                hidden: this._props.IsHidden,
                container: this._props.ApplicationName,
                activityType: this._props.ActivityType,
                allowMultiple: this._props.AllowMultiple
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "instances", {
        get: function () {
            var _this = this;
            return this._appManager.instances().filter(function (instance) { return instance.application.name === _this._name; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "type", {
        get: function () {
            return this._props.Type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationImpl.prototype, "mode", {
        get: function () {
            if (!this._props) {
                // no info about the app
                return "unknown";
            }
            // GD3 - we always have Mode from the stream object
            if (this._props.Mode && typeof this._props.Mode === "string") {
                return this._props.Mode.toLowerCase();
            }
            // GD2
            // return unknown for activity applications
            if (this.isActivity) {
                return "unknown";
            }
            // check definition -> hc.args.mode
            if (this._props.Arguments && this._props.Arguments.mode && typeof this._props.Arguments.mode === "string") {
                return this._props.Arguments.mode.toLowerCase();
            }
            // if no hc.args.mode, check hc.WindowStyleAttributes
            var styleAttributes = this._props.WindowStyleAttributes;
            if (styleAttributes) {
                // WindowStyleAttributes is not a valid JSON, we will need to find mode in the string
                styleAttributes = styleAttributes.split(" ").join("");
                var searchFor = "mode:\"";
                var modeIndex = styleAttributes.indexOf(searchFor);
                if (modeIndex !== -1) {
                    var startModeIndex = modeIndex + searchFor.length;
                    var stopModeIndex = styleAttributes.indexOf("\"", startModeIndex);
                    var style = styleAttributes.substr(startModeIndex, stopModeIndex - startModeIndex);
                    if (style && typeof style === "string") {
                        return style.toLowerCase();
                    }
                }
            }
            // default mode for GD2
            return "flat";
        },
        enumerable: true,
        configurable: true
    });
    ApplicationImpl.prototype.updateFromProps = function (props) {
        var _this = this;
        if (!this._props) {
            this._props = { Name: props.Name };
        }
        Object.keys(props).forEach(function (key) {
            _this._props[key] = props[key];
        });
    };
    ApplicationImpl.prototype.start = function (context, options) {
        var _this = this;
        var name = this._name;
        var startTimeout = 10000;
        return new Promise(function (resolve, reject) {
            options = options || {};
            context = context || {};
            context._t42 = { createWindowArgs: options };
            if (typeof options.waitForAGMReady === "undefined") {
                options.waitForAGMReady = true;
            }
            var waitForAGMInstance = options.waitForAGMReady;
            var waitForInstance = !options.waitForAGMReady;
            var waitForApplicationInstance = function (id) {
                // fetch from the current list in app-manager
                var check = function () {
                    var filtered = _this._appManager.instances().filter(function (i) { return i.id === id; });
                    var result;
                    if (filtered.length === 2) {
                        result = filtered[0].isActivityInstance ? filtered[0] : filtered[1];
                    }
                    result = filtered[0];
                    if (result && waitForAGMInstance) {
                        if (result.agm) {
                            return result;
                        }
                        else {
                            return undefined;
                        }
                    }
                    return result;
                };
                var unsub;
                // reject after some timeout
                setTimeout(function () {
                    if (unsub) {
                        unsub();
                        reject("timeout");
                    }
                }, startTimeout);
                var waitFunc = function (i) {
                    if (i.id !== id) {
                        return;
                    }
                    unsub();
                    unsub = undefined;
                    // schedule - we need this because there might be more than one
                    // instance with the same id (activity case) - so this handler
                    // will kick for the very first
                    setTimeout(function () {
                        resolve(check());
                    }, 1);
                };
                if (waitForAGMInstance) {
                    unsub = _this._appManager.onInstanceAgmServerReady(waitFunc);
                }
                else {
                    // if not there subscribe for instance events
                    unsub = _this._appManager.onInstanceStarted(waitFunc);
                }
                // try to find it in the current list
                var instances = check();
                if (instances) {
                    unsub = undefined;
                    resolve(instances);
                }
            };
            _this._agm.invoke(AgmNames.StartApplicationMethodName, {
                Name: name,
                Context: context,
                WaitForAgmInstance: waitForAGMInstance,
                WaitForInstance: waitForInstance
            }, "best", {
                methodResponseTimeoutMs: startTimeout
            }, function (result) {
                var acsResult = result.returned.Instance_0 || result.returned;
                if (acsResult && acsResult.Id) {
                    // we received instance from ACS, let's wait until it appears on the stream
                    waitForApplicationInstance(acsResult.Id);
                }
                else {
                    // we haven't received instance from ACS - this might happen if the app does not
                    // support tracking instances (e.g. we start internet explorer with some url)
                    resolve(undefined);
                }
            }, function (err) {
                reject(err);
            });
        });
    };
    ApplicationImpl.prototype.onInstanceStarted = function (callback) {
        this._registry.add("instanceStarted", callback);
    };
    ApplicationImpl.prototype.onInstanceStopped = function (callback) {
        this._registry.add("instanceStopped", callback);
    };
    ApplicationImpl.prototype.onAvailable = function (callback) {
        this._registry.add("appAvailable", callback);
    };
    ApplicationImpl.prototype.onUnavailable = function (callback) {
        this._registry.add("appUnavailable", callback);
    };
    ApplicationImpl.prototype.onChanged = function (callback) {
        this._registry.add("appChanged", callback);
    };
    ApplicationImpl.prototype.onRemoved = function (callback) {
        this._registry.add("appRemoved", callback);
    };
    return ApplicationImpl;
}());
exports.default = ApplicationImpl;
//# sourceMappingURL=application.js.map

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.OnNotificationEvent = "OnNotification";
exports.OnBranchChangedEvent = "OnBranchChanged";
exports.OnBranchesModifiedEvent = "OnBranchesModified";
exports.OnApplicationAddedEvent = "OnApplicationAdded";
exports.OnApplicationRemovedEvent = "OnApplicationRemoved";
exports.OnApplicationChangedEvent = "OnApplicationChanged";
exports.OnApplicationReadyEvent = "OnApplicationReady";
exports.OnApplicationStartedEvent = "OnApplicationStarted";
exports.OnApplicationRegisteredEvent = "OnApplicationRegistered";
exports.OnApplicationAgmServerReadyEvent = "OnApplicationAgmServerReady";
exports.OnApplicationUpdatedEvent = "OnApplicationUpdated";
exports.OnApplicationStoppedEvent = "OnApplicationStopped";
exports.OnApplicationStartFailedEvent = "OnApplicationStartFailed";
//# sourceMappingURL=event-names.js.map

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AgmNames = __webpack_require__(5);
var EventNames = __webpack_require__(51);
var helper_1 = __webpack_require__(11);
/** Subscribe for the AGM stream published by ACS and distributes events to applications and instances components */
function createDataSubscription(agm, applications, entitlements, skipIcons) {
    var subscription;
    var start = function () {
        var resolveFunc;
        var rejectFunc;
        var resultPromise = new Promise(function (resolve, reject) {
            resolveFunc = resolve;
            rejectFunc = reject;
        });
        agm.subscribe(AgmNames.OnEventMethodName, { arguments: { skipIcon: skipIcons }, waitTimeoutMs: 10000 })
            .then(function (s) {
            subscription = s;
            subscription.onData(function (streamData) {
                var events = streamData.data;
                helper_1.objectValues(events[EventNames.OnApplicationAddedEvent])
                    .map(function (item) { return applications.handleAppAdded(item); });
                helper_1.objectValues(events[EventNames.OnApplicationChangedEvent])
                    .map(function (item) { return applications.handleAppUpdated(item); });
                helper_1.objectValues(events[EventNames.OnApplicationRemovedEvent])
                    .map(function (item) { return applications.handleAppRemoved(item); });
                helper_1.objectValues(events[EventNames.OnApplicationReadyEvent])
                    .map(function (item) { return applications.handleAppReady(item); });
                helper_1.objectValues(events[EventNames.OnApplicationStartedEvent])
                    .map(function (item) { return applications.handleInstanceStarted(item); });
                helper_1.objectValues(events[EventNames.OnApplicationStartFailedEvent])
                    .map(function (item) { return applications.handleInstanceStartFailed(item); });
                helper_1.objectValues(events[EventNames.OnApplicationStoppedEvent])
                    .map(function (item) { return applications.handleInstanceStopped(item); });
                helper_1.objectValues(events[EventNames.OnApplicationUpdatedEvent])
                    .map(function (item) { return applications.handleInstanceUpdated(item); });
                helper_1.objectValues(events[EventNames.OnApplicationAgmServerReadyEvent])
                    .map(function (item) { return applications.handleInstanceAgmServerReady(item); });
                helper_1.objectValues(events[EventNames.OnBranchChangedEvent])
                    .map(function (item) { return entitlements.handleBranchModified(item); });
                helper_1.objectValues(events[EventNames.OnBranchesModifiedEvent])
                    .map(function (item) { return entitlements.handleBranchesModified(item); });
                resolveFunc();
            });
            subscription.onFailed(function (err) { return rejectFunc(err); });
        })
            .catch(function (err) { return rejectFunc("Error subscribing for " + AgmNames.OnEventMethodName + " stream. Err: " + err); });
        return resultPromise;
    };
    var stop = function () {
        if (subscription) {
            subscription.close();
        }
    };
    return {
        start: start,
        stop: stop
    };
}
exports.default = createDataSubscription;
//# sourceMappingURL=data-subscription.js.map

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AgmNames = __webpack_require__(5);
var callback_registry_1 = __webpack_require__(1);
var promisify = __webpack_require__(38);
var EntitlementsImpl = /** @class */ (function () {
    function EntitlementsImpl(_agm) {
        var _this = this;
        this._agm = _agm;
        this._registry = callback_registry_1.default();
        this.handleBranchModified = function (branch) {
            _this._registry.execute("branchChanged", branch);
        };
        this.handleBranchesModified = function (branches) {
            _this._registry.execute("branchesChanged", branches);
        };
        this.getRegion = function (success, error) {
            return promisify(_this._agmInvoke(AgmNames.GetConfigurationRegionMethodName, function (e) { return e.returned.Region; }), success, error);
        };
        this.getBranches = function (success, error) {
            var promise = _this._agmInvoke(AgmNames.GetBranchesMethodName, function (e) {
                var obj = e.returned.Branches;
                return Object.keys(obj).map(function (key) { return obj[key]; });
            });
            return promisify(promise, success, error);
        };
        this.getCurrentBranch = function (success, error) {
            var promise = _this._agmInvoke(AgmNames.GetCurrentBranchMethodName, function (e) { return e.returned.Branch; }, undefined);
            return promisify(promise, success, error);
        };
        this.setRegion = function (region, success, error) {
            var promise = _this._agmInvoke(AgmNames.SetConfigurationRegionMethodName, function (e) { return e.returned.ResultMessage; }, { Region: region });
            return promisify(promise, success, error);
        };
        this.setCurrentBranch = function (branch, success, error) {
            var promise = _this._agmInvoke(AgmNames.SetCurrentBranchMethodName, function (e) { return e.returned.ResultMessage; }, { Branch: branch });
            return promisify(promise, success, error);
        };
        this.currentUser = function (success, error) {
            var promise = _this._agmInvoke(AgmNames.GetUserMethodName);
            return promisify(promise, success, error);
        };
        this.getFunctionalEntitlement = function (funct, success, error) {
            var promise = _this._agmInvoke(AgmNames.GetFunctionalEntitlementMethodName, function (e) { return e.returned.Entitlement; }, { Function: funct });
            return promisify(promise, success, error);
        };
        this.getFunctionalEntitlementBranch = function (funct, branch, success, error) {
            var promise = _this._agmInvoke(AgmNames.GetFunctionalEntitlementMethodName, function (e) { return e.returned.Entitlement; }, { Function: funct, Branch: branch });
            return promisify(promise, success, error);
        };
        this.canI = function (func, success, error) {
            var promise = _this._agmInvoke(AgmNames.CanIMethodName, function (e) { return e.returned.Result; }, { Function: func });
            return promisify(promise, success, error);
        };
        this.canIBranch = function (func, branch, success, error) {
            var promise = _this._agmInvoke(AgmNames.CanIMethodName, function (e) { return e.returned.Result; }, { Function: func, Branch: branch });
            return promisify(promise, success, error);
        };
        this.onBranchesChanged = function (callback) {
            _this._registry.add("branchesChanged", callback);
        };
        this.onBranchChanged = function (callback) {
            _this._registry.add("branchChanged", callback);
        };
        this.exit = function (options) {
            return _this._agmInvoke(AgmNames.ShutdownMethodName, null, options);
        };
        this._agmInvoke = function (method, transformFunction, args) {
            args = args || {};
            return new Promise(function (resolve, reject) {
                var errHandler = function (error) { return reject(error); };
                _this._agm.invoke(method, args)
                    .then(function (result) {
                    if (!transformFunction) {
                        transformFunction = function (d) { return d.returned; };
                    }
                    resolve(transformFunction(result));
                })
                    .catch(errHandler);
            });
        };
        //
    }
    return EntitlementsImpl;
}());
exports.default = EntitlementsImpl;
//# sourceMappingURL=entitlements.js.map

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AgmNames = __webpack_require__(5);
var callback_registry_1 = __webpack_require__(1);
var InstanceImpl = /** @class */ (function () {
    function InstanceImpl(_id, _app, _appManager, _agm, _activities, _windows, startFailed) {
        var _this = this;
        this._id = _id;
        this._app = _app;
        this._appManager = _appManager;
        this._agm = _agm;
        this._activities = _activities;
        this._windows = _windows;
        this.onAgmReady = this._addToRegistry("agmReady");
        this.onStopped = this._addToRegistry("stopped");
        this._registry = callback_registry_1.default();
        if (startFailed) {
            return;
        }
        this._unsubscribeInstanceStopped = this._appManager.onInstanceStopped(function (instance) {
            if (instance.id !== _this._id) {
                return;
            }
            _this._registry.execute("stopped", instance);
        });
        this._unsubscribeInstanceAgmServerReady = this._appManager.onInstanceAgmServerReady(function (instance) {
            if (instance.id !== _this._id) {
                return;
            }
            _this._registry.execute("agmReady", instance);
        });
    }
    Object.defineProperty(InstanceImpl.prototype, "id", {
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstanceImpl.prototype, "application", {
        get: function () { return this._app; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstanceImpl.prototype, "activity", {
        get: function () {
            var _this = this;
            if (!this._activities) {
                throw new Error("This method requires glue.activities library to be enabled.");
            }
            return this._activities.all.instances.get()
                .filter(function (activityInstance) { return activityInstance.id === _this._activityId; })[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstanceImpl.prototype, "activityInstances", {
        get: function () {
            var _this = this;
            return this._appManager.instances()
                .filter(function (i) { return i.context && (i.context.activityId === _this._activityId); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstanceImpl.prototype, "activityOwnerInstance", {
        get: function () {
            return this._appManager.instances()
                .filter(function (instance) {
                if (instance.window && instance.window.context) {
                    var instWinCntx = instance.window.context;
                    if (instWinCntx._t42 && instWinCntx._t42.activityIsOwner) {
                        return true;
                    }
                }
                return false;
            })[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstanceImpl.prototype, "window", {
        get: function () {
            var _this = this;
            if (!this._windows) {
                throw new Error("This method requires glue.windows library to be enabled.");
            }
            var win = this._windows.list().filter(function (w) { return w.id === _this._id; })[0];
            if (!win && this.activity && this.activityOwnerInstance) {
                // This is covering GD3 activity instance
                win = this.activityOwnerInstance.window;
            }
            return win;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstanceImpl.prototype, "context", {
        get: function () { return this._startUpContext; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstanceImpl.prototype, "title", {
        get: function () { return this._title; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstanceImpl.prototype, "isActivityInstance", {
        get: function () { return this._isActivityInstance; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstanceImpl.prototype, "activityId", {
        get: function () { return this._activityId; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstanceImpl.prototype, "inActivity", {
        get: function () { return this._inActivity; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstanceImpl.prototype, "isSingleWindowApp", {
        get: function () { return !this._inActivity; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstanceImpl.prototype, "agm", {
        get: function () {
            return this._agmInstance;
        },
        enumerable: true,
        configurable: true
    });
    InstanceImpl.prototype.updateFromProps = function (props) {
        this._startUpContext = props.Context;
        this._title = props.Title;
        this._isActivityInstance = false;
        if (props.ActivityId && props.ActivityId !== "") {
            this._activityId = props.ActivityId;
            this._isActivityInstance = true;
        }
        if (!this._activityId && this._startUpContext && this._startUpContext.activityId) {
            this._activityId = this._startUpContext.activityId;
        }
        this._inActivity = Boolean(this._activityId);
        this.updateAgmInstanceFromProps(props);
    };
    InstanceImpl.prototype.updateAgmInstanceFromProps = function (props) {
        if (!props.AgmServers) {
            return;
        }
        if (props.GD3) {
            var agmInstances = props.AgmServers;
            if (agmInstances) {
                this._agmInstance = agmInstances[0];
            }
        }
        else {
            var gdAgmServers = props.AgmServers;
            var propsAgmServer = Object.keys(gdAgmServers)[0];
            if (!propsAgmServer) {
                return;
            }
            var propsAgm = gdAgmServers[propsAgmServer];
            this._agmInstance = {
                machine: propsAgm.machineName,
                user: propsAgm.userName,
                environment: propsAgm.environment,
                application: propsAgm.applicationName,
            };
        }
    };
    InstanceImpl.prototype.stop = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var unsubscribe = _this._appManager.onInstanceStopped(function (instance) {
                if (instance.id === _this._id) {
                    unsubscribe();
                    resolve();
                }
            });
            _this._agm.invoke(AgmNames.StopApplicationMethodName, {
                Name: _this._app.name,
                Id: _this._id
            })
                .catch(function (err) { return reject(err); });
        });
    };
    InstanceImpl.prototype.activate = function () {
        return this._agm.invoke(AgmNames.ActivateApplicationMethodName, { Name: this._app.name, Id: this._id });
    };
    InstanceImpl.prototype.done = function () {
        // remove all handlers
        this._registry.clear();
        // remove subscriptions
        this._unsubscribeInstanceAgmServerReady();
        this._unsubscribeInstanceStopped();
    };
    InstanceImpl.prototype._addToRegistry = function (key) {
        var _this = this;
        return function (callback) {
            _this._registry.add(key, callback);
        };
    };
    return InstanceImpl;
}());
exports.default = InstanceImpl;
//# sourceMappingURL=instance.js.map

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var app_manager_1 = __webpack_require__(49);
var entitlements_1 = __webpack_require__(53);
var snapshot_1 = __webpack_require__(56);
var data_subscription_1 = __webpack_require__(52);
exports.default = (function (config) {
    if (!config) {
        throw Error("config not set");
    }
    if (!config.agm) {
        throw Error("config.agm is missing");
    }
    var START_ONLY = "startOnly";
    var SKIP_ICONS = "skipIcons";
    var FULL = "full";
    var mode = config.mode || START_ONLY;
    if (mode !== START_ONLY && mode !== SKIP_ICONS && mode !== FULL) {
        throw new Error("Invalid mode for appManager lib - " + mode + " is not supported");
    }
    var activities = config.activities;
    var agm = config.agm;
    var logger = config.logger;
    var windows = config.windows;
    var appManager = new app_manager_1.default(agm, activities, windows, logger.subLogger("applications"));
    var entitlements = new entitlements_1.default(agm);
    var readyPromise;
    if (mode === START_ONLY) {
        readyPromise = snapshot_1.default(agm, appManager);
    }
    else {
        var subscription = data_subscription_1.default(agm, appManager, entitlements, mode === SKIP_ICONS);
        readyPromise = subscription.start();
    }
    var api = {
        ready: function () { return readyPromise; },
        applications: appManager.applications,
        application: appManager.application,
        onAppAdded: appManager.onAppAdded,
        onAppRemoved: appManager.onAppRemoved,
        onAppChanged: appManager.onAppChanged,
        onAppAvailable: appManager.onAppAvailable,
        onAppUnavailable: appManager.onAppUnavailable,
        instances: appManager.instances,
        get myInstance() {
            return appManager.getMyInstance();
        },
        onInstanceStarted: appManager.onInstanceStarted,
        onInstanceStopped: appManager.onInstanceStopped,
        onInstanceUpdated: appManager.onInstanceUpdated,
        onInstanceStartFailed: appManager.onInstanceStartFailed,
        getRegion: entitlements.getRegion,
        getBranches: entitlements.getBranches,
        getCurrentBranch: entitlements.getCurrentBranch,
        getFunctionalEntitlement: entitlements.getFunctionalEntitlement,
        getFunctionalEntitlementBranch: entitlements.getFunctionalEntitlementBranch,
        setCurrentBranch: entitlements.setCurrentBranch,
        setRegion: entitlements.setRegion,
        currentUser: entitlements.currentUser,
        canI: entitlements.canI,
        canIBranch: entitlements.canIBranch,
        onBranchesChanged: entitlements.onBranchesChanged,
        exit: entitlements.exit
    };
    return api;
});
//# sourceMappingURL=main.js.map

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AgmNames = __webpack_require__(5);
var helper_1 = __webpack_require__(11);
/** Retrieves application snapshot from ACS */
function snapshot(agm, appManager) {
    return new Promise(function (resolve, reject) {
        agm.invoke(AgmNames.GetApplicationsMethodName, { skipIcon: true })
            .then(function (response) {
            var data = response.returned;
            if (!data) {
                resolve();
            }
            var applications = data.applications;
            if (!applications) {
                resolve();
            }
            helper_1.objectValues(applications).map(function (item) { return appManager.handleAppAdded(item); });
            resolve();
        })
            .catch(function (err) { return reject("Error getting application snapshot: " + err.message); });
    });
}
exports.default = snapshot;
//# sourceMappingURL=snapshot.js.map

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (options) {
    // Possible options per lib (this is InputLibConfig type)
    // * false - library is disabled (e.g. config.appManager = false)
    // * true - library is enabled in running in default mode (e.g config.appManager = true).
    //          Exception is if default mode is false - in that case it runs default true mode.
    // * string - start in some mode (e.g. config.appManager = "full")
    // * object - allows further customization (e.g config.appManager = {mode: "full", someSetting: 42})
    //
    // Some libs support different running modes, some do not.
    //
    // Currently defaults are:
    // appManager: disabled
    // layouts: enabled in 'slim' mode
    // activities: enabled in 'trackMyTypeAndInitiatedFromMe' mode
    // windows: enabled (does not support modes)
    // contexts: enabled (does not support modes)
    //
    // InputLibConfig is transformed to LibConfigObject
    /**
     * Transforms InputLibConfig (the config as specified from the user)
     * to LibConfigObject(internal library configuration)
     */
    function getLibConfig(value, defaultMode, trueMode) {
        // if value is false return undefined
        if (typeof value === "boolean" && !value) {
            return undefined;
        }
        // find the mode of the library
        var mode = getModeAsString(value, defaultMode, trueMode);
        // if object we will replace the mode because appManager = {mode: true, setting: 42}
        // should be turned into appManager = {mode: 'slim', setting: 42}
        if (typeof value === "object") {
            value.mode = mode;
            return value;
        }
        return {
            mode: mode,
        };
    }
    /**
     * Finds the mode based for a given library
     * 1. If object we call recursively using object.mode for value
     * 1. If the user hasn't specified anything we use the hard coded defaults
     * 3. If the value is false or it got defaulted to false, we return undefined
     * 4. If the value is true we return trueMode or defaultMode (if trueMode is undefined)
     */
    function getModeAsString(value, defaultMode, trueMode) {
        if (typeof value === "object") {
            // 1. if object
            return getModeAsString(value.mode, defaultMode, trueMode) + "";
        }
        else if (typeof value === "undefined") {
            // 2. if the user does not pass anything
            if (typeof defaultMode === "boolean" && !defaultMode) {
                // 3. if gets defaulted to false, the library should be off
                return undefined;
            }
            else {
                return defaultMode + "";
            }
        }
        else if (typeof value === "boolean") {
            // 4. if the user passes true, use trueMode or defaultMode
            if (value) {
                // if the user passes true, use trueMode or defaultMode
                return ((trueMode === undefined) ? defaultMode : trueMode) + "";
            }
            else {
                // 3. if the user passes false, the library should be off
                return undefined;
            }
        }
        return value + "";
    }
    var appDefaultMode = false;
    var appDefaultTrueMode = "startOnly";
    var activitiesDefaultMode = "trackMyTypeAndInitiatedFromMe";
    var layoutsDefaultMode = "slim";
    return {
        layouts: getLibConfig(options.layouts, layoutsDefaultMode),
        activities: getLibConfig(options.activities, activitiesDefaultMode),
        appManager: getLibConfig(options.appManager, appDefaultMode, appDefaultTrueMode),
        windows: getLibConfig(options.windows, true),
        contexts: getLibConfig(options.contexts, true)
    };
});
//# sourceMappingURL=config.js.map

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gw3ContextData_1 = __webpack_require__(59);
var helpers_1 = __webpack_require__(62);
var msg = __webpack_require__(19);
var contextMessageReplaySpec_1 = __webpack_require__(20);
// for reference in how things are done in the HC:
// see html-container\HtmlContainer\HtmlContainer\JavaScript\SharedContexts\JsSharedContextFacade.cs
// and html-container\HtmlContainer\HtmlContainer\SharedContexts\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// GW3Bridge implementation notes
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// ===========================
// Terminology used
// ===========================
//
// - gw-subscribe (verb):
//      send SUBSCRIBE CONTEXT to GW se we see CONTEXT UPDATED messages,
//      or
//      get implicitly subscribed as consequence of joining activity
//      sending the SUBSCRIBE CONTEXT message is done internally by this
//      class whenever a ContextData item in _contextNameToData reaches
//      state (3) (see 'States of a context' in gw3ContextData.ts)
// - bridge-subscribe (verb):
//      call gw3Bridge.subscribe method; we need to make sure we've
//      gw-subscribed if/as soon as the target context is announced
//      this is what consumers of this class do
// - bridge-subscription (noun):
//      the result of bridge-subscribe, and the state of having a handler
//      subscribed to a context
// - active subscription: bridge-subscription which will cause the handler
//      to observe context changes until someone calls unsubscribe() here
//      or the subscription becomes 'inactive'
// - inactive subscription: bridge-subscription which will NOT cause the
//      handler to observe context changes; this happens to
//      bridge-subscriptions on activity contexts if we leave the activity.
//      There is NO way to check if a subscription is active or not and it's
//      not reflected in the contextData state.
//
// ===========================
// General information
// ===========================
//
// This class exposes the GW context subscription and updating features
// using the subscribe/unsubscribe/update/createContext methods.
//
// The main logic is related to tracking the states of contexts (shared or
// activity), represented by ContextData entries in _contextNameToData, and
// reacting to gateway messages accordingly.
//
// ===========================
// States of an ContextData object
// ===========================
//
// (0) nothing (not defined, or deleted) - such entries are NOT kept in collections
// (1) unknown but bridge-subscribed to
// (2) announced but not bridge-subscribed to
// (3) both announced and bridge-subscribed to (so also gw-subscribed)
//
//       sub/unsub   GW ann
//      +-------->(1)-----+
//      |                 |
//      |                 |
//      V       destroy   v
// *-->(0)<--------------(3)
//      |^---------+      ^
//      |  destroy |      |
//      |          |      |
//      +-------->(2)<----+
//        GW ann    subscribe/unsub
//
// You can look for the states and transitions in the code below, e.g.
// (0) -> (1)
//
// Note: if it's not our activity context, we need to gw-(un)subscribe to the
// GW update messages on certain transitions:
// - on changes from { (1), (2) } -> (3) we send a subscribe message
// - on changes from (3) -> (2) we send an unsubscribe message
// - on destruction, we drop all the information about the context; let
// anyone subscribe to it and create a new contextData in state (1), we don't
// care - these subscriptions are inactive from the get go, since the context
// can't be created again.
//
// The contextData also contains the current snapshot of the context if it's
// currently gw-subscribed to (so states (2"') and (3) below).
//
// Note: We're mostly going to the trouble of keeping unannounced contexts
// (state (1)) in order to allow other GW message subscribers to see a new
// context being created and subscribe to it before the message has reached
// our handler. Also, only sending a CONTEXT SUBSCRIBE on state (3) instead
// of on GW announce means no unnecessary updates are being distributed to
// every instance of this library.
//
// Also, in the HC subscribing to an unknown context is OK as well so we're
// keeping this behavior.
//
// Note: above is an abridged version of the state machine; states (2) and (3)
// have three substates depending on whether the context is a global context,
// our own activity context, or a foreign activity's context. Subscription
// messages are only sent on { (1), (2'), (2") } -> { (3'), (3") }, with the
// unsubscribe message sent on { (3'), (3"), (3"') } -> { (1), (2'), (2") }
// if a  subscribe was sent previously (so we'll send a final unsubscribe if
// we subscribe to a foreign activity's context, then join the activity, then
// unsubscribe - this is to avoid still potentially receiving unwanted updates
// if we leave the activity).
//
// Full state diagram (not showing 'destroy' transitions):
//
//        join activity
//      +------------------>(3"')<------+
//      |                    ^          |
//      |                    | join     |
//      |                    | activity |
//      | activity created   |          |
//      +------------------>(3")<----+  |
//      |                            |  |
//      | global ctx ann             |  |
//      +------------------>(3')<-+  |  |
//      |                         |  |  |
//      |                         |  |  |
//     (1)                        |  |  |
//      ^                         |  |  |
//      | bridge-(un)subscribe   bridge-(un)subscribe
//      |                         |  |  |
//      V                         |  |  |
// *-->(0)                        |  |  |
//      |                         |  |  |
//      | global ctx ann          |  |  |
//      +------------------>(2')<-+  |  |
//      |                            |  |
//      | activity created           |  |
//      +------------------>(2")<----+  |
//      |                    |          |
//      |                    | join     |
//      |                    | activity |
//      | join activity      V          |
//      +------------------>(2"')<------+
//
// ===========================
// Supported use cases
// ===========================
//
// - bridge-(un)subscribe to shared context by name
// - bridge-(un)subscribe to activity context for activity we ARE a member of
//      - the context name is the activity id
//      - here the subscriptions become inactive if we leave the activity
//      - HOWEVER these subscriptions will become inactive if we leave the
//      activity, and any further subscriptions to the activity's context
//      will be inactive.
//          The protocol provides no way for us to know other than through
//      the LEAVE ACTIVITY success message which is sent by our peer and we
//      can't observe it here, so we have no way to know to send an explicit
//      subscription in order to reactivate the bridge-subscription.
//          We could deal with this by extending the GW connection to allow
//      us to inspect outgoing messages and react to the LEAVE ACTIVITY, but
//      keeping a few stale objects around isn't worth the code complexity.
//          This transition would be represented by (2"') -> (2") and
//      (3"') -> (3") in the state diagram, where (3"') -> (3") would prompt
//      a subscribe message.
// - bridge-(un)subscribe to context of activity we're NOT in
//      - the context name is the activity id
//      - the subscription will stay active even if we join the activity later
//      - again, these subscriptions will become inactive if we leave the
//      activity
//
// Also note that unsubscribing from destroyed contexts is not required,
// as the data is cleared up automatically (but it doesn't hurt).
// Unsubscriptions are guaranteed to be safe and idempotent.
var GW3Bridge = /** @class */ (function () {
    function GW3Bridge(config) {
        var _this = this;
        // contexts in state { (1), (2), (3) }
        this._contextNameToData = {};
        // for disposing purposes only
        this._gw3Subscriptions = [];
        // increment for every bridge-subscribe; used to unsubscribe()
        this._nextCallbackSubscriptionNumber = 0;
        // mapping announced contexts' name <-> id
        this._contextNameToId = {};
        this._contextIdToName = {};
        this._connection = config.connection;
        this._logger = config.logger;
        this._gw3Session = this._connection.domain("global", this._logger, [
            msg.GW_MESSAGE_CONTEXT_CREATED,
            msg.GW_MESSAGE_SUBSCRIBED_CONTEXT,
            msg.GW_MESSAGE_CONTEXT_DESTROYED,
            msg.GW_MESSAGE_CONTEXT_UPDATED,
        ]);
        // TODO: logging, validation and error handling
        this.subscribeToContextCreatedMessages();
        this.subscribeToContextUpdatedMessages();
        this.subscribeToContextDestroyedMessages();
        this._connection.replayer.drain(contextMessageReplaySpec_1.ContextMessageReplaySpec.name, function (message) {
            var type = message.type;
            if (!type) {
                return;
            }
            if (type === msg.GW_MESSAGE_CONTEXT_CREATED ||
                type === msg.GW_MESSAGE_CONTEXT_ADDED ||
                type === msg.GW_MESSAGE_ACTIVITY_CREATED) {
                _this.handleContextCreatedMessage(message);
            }
            else if (type === msg.GW_MESSAGE_SUBSCRIBED_CONTEXT ||
                type === msg.GW_MESSAGE_CONTEXT_UPDATED ||
                type === msg.GW_MESSAGE_JOINED_ACTIVITY) {
                _this.handleContextUpdatedMessage(message);
            }
            else if (type === msg.GW_MESSAGE_CONTEXT_DESTROYED ||
                type === msg.GW_MESSAGE_ACTIVITY_DESTROYED) {
                _this.handleContextDestroyedMessage(message);
            }
        });
    }
    GW3Bridge.prototype.dispose = function () {
        for (var _i = 0, _a = this._gw3Subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            this._connection.off(sub);
        }
        this._gw3Subscriptions.length = 0;
        for (var contextName in this._contextNameToData) {
            if (this._contextNameToId.hasOwnProperty(contextName)) {
                delete this._contextNameToData[contextName];
            }
        }
    };
    GW3Bridge.prototype.createContext = function (name, data) {
        var _this = this;
        return this._gw3Session
            .send({
            type: msg.GW_MESSAGE_CREATE_CONTEXT,
            domain: "global",
            name: name,
            data: data,
            lifetime: "retained",
        })
            .then(function (createContextMsg) {
            _this._contextNameToId[name] = createContextMsg.context_id;
            if (!_this._contextIdToName[createContextMsg.context_id]) {
                _this._contextIdToName[createContextMsg.context_id] = name;
                var contextData = _this._contextNameToData[name] || new gw3ContextData_1.GW3ContextData(createContextMsg.context_id, name, true, null);
                contextData.isAnnounced = true;
                contextData.name = name;
                contextData.contextId = createContextMsg.context_id;
                _this._contextNameToData[name] = contextData;
                contextData.context = createContextMsg.data;
                if (contextData.context) {
                    _this.invokeUpdateCallbacks(contextData, contextData.context);
                }
                return _this.update(name, data).then(function () { return createContextMsg.context_id; });
            }
            return createContextMsg.context_id;
        });
    };
    GW3Bridge.prototype.all = function () {
        var _this = this;
        return Object.keys(this._contextNameToData)
            .filter(function (name) { return _this._contextNameToData[name].isAnnounced; });
    };
    GW3Bridge.prototype.update = function (name, delta) {
        // - send context update message
        //
        // - on success, apply delta to context currently in contextData
        var _this = this;
        // should we implicitly create the context?
        var contextData = this._contextNameToData[name];
        if (!contextData || !contextData.isAnnounced) {
            return this.createContext(name, delta);
        }
        var calculatedDelta = this.calculateContextDelta(contextData.context, delta);
        if (!Object.keys(calculatedDelta.added).length
            && !Object.keys(calculatedDelta.updated).length
            && !calculatedDelta.removed.length) {
            return Promise.resolve();
        }
        return this._gw3Session
            .send({
            type: msg.GW_MESSAGE_UPDATE_CONTEXT,
            domain: "global",
            context_id: contextData.contextId,
            delta: calculatedDelta,
        })
            .then(function () {
            _this.handleUpdated(contextData, calculatedDelta);
        });
    };
    GW3Bridge.prototype.set = function (name, data) {
        var _this = this;
        var contextData = this._contextNameToData[name];
        if (!contextData || !contextData.isAnnounced) {
            return this.createContext(name, data);
        }
        // SBGW_D-194
        return this._gw3Session
            .send({
            type: msg.GW_MESSAGE_UPDATE_CONTEXT,
            domain: "global",
            context_id: contextData.contextId,
            delta: { reset: data },
        })
            .then(function () {
            _this.handleUpdated(contextData, { reset: data, added: {}, removed: [], updated: {} });
        });
    };
    /**
     * Creates a subscription to a given context which may or may not exist/be
     * announced as of yet.
     */
    GW3Bridge.prototype.subscribe = function (name, callback) {
        // - populate contextData's updateCallbacks with new entry
        //
        // - examine contextData and determine if we need to send a subscribe
        //
        // - if the context is announced, ensure handler gets snapshot
        var thisCallbackSubscriptionNumber = this._nextCallbackSubscriptionNumber;
        this._nextCallbackSubscriptionNumber += 1;
        var contextData = this._contextNameToData[name];
        if (!contextData || !contextData.isAnnounced) {
            // (0) -> (1)
            contextData = new gw3ContextData_1.GW3ContextData(undefined, name, false, undefined);
            this._contextNameToData[name] = contextData;
            contextData.updateCallbacks[thisCallbackSubscriptionNumber] = callback;
            return this.createContext(name, {}).then(function () {
                return thisCallbackSubscriptionNumber;
            });
        }
        var hadCallbacks = contextData.hasCallbacks();
        contextData.updateCallbacks[thisCallbackSubscriptionNumber] = callback;
        if (contextData.isAnnounced) {
            if (!hadCallbacks) {
                // first subscriber: (2) -> (3)
                if (!contextData.joinedActivity) {
                    if (contextData.context
                        && Object.keys(contextData.context).length > 0) {
                        callback(contextData.context);
                        return Promise.resolve(thisCallbackSubscriptionNumber);
                    }
                    // (2') -> (3') or (2") -> (3")
                    // shared context or not our activity;
                    // we need to gw-subscribe
                    // OTOH, no need to explicitly push a snapshot here,
                    // the GW will reply with a SUBSCRIBED CONTEXT with a snapshot
                    // which we'll push through subscribeToContextUpdatedMessages
                    // (not that we have a snapshot right now - it's not our activity,
                    // and we haven't subscribed already so we can't have received updates)
                    return this.sendSubscribe(contextData)
                        .then(function () { return thisCallbackSubscriptionNumber; });
                }
                else {
                    // (2"') -> (3"')
                    // our activity, which we're tracking anyway
                    // no need to gw-subscribe, just push the snapshot to the new subscriber
                    callback(contextData.context);
                    return Promise.resolve(thisCallbackSubscriptionNumber);
                }
            }
            else {
                // not first subscriber; no need to gw-subscribe, just push snapshot
                // (3) -> (3)
                callback(contextData.context);
                return Promise.resolve(thisCallbackSubscriptionNumber);
            }
        }
        else {
            // (0) -> (1) or (1) -> (1)
            // not announced, ignore for now
            return Promise.resolve(thisCallbackSubscriptionNumber);
        }
    };
    GW3Bridge.prototype.unsubscribe = function (subscriptionKey) {
        for (var _i = 0, _a = Object.keys(this._contextNameToData); _i < _a.length; _i++) {
            var name_1 = _a[_i];
            var contextId = this._contextNameToId[name_1];
            var contextData = this._contextNameToData[name_1];
            if (!contextData) {
                return;
            }
            var hadCallbacks = contextData.hasCallbacks();
            delete contextData.updateCallbacks[subscriptionKey];
            if (contextData.isAnnounced &&
                hadCallbacks &&
                !contextData.hasCallbacks() &&
                contextData.sentExplicitSubscription) {
                // (3) -> (2)
                this.sendUnsubscribe(contextData);
            }
            if (!contextData.isAnnounced &&
                // (1) -> (0)
                !contextData.hasCallbacks()) {
                delete this._contextNameToData[name_1];
            }
        }
    };
    GW3Bridge.prototype.handleUpdated = function (contextData, delta) {
        // for correctness proof, see note about serialized context
        // updates in subscribeToContextUpdatedMessages
        var oldContext = contextData.context;
        contextData.context = helpers_1.applyContextDelta(contextData.context, delta);
        if (this._contextNameToData[contextData.name] === contextData &&
            !helpers_1.deepEqual(oldContext, contextData.context)) {
            this.invokeUpdateCallbacks(contextData, contextData.context);
        }
    };
    GW3Bridge.prototype.subscribeToContextCreatedMessages = function () {
        // when a new context is announced:
        //
        // - record the fact that it's announced, so when the first
        //      bridge-subscribers come in, we do a gw-subscribe
        //
        // - record its name/contextId association
        //
        // - record its activity information, and the fact that this
        //      activity exists and that we're not joined in it (yet?)
        //
        // - if any bridge-subscribers already present, do a gw-subscribe
        var createdMessageTypes = [
            msg.GW_MESSAGE_CONTEXT_ADDED,
            msg.GW_MESSAGE_CONTEXT_CREATED,
            msg.GW_MESSAGE_ACTIVITY_CREATED,
        ];
        for (var _i = 0, createdMessageTypes_1 = createdMessageTypes; _i < createdMessageTypes_1.length; _i++) {
            var createdMessageType = createdMessageTypes_1[_i];
            var sub = this._connection.on("js-contexts", createdMessageType, this.handleContextCreatedMessage.bind(this));
            this._gw3Subscriptions.push(sub);
        }
    };
    GW3Bridge.prototype.handleContextCreatedMessage = function (contextCreatedMsg) {
        var createdMessageType = contextCreatedMsg.type;
        if (createdMessageType === msg.GW_MESSAGE_ACTIVITY_CREATED) {
            // activity context
            this._contextNameToId[contextCreatedMsg.activity_id] = contextCreatedMsg.context_id;
            this._contextIdToName[contextCreatedMsg.context_id] = contextCreatedMsg.activity_id;
        }
        else if (createdMessageType === msg.GW_MESSAGE_CONTEXT_ADDED) {
            // shared context
            this._contextNameToId[contextCreatedMsg.name] = contextCreatedMsg.context_id;
            this._contextIdToName[contextCreatedMsg.context_id] = contextCreatedMsg.name;
        }
        else if (createdMessageType === msg.GW_MESSAGE_CONTEXT_CREATED) {
            // created by us, data already populated
            // NB: the promise resolution from createContext is supposed to run *before*
            // we see the CONTEXT CREATED here, so _contextIdToName/_contextNameToId
            // are supposed to already be populated (this is because the gw connection
            // success handler is subscribed long before this one)
        }
        var name = this._contextIdToName[contextCreatedMsg.context_id];
        if (!name) {
            // we're supposed to have recorded the name
            throw new Error("Received created event for context with unknown name: " + contextCreatedMsg.context_id);
        }
        if (!this._contextNameToId[name]) {
            // we're also supposed to have recorded it in the opposite direction
            throw new Error("Received created event for context with unknown id: " + contextCreatedMsg.context_id);
        }
        var contextData = this._contextNameToData[name];
        if (contextData) {
            if (contextData.isAnnounced) {
                return;
            }
            else {
                // (1) -> (3') or (1) -> (3")
                // someone's already expressed interest in this context and now
                // it's being announced
                // you might think that since the activity context's id is
                // auto-generated no one could have already context-subscribed, but
                // there might be another ACTIVITY CREATED observer on the same
                // GW connection who saw this message before us and reacted by
                // subscribing to the context - so we need to handle this case
                if (!contextData.hasCallbacks()) {
                    throw new Error("Assertion failure: contextData.hasCallbacks()");
                }
                // update its state and send a gw-subscribe; we're expecting an update message
                contextData.isAnnounced = true;
                contextData.contextId = contextCreatedMsg.context_id;
                contextData.activityId = contextCreatedMsg.activity_id;
                // if we're observing the ACTIVITY CREATED message,
                // we're not one of its members and we need to gw-subscribe
                // explicitly; of course we could be getting joined to the activity
                // pretty soon which would subscribe us to context updates implicitly
                // long story short, if we're about to be joined to the activity
                // and an observer to ACTIVITY CREATED subscribes to the activity's context
                // before we get to this point, we'll send a needless SUBSCRIBE CONTEXT
                // but there's no harm done by beating that to the punch, and there's
                // no clean way to avoid this situation so we leave this as an artifact
                // of the implementation
                // whether activity or not, we'll push the initial snapshot in the
                // subscribeToContextUpdatedMessages handler
                this.sendSubscribe(contextData);
            }
        }
        else {
            // (0) -> (2') or (0) -> (2")
            // first time we hear about this context
            // we're not subscribed to it in the GW so just create a placeholder
            // and wait for someone to subscribe to it - we'll THEN send a subscribe to the GW
            this._contextNameToData[name] = contextData =
                new gw3ContextData_1.GW3ContextData(contextCreatedMsg.context_id, name, true, contextCreatedMsg.activity_id);
        }
    };
    GW3Bridge.prototype.subscribeToContextUpdatedMessages = function () {
        // receiving a context update or snapshot
        //
        // if it's JOINED ACTIVITY, we may be a new peer as part of activity
        // creation, so it's the first time we've heard about it -
        // record the activity information in the contextData
        //
        // otherwise, this message is a response/consequence of our gw-subscribe
        // message sent on entering state (3)
        //
        // in any case, apply any deltas to the contextData.context, and
        // propagate the context data and delta to any bridge-subscription
        // handlers
        //
        // note that context updates are always performed when reacting to
        // a GW message, so the data over time is tied to the flow of
        // messages coming in through the gateway connection; the GW decides
        // which update comes before which and our view of the changes to
        // the context is consistent with it (i.e. the GW is the serializing
        // agent)
        var updatedMessageTypes = [
            msg.GW_MESSAGE_CONTEXT_UPDATED,
            msg.GW_MESSAGE_SUBSCRIBED_CONTEXT,
            msg.GW_MESSAGE_JOINED_ACTIVITY,
        ];
        for (var _i = 0, updatedMessageTypes_1 = updatedMessageTypes; _i < updatedMessageTypes_1.length; _i++) {
            var updatedMessageType = updatedMessageTypes_1[_i];
            var sub = this._connection.on("js-contexts", updatedMessageType, this.handleContextUpdatedMessage.bind(this));
            this._gw3Subscriptions.push(sub);
        }
    };
    GW3Bridge.prototype.handleContextUpdatedMessage = function (contextUpdatedMsg) {
        var updatedMessageType = contextUpdatedMsg.type;
        var contextId = contextUpdatedMsg.context_id;
        var contextData = this._contextNameToData[this._contextIdToName[contextId]];
        // this flag is basically used to make sure we raise an update for a new activity
        // even if its initial context is empty
        // see "long analysis for callback behavior in GW3: several cases" comment in
        // activityMyApi.ts in js-activity, case 1-1-1
        // it serves a similar purpose for gw_message_subscribed_context
        var justSeen = !contextData || !contextData.isAnnounced;
        if (updatedMessageType === msg.GW_MESSAGE_JOINED_ACTIVITY) {
            if (!contextData) {
                // (0) -> (2"')
                // we're in the middle of activity creation
                contextData = new gw3ContextData_1.GW3ContextData(contextId, contextUpdatedMsg.activity_id, true, contextUpdatedMsg.activity_id);
                this._contextNameToData[contextUpdatedMsg.activity_id] = contextData;
                this._contextIdToName[contextId] = contextUpdatedMsg.activity_id;
                this._contextNameToId[contextUpdatedMsg.activity_id] = contextId;
            }
            else {
                // (1) -> (3"'), (2") -> (2"') or (3") -> (3"')
                contextData.contextId = contextId;
                contextData.isAnnounced = true;
                contextData.activityId = contextUpdatedMsg.activity_id;
            }
            contextData.joinedActivity = true;
        }
        else {
            if (!contextData || !contextData.isAnnounced) {
                if (updatedMessageType === msg.GW_MESSAGE_SUBSCRIBED_CONTEXT) {
                    // we've tried to create a context that already exists
                }
                else {
                    this._logger.error("Received 'update' for unknown context: " + contextId);
                }
                return;
            }
        }
        var oldContext = contextData.context;
        if (updatedMessageType === msg.GW_MESSAGE_SUBSCRIBED_CONTEXT) {
            contextData.context = contextUpdatedMsg.data || {};
        }
        else if (updatedMessageType === msg.GW_MESSAGE_JOINED_ACTIVITY) {
            contextData.context = contextUpdatedMsg.context_snapshot || {};
        }
        else if (updatedMessageType === msg.GW_MESSAGE_CONTEXT_UPDATED) {
            contextData.context = helpers_1.applyContextDelta(contextData.context, contextUpdatedMsg.delta);
        }
        else {
            throw new Error("Unrecognized context update message " + updatedMessageType);
        }
        if (justSeen ||
            !helpers_1.deepEqual(contextData.context, oldContext) ||
            updatedMessageType === msg.GW_MESSAGE_SUBSCRIBED_CONTEXT) {
            this.invokeUpdateCallbacks(contextData, contextData.context);
        }
    };
    GW3Bridge.prototype.invokeUpdateCallbacks = function (contextData, data) {
        for (var updateCallbackIndex in contextData.updateCallbacks) {
            if (contextData.updateCallbacks.hasOwnProperty(updateCallbackIndex)) {
                try {
                    var updateCallback = contextData.updateCallbacks[updateCallbackIndex];
                    updateCallback(data);
                }
                catch (err) {
                    this._logger.debug("Callback error: " + JSON.stringify(err));
                }
            }
        }
    };
    GW3Bridge.prototype.subscribeToContextDestroyedMessages = function () {
        // wipe all bookkeeping related to this context
        var destroyedMessageTypes = [
            msg.GW_MESSAGE_CONTEXT_DESTROYED,
            msg.GW_MESSAGE_ACTIVITY_DESTROYED,
        ];
        for (var _i = 0, destroyedMessageTypes_1 = destroyedMessageTypes; _i < destroyedMessageTypes_1.length; _i++) {
            var destroyedMessageType = destroyedMessageTypes_1[_i];
            var sub = this._connection.on("js-contexts", destroyedMessageType, this.handleContextDestroyedMessage.bind(this));
            this._gw3Subscriptions.push(sub);
        }
    };
    GW3Bridge.prototype.handleContextDestroyedMessage = function (destroyedMsg) {
        var destroyedMessageType = destroyedMsg.type;
        var contextId;
        var name;
        // (?) -> (0)
        if (destroyedMessageType === msg.GW_MESSAGE_ACTIVITY_DESTROYED) {
            name = destroyedMsg.activity_id;
            contextId = this._contextNameToId[name];
            if (!contextId) {
                this._logger.error("Received 'destroyed' for unknown activity: " + destroyedMsg.activity_id);
                return;
            }
        }
        else {
            contextId = destroyedMsg.context_id;
            name = this._contextIdToName[contextId];
            if (!name) {
                this._logger.error("Received 'destroyed' for unknown context: " + destroyedMsg.context_id);
                return;
            }
        }
        delete this._contextIdToName[contextId];
        delete this._contextNameToId[name];
        var contextData = this._contextNameToData[name];
        delete this._contextNameToData[name];
        if (!contextData || !contextData.isAnnounced) {
            this._logger.error("Received 'destroyed' for unknown context: " + contextId);
            return;
        }
    };
    GW3Bridge.prototype.sendSubscribe = function (contextData) {
        contextData.sentExplicitSubscription = true;
        return this._gw3Session
            .send({
            type: msg.GW_MESSAGE_SUBSCRIBE_CONTEXT,
            domain: "global",
            context_id: contextData.contextId,
        }).then(function (_) { return undefined; });
    };
    GW3Bridge.prototype.sendUnsubscribe = function (contextData) {
        contextData.sentExplicitSubscription = false;
        return this._gw3Session
            .send({
            type: msg.GW_MESSAGE_UNSUBSCRIBE_CONTEXT,
            domain: "global",
            context_id: contextData.contextId,
        }).then(function (_) { return undefined; });
    };
    GW3Bridge.prototype.calculateContextDelta = function (from, to) {
        var delta = { added: {}, updated: {}, removed: [], reset: null };
        if (from) {
            for (var _i = 0, _a = Object.keys(from); _i < _a.length; _i++) {
                var x = _a[_i];
                if (Object.keys(to).indexOf(x) !== -1
                    && to[x] !== null
                    && !helpers_1.deepEqual(from[x], to[x])) {
                    delta.updated[x] = to[x];
                }
            }
        }
        for (var _b = 0, _c = Object.keys(to); _b < _c.length; _b++) {
            var x = _c[_b];
            if (!from || (Object.keys(from).indexOf(x) === -1)) {
                if (to[x] !== null) {
                    delta.added[x] = to[x];
                }
            }
            else if (to[x] === null) {
                delta.removed.push(x);
            }
        }
        return delta;
    };
    return GW3Bridge;
}());
exports.GW3Bridge = GW3Bridge;
//# sourceMappingURL=gw3Bridge.js.map

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GW3ContextData = /** @class */ (function () {
    function GW3ContextData(contextId, name, isAnnounced, activityId) {
        // callbacks to invoke on context update
        this.updateCallbacks = {};
        this.contextId = contextId;
        this.name = name;
        this.isAnnounced = isAnnounced;
        this.activityId = activityId;
        this.context = {};
    }
    GW3ContextData.prototype.hasCallbacks = function () {
        return Object.keys(this.updateCallbacks).length > 0;
    };
    // for reference only
    // should never return 0
    GW3ContextData.prototype.getState = function () {
        if (this.isAnnounced && this.hasCallbacks()) {
            return 3;
        }
        if (this.isAnnounced) {
            return 2;
        }
        if (this.hasCallbacks()) {
            return 1;
        }
        return 0;
    };
    return GW3ContextData;
}());
exports.GW3ContextData = GW3ContextData;
//# sourceMappingURL=gw3ContextData.js.map

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HCBridge = /** @class */ (function () {
    function HCBridge(config) {
        this._facade = window.htmlContainer.sharedContextFacade;
    }
    HCBridge.prototype.all = function () {
        var allObj = this._facade.all();
        if (!allObj || !allObj.keys) {
            return [];
        }
        return allObj.keys;
    };
    HCBridge.prototype.update = function (name, delta) {
        this._facade.update(name, delta);
        return Promise.resolve();
    };
    HCBridge.prototype.set = function (name, data) {
        this._facade.set(name, data);
        return Promise.resolve();
    };
    HCBridge.prototype.subscribe = function (name, callback) {
        return Promise.resolve(this._facade.subscribe(name, callback));
    };
    HCBridge.prototype.unsubscribe = function (key) {
        this._facade.unsubscribe(key);
    };
    return HCBridge;
}());
exports.HCBridge = HCBridge;
//# sourceMappingURL=hcBridge.js.map

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gw3Bridge_1 = __webpack_require__(58);
var hcBridge_1 = __webpack_require__(60);
var ContextsModule = /** @class */ (function () {
    function ContextsModule(config) {
        this.config = config;
        try {
            if (typeof window !== "undefined" && typeof window.htmlContainer !== "undefined") {
                var hc = window.htmlContainer;
                if (!hc.sharedContextFacade) {
                    throw new Error("Your version of HtmlContainer does not support contexts."
                        + " Get version 1.46.0.0 or later to have that feature.");
                }
                this._bridge = new hcBridge_1.HCBridge(config);
            }
            else if (config.connection.protocolVersion === 3) {
                this._bridge = new gw3Bridge_1.GW3Bridge(config);
            }
            else {
                throw new Error("To use the Contexts library you must run in the"
                    + " HTML Container or using a connection to Gateway v3.");
            }
        }
        catch (err) {
            throw err;
        }
    }
    ContextsModule.prototype.all = function () {
        return this._bridge.all();
    };
    /**
     * Updates a context with some object. The object properties will replace the context properties, any other
     * context properties will remain in the context. If the context does not exists the update call will create it.
     *
     * @example
     * // if theme does not exists creates a context called theme with initial value
     * glue.contexts.update("theme", {font:10, font-family:"Arial"})
     *
     * // increases font to 11, after that call context is {font:10, font-family:"Arial"}
     * glue.contexts.update("theme", {font:11})
     *
     * @function
     * @param name Name of the context to be updated
     * @param data The object that will be applied to the context
     */
    ContextsModule.prototype.update = function (name, delta) {
        return this._bridge.update(name, delta);
    };
    /**
     * Replaces a context
     * @function
     * @param name Name of the context to be updated
     * @param data The object that will be applied to the context
     */
    ContextsModule.prototype.set = function (name, data) {
        return this._bridge.set(name, data);
    };
    /**
     * Subscribe for context events
     * @function
     *
     * @param name name of the context to subscribe for
     * @param callback function that will receive updates.
     * @returns Function execute the returned function to unsubscribe
     */
    ContextsModule.prototype.subscribe = function (name, callback) {
        var _this = this;
        return this._bridge
            .subscribe(name, callback)
            .then(function (key) {
            return function () {
                _this._bridge.unsubscribe(key);
            };
        });
    };
    return ContextsModule;
}());
exports.ContextsModule = ContextsModule;
//# sourceMappingURL=contextsModule.js.map

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function applyContextDelta(context, delta) {
    if (delta) {
        if (delta.reset) {
            context = __assign({}, delta.reset);
            return context;
        }
        context = Object.assign({}, context);
        var added_1 = delta.added;
        var updated_1 = delta.updated;
        var removed = delta.removed;
        if (added_1) {
            Object.keys(added_1).forEach(function (key) {
                context[key] = added_1[key];
            });
        }
        if (updated_1) {
            Object.keys(updated_1).forEach(function (key) {
                context[key] = updated_1[key];
            });
        }
        if (removed) {
            removed.forEach(function (key) {
                delete context[key];
            });
        }
    }
    return context;
}
exports.applyContextDelta = applyContextDelta;
// https://stackoverflow.com/a/6713782/1527706
function deepEqual(x, y) {
    if (x === y) {
        return true;
    }
    // if both x and y are null or undefined and exactly the same
    if (!(x instanceof Object) || !(y instanceof Object)) {
        return false;
    }
    // if they are not strictly equal, they both need to be Objects
    if (x.constructor !== y.constructor) {
        return false;
    }
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.
    for (var p in x) {
        if (!x.hasOwnProperty(p)) {
            continue;
        }
        // other properties were tested using x.constructor === y.constructor
        if (!y.hasOwnProperty(p)) {
            return false;
        }
        // allows to compare x[ p ] and y[ p ] when set to undefined
        if (x[p] === y[p]) {
            continue;
        }
        // if they have the same strict value or identity then they are equal
        if (typeof (x[p]) !== "object") {
            return false;
        }
        // Numbers, Strings, Functions, Booleans must be strictly equal
        if (!deepEqual(x[p], y[p])) {
            return false;
        }
        // Objects and Arrays must be tested recursively
    }
    for (var p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
            return false;
        }
        // allows x[ p ] to be set to undefined
    }
    return true;
}
exports.deepEqual = deepEqual;
//# sourceMappingURL=helpers.js.map

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var contextsModule_1 = __webpack_require__(61);
exports.ContextsModule = contextsModule_1.ContextsModule;
//# sourceMappingURL=main.js.map

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SaveContextMethodName = "T42.HC.GetSaveContext";
/**
 * Logic for apps that want to provide custom context on save
 */
var ContextProvider = /** @class */ (function () {
    function ContextProvider(agm, activitiesGetter, callbacks) {
        this.agm = agm;
        this.activitiesGetter = activitiesGetter;
        this.callbacks = callbacks;
        this.registeredRequestsMethods = false;
    }
    ContextProvider.prototype.onSaveRequested = function (callback) {
        if (!this.registeredRequestsMethods) {
            this.registerRequestMethods();
            this.registeredRequestsMethods = true;
        }
        return this.callbacks.add("saveRequested", callback);
    };
    ContextProvider.prototype.isActivityOwner = function () {
        // fallback for GD2 - remove once the bellow code is tested
        if (typeof htmlContainer !== "undefined") {
            var context = htmlContainer.getContext();
            return context && context._t42 && context._t42.activityIsOwner;
        }
        // check if we're the activity owners
        var activities = this.activitiesGetter();
        if (!activities) {
            return false;
        }
        if (!activities.inActivity) {
            return false;
        }
        var myWindow = activities.my.window;
        var myActivity = activities.my.activity;
        if (!myActivity && !myWindow) {
            return false;
        }
        // TODO - fix activities typings
        return myActivity.owner.id === myWindow.id;
    };
    ContextProvider.prototype.registerRequestMethods = function () {
        var _this = this;
        this.agm.register(SaveContextMethodName, function (args) {
            var requestResult = _this.callbacks.execute("saveRequested", args)[0];
            if (!requestResult) {
                return {};
            }
            requestResult.activityContext = requestResult.activityContext || {};
            requestResult.windowContext = requestResult.windowContext || {};
            // always include the window context
            var result = { windowContext: requestResult.windowContext, activityContext: undefined };
            // if we're the activity owner put the context too
            if (_this.isActivityOwner()) {
                result.activityContext = requestResult.activityContext;
            }
            return result;
        });
    };
    return ContextProvider;
}());
exports.default = ContextProvider;
//# sourceMappingURL=contextProvider.js.map

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = __webpack_require__(22);
var shortid_1 = __webpack_require__(29);
var contextProvider_1 = __webpack_require__(64);
var transform_1 = __webpack_require__(23);
var layout_1 = __webpack_require__(21);
var LayoutsAPIImpl = /** @class */ (function () {
    function LayoutsAPIImpl(config, stream, callbacks) {
        this.config = config;
        this.stream = stream;
        this.callbacks = callbacks;
        this.appManager = config.appManager;
        this.onEvent = stream.onEvent;
        this.provider = new contextProvider_1.default(config.agm, config.activityGetter, callbacks);
        stream.subscribe();
    }
    LayoutsAPIImpl.prototype.ready = function () {
        if (this.config.mode === "fullWaitSnapshot") {
            return this.stream.gotSnapshot;
        }
        return this.stream.ready;
    };
    LayoutsAPIImpl.prototype.save = function (layout) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.verifyNotSlimMode();
            if (!layout.name) {
                throw Error("layout.name argument is required");
            }
            if (!layout.type) {
                layout.type = "Global";
            }
            if (layout.activityId) {
                layout.type = "Activity";
            }
            if (typeof layout.ignoreHidden === "undefined") {
                layout.ignoreHidden = true; // default to true
            }
            var layoutObject = {
                name: layout.name,
                actIds: [],
                appIds: [],
                type: layout.type,
                context: layout.context,
                options: { ignoreLayoutRestrictions: false },
            };
            if (layout.type === "Activity") {
                var actId = layout.activityId;
                if (!actId) {
                    if (!_this.appManager.myInstance.inActivity) {
                        throw new Error("Current application is not in activity. Can not save activity layout for it");
                    }
                    actId = _this.appManager.myInstance.activityId;
                }
                layoutObject.actIds.push(actId);
                layoutObject.options = { ignoreLayoutRestrictions: true };
            }
            else if (layout.type === "Global") {
                var instances = _this.appManager.instances();
                if (layout.ignoreHidden) {
                    instances = instances.filter(function (i) { return _this.isVisibleWindow(i); });
                }
                if (layout.ignoreMyInstance && _this.appManager.myInstance) {
                    instances = instances.filter(function (i) { return i.id !== _this.appManager.myInstance.id; });
                }
                instances.reduce(function (prev, current) {
                    if (!current.id) {
                        return prev;
                    }
                    if (current.inActivity) {
                        var actId = current.activityId;
                        if (prev.actIds.indexOf(actId) === -1) {
                            prev.actIds.push(actId);
                        }
                    }
                    else {
                        prev.appIds.push(current.id);
                    }
                    return prev;
                }, layoutObject);
            }
            else {
                throw new Error("layout type " + layout.type + " not supported");
            }
            _this.invokeMethodAndTrack("T42.ACS.SaveLayout", layoutObject, resolve, reject);
        });
    };
    LayoutsAPIImpl.prototype.restore = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.verifyNotSlimMode();
            if (typeof options === "undefined") {
                throw Error("options argument is required");
            }
            if (!options.name) {
                throw Error("options.name argument is required");
            }
            if (!options.type) {
                options.type = "Global";
            }
            if (options.activityIdToJoin) {
                options.type = "Activity";
            }
            if (typeof options.restoreActivityOwner === "undefined") {
                options.restoreActivityOwner = false;
            }
            if (typeof options.ignoreActivityWindowTypes === "undefined") {
                options.ignoreActivityWindowTypes = [];
            }
            if (typeof options.setActivityContext === "undefined") {
                options.setActivityContext = true;
            }
            // if no closeOwnRunning we set closeRunningInstance to true; if
            if (typeof options.closeRunningInstance === "undefined") {
                if (options.type === "Global") {
                    options.closeRunningInstance = true;
                }
                else if (options.type === "Activity") {
                    // we don't close anything in case of activity layout type
                    options.closeRunningInstance = false;
                }
            }
            if (typeof options.reuseWindows === "undefined") {
                options.reuseWindows = true;
            }
            options.context = options.context || {};
            var t42 = {
                restoreOptions: {
                    activityToJoin: options.activityIdToJoin,
                    setActivityContext: options.setActivityContext,
                    ignoreActivityWindowTypes: options.ignoreActivityWindowTypes,
                    restoreActivityOwner: options.restoreActivityOwner,
                    closeOldWindows: true,
                    reuseExistingWindows: options.reuseWindows
                }
            };
            var arg = {
                type: options.type,
                name: options.name,
                context: options.context,
                toClose: [],
                splash: options.splash
            };
            if (options.closeRunningInstance) {
                arg.toClose = _this.getInstancesToClose(options);
            }
            if (options.timeout) {
                arg.timeout = options.timeout;
            }
            arg.context._t42 = t42;
            _this.invokeMethodAndTrack("T42.ACS.RestoreLayout", arg, resolve, reject, true);
        });
    };
    LayoutsAPIImpl.prototype.remove = function (type, name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.verifyNotSlimMode();
            if (!name) {
                throw Error("name argument is required");
            }
            if (!type) {
                throw Error("type argument is required");
            }
            var msg = {
                type: type,
                name: name,
            };
            _this.invokeMethodAndTrack("T42.ACS.RemoveLayout", msg, resolve, reject);
        });
    };
    LayoutsAPIImpl.prototype.list = function () {
        this.verifyNotSlimMode();
        return store_1.default.all;
    };
    LayoutsAPIImpl.prototype.import = function (layouts, mode) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.verifyNotSlimMode();
            var msg = {
                mode: mode || "replace",
                layouts: layouts
            };
            _this.invokeMethodAndTrack("T42.ACS.ImportLayouts", msg, resolve, reject);
        });
    };
    LayoutsAPIImpl.prototype.export = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var handleResult = function (result) {
                var layouts = _this.getObjectValues(result.Layouts).map(function (t) { return new layout_1.default(transform_1.default(t)); });
                resolve(layouts);
            };
            _this.invokeMethodAndTrack("T42.ACS.ExportLayouts", {}, handleResult, reject, true);
        });
    };
    LayoutsAPIImpl.prototype.rename = function (layout, newName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.verifyNotSlimMode();
            if (!layout) {
                throw Error("layout argument is required");
            }
            if (!layout.name) {
                throw Error("name argument is required");
            }
            if (!layout.type) {
                throw Error("type argument is required");
            }
            var msg = { type: layout.type, oldName: layout.name, newName: newName };
            _this.invokeMethodAndTrack("T42.ACS.RenameLayout", msg, resolve, reject);
        });
    };
    LayoutsAPIImpl.prototype.onAdded = function (callback) {
        var result = this.callbacks.add("added", callback);
        if (store_1.default.all.length > 0) {
            store_1.default.all.forEach(function (layout) {
                try {
                    callback(layout);
                }
                catch (err) { /** */ }
            });
        }
        return result;
    };
    LayoutsAPIImpl.prototype.onRemoved = function (callback) {
        return this.callbacks.add("removed", callback);
    };
    LayoutsAPIImpl.prototype.onChanged = function (callback) {
        return this.callbacks.add("changed", callback);
    };
    LayoutsAPIImpl.prototype.onRenamed = function (callback) {
        return this.callbacks.add("renamed", callback);
    };
    LayoutsAPIImpl.prototype.onEvent = function (callback) {
        return this.stream.onEvent(callback);
    };
    LayoutsAPIImpl.prototype.onSaveRequested = function (callback) {
        return this.provider.onSaveRequested(callback);
    };
    LayoutsAPIImpl.prototype.verifyNotSlimMode = function () {
        if (this.config.mode === "slim") {
            throw Error("Operation not allowed in slim mode. Run in full mode.");
        }
    };
    LayoutsAPIImpl.prototype.isVisibleWindow = function (instance) {
        // GD3
        // allow exes to participate in layouts (TODO - check if the app is layouts aware (has the layouts methods) - if not treat it as not visible window)
        if (instance.application.type === "exe" || instance.application.type === "node") {
            return true;
        }
        // allow activities to participate in layouts
        if (instance.application.type === "activity") {
            return true;
        }
        if (!instance || !instance.window) {
            return false;
        }
        return instance.window.isVisible;
    };
    LayoutsAPIImpl.prototype.invokeMethodAndTrack = function (methodName, args, resolve, reject, skipStreamEvent) {
        var streamEventReceived = skipStreamEvent;
        var agmResult;
        var token = shortid_1.generate();
        args.token = token;
        var handleResult = function () {
            if (streamEventReceived && agmResult) {
                resolve(agmResult);
            }
        };
        if (!skipStreamEvent) {
            this.stream.waitFor(token)
                .then(function () {
                streamEventReceived = true;
                handleResult();
            })
                .catch(function (err) {
                reject(err);
            });
        }
        var responseHandler = function (result) {
            if (!result.returned) {
                reject("No result from method " + methodName);
            }
            if (result.returned.status && (result.returned.status !== "Success" && result.returned.status !== "PartialSuccess")) {
                reject(result.returned);
            }
            agmResult = result.returned;
            handleResult();
        };
        this.config.agm.invoke(methodName, args, "best", { methodResponseTimeoutMs: 120 * 1000 })
            .then(responseHandler)
            .catch(function (err) { return reject(err); });
    };
    LayoutsAPIImpl.prototype.getInstancesToClose = function (options) {
        var _this = this;
        var instances = [];
        var shellApp = this.appManager.applications().filter(function (a) { return a.isShell; })[0];
        var shellApplicationName = shellApp ? shellApp.name : "AppManager";
        this.appManager.instances().forEach(function (i) {
            // ignore my instance
            if (_this.appManager.myInstance && i.id === _this.appManager.myInstance.id) {
                return;
            }
            // ignore shell app
            if (i.application.name === shellApplicationName) {
                return;
            }
            // ignore hidden windows
            if (!_this.isVisibleWindow(i)) {
                return;
            }
            // if activity layout stop only the instances
            // running in the same activity
            if (options.type === "Activity") {
                if (i.activityId !== options.activityIdToJoin) {
                    return;
                }
            }
            instances.push({ application: i.application.name, instance: i.id });
        });
        return instances;
    };
    LayoutsAPIImpl.prototype.getObjectValues = function (obj) {
        if (!obj) {
            return [];
        }
        return Object.keys(obj).map(function (k) { return obj[k]; });
    };
    return LayoutsAPIImpl;
}());
exports.default = LayoutsAPIImpl;
//# sourceMappingURL=layouts.js.map

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var layouts_1 = __webpack_require__(65);
var acsStream_1 = __webpack_require__(67);
var nullStream_1 = __webpack_require__(68);
var callback_registry_1 = __webpack_require__(1);
function default_1(config) {
    if (!config.agm) {
        throw Error("config.agm is required");
    }
    if (!config.logger) {
        throw Error("config.logger is required");
    }
    // default mode to slim
    config.mode = config.mode || "slim";
    var logger = config.logger;
    var callbacks = callback_registry_1.default();
    var acsStream;
    if (config.mode === "full" || "fullWaitSnapshot") {
        acsStream = new acsStream_1.default(config.agm, callbacks);
    }
    else {
        acsStream = nullStream_1.default();
    }
    return new layouts_1.default(config, acsStream, callbacks);
}
exports.default = default_1;
//# sourceMappingURL=main.js.map

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = __webpack_require__(22);
var layout_1 = __webpack_require__(21);
var transform_1 = __webpack_require__(23);
/**
 * ACS event stream related to layouts
 */
var ACSStream = /** @class */ (function () {
    function ACSStream(agm, callbacks) {
        var _this = this;
        this.agm = agm;
        this.callbacks = callbacks;
        this.ready = new Promise(function (resolve, reject) {
            _this.resolveReady = resolve;
            _this.rejectReady = reject;
        });
        this.gotSnapshot = new Promise(function (resolve, reject) {
            _this.resolveGotSnapshot = resolve;
            _this.rejectGotSnapshot = reject;
        });
    }
    ACSStream.prototype.subscribe = function (noRetry) {
        var _this = this;
        var transform = function (obj) {
            return _this.getObjectValues(obj).map(function (t) { return transform_1.default(t); });
        };
        // if we don't have OnLayoutEvent stream  we're running pre 2.1 GD version or outside GD,
        if (!this.checkForLayoutEventMethod()) {
            // if no retry resolve right away
            if (noRetry) {
                this.resolveReady();
            }
            // if we should retry, schedule  one more time
            setTimeout(function () {
                _this.subscribe(true);
            }, 500);
        }
        else {
            this.agm.subscribe("T42.ACS.OnLayoutEvent", { waitTimeoutMs: 10000 })
                .then(function (subs) {
                subs.onData(function (args) {
                    var data = args.data;
                    if (data.IsSnapshot) {
                        _this.resolveGotSnapshot();
                    }
                    _this.addLayouts(transform(data.OnLayoutAdded));
                    _this.removeLayouts(transform(data.OnLayoutRemoved));
                    _this.changeLayouts(transform(data.OnLayoutChanged));
                    _this.renameLayouts(transform(data.OnLayoutRenamed));
                    _this.callbacks.execute("streamEvent", data);
                });
                subs.onFailed(function (err) {
                    var msg = "can not subscribe to T42.ACS.OnLayoutEvent " + err;
                    _this.rejectReady(msg);
                    _this.rejectGotSnapshot(msg);
                });
                _this.resolveReady();
            })
                .catch(function (err) {
                var msg = "Error subscribing for T42.ACS.OnLayoutEvent stream. Err: " + err;
                _this.rejectReady(msg);
                _this.rejectGotSnapshot(msg);
            });
        }
    };
    ACSStream.prototype.onEvent = function (callback) {
        return this.callbacks.add("streamEvent", callback);
    };
    ACSStream.prototype.waitFor = function (token, timeout) {
        var _this = this;
        if (!timeout) {
            timeout = 10000; // default timeout is 10 seconds
        }
        return new Promise(function (resolve, reject) {
            var done = false;
            var unsubscribe = _this.onEvent(function (streamEvent) {
                if (streamEvent.Token === token) {
                    done = true;
                    unsubscribe();
                    resolve();
                }
            });
            setTimeout(function () {
                if (!done) {
                    reject("timed out");
                }
            }, timeout);
        });
    };
    ACSStream.prototype.checkForLayoutEventMethod = function () {
        try {
            return this.agm
                .methods()
                .map(function (m) { return m.name; })
                .indexOf("T42.ACS.OnLayoutEvent") !== -1;
        }
        catch (e) {
            return false;
        }
    };
    ACSStream.prototype.addLayouts = function (layoutsData) {
        var _this = this;
        if (!layoutsData) {
            return;
        }
        layoutsData.forEach(function (layoutData) {
            var layout = new layout_1.default(layoutData);
            store_1.default.add(layout);
            _this.callbacks.execute("added", layout);
        });
    };
    ACSStream.prototype.removeLayouts = function (removedLayouts) {
        var _this = this;
        if (!removedLayouts) {
            return;
        }
        removedLayouts.forEach(function (removedLayout) {
            store_1.default.removeWhere(function (existingLayout) { return !_this.compareLayouts(existingLayout, removedLayout); });
            _this.callbacks.execute("removed", removedLayout);
        });
    };
    ACSStream.prototype.changeLayouts = function (changedLayouts) {
        var _this = this;
        if (!changedLayouts) {
            return;
        }
        changedLayouts.forEach(function (changedLayout) {
            // removed the changed layout and push it again
            store_1.default.removeWhere(function (existingLayout) { return !_this.compareLayouts(existingLayout, changedLayout); });
            store_1.default.add(new layout_1.default(changedLayout));
            // execute callback
            _this.callbacks.execute("changed", changedLayout);
        });
    };
    ACSStream.prototype.renameLayouts = function (renamedLayouts) {
        var _this = this;
        if (!renamedLayouts) {
            return;
        }
        renamedLayouts.forEach(function (renamedLayout) {
            var existingLayout = store_1.default.first(function (current) { return _this.compareLayouts(current, { type: renamedLayout.type, name: renamedLayout.oldName }); });
            if (!existingLayout) {
                throw Error("received rename event for unknown layout with type " + renamedLayout.type + " and name " + renamedLayout.oldName);
            }
            existingLayout.name = renamedLayout.newName;
            _this.callbacks.execute("renamed", existingLayout);
        });
    };
    ACSStream.prototype.compareLayouts = function (layout1, layout2) {
        return layout1.name === layout2.name && layout1.type === layout2.type;
    };
    ACSStream.prototype.getObjectValues = function (obj) {
        if (!obj) {
            return [];
        }
        return Object.keys(obj).map(function (k) { return obj[k]; });
    };
    return ACSStream;
}());
exports.default = ACSStream;
//# sourceMappingURL=acsStream.js.map

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    return {
        ready: Promise.resolve(undefined),
        subscribe: function () { },
        onEvent: function (callback) { return function () { }; },
        waitFor: function (token, timeout) { return Promise.resolve(undefined); },
        gotSnapshot: Promise.resolve(undefined),
    };
}
exports.default = default_1;
//# sourceMappingURL=nullStream.js.map

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var glue_1 = __webpack_require__(25);
if (typeof window !== "undefined") {
    window.Glue = glue_1.default;
}
// add default library for ES6 modules
glue_1.default.default = glue_1.default;
module.exports = glue_1.default;
//# sourceMappingURL=main.js.map

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gd_1 = __webpack_require__(72);
var hc_1 = __webpack_require__(74);
exports.default = (function (agm, logger, appManagerGetter) {
    var _logger = logger;
    return new Promise(function (resolve, reject) {
        if (typeof window !== "undefined" && window.htmlContainer) {
            // We are running in HC
            _logger.trace("running in HC");
            hc_1.default(agm, _logger, appManagerGetter, window.htmlContainer.containerName, window.htmlContainer.windowId)
                .then(resolve)
                .catch(reject);
        }
        else if (typeof window !== "undefined" && window.glue42gd) {
            // We are running in GD 3
            _logger.trace("running in GD");
            var gd = new gd_1.default(agm, _logger, appManagerGetter, window.glue42gd.instance, window.glue42gd.windowId);
            gd.init()
                .then(resolve)
                .catch(reject);
        }
        else {
            // We are running in Browser or Node, we should check which stream is available
            // But we need to pass the container as dependency
            var hcPromise = hc_1.default(agm, _logger, appManagerGetter);
            var gdPromise = new gd_1.default(agm, _logger, appManagerGetter).init();
            var wait = function (ms) { return new Promise(function (res, rej) { return setTimeout(function () { rej("timeout waiting for streams"); }, ms); }); };
            Promise.race([hcPromise, gdPromise, wait(10000)])
                .then(resolve)
                .catch(reject);
        }
    });
});
//# sourceMappingURL=detector.js.map

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var objectAssign = __webpack_require__(27);
var GDExecutor = /** @class */ (function () {
    function GDExecutor() {
    }
    Object.defineProperty(GDExecutor.prototype, "hostInstance", {
        get: function () {
            return this.agmTarget;
        },
        enumerable: true,
        configurable: true
    });
    GDExecutor.prototype.init = function (agm, instance) {
        this.agm = agm;
        this.agmTarget = instance;
    };
    GDExecutor.prototype.close = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.execute("close", { windowId: resultWindow.id })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.navigate = function (resultWindow, newUrl) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.execute("navigate", {
                windowId: resultWindow.id,
                options: {
                    url: newUrl,
                },
            })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.setStyle = function (resultWindow, style) {
        return new Promise(function (resolve, reject) {
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            Promise.resolve();
        });
    };
    GDExecutor.prototype.setTitle = function (resultWindow, newTitle) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var options = {
                windowId: resultWindow.id,
                options: {
                    title: newTitle,
                },
            };
            _this.execute("setTitle", options)
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
            Promise.resolve();
        });
    };
    GDExecutor.prototype.moveResize = function (resultWindow, dimensions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.execute("moveResize", {
                windowId: resultWindow.id,
                options: {
                    bounds: dimensions,
                },
            })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.addFrameButton = function (resultWindow, buttonInfo) {
        return new Promise(function (resolve, reject) {
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            Promise.resolve();
        });
    };
    GDExecutor.prototype.removeFrameButton = function (resultWindow, buttonId) {
        return new Promise(function (resolve, reject) {
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            Promise.resolve();
        });
    };
    GDExecutor.prototype.activate = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.execute("activate", { windowId: resultWindow.id })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.focus = function (resultWindow) {
        return new Promise(function (resolve, reject) {
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            Promise.resolve();
        });
    };
    GDExecutor.prototype.maximizeRestore = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            _this.execute("maximizeRestore", { windowId: resultWindow.id })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.maximize = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.execute("maximize", { windowId: resultWindow.id })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.restore = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.execute("restore", { windowId: resultWindow.id })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.minimize = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.execute("minimize", { windowId: resultWindow.id })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.collapse = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.execute("collapse", { windowId: resultWindow.id })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.expand = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.execute("expand", { windowId: resultWindow.id })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.toggleCollapse = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.execute("toggleCollapse", { windowId: resultWindow.id })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.snap = function (resultWindow, target) {
        return new Promise(function (resolve, reject) {
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            Promise.resolve();
        });
    };
    GDExecutor.prototype.attachTab = function (resultWindow, tab, index) {
        return new Promise(function (resolve, reject) {
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            Promise.resolve();
        });
    };
    GDExecutor.prototype.detachTab = function (resultWindow, opt) {
        return new Promise(function (resolve, reject) {
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            Promise.resolve();
        });
    };
    GDExecutor.prototype.setVisible = function (resultWindow, toBeVisible) {
        var _this = this;
        if (toBeVisible === void 0) { toBeVisible = true; }
        return new Promise(function (resolve, reject) {
            var command;
            if (toBeVisible) {
                command = "show";
            }
            else {
                command = "hide";
            }
            _this.execute(command, { windowId: resultWindow.id })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.showLoader = function (resultWindow, loader) {
        return new Promise(function (resolve, reject) {
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            Promise.resolve();
        });
    };
    GDExecutor.prototype.hideLoader = function (resultWindow) {
        return new Promise(function (resolve, reject) {
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            Promise.resolve();
        });
    };
    GDExecutor.prototype.updateContext = function (resultWindow, context) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.execute("updateContext", {
                windowId: resultWindow.id,
                context: context,
                replace: Object.keys(resultWindow.context).length > 0 ? false : true,
            })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.lock = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.execute("lockUnlock", {
                windowId: resultWindow.id,
                options: {
                    isLocked: true,
                },
            })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.unlock = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.execute("lockUnlock", {
                windowId: resultWindow.id,
                options: {
                    isLocked: false,
                },
            })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.getIcon = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.execute("getIcon", {
                windowId: resultWindow.id,
                options: {},
            })
                .then(function (result) {
                resolve(result.icon);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.setIcon = function (resultWindow, base64Image) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.execute("setIcon", {
                windowId: resultWindow.id,
                options: {
                    dataURL: base64Image
                },
            })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.setFrameColor = function (resultWindow, frameColor) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            _this.execute("setFrameColor", {
                windowId: resultWindow.id,
                options: {
                    frameColor: frameColor
                },
            })
                .then(function () {
                resolve(resultWindow);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GDExecutor.prototype.setTabHeaderVisible = function (resultWindow, toBeTabHeaderVisible) {
        return new Promise(function (resolve, reject) {
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            Promise.resolve();
        });
    };
    GDExecutor.prototype.execute = function (command, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var args = {};
            objectAssign(args, options);
            args.command = command;
            _this.agm.invoke("T42.Wnd.Execute", args, _this.agmTarget)
                .then(function (i) {
                if (i.returned && i.returned.errorMsg) {
                    reject(i);
                }
                else {
                    resolve(i.returned);
                }
            })
                .catch(function (i) {
                reject(i);
            });
        });
    };
    /** Groups */
    GDExecutor.prototype.setGroupHeaderVisible = function (windowId, toShow) {
        return this.execute("setGroupHeaderVisibility", {
            windowId: windowId,
            options: {
                toShow: toShow,
            },
        });
    };
    return GDExecutor;
}());
exports.GDExecutor = GDExecutor;
exports.default = new GDExecutor();
//# sourceMappingURL=executor.js.map

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CallbackFactory = __webpack_require__(1);
var store_1 = __webpack_require__(4);
var window_1 = __webpack_require__(24);
var executor_1 = __webpack_require__(71);
var GDEnvironment = /** @class */ (function () {
    function GDEnvironment(agm, logger, appManagerGetter, instance, wndId) {
        this._registry = CallbackFactory();
        this._waitTimeout = 10000;
        this._agm = agm;
        this._logger = logger.subLogger("gd-env");
        this._agmInstance = this.normalizeInstance(instance);
        this._windowId = wndId;
        this._appManagerGetter = appManagerGetter;
    }
    GDEnvironment.prototype.init = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // if we don't have an Instance, thats means that we are running outside from any Tick42 Containers
            // so our target is best
            if (typeof _this._agmInstance === "undefined") {
                _this._agmInstance = "best";
            }
            var streamPromise = new Promise(function (streamResolve, streamReject) {
                _this._agm.subscribe("T42.Wnd.OnEvent", {
                    waitTimeoutMs: _this._waitTimeout,
                    target: _this._agmInstance,
                })
                    .then(function (stream) {
                    stream.onData(function (streamData) {
                        _this.updateWindow(streamData.data);
                    });
                    stream.onFailed(function (err) {
                        reject(err);
                    });
                    _this._agmInstance = _this.normalizeInstance(stream.serverInstance);
                    // Init the executor
                    executor_1.default.init(_this._agm, _this._agmInstance);
                    resolve(_this);
                })
                    .catch(function (err) {
                    reject("Can not subscribe for stream T42.Wnd.OnEvent. Err: " + err);
                });
            });
        });
    };
    Object.defineProperty(GDEnvironment.prototype, "executor", {
        get: function () {
            return executor_1.default;
        },
        enumerable: true,
        configurable: true
    });
    GDEnvironment.prototype.open = function (name, url, options, success, error) {
        options = options || {};
        // relativeTo fix
        if (typeof options.relativeTo !== "undefined" && typeof options.relativeTo !== "string") {
            options.relativeTo = options.relativeTo.id || "";
        }
        options.name = name;
        options.url = url;
        this._agm.invoke("T42.Wnd.Create", options, this._agmInstance)
            .then(function (message) {
            if (message.returned !== undefined) {
                var id = message.returned.id;
                success(id);
            }
            else {
                error("failed to execute T42.Wnd.Create - unknown reason");
            }
        }).catch(function (e) {
            if (typeof error === "function") {
                error(e);
            }
        });
    };
    GDEnvironment.prototype.tabAttached = function (callback) {
        return this._registry.add("tab-attached", callback);
    };
    GDEnvironment.prototype.tabDetached = function (callback) {
        return this._registry.add("tab-detached", callback);
    };
    GDEnvironment.prototype.onWindowFrameColorChanged = function (callback) {
        return this._registry.add("frame-color-changed", callback);
    };
    GDEnvironment.prototype.onEvent = function (callback) {
        return this._registry.add("window-event", callback);
    };
    GDEnvironment.prototype.my = function () {
        return this._windowId;
    };
    GDEnvironment.prototype.execute = function (command, options) {
        return this._agm.invoke("T42.Wnd.Execute", {
            command: command,
            options: options,
        });
    };
    /** Groups */
    GDEnvironment.prototype.setGroupHeaderVisible = function (windowId, toShow) {
        return this._agm.invoke("T42.Wnd.SetGroupHeaderVisible", {
            windowId: windowId,
            toShow: toShow,
        }, this._agmInstance);
    };
    GDEnvironment.prototype.onCompositionChanged = function (callback) {
        return this._registry.add("composition-changed", callback);
    };
    GDEnvironment.prototype.onGroupHeaderVisibilityChanged = function (callback) {
        return this._registry.add("group-header-changed", callback);
    };
    GDEnvironment.prototype.onWindowGotFocus = function (callback) {
        return this._registry.add("got-focus", callback);
    };
    GDEnvironment.prototype.onWindowLostFocus = function (callback) {
        return this._registry.add("lost-focus", callback);
    };
    GDEnvironment.prototype.normalizeInstance = function (instance) {
        if (!instance) {
            return undefined;
        }
        return {
            application: instance.application,
            machine: instance.machine,
            user: instance.user,
        };
    };
    GDEnvironment.prototype.updateWindow = function (windowInfo) {
        var _this = this;
        // this is the snapshot of all windows
        if (windowInfo.type === "Snapshot") {
            var windowInfoFullInfoEvent = windowInfo;
            windowInfoFullInfoEvent.windows.forEach(function (w) {
                var win = _this.createWindow(w.id, w);
                store_1.default.markReadyToShow(win.API.id);
                _this._registry.execute("window-event", windowInfo);
            });
            return;
        }
        // if new window handle it separately
        if (windowInfo.type === "Created") {
            var windowInfoCreatedEvent = windowInfo;
            var win = this.createWindow(windowInfoCreatedEvent.windowId, windowInfoCreatedEvent.data || {});
            store_1.default.setReadyState(win.API.id);
            this._registry.execute("window-event", windowInfo);
            return;
        }
        // otherwise check if the window is in our internal collections and update its state
        var windowObjectAndEvents = store_1.default.get(windowInfo.windowId);
        if (!windowObjectAndEvents) {
            this._logger.error("received update for unknown window. Stream:', " + JSON.stringify(windowInfo, null, 4));
            return;
        }
        var theWindow = windowObjectAndEvents.API;
        var theWindowEvents = windowObjectAndEvents.Events;
        // handle bounds changed
        if (windowInfo.type === "BoundsChanged") {
            theWindowEvents.handleBoundsChanged(windowInfo.data);
        }
        // handle url changed
        if (windowInfo.type === "UrlChanged") {
            var windowInfoUrlChangedEvent = windowInfo;
            store_1.default.setUrlChangedState(windowInfoUrlChangedEvent.windowId);
            theWindowEvents.handleUrlChanged(windowInfoUrlChangedEvent.data);
        }
        // handle title changed
        if (windowInfo.type === "TitleChanged") {
            theWindowEvents.handleTitleChanged(windowInfo.data);
        }
        // handle visibility changed
        if (windowInfo.type === "VisibilityChanged") {
            theWindowEvents.handleVisibilityChanged(windowInfo.data);
        }
        // handle context changed
        if (windowInfo.type === "ContextChanged") {
            theWindowEvents.handleContextUpdated(windowInfo.data);
        }
        // handle window state changed
        if (windowInfo.type === "StateChanged") {
            theWindowEvents.handleWindowChangeState(windowInfo.data);
        }
        // handle frame color changed
        if (windowInfo.type === "FrameColorChanged") {
            theWindowEvents.handleFrameColorChanged(windowInfo.data);
            this._registry.execute("frame-color-changed", theWindow);
        }
        // handle composition changed - groups API
        if (windowInfo.type === "CompositionChanged") {
            theWindowEvents.handleCompositionChanged(windowInfo.data.neighbors, windowInfo.data.groupId);
            this._registry.execute("composition-changed", windowInfo.data);
        }
        if (windowInfo.type === "GroupHeaderVisibilityChanged") {
            theWindowEvents.handleGroupHeaderVisibilityChanged(windowInfo.data.groupHeaderVisible);
            this._registry.execute("group-header-changed", windowInfo.data);
        }
        // handle focus changed
        if (windowInfo.type === "FocusChanged") {
            theWindowEvents.handleFocusChanged(windowInfo.data);
        }
        // Clear the window on close event
        if (windowInfo.type === "Closed") {
            store_1.default.remove(windowObjectAndEvents);
            theWindowEvents.handleWindowClose();
        }
        // expose to external listeners
        this._registry.execute("window-event", windowInfo);
    };
    GDEnvironment.prototype.createWindow = function (windowId, options) {
        var windowObjAndEvents = window_1.default(windowId, this.mapToWindowConstructorOptions(options), executor_1.default, this._logger, this._appManagerGetter);
        store_1.default.add(windowObjAndEvents);
        return windowObjAndEvents;
    };
    GDEnvironment.prototype.mapToWindowConstructorOptions = function (args) {
        // TODO
        return {
            name: args.name,
            context: args.context,
            bounds: args.bounds,
            url: args.url,
            title: args.title,
            isVisible: args.isVisible,
            isFocused: args.isFocused,
            state: args.state,
            frameColor: args.frameColor,
            groupId: args.groupId,
            neighbours: args.neighbors,
            isGroupHeaderVisible: args.groupHeaderVisible,
            isCollapsed: args.isCollapsed,
        };
    };
    return GDEnvironment;
}());
exports.default = GDEnvironment;
//# sourceMappingURL=gd.js.map

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HcExecutor = /** @class */ (function () {
    function HcExecutor() {
    }
    Object.defineProperty(HcExecutor.prototype, "hostInstance", {
        get: function () {
            return this.agmTarget;
        },
        enumerable: true,
        configurable: true
    });
    HcExecutor.prototype.init = function (agm, instance) {
        this.agm = agm;
        this.agmTarget = instance;
    };
    HcExecutor.prototype.close = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                return resultWindow.url === undefined;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.Close", successHandler, errorHandler, {}, conditionFunc, resultWindow.onClose);
        });
    };
    HcExecutor.prototype.navigate = function (resultWindow, newUrl) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                return resultWindow.url === newUrl;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Html.OpenUrl", successHandler, errorHandler, { url: newUrl }, conditionFunc, resultWindow.onUrlChanged, true);
        });
    };
    HcExecutor.prototype.setStyle = function (resultWindow, style) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.SetWindowStyle", successHandler, errorHandler, { windowStyleAttributes: JSON.stringify(style) });
        });
    };
    HcExecutor.prototype.setTitle = function (resultWindow, newTitle) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                return resultWindow.title === newTitle;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.SetWindowTitle", successHandler, errorHandler, { title: newTitle }, conditionFunc, resultWindow.onTitleChanged);
        });
    };
    HcExecutor.prototype.moveResize = function (resultWindow, dimensions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                var b = resultWindow.bounds;
                var isSame = true;
                Object.keys(dimensions).forEach(function (key) {
                    if (dimensions[key] !== b[key]) {
                        isSame = false;
                        return;
                    }
                });
                return isSame;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.ResizeAndMove", successHandler, errorHandler, dimensions, conditionFunc, resultWindow.onBoundsChanged);
        });
    };
    HcExecutor.prototype.addFrameButton = function (resultWindow, buttonInfo) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                return false;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.AddFrameButton", successHandler, errorHandler, { buttonInfo: buttonInfo }, conditionFunc, resultWindow.onFrameButtonAdded);
        });
    };
    HcExecutor.prototype.removeFrameButton = function (resultWindow, buttonId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                return false;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.RemoveFrameButton", successHandler, errorHandler, { buttonId: buttonId }, conditionFunc, resultWindow.onFrameButtonRemoved);
        });
    };
    HcExecutor.prototype.activate = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                return resultWindow.isFocused;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.Activate", successHandler, errorHandler, {}, conditionFunc, resultWindow.onFocusChanged);
        });
    };
    HcExecutor.prototype.focus = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                return false;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.Activate", successHandler, errorHandler, { focus: true }, conditionFunc, resultWindow.onFocusChanged);
        });
    };
    HcExecutor.prototype.maximizeRestore = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.MaximizeOrRestoreDown", successHandler, errorHandler);
        });
    };
    HcExecutor.prototype.maximize = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                return resultWindow.state === "maximized";
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.Maximize", successHandler, errorHandler, {}, conditionFunc, resultWindow.onMaximized);
        });
    };
    HcExecutor.prototype.restore = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                return resultWindow.state === "normal";
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.Restore", successHandler, errorHandler, {}, conditionFunc, resultWindow.onNormal);
        });
    };
    HcExecutor.prototype.minimize = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                return resultWindow.state === "minimized";
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.Minimize", successHandler, errorHandler, {}, conditionFunc, resultWindow.onMinimized);
        });
    };
    HcExecutor.prototype.collapse = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                return resultWindow.isCollapsed;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.SetCollapsed", successHandler, errorHandler, { collapsed: true }, conditionFunc, resultWindow.onCollapsed);
        });
    };
    HcExecutor.prototype.expand = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                return !resultWindow.isCollapsed;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.SetCollapsed", successHandler, errorHandler, { collapsed: false }, conditionFunc, resultWindow.onExpanded);
        });
    };
    HcExecutor.prototype.toggleCollapse = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                return false;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            var subscribeFunc = resultWindow.isCollapsed ? resultWindow.onExpanded : resultWindow.onCollapsed;
            return _this.agmAction(resultWindow, "T42.Wnd.SetCollapsed", successHandler, errorHandler, { title: "" }, conditionFunc, subscribeFunc);
        });
    };
    HcExecutor.prototype.snap = function (resultWindow, target, direction) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var sourceWindowId = resultWindow.id;
            var targetWindowId;
            var errorMessage = "Invalid target parameter - should be an object with property id or a string. Invoked for source window id:" + resultWindow.id;
            if (!target) {
                reject(errorMessage);
                return;
            }
            if (typeof target === "string") {
                targetWindowId = target;
            }
            else if (typeof target.id !== "undefined") {
                targetWindowId = target.id;
            }
            else {
                reject(errorMessage);
                return;
            }
            var args = {
                sourceWindowId: sourceWindowId,
                targetWindowId: targetWindowId,
            };
            if (direction) {
                args.snappingEdge = direction;
            }
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.Snap", successHandler, errorHandler, args);
        });
    };
    HcExecutor.prototype.attachTab = function (resultWindow, tab, index) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var sourceWindowId;
            var targetWindowId = resultWindow.id;
            var errorMessage = "Invalid tab parameter - should be an object with property id or a string. Invoked for source window id:" + resultWindow.id;
            if (!tab) {
                reject(errorMessage);
                return;
            }
            if (typeof tab === "string") {
                sourceWindowId = tab;
            }
            else if (typeof tab.id !== "undefined") {
                sourceWindowId = tab.id;
            }
            else {
                reject(errorMessage);
                return;
            }
            var argsForSend = {
                sourceWindowId: sourceWindowId,
                targetWindowId: targetWindowId,
            };
            if (index) {
                argsForSend.index = index;
            }
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.AttachTab", successHandler, errorHandler, argsForSend);
        });
    };
    HcExecutor.prototype.detachTab = function (resultWindow, opt) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var argsForSend = { windowId: resultWindow.id };
            var _options = opt || {};
            if (typeof _options.relativeTo !== "undefined") {
                if (typeof _options.relativeTo === "string") {
                    argsForSend.relativeTo = _options.relativeTo;
                }
                else if (typeof _options.relativeTo.id !== "undefined") {
                    argsForSend.relativeTo = _options.relativeTo.id;
                }
                if (typeof _options.relativeDirection !== "undefined") {
                    argsForSend.relativeDirection = _options.relativeDirection;
                }
                if (typeof _options.width !== "undefined") {
                    argsForSend.width = _options.width;
                }
                if (typeof _options.height !== "undefined") {
                    argsForSend.height = _options.height;
                }
            }
            if (typeof _options.bounds !== "undefined") {
                argsForSend.bounds = _options.bounds;
            }
            if (typeof _options.hideTabHeader !== "undefined") {
                argsForSend.hideTabHeader = _options.hideTabHeader;
            }
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.DettachTab", successHandler, errorHandler, argsForSend);
        });
    };
    HcExecutor.prototype.setVisible = function (resultWindow, toBeVisible) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof toBeVisible === "undefined") {
                toBeVisible = true;
            }
            var conditionFunc = function () {
                return resultWindow.isVisible === toBeVisible;
            };
            var styles = { Hidden: !toBeVisible };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.SetWindowStyle", successHandler, errorHandler, { windowStyleAttributes: JSON.stringify(styles) }, conditionFunc, resultWindow.onVisibilityChanged);
        });
    };
    HcExecutor.prototype.showLoader = function (resultWindow, loader) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var opt = loader || {};
            opt.enabled = true;
            opt.timeout = opt.timeout || -1; // by default show the loader forever
            var argsForSend = { loader: opt };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.UpdateLoader", successHandler, errorHandler, argsForSend);
        });
    };
    HcExecutor.prototype.hideLoader = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.UpdateLoader", successHandler, errorHandler, { loader: { enabled: false } });
        });
    };
    HcExecutor.prototype.updateContext = function (resultWindow, context) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!context) {
                reject("Invalid context parameter - should be an object. Invoked for source window id:" + resultWindow.id);
                return;
            }
            var conditionFunc = function () {
                return false;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.UpdateContext", successHandler, errorHandler, { context: context }, conditionFunc, resultWindow.onContextUpdated);
        });
    };
    HcExecutor.prototype.lock = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                return false;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.Lock", successHandler, errorHandler, {}, conditionFunc, resultWindow.onLockingChanged);
        });
    };
    HcExecutor.prototype.unlock = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conditionFunc = function () {
                return false;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.Unlock", successHandler, errorHandler, {}, conditionFunc, resultWindow.onLockingChanged);
        });
    };
    HcExecutor.prototype.getIcon = function (resultWindow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // TODO check it in HC
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.GetIcon", successHandler, errorHandler);
        });
    };
    HcExecutor.prototype.setIcon = function (resultWindow, base64Image) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!base64Image) {
                reject("Invalid base64Image parameter. Invoked for source window id:" + resultWindow.id);
                return;
            }
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.SetIcon", successHandler, errorHandler, { base64ImageSource: base64Image });
        });
    };
    HcExecutor.prototype.setFrameColor = function (resultWindow, frameColor) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!frameColor) {
                reject("Invalid frameColor parameter. Invoked for source window id:" + resultWindow.id);
                return;
            }
            var conditionFunc = function () {
                return false;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.SetWindowStyle", successHandler, errorHandler, { windowStyleAttributes: JSON.stringify({ stickyFrameColor: frameColor }) }, conditionFunc, resultWindow.onFrameColorChanged);
        });
    };
    HcExecutor.prototype.setTabHeaderVisible = function (resultWindow, toBeTabHeaderVisible) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof toBeTabHeaderVisible === "undefined") {
                toBeTabHeaderVisible = true;
            }
            var conditionFunc = function () {
                return resultWindow.isTabHeaderVisible === toBeTabHeaderVisible;
            };
            function successHandler(w) {
                resolve(w);
            }
            function errorHandler(e) {
                reject(e);
            }
            return _this.agmAction(resultWindow, "T42.Wnd.SetTabHeaderVisible", successHandler, errorHandler, { toShow: toBeTabHeaderVisible }, conditionFunc, resultWindow.onTabHeaderVisibilityChanged);
        });
    };
    HcExecutor.prototype.execute = function (command, options) {
        return this.agm.invoke("T42.Wnd.Execute", {
            command: command,
            options: options,
        });
    };
    /** Groups */
    HcExecutor.prototype.setGroupHeaderVisible = function (windowId, toShow) {
        return this.agm.invoke("T42.Wnd.SetGroupHeaderVisible", {
            windowId: windowId,
            toShow: toShow,
        }, this.agmTarget);
    };
    HcExecutor.prototype.agmAction = function (resultWindow, action, success, error, args, conditionFunc, subscribeFunc, ignoreTimeout) {
        // Stop if the window is closed
        ignoreTimeout = ignoreTimeout || false;
        if (resultWindow.url === undefined) {
            if (typeof error === "function") {
                error("Cannot execute a command on a closed window.");
            }
            return;
        }
        if (typeof conditionFunc === "undefined" || conditionFunc()) {
            this.agmInvoke(resultWindow, action, args, success, error);
        }
        else {
            var removeCallback_1 = function () {
                return;
            };
            var isResolved_1 = false;
            var successHandler = function () {
                isResolved_1 = true;
                removeCallback_1();
                if (typeof success === "function") {
                    success(resultWindow);
                }
            };
            removeCallback_1 = subscribeFunc(successHandler);
            if (!ignoreTimeout) {
                setTimeout(function () {
                    if (!isResolved_1) {
                        if (typeof error === "function") {
                            error("Agm invoke timeout! action: " + action);
                        }
                    }
                }, 2000);
            }
            this.agmInvoke(resultWindow, action, args, function () {
                return;
            }, error);
        }
    };
    HcExecutor.prototype.agmInvoke = function (resultWindow, action, args, success, error) {
        // Add the window ID to the arguments
        args = args || {};
        args.windowId = resultWindow.id;
        // Invoke the AGM method
        this.agm.invoke(action, args, this.agmTarget, {}, successHandler, errorHandler);
        function successHandler() {
            if (typeof success === "function") {
                success(resultWindow);
            }
        }
        function errorHandler(err) {
            if (typeof error === "function") {
                if (err.all_return_values && err.all_return_values.length > 0) {
                    error(err.all_return_values[0].message);
                }
                else {
                    error(err);
                }
            }
        }
    };
    return HcExecutor;
}());
exports.HcExecutor = HcExecutor;
exports.default = new HcExecutor();
//# sourceMappingURL=executor.js.map

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CallbackFactory = __webpack_require__(1);
var store_1 = __webpack_require__(4);
var window_1 = __webpack_require__(24);
var executor_1 = __webpack_require__(73);
exports.default = (function (agm, logger, appManagerGetter, cntName, wndId) {
    return new Promise(function (resolve, reject) {
        var _registry = CallbackFactory();
        var _logger = logger.subLogger("hc-env");
        var waitTimeout = 10000;
        var _windowId = wndId;
        var hcEnv;
        var instance;
        // We have two cases here:
        // 1. when we are in HC
        // 2. when we are in Browser/Node, but we have also started  HC/GD
        if (typeof cntName !== "undefined") {
            instance = { application: "HtmlContainer." + cntName };
        }
        else {
            instance = "best";
        }
        var streamPromise = new Promise(function (streamResolve, streamReject) {
            agm.subscribe("T42.Wnd.WindowStateChanged", {
                waitTimeoutMs: waitTimeout,
                target: instance,
            })
                .then(function (stream) {
                stream.onData(function (streamData) {
                    instance = streamData.server;
                    updateWindow(streamData.data.state, streamData.data);
                });
                stream.onFailed(function (err) {
                    streamReject(err);
                });
                streamResolve();
            })
                .catch(function (err) {
                streamReject("Can not subscribe for stream T42.Wnd.WindowStateChanged. Err: " + err);
            });
        });
        var listWindowsPromise = new Promise(function (listWndResolve, listWndReject) {
            agm.invoke("T42.Wnd.ListWindows", {}, instance, { waitTimeoutMs: waitTimeout })
                .then(function (result) {
                // add the server object
                instance = result.executed_by;
                // populate windows
                Object.keys(result.returned).forEach(function (existingWindow) {
                    var windowInfo = result.returned[existingWindow];
                    var windowObjAndEvents = createWindow(windowInfo.windowId, windowInfo);
                    // Added to store, showing to world
                    store_1.default.markReadyToShow(windowObjAndEvents.API.id);
                });
                listWndResolve();
            })
                .catch(function (e) {
                listWndReject("Can not invoke T42.Wnd.ListWindows method. Err: " + e);
            });
        });
        Promise.all([streamPromise, listWindowsPromise])
            .then(function () {
            // Init the executor, if we have container name - use it, if not get the first one from the collection
            executor_1.default.init(agm, instance);
            resolve(hcEnv);
        })
            .catch(function (e) {
            reject("can not subscribe for stream T42.Wnd.WindowStateChanged or can not invoke T42.Wnd.ListWindows ");
        });
        function updateWindow(eventType, windowInfo) {
            // if new window handle it separately
            if (eventType === "Created") {
                var win = createWindow(windowInfo.windowId, windowInfo);
                _registry.execute("window-event", windowInfo);
                // if the window has focus, trigger got focus event
                if (windowInfo.focus) {
                    focusChanged(win.Events, win.API, true);
                }
                return;
            }
            // otherwise check if the window is in our internal collections and update its state
            var windowObjectAndEvents = store_1.default.get(windowInfo.windowId);
            if (!windowObjectAndEvents) {
                _logger.error("received update for unknown window. Stream:', " + JSON.stringify(windowInfo, null, 4));
                return;
            }
            var theWindow = windowObjectAndEvents.API;
            var theWindowEvents = windowObjectAndEvents.Events;
            var oldFrameColor = theWindow.frameColor;
            // const property: string = "handle" + eventType;
            // // Try the generic handlers
            // if (theWindowEvents.hasOwnProperty(property)) {
            //     theWindowEvents[property](windowInfo);
            // }
            if (eventType === "Ready") {
                store_1.default.setReadyState(windowObjectAndEvents.API.id);
            }
            if (eventType === "TitleChanged") {
                theWindowEvents.handleTitleChanged(windowInfo.windowTitle);
            }
            if (eventType === "UrlChanged") {
                store_1.default.setUrlChangedState(windowObjectAndEvents.API.id);
                theWindowEvents.handleUrlChanged(windowInfo.url);
            }
            if (eventType === "WindowStyleChanged") {
                var parsedWsa = parseWindowStyleAttributes(windowInfo.windowStyleAttributes);
                theWindowEvents.handleWindowSettingsChanged(parsedWsa);
                theWindowEvents.handleVisibilityChanged(!parsedWsa.hidden);
            }
            if (eventType === "Normal" ||
                eventType === "Maximized" ||
                eventType === "Minimized" ||
                eventType === "Collapsed" ||
                eventType === "Expanded") {
                var state = eventType.toLowerCase();
                theWindowEvents.handleWindowChangeState(state);
            }
            if (eventType === "ContextUpdated") {
                theWindowEvents.handleContextUpdated(windowInfo.context);
            }
            if (eventType === "FrameButtonAdded") {
                theWindowEvents.handleFrameButtonAdded(windowInfo);
            }
            if (eventType === "FrameButtonRemoved") {
                theWindowEvents.handleFrameButtonRemoved(windowInfo);
            }
            if (eventType === "FrameButtonClicked") {
                theWindowEvents.handleFrameButtonClicked(windowInfo);
            }
            if (eventType === "FrameSelectionChanged") {
                theWindowEvents.handleFrameSelectionChanged(windowInfo.newWindow, windowInfo.prevWindow);
            }
            if (eventType === "FrameIsLockedChanged") {
                theWindowEvents.handleFrameIsLockedChanged(windowInfo.isLocked);
            }
            if (eventType === "TabHeaderVisibilityChanged") {
                theWindowEvents.handleTabHeaderVisibilityChanged(windowInfo.tabHeaderVisible);
            }
            if (eventType === "BoundsChanged") {
                var bounds = {
                    height: windowInfo.height,
                    left: windowInfo.left,
                    top: windowInfo.top,
                    width: windowInfo.width,
                };
                theWindowEvents.handleBoundsChanged(bounds);
            }
            if (eventType === "FocusChanged") {
                focusChanged(theWindowEvents, theWindow, windowInfo.focus);
            }
            if (eventType === "FrameColorChanged") {
                if (oldFrameColor !== windowInfo.frameColor) {
                    theWindowEvents.handleFrameColorChanged(windowInfo.frameColor);
                    _registry.execute("frame-color-changed", theWindow);
                }
            }
            if (eventType === "FrameAttached") {
                theWindowEvents.handleFrameAttached(windowInfo.tabGroupId, windowInfo.tabHeaderVisible);
            }
            if (eventType === "TabAttached") {
                theWindowEvents.handleAttached(windowInfo.tabGroupId, windowInfo.tabHeaderVisible);
                var winsToBeNotified_1 = getWindowsByTabGroupId(theWindow.id, windowInfo.tabGroupId);
                // Getting all windows, except current, with same tabGroupId
                Object.keys(winsToBeNotified_1).forEach(function (id) {
                    var win = winsToBeNotified_1[id];
                    // Executing event windowAttached to all windows
                    win.Events.handleWindowAttached(theWindow);
                });
                _registry.execute("tab-attached", theWindow, windowInfo.tabGroupId, windowInfo.tabHeaderVisible);
            }
            if (eventType === "TabDettached") {
                // In the event, tabGroupId is empty, will be update on the next event FrameAttached
                var oldTabGroupId = theWindow.tabGroupId;
                theWindowEvents.handleDetached(windowInfo.tabGroupId);
                var winsToBeNotified_2 = getWindowsByTabGroupId(theWindow.id, oldTabGroupId);
                Object.keys(winsToBeNotified_2).forEach(function (id) {
                    var win = winsToBeNotified_2[id];
                    win.Events.handleWindowDetached(theWindow);
                });
                _registry.execute("tab-detached", theWindow, windowInfo.tabGroupId, theWindow.tabGroupId);
            }
            if (eventType === "CompositionChanged") {
                theWindowEvents.handleCompositionChanged(windowInfo.neighbours, windowInfo.groupId);
                _registry.execute("composition-changed", windowInfo);
            }
            if (eventType === "GroupHeaderVisibilityChanged") {
                theWindowEvents.handleGroupHeaderVisibilityChanged(windowInfo.groupHeaderVisible);
                _registry.execute("group-header-changed", windowInfo);
            }
            // Clear the window on close event
            if (eventType === "Closed") {
                if (windowInfo.focus) {
                    // raise lost focus event
                    focusChanged(theWindowEvents, theWindow, false);
                }
                store_1.default.remove(windowObjectAndEvents);
                theWindowEvents.handleWindowClose();
            }
            // expose to external listeners
            _registry.execute("window-event", windowInfo);
        }
        function focusChanged(theWindowEvents, theWindow, focus) {
            theWindowEvents.handleFocusChanged(focus);
            if (focus) {
                _registry.execute("got-focus", theWindow);
            }
            else {
                _registry.execute("lost-focus", theWindow);
            }
        }
        function createWindow(windowId, args) {
            var windowObjAndEvents = window_1.default(windowId, mapToWindowConstructorOptions(args), executor_1.default, _logger, appManagerGetter);
            store_1.default.add(windowObjAndEvents);
            return windowObjAndEvents;
        }
        function open(name, url, options, success, error) {
            options = options || {};
            // relativeTo fix
            if (typeof options.relativeTo !== "undefined" && typeof options.relativeTo !== "string") {
                options.relativeTo = options.relativeTo.id || "";
            }
            options.windowName = name;
            options.url = url;
            agm.invoke("T42.Html.CreateWindow", options)
                .then(function (message) {
                if (message.returned !== undefined) {
                    var id = message.returned.id;
                    success(id);
                }
                else {
                    error("failed to execute T42.Html.CreateWindow - unknown reason");
                }
            }).catch(function (e) {
                if (typeof error === "function") {
                    error(e);
                }
            });
        }
        function tabAttached(callback) {
            return _registry.add("tab-attached", callback);
        }
        function tabDetached(callback) {
            return _registry.add("tab-detached", callback);
        }
        function onWindowFrameColorChanged(callback) {
            return _registry.add("frame-color-changed", callback);
        }
        function onWindowGotFocus(callback) {
            return _registry.add("got-focus", callback);
        }
        function onWindowLostFocus(callback) {
            return _registry.add("lost-focus", callback);
        }
        function onEvent(callback) {
            return _registry.add("window-event", callback);
        }
        function my() {
            return _windowId;
        }
        function onCompositionChanged(callback) {
            return _registry.add("composition-changed", callback);
        }
        function onGroupHeaderVisibilityChanged(callback) {
            return _registry.add("group-header-changed", callback);
        }
        function getWindowsByTabGroupId(windowId, tabGroupId) {
            var windows = store_1.default.list;
            return Object.keys(windows).reduce(function (memo, id) {
                var win = windows[id];
                if (win.API.tabGroupId === tabGroupId && win.API.id !== windowId) {
                    memo[id] = win;
                }
                return memo;
            }, {});
        }
        function mapToWindowConstructorOptions(args) {
            var _state = typeof args.WindowState !== "undefined" ? args.WindowState.toLowerCase() : "normal";
            var windowStyleAttributes = parseWindowStyleAttributes(args.windowStyleAttributes);
            return {
                name: args.windowName,
                url: args.url,
                title: args.windowTitle,
                context: args.context,
                bounds: {
                    height: args.height,
                    left: args.left,
                    top: args.top,
                    width: args.width,
                },
                focus: args.focus,
                frameColor: args.frameColor,
                groupId: args.groupId,
                isCollapsed: args.isCollapsed,
                isGroupHeaderVisible: args.isGroupHeaderVisible,
                isLocked: args.isLocked,
                isTabHeaderVisible: args.isTabHeaderVisible,
                isTabSelected: args.isTabSelected,
                isVisible: !windowStyleAttributes.hidden,
                isFocused: windowStyleAttributes.focus,
                mode: windowStyleAttributes.mode,
                settings: windowStyleAttributes,
                state: _state,
                tabGroupId: args.tabGroupId,
                neighbours: args.neighbours,
            };
        }
        function parseWindowStyleAttributes(windowStyles) {
            if (windowStyles === undefined) {
                return {};
            }
            if (typeof windowStyles !== "object") {
                return JSON.parse(windowStyles);
            }
            return windowStyles;
        }
        hcEnv = {
            my: my,
            onEvent: onEvent,
            open: open,
            tabAttached: tabAttached,
            tabDetached: tabDetached,
            onWindowFrameColorChanged: onWindowFrameColorChanged,
            executor: executor_1.default,
            onCompositionChanged: onCompositionChanged,
            onGroupHeaderVisibilityChanged: onGroupHeaderVisibilityChanged,
            onWindowGotFocus: onWindowGotFocus,
            onWindowLostFocus: onWindowLostFocus,
        };
    });
});
//# sourceMappingURL=hc.js.map

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CallbackFactory = __webpack_require__(1);
var store_1 = __webpack_require__(4);
exports.default = (function (id, executor) {
    var _registry = CallbackFactory();
    var _windowsId = [];
    var isGroupHeaderVisibleCalled;
    //#region "API functions"
    function addWindow(winId) {
        if (_windowsId.indexOf(winId) === -1) {
            _windowsId.push(winId);
            var window_1 = store_1.default.get(winId);
            window_1.Events.handleGroupAssociation(groupObject);
            _registry.execute("window-added", groupObject, window_1.API);
        }
    }
    function removeWindow(winId) {
        var index = _windowsId.indexOf(winId);
        if (index !== -1) {
            _windowsId.splice(index, 1);
            var window_2 = _mapToWindowObject(winId);
            _registry.execute("window-removed", groupObject, window_2);
        }
    }
    function find(window, success) {
        var winId;
        if (typeof window === "string") {
            winId = window;
        }
        else {
            winId = window.id;
        }
        var index = _windowsId.indexOf(winId);
        if (index !== -1) {
            var mappedWindow = _mapToWindowObject(_windowsId[index]);
            if (typeof success === "function") {
                success(mappedWindow);
            }
            return mappedWindow;
        }
    }
    function windows(success) {
        var mappedWindows = _mapToWindowObjects();
        if (typeof success === "function") {
            success(mappedWindows);
        }
        return mappedWindows;
    }
    function showHeader(success, error) {
        return new Promise(function (resolve, reject) {
            executor.setGroupHeaderVisible(_windowsId[0], true)
                .then(function (w) {
                if (typeof success === "function") {
                    success(groupObject);
                }
                resolve(groupObject);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    }
    function hideHeader(success, error) {
        return new Promise(function (resolve, reject) {
            executor.setGroupHeaderVisible(_windowsId[0], false)
                .then(function (w) {
                if (typeof success === "function") {
                    success(groupObject);
                }
                resolve(groupObject);
            })
                .catch(function (e) {
                return;
            });
        });
    }
    function execute(command, options, success, error) {
        return new Promise(function (resolve, reject) {
            executor.execute(command, options)
                .then(function (w) {
                if (typeof success === "function") {
                    success(groupObject);
                }
                resolve(groupObject);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    }
    //#endregion "API functions"
    //#region "Stream function"
    function handleGroupHeaderVisibilityChanged(windowInfo) {
        if (isGroupHeaderVisibleCalled !== windowInfo.groupHeaderVisible) {
            isGroupHeaderVisibleCalled = windowInfo.groupHeaderVisible;
            _registry.execute("header-visibility-changed", groupObject);
        }
    }
    //#endregion "Stream function"
    //#region "Internal function"
    function _mapToWindowObjects() {
        var winObjects = [];
        _windowsId.forEach(function (winId) {
            var windowObject = _mapToWindowObject(winId);
            if (typeof windowObject !== "undefined") {
                winObjects.push(windowObject);
            }
        });
        return winObjects;
    }
    function _mapToWindowObject(windowId) {
        return store_1.default.get(windowId) ? store_1.default.get(windowId).API : undefined;
    }
    function _getGroupHeaderVisibility() {
        // if one of the windows has a flag hideGroupHeader the group header should be off.
        var _isGroupHeaderVisible;
        var result = _mapToWindowObjects().filter(function (w) {
            return !w.isGroupHeaderVisible;
        });
        _isGroupHeaderVisible = result.length === 0;
        return _isGroupHeaderVisible;
    }
    //#endregion "Internal function"
    //#region "Events"
    function onHeaderVisibilityChanged(callback) {
        return _registry.add("header-visibility-changed", callback);
    }
    function onWindowAdded(callback) {
        return _registry.add("window-added", callback);
    }
    function onWindowRemoved(callback) {
        return _registry.add("window-removed", callback);
    }
    //#endregion "Events"
    //#region "API"
    var groupObject = {
        id: id,
        get windows() {
            return windows();
        },
        find: find,
        get isHeaderVisible() {
            return _getGroupHeaderVisibility();
        },
        showHeader: showHeader,
        hideHeader: hideHeader,
        maximize: function (success, error) {
            return execute("maximize", { groupId: id }, success, error);
        },
        restore: function (success, error) {
            return execute("restore", { groupId: id }, success, error);
        },
        onHeaderVisibilityChanged: onHeaderVisibilityChanged,
        onWindowAdded: onWindowAdded,
        onWindowRemoved: onWindowRemoved,
    };
    var internal = {
        addWindow: addWindow,
        removeWindow: removeWindow,
        handleGroupHeaderVisibilityChanged: handleGroupHeaderVisibilityChanged,
    };
    return {
        groupAPI: groupObject,
        groupInternal: internal,
    };
    //#endregion "API"
});
//# sourceMappingURL=group.js.map

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CallbackFactory = __webpack_require__(1);
var group_1 = __webpack_require__(75);
var store_1 = __webpack_require__(4);
exports.default = (function (environment, logger) {
    var _logger = logger.subLogger("groups");
    var _registry = CallbackFactory();
    var _groups = {};
    // Getting already existing windows and create Group API for each window
    var windows = store_1.default.list;
    Object.keys(windows).forEach(function (k) {
        addNewWindow(windows[k]);
    });
    environment.onCompositionChanged(function (windowInfo) {
        handleCompositionChanged(windowInfo);
    });
    environment.onGroupHeaderVisibilityChanged(function (windowInfo) {
        var windowId = windowInfo.windowId;
        var group = findGroupByWindow(windowId);
        if (typeof group !== "undefined") {
            var groupEvents = _groups[group.id];
            groupEvents.groupInternal.handleGroupHeaderVisibilityChanged(windowInfo);
        }
    });
    store_1.default.onAdded(function (win) {
        addNewWindow(win);
    });
    store_1.default.onRemoved(function (win) {
        removeWindow(win);
    });
    // Methods
    function my() {
        return findGroupByWindow(environment.my());
    }
    function list(success) {
        var result = Object.keys(_groups).map(function (groupId) {
            if (_groups[groupId]) {
                return _groups[groupId].groupAPI;
            }
        });
        if (typeof success === "function") {
            success(result);
        }
        return result;
    }
    function findGroupByWindow(winId, success) {
        var windowId;
        if (typeof winId === "undefined") {
            logger.debug("trying to find a group by a window, but winId is undefined");
            return;
        }
        if (typeof winId === "string") {
            windowId = winId;
        }
        else {
            windowId = winId.id;
        }
        var groupFound;
        Object.keys(_groups).forEach(function (groupId) {
            var group = _groups[groupId].groupAPI;
            if (group.find(windowId) !== undefined) {
                groupFound = group;
                return;
            }
        });
        if (typeof success === "function") {
            success(groupFound);
        }
        return groupFound;
    }
    // Events
    function onWindowMoved(callback) {
        return _registry.add("window-moved", callback);
    }
    // Private
    function createOrGetGroup(groupId) {
        if (!_groups.hasOwnProperty(groupId)) {
            var createdGroup = group_1.default(groupId, environment.executor);
            _groups[groupId] = createdGroup;
            return createdGroup;
        }
        else {
            return _groups[groupId];
        }
    }
    function deleteGroup(groupId) {
        if (_groups.hasOwnProperty(groupId) && typeof _groups[groupId] !== "undefined") {
            if (_groups[groupId].groupAPI.windows.length === 0) {
                delete _groups[groupId];
            }
        }
    }
    function addNewWindow(win) {
        _logger.trace("Adding new window " + win.API.id + " to win.API.groupId " + win.API.groupId);
        var group = addWindow(win);
        if (group) {
            _logger.trace("handleGroupAssociation " + win.API.id + " to group.groupAPI.id " + group.groupAPI.id);
            win.Events.handleGroupAssociation(group.groupAPI);
        }
    }
    function addWindow(win, groupId) {
        var windowGroupId = groupId || win.API.groupId;
        var windowId = win.API.id;
        if (typeof windowGroupId === "undefined" || typeof windowId === "undefined") {
            _logger.debug("trying to add a window without group - winId: " + windowId);
            return;
        }
        var group = createOrGetGroup(windowGroupId);
        group.groupInternal.addWindow(windowId);
        return group;
    }
    function removeWindow(win, groupId) {
        var windowId = win.API.id;
        var windowGroupId = groupId || win.API.groupId;
        if (typeof windowGroupId !== "undefined") {
            var group = _groups[windowGroupId];
            group.groupInternal.removeWindow(windowId);
            win.Events.handleGroupAssociation(undefined);
            deleteGroup(windowGroupId);
        }
    }
    function handleCompositionChanged(windowInfo) {
        var newGroupId = windowInfo.groupId;
        var windowId = windowInfo.windowId;
        var oldGroup = findGroupByWindow(windowId);
        var oldGroupId = oldGroup ? oldGroup.id : undefined;
        _logger.trace("handleCompositionChanged newGroupId: " + newGroupId + " windowId: " + windowId + " oldGroup: " + oldGroupId);
        if (oldGroupId === newGroupId) {
            _logger.trace("handleCompositionChanged newGroupId: " + newGroupId + " windowId: " + windowId + " oldGroup: " + oldGroupId + " are the same - returning...");
            return;
        }
        var win = store_1.default.get(windowId) || store_1.default.get(windowId);
        var newGroup = addWindow(win, newGroupId);
        win.Events.handleGroupChanged(newGroup.groupAPI, oldGroup);
        if (oldGroup) {
            removeWindow(win, oldGroupId);
            _registry.execute("window-moved", windowId, oldGroup, newGroupId);
        }
    }
    //#region "API"
    var groups = {
        get my() {
            return my();
        },
        list: list,
        findGroupByWindow: findGroupByWindow,
    };
    //#endregion "API
    var events = { onWindowMoved: onWindowMoved };
    return {
        groupsAPI: groups,
        groupsEvents: events,
    };
});
//# sourceMappingURL=groups.js.map

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CallbackFactory = __webpack_require__(1);
var detector_1 = __webpack_require__(70);
var groups_1 = __webpack_require__(76);
var store_1 = __webpack_require__(4);
exports.default = (function (agm, logger, appManagerGetter) {
    var _registry = CallbackFactory();
    var _logger = logger;
    var groups;
    var environment;
    store_1.default.init(_logger);
    var isReady = new Promise(function (resolve, reject) {
        detector_1.default(agm, _logger, appManagerGetter)
            .then(function (env) {
            environment = env;
            groups = groups_1.default(env, _logger);
            resolve();
        })
            .catch(function (e) {
            _logger.error("Environment detector fails with: " + e);
        });
    });
    function ready() {
        return isReady;
    }
    function my() {
        var myWindow = store_1.default.getIfReady(environment.my());
        return myWindow ? myWindow.API : undefined;
    }
    function open(name, url, options, success, error) {
        return new Promise(function (resolve, reject) {
            var errorHandler = function (errorResponse) {
                if (typeof error === "function") {
                    error(errorResponse);
                }
                reject(errorResponse);
            };
            var successHandler = function (id) {
                store_1.default.waitFor(id)
                    .then(function (win) {
                    if (typeof success === "function") {
                        success(win);
                    }
                    resolve(win);
                })
                    .catch(errorHandler);
            };
            environment.open(name, url, options, successHandler, errorHandler);
        });
    }
    function find(name, success, error) {
        var windows = store_1.default.list;
        var windowsForListing = Object.keys(windows).reduce(function (memo, winId) {
            var window = windows[winId];
            if (window && window.API.name === name) {
                memo.push(window.API);
            }
            return memo;
        }, []);
        if (typeof success !== "function") {
            return windowsForListing[0];
        }
        if (windowsForListing.length > 0) {
            success(windowsForListing[0]);
        }
        else {
            if (typeof error === "function") {
                error("There is no window with name:" + name);
            }
        }
    }
    function findById(id, success, error) {
        var windows = store_1.default.list;
        var windowsForListing = Object.keys(windows).reduce(function (memo, winId) {
            var window = windows[winId];
            if (typeof window !== "undefined" && window.API.id === id) {
                memo.push(window.API);
            }
            return memo;
        }, []);
        if (typeof success !== "function") {
            return windowsForListing[0];
        }
        if (windowsForListing.length > 0) {
            success(windowsForListing[0]);
        }
        else {
            if (typeof error === "function") {
                error("There is no window with such id:" + id);
            }
        }
    }
    function list(success) {
        var windows = store_1.default.list;
        var windowsForListing = Object.keys(windows)
            .map(function (k) {
            return windows[k].API;
        });
        if (typeof success !== "function") {
            return windowsForListing;
        }
        success(windowsForListing);
    }
    function windowAdded(callback) {
        return _registry.add("window-added", callback);
    }
    function windowRemoved(callback) {
        return _registry.add("window-removed", callback);
    }
    function tabAttached(callback) {
        return isReady.then(function () {
            environment.tabAttached(callback);
        });
    }
    function tabDetached(callback) {
        return isReady.then(function () {
            environment.tabDetached(callback);
        });
    }
    function onWindowFrameColorChanged(callback) {
        return isReady.then(function () {
            return environment.onWindowFrameColorChanged(callback);
        });
    }
    function onWindowGotFocus(callback) {
        var unsubscribe;
        isReady.then(function () {
            unsubscribe = environment.onWindowGotFocus(callback);
        });
        return function () {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }
    function onWindowLostFocus(callback) {
        var unsubscribe;
        isReady.then(function () {
            unsubscribe = environment.onWindowLostFocus(callback);
        });
        return function () {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }
    function onEvent(callback) {
        var unsubFunc;
        var unsubscribed = false;
        isReady.then(function () {
            if (unsubscribed) {
                return;
            }
            unsubFunc = environment.onEvent(callback);
        });
        return function () {
            unsubscribed = true;
            if (unsubFunc) {
                unsubFunc();
            }
        };
    }
    function handleWindowAdded(w) {
        _registry.execute("window-added", w.API);
    }
    function handleWindowRemoved(w) {
        _registry.execute("window-removed", w.API);
    }
    store_1.default.onReadyWindow(handleWindowAdded);
    store_1.default.onRemoved(handleWindowRemoved);
    // The API itself
    return {
        my: my,
        open: open,
        find: find,
        findById: findById,
        list: list,
        ready: ready,
        onWindowAdded: windowAdded,
        windowAdded: windowAdded,
        onWindowRemoved: windowRemoved,
        windowRemoved: windowRemoved,
        onTabAttached: tabAttached,
        onTabDetached: tabDetached,
        onWindowFrameColorChanged: onWindowFrameColorChanged,
        get groups() {
            return groups.groupsAPI;
        },
        onWindowGotFocus: onWindowGotFocus,
        onWindowLostFocus: onWindowLostFocus,
        onEvent: onEvent,
    };
});
//# sourceMappingURL=main.js.map

/***/ })
/******/ ]);
});
//# sourceMappingURL=tick42-glue.js.map