const fs = require('fs')
const Nightmare = require('nightmare')
const CronJob = require('cron').CronJob;
const json = require('jsonfile')
const config = require('./config.json')

const nightmare = Nightmare()

function login () {
  return new Promise((resolve, reject) => {
    nightmare
      .goto('https://m.facebook.com')
      .type('[name="email"]', config.email)
      .type('[name="pass"]', config.pass)
      .click('[name="login"]')
      .wait(2000)
      .cookies.get()
      .then(cookies => {
        json.writeFile('cookies/cookies.json', cookies, err => {
          if (err)
            return reject(err)

          return resolve(cookies)
        })
      })
  })
}

function loadCookies() {
  return new Promise((resolve, reject) => {
    json.readFile('cookies/cookies.json', (err, cookies) => {
      if (err)
        return reject(err)

      return resolve(cookies)
    })
  })
}

function main() {
  const promise = (fs.existsSync('cookies/cookies.json'))
    ? loadCookies()
    : login()

  promise.then((cookies) => {
    nightmare
      .goto('https://m.facebook.com')
      .cookies.set(cookies)
      .then(() => {
        const cron = new CronJob({
          cronTime: '*/5 * * * * *',
          timeZone: 'Asia/Jakarta',
          onTick() {
            nightmare
              .refresh()
              .wait('a[data-sigil~="ufi-inline-like"]')
              .evaluate(() => {
                var btns = document.querySelectorAll('a[data-sigil~="ufi-inline-like"]')
                var counter = 0

                btns.forEach(btn => {
                  var data = JSON.parse(btn.dataset.store)

                  if (data.reaction==0) {
                    btn.click()

                    ++counter
                  }
                })

                return counter
              })
              .then(res => {
                console.log('Success', Object.keys(res).length, 'likes sent')
              })
              .catch(err => {
                console.error('Error', err)
              })
          }
        })

        cron.start()
      })
  })
}

main()
