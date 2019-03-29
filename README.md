# assert-saga

Various helpers for testing your redux-sagas.

Wrap your saga in the `assertSaga(yourSaga)` call and then use the fluent syntax to perform various assertions on its behaviour.

`justRespondsToLeading` / `justRespondsToLatest` / `justRespondsToEvery` - assert that the tested saga responds to the leading (/latest, /every) action with the specified handler and does absolutely nothing else.

`justSpawnsAsync` - assert that the tested saga spawns the specified sagas (in any order) and does absolutely nothing else (no puts, no calls, no forks).

# Major contributors

Anton Chistov – a.chistov@protoware.com