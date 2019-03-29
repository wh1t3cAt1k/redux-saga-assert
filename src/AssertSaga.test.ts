import { SagaType } from 'redux-saga-test-plan';
import * as effects from 'redux-saga/effects';
import { createAction, getType } from 'typesafe-actions';
import { assertSaga, SagaAssertImplementation } from './AssertSaga';

// tslint:disable:no-console

const consoleError = console.error;

beforeEach(() => {
    console.error = consoleError;
});

// tslint:disable-next-line:mocha-no-side-effect-code
const action = createAction('some/ACTION');

function* watcherRespondingToLatest() {
    yield effects.takeLatest(
        getType(action),
        handlerSagaStub
    );
}

function* watcherRespondingToLatestWithExtraWork() {
    yield effects.delay(42);
    yield effects.takeLatest(
        getType(action),
        handlerSagaStub
    );
}

function* watcherRespondingToEvery() {
    yield effects.takeEvery(
        getType(action),
        handlerSagaStub
    );
}

function* watcherRespondingToEveryWithExtraWork() {
    yield effects.delay(42);
    yield effects.takeEvery(
        getType(action),
        handlerSagaStub
    );
}

function* watcherRespondingToLeading() {
    yield effects.takeLeading(
        getType(action),
        handlerSagaStub
    );
}

function* watcherRespondingToLeadingWithExtraWork() {
    yield effects.delay(42);
    yield effects.takeLeading(
        getType(action),
        handlerSagaStub
    );
}

function* handlerSagaStub() {
    yield undefined;
}

describe(SagaAssertImplementation.prototype.justRespondsToLatest, () => {
    it('passes when saga responds to latest specified action', () => {
        const assertionOperation = () => assertSaga(watcherRespondingToLatest)
            .justRespondsToLatest({ action, withHandler: handlerSagaStub });

        expect(assertionOperation)
            .not
            .toThrow();
    });

    it('throws when saga does not respond to latest specified action', () => {
        const assertionOperation = () => assertSaga(watcherRespondingToEvery)
            .justRespondsToLatest({ action, withHandler: handlerSagaStub });

        expect(assertionOperation)
            .toThrowError();
    });

    it('throws when saga responds to latest and also contains something else', () => {
        const assertionOperation = () => assertSaga(watcherRespondingToLatestWithExtraWork)
            .justRespondsToLatest({ action, withHandler: handlerSagaStub });

        expect(assertionOperation)
            .toThrowError();
    });
});

describe(SagaAssertImplementation.prototype.justRespondsToEvery, () => {
    it('passes when saga responds to every specified action', () => {
        const assertionOperation = () => assertSaga(watcherRespondingToEvery)
            .justRespondsToEvery({ action, withHandler: handlerSagaStub });

        expect(assertionOperation)
            .not
            .toThrow();
    });

    it('throws when saga does not respond to every specified action', () => {
        const assertionOperation = () => assertSaga(watcherRespondingToLatest)
            .justRespondsToEvery({ action, withHandler: handlerSagaStub });

        expect(assertionOperation)
            .toThrowError();
    });

    it('throws when saga responds to every and also contains something else', () => {
        const assertionOperation = () => assertSaga(watcherRespondingToEveryWithExtraWork)
            .justRespondsToEvery({ action, withHandler: handlerSagaStub });

        expect(assertionOperation)
            .toThrowError();
    });
});

describe(SagaAssertImplementation.prototype.justRespondsToLeading, () => {
    it('passes when saga responds to leading specified action', () => {
        const assertionOperation = () => assertSaga(watcherRespondingToLeading)
            .justRespondsToLeading({ action, withHandler: handlerSagaStub });

        expect(assertionOperation)
            .not
            .toThrow();
    });

    it('throws when saga does not respond to leading specified action', () => {
        const assertionOperation = () => assertSaga(watcherRespondingToLatest)
            .justRespondsToLeading({ action, withHandler: handlerSagaStub });

        expect(assertionOperation)
            .toThrowError();
    });

    it('throws when saga responds to leading and also contains something else', () => {
        const assertionOperation = () => assertSaga(watcherRespondingToLeadingWithExtraWork)
            .justRespondsToLeading({ action, withHandler: handlerSagaStub });

        expect(assertionOperation)
            .toThrowError();
    });
});

describe(SagaAssertImplementation.prototype.justSpawnsAsync, () => {
    it.each<[SagaType]>([
        [function* () {
            yield effects.all([
                effects.spawn(watcherRespondingToEvery),
                effects.spawn(watcherRespondingToLatest),
                effects.spawn(watcherRespondingToLeading),
            ]);
        }],
        [function* () {
            yield effects.spawn(watcherRespondingToEvery);
            yield effects.spawn(watcherRespondingToLatest);
            yield effects.spawn(watcherRespondingToLeading);
        }],
    ])(
        'passes when saga spawns the specified sagas regardless of order and does nothing else',
        async saga => {
            return assertSaga(saga)
                .justSpawnsAsync(
                    watcherRespondingToLeading,
                    watcherRespondingToLatest,
                    watcherRespondingToEvery
                );
        }
    );

    it('fails when saga forks instead of spawns', async () => {
        console.error = jest.fn();

        const saga = function* () {
            yield effects.fork(watcherRespondingToLatest);
        };

        try {
            await assertSaga(saga)
                .justSpawnsAsync(watcherRespondingToLatest);
        } catch {
            return;
        }

        throw new Error();
    });

    it('fails when saga contains additional call effects', async () => {
        console.error = jest.fn();

        const saga = function* () {
            yield effects.spawn(watcherRespondingToEvery);
            yield effects.call(() => { /* do nothing */ });
        };

        try {
            await assertSaga(saga)
                .justSpawnsAsync(watcherRespondingToEvery);
        } catch {
            return;
        }

        throw new Error();
    });

    it('fails when saga contains additional put effects', async () => {
        console.error = jest.fn();

        const saga = function* () {
            yield effects.spawn(watcherRespondingToEvery);
            yield effects.put({
                type: 'action/ON_ANY_ACTION',
            });
        };

        try {
            await assertSaga(saga)
                .justSpawnsAsync(watcherRespondingToEvery);
        } catch {
            return;
        }

        throw new Error();
    });

    it('fails when saga contains additional spawn effects', async () => {
        console.error = jest.fn();

        const saga = function* () {
            yield effects.spawn(watcherRespondingToEvery);
            yield effects.spawn(watcherRespondingToLatest);
        };

        try {
            await assertSaga(saga)
                .justSpawnsAsync(watcherRespondingToEvery);
        } catch {
            return;
        }

        throw new Error();
    });

    it('fails when saga contains insufficient spawn effects', async () => {
        console.error = jest.fn();

        const saga = function* () {
            yield effects.spawn(watcherRespondingToEvery);
        };

        try {
            await assertSaga(saga)
                .justSpawnsAsync(
                    watcherRespondingToEvery,
                    watcherRespondingToLatest
                );
        } catch {
            return;
        }

        throw new Error();
    });
});
