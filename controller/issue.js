import fs from "fs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import smallerUuid from "../config/tools.js";

dotenv.config();
const secret = process.env.SECRET;

export const getUserIssues = (req, res) => {
  try {
    process.on("uncaughtException", function (e) {
      console.log(e);
      process.exit(0);
    });
    var token = req.headers["x-api-key"];
    if (!token) return res.status(401).json({ error: "API key is required" });

    jwt.verify(token, secret, async function (err, decoded) {
      if (err) {
        console.log(err);
        return res.status(401).json({ error: "Failed to authenticate token" });
      }
      console.log(decoded.email);
      let email = decoded.email;
      let role = decoded.role;

      if (email) {
        fs.readFile("./data/data.json", (err, data) => {
          if (err) {
            console.log(err);
            // res.send(err);
          } else {
            if (role === "admin") {
              res.send(JSON.parse(data.toString()));
            } else {
              let selectedData =
                JSON.parse(data.toString()).find(
                  (item) => item.email === email
                ) || {};
              res.send(selectedData);
            }
          }
        });
      } else {
        res.status(400).json("Please Enter Valid Parameter");
      }
    });
  } catch (er) {}
};

export const addIssue = (req, res) => {
  try {
    process.on("uncaughtException", function (e) {
      console.log(e);
      process.exit(0);
    });
    var token = req.headers["x-api-key"];
    if (!token) return res.status(401).json({ error: "API key is required" });
    jwt.verify(token, secret, async function (err, decoded) {
      if (err) {
        return res.status(401).json({ error: "Failed to authenticate token" });
      }
      let email = decoded.email;
      fs.readFile("./data/data.json", (err, data) => {
        if (err) console.log(err);
        else {
          data = JSON.parse(data.toString());
          let issue = [...data];
          let userExists = issue.find((user) => user.email === email) || {};
          let updatedIssue = {};
          if (Object.keys(userExists).length) {
            userExists = {
              ...userExists,
              data: [
                ...userExists.data,
                {
                  ...req.body,
                  issueToken: smallerUuid(),
                  status: "Request Initiated!",
                },
              ],
            };
            updatedIssue = issue.filter((user) => user.email !== email);
            updatedIssue.push(userExists);
          } else {
            issue.push({
              email,
              data: [
                {
                  ...req.body,
                  issueToken: smallerUuid(),
                  status: "Request Initiated!",
                },
              ],
            });
            updatedIssue = [...issue];
          }
          fs.writeFile(
            "./data/data.json",
            JSON.stringify(updatedIssue),
            (err) => {
              if (err) console.log(err);
              else {
                console.log("File written successfully\n");
                res.send({
                  msg: "your Issue added successfully!",
                  issue: updatedIssue.find((user) => user.email === email),
                });
              }
            }
          );
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateIssueStatus = (req, res) => {
  try {
    process.on("uncaughtException", function (e) {
      console.log(e);
      process.exit(0);
    });
    var token = req.headers["x-api-key"];
    if (!token) return res.status(401).json({ error: "API key is required" });
    if (
      Object.keys(req.body).sort().toString() !=
      ["email", "issueToken", "status"].toString()
    )
      return res.status(400).json({
        error: "Request body should contain: email, issueToken, status",
      });
    jwt.verify(token, secret, async function (err, decoded) {
      if (err) {
        return res.status(401).json({ error: "Failed to authenticate token" });
      }
      let email = req.body.email;
      let role = decoded.role;
      let issueToken = req.body.issueToken;
      if (role !== "admin")
        return res.status(401).json({ error: "You are not authorised" });
      console.log(role);

      fs.readFile("./data/data.json", (err, data) => {
        if (err) console.log(err);
        else {
          data = JSON.parse(data.toString());
          let issue = [...data];
          let userExists = issue.find((user) => user.email === email) || {};
          let updatedIssue = [];
          if (Object.keys(userExists).length) {
            let selectedIssue =
              userExists?.data.find(
                (issue) => issue.issueToken === issueToken
              ) || {};
            if (!Object.keys(selectedIssue).length)
              return res.status(401).json({
                error: "Sorry! no such token found on corresponding email",
              });
            selectedIssue.status = req.body.status;
            updatedIssue = issue.filter((issue) => issue.email !== email);
            updatedIssue.push(userExists);
            console.log(updatedIssue);
            fs.writeFile(
              "./data/data.json",
              JSON.stringify(updatedIssue),
              (err) => {
                if (err) console.log(err);
                else {
                  console.log("File written successfully\n");
                  res.send({
                    msg: "your Issue added successfully!",
                    issue: updatedIssue.find((user) => user.email === email),
                  });
                }
              }
            );
          } else {
            return res.status(401).json({ error: "user doesn't exists." });
          }
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
};
export const deleteIssue = (req, res) => {
  try {
    process.on("uncaughtException", function (e) {
      console.log(e);
      process.exit(0);
    });
    var token = req.headers["x-api-key"];
    if (!token) return res.status(401).json({ error: "API key is required" });
    if (
      Object.keys(req.body).sort().toString() !=
      ["email", "issueToken"].toString()
    )
      return res.status(400).json({
        error: "Request body should contain: email, issueToken, status",
      });
    jwt.verify(token, secret, async function (err, decoded) {
      if (err) {
        return res.status(401).json({ error: "Failed to authenticate token" });
      }
      let email = req.body.email;
      let role = decoded.role;
      let issueToken = req.body.issueToken;
      if (role !== "admin")
        return res.status(401).json({ error: "You are not authorised" });
      console.log(role);

      fs.readFile("./data/data.json", (err, data) => {
        if (err) console.log(err);
        else {
          data = JSON.parse(data.toString());
          let issue = [...data];
          let userExists = issue.find((user) => user.email === email) || {};
          let updatedIssue = [];
          if (Object.keys(userExists).length) {
            let deletedIssue =
              userExists?.data.filter(
                (issue) => issue.issueToken !== issueToken
              ) || {};

            let findIssue =
              userExists?.data.find(
                (issue) => issue.issueToken === issueToken
              ) || {};

            if (!Object.keys(findIssue).length)
              return res.status(401).json({
                error: "Sorry! no such token found on corresponding email",
              });
            // selectedIssue.status = req.body.status;
            userExists.data = [...deletedIssue];
            updatedIssue = issue.filter((issue) => issue.email !== email);
            updatedIssue.push(userExists);
            console.log(JSON.stringify(updatedIssue));
            fs.writeFile(
              "./data/data.json",
              JSON.stringify(updatedIssue),
              (err) => {
                if (err) console.log(err);
                else {
                  console.log("File written successfully\n");
                  res.send({
                    msg: "your Issue deleted successfully!",
                    issue: updatedIssue.find((user) => user.email === email),
                  });
                }
              }
            );
          } else {
            return res.status(401).json({ error: "user doesn't exists." });
          }
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
};
