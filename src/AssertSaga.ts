import _ from 'lodash';
import { ActionCreator, AnyAction } from 'redux';
import { expectSaga, SagaType } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as providers from 'redux-saga-test-plan/providers';
import * as effects from 'redux-saga/effects';
import { getType } from 'typesafe-actions';

type SingleActionAssertionArguments = {
    action: ActionCreator<AnyAction>;
    withHandler: SagaType;
};

type MultipleActionsAssertionArguments = {
    actions: ReadonlyArray<ActionCreator<AnyAction>>;
    withHandler: SagaType;
};

const isSingleActionAssertion = (
    args: SingleActionAssertionArguments | MultipleActionsAssertionArguments
): args is SingleActionAssertionArguments =>
    (args as SingleActionAssertionArguments).action !== undefined;

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
    public justRespondsToLeading = (
        args: SingleActionAssertionArguments | MultipleActionsAssertionArguments
    ) => this.justRespondsTo(args, effects.takeLeading);
    /**
     * Ensures that the tested saga only responds to the latest specified action
     * with the specified handler saga and does absolutely nothing else.
     * Requires enhanced action creator from typesafe-actions.
     */
    public justRespondsToLatest = (
        args: SingleActionAssertionArguments | MultipleActionsAssertionArguments
    ) => this.justRespondsTo(args, effects.takeLatest);

    /**
     * Ensures that the tested saga only responds to every specified action
     * with the specified handler saga and does absolutely nothing else.
     * Requires enhanced action creator from typesafe-actions.
     */
    public justRespondsToEvery = (
        args: SingleActionAssertionArguments | MultipleActionsAssertionArguments
    ) => this.justRespondsTo(args, effects.takeEvery);

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
                        throw new Error(
                            `Unexpected function spawned: ${effect.fn.name}`
                        );
                    }),
                ],
                [
                    matchers.fork.like({}),
                    providers.dynamic<effects.ForkEffectDescriptor>(effect => {
                        throw new Error(
                            `Unexpected function forked: ${effect.fn.name}`
                        );
                    }),
                ],
                [
                    matchers.put.like({}),
                    providers.dynamic<effects.PutEffectDescriptor<AnyAction>>(
                        effect => {
                            throw new Error(
                                `Unexpected action put: ${effect.action.type}`
                            );
                        }
                    ),
                ],
                [
                    matchers.call.like({}),
                    providers.dynamic<effects.CallEffectDescriptor>(effect => {
                        throw new Error(
                            `Unexpected function called: ${effect.fn.name}`
                        );
                    }),
                ],
            ]);

        let expectApiBuilder = expectSaga(this.saga)
            // tslint:disable-next-line: no-any
            .provide(providedValues as any);

        sagasToSpawn.forEach(sagaType => {
            expectApiBuilder = expectApiBuilder.spawn(sagaType);
        });

        return expectApiBuilder.run();
    };

    private readonly justRespondsTo = (
        args:
            | SingleActionAssertionArguments
            | MultipleActionsAssertionArguments,
        createEffect: (pattern: string[], handler: SagaType) => unknown
    ) => {
        const actions = isSingleActionAssertion(args)
            ? [args.action]
            : args.actions;
        const actionTypes = actions
            .map(action => getType(action) as string)
            .sort();

        const saga = this.saga();
        const nextSagaValue = saga.next().value;

        if (
            nextSagaValue === undefined ||
            nextSagaValue.payload === undefined ||
            nextSagaValue.payload.args === undefined
        ) {
            throw Error(
                'Expected the first generator value to be a redux-saga effect.'
            );
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

        expect(nextSagaValue).toEqual(
            createEffect(actionTypes, args.withHandler)
        );

        expect(saga.next().done).toBe(true);
    };
}

export const assertSaga = (saga: SagaType) =>
    new SagaAssertImplementation(saga);
