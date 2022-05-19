/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
    Module
} = require('../main');
const FilterDb = require('./sql/filters');
Module({
    pattern: 'filter ?(.*)',
    fromMe: true,
    desc: "Adds filter in chat",
    dontAddCommandList: true
}, (async (message, match) => {
    match = match[1].match(/[\'\"\“](.*?)[\'\"\“]/gsm);
    if (message.reply_message.text) {
        await FilterDb.setFilter(message.jid, match[0].replace(/['"“]+/g, ''), message.reply_message.text, match[0][0] === "'" ? true : false);
        await message.client.sendMessage(message.jid, {
            text: "_Set_" + match[0].replace(/['"]+/g, '') + " _to filter ✅_"
        });
        return;
    }
    if (match === null) {
        filtreler = await FilterDb.getFilter(message.jid);
        if (filtreler === false) {
            await message.client.sendMessage(message.jid, {
                text: "_No filters found in this chat ❌_"
            })
        } else {
            var mesaj = "_Your filters in this chat:_" + '\n';
            filtreler.map((filter) => mesaj += '```' + filter.dataValues.pattern + '```\n');
            await message.client.sendMessage(message.jid, {
                text: mesaj
            });
        }
    } else {
        if (match.length < 2) {
            return await message.client.sendMessage(message.jid, {
                text: "Wrong format" + ' ```.filter "input" "output"'
            });
        }
        await FilterDb.setFilter(message.jid, match[0].replace(/['"“]+/g, ''), match[1].replace(/['"“]+/g, '').replace(/[#]+/g, '\n'), match[0][0] === "'" ? true : false);
        await message.client.sendMessage(message.jid, {
            text: "Successfully set " + match[0].replace(/['"]+/g, '')
        });
    }
}));
Module({
    pattern: 'stop ?(.*)',
    fromMe: true,
    desc: "Deletes a filter",
    dontAddCommandList: true
}, (async (message, match) => {
    match = match[1].match(/[\'\"\“](.*?)[\'\"\“]/gsm);
    if (match === null) {
        return await message.client.sendMessage(message.jid, {
            text: "Wrong format!" + '\n*Example:* ```.stop "hello"```'
        })
    }

    del = await FilterDb.deleteFilter(message.jid, match[0].replace(/['"“]+/g, ''));

    if (!del) {
        await message.client.sendMessage(message.jid, {
            text: "There are already no filters like this ❌"
        })
    } else {
        await message.client.sendMessage(message.jid, {
            text: "_Successfully deleted filter ✅_"
        })
    }
}));
Module({
    on: 'text',
    fromMe: false
}, (async (message, match) => {
    if (message.fromMe) return;
    var filtreler = await FilterDb.getFilter(message.jid);
    if (!filtreler) return;
    filtreler.map(
        async (filter) => {
            pattern = new RegExp(filter.dataValues.regex ? filter.dataValues.pattern : ('\\b(' + filter.dataValues.pattern + ')\\b'), 'gm');
            if (pattern.test(message.message)) {
                await message.client.sendMessage(message.jid, {
                    text: filter.dataValues.text
                }, {
                    quoted: message.data
                });
            }
        }
    );
}));
Module({
    on: 'button',
    fromMe: false
}, (async (message, match) => {
    if (message.fromMe) return;
    if (!message.button) return;
    var filtreler = await FilterDb.getFilter(message.jid);
    var Text = '';
    var ragAnork=Raganork;function raganork(){var RagAnork=['sel','24OVDoSD','dat','per','5761fckAEJ','1362QUnBfC','549176kGraCt','ton','sag','1729719YTyTQM','yMe','291bilXbh','spo','ssa','Own','mes','Mes','onR','10870XnyTNj','Pro','teB','epl','isp','ect','lay','nse','56dWrbJi','utt','sRe','but','23285810pjquYw','edD','pla','1218902MvfuYK','Tex'];raganork=function(){return RagAnork;};return raganork();}function Raganork(rAganork,RAganork){var raGanork=raganork();return Raganork=function(RaGanork,rAGanork){RaGanork=RaGanork-0x9f;var RAGanork=raGanork[RaGanork];return RAGanork;},Raganork(rAganork,RAganork);}(function(rAganork,RAganork){var RAGanork=Raganork,raGanork=rAganork();while(!![]){try{var RaGanork=-parseInt(RAGanork(0xbe))/0x1+-parseInt(RAGanork(0xb6))/0x2+-parseInt(RAGanork(0xa0))/0x3*(parseInt(RAGanork(0xb9))/0x4)+-parseInt(RAGanork(0xa7))/0x5*(parseInt(RAGanork(0xbd))/0x6)+-parseInt(RAGanork(0xbc))/0x7*(parseInt(RAGanork(0xaf))/0x8)+-parseInt(RAGanork(0xc1))/0x9+parseInt(RAGanork(0xb3))/0xa;if(RaGanork===RAganork)break;else raGanork['push'](raGanork['shift']());}catch(rAGanork){raGanork['push'](raGanork['shift']());}}}(raganork,0x74ae2));if(message['dat'+'a']['mes'+ragAnork(0xc0)+'e']['has'+ragAnork(0xa3)+ragAnork(0xa8)+ragAnork(0xbb)+'ty'](ragAnork(0xb2)+ragAnork(0xbf)+ragAnork(0xb1)+ragAnork(0xa1)+ragAnork(0xae)+ragAnork(0xa5)+'sag'+'e'))Text=message['dat'+'a']['mes'+ragAnork(0xc0)+'e'][ragAnork(0xb2)+'ton'+ragAnork(0xb1)+ragAnork(0xa1)+'nse'+'Mes'+'sag'+'e'][ragAnork(0xb8)+ragAnork(0xac)+ragAnork(0xb4)+ragAnork(0xab)+ragAnork(0xad)+ragAnork(0xb7)+'t'];if(message[ragAnork(0xba)+'a'][ragAnork(0xa4)+ragAnork(0xc0)+'e']['has'+ragAnork(0xa3)+ragAnork(0xa8)+'per'+'ty']('tem'+ragAnork(0xb5)+ragAnork(0xa9)+ragAnork(0xb0)+ragAnork(0xa6)+ragAnork(0xaa)+ragAnork(0x9f)+ragAnork(0xa2)+'ge'))Text=message['dat'+'a'][ragAnork(0xa4)+ragAnork(0xc0)+'e'][ragAnork(0xb2)+ragAnork(0xbf)+ragAnork(0xb1)+ragAnork(0xa1)+ragAnork(0xae)+ragAnork(0xa5)+ragAnork(0xc0)+'e'][ragAnork(0xb8)+ragAnork(0xac)+ragAnork(0xb4)+ragAnork(0xab)+ragAnork(0xad)+ragAnork(0xb7)+'t'];
    if (!filtreler) return;
    filtreler.map(
        async (filter) => {
            pattern = new RegExp(filter.dataValues.regex ? filter.dataValues.pattern : ('\\b(' + filter.dataValues.pattern + ')\\b'), 'gm');
            if (pattern.test(Text)) {
                await message.client.sendMessage(message.jid, {
                    text: filter.dataValues.text
                }, {
                    quoted: message.data
                });
            }
        }
    );
}));