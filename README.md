# AIM

### 24-08-2026 - Monday 

1. ~~Create a button and a display without anything else showing, just press the button and show that on the screen.~~ 
2. ~~Create a grid of buttons and display.~~ 

## Basic Calculator To do

- Only `number operator number` is supported.
  - `12 + 34` ✅
  - `12 + 34 * 5` ❌
- No decimals.
  - `12.5 + 3` ❌
- No negative numbers.
  - `-5 + 3` ❌
- `as Operator` is trusting the input rather than validating it.
- `isOperator` is redundant because you already have:

  ```
  
  ```

  ```
  type ButtonType = "number" | "operator" | "clear" | "equals";
  ```
- \
  Your `C` and `=` buttons don't have `key` props. It's not a problem in your current output, but you can add them for consistency.

# CSS work