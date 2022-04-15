
const {Module} = require('../main');
const Config = require('../config');
const got = require('got');
const fs = require('fs');
const Db = require('./sql/plugin');

Module({pattern: 'install ?(.*)', fromMe: true, desc: Lang.INSTALL_DESC, warn: Lang.WARN}, (async (message, match) => {
    if (match[1] === '') return await message.sendMessage(Lang.NEED_URL + '.install https://gist.github.com/souravkl11/example.js')
    try {
        var url = new URL(match[1]);
    } catch {
        return await message.client.sendMessage(message.jid,{text: "Invalid Url ❌"});
    }
    
    if (url.host === 'gist.github.com') {
        url.host = 'gist.githubusercontent.com';
        url = url.toString() + '/raw'
    } else {
        url = url.toString()
    }

    var response = await got(url);
    if (response.statusCode == 200) {
        // plugin adı
        let plugin_name = /pattern: ["'](.*)["'],/g.exec(response.body)
          plugin_name = plugin_name[1].split(" ")[0]
        
        fs.writeFileSync('./plugins/' + plugin_name + '.js', response.body);
        try {
            require('./' + plugin_name);
        } catch (e) {
            fs.unlinkSync('/skl/Raganork/plugins/' + plugin_name + '.js')
            return await message.client.sendMessage(message.jid,{text: "Plugin has errors ❌\n" + e});
    }

        await Db.installPlugin(url, plugin_name);
        await message.client.sendMessage(message.jid,{text: "Plugin installed successfully ✅"});
    }
}));

Module({pattern: 'plugin', fromMe: true, desc: Lang.PLUGIN_DESC }, (async (message, match) => {
    var mesaj = "Plugins you've installed externally";
    var plugins = await Db.PluginDB.findAll();
    if (plugins.length < 1) {
        return await message.client.sendMessage(message.jid,{text: "You haven't installed any external plugins ❌"});
    } else {
        plugins.map(
            (plugin) => {
                mesaj += '*' + plugin.dataValues.name + '* : ' + plugin.dataValues.url + '\n\n';
            }
        );
        return await message.client.sendMessage(message.jid,{text: mesaj});
   }
}));

Module({pattern: 'remove(?: |$)(.*)', fromMe: true, desc: Lang.REMOVE_DESC}, (async (message, match) => {
    if (match[1] === '') return await message.client.sendMessage(message.jid,{text: "Need a plugin name ❌"});
   var plugin = await Db.PluginDB.findAll({ where: {name: match[1]} });
    if (plugin.length < 1) {
        return await message.client.sendMessage(message.jid,{text: "No such plugin found ❌"});
   } else {
        await plugin[0].destroy();
        delete require.cache[require.resolve('./' + match[1] + '.js')]
        fs.unlinkSync('./plugins/' + match[1] + '.js');
        await message.client.sendMessage(message.jid,{text: "Successfully deleted. restart to apply changes"});
   
        await new Promise(r => setTimeout(r, 1000));
        
    }

}));
