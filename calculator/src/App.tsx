import { useState } from "react"

// ["+", "-", "*", "/"] writing it like this means that the type is of list of all the 
//element but i want to union 
type Operator = "+" | "-" | "*" | "/";

type ButtonType = "number" | "operator" | "clear" | "equals"



interface ButtonProps{
  value : string,
  type : ButtonType,
  isOperator : boolean
}

interface DisplayProp{
  label : string
}

const buttons: ButtonProps[] = [
  { value: "7", type: "number", isOperator: false },
  { value: "8", type: "number", isOperator: false },
  { value: "9", type: "number", isOperator: false },
  { value: "/", type: "operator", isOperator: true },

  { value: "4", type: "number", isOperator: false },
  { value: "5", type: "number", isOperator: false },
  { value: "6", type: "number", isOperator: false },
  { value: "*", type: "operator", isOperator: true },

  { value: "1", type: "number", isOperator: false },
  { value: "2", type: "number", isOperator: false },
  { value: "3", type: "number", isOperator: false },
  { value: "-", type: "operator", isOperator: true },

  { value: "0", type: "number", isOperator: false },
  { value: "C", type: "clear", isOperator: false },
  { value: "=", type: "equals", isOperator: false },
  { value: "+", type: "operator", isOperator: true },
];

function performOperation(a : number, b : number, ops : Operator) : number | null{

  switch (ops) {

    case "+":

      return a + b;

    case "-":

      return a - b;

    case "*":

      return a*b;

    case "/":

      return (b == 0) ? null : a / b;

    default:

      return null;

  }

}

//this is the simplest number where I expect expression of tyep
//number 1 (ops) number 2
function performOps(expression: string): number | null {
    const n: number = expression.length;
    let i: number = 0;

    let a: number = 0;

    // Read first number
    while (
        i < n &&
        expression[i] >= "0" &&
        expression[i] <= "9"
    ) {
        a *= 10;
        a += Number(expression[i]);
        i++;
    }

    // Read operator
    const ops = expression[i] as Operator;
    i++;

    let b: number = 0;

    // Read second number
    while (
        i < n &&
        expression[i] >= "0" &&
        expression[i] <= "9"
    ) {
        b *= 10;
        b += Number(expression[i]);
        i++;
    }

    return performOperation(a, b, ops);
}

function convertResult(result : number | null) : string{
  return result === null ? "Error" : String(result);
}

function Display({label} : DisplayProp){
  return(
    <div>
      {label}
    </div>
  )

}

function addNumberToDisplay(label : string, value : string, setVal : Function) {
  setVal(label + value);
}

function App(){
  const [value, setVal] = useState("");
  return <div>
      <Display label = {value}/>


      {buttons.map((button) => (
          <button key = {button.value} onClick={() =>(addNumberToDisplay(value, button.value, setVal))}>
            {button.value}
          </button>
        ))}

      <button onClick={() => (setVal(convertResult(performOps(value))))}>
        Calculate
      </button>

      <button onClick={() => setVal("")}>
        Clear
      </button>
  </div>
}

export default App