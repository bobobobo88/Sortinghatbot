const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedBuilderUtil = require('../utils/embedBuilder');
const PermissionChecker = require('../utils/permissionChecker');
const RoleManager = require('../utils/roleManager');
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

            // Validate permissions
            const permissionCheck = PermissionChecker.validateRoleOperation(
                interaction.member,
                interaction.guild.members.me
            );

            if (!permissionCheck.success) {
                return interaction.reply({
                    content: permissionCheck.message,
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
            const updateResult = await RoleManager.updateRoleMessage(interaction.guild);

            if (updateResult.success) {
                await interaction.reply({
                    content: `Role ${role.name} has been removed from the role selection message!`,
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: `Role ${role.name} has been removed, but I couldn't update the existing message. Please run /setup to recreate it.`,
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
    }
}; 