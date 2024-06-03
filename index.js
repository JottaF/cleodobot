const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const {
  readSheet,
  writeToSalesSheet,
  writeToExpenseSheet,
  getLastRow,
} = require("./src/spreadsheet");

const { salesMessage, expenseMessage } = require("./src/messagesFuntions");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("message_create", async (message) => {
  // Registro de vendas
  if (message.body.includes("!vendas")) {
    const data = salesMessage(message.body);
    let lastRow = await getLastRow("A");
    data.forEach(async (line) => {
      lastRow++;
      await writeToSalesSheet(line, lastRow);
    });

    message.reply("Ok, venda registrada!🥳🤑💹");
  } else if (message.body.includes("!despesa")) {
    const data = expenseMessage(message.body);
    let lastRow = await getLastRow("K");
    await writeToExpenseSheet(data, lastRow + 1);
    message.reply("Despesa registrada!!🥸🧐💸");
  }
});

client.initialize();

// (async () => {
//   const message =
//     "!vendas Paula\n1 torta doce\n2 caixa 4\n3 caixa 6\n2 caixa 12";
//   const data = salesMessage(message);
//   let lastRow = await getLastRow();
//   data.forEach(async (line) => {
//     lastRow++;
//     await writeToSalesSheet(line, lastRow);
//   });

//   console.log("Ok, venda registrada!🥳🥳");
// })();
