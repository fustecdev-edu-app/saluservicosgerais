/* ===============================
   BANCO GLOBAL DE ORÇAMENTO
================================ */
// Pega o orçamento armazenado no localStorage ou cria um array vazio se não existir
let orcamentoFinal = JSON.parse(localStorage.getItem("orcamentoFinal")) || [];

/* ===============================
   ATUALIZAR CONTADOR DO CARD
================================ */
// Mostra o número de serviços adicionados no card
function atualizarContador() {
  const contador = document.getElementById("contador"); // Pega o span do contador
  if (contador) contador.innerText = orcamentoFinal.length; // Atualiza com o tamanho do array
}
atualizarContador(); // Atualiza ao carregar a página

/* ===============================
   FUNÇÃO PARA ADICIONAR ALVENARIA DOBRADA
================================ */
function adicionarAlvenariaDobrada() {
  // Pega os valores dos inputs
  const area = parseFloat(document.getElementById("area").value); // área em m²
  const valorMaoObra = parseFloat(document.getElementById("valorMaoObra").value); // R$/m²

  // Valida a área
  if (!area || area <= 0) {
    alert("Informe a área da alvenaria dobrada.");
    return;
  }

  // Valida a mão de obra
  if (isNaN(valorMaoObra) || valorMaoObra < 0) {
    alert("Informe o valor da mão de obra.");
    return;
  }

  /* ===============================
     CÁLCULO DE MATERIAIS
  ================================= */
  // Exemplo de cálculo: valores aproximados
  const blocos = area * 50;        // Número de blocos (50 blocos/m²)
  const cimento = area * 0.4;      // Sacos de cimento (0,4 saco/m²)
  const cal = area * 0.88;         // Sacos de cal (0,88 saco/m²)
  const areia = area * 0.01;       // Areia em m³
  const maoObraTotal = area * valorMaoObra; // Total da mão de obra
  const valor = maoObraTotal;
  const valorFormatado = valor.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});
 

  /* ===============================
     SALVAR NO ORÇAMENTO GLOBAL
  ================================= */
  orcamentoFinal.push({
    tipo: "Alvenaria Dobrada",   // Tipo do serviço
    area: area.toFixed(2),       // Área em m²
    blocos: blocos.toFixed(0),   // Quantidade de blocos
    cimento: cimento.toFixed(2), // Sacos de cimento
    cal: cal.toFixed(2),         // Sacos de cal
    areia: areia.toFixed(2),     // Areia em m³
    maoObra: maoObraTotal.toFixed(2) // Mão de obra total
  });

  // Salva no localStorage para persistência
  localStorage.setItem("orcamentoFinal", JSON.stringify(orcamentoFinal));

  /* ===============================
     EXIBIR RESULTADO NA PÁGINA
  ================================= */
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML += `
    <p>
      ✔️ Alvenaria Dobrada adicionada<br>
      Área: ${area.toFixed(2)} m²<br>
      Blocos: ${blocos.toFixed(0)} unidades<br>
      Cimento: ${cimento.toFixed(2)} sacos<br>
      Cal: ${cal.toFixed(2)} sacos<br>
      Areia: ${areia.toFixed(2)} m³<br>
      Mão de obra:  ${valorFormatado}
    </p>
  `;

  // Atualiza o contador de serviços no card
  atualizarContador();

  // Limpa os campos para novo cálculo
  document.getElementById("area").value = "";
  document.getElementById("valorMaoObra").value = "";
}

/* ===============================
   ABRIR MODAL DE SERVIÇOS
================================ */
function abrirModal() {
  const lista = document.getElementById("listaServicos");
  lista.innerHTML = ""; // Limpa o modal antes de preencher

  if (orcamentoFinal.length === 0) {
    lista.innerHTML = "<p>Nenhum serviço adicionado.</p>";
  } else {
    // Ordem dos serviços
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

    ordemServicos.forEach(tipo => {
      // Filtra serviços do tipo
      const servicosDoTipo = orcamentoFinal.filter(s => s.tipo === tipo);

      servicosDoTipo.forEach(servico => {
        let materias = "";

        if (tipo === "Alvenaria Dobrada") {
          materias = `
            Blocos: ${servico.blocos}<br>
            Cimento: ${servico.cimento} sacos<br>
            Cal: ${servico.cal} sacos<br>
            Areia: ${servico.areia} m³
          `;
        }else if (servico.tipo === "Pintura") {
          materias = `
          Tinta: ${servico.tinta} latas (18L)<br>
          Massa corrida: ${servico.massa} latas (18L)<br>
          Selador: ${servico.selador} latas (18L)
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
        } else if (tipo === "Sapatas") {
          materias = `
            Dimensão: ${servico.dimensao || "0 x 0"}<br>
            Quantidade: ${servico.quantidade || 0}<br>
            Concreto: ${servico.concreto || 0} m³<br>
            Cimento: ${servico.cimento || 0} sacos<br>
            Areia: ${servico.areia || 0} m³<br>
            Brita: ${servico.brita || 0} m³
          `;
        } else if (tipo === "Cinta") {
          materias = `
            Dimensão: ${servico.dimensao || "0 x 0"}<br>
            Quantidade: ${servico.quantidade || 0}<br>
            Concreto: ${servico.concreto || 0} m³<br>
            Cimento: ${servico.cimento || 0} sacos<br>
            Areia: ${servico.areia || 0} m³<br>
            Brita: ${servico.brita || 0} m³
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

        }

        // Adiciona cada serviço no modal
        lista.innerHTML += `
          <p>
            <strong>${tipo}</strong><br>
            Área: ${servico.area || 0} m²<br>
            ${materias}<br>
            Mão de obra:  ${servico.maoObra || 0}
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
   FUNÇÃO PARA VOLTAR PARA SERVIÇOS
================================ */
function continuarOrcamento() {
  window.location.href = "servicos.html"; // Redireciona para a página de serviços
}
