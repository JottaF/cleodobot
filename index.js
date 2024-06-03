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
  if (message.body.includes("!ajuda")) {
    message.reply(
      "*Registro de vendas*\nPara registrar vendas digite !venda seguido do nome da vendedora, nas linhas seguintes digite a quantidade e o código do produto vendido, aqui estão os código:\n- bu - Brigadeiro unitário\n- cx4 - Caixinha de 4 brigs\n- cx6 - Caixinha de 6\n- cx12 - Caixinha de 12\n- cxe - Caixa especial\n- ts - Torta salgada\n- td - Torta doce\n\nUm exemplo de como fazer:\n!venda Paula\n2 cx4\n3 ts\n1 bu\n\n*Registro de despesa*\nPara registrar uma despesa use o comando !despesa e nas próximas linhas descreva o valor gasto, uma descrição básica do que foi comprado e a origem do dinheiro. A origem pode ser: Produção, Líquido, Lp (Líquido + produção), Comissão, Total bruto ou Reserva.\nAbaixo há um exemplo de despesa:\n\n!despesa\n17.55\nCompra de itens para torta\nProdução\n\nO valor sempre deve usar *.* para fazer a separação, não use *,*"
    );
  }
  // Registro de vendas
  else if (message.body.includes("!venda") && message.body[0] == '!') {
    const data = salesMessage(message.body);
    let lastRow = await getLastRow("A");
    data.forEach(async (line) => {
      lastRow++;
      await writeToSalesSheet(line, lastRow);
    });

    message.reply("Ok, venda registrada!🥳🤑💹");
  }
  // Registro de despesas
  else if (message.body.includes("!despesa") && message.body[0] == '!') {
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
