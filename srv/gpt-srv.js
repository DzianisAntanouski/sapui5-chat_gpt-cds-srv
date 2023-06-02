const cds = require("@sap/cds");
const openai = require("./openai.js")

const GPTService = function (srv) {

    srv.on("sendMessage", async ({ data: { Message, sessionId } }) => {

        try {
            const aIDs = await SELECT.from("DB_MESSAGE").columns(`ID`);
            const nNewId = aIDs.map(el => el.ID).sort((a, b) => b - a)[0] + 1;
            const oSession = await SELECT.from("DB_SESSION").where({ ID: sessionId })
            
            const oUserMessage = {
                ID: nNewId,
                Session_ID: sessionId,
                role: 'user',
                content: Message,
                User_ID: oSession[0].User_ID,
                Date: new Date(),
            }

            await INSERT(oUserMessage).into(`DB_MESSAGE`)

            const messages = await SELECT.from("DB_MESSAGE").where({ Session_ID: sessionId }).columns('role', 'content')

            const gptMessage = await openai.chat(messages);

            const oGPTMessage = {
                ID: nNewId + 1,
                Session_ID: sessionId,
                role: gptMessage.role,
                content: gptMessage.content,
                User_ID: oSession[0].User_ID,
                Date: new Date(),
            }

            await INSERT(oGPTMessage).into(`DB_MESSAGE`)
            return `OK`
        } catch (error) {
            console.error(error)
        }

    });
};

module.exports = GPTService;
