import { ActionCreator, AnyAction } from 'redux';
import { SagaType } from 'redux-saga-test-plan';
export declare class SagaAssertImplementation {
    private readonly saga;
    constructor(saga: SagaType);
    /**
     * Ensures that the tested saga only responds to the leading specified action
     * with the specified handler saga and does absolutely nothing else.
     * Requires enhanced action creator from typesafe-actions.
     */
    justRespondsToLeading: (args: {
        action: ActionCreator<AnyAction>;
        withHandler: SagaType;
    }) => void;
    /**
     * Ensures that the tested saga only responds to the latest specified action
     * with the specified handler saga and does absolutely nothing else.
     * Requires enhanced action creator from typesafe-actions.
     */
    justRespondsToLatest: (args: {
        action: ActionCreator<AnyAction>;
        withHandler: SagaType;
    }) => import("redux-saga-test-plan").TestApi;
    /**
     * Ensures that the tested saga only responds to every specified action
     * with the specified handler saga and does absolutely nothing else.
     * Requires enhanced action creator from typesafe-actions.
     */
    justRespondsToEvery: (args: {
        action: ActionCreator<AnyAction>;
        withHandler: SagaType;
    }) => import("redux-saga-test-plan").TestApi;
    /**
     * Ensures that the tested saga only spawns (not forks) the specified
     * sagas and does absolutely nothing else.
     */
    justSpawnsAsync: (...sagasToSpawn: SagaType[]) => Promise<import("redux-saga-test-plan").RunResult>;
}
export declare const assertSaga: (saga: SagaType) => SagaAssertImplementation;
