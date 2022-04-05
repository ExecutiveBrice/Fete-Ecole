'use strict';
const CLIENT_EMAIL = "amicalelaiquebeautour@gmail.com";
const CLIENT_ID = "786730254987-glf7hjvbe556pcd2rrud3o0sgavsc3l8.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "GOCSPX-K"

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
var nodemailer = require('nodemailer');

const OAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);

OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


const myAccessToken = myOAuth2Client.getAccessToken()

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: CLIENT_EMAIL,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: myAccessToken //access token variable we defined earlier
  }
});
//compte Gmail
//alod.section.fete@gmail.com
//OucheDinier44400
var mailOptions = {
  from: 'ALOD Ouche Dinier',
  to: 'Adresse mail',
  subject: 'Sujet du mail',
  html: 'Corps du mail'
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var Croisement = require('../models').Croisement;
var Creneau = require('../models').Creneau;
var Stand = require('../models').Stand;
var Benevole = require('../models').Benevole;
var Config = require('../models').Config;

module.exports = {
  sendMail: function add(req, res) {
    console.log("sendMail")
    mailOptions.to = req.body.to
    mailOptions.subject = req.body.subject
    mailOptions.html = req.body.text
    return transporter.sendMail(mailOptions, function (error, info) {
      console.log('Email sent!');
      return res.status(200).json({
        message: "Email sent",
        obj: mailOptions.subject
      });
    });
  },










  rappel: function rappel(req, res) {

    console.log("sendRappel")

    return Benevole.findAll({
      include: [
        {
          model: Croisement,
          include: [
            { model: Creneau },
            { model: Stand }
          ]
        }
      ]
    })
      .then(function (benevoles) {
        console.log("sendRappel - 2")
        console.log(benevoles)
        mailOptions.subject = req.body.subject

        var text1 = Config.findOne({ where: { param: ("rappel1") } })
          .then(function (param) {
            console.log("getParam - 2")
            console.log(param)
            if (!param) {
              return null
            }
            return param
          }).catch(function (error) {
            console.log(error.toString());
            return null;
          });


        var text2 = Config.findOne({ where: { param: ("rappel2") } })
          .then(function (param) {
            console.log("getParam - 2")
            console.log(param)
            if (!param) {
              return null
            }
            return param
          }).catch(function (error) {
            console.log(error.toString());
            return null;
          });
        benevoles.forEach(benevole => {
          var text = text1
          if (benevole.Croisements) {
            console.log('benevole.Croisement');
            benevole.Croisements.forEach(croisement => {
              text = text + croisement.Stand.nom + " - " + croisement.Creneau.plage + "\n"
            })
          }
          text = text + benevole.gateaux + "\n"
          text = text + text2
          mailOptions.html = text
          mailOptions.to = benevole.email

          transporter.sendMail(mailOptions, function (error, info) {
            console.log('Email sent!');

          });

        });
        return res.status(200).json({
          message: "Emails sent",
          obj: benevoles
        });
      })


  }




};