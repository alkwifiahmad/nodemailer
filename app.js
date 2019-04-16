const express = require('express');
const PORT = process.env.PORT || 5500;
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');

const nodemailer = require('nodemailer');


// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});


app.post('/send', (req, res) => {
  console.log(req.body)
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Subject</h3>
    <p>${req.body.subject}</p>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    <li>Embedded image: <img src="cid:www"/></li>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    // true for 465, false for other ports
    service: 'gmail',
    auth: {
        user: 'ahmadebrahim976@gmail.com', // generated ethereal user
        pass: 'Ahmad1976'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
    
  });
 
  // setup email data with unicode symbols
  
  let mailOptions = {
    
      from: req.body.email, // sender address
      to: 'ahmadebrahim976@gmail.com', // list of receivers
      subject: req.body.subject, // Subject line
      text: req.body.message, // plain text body
      html: output
     };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent....'});
  });
  });
app.listen(PORT, ()=>{
    console.log(`Server run with port : ${PORT}`);
    
})