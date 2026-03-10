# tokidoki : ときどき : sometimes
_tokidoki_ — A tagged logging identity function for debugging pipelines.

```typescript
tokidoki :: String -> a -> a
```

Logs a value with a tag, then returns it unchanged. Useful for inspecting values mid-pipeline without breaking composition.

## Install

```bash
npm install @mtavkhelidze/tokidoki
```

## Usage

### Eager form

```typescript
import { tokidoki } from "tokidoki";

const x = tokidoki("myTag", 42);
// console: myTag 42
// x === 42
```

### Curried form

```typescript
const debug = tokidoki("myTag");
const x = debug(42);
// console: myTag 42
// x === 42
```

### In a pipeline

```typescript
const result = xs
  .map(tokidoki("before"))
  .map(x => x * 2)
  .map(tokidoki("after"));
```

```
before 1
before 2
before 3
after 2
after 4
after 6
```

## Signature

```typescript
export const tokidoki: {
  <A extends {}>(tag: string, obj: A): A;
  <A extends {}>(tag: string): (obj: A) => A;
}
```

`null` and `undefined` are excluded by the `A extends {}` constraint — use `Option<A>` explicitly if you need nullable values.

## Laws

`tokidoki` satisfies the identity law and naturality:

```
tokidoki(t, x)    ≡  x                         -- identity
map(f ∘ tokidoki(t))  ≡  map(f) ∘ map(tokidoki(t))  -- naturality
```

The tag is purely for the side effect. The return value is always the input unchanged.

## License

ICS
