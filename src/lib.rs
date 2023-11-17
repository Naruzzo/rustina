pub mod functions;
pub mod hooks;
pub mod utils;

use teloxide::{
    dispatching::{UpdateFilterExt, UpdateHandler},
    prelude::*,
    utils::command::BotCommands,
};

#[derive(BotCommands, Clone, Debug)]
#[command(rename_rule = "lowercase", parse_with = "split")]
#[command(description = "These are the commands that I can understand:")]
pub enum Command {
    /// List existing commands
    Help,

    /// Starting point of the bot
    Start,

    /// Rules of our chat
    Rules,

    /// About the bot
    About,

    /// Available groups
    Groups,

    /// Latest version
    Latest,

    /// Specific version
    Version,

    /// Report offtopic
    Off,
}

pub fn handler() -> UpdateHandler<Box<dyn std::error::Error + Send + Sync + 'static>> {
    dptree::entry()
        // Inline Queries
        .branch(Update::filter_inline_query().endpoint(functions::inline))
        // Callbacks
        .branch(Update::filter_callback_query().endpoint(functions::callback))
        // Commands
        .branch(
            Update::filter_message()
                .filter_command::<Command>()
                .endpoint(functions::commands),
        )
        .branch(Update::filter_message().endpoint(functions::triggers))
}
