import { createServer } from "node:http";

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

        res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:5173"
        });

        res.end(
            JSON.stringify({
                result : ans
            })
        );
    });

    return;
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