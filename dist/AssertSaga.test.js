"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var effects = __importStar(require("redux-saga/effects"));
var typesafe_actions_1 = require("typesafe-actions");
var AssertSaga_1 = require("./AssertSaga");
// tslint:disable:no-console
var consoleError = console.error;
beforeEach(function () {
    console.error = consoleError;
});
// tslint:disable-next-line:mocha-no-side-effect-code
var action = typesafe_actions_1.createAction('some/ACTION');
function watcherRespondingToLatest() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects.takeLatest(typesafe_actions_1.getType(action), handlerSagaStub)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function watcherRespondingToLatestWithExtraWork() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects.delay(42)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects.takeLatest(typesafe_actions_1.getType(action), handlerSagaStub)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function watcherRespondingToEvery() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects.takeEvery(typesafe_actions_1.getType(action), handlerSagaStub)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function watcherRespondingToEveryWithExtraWork() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects.delay(42)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects.takeEvery(typesafe_actions_1.getType(action), handlerSagaStub)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function watcherRespondingToLeading() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects.takeLeading(typesafe_actions_1.getType(action), handlerSagaStub)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function watcherRespondingToLeadingWithExtraWork() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects.delay(42)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects.takeLeading(typesafe_actions_1.getType(action), handlerSagaStub)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handlerSagaStub() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, undefined];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
describe(AssertSaga_1.SagaAssertImplementation.prototype.justRespondsToLatest, function () {
    it('passes when saga responds to latest specified action', function () {
        var assertionOperation = function () { return AssertSaga_1.assertSaga(watcherRespondingToLatest)
            .justRespondsToLatest({ action: action, withHandler: handlerSagaStub }); };
        expect(assertionOperation)
            .not
            .toThrow();
    });
    it('throws when saga does not respond to latest specified action', function () {
        var assertionOperation = function () { return AssertSaga_1.assertSaga(watcherRespondingToEvery)
            .justRespondsToLatest({ action: action, withHandler: handlerSagaStub }); };
        expect(assertionOperation)
            .toThrowError();
    });
    it('throws when saga responds to latest and also contains something else', function () {
        var assertionOperation = function () { return AssertSaga_1.assertSaga(watcherRespondingToLatestWithExtraWork)
            .justRespondsToLatest({ action: action, withHandler: handlerSagaStub }); };
        expect(assertionOperation)
            .toThrowError();
    });
});
describe(AssertSaga_1.SagaAssertImplementation.prototype.justRespondsToEvery, function () {
    it('passes when saga responds to every specified action', function () {
        var assertionOperation = function () { return AssertSaga_1.assertSaga(watcherRespondingToEvery)
            .justRespondsToEvery({ action: action, withHandler: handlerSagaStub }); };
        expect(assertionOperation)
            .not
            .toThrow();
    });
    it('throws when saga does not respond to every specified action', function () {
        var assertionOperation = function () { return AssertSaga_1.assertSaga(watcherRespondingToLatest)
            .justRespondsToEvery({ action: action, withHandler: handlerSagaStub }); };
        expect(assertionOperation)
            .toThrowError();
    });
    it('throws when saga responds to every and also contains something else', function () {
        var assertionOperation = function () { return AssertSaga_1.assertSaga(watcherRespondingToEveryWithExtraWork)
            .justRespondsToEvery({ action: action, withHandler: handlerSagaStub }); };
        expect(assertionOperation)
            .toThrowError();
    });
});
describe(AssertSaga_1.SagaAssertImplementation.prototype.justRespondsToLeading, function () {
    it('passes when saga responds to leading specified action', function () {
        var assertionOperation = function () { return AssertSaga_1.assertSaga(watcherRespondingToLeading)
            .justRespondsToLeading({ action: action, withHandler: handlerSagaStub }); };
        expect(assertionOperation)
            .not
            .toThrow();
    });
    it('throws when saga does not respond to leading specified action', function () {
        var assertionOperation = function () { return AssertSaga_1.assertSaga(watcherRespondingToLatest)
            .justRespondsToLeading({ action: action, withHandler: handlerSagaStub }); };
        expect(assertionOperation)
            .toThrowError();
    });
    it('throws when saga responds to leading and also contains something else', function () {
        var assertionOperation = function () { return AssertSaga_1.assertSaga(watcherRespondingToLeadingWithExtraWork)
            .justRespondsToLeading({ action: action, withHandler: handlerSagaStub }); };
        expect(assertionOperation)
            .toThrowError();
    });
});
describe(AssertSaga_1.SagaAssertImplementation.prototype.justSpawnsAsync, function () {
    it.each([
        [function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, effects.all([
                                effects.spawn(watcherRespondingToEvery),
                                effects.spawn(watcherRespondingToLatest),
                                effects.spawn(watcherRespondingToLeading),
                            ])];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }],
        [function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, effects.spawn(watcherRespondingToEvery)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, effects.spawn(watcherRespondingToLatest)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, effects.spawn(watcherRespondingToLeading)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }],
    ])('passes when saga spawns the specified sagas regardless of order and does nothing else', function (saga) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, AssertSaga_1.assertSaga(saga)
                    .justSpawnsAsync(watcherRespondingToLeading, watcherRespondingToLatest, watcherRespondingToEvery)];
        });
    }); });
    it('fails when saga forks instead of spawns', function () { return __awaiter(_this, void 0, void 0, function () {
        var saga, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.error = jest.fn();
                    saga = function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, effects.fork(watcherRespondingToLatest)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, AssertSaga_1.assertSaga(saga)
                            .justSpawnsAsync(watcherRespondingToLatest)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/];
                case 4: throw new Error();
            }
        });
    }); });
    it('fails when saga contains additional call effects', function () { return __awaiter(_this, void 0, void 0, function () {
        var saga, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.error = jest.fn();
                    saga = function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, effects.spawn(watcherRespondingToEvery)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, effects.call(function () { })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, AssertSaga_1.assertSaga(saga)
                            .justSpawnsAsync(watcherRespondingToEvery)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/];
                case 4: throw new Error();
            }
        });
    }); });
    it('fails when saga contains additional put effects', function () { return __awaiter(_this, void 0, void 0, function () {
        var saga, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.error = jest.fn();
                    saga = function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, effects.spawn(watcherRespondingToEvery)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, effects.put({
                                            type: 'action/ON_ANY_ACTION',
                                        })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, AssertSaga_1.assertSaga(saga)
                            .justSpawnsAsync(watcherRespondingToEvery)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/];
                case 4: throw new Error();
            }
        });
    }); });
    it('fails when saga contains additional spawn effects', function () { return __awaiter(_this, void 0, void 0, function () {
        var saga, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.error = jest.fn();
                    saga = function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, effects.spawn(watcherRespondingToEvery)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, effects.spawn(watcherRespondingToLatest)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, AssertSaga_1.assertSaga(saga)
                            .justSpawnsAsync(watcherRespondingToEvery)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/];
                case 4: throw new Error();
            }
        });
    }); });
    it('fails when saga contains insufficient spawn effects', function () { return __awaiter(_this, void 0, void 0, function () {
        var saga, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.error = jest.fn();
                    saga = function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, effects.spawn(watcherRespondingToEvery)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, AssertSaga_1.assertSaga(saga)
                            .justSpawnsAsync(watcherRespondingToEvery, watcherRespondingToLatest)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/];
                case 4: throw new Error();
            }
        });
    }); });
});
