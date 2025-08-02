const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config/config');

class EmbedBuilderUtil {
    static createRoleSelectionEmbed() {
        const configData = config.getConfig();
        const roles = config.getRoles();
        
        const embed = new EmbedBuilder()
            .setTitle(configData.embedTitle)
            .setDescription(configData.embedDescription)
            .setColor(configData.embedColor)
            .setTimestamp()
            .setFooter({ text: 'Click buttons to assign/remove roles' });

        // Add role list to description if there are roles
        if (Object.keys(roles).length > 0) {
            const roleList = Object.entries(roles)
                .map(([roleId, roleData]) => {
                    const emoji = roleData.emoji ? `${roleData.emoji} ` : '';
                    return `• ${emoji}${roleData.label}`;
                })
                .join('\n');
            
            embed.addFields({
                name: 'Available Roles',
                value: roleList,
                inline: false
            });
        }

        return embed;
    }

    static createActionRows() {
        const roles = config.getRoles();
        const actionRows = [];
        let currentRow = new ActionRowBuilder();
        let buttonCount = 0;

        for (const [roleId, roleData] of Object.entries(roles)) {
            const button = new ButtonBuilder()
                .setCustomId(`role_${roleId}`)
                .setLabel(roleData.label)
                .setStyle(ButtonStyle.Primary);

            if (roleData.emoji) {
                button.setEmoji(roleData.emoji);
            }

            currentRow.addComponents(button);
            buttonCount++;

            // Discord allows max 5 buttons per row
            if (buttonCount % 5 === 0) {
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

    static createSuccessEmbed(roleName, action) {
        const embed = new EmbedBuilder()
            .setTitle('Role Updated!')
            .setDescription(`You have been ${action} the **${roleName}** role.`)
            .setColor(0x57F287) // Green color
            .setTimestamp();

        return embed;
    }

    static createErrorEmbed(message) {
        const embed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(message)
            .setColor(0xED4245) // Red color
            .setTimestamp();

        return embed;
    }

    static createRoleListEmbed() {
        const roles = config.getRoles();
        
        if (Object.keys(roles).length === 0) {
            return new EmbedBuilder()
                .setTitle('No Roles Configured')
                .setDescription('No vanity roles have been configured yet. Use `/addrole` to add roles.')
                .setColor(0x5865F2)
                .setTimestamp();
        }

        const embed = new EmbedBuilder()
            .setTitle('Configured Vanity Roles')
            .setColor(0x5865F2)
            .setTimestamp();

        const roleList = Object.entries(roles)
            .map(([roleId, roleData]) => {
                const emoji = roleData.emoji ? `${roleData.emoji} ` : '';
                return `• ${emoji}**${roleData.label}** (ID: ${roleId})`;
            })
            .join('\n');

        embed.setDescription(roleList);

        return embed;
    }
}

module.exports = EmbedBuilderUtil; 