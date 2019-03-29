import { ActionCreator, AnyAction } from 'redux';
import { SagaType } from 'redux-saga-test-plan';
export declare class SagaAssertImplementation {
    private readonly saga;
    constructor(saga: SagaType);
    justRespondsToLeading: (args: {
        action: ActionCreator<AnyAction>;
        withHandler: SagaType;
    }) => void;
    justRespondsToLatest: (args: {
        action: ActionCreator<AnyAction>;
        withHandler: SagaType;
    }) => import("redux-saga-test-plan").TestApi;
    justRespondsToEvery: (args: {
        action: ActionCreator<AnyAction>;
        withHandler: SagaType;
    }) => import("redux-saga-test-plan").TestApi;
    justSpawnsAsync: (...sagasToSpawn: SagaType[]) => Promise<import("redux-saga-test-plan").RunResult>;
}
export declare const assertSaga: (saga: SagaType) => SagaAssertImplementation;
