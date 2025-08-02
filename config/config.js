const fs = require('fs');
const path = require('path');

class Config {
    constructor() {
        this.configPath = path.join(__dirname, '../data/config.json');
        this.rolesPath = path.join(__dirname, '../data/roles.json');
        this.ensureDataDirectory();
        this.loadConfig();
        this.loadRoles();
    }

    ensureDataDirectory() {
        const dataDir = path.join(__dirname, '../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
    }

    loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            } else {
                this.config = {
                    messageId: null,
                    channelId: null,
                    embedTitle: 'Select Your Vanity Roles!',
                    embedDescription: 'Click the buttons below to assign yourself your desired roles. You can select or deselect roles at any time.',
                    embedColor: 0x5865F2
                };
                this.saveConfig();
            }
        } catch (error) {
            console.error('Error loading config:', error);
            this.config = {
                messageId: null,
                channelId: null,
                embedTitle: 'Select Your Vanity Roles!',
                embedDescription: 'Click the buttons below to assign yourself your desired roles. You can select or deselect roles at any time.',
                embedColor: 0x5865F2
            };
        }
    }

    saveConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
        } catch (error) {
            console.error('Error saving config:', error);
        }
    }

    loadRoles() {
        try {
            if (fs.existsSync(this.rolesPath)) {
                this.roles = JSON.parse(fs.readFileSync(this.rolesPath, 'utf8'));
            } else {
                this.roles = {};
                this.saveRoles();
            }
        } catch (error) {
            console.error('Error loading roles:', error);
            this.roles = {};
        }
    }

    saveRoles() {
        try {
            fs.writeFileSync(this.rolesPath, JSON.stringify(this.roles, null, 2));
        } catch (error) {
            console.error('Error saving roles:', error);
        }
    }

    getConfig() {
        return this.config;
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.saveConfig();
    }

    getRoles() {
        return this.roles;
    }

    addRole(roleId, label, emoji = '') {
        this.roles[roleId] = { label, emoji };
        this.saveRoles();
    }

    removeRole(roleId) {
        delete this.roles[roleId];
        this.saveRoles();
    }

    getRole(roleId) {
        return this.roles[roleId];
    }

    hasRole(roleId) {
        return this.roles.hasOwnProperty(roleId);
    }
}

module.exports = new Config(); 