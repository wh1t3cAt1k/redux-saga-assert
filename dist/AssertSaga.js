"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const redux_saga_test_plan_1 = require("redux-saga-test-plan");
const matchers = __importStar(require("redux-saga-test-plan/matchers"));
const providers = __importStar(require("redux-saga-test-plan/providers"));
const effects = __importStar(require("redux-saga/effects"));
const typesafe_actions_1 = require("typesafe-actions");
const isSingleActionAssertion = (args) => args.action !== undefined;
class SagaAssertImplementation {
    constructor(saga) {
        /**
         * Ensures that the tested saga only responds to the leading specified action
         * with the specified handler saga and does absolutely nothing else.
         * Requires enhanced action creator from typesafe-actions.
         */
        this.justRespondsToLeading = (args) => this.justRespondsTo(args, effects.takeLeading);
        /**
         * Ensures that the tested saga only responds to the latest specified action
         * with the specified handler saga and does absolutely nothing else.
         * Requires enhanced action creator from typesafe-actions.
         */
        this.justRespondsToLatest = (args) => this.justRespondsTo(args, effects.takeLatest);
        /**
         * Ensures that the tested saga only responds to every specified action
         * with the specified handler saga and does absolutely nothing else.
         * Requires enhanced action creator from typesafe-actions.
         */
        this.justRespondsToEvery = (args) => this.justRespondsTo(args, effects.takeEvery);
        /**
         * Ensures that the tested saga only spawns (not forks) the specified
         * sagas and does absolutely nothing else.
         */
        this.justSpawnsAsync = (...sagasToSpawn) => __awaiter(this, void 0, void 0, function* () {
            const providedValues = sagasToSpawn
                .map(sagaType => [matchers.spawn.fn(sagaType), undefined])
                .concat([
                [
                    matchers.spawn.like({}),
                    providers.dynamic(effect => {
                        throw new Error(`Unexpected function spawned: ${effect.fn.name}`);
                    }),
                ],
                [
                    matchers.fork.like({}),
                    providers.dynamic(effect => {
                        throw new Error(`Unexpected function forked: ${effect.fn.name}`);
                    }),
                ],
                [
                    matchers.put.like({}),
                    providers.dynamic(effect => {
                        throw new Error(`Unexpected action put: ${effect.action.type}`);
                    }),
                ],
                [
                    matchers.call.like({}),
                    providers.dynamic(effect => {
                        throw new Error(`Unexpected function called: ${effect.fn.name}`);
                    }),
                ],
            ]);
            let expectApiBuilder = redux_saga_test_plan_1.expectSaga(this.saga)
                // tslint:disable-next-line: no-any
                .provide(providedValues);
            sagasToSpawn.forEach(sagaType => {
                expectApiBuilder = expectApiBuilder.spawn(sagaType);
            });
            return expectApiBuilder.run();
        });
        this.justRespondsTo = (args, createEffect) => {
            const actions = isSingleActionAssertion(args)
                ? [args.action]
                : args.actions;
            const actionTypes = actions
                .map(action => typesafe_actions_1.getType(action))
                .sort();
            const sagaArgs = args.handlerArgs === undefined ? [] : args.handlerArgs;
            const saga = this.saga(...sagaArgs);
            const nextSagaValue = saga.next().value;
            if (nextSagaValue === undefined ||
                nextSagaValue.payload === undefined ||
                nextSagaValue.payload.args === undefined) {
                throw Error('Expected the first generator value to be a redux-saga effect.');
            }
            const actionTypesArgument = nextSagaValue.payload.args[0];
            if (typeof actionTypesArgument === 'string') {
                // This is a single action type value. Normalize.
                // -
                nextSagaValue.payload.args[0] = [actionTypesArgument];
            }
            if (Array.isArray(actionTypesArgument)) {
                // To be order-agnostic, we sort the actual action types.
                // -
                actionTypesArgument.sort();
            }
            expect(nextSagaValue).toEqual(createEffect(actionTypes, args.withHandler, ...sagaArgs));
            expect(saga.next().done).toBe(true);
        };
        this.saga = saga;
    }
}
exports.SagaAssertImplementation = SagaAssertImplementation;
exports.assertSaga = (saga) => new SagaAssertImplementation(saga);
