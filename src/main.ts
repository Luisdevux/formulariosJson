import './style.css';

const cep = document.querySelector<HTMLInputElement>("#cep")!;
const logradouro = document.querySelector<HTMLInputElement>("#logradouro")!;
const numero = document.querySelector<HTMLInputElement>("#numero")!;
const bairro = document.querySelector<HTMLInputElement>("#bairro")!;
const cidade = document.querySelector<HTMLSelectElement>("#cidade")!;
const estado = document.querySelector<HTMLSelectElement>("#estado")!;

// Função para limpar campos
function limparFormulario() {
  logradouro.value = '';
  numero.value = '';
  bairro.value = '';
  cidade.innerHTML = '<option value="">Selecione uma Cidade</option>';
  estado.innerHTML = '<option value="">Selecione um Estado</option>';
}

// Carregar estados
async function obterEstados() {
  const resultado = await fetch(`https://brasilapi.com.br/api/ibge/uf/v1`);
  return await resultado.json();
}

async function preencherEstados() {
  const listaEstados = await obterEstados();
  listaEstados.forEach((uf: { sigla: string; nome: string }) => {
    const option = document.createElement("option");
    option.value = uf.sigla;
    option.textContent = uf.nome;
    estado.appendChild(option);
  });
}

// Obter cidades por estado
async function obterCidades(uf: string) {
  const resultado = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`);
  return await resultado.json();
}

async function preencherCidades(uf: string) {
  const listaCidades = await obterCidades(uf);
  cidade.innerHTML = '<option value="">Selecione uma Cidade</option>';
  listaCidades.forEach((c: { nome: string }) => {
    const option = document.createElement("option");
    option.value = c.nome;
    option.textContent = c.nome;
    cidade.appendChild(option);
  });
}

// Consultar CEP
async function consultarCep() {
  const valorCep = cep.value.replace(/\D/g, '');
  if (!valorCep) return;

  try {
    const resultado = await fetch(`https://brasilapi.com.br/api/cep/v1/${valorCep}`);
    if (!resultado.ok) throw new Error("CEP inválido");

    const body = await resultado.json();
    logradouro.value = body.street;
    bairro.value = body.neighborhood;
    numero.focus();

    estado.value = body.state;
    await preencherCidades(body.state);
    cidade.value = body.city;

  } catch (err) {
    alert("Erro ao buscar CEP.");
    console.error(err);
  }
}

cep.addEventListener("blur", consultarCep);

estado.addEventListener("change", async () => {
  const uf = estado.value;
  if (uf) {
    await preencherCidades(uf);
  }
});

limparFormulario();
preencherEstados();