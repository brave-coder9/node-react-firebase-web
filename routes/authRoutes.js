
var admin = require("firebase-admin");
var serviceAccount = require('../config/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fastwind-fe4c3.firebaseio.com"
});
const firebaseAdminAuth = admin.auth();


module.exports = app => {

  app.get('/api/hello', (req, res) => {
    res.send({test: "Hi"});
  });

  app.post('/api/delete_spec_user', async (req, res) => {
    console.log('POST /api/delete_spec_user ', req.body);
    const { userUuid } = req.body;
    try {
      var result = await firebaseAdminAuth.deleteUser(userUuid);
      console.log('deleteUser: '+ userUuid + ' --> ', result);
      res.send({delete_spec_user:1});
    } catch(err) {
      res.status(422).send(err);
    }
  });

  // app.get('/api/login', (req, res) => {
  //   res.send({email: req.email});
  // });

  // app.get('/api/logout', (req, res) => {
  //   req.logout();
  //   res.redirect('/');
  // });

  // app.get('/api/current_user', (req, res) => {
  //   res.send(req.user);
  // });
};
