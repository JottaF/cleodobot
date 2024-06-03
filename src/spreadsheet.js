// Importa a biblioteca Google APIs
const { google } = require("googleapis");
// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Configura a autenticação para acessar a API do Google Sheets
const auth = new google.auth.GoogleAuth({
  keyFile: "./cleodobot.json", // Caminho para o arquivo de credenciais
  scopes: ["https://www.googleapis.com/auth/spreadsheets"], // Escopos de acesso
});

 // Inicializa a API do Google Sheets com autenticação
 const sheets = google.sheets({ version: "v4", auth });
 const spreadsheetId = process.env.SPREADSHEET_ID; // ID da planilha

async function getLastRow(col) {
  const range = `${col}:${col}`; // Intervalo para ler a coluna A

  // Lê os dados da coluna A para encontrar a última linha ocupada
  const getResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = getResponse.data.values;
  const lastRow = rows ? rows.length : 0; // Determina a última linha ocupada

  return lastRow;
}

async function writeOnSheet(col, values, line) {
  try {
    // Configura o intervalo para inserir novos valores
    const newRange = `${col}${line}`;
    const valueInputOption = "USER_ENTERED"; // Opção de entrada de valores
    const resource = { values: [values] }; // Valores a serem inseridos

    // Insere os novos valores na planilha
    const appendResponse = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: newRange,
      valueInputOption,
      resource,
    });

    return appendResponse; // Retorna a resposta da API
  } catch (err) {
    console.log("error", err); // Loga qualquer erro ocorrido
  }
}

// Função assíncrona para escrever dados de vendas
async function writeToSalesSheet(values, line) {
  return await writeOnSheet('A', values, line)
}

// Função assíncrona para escrever dados de despesas
async function writeToExpenseSheet(values, line) {
  return await writeOnSheet('K', values, line)
}

// Função assíncrona para ler dados de uma planilha
async function readSheet(interval) {
  const range = interval; // Intervalo para leitura

  try {
    // Lê os dados da planilha no intervalo especificado
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values; // Obtém os valores das linhas

    return rows; // Retorna as linhas lidas
  } catch (err) {
    console.log("error", err); // Loga qualquer erro ocorrido
  }
}

// Exporta as funções para serem usadas em outros módulos
module.exports = {
  writeToSalesSheet,
  writeToExpenseSheet,
  readSheet,
  getLastRow,
};
