const {isAdmin,isFake,delAntifake,getAntifake,setAntifake} = require('./misc/misc');
const {Module} = require('../main')
const {ALLOWED} = require('../config')
Module({pattern: "antifake",fromMe: true}, async(message, match) => {
var {subject,owner} = await message.client.groupMetadata(message.jid)
var myid = message.client.user.id.split(":")[0] 
const templateButtons = [
        {index: 1, urlButton: {displayText: 'ADMIN', url: 'https://wa.me/'+owner.split("@")[0]}},
        {index: 2, quickReplyButton: {displayText: 'ENABLE ✅', id: 'fake_on'+myid}},
        {index: 3, quickReplyButton: {displayText: 'DISABLE ❌', id: 'fake_off'+myid}},
        {index: 4, quickReplyButton: {displayText: 'ALLOWED ℹ️', id: 'fake_get'+myid}},
    ]
    
    const templateMessage = {
        text: "*Antifake menu of* "+subject,
        footer: '',
        templateButtons: templateButtons
    }
    await message.client.sendMessage(message.jid, templateMessage)
})
Module({on: "button",fromMe: true}, async(message, match) => {
if (message.tempb&&message.tempb.startsWith("fake_on")&&message.tempb.includes(message.client.user.id.split(":")[0])) {
await setAntifake(message.jid);
return await message.sendMessage("Antifake enabled ✅")
}
if (message.tempb&&message.tempb.startsWith("fake_off")&&message.tempb.includes(message.client.user.id.split(":")[0])) {
await delAntifake(message.jid);
return await message.sendMessage("Antifake disabled ✅")
}
if (message.tempb&&message.tempb.startsWith("fake_get")&&message.tempb.includes(message.client.user.id.split(":")[0])) {
return await message.sendMessage("Allowed prefixes: "+ALLOWED)
}
})
Module({on: "group_update",fromMe: false}, async(message, match) => {
    var db = await getAntifake();
    if (db.includes(message.jid) && message.update === 27) {
    var allowed = ALLOWED.split(",");
    if (isFake(message.participant[0],allowed)) {
    await message.client.sendMessage(message.jid,{text: "Fake numbers not allowed @"+message.participant[0].split("@")[0],mentions: [message.participant[0]]});
    await message.client.groupParticipantsUpdate(message.jid, [message.participant[0]], "remove")
    }}
    })
