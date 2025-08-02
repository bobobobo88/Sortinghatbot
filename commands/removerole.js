const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedBuilderUtil = require('../utils/embedBuilder');
const config = require('../config/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removerole')
        .setDescription('Remove a role button from the role selection message')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to remove')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        try {
            const role = interaction.options.getRole('role');

            // Check if user has permission to manage roles
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                return interaction.reply({
                    content: 'You need the "Manage Roles" permission to use this command.',
                    ephemeral: true
                });
            }

            // Check if role is configured
            if (!config.hasRole(role.id)) {
                return interaction.reply({
                    content: `The role ${role.name} is not configured in the role selection system.`,
                    ephemeral: true
                });
            }

            // Remove the role from configuration
            config.removeRole(role.id);

            // Update the existing message if it exists
            const configData = config.getConfig();
            if (configData.messageId && configData.channelId) {
                try {
                    const channel = await interaction.guild.channels.fetch(configData.channelId);
                    const message = await channel.messages.fetch(configData.messageId);

                    const embed = EmbedBuilderUtil.createRoleSelectionEmbed();
                    const actionRows = EmbedBuilderUtil.createActionRows();

                    await message.edit({
                        embeds: [embed],
                        components: actionRows
                    });

                    await interaction.reply({
                        content: `Role ${role.name} has been removed from the role selection message!`,
                        ephemeral: true
                    });
                } catch (error) {
                    console.error('Error updating message:', error);
                    await interaction.reply({
                        content: `Role ${role.name} has been removed, but I couldn't update the existing message. Please run /setup to recreate it.`,
                        ephemeral: true
                    });
                }
            } else {
                await interaction.reply({
                    content: `Role ${role.name} has been removed from the configuration!`,
                    ephemeral: true
                });
            }

        } catch (error) {
            console.error('Error in removerole command:', error);
            await interaction.reply({
                content: 'An error occurred while removing the role.',
                ephemeral: true
            });
        }
    },
}; 