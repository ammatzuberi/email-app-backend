import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

import { validateEmail, validateRequestBody } from "../config/tools.js";

const secret = process.env.SECRET;

export const login = (req, res) => {
  try {
    process.on("uncaughtException", function (e) {
      console.log(e);
      process.exit(0);
    });
    var email = req.body.email;
    var password = req.body.password;
    console.log(email);
    var keys = Object.keys(req.body).sort();
    var requiredParams = ["email", "password"];

    if (!validateRequestBody(keys, requiredParams)) {
      res.status(400).json({ error: "Request body should contain - email and password" });
    } else if (!validateEmail(email)) {
      res.status(400).json({ error: "Invalid email address" });
    } else {
      fs.readFile("./data/users.json", (err, data) => {
        if (err) console.log(err);
        else {
          data = JSON.parse(data.toString());
          let users = [...data];
          console.log({ users });
          console.log({ email, password });

          let verifiedUser = users.find((acc) => {
            return acc.email === email;
          });
          console.log(verifiedUser);
          if (!verifiedUser){
            res.status(401).json({ error: "User doesnt exist" });
          } else{
            bcrypt.compare(password, verifiedUser?.password, async function (err, verify) {
              if (err) {
                console.log(err);
              }
              if (!verify) {
                res.status(401).json({ error: "Incorrect password" });
              } else {
                var token = jwt.sign({ email: email, role: verifiedUser.role }, secret, {
                  expiresIn: parseInt(3600),
                });
  
                fs.readFile("./data/data.json", (err, data) => {
                  let userData = {};
                  console.log("file Data" + data.toString());
                  if (data.toString() !== "") {
                    userData = JSON.parse(data.toString())?.find((data) => data?.email === email) || {};
                  }
                  console.log(userData);
                  if (!Object.keys(userData).length && err) {
                    res.status(200).json({
                      msg: "Logged in successfully",
                      token: token,
                      email,
                      userData: {},
                      role: verifiedUser.role,
                    });
                  } else {
                    res.status(200).json({
                      msg: "Logged in successfully",
                      token: token,
                      email,
                      userData,
                      role: verifiedUser.role,
                    });
                  }
                });
              }
            });
          }
          
        }
      });
    }
  } catch (err) {
    res.json(501).json({ error: "Internal Server Error!" });
  }
  // else {
  //   res.send("this request should contain name, quantity, price, manufacturer");
  // }
};
export const register = (req, res) => {
  try {
    process.on("uncaughtException", function (e) {
      console.log(e);
      process.exit(0);
    });
    let email = req.body.email;
    let password = req.body.password;
    var keys = Object.keys(req.body).sort();
    var requiredParams = ["email", "password"];

    if (!validateRequestBody(keys, requiredParams)) {
      res.status(400).json({ error: "Request body should contain - email and password" });
    } else if (!validateEmail(email)) {
      res.status(400).json({ error: "Invalid email address" });
    } else {
      fs.readFile("./data/users.json", (err, data) => {
        if (err) console.log(err);
        else {
          console.log(data.toString());

          data = JSON.parse(data.toString()) || [];

          let users = [...data];
          let alreadyExists = users.find((user) => user.email === email) || {};

          if (Object.keys(alreadyExists).length !== 0) {
            res.status(400).json({ error: "User Already Exists!" });
          } else {
            bcrypt.hash(password, 10).then(function (hash) {
              users.push({ email, password: hash, role: "user" });
              console.log(users);
              fs.writeFile("./data/users.json", JSON.stringify(users), (err) => {
                if (err) console.log(err);
                res.status(200).json({
                  msg: "Signup Successfully",
                });
              });
            });
          }
        }
      });
    }
  } catch (err) {
    res.json(501).json({ error: "Internal Server Error!" });
  }
  // else {
  //   res.send("this request should contain name, quantity, price, manufacturer");
  // }
};
