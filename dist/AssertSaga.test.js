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
const effects = __importStar(require("redux-saga/effects"));
const typesafe_actions_1 = require("typesafe-actions");
const AssertSaga_1 = require("./AssertSaga");
// tslint:disable:no-console mocha-no-side-effect-code
const consoleError = console.error;
beforeEach(() => {
    console.error = consoleError;
});
const relevantAction = typesafe_actions_1.createAction('some/ACTION');
const anotherRelevantAction = typesafe_actions_1.createAction('some/OTHER_ACTION');
const irrelevantAction = typesafe_actions_1.createAction('some/IRRELEVANT_ACTION');
const handlerSagaArgument = '42';
function* handlerSagaStub() {
    yield undefined;
}
function* handlerSagaWithArgumentsStub(_arg) {
    yield undefined;
}
function* irrelevantHandlerSagaStub() {
    yield 42;
}
function* watcherRespondingToLatestWithArguments() {
    yield effects.takeLatest([typesafe_actions_1.getType(relevantAction), typesafe_actions_1.getType(anotherRelevantAction)], handlerSagaWithArgumentsStub, handlerSagaArgument);
}
function* watcherRespondingToLatest() {
    yield effects.takeLatest([typesafe_actions_1.getType(relevantAction), typesafe_actions_1.getType(anotherRelevantAction)], handlerSagaStub);
}
function* watcherRespondingToIrrelevantLatest() {
    yield effects.takeLatest(typesafe_actions_1.getType(irrelevantAction), handlerSagaStub);
}
function* watcherRespondingToLatestWithIncorrectHandler() {
    yield effects.takeLatest(typesafe_actions_1.getType(relevantAction), irrelevantHandlerSagaStub);
}
function* watcherRespondingToInsufficientLatest() {
    yield effects.takeLatest([typesafe_actions_1.getType(relevantAction)], handlerSagaStub);
}
function* watcherRespondingToLatestWithExtraWork() {
    yield effects.delay(42);
    yield effects.takeLatest(typesafe_actions_1.getType(relevantAction), handlerSagaStub);
}
function* correctWatcherRespondingToEvery() {
    yield effects.takeEvery(typesafe_actions_1.getType(relevantAction), handlerSagaStub);
}
function* watcherRespondingToLeading() {
    yield effects.takeLeading(typesafe_actions_1.getType(relevantAction), handlerSagaStub);
}
const getAssertionOperationWithHandlerArguments = (saga, ...sagaArgs) => () => AssertSaga_1.assertSaga(saga).justRespondsToLatest({
    actions: [anotherRelevantAction, relevantAction],
    withHandler: handlerSagaWithArgumentsStub,
    handlerArgs: sagaArgs,
});
const getAssertionOperation = (saga) => () => AssertSaga_1.assertSaga(saga).justRespondsToLatest({
    actions: [anotherRelevantAction, relevantAction],
    withHandler: handlerSagaStub,
});
describe(AssertSaga_1.assertSaga(handlerSagaStub).justRespondsToLatest, () => {
    it('passes when saga responds to latest specified actions regardless of order', () => {
        expect(getAssertionOperation(watcherRespondingToLatest)).not.toThrow();
    });
    it('passes regardless of whether action argument is an array or a single action', () => {
        function* watcherRespondingToOneLatestWithNonArraySignature() {
            yield effects.takeLatest(typesafe_actions_1.getType(relevantAction), handlerSagaStub);
        }
        expect(() => AssertSaga_1.assertSaga(watcherRespondingToOneLatestWithNonArraySignature).justRespondsToLatest({
            action: relevantAction,
            withHandler: handlerSagaStub,
        })).not.toThrow();
    });
    it('throws when saga does not respond to latest specified action', () => {
        expect(getAssertionOperation(correctWatcherRespondingToEvery)).toThrowError();
    });
    it('throws when saga responds to latest and also contains something else', () => {
        expect(getAssertionOperation(watcherRespondingToLatestWithExtraWork)).toThrowError();
    });
    it('throws when saga responds to incorrect latest action', () => {
        expect(getAssertionOperation(watcherRespondingToIrrelevantLatest)).toThrowError();
    });
    it('throws when saga responds to latest action with incorrect handler', () => {
        expect(getAssertionOperation(watcherRespondingToLatestWithIncorrectHandler)).toThrowError();
    });
    it('throws when saga responds to insufficient actions', () => {
        expect(getAssertionOperation(watcherRespondingToInsufficientLatest)).toThrowError();
    });
});
describe(AssertSaga_1.assertSaga(handlerSagaWithArgumentsStub).justRespondsToLatest, () => {
    it('passes when saga responds to latest specified actions regardless of order and passes arguments to the handler', () => {
        expect(getAssertionOperationWithHandlerArguments(watcherRespondingToLatestWithArguments, handlerSagaArgument)).not.toThrow();
    });
    it('passes regardless of whether action argument is an array or a single action and passes arguments to the handler', () => {
        function* watcherRespondingToOneLatestWithNonArraySignature() {
            yield effects.takeLatest(typesafe_actions_1.getType(relevantAction), handlerSagaWithArgumentsStub, handlerSagaArgument);
        }
        expect(() => AssertSaga_1.assertSaga(watcherRespondingToOneLatestWithNonArraySignature).justRespondsToLatest({
            action: relevantAction,
            withHandler: handlerSagaWithArgumentsStub,
            handlerArgs: [handlerSagaArgument],
        })).not.toThrow();
    });
});
describe(AssertSaga_1.assertSaga(handlerSagaStub).justSpawnsAsync, () => {
    it.each([
        [
            function* () {
                yield effects.all([
                    effects.spawn(correctWatcherRespondingToEvery),
                    effects.spawn(watcherRespondingToLatest),
                    effects.spawn(watcherRespondingToLatestWithArguments),
                    effects.spawn(watcherRespondingToLeading),
                ]);
            },
        ],
        [
            function* () {
                yield effects.spawn(correctWatcherRespondingToEvery);
                yield effects.spawn(watcherRespondingToLatest);
                yield effects.spawn(watcherRespondingToLatestWithArguments);
                yield effects.spawn(watcherRespondingToLeading);
            },
        ],
    ])('passes when saga spawns the specified sagas regardless of order and does nothing else', (saga) => __awaiter(this, void 0, void 0, function* () {
        return AssertSaga_1.assertSaga(saga).justSpawnsAsync(watcherRespondingToLeading, watcherRespondingToLatest, watcherRespondingToLatestWithArguments, correctWatcherRespondingToEvery);
    }));
    it('fails when saga forks instead of spawns', () => __awaiter(this, void 0, void 0, function* () {
        console.error = jest.fn();
        const saga = function* () {
            yield effects.fork(watcherRespondingToLatest);
        };
        try {
            yield AssertSaga_1.assertSaga(saga).justSpawnsAsync(watcherRespondingToLatest);
        }
        catch (_a) {
            return;
        }
        throw new Error();
    }));
    it('fails when saga contains additional call effects', () => __awaiter(this, void 0, void 0, function* () {
        console.error = jest.fn();
        const saga = function* () {
            yield effects.spawn(correctWatcherRespondingToEvery);
            yield effects.call(() => {
                /* do nothing */
            });
        };
        try {
            yield AssertSaga_1.assertSaga(saga).justSpawnsAsync(correctWatcherRespondingToEvery);
        }
        catch (_b) {
            return;
        }
        throw new Error();
    }));
    it('fails when saga contains additional put effects', () => __awaiter(this, void 0, void 0, function* () {
        console.error = jest.fn();
        const saga = function* () {
            yield effects.spawn(correctWatcherRespondingToEvery);
            yield effects.put({
                type: 'action/ON_ANY_ACTION',
            });
        };
        try {
            yield AssertSaga_1.assertSaga(saga).justSpawnsAsync(correctWatcherRespondingToEvery);
        }
        catch (_c) {
            return;
        }
        throw new Error();
    }));
    it('fails when saga contains additional spawn effects', () => __awaiter(this, void 0, void 0, function* () {
        console.error = jest.fn();
        const saga = function* () {
            yield effects.spawn(correctWatcherRespondingToEvery);
            yield effects.spawn(watcherRespondingToLatest);
        };
        try {
            yield AssertSaga_1.assertSaga(saga).justSpawnsAsync(correctWatcherRespondingToEvery);
        }
        catch (_d) {
            return;
        }
        throw new Error();
    }));
    it('fails when saga contains insufficient spawn effects', () => __awaiter(this, void 0, void 0, function* () {
        console.error = jest.fn();
        const saga = function* () {
            yield effects.spawn(correctWatcherRespondingToEvery);
        };
        try {
            yield AssertSaga_1.assertSaga(saga).justSpawnsAsync(correctWatcherRespondingToEvery, watcherRespondingToLatest);
        }
        catch (_e) {
            return;
        }
        throw new Error();
    }));
});
