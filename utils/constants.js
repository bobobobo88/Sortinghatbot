/**
 * Bot configuration constants
 */
module.exports = {
    // Embed colors
    COLORS: {
        PRIMARY: 0x5865F2,    // Discord blue
        SUCCESS: 0x57F287,    // Green
        ERROR: 0xED4245,      // Red
        WARNING: 0xFAA61A     // Orange
    },

    // Default embed settings
    EMBED_DEFAULTS: {
        TITLE: 'Select Your Vanity Roles!',
        DESCRIPTION: 'Click the buttons below to assign yourself your desired roles. You can select or deselect roles at any time.',
        FOOTER: 'Click buttons to assign/remove roles'
    },

    // Button configuration
    BUTTONS: {
        MAX_PER_ROW: 5,
        STYLE: 'PRIMARY'
    },

    // Error messages
    ERRORS: {
        PERMISSION_DENIED: 'You need the "Manage Roles" permission to use this command.',
        BOT_PERMISSION_DENIED: 'I need the "Manage Roles" permission to manage role assignments.',
        ROLE_HIERARCHY: 'I cannot manage this role because it is higher than my highest role.',
        ROLE_NOT_FOUND: 'Role not found. It may have been deleted.',
        ROLE_NOT_CONFIGURED: 'This role is not configured in the role selection system.',
        ROLE_ALREADY_CONFIGURED: 'The role is already configured.',
        ROLE_NOT_CONFIGURED_FOR_REMOVAL: 'The role is not configured in the role selection system.',
        MESSAGE_UPDATE_FAILED: 'Failed to update role selection message. Please run /setup to recreate it.',
        ROLE_MANAGEMENT_FAILED: 'Failed to manage role. Please contact an administrator.',
        GENERAL_ERROR: 'An error occurred while processing your request.',
        COMMAND_ERROR: 'There was an error while executing this command!'
    },

    // Success messages
    SUCCESS: {
        ROLE_ADDED: 'Role has been added to the role selection message!',
        ROLE_REMOVED: 'Role has been removed from the role selection message!',
        ROLE_ASSIGNED: 'You have been assigned the role!',
        ROLE_REMOVED_FROM_USER: 'You have been removed from the role!',
        MESSAGE_CREATED: 'Role selection message has been created!',
        MESSAGE_UPDATED: 'Role selection message updated successfully.'
    },

    // File paths
    PATHS: {
        DATA_DIR: '../data',
        CONFIG_FILE: '../data/config.json',
        ROLES_FILE: '../data/roles.json'
    },

    // Custom IDs
    CUSTOM_IDS: {
        ROLE_BUTTON_PREFIX: 'role_'
    }
}; 