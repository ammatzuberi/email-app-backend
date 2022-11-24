var postmark = require("postmark");
require('dotenv').config()

const API_KEY = process.env.POSTMARK_API_KEY 
console.log(API_KEY)
var client = new postmark.ServerClient(API_KEY);

client.sendEmail({
  "From": "support@enggenv.com",
  "To": "recipient@example.com",
  "Subject": "Test",
  "TextBody": "Hello from Postmark!"
});