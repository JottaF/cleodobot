function getDate() {
  // Cria um novo objeto Date com a data e hora atuais
  const today = new Date();

  // Utiliza Intl.DateTimeFormat para formatar a data diretamente no formato desejado
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("pt-BR", options).format(today);

  return formattedDate;
}

function salesMessage(message) {
  const str = message;

  // Separar a string em linhas
  const lines = str.split("\n");

  // Extrair o nome após "!vendas"
  const header = lines[0].split(" ");
  const name = header[1];

  // Função para extrair a quantidade e o nome do produto
  function extractProductInfo(line) {
    const parts = line.split(" ");
    const quantity = parseInt(parts[0], 10);
    const product = parts.slice(1).join(" ");
    return { quantity, product };
  }

  // Extrair as informações dos produtos
  const products = lines.slice(1).map(extractProductInfo);

  // Estruturar resultados
  const sheet = [];
  products.forEach((product) => {
    sheet.push([getDate(), name, product.product, product.quantity]);
  });

  return sheet;
}
function expenseMessage(message) {
  const str = message;

  // Separar a string em linhas
  const lines = str.split("\n");

  // Estruturar resultados
  const sheet = [getDate(), parseFloat(lines[1]), lines[2], lines[3]];

  return sheet;
}

module.exports = { salesMessage, expenseMessage };
