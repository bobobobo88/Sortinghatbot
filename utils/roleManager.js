const EmbedBuilderUtil = require('./embedBuilder');
const config = require('../config/config');
const CONSTANTS = require('./constants');

class RoleManager {
    /**
     * Assigns a role to a member
     * @param {GuildMember} member - The member to assign the role to
     * @param {string} roleId - The role ID to assign
     * @returns {Promise<Object>} Result object with success and message
     */
    static async assignRole(member, roleId) {
        try {
            const role = member.guild.roles.cache.get(roleId);
            if (!role) {
                return {
                    success: false,
                    message: CONSTANTS.ERRORS.ROLE_NOT_FOUND
                };
            }

            const roleData = config.getRole(roleId);
            if (!roleData) {
                return {
                    success: false,
                    message: CONSTANTS.ERRORS.ROLE_NOT_CONFIGURED
                };
            }

            await member.roles.add(roleId);
            return {
                success: true,
                message: `You have been assigned the **${roleData.label}** role.`,
                embed: EmbedBuilderUtil.createSuccessEmbed(roleData.label, 'assigned')
            };
        } catch (error) {
            console.error('Error assigning role:', error);
            return {
                success: false,
                message: CONSTANTS.ERRORS.ROLE_MANAGEMENT_FAILED
            };
        }
    }

    /**
     * Removes a role from a member
     * @param {GuildMember} member - The member to remove the role from
     * @param {string} roleId - The role ID to remove
     * @returns {Promise<Object>} Result object with success and message
     */
    static async removeRole(member, roleId) {
        try {
            const role = member.guild.roles.cache.get(roleId);
            if (!role) {
                return {
                    success: false,
                    message: CONSTANTS.ERRORS.ROLE_NOT_FOUND
                };
            }

            const roleData = config.getRole(roleId);
            if (!roleData) {
                return {
                    success: false,
                    message: CONSTANTS.ERRORS.ROLE_NOT_CONFIGURED
                };
            }

            await member.roles.remove(roleId);
            return {
                success: true,
                message: `You have been removed from the **${roleData.label}** role.`,
                embed: EmbedBuilderUtil.createSuccessEmbed(roleData.label, 'removed from')
            };
        } catch (error) {
            console.error('Error removing role:', error);
            return {
                success: false,
                message: CONSTANTS.ERRORS.ROLE_MANAGEMENT_FAILED
            };
        }
    }

    /**
     * Toggles a role for a member (assigns if not present, removes if present)
     * @param {GuildMember} member - The member to toggle the role for
     * @param {string} roleId - The role ID to toggle
     * @returns {Promise<Object>} Result object with success and message
     */
    static async toggleRole(member, roleId) {
        const hasRole = member.roles.cache.has(roleId);
        
        if (hasRole) {
            return await this.removeRole(member, roleId);
        } else {
            return await this.assignRole(member, roleId);
        }
    }

    /**
     * Updates the role selection message
     * @param {Guild} guild - The guild to update the message in
     * @returns {Promise<Object>} Result object with success and message
     */
    static async updateRoleMessage(guild) {
        try {
            const configData = config.getConfig();
            if (!configData.messageId || !configData.channelId) {
                return {
                    success: false,
                    message: CONSTANTS.ERRORS.MESSAGE_UPDATE_FAILED
                };
            }

            const channel = await guild.channels.fetch(configData.channelId);
            const message = await channel.messages.fetch(configData.messageId);

            const embed = EmbedBuilderUtil.createRoleSelectionEmbed();
            const actionRows = EmbedBuilderUtil.createActionRows();

            await message.edit({
                embeds: [embed],
                components: actionRows
            });

            return {
                success: true,
                message: CONSTANTS.SUCCESS.MESSAGE_UPDATED
            };
        } catch (error) {
            console.error('Error updating role message:', error);
            return {
                success: false,
                message: CONSTANTS.ERRORS.MESSAGE_UPDATE_FAILED
            };
        }
    }

    /**
     * Checks if a role exists and is configured
     * @param {Guild} guild - The guild to check in
     * @param {string} roleId - The role ID to check
     * @returns {Object} Result object with success and role data
     */
    static checkRole(guild, roleId) {
        const role = guild.roles.cache.get(roleId);
        if (!role) {
            return {
                success: false,
                message: CONSTANTS.ERRORS.ROLE_NOT_FOUND
            };
        }

        const roleData = config.getRole(roleId);
        if (!roleData) {
            return {
                success: false,
                message: CONSTANTS.ERRORS.ROLE_NOT_CONFIGURED
            };
        }

        return {
            success: true,
            role,
            roleData
        };
    }
}

module.exports = RoleManager; 