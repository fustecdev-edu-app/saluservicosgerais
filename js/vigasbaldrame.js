/* ===============================
   BANCO GLOBAL DE ORÇAMENTO
================================ */
// Pega o orçamento armazenado no localStorage ou cria um array vazio
let orcamentoFinal = JSON.parse(localStorage.getItem("orcamentoFinal")) || [];

/* ===============================
   ATUALIZAR CONTADOR DO CARD
================================ */
function atualizarContador() {
  const contador = document.getElementById("contador");
  if (contador) contador.innerText = orcamentoFinal.length;
}
atualizarContador();

/* ===============================
   ADICIONAR VIGAS BALDRAME
================================ */
function adicionarVigasBaldrame() {
  // Pegando valores dos inputs
  const areaInput = document.getElementById("comprimento").value * document.getElementById("largura").value * document.getElementById("altura").value;
  const maoObraInput = document.getElementById("valorMaoObra");
  const altuta = document.getElementById("altura").value;
  const largura = document.getElementById("largura").value;
  const comprimento = document.getElementById("comprimento").value;


  const area = areaInput;
  
  const valorMaoObra = parseFloat(maoObraInput.value)* comprimento;
  const valor = valorMaoObra;
const valorFormatado = valor.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});
 

  // Valida inputs
  if (!area || area <= 0) {
    alert("Informe a área em m².");
    return;
  }
  if (isNaN(valorMaoObra) || valorMaoObra < 0) {
    alert("Informe o valor da mão de obra.");
    return;
  }

  /* ===============================
     CÁLCULO DE MATERIAIS
     Exemplo por m²:
     - Concreto: 0,1 m³/m²
     - Cimento: 7 sacos/m³ de concreto
     - Areia: 0,5 m³/m³ de concreto
     - Brita: 0,7 m³/m³ de concreto
  ================================= */
  const concreto = area;
  const cimento = concreto * 8;
  const areia = concreto * 0.5;
  const brita = concreto * 0.7;

 

  /* ===============================
     SALVAR NO ORÇAMENTO
  ================================= */
  const servico = {
    tipo: "Vigas Baldrame",
    area: area.toFixed(2),
    dimensao: `${altuta} x ${largura}`,
    quantidade: 0,
    concreto: area.toFixed(2),
    cimento: cimento.toFixed(2),
    areia: areia.toFixed(2),
    brita: brita.toFixed(2),
    maoObra: valor.toFixed(2)
  };
 
  orcamentoFinal.push(servico);
  localStorage.setItem("orcamentoFinal", JSON.stringify(orcamentoFinal));

  /* ===============================
     EXIBIR RESULTADO NA TELA
  ================================= */

  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML += `
    <p>
      ✔️ Vigas Baldrame adicionadas<br>
      Área: ${servico.area} m²<br>
      Concreto: ${servico.concreto} m³<br>
      Cimento: ${servico.cimento} sacos<br>
      Areia: ${servico.areia} m³<br>
      Brita: ${servico.brita} m³<br>
      Mão de obra: R$ ${servico.maoObra}
    </p>
  `;

  // Atualiza o contador
  atualizarContador();

  // Limpa os campos
  document.getElementById("comprimento").value=""
  document.getElementById("altura").value=""
  document.getElementById("largura").value=""
  maoObraInput.value = "";
}

/* ===============================
   ABRIR MODAL
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

        if (tipo === "Sapatas") {   ///
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
        } else if (tipo === "Alvenaria Dobrada") {
           materias = `
            Blocos: ${servico.blocos}<br>
            Cimento: ${servico.cimento} sacos<br>
            Cal: ${servico.cal} sacos<br>
            Areia: ${servico.areia} m³
          `;
        } else if("Vigas Baldrame"){
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
  if (event.target === modal) fecharModal();
}

/* ===============================
   CONTINUAR ORÇAMENTO
================================ */
function continuarOrcamento() {
  window.location.href = "servicos.html";
}
