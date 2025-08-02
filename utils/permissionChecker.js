const { PermissionFlagsBits } = require('discord.js');
const CONSTANTS = require('./constants');

class PermissionChecker {
    /**
     * Checks if a user has the Manage Roles permission
     * @param {GuildMember} member - The guild member to check
     * @returns {boolean} True if user has permission
     */
    static hasManageRolesPermission(member) {
        return member.permissions.has(PermissionFlagsBits.ManageRoles);
    }

    /**
     * Checks if the bot has the Manage Roles permission
     * @param {GuildMember} botMember - The bot's guild member
     * @returns {boolean} True if bot has permission
     */
    static botHasManageRolesPermission(botMember) {
        return botMember.permissions.has(PermissionFlagsBits.ManageRoles);
    }

    /**
     * Checks if the bot can manage a specific role
     * @param {GuildMember} botMember - The bot's guild member
     * @param {Role} role - The role to check
     * @returns {boolean} True if bot can manage the role
     */
    static botCanManageRole(botMember, role) {
        return role.position < botMember.roles.highest.position;
    }

    /**
     * Validates user permissions for admin commands
     * @param {GuildMember} member - The guild member to check
     * @returns {Object} Result object with success and message
     */
    static validateUserPermissions(member) {
        if (!this.hasManageRolesPermission(member)) {
            return {
                success: false,
                message: CONSTANTS.ERRORS.PERMISSION_DENIED
            };
        }
        return { success: true };
    }

    /**
     * Validates bot permissions for role management
     * @param {GuildMember} botMember - The bot's guild member
     * @returns {Object} Result object with success and message
     */
    static validateBotPermissions(botMember) {
        if (!this.botHasManageRolesPermission(botMember)) {
            return {
                success: false,
                message: CONSTANTS.ERRORS.BOT_PERMISSION_DENIED
            };
        }
        return { success: true };
    }

    /**
     * Validates if bot can manage a specific role
     * @param {GuildMember} botMember - The bot's guild member
     * @param {Role} role - The role to check
     * @returns {Object} Result object with success and message
     */
    static validateRoleManagement(botMember, role) {
        if (!this.botCanManageRole(botMember, role)) {
            return {
                success: false,
                message: CONSTANTS.ERRORS.ROLE_HIERARCHY
            };
        }
        return { success: true };
    }

    /**
     * Comprehensive permission check for role operations
     * @param {GuildMember} member - The user's guild member
     * @param {GuildMember} botMember - The bot's guild member
     * @param {Role} role - The role to manage (optional)
     * @returns {Object} Result object with success and message
     */
    static validateRoleOperation(member, botMember, role = null) {
        // Check user permissions
        const userCheck = this.validateUserPermissions(member);
        if (!userCheck.success) {
            return userCheck;
        }

        // Check bot permissions
        const botCheck = this.validateBotPermissions(botMember);
        if (!botCheck.success) {
            return botCheck;
        }

        // Check role hierarchy if role is provided
        if (role) {
            const roleCheck = this.validateRoleManagement(botMember, role);
            if (!roleCheck.success) {
                return roleCheck;
            }
        }

        return { success: true };
    }
}

module.exports = PermissionChecker; 