const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedBuilderUtil = require('../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('viewroles')
        .setDescription('List all currently configured vanity roles')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        try {
            // Check if user has permission to manage roles
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                return interaction.reply({
                    content: 'You need the "Manage Roles" permission to use this command.',
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
    },
}; 