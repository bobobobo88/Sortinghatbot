const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedBuilderUtil = require('../utils/embedBuilder');
const PermissionChecker = require('../utils/permissionChecker');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('viewroles')
        .setDescription('List all currently configured vanity roles')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        try {
            // Validate permissions
            const permissionCheck = PermissionChecker.validateUserPermissions(interaction.member);

            if (!permissionCheck.success) {
                return interaction.reply({
                    content: permissionCheck.message,
                    ephemeral: true
                });
            }

            const embed = EmbedBuilderUtil.createRoleListEmbed();

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });

        } catch (error) {
            console.error('Error in viewroles command:', error);
            await interaction.reply({
                content: 'An error occurred while fetching the role list.',
                ephemeral: true
            });
        }
    }
}; 