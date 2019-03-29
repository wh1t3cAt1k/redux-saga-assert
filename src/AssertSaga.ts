import _ from 'lodash';
import { ActionCreator, AnyAction } from 'redux';
import { expectSaga, SagaType, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as providers from 'redux-saga-test-plan/providers';
import * as effects from 'redux-saga/effects';
import { getType } from 'typesafe-actions';

export class SagaAssertImplementation {
    private readonly saga: SagaType;

    public constructor(saga: SagaType) {
        this.saga = saga;
    }

    /**
     * Ensures that the tested saga only responds to the leading specified action
     * with the specified handler saga and does absolutely nothing else.
     * Requires enhanced action creator from typesafe-actions.
     */
    public justRespondsToLeading = (args: {
        action: ActionCreator<AnyAction>;
        withHandler: SagaType;
    }) => {
        const saga = this.saga();

        expect(saga.next().value)
            .toEqual(effects.takeLeading(
                getType(args.action),
                args.withHandler
            ));

        expect(saga.next().done)
            .toBe(true);
    }

    /**
     * Ensures that the tested saga only responds to the latest specified action
     * with the specified handler saga and does absolutely nothing else.
     * Requires enhanced action creator from typesafe-actions.
     */
    public justRespondsToLatest = (args: {
        action: ActionCreator<AnyAction>;
        withHandler: SagaType;
    }) => testSaga(this.saga)
        .next()
        .takeLatest(
            getType(args.action),
            args.withHandler
        )
        .next()
        .isDone()

    /**
     * Ensures that the tested saga only responds to every specified action
     * with the specified handler saga and does absolutely nothing else.
     * Requires enhanced action creator from typesafe-actions.
     */
    public justRespondsToEvery = (args: {
        action: ActionCreator<AnyAction>;
        withHandler: SagaType;
    }) => testSaga(this.saga)
        .next()
        .takeEvery(
            getType(args.action),
            args.withHandler
        )
        .next()
        .isDone()

    /**
     * Ensures that the tested saga only spawns (not forks) the specified
     * sagas and does absolutely nothing else.
     */
    public justSpawnsAsync = async (...sagasToSpawn: SagaType[]) => {
        const providedValues = sagasToSpawn
            .map(sagaType => [matchers.spawn.fn(sagaType), undefined])
            .concat([
                [
                    matchers.spawn.like({}),
                    providers.dynamic<effects.ForkEffectDescriptor>(effect => {
                        throw new Error(`Unexpected function spawned: ${effect.fn.name}`);
                    }),
                ],
                [
                    matchers.fork.like({}),
                    providers.dynamic<effects.ForkEffectDescriptor>(effect => {
                        throw new Error(`Unexpected function forked: ${effect.fn.name}`);
                    }),
                ],
                [
                    matchers.put.like({}),
                    providers.dynamic<effects.PutEffectDescriptor<AnyAction>>(effect => {
                        throw new Error(`Unexpected action put: ${effect.action.type}`);
                    }),
                ],
                [
                    matchers.call.like({}),
                    providers.dynamic<effects.CallEffectDescriptor>(effect => {
                        throw new Error(`Unexpected function called: ${effect.fn.name}`);
                    }),
                ],
            ]);

        let expectApiBuilder = expectSaga(this.saga)
            // tslint:disable-next-line: no-any
            .provide(<any> providedValues);

        sagasToSpawn.forEach(sagaType => {
            expectApiBuilder = expectApiBuilder.spawn(sagaType);
        });

        return expectApiBuilder.run();
    }
}

export const assertSaga = (saga: SagaType) => new SagaAssertImplementation(saga);
