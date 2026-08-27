import { useState } from "react"
import "./App.css"

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



function convertResult(result : number | null) : string{
  return result === null ? "Error" : String(result);
}

function Display({label} : DisplayProp){
  return(
    <div className="display">
      {label}
    </div>
  )

}

function addNumberToDisplay(label : string, value : string, setVal : (value : string) => void) {
  setVal(label + value);
}



function App() {
  const [value, setVal] = useState("");
  const [loading, setLoading] = useState(false);

  async function calculate() {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/calculations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            expression: value,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setVal(String(data.result));

    } catch (error) {
      setVal("Error");
      console.error(error);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="calculator">
      <Display label={loading ? "Calculating..." : value} />

      {buttons.map((button) => {
        switch (button.type) {

          case "number":
          case "operator":
            return (
              <button
                className={`button_${button.type}`}
                key={button.value}
                onClick={() =>
                  addNumberToDisplay(value, button.value, setVal)
                }
              >
                {button.value}
              </button>
            );

          case "clear":
            return (
              <button
                className={`button_${button.type}`}
                key={button.value}
                onClick={() => setVal("")}
              >
                Clear
              </button>
            );

          case "equals":
            return (
              <button
                className={`button_${button.type}`}
                key={button.value}
                onClick={calculate}
              >
                =
              </button>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export default App