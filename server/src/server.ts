import { error } from "node:console";
import { createServer } from "node:http";
import pool from "./db";
import { supabase } from "./supabase";

pool.query("SELECT NOW()")
    .then(result => {
      console.log(result.rows);
    })
    .catch(error =>{
      console.error(error);
    });

interface Calculation {
    id: number;
    expression: string;
    result: number | null; 
}



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


const server = createServer(async (req, res) => {
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
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });

    res.end();
    return;
}

//Create of CRUD
if (req.method === "POST" && req.url === "/api/calculations") {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.writeHead(401, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:5173"
    });

    res.end(
      JSON.stringify({
        error: "Missing authorization header"
      })
    );

    return;
  }

  const token = authHeader.split(" ")[1];

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    res.writeHead(401, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:5173"
    });

    res.end(
      JSON.stringify({
        error: "Invalid authentication"
      })
    );

    return;
  }

  console.log("AUTHENTICATED USER:", user.id);

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {

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

    const result = await pool.query(
      `INSERT INTO calculations (expression, result, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.expression, ans, user.id]
    );

    res.writeHead(201, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:5173"
    });

    res.end(JSON.stringify(result.rows[0]));
  });

  return;
}


//Read of CRUD
if(req.method == "GET" && req.url == "/api/calculations"){

  const authHeader = req.headers.authorization;

  if (!authHeader) {

    res.writeHead(401, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:5173"
    });

    res.end(JSON.stringify({
      error: "Missing authorization header"
    }));

    return;
  }

  const token = authHeader.split(" ")[1];

  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token);

  if (error || !user) {

    res.writeHead(401, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:5173"
    });

    res.end(JSON.stringify({
      error: "Invalid authentication"
    }));

    return;
  }

  console.log("AUTHENTICATED USER:", user.id);

  try {

    const data = await pool.query(
      `SELECT * FROM calculations
       WHERE user_id = $1`,
      [user.id]
    );

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:5173"
    });

    res.end(JSON.stringify(data.rows));

  } catch (error) {

    console.error(error);

    res.writeHead(500, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:5173"
    });

    res.end(JSON.stringify({
      error: "Database error"
    }));
  }

  return;
}
// //Reading of one element 
//   if (req.method === "GET" && req.url?.startsWith("/api/calculations/")) {
//     const id = Number(
//     req.url.split("/").pop()
//   );

//   try {
//     const data = await pool.query(
//       `SELECT * FROM calculations
//       where id = $1`,
//       [id]
//     );

//     if(data.rows.length === 0){
//       res.writeHead(404, {
//         "content-type" : "application/json",
//         "access-control-allow-origin" : "http://localhost:5173"
//       });

//       res.end(JSON.stringify({
//         error : "Calucation not found"
//       }));

//       return;
//     }

//     res.writeHead(200, {
//       "content-type" : "application/json",
//       "access-control-allow-origin" : "http://localhost:5173"
//     });

//     res.end(JSON.stringify(data.rows[0]));
//   } catch (error) {
//     res.writeHead(500, {
//       "content-type" : "application/json",
//       "access-control-allow-origin" : "http://localhost:5173"
//     });

//     res.end(JSON.stringify({
//       error : "Database error"
//     }));
//   }

//   return;
// }

// //Update of CRUD
//   if (req.method == "PATCH" && req.url?.startsWith("/api/calculations")) {

//     const id = Number(req.url.split("/").pop());

//     const calculation = calculations.find(cal => cal.id == id);

//     // Check if calculation exists
//     if (!calculation) {
//         res.writeHead(404, {
//             "Content-Type": "application/json",
//             "Access-Control-Allow-Origin": "http://localhost:5173"
//         });

//         res.end(JSON.stringify({
//             error: "Calculation not found"
//         }));

//         return;
//     }

//     // Read request body
//     let body = "";

//     req.on("data", (chunk) => {
//         body += chunk;
//     });

//     req.on("end", async () => {

//         // Parse JSON
//         let data;

//         try {
//             data = JSON.parse(body);
//         } catch {
//             res.writeHead(400, {
//                 "Content-Type": "application/json",
//                 "Access-Control-Allow-Origin": "http://localhost:5173"
//             });

//             res.end(JSON.stringify({
//                 error: "Invalid JSON"
//             }));

//             return;
//         }

//         // Validate expression
//         if (typeof data.expression !== "string") {
//             res.writeHead(400, {
//                 "Content-Type": "application/json",
//                 "Access-Control-Allow-Origin": "http://localhost:5173"
//             });

//             res.end(JSON.stringify({
//                 error: "Expression must be a string"
//             }));

//             return;
//         }

//         // Calculate new result
//         const result = performOps(data.expression);

      

//         if (result === null) {
//             res.writeHead(400, {
//                 "Content-Type": "application/json",
//                 "Access-Control-Allow-Origin": "http://localhost:5173"
//             });

//             res.end(JSON.stringify({
//                 error: "Invalid calculation"
//             }));

//             return;
//         }

//         // Update existing resource
//         calculation.expression = data.expression;
//         calculation.result = result;

//         // Send updated resource
//         res.writeHead(200, {
//             "Content-Type": "application/json",
//             "Access-Control-Allow-Origin": "http://localhost:5173"
//         });

//         res.end(JSON.stringify(calculation));
//     });

//     return;
// }

// //DELETE of CRUD
//   if(req.method == "DELETE" && req.url?.startsWith("/api/calculations")){
//     const id = Number(req.url.split("/").pop());

//     const index = calculations.findIndex(
//         cal => cal.id === id
//     )

//     if(index === -1){
//       res.writeHead(404, {
//         "content-type" : "application/json",
//         "access-control-allow-origin" : "http://localhost:5173"
//       });

//       res.end(
//         JSON.stringify({
//           error : "Calculation not found"
//         })
//       );

//       return;
//     } else {
//       calculations.splice(index, 1);

//       res.writeHead(204);
//       res.end();
      
//       return;
//     }
//   }


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