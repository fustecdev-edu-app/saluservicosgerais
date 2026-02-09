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

// aqui para ve erro usar" console.log(document.getElementById("idAqui")); "


/* ===============================
   FUNÇÃO PARA ADICIONAR PINTURA
================================ */
function adicionarPintura() {

  /* ===============================
     CAPTURA DOS DADOS DO HTML
  ================================= */

  const area = parseFloat(document.getElementById("area").value); // Área em m²
  const valorMaoObra = parseFloat(document.getElementById("valorMaoObra").value); // R$/m²

  /* ===============================
     VALIDAÇÕES
  ================================= */

  if (!area || area <= 0) {
    alert("Informe a área a ser pintada.");
    return;
  }

  if (isNaN(valorMaoObra) || valorMaoObra < 0) {
    alert("Informe o valor da mão de obra.");
    return;
  }

  /* ===============================
     CÁLCULO DE MATERIAIS
     Regras:
     - Tinta 18L → 90 m²
     - Massa corrida 18L → 20 m²
     - Selador 18L → 90 m²
  ================================= */

  const tinta = area * 0.2 /18;        // latas de tinta
  const massa = area * 1.02/18;        // latas de massa corrida
  const selador = area * 5.57/18;      // latas de selador

  /* ===============================
     CÁLCULO DA MÃO DE OBRA
  ================================= */

  const maoObraTotal = area * valorMaoObra;

  const valorFormatado = maoObraTotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  /* ===============================
     SALVAR NO ORÇAMENTO GLOBAL
  ================================= */

  orcamentoFinal.push({
    tipo: "Pintura",
    area: area.toFixed(2),
    tinta: tinta.toFixed(2),       // latas 18L
    massa: massa.toFixed(2),       // latas 18L
    selador: selador.toFixed(2),   // latas 18L
    maoObra: maoObraTotal.toFixed(2)
  });

  // Salva no localStorage
  localStorage.setItem("orcamentoFinal", JSON.stringify(orcamentoFinal));

  /* ===============================
     EXIBIÇÃO DO RESULTADO NA TELA
  ================================= */

  const resultadoDiv = document.getElementById("resultado");

  resultadoDiv.innerHTML += `
    <p>
      ✔️ Pintura adicionada<br>
      Área: ${area.toFixed(2)} m²<br>
      Tinta: ${tinta.toFixed(2)} latas (18L)<br>
      Massa corrida: ${massa.toFixed(2)} latas (18L)<br>
      Selador: ${selador.toFixed(2)} latas (18L)<br>
      Mão de obra: ${valorFormatado}
    </p>
  `;

  /* ===============================
     ATUALIZA CONTADOR E LIMPA CAMPOS
  ================================= */

  atualizarContador();

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
        }else if (tipo === "Alvenaria Dobrada") {
          materias = `
            Blocos: ${servico.blocos}<br>
            Cimento: ${servico.cimento} sacos<br>
            Cal: ${servico.cal} sacos<br>
            Areia: ${servico.areia} m³
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

        }else if("Pilares"){
            materias = `
            Dimensão: ${servico.dimensao || "0 x 0"}<br>
            Quantidade: ${servico.quantidade || 0}<br>
            Concreto: ${servico.concreto || 0} m³<br>
            Cimento: ${servico.cimento || 0} sacos<br>
            Areia: ${servico.areia || 0} m³<br>
            Brita: ${servico.brita || 0} m³
          `

        } else  if (tipo === "Alvenaria Singela") {
          materias = `
            Blocos: ${servico.blocos}<br>
            Cimento: ${servico.cimento} sacos<br>
            Cal: ${servico.cal} sacos<br>
            Areia: ${servico.areia} m³
          `;
        }else if("Cinta"){
            materias = `
            Dimensão: ${servico.dimensao || "0 x 0"}<br>
            Quantidade: ${servico.quantidade || 0}<br>
            Concreto: ${servico.concreto || 0} m³<br>
            Cimento: ${servico.cimento || 0} sacos<br>
            Areia: ${servico.areia || 0} m³<br>
            Brita: ${servico.brita || 0} m³
          `

        }else if("Laje"){
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