/*************************************
 * Name: Roman Alshehri
 * Data: 18 December 2017 (Monday)
 *
 * Desc: This is the auth route
 *
 **************************************/

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendResetPasswordEmail, sendNotifyPasswordChangeEmail} from '../mailer';

const router = express.Router();

router.post('/', (req, res) => {
  const { credentials } = req.body;
  User.findOne({email: credentials.email }).then(user => {
    if (user && user.isValidPassword(credentials.password)) {
      res.json({ user: user.toAuthJSON() });
    } else {
      res.status(400).json({ errors: { global: "Invalid credentials "}});
    }
  });
});

router.post('/confirmation', (req, res) => {
  const token = req.body.token;
  User.findOneAndUpdate(
    { confirmationToken: token },
    { confirmationToken: "", confirmed: true },
    { new: true }
  ).then(user =>
    user ? res.json({ user: user.toAuthJSON() }) : res.status(400).json({})
  );
});

router.post('/reset_password_request', (req, res) => {
  const email = req.body.email;
  User.findOne({ email }).then( user => {
    if (user) {
      sendResetPasswordEmail(user);
      res.json({ })
    } else {
      res.status(400).json({ errors: { global: "There is no user with this email"}});
    }
  })
})

router.post('/validate_tokne', (req, res) => {
  const token = req.body.token;

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if(err){
      res.status(401).json({ errors: { global: "Token expired"}});
    } else {
      res.json({});
    }
  })
})

router.post('/set_new_password', (req, res) => {
  const { newPassword, token } = req.body.data;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({errors: { global: "Invalid token "}})
    } else {
      User.findOne({ _id: decoded._id }).then(user => {
        if (user) {
          user.setPassword(newPassword);
          user.save().then(() => {
            sendNotifyPasswordChangeEmail(user);
            res.json({})
          });
        } else {
          res.status(404).json({errors: {global: "Invalid token "}})
        }
      })
    }
  })
})

export default router;