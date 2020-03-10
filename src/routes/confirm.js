import { Router } from 'express';
import SimpleCrypto from 'simple-crypto-js';
import { env } from '../environment';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logging';

// const secret = env.TOKEN_SECRET;
const secret = env.token_secret;
const router = Router();
const crypter = new SimpleCrypto(secret);


router.get('/*', (req, res) => {
  const id = crypter.decrypt(req.url.slice(1));

  authService.confirm(id)
    .then(user => {
      return res.status(200).send(user);
    })
    .catch(err => {
      return res.status(500).send(err.message);
    });
});

// alternative Promise
// router.get("/*", (req, res) => {
//   const id = crypter.decrypt(req.url.slice(1));
//   User.findById(id)
//     .then(doc => {
//       res.send(doc);
//     })
//     .catch(err => {
//       console.log(err);
//       return res.status(500).send("something went wrong");
//     });
// });

// Alternative callback
// router.get("/*", (req, res) => {
//   const id = crypter.decrypt(req.url.slice(1));

//   User.findById(id, (err, doc) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).send("something went wrong");
//     }

//     return res.send(doc);
//   });
// });

// Alternative async
// router.get("/*", async (req, res) => {
//   const id = crypter.decrypt(req.url.slice(1));
//   try {
//     let result = await User.findById(id);
//     res.send(result);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("something went wrong");
//   }
// });

module.exports = router;

