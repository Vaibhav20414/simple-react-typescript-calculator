import { useState, useEffect } from "react"
import "./App.css"
import Auth from "./Auth";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

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

interface Calculation{
  id:number;
  expression: string;
  result : number | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
  async function getSession() {
    const { data } = await supabase.auth.getSession();

    setSession(data.session);
    setUser(data.session?.user ?? null);
  }

  getSession();
}, []);

useEffect(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}, []);

  async function logout() {
    await supabase.auth.signOut();
  }
  const [value, setVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Calculation[]>([]);

  const [searchId, setSearchId] = useState("");
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [error, setError] = useState("");

  

  async function getCalculation() {
    setError("");
    setCalculation(null);

    try{
      const response = await fetch(
        `http://localhost:3000/api/calculations/${searchId}`
    );

    const data = await response.json();

    if(!response.ok){
      setError(data.error);
      return;
    }

    setCalculation(data);
  } catch(error) {
    setError("Could not connect to server");
    console.error(error);
  }
}

async function getHistory() {
  try {

    const accessToken = session?.access_token;

    const response = await fetch(
      "http://localhost:3000/api/calculations",
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    console.log("history response:", data);

    setHistory(data);

  } catch (error) {
    console.error(error);
  }
}


  async function calculate() {
    setLoading(true);

    const { data } = await supabase.auth.getSession();

    const accessToken = data.session?.access_token;

    try {
      const response = await fetch(
        "http://localhost:3000/api/calculations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${accessToken}`,
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
    <div>
      {user ? (
        <div>
          <h2>Welcome {user.email}</h2>

          <button onClick={logout}>
            Logout
          </button>

      <div  className="calculator">
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

      <div className="history">
        <h2>
          History 
        </h2> 

        <button onClick={getHistory}>
          Get History
        </button>

          {history.map((cal) => (
            <div key = {cal.id}>
              <span>
                {cal.expression} = {cal.result}
              </span>
            </div>
          ))}

          <input
            type="number"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter calculation ID"
          />

          <button onClick={getCalculation}>
            Get Calculation
          </button>

          {error && (
              <p>{error}</p>
          )}

          {calculation && (
              <div>
                  <p>ID: {calculation.id}</p>
                  <p>
                      {calculation.expression} = {calculation.result}
                  </p>
              </div>
          )}
      </div>
    </div>

      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App


