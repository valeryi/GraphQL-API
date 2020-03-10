/* eslint no-console: 0 */

'use strict';

import nodemailer from 'nodemailer';
import { logger } from './logging';
import { env } from '../../environment'


export async function sendEmail(data) {

  // const templates =

  // NB! Store the account object values somewhere if you want
  // to re-use the same account for future mail deliveries

  // Create a SMTP transporter object
  let transporter = nodemailer.createTransport(
    {
      host: env.MAIL.HOST,
      port: env.MAIL.PORT,
      secure: parseInt(env.MAIL.SECURE),
      auth: {
        user: env.MAIL.USER,
        pass: env.MAIL.PASS
      },
      logger: false,
      debug: false // include SMTP traffic in the logs
    },
    {
      // default message fields

      // sender info
      from: data.from,
      headers: {
        'X-Laziness-level': 1000 // just an example header, no need to use this
      }
    }
  );

  // Message object
  let message = {
    // Comma separated list of recipients
    // to: 'Nodemailer <example@nodemailer.com>',
    to: data.to,

    // Subject of the message
    // subject: 'Nodemailer is unicode friendly ✔' + Date.now(),
    subject: data.subject,

    // plaintext body
    // text: 'Hello to myself!',
    text: '',

    // HTML body
    html: `${data.html}`,

    // AMP4EMAIL
    // amp: `<!doctype html>
    //     <html ⚡4email>
    //       <head>
    //         <meta charset="utf-8">
    //         <style amp4email-boilerplate>body{visibility:hidden}</style>
    //         <script async src="https://cdn.ampproject.org/v0.js"></script>
    //         <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
    //       </head>
    //       <body>
    //         <p><b>Hello</b> to myself <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
    //         <p>No embedded image attachments in AMP, so here's a linked nyan cat instead:<br/>
    //           <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
    //       </body>

    //     </html>`,
    // An array of attachments
    attachments: [
      // String attachment
      // {
      //   filename: 'notes.txt',
      //   content: 'Some notes about this e-mail',
      //   contentType: 'text/plain' // optional, would be detected from the filename
      // },

      // Binary Buffer attachment
      // {
      //   filename: 'image.png',
      //   content: Buffer.from(
      //     'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
      //     '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
      //     'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
      //     'base64'
      //   ),

      //   cid: 'note@example.com' // should be as unique as possible
      // },

      // File Stream attachment
      // {
      //   filename: 'nyan cat ✔.gif',
      //   path: __dirname + '/assets/nyan.gif',
      //   cid: 'nyan@example.com' // should be as unique as possible
      // }
    ],

    list: {
      // List-Help: <mailto:admin@example.com?subject=help>
      // help: 'admin@example.com?subject=help',

      // List-Unsubscribe: <http://example.com> (Comment)
      // unsubscribe: [
      //   {
      //     url: 'http://example.com/unsubscribe',
      //     comment: 'A short note about this url'
      //   },
      //   'unsubscribe@example.com'
      // ],

      // List-ID: "comment" <example.com>
      // id: {
      //   url: 'mylist.example.com',
      //   comment: 'This is my awesome list'
      // }
    }
  };

  await transporter.sendMail(message, (error, info) => {
    if (error) {
      // logger.error('Error occurred');
      logger.error(error.message);
      return process.exit(1);
    }


    // logger.info('Message sent successfully!');

    // only needed when using pooled connections
    transporter.close();
    return { message: `Mail has been sent succssfully!`, success: true };
  });

}
