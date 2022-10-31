'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      let text = req.body.text;
      let locale = req.body.locale;

      if (text == '') {
        // If text field is empty
        res.json({error: 'No text to translate'});
      } else if (!text || !locale) {
        // If one or more required fields is missing
        res.json({error: 'Required field(s) missing'});
      } else if (locale !== 'american-to-british' && locale !== 'british-to-american') {
        // If locale does match 'american-to-british' or 'british-to-american'
        res.json({error: 'Invalid value for locale field'});
      } else {
        // If there are no issues, call 'translator.translate()'
        let result = translator.translate(text, locale);
        res.json({text, translation: result});
      }
    });
};
