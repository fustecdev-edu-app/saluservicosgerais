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
   FUNÇÃO PARA ADICIONAR PISO
================================ */
function adicionarPiso() {

  /* ===============================
     CAPTURA DOS DADOS DO HTML
  ================================= */

  const comprimento = parseFloat(document.getElementById("comprimento").value);
  const largura = parseFloat(document.getElementById("largura").value);
  const valorMaoObra = parseFloat(document.getElementById("valorMaoObra").value);

  /* ===============================
     VALIDAÇÕES
  ================================= */

  if (!comprimento || comprimento <= 0) {
    alert("Informe o comprimento do ambiente.");
    return;
  }

  if (!largura || largura <= 0) {
    alert("Informe a largura do ambiente.");
    return;
  }

  if (isNaN(valorMaoObra) || valorMaoObra < 0) {
    alert("Informe o valor da mão de obra.");
    return;
  }

  /* ===============================
     CÁLCULO DA ÁREA
  ================================= */

  const area = comprimento * largura; // m²

  /* ===============================
     CÁLCULO DE MATERIAIS
     (coeficientes médios)
  ================================= */

  const cimento = area * 0.25; // sacos de cimento
  const areia = area * 0.03;   // m³ de areia

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
    tipo: "Piso",
    area: area.toFixed(2),
    cimento: cimento.toFixed(2),
    areia: areia.toFixed(2),
    maoObra: maoObraTotal.toFixed(2)
  });

  // Persiste no localStorage
  localStorage.setItem("orcamentoFinal", JSON.stringify(orcamentoFinal));

  /* ===============================
     EXIBIR RESULTADO NA TELA
  ================================= */

  const resultadoDiv = document.getElementById("resultado");

  resultadoDiv.innerHTML += `
    <p>
      ✔️ Piso adicionado<br>
      Área: ${area.toFixed(2)} m²<br>
      Cimento: ${cimento.toFixed(2)} sacos<br>
      Areia: ${areia.toFixed(2)} m³<br>
      Mão de obra: ${valorFormatado}
    </p>
  `;

  /* ===============================
     ATUALIZA CONTADOR E LIMPA CAMPOS
  ================================= */

  atualizarContador();

  document.getElementById("comprimento").value = "";
  document.getElementById("largura").value = "";
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