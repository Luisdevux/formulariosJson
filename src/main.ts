import './style.css'

const cep = document.querySelector<HTMLInputElement>("#cep")!
const logradouro = document.querySelector<HTMLInputElement>("#logradouro")!
const numero = document.querySelector<HTMLInputElement>("#numero")!
const bairro = document.querySelector<HTMLInputElement>("#bairro")!
const cidade = document.querySelector<HTMLSelectElement>("#cidade")!
const estado = document.querySelector<HTMLSelectElement>("#estado")!

cep.addEventListener('blur', () => {
  consultarCep();
})

function limparFormulario() {
  logradouro.value = '';
  numero.value = '';
  bairro.value = '';
  cidade.innerHTML = '<option value="">Selecione uma Cidade</option>'
  estado.innerHTML = '<option value="">Selecione um Estado</option>';
}

limparFormulario();

async function obterEstados() {
  const resultado = await fetch(`https://brasilapi.com.br/api/ibge/uf/v1`);
  const estados = await resultado.json();
  return estados;
}

const estados = document.querySelector<HTMLSelectElement>('#estado');
async function preencherEstados() {
  const listaEstados = await obterEstados();
  listaEstados.forEach((estado: { sigla: string, nome: string | null }) => {
    const option = document.createElement('option');
    option.value = estado.sigla;
    option.textContent = estado.nome;
    estados?.appendChild(option);
  });
  return listaEstados.sigla;
}

async function obterCidades(uf: string) {
  const resultado = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`);
  const cidades = await resultado.json();
  return cidades;
}

const cidades = document.querySelector<HTMLSelectElement>('#cidade');
async function preencherCidades(uf: string) {
  const listaCidades = await obterCidades(uf);

  listaCidades.forEach((cidade: { nome: string }) => {
    const option = document.createElement('option');
    option.value = cidade.nome;
    option.textContent = cidade.nome;
    cidades?.appendChild(option);
  });
}

async function consultarCep() {
  const resultado = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep.value}`);
  const body = await resultado.json();
  limparFormulario();
  numero.focus();
  logradouro.value = body.street;
  bairro.value = body.neighborhood;
  preencherCidades();
  preencherEstados();
}
