const fs = require('fs');
const path = require('path');
const CONSTANTS = require('../utils/constants');

class Config {
    constructor() {
        this.configPath = path.join(__dirname, '../data/config.json');
        this.rolesPath = path.join(__dirname, '../data/roles.json');
        this.ensureDataDirectory();
        this.loadConfig();
        this.loadRoles();
    }

    /**
     * Ensures the data directory exists
     */
    ensureDataDirectory() {
        const dataDir = path.join(__dirname, '../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
    }

    /**
     * Loads configuration from file or creates default
     */
    loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            } else {
                this.config = this.getDefaultConfig();
                this.saveConfig();
            }
        } catch (error) {
            console.error('Error loading config:', error);
            this.config = this.getDefaultConfig();
        }
    }

    /**
     * Gets default configuration
     * @returns {Object} Default configuration
     */
    getDefaultConfig() {
        return {
            messageId: null,
            channelId: null,
            embedTitle: CONSTANTS.EMBED_DEFAULTS.TITLE,
            embedDescription: CONSTANTS.EMBED_DEFAULTS.DESCRIPTION,
            embedColor: CONSTANTS.COLORS.PRIMARY
        };
    }

    /**
     * Saves configuration to file
     */
    saveConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
        } catch (error) {
            console.error('Error saving config:', error);
        }
    }

    /**
     * Loads roles from file or creates empty object
     */
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

    /**
     * Saves roles to file
     */
    saveRoles() {
        try {
            fs.writeFileSync(this.rolesPath, JSON.stringify(this.roles, null, 2));
        } catch (error) {
            console.error('Error saving roles:', error);
        }
    }

    // Configuration methods
    getConfig() {
        return this.config;
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.saveConfig();
    }

    // Role management methods
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

    /**
     * Gets the number of configured roles
     * @returns {number} Number of roles
     */
    getRoleCount() {
        return Object.keys(this.roles).length;
    }

    /**
     * Checks if any roles are configured
     * @returns {boolean} True if roles exist
     */
    hasRoles() {
        return this.getRoleCount() > 0;
    }
}

module.exports = new Config(); 