const mongoose = require("mongoose");

const MailSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  date: {
    type: Date,
  },
  read: {
    type: Boolean,
  }
  
});

const Mail = mongoose.model("Mail", MailSchema);

module.exports = Mail;
