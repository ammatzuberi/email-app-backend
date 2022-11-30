var postmark = require("postmark");
require("dotenv").config();

const API_KEY = process.env.POSTMARK_API_KEY;
console.log(API_KEY);
var client = new postmark.ServerClient(API_KEY);

client.sendEmail({
  From: "support@enggenv.com",
  To: "recipient@example.com",
  Subject: "Test",  
  TextBody: "Hello from Postmark!",
}),
  client.sendEmailBatch(messages, function (error, batchResults) {
    if (error) {
      console.error("Unable to send via postmark: " + error.message);
      return;
    }
    console.info("Messages sent to By PostMark");
  });
