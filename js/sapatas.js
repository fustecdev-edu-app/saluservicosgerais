/* ===============================
   BANCO GLOBAL DE ORÇAMENTO
================================ */
// Recupera o orçamento armazenado no localStorage ou cria um array vazio
let orcamentoFinal = JSON.parse(localStorage.getItem("orcamentoFinal")) || [];

/* ===============================
   ATUALIZAR CONTADOR DO CARD
================================ */
// Atualiza o número de serviços adicionados no card da página
function atualizarContador() {
  const contador = document.getElementById("contador"); // Pega o span do contador
  if (contador) contador.innerText = orcamentoFinal.length; // Atualiza com o tamanho do array
}
atualizarContador(); // Atualiza ao carregar a página

/* ===============================
   DEFINIR TIPO DE SAPATA AUTOMÁTICO
================================ */
// Seleciona automaticamente o tipo de sapata de acordo com a quantidade de lajes
function definirTipoSapata(qtdLajes) {
  const select = document.getElementById("tipoSapata"); // Pega o select
  if (qtdLajes === 1) select.value = "0.60";
  else if (qtdLajes === 2) select.value = "0.70";
  else if (qtdLajes === 3) select.value = "1.00";
  else select.value = "1.20"; // Para 4 ou mais lajes
}

/* ===============================
   FUNÇÃO PARA ADICIONAR SAPATAS
================================ */
function adicionarSapatas() {
  // Pegando valores dos inputs
  const qtdLajes = parseInt(document.getElementById("qtdLajes").value);
  const qtdSapatas = parseInt(document.getElementById("qtdSapatas").value);
  const valorMaoObra = parseFloat(document.getElementById("valorMaoObra").value);

  // Valida a quantidade de lajes
  if (!qtdLajes || qtdLajes <= 0) {
    alert("Informe a quantidade de lajes.");
    return;
  }

  // Define automaticamente o tipo de sapata
  definirTipoSapata(qtdLajes);
  const tipoSapata = document.getElementById("tipoSapata").value;

  // Valida a quantidade de sapatas
  if (!qtdSapatas || qtdSapatas <= 0) {
    alert("Informe a quantidade de sapatas.");
    return;
  }

  // Valida o valor da mão de obra
  if (isNaN(valorMaoObra) || valorMaoObra < 0) {
    alert("Informe a mão de obra.");
    return;
  }

  /* ===============================
     CÁLCULO DE MATERIAIS
  ================================= */
  let volumePorSapata = 0;

  // Define o volume por sapata de acordo com a dimensão (base x base x altura)
  if (tipoSapata === "0.60") volumePorSapata = 0.60 * 0.60 * 0.25;
  if (tipoSapata === "0.70") volumePorSapata = 0.70 * 0.70 * 0.30;
  if (tipoSapata === "1.00") volumePorSapata = 1.00 * 1.00 * 0.35;
  if (tipoSapata === "1.20") volumePorSapata = 1.20 * 1.20 * 0.40;

  const volumeTotal = volumePorSapata * qtdSapatas; // Volume total de concreto
  const cimento = volumeTotal * 8; // Exemplo: 7 sacos por m³
  const areia = volumeTotal * 0.5; // Areia em m³
  const brita = volumeTotal * 0.7; // Brita em m³
  const totalMaoObra =   valorMaoObra * volumeTotal; // Total da mão de obra
  

  // converte para Real R$
    const valor = totalMaoObra;
const valorFormatado = valor.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});
  /* ===============================
     SALVAR NO ORÇAMENTO GLOBAL
  ================================= */
  orcamentoFinal.push({
    tipo: "Sapatas",
    area: volumeTotal.toFixed(2),
    lajes: qtdLajes,
    dimensao: `${tipoSapata} x ${tipoSapata}`,
    quantidade: qtdSapatas,
    concreto: volumeTotal.toFixed(2),
    cimento: cimento.toFixed(2),
    areia: areia.toFixed(2),
    brita: brita.toFixed(2),
    maoObra: valor.toFixed(2)
  });

  // Salva no localStorage para persistência
  localStorage.setItem("orcamentoFinal", JSON.stringify(orcamentoFinal));

  /* ===============================
     EXIBIR RESULTADO NA PÁGINA
  ================================= */
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML += `
    <p>
      ✔️ Sapatas adicionadas<br>
      Lajes: ${qtdLajes}<br>
      Tipo: ${tipoSapata} x ${tipoSapata}<br>
      Quantidade: ${qtdSapatas}<br>
      Concreto: ${volumeTotal.toFixed(2)} m³<br>
      Cimento: ${cimento.toFixed(2)} sacos<br>
      Areia: ${areia.toFixed(2)} m³<br>
      Brita: ${brita.toFixed(2)} m³<br>
      Mão de obra:  ${valorFormatado}
    </p>
  `;

  // Atualiza o contador de serviços no card
  atualizarContador();

  // Limpa os campos para novo cálculo
  document.getElementById("qtdLajes").value = ""
  document.getElementById("qtdSapatas").value = "";
  document.getElementById("valorMaoObra").value = "";
}

/* ===============================
   ABRIR MODAL DE SERVIÇOS
================================ */
function abrirModal() {
 document.getElementById("resultado").innerHTML=""
  const lista = document.getElementById("listaServicos");
  lista.innerHTML = ""; // Limpa o conteúdo antigo

  if (orcamentoFinal.length === 0) {
    lista.innerHTML = "<p>Nenhum serviço adicionado.</p>";
  } else {
    // Ordem fixa de exibição
    const ordemServicos = [
      "Sapatas",
      "Alvenaria Dobrada",
      "Vigas Baldrame",
      "Alvenaria Singela",
      "Pilares",
      "Cinta",
      "Laje",
      "Chapisco",
      "Reboco",
      "Contra-Piso",
      "Piso",
      "Assentamento de Cerâmica",
      "Pintura"
    ];

    // Percorre cada tipo de serviço na ordem
    
    ordemServicos.forEach(tipo => {
      // Filtra os serviços desse tipo
      const servicosDoTipo = orcamentoFinal.filter(s => s.tipo === tipo);
    
      servicosDoTipo.forEach(servico => {
        let materias = "";

        // Monta a lista de materiais conforme tipo de serviço
        if (tipo === "Sapatas") {
          materias = `
            Dimensão: ${servico.dimensao || "0 x 0"}<br>
            Quantidade: ${servico.quantidade || 0}<br>
            Concreto: ${servico.concreto || 0} m³<br>
            Cimento: ${servico.cimento || 0} sacos<br>
            Areia: ${servico.areia || 0} m³<br>
            Brita: ${servico.brita || 0} m³
          `;
        }else if (servico.tipo === "Pintura") {
          materias = `
          Tinta: ${servico.tinta} latas (18L)<br>
          Massa corrida: ${servico.massa} latas (18L)<br>
          Selador: ${servico.selador} latas (18L)
          `;
        } else if (tipo === "Alvenaria Dobrada" || tipo === "Alvenaria Singela") {
          materias = `
            Blocos: ${servico.blocos || 0} unidades<br>
            Cimento: ${servico.cimento || 0} sacos<br>
            Cal: ${servico.cal || 0} sacos<br>
            Areia: ${servico.areia || 0} m³
          `;
        }else if (tipo === "Reboco") {
          materias = `
          Dimensão: ${servico.dimensao}<br>
          Cimento: ${servico.cimento} sacos<br>
          Cal: ${servico.cal} sacos<br>
          Areia: ${servico.areia} m³
          `;
        } else if (tipo === "Chapisco") {
           materias = `
            Cimento: ${servico.cimento} sacos<br>
            Areia: ${servico.areia} m³
          `;
        } else if (tipo === "Assentamento de Cerâmica") {
          materias = `
            Cerâmica: ${servico.ceramica || 0} m²<br>
            Argamassa: ${servico.argamassa || 0} kg<br>
            Rejunte: ${servico.rejunte || 0} kg
          `;
        }else if("Vigas Baldrame"){
            materias = `
            Dimensão: ${servico.dimensao || "0 x 0"}<br>
            Quantidade: ${servico.quantidade || 0}<br>
            Concreto: ${servico.concreto || 0} m³<br>
            Cimento: ${servico.cimento || 0} sacos<br>
            Areia: ${servico.areia || 0} m³<br>
            Brita: ${servico.brita || 0} m³
          `

        }else if("cinta"){
            materias = `
            Dimensão: ${servico.dimensao || "0 x 0"}<br>
            Quantidade: ${servico.quantidade || 0}<br>
            Concreto: ${servico.concreto || 0} m³<br>
            Cimento: ${servico.cimento || 0} sacos<br>
            Areia: ${servico.areia || 0} m³<br>
            Brita: ${servico.brita || 0} m³
          `

        }
         else if (["Vigas Baldrame","Pilares","Laje","Contra-Piso","Piso"].includes(tipo)) {
          materias = `
            Concreto: ${servico.concreto || 0} m³<br>
            Cimento: ${servico.cimento || 0} sacos<br>
            Areia: ${servico.areia || 0} m³<br>
            Brita: ${servico.brita || 0} m³
          `;
        }
        
      
        // Adiciona o serviço no modal
        lista.innerHTML += `
          <p>
            <strong>${tipo}</strong><br>
            Área: ${servico.area || 0} m²<br>
            ${materias}<br>
            Mão de obra: R$ ${servico.maoObra || 0}
          </p>
          <hr>
        `;
      });
    });
  }

  // Exibe o modal
  document.getElementById("modal").style.display = "block";
}

/* ===============================
   FECHAR MODAL
================================ */
function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

/* ===============================
   FECHAR MODAL AO CLICAR FORA
================================ */
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    fecharModal();
  }
};
/* ===============================
   CONTINUAR ORÇAMENTO (VOLTAR PARA SERVIÇOS)
================================ */
// Redireciona o usuário para a página de serviços
function continuarOrcamento() {
  // Apenas redireciona para a página servicos.html
  // Os dados já estão salvos no localStorage e serão mantidos
  window.location.href = "servicos.html";
}