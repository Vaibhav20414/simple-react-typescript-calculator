import { error } from "node:console";
import { createServer } from "node:http";

interface Calculation {
    id: number;
    expression: string;
    result: number | null; 
}

const calculations: Calculation[] = [];

let nextId = 1;

type Operator = "+" | "-" | "*" | "/";
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

//this is the simplest number where I expect expression of type
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
const server = createServer((req, res) =>{
   console.log("REQUEST RECEIVED:", req.method, req.url);
  if(req.method == "GET" && req.url == "/hello"){
    res.writeHead(200,{
      "Content-Type":"application/json",
      "access-control-allow-origin" : "http://localhost:5173"
    });

     res.end(
    JSON.stringify({
      message:"Hello from Node Server"
    })
  );

  return;
  } 
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    });

    res.end();
    return;
}

//Create of CRUD
  if(req.method == "POST" && req.url == "/api/calculations"){
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      let data;

      try {
        data = JSON.parse(body);
      } catch {
        res.writeHead(400, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5173"
        });

        res.end(
          JSON.stringify({
          error: "Invalid JSON"
          })
        );

        return;
      }

      if (typeof data.expression !== "string") {
      res.writeHead(400, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5173"
      });

      res.end(
        JSON.stringify({
            error: "Expression must be a string"
        })
      );

      return;
      }

      const ans = performOps(data.expression);


      if (ans === null) {
    res.writeHead(400, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5173"
    });

    res.end(
        JSON.stringify({
            error: "Invalid calculation"
        })
    );

    return;
}
      //-----------------------------------------------------------------
      //This part is should be coming from database
        const calculation: Calculation = {
        id: nextId++,
        expression: data.expression,
        result : ans 
    };

    calculations.push(calculation);

        res.writeHead(201, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5173"
      });

        res.end(JSON.stringify(calculation));

        });

    return;
  }
//Read of CRUD
  if(req.method == "GET" && req.url == "/api/calculations/"){
    res.writeHead(200, {
      "Content-Type" : "application/json",
      "access-control-allow-origin" : "http://localhost:5173"
    });

    res.end(JSON.stringify(calculations));

    return;
  }
//Reading of one element 
  if (req.method === "GET" && req.url?.startsWith("/api/calculations/")) {
    const id = Number(
    req.url.split("/").pop()
  );

  const calculation = calculations.find(cal => cal.id == id)

  if(calculation === undefined){
    res.writeHead(404, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:5173"
});

res.end(JSON.stringify({
    error: "Calculation not found"
}));

return;
  } else {
    res.writeHead(200, {
      "content-type" : "application/json",
      "access-control-allow-origin" : "http://localhost:5173"
    });

    res.end(JSON.stringify(calculation))
  }
}

//Update of CRUD
  if (req.method == "PATCH" && req.url?.startsWith("/api/calculations/")) {

    const id = Number(req.url.split("/").pop());

    const calculation = calculations.find(cal => cal.id == id);

    // Check if calculation exists
    if (!calculation) {
        res.writeHead(404, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:5173"
        });

        res.end(JSON.stringify({
            error: "Calculation not found"
        }));

        return;
    }

    // Read request body
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {

        // Parse JSON
        let data;

        try {
            data = JSON.parse(body);
        } catch {
            res.writeHead(400, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:5173"
            });

            res.end(JSON.stringify({
                error: "Invalid JSON"
            }));

            return;
        }

        // Validate expression
        if (typeof data.expression !== "string") {
            res.writeHead(400, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:5173"
            });

            res.end(JSON.stringify({
                error: "Expression must be a string"
            }));

            return;
        }

        // Calculate new result
        const result = performOps(data.expression);

        if (result === null) {
            res.writeHead(400, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:5173"
            });

            res.end(JSON.stringify({
                error: "Invalid calculation"
            }));

            return;
        }

        // Update existing resource
        calculation.expression = data.expression;
        calculation.result = result;

        // Send updated resource
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:5173"
        });

        res.end(JSON.stringify(calculation));
    });

    return;
}

//DELETE of CRUD
  if(req.method == "DELETE" && req.url?.startsWith("/api/calculations/")){
    const id = Number(req.url.split("/").pop());

    const index = calculations.findIndex(
        cal => cal.id === id
    )

    if(index === -1){
      res.writeHead(404, {
        "content-type" : "application/json",
        "access-control-allow-origin" : "http://localhost:5173"
      });

      res.end(
        JSON.stringify({
          error : "Calculation not found"
        })
      );

      return;
    } else {
      calculations.splice(index, 1);

      res.writeHead(204);
      res.end();
      
      return;
    }
  }


   res.writeHead(404,{
      "Content-Type":"application/json",
      "access-control-allow-origin" : "http://localhost:5173"
    });

     res.end(
    JSON.stringify({
      message:"Why are you here?"

  })
  )
  return;
})

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
})