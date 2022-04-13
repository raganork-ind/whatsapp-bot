/* 
© Raganork md - Souravkl11
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
*/

const {Module} = require('../events');
const Config = require('../config');
const Heroku = require('heroku-client');
const {secondsToHms} = require('./afk');
const got = require('got');
const heroku = new Heroku({
    token: Config.HEROKU.API_KEY
});


let baseURI = '/apps/' + Config.HEROKU.APP_NAME;

Module({pattern: 'restart$', fromMe: true, dontAddCommandList: true}, (async (message, match) => {

    await message.client.sendMessage(message.jid, { text: '_Restarting_' },{ quoted: message.data })
    console.log(baseURI);
    await heroku.delete(baseURI + '/dynos').catch(async (error) => {
        await message.client.sendMessage(message.jid, { text: error.message},{ quoted: message.data })});
}));

Module({pattern: 'shutdown$', fromMe: true, dontAddCommandList: true}, (async(message, match) => {

    await heroku.get(baseURI + '/formation').then(async (formation) => {
        forID = formation[0].id;
        await message.client.sendMessage(message.jid, { text: '_Shutting down ❌_' },{ quoted: message.data })
        await heroku.patch(baseURI + '/formation/' + forID, {
            body: {
                quantity: 0
            }
        });
    }).catch(async (err) => {
       await message.client.sendMessage(message.jid, { text: error.message},{ quoted: message.data }) 
 });
}));

Module({pattern: 'dyno$', fromMe: true, dontAddCommandList: true}, (async (message, match) => {

        heroku.get('/account').then(async (account) => {
            url = "https://api.heroku.com/accounts/" + account.id + "/actions/get-quota"
            headers = {
                "User-Agent": "Chrome/80.0.3987.149 Mobile Safari/537.36",
                "Authorization": "Bearer " + Config.HEROKU.API_KEY,
                "Accept": "application/vnd.heroku+json; version=3.account-quotas",
            }
            await got(url, {headers: headers}).then(async (res) => {
               const resp = JSON.parse(res.body);
               total_quota = Math.floor(resp.account_quota);
               quota_used = Math.floor(resp.quota_used);         
               percentage = Math.round((quota_used / total_quota) * 100);
               remaining = total_quota - quota_used;
               await message.client.sendMessage(message.jid, { text:
                    "Total dyno" + ": ```{}```\n\n".format(secondsToHms(total_quota))  + 
                    "Dyno used" + ": ```{}```\n".format(secondsToHms(quota_used)) +  
                    "Percentage" + ": ```{}```\n\n".format(percentage) +
                    "Dyno left" + ": ```{}```\n".format(secondsToHms(remaining))},{ quoted: message.data })
               );
            }).catch(async (err) => {
                await message.client.sendMessage(message.jid, { text: error.message },{ quoted: message.data })
  });        
        });
    }));
}
Module({pattern: 'setvar ?(.*)', fromMe: true, dontAddCommandList: true}, (async(message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, { text: 'Need key and value' },{ quoted: message.data })

    if ((varKey = match[1].split(':')[0]) && (varValue = match[1].split(':')[1])) {
        await heroku.patch(baseURI + '/config-vars', {
            body: {
                [varKey]: varValue
            }
        }).then(async (app) => {
          await message.client.sendMessage(message.jid, { text: '_Successfully set_ '+varKey+':'+varValue },{ quoted: message.data })  
 });
    } else {
        await message.client.sendMessage(message.jid, { text: '_Invalid Key:Value format ❌_' },{ quoted: message.data })   }
}));


Module({pattern: 'delvar ?(.*)', fromMe: true, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, { text: '_Give me a var key_' },{ quoted: message.data })
 await heroku.get(baseURI + '/config-vars').then(async (vars) => {
        key = match[1].trim();
        for (vr in vars) {
            if (key == vr) {
                await heroku.patch(baseURI + '/config-vars', {
                    body: {
                        [key]: null
                    }
                });
                return await message.client.sendMessage(message.jid, { text: '_Successfully deleted_ '+key },{ quoted: message.data })   }
        }
        await await message.client.sendMessage(message.jid, { text: '_Var not found ❌_' },{ quoted: message.data })
    }).catch(async (error) => {
       await message.client.sendMessage(message.jid, { text: error.message },{ quoted: message.data }) 
    });

}));
Module({pattern: 'getvar ?(.*)', fromMe: true, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, { text: '_Need a var key!_' },{ quoted: message.data })
    await heroku.get(baseURI + '/config-vars').then(async (vars) => {
        for (vr in vars) {
            if (match[1].trim() == vr) return await message.client.sendMessage(message.jid, { text: vars[vr]},{ quoted: message.data })
        }
        await await message.client.sendMessage(message.jid, { text: '_Var not found ❌_' },{ quoted: message.data })
    }).catch(async (error) => {
        await await message.client.sendMessage(message.jid, { text:error.message},{ quoted: message.data })
    });
}));
Module( 
  { pattern: "allvar", fromMe: true, desc: 'Get all vars' },
  async (message, match) => {
    let msg = "```Here your all Heroku vars\n\n\n"
    await heroku
      .get(baseURI + "/config-vars")
      .then(async (keys) => {
        for (let key in keys) {
          msg += `${key} : ${keys[key]}\n\n`
        }
        return await await message.client.sendMessage(message.jid, { text: msg + '```' },{ quoted: message.data })
      })
      .catch(async (error) => {
        await message.client.sendMessage(message.jid, { text: error.message},{ quoted: message.data })
      })
  }
);
