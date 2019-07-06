import { SagaType } from 'redux-saga-test-plan';
import * as effects from 'redux-saga/effects';
import { createAction, getType } from 'typesafe-actions';
import { assertSaga } from './AssertSaga';

// tslint:disable:no-console mocha-no-side-effect-code

const consoleError = console.error;

beforeEach(() => {
    console.error = consoleError;
});

const relevantAction = createAction('some/ACTION');
const anotherRelevantAction = createAction('some/OTHER_ACTION');
const irrelevantAction = createAction('some/IRRELEVANT_ACTION');

function* handlerSagaStub() {
    yield undefined;
}

function* irrelevantHandlerSagaStub() {
    yield 42;
}

function* watcherRespondingToLatest() {
    yield effects.takeLatest(
        [getType(relevantAction), getType(anotherRelevantAction)],
        handlerSagaStub
    );
}

function* watcherRespondingToIrrelevantLatest() {
    yield effects.takeLatest(getType(irrelevantAction), handlerSagaStub);
}

function* watcherRespondingToLatestWithIncorrectHandler() {
    yield effects.takeLatest(
        getType(relevantAction),
        irrelevantHandlerSagaStub
    );
}

function* watcherRespondingToInsufficientLatest() {
    yield effects.takeLatest([getType(relevantAction)], handlerSagaStub);
}

function* watcherRespondingToLatestWithExtraWork() {
    yield effects.delay(42);
    yield effects.takeLatest(getType(relevantAction), handlerSagaStub);
}

function* correctWatcherRespondingToEvery() {
    yield effects.takeEvery(getType(relevantAction), handlerSagaStub);
}

function* watcherRespondingToLeading() {
    yield effects.takeLeading(getType(relevantAction), handlerSagaStub);
}

const getAssertionOperation = (saga: SagaType) => () =>
    assertSaga(saga).justRespondsToLatest({
        actions: [anotherRelevantAction, relevantAction],
        withHandler: handlerSagaStub,
    });

describe(assertSaga(handlerSagaStub).justRespondsToLatest, () => {
    it('passes when saga responds to latest specified actions regardless of order', () => {
        expect(
            getAssertionOperation(watcherRespondingToLatest)
        ).not.toThrow();
    });

    it('passes regardless of whether action argument is an array or a single action', () => {
        function* watcherRespondingToOneLatestWithNonArraySignature() {
            yield effects.takeLatest(getType(relevantAction), handlerSagaStub);
        }

        expect(() =>
            assertSaga(
                watcherRespondingToOneLatestWithNonArraySignature
            ).justRespondsToLatest({
                action: relevantAction,
                withHandler: handlerSagaStub,
            })
        ).not.toThrow();
    });

    it('throws when saga does not respond to latest specified action', () => {
        expect(
            getAssertionOperation(correctWatcherRespondingToEvery)
        ).toThrowError();
    });

    it('throws when saga responds to latest and also contains something else', () => {
        expect(
            getAssertionOperation(watcherRespondingToLatestWithExtraWork)
        ).toThrowError();
    });

    it('throws when saga responds to incorrect latest action', () => {
        expect(
            getAssertionOperation(watcherRespondingToIrrelevantLatest)
        ).toThrowError();
    });

    it('throws when saga responds to latest action with incorrect handler', () => {
        expect(
            getAssertionOperation(watcherRespondingToLatestWithIncorrectHandler)
        ).toThrowError();
    });

    it('throws when saga responds to insufficient actions', () => {
        expect(
            getAssertionOperation(watcherRespondingToInsufficientLatest)
        ).toThrowError();
    });
});

describe(assertSaga(handlerSagaStub).justSpawnsAsync, () => {
    it.each<[SagaType]>([
        [
            function*() {
                yield effects.all([
                    effects.spawn(correctWatcherRespondingToEvery),
                    effects.spawn(watcherRespondingToLatest),
                    effects.spawn(watcherRespondingToLeading),
                ]);
            },
        ],
        [
            function*() {
                yield effects.spawn(correctWatcherRespondingToEvery);
                yield effects.spawn(watcherRespondingToLatest);
                yield effects.spawn(watcherRespondingToLeading);
            },
        ],
    ])(
        'passes when saga spawns the specified sagas regardless of order and does nothing else',
        async saga => {
            return assertSaga(saga).justSpawnsAsync(
                watcherRespondingToLeading,
                watcherRespondingToLatest,
                correctWatcherRespondingToEvery
            );
        }
    );

    it('fails when saga forks instead of spawns', async () => {
        console.error = jest.fn();

        const saga = function*() {
            yield effects.fork(watcherRespondingToLatest);
        };

        try {
            await assertSaga(saga).justSpawnsAsync(
                watcherRespondingToLatest
            );
        } catch {
            return;
        }

        throw new Error();
    });

    it('fails when saga contains additional call effects', async () => {
        console.error = jest.fn();

        const saga = function*() {
            yield effects.spawn(correctWatcherRespondingToEvery);
            yield effects.call(() => {
                /* do nothing */
            });
        };

        try {
            await assertSaga(saga).justSpawnsAsync(
                correctWatcherRespondingToEvery
            );
        } catch {
            return;
        }

        throw new Error();
    });

    it('fails when saga contains additional put effects', async () => {
        console.error = jest.fn();

        const saga = function*() {
            yield effects.spawn(correctWatcherRespondingToEvery);
            yield effects.put({
                type: 'action/ON_ANY_ACTION',
            });
        };

        try {
            await assertSaga(saga).justSpawnsAsync(
                correctWatcherRespondingToEvery
            );
        } catch {
            return;
        }

        throw new Error();
    });

    it('fails when saga contains additional spawn effects', async () => {
        console.error = jest.fn();

        const saga = function*() {
            yield effects.spawn(correctWatcherRespondingToEvery);
            yield effects.spawn(watcherRespondingToLatest);
        };

        try {
            await assertSaga(saga).justSpawnsAsync(
                correctWatcherRespondingToEvery
            );
        } catch {
            return;
        }

        throw new Error();
    });

    it('fails when saga contains insufficient spawn effects', async () => {
        console.error = jest.fn();

        const saga = function*() {
            yield effects.spawn(correctWatcherRespondingToEvery);
        };

        try {
            await assertSaga(saga).justSpawnsAsync(
                correctWatcherRespondingToEvery,
                watcherRespondingToLatest
            );
        } catch {
            return;
        }

        throw new Error();
    });
});
