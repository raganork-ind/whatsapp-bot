const {Module} = require('../main');
const FilterDb = require('./sql/filters');
Module({pattern: 'filter ?(.*)', fromMe: true, desc: "Adds filter in chat", dontAddCommandList: true}, (async (message, match) => {
    match = match[1].match(/[\'\"\“](.*?)[\'\"\“]/gsm);
    if (message.reply_message.text) {
        await FilterDb.setFilter(message.jid, match[0].replace(/['"“]+/g, ''), message.reply_message.text, match[0][0] === "'" ? true : false);
        await message.client.sendMessage(message.jid,{text: "_Set_" + match[0].replace(/['"]+/g, '')+" _to filter ✅_"});
    return;
    }
    if (match === null) {
        filtreler = await FilterDb.getFilter(message.jid);
        if (filtreler === false) {
            await message.client.sendMessage(message.jid,{text: "_No filters found in this chat ❌_"})
        } else {
            var mesaj = "_Your filters in this chat:_" + '\n';
            filtreler.map((filter) => mesaj += '```' + filter.dataValues.pattern + '```\n');
            await message.client.sendMessage(message.jid,{text: mesaj});
        }
    } else {
        if (match.length < 2) {
            return await message.client.sendMessage(message.jid,{text: "Wrong format" + ' ```.filter "input" "output"'});
        }
        await FilterDb.setFilter(message.jid, match[0].replace(/['"“]+/g, ''), match[1].replace(/['"“]+/g, '').replace(/[#]+/g, '\n'), match[0][0] === "'" ? true : false);
        await message.client.sendMessage(message.jid,{text: "Successfully set "+match[0].replace(/['"]+/g, '')});
    }
}));
Module({pattern: 'stop ?(.*)', fromMe: true, desc: "Deletes a filter", dontAddCommandList: true}, (async (message, match) => {
    match = match[1].match(/[\'\"\“](.*?)[\'\"\“]/gsm);
    if (match === null) {
        return await message.client.sendMessage(message.jid,{text:"Wrong format!" + '\n*Example:* ```.stop "hello"```'})
    }

    del = await FilterDb.deleteFilter(message.jid, match[0].replace(/['"“]+/g, ''));
    
    if (!del) {
        await message.client.sendMessage(message.jid,{text: "There are already no filters like this ❌"})
    } else {
        await message.client.sendMessage(message.jid,{text:"_Successfully deleted filter ✅_"})
    }
}));
Module({on: 'text', fromMe: false}, (async (message, match) => {
    if (message.fromMe) return;
    var filtreler = await FilterDb.getFilter(message.jid);
    if (!filtreler) return; 
    filtreler.map(
        async (filter) => {
            pattern = new RegExp(filter.dataValues.regex ? filter.dataValues.pattern : ('\\b(' + filter.dataValues.pattern + ')\\b'), 'gm');
            if (pattern.test(message.message)) {
                await message.client.sendMessage(message.jid,{text: filter.dataValues.text}, {quoted: message.data});
            }
        }
    );
}));
Module({on: 'button', fromMe: false}, (async (message, match) => {
    if (message.fromMe) return;
    if (!message.button) return;
    var filtreler = await FilterDb.getFilter(message.jid);
    if (!filtreler) return; 
    filtreler.map(
        async (filter) => {
            pattern = new RegExp(filter.dataValues.regex ? filter.dataValues.pattern : ('\\b(' + filter.dataValues.pattern + ')\\b'), 'gm');
            if (pattern.test(message.data.message.buttonsResponseMessage.selectedDisplayText)) {
                await message.client.sendMessage(message.jid,{text: filter.dataValues.text}, {quoted: message.data});
            }
        }
    );
}));
