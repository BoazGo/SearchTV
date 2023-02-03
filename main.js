require('dotenv').config();
const translate = require('@iamtraction/google-translate')
const { Client, GatewayIntentBits, messageLink } = require('discord.js');
const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
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

        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Can you find me the plot of this series or movie: ${message.content}`,
            // prompt: `say hi`,
            max_tokens: 1000,
        })

        translate(`${gptResponse.data.choices[0].text}`, { to: 'hebrew' }).then(res => {
            message.reply("```" + res.text + "```");
            console.log(res.text);
        }).catch(err => {
            console.error(err);
        });

        // message.reply(`${gptResponse.data.choices[0].text}`)
    } catch(err) {
        console.log(err)
    }
})

client.login(process.env.DISCORD_TOKEN);