require('dotenv').config();

const translate = require('@iamtraction/google-translate')

const { Client, GatewayIntentBits, messageLink, userMention } = require('discord.js');

const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
]})


client.once('ready', () => {
    console.log('SearchDescription is now online!!')
})

const { Configuration , OpenAIApi } = require('openai');
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

client.on('messageCreate', async function(message){
    try {
        if(message.author.bot) return;
        
        console.log("User:" + " " + message.content);
        
        const thinkingmsg = await message.channel.send("מחשב...");
        console.log("SearchDesciption: Thinking...");

        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Can you find me the plot of this series or movie: ${message.content}`,
            // prompt: `say hi`,
            max_tokens: 1000,
        })

        translate(`${gptResponse.data.choices[0].text}`, { to: 'hebrew' }).then(res => {
            
            thinkingmsg.edit("**__SearchDescription Response in Hebrew__**" + "```" + res.text + "```" + "**__SearchDescription Response in English__**" + "```" + `${gptResponse.data.choices[0].text}` + "```");
            thinkingmsg.react("👍");
            thinkingmsg.react("👎");

            console.log("  ");
            console.log("  ");
            console.log("gptResponse (in English):" + " " + `${gptResponse.data.choices[0].text}`);

        }).catch(err => {
            console.error(err);
        });

        // message.reply(`${gptResponse.data.choices[0].text}`)
    } catch(err) {
        console.log(err)
    }
})

client.login(process.env.DISCORD_TOKEN);