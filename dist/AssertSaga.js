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
Object.defineProperty(exports, "__esModule", { value: true });
var redux_saga_test_plan_1 = require("redux-saga-test-plan");
var matchers = __importStar(require("redux-saga-test-plan/matchers"));
var providers = __importStar(require("redux-saga-test-plan/providers"));
var effects = __importStar(require("redux-saga/effects"));
var typesafe_actions_1 = require("typesafe-actions");
var SagaAssertImplementation = /** @class */ (function () {
    function SagaAssertImplementation(saga) {
        var _this = this;
        /**
         * Ensures that the tested saga only responds to the leading specified action
         * with the specified handler saga and does absolutely nothing else.
         * Requires enhanced action creator from typesafe-actions.
         */
        this.justRespondsToLeading = function (args) {
            var saga = _this.saga();
            expect(saga.next().value)
                .toEqual(effects.takeLeading(typesafe_actions_1.getType(args.action), args.withHandler));
            expect(saga.next().done)
                .toBe(true);
        };
        /**
         * Ensures that the tested saga only responds to the latest specified action
         * with the specified handler saga and does absolutely nothing else.
         * Requires enhanced action creator from typesafe-actions.
         */
        this.justRespondsToLatest = function (args) { return redux_saga_test_plan_1.testSaga(_this.saga)
            .next()
            .takeLatest(typesafe_actions_1.getType(args.action), args.withHandler)
            .next()
            .isDone(); };
        /**
         * Ensures that the tested saga only responds to every specified action
         * with the specified handler saga and does absolutely nothing else.
         * Requires enhanced action creator from typesafe-actions.
         */
        this.justRespondsToEvery = function (args) { return redux_saga_test_plan_1.testSaga(_this.saga)
            .next()
            .takeEvery(typesafe_actions_1.getType(args.action), args.withHandler)
            .next()
            .isDone(); };
        /**
         * Ensures that the tested saga only spawns (not forks) the specified
         * sagas and does absolutely nothing else.
         */
        this.justSpawnsAsync = function () {
            var sagasToSpawn = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                sagasToSpawn[_i] = arguments[_i];
            }
            return __awaiter(_this, void 0, void 0, function () {
                var providedValues, expectApiBuilder;
                return __generator(this, function (_a) {
                    providedValues = sagasToSpawn
                        .map(function (sagaType) { return [matchers.spawn.fn(sagaType), undefined]; })
                        .concat([
                        [
                            matchers.spawn.like({}),
                            providers.dynamic(function (effect) {
                                throw new Error("Unexpected function spawned: " + effect.fn.name);
                            }),
                        ],
                        [
                            matchers.fork.like({}),
                            providers.dynamic(function (effect) {
                                throw new Error("Unexpected function forked: " + effect.fn.name);
                            }),
                        ],
                        [
                            matchers.put.like({}),
                            providers.dynamic(function (effect) {
                                throw new Error("Unexpected action put: " + effect.action.type);
                            }),
                        ],
                        [
                            matchers.call.like({}),
                            providers.dynamic(function (effect) {
                                throw new Error("Unexpected function called: " + effect.fn.name);
                            }),
                        ],
                    ]);
                    expectApiBuilder = redux_saga_test_plan_1.expectSaga(this.saga)
                        // tslint:disable-next-line: no-any
                        .provide(providedValues);
                    sagasToSpawn.forEach(function (sagaType) {
                        expectApiBuilder = expectApiBuilder.spawn(sagaType);
                    });
                    return [2 /*return*/, expectApiBuilder.run()];
                });
            });
        };
        this.saga = saga;
    }
    return SagaAssertImplementation;
}());
exports.SagaAssertImplementation = SagaAssertImplementation;
exports.assertSaga = function (saga) { return new SagaAssertImplementation(saga); };
