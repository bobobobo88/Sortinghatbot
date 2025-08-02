const fs = require('fs');
const path = require('path');

class CommandHandler {
    constructor() {
        this.commands = new Map();
    }

    loadCommands() {
        const commandsPath = path.join(__dirname, '../commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            
            if ('data' in command && 'execute' in command) {
                this.commands.set(command.data.name, command);
                console.log(`Loaded command: ${command.data.name}`);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }

        return this.commands;
    }

    getCommands() {
        return this.commands;
    }

    getCommand(name) {
        return this.commands.get(name);
    }
}

module.exports = CommandHandler; 