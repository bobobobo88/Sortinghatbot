const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config/config');
const CONSTANTS = require('./constants');

class EmbedBuilderUtil {
    /**
     * Creates the main role selection embed
     * @returns {EmbedBuilder} The role selection embed
     */
    static createRoleSelectionEmbed() {
        const configData = config.getConfig();
        const roles = config.getRoles();
        
        const embed = new EmbedBuilder()
            .setTitle(configData.embedTitle)
            .setDescription(configData.embedDescription)
            .setColor(configData.embedColor)
            .setTimestamp()
            .setFooter({ text: CONSTANTS.EMBED_DEFAULTS.FOOTER });

        this.addRoleListToEmbed(embed, roles);
        return embed;
    }

    /**
     * Adds role list to the embed if roles exist
     * @param {EmbedBuilder} embed - The embed to add roles to
     * @param {Object} roles - The roles object
     */
    static addRoleListToEmbed(embed, roles) {
        if (Object.keys(roles).length > 0) {
            const roleList = this.formatRoleList(roles);
            embed.addFields({
                name: 'Available Roles',
                value: roleList,
                inline: false
            });
        }
    }

    /**
     * Formats role list for display
     * @param {Object} roles - The roles object
     * @returns {string} Formatted role list
     */
    static formatRoleList(roles) {
        return Object.entries(roles)
            .map(([roleId, roleData]) => {
                const emoji = roleData.emoji ? `${roleData.emoji} ` : '';
                return `• ${emoji}${roleData.label}`;
            })
            .join('\n');
    }

    /**
     * Creates action rows with role buttons
     * @returns {ActionRowBuilder[]} Array of action rows
     */
    static createActionRows() {
        const roles = config.getRoles();
        const actionRows = [];
        let currentRow = new ActionRowBuilder();
        let buttonCount = 0;

        for (const [roleId, roleData] of Object.entries(roles)) {
            const button = this.createRoleButton(roleId, roleData);
            currentRow.addComponents(button);
            buttonCount++;

            // Discord allows max buttons per row
            if (buttonCount % CONSTANTS.BUTTONS.MAX_PER_ROW === 0) {
                actionRows.push(currentRow);
                currentRow = new ActionRowBuilder();
            }
        }

        // Add the last row if it has buttons
        if (currentRow.components.length > 0) {
            actionRows.push(currentRow);
        }

        return actionRows;
    }

    /**
     * Creates a single role button
     * @param {string} roleId - The role ID
     * @param {Object} roleData - The role data
     * @returns {ButtonBuilder} The button component
     */
    static createRoleButton(roleId, roleData) {
        const button = new ButtonBuilder()
            .setCustomId(`role_${roleId}`)
            .setLabel(roleData.label)
            .setStyle(ButtonStyle.Primary);

        if (roleData.emoji) {
            button.setEmoji(roleData.emoji);
        }

        return button;
    }

    /**
     * Creates a success embed for role updates
     * @param {string} roleName - The role name
     * @param {string} action - The action performed
     * @returns {EmbedBuilder} Success embed
     */
    static createSuccessEmbed(roleName, action) {
        return new EmbedBuilder()
            .setTitle('Role Updated!')
            .setDescription(`You have been ${action} the **${roleName}** role.`)
            .setColor(CONSTANTS.COLORS.SUCCESS)
            .setTimestamp();
    }

    /**
     * Creates an error embed
     * @param {string} message - The error message
     * @returns {EmbedBuilder} Error embed
     */
    static createErrorEmbed(message) {
        return new EmbedBuilder()
            .setTitle('Error')
            .setDescription(message)
            .setColor(CONSTANTS.COLORS.ERROR)
            .setTimestamp();
    }

    /**
     * Creates a role list embed for admin view
     * @returns {EmbedBuilder} Role list embed
     */
    static createRoleListEmbed() {
        const roles = config.getRoles();
        
        if (Object.keys(roles).length === 0) {
            return new EmbedBuilder()
                .setTitle('No Roles Configured')
                .setDescription('No vanity roles have been configured yet. Use `/addrole` to add roles.')
                .setColor(CONSTANTS.COLORS.PRIMARY)
                .setTimestamp();
        }

        const embed = new EmbedBuilder()
            .setTitle('Configured Vanity Roles')
            .setColor(CONSTANTS.COLORS.PRIMARY)
            .setTimestamp();

        const roleList = this.formatRoleListWithIds(roles);
        embed.setDescription(roleList);

        return embed;
    }

    /**
     * Formats role list with IDs for admin view
     * @param {Object} roles - The roles object
     * @returns {string} Formatted role list with IDs
     */
    static formatRoleListWithIds(roles) {
        return Object.entries(roles)
            .map(([roleId, roleData]) => {
                const emoji = roleData.emoji ? `${roleData.emoji} ` : '';
                return `• ${emoji}**${roleData.label}** (ID: ${roleId})`;
            })
            .join('\n');
    }
}

module.exports = EmbedBuilderUtil; 