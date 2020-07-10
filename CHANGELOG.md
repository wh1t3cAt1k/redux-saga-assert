# 0.4.1

Fix bug whereby `justRespondsToX` failed when the expected / actual effect contained different instances of the same function.

`JSON.stringify` is now used instead.

Note that it might introduce false positives when the functions serialize to the same string, but are in fact different, however, lacking a good way to compare function instances in JS, this is the only sane choice. 

# 0.4.0

Bump dependency versions:

```typescript
{
    "typescript": "^3.8.3",
    "redux-saga-test-plan": "^4.0.0-rc.3",
    "typesafe-actions": "^5.1.0"
}
```

# 0.2.0

Added the possibility to assert usage of **several** action types in `takeLeading`, `takeLatest`, and `takeEvery` effects.