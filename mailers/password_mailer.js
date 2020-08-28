const nodemailer = require("../config/nodemailer");

exports.forgotPassword = (userDetails) => {
  let htmlString = nodemailer.renderTemplate(
    { userDetails: userDetails },
    "./forgot_password/forgot_password.ejs"
  );
  nodemailer.transporter.sendMail(
    {
      from: "anishbhateja99@gmail.com",
      to: userDetails.user.email,
      subject: "Update Password",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }
      //console.log("Message sent", info);
      return;
    }
  );
};
