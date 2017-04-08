const Nightmare = require('nightmare');
const config = require('./config.json');

Nightmare()
  .goto('https://m.facebook.com')
  .type('[name="email"]', config.email)
  .type('[name="pass"]', config.pass)
  .click('[name="login"]')
  .wait('[value="OK"]')
  .click('[value="OK"]')
  .wait('a[data-sigil~="ufi-inline-like"]')
  .evaluate(() => {
    var btns = document.querySelectorAll('a[data-sigil~="ufi-inline-like"]');

    btns.forEach(btn => {
      var data = JSON.parse(btn.dataset.store);
      if (data.reaction==0)
        btn.click();
    });

    return btns;
  })
  .end()
  .then(res => {
    console.log('Success', Object.keys(res).length, 'likes sent');
  })
  .catch(err => {
    console.error('Error', err);
  })
