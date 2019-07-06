# assert-saga

Various helpers for testing your redux-sagas.

Wrap your saga in the `assertSaga(yourSaga)` call and then use the fluent syntax to perform various assertions on its behaviour.

`justRespondsToLeading` / `justRespondsToLatest` / `justRespondsToEvery` - assert that the tested saga responds to the leading (/latest, /every) action (or actions) with the specified handler and does absolutely nothing else. The actions in the assert (and the actual watcher saga) can be **in any order**.

`justSpawnsAsync` - assert that the tested saga spawns the specified sagas (in any order) and does absolutely nothing else (no puts, no calls, no forks).

# Current limitations

You **have** to use the `typesafe-actions` library for the asserts to work correctly, as they make use of the library-specific `getType()` function (it operates on action creators, returning their returned action type string).

# Major contributors

Anton Chistov – a.chistov@protoware.com