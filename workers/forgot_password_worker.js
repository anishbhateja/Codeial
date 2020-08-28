const queue = require("../config/kue");

const passwordMailer = require("../mailers/password_mailer");

queue.process("forgotPassword", function (job, done) {
  console.log("Password worker is processing a job", job.data);
  passwordMailer.forgotPassword(job.data);
  done();
});
