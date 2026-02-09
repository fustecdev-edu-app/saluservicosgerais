// Pega o orçamento armazenado no localStorage ou cria um array vazio se não existir
let orcamentoFinal = JSON.parse(localStorage.getItem("orcamentoFinal")) || [];


function carregarPreview() {
  const numero = "SALU-" + Date.now();
  const hoje = new Date().toLocaleDateString("pt-BR");

  document.getElementById("numeroOrcamento").innerText = numero;
  document.getElementById("dataSolicitacao").innerText = hoje;
  document.getElementById("validadeOrcamento").innerText = "📅 Validade do orçamento: 30 dias"

  const preview = document.getElementById("previewServicos");
  preview.innerHTML = "";

  orcamentoFinal.forEach(servico => {
    preview.innerHTML += `
      <p>
        <strong>${servico.tipo}</strong><br>
        Área: ${servico.area || 0}<br>
        Concreto: ${servico.concreto || 0} m³<br>
        Cimento: ${servico.cimento || 0} sacos<br>
        Areia: ${servico.areia || 0} m³<br>
        Brita: ${servico.brita || 0} m³<br>
        Mão de obra: ${formatadorReal.format(servico.maoObra)}
      </p>
      <hr>
    `;
  });
}

function calcularMateriaisPorServico() {

  const totais = {
    cimento: 0,
    areia: 0,
    brita: 0,
    cal: 0,
    tinta: 0,
    massa: 0,
    selador: 0,
    ceramica: 0,
    argamassa: 0,
    rejunte: 0,
    maoObra: 0
  };
   
  orcamentoFinal.forEach(servico => {

    const tipo = servico.tipo.toLowerCase();

    /* ===============================
       ALVENARIA / REBOCO / CHAPISCO
    ================================ */
    if (tipo.includes("alvenaria") || tipo.includes("reboco") || tipo.includes("chapisco")) {
      if (servico.cimento) totais.cimento += parseFloat(servico.cimento);
      if (servico.areia) totais.areia += parseFloat(servico.areia);
      if (servico.cal) totais.cal += parseFloat(servico.cal);
       if (servico.cal) totais.cal += parseFloat(servico.cal);
       if (servico.maoObra) totais.maoObra += parseFloat(servico.maoObra);

    }

    /* ===============================
       PINTURA
    ================================ */
    if (tipo.includes("pintura")) {
      if (servico.tinta) totais.tinta += parseFloat(servico.tinta);
      if (servico.massa) totais.massa += parseFloat(servico.massa);
      if (servico.selador) totais.selador += parseFloat(servico.selador);
      if (servico.maoObra) totais.maoObra += parseFloat(servico.maoObra);
        console.log(servico.maoObra)
    }

    /* ===============================
       CERÂMICA / PISO
    ================================ */
    if (tipo.includes("cerâmica") || tipo.includes("piso")) {
      if (servico.ceramica) totais.ceramica += parseFloat(servico.ceramica);
      if (servico.argamassa) totais.argamassa += parseFloat(servico.argamassa);
      if (servico.rejunte) totais.rejunte += parseFloat(servico.rejunte);
      if (servico.maoObra) totais.maoObra += parseFloat(servico.maoObra);
    }

    /* ===============================
       ESTRUTURAL
       (laje, pilar, viga, cinta, sapata)
    ================================ */
    if (
      tipo.includes("laje") ||
      tipo.includes("pilar") ||
      tipo.includes("viga") ||
      tipo.includes("cinta") ||
      tipo.includes("sapata")
    ) {
      if (servico.cimento) totais.cimento += parseFloat(servico.cimento);
      if (servico.areia) totais.areia += parseFloat(servico.areia);
      if (servico.brita) totais.brita += parseFloat(servico.brita);
      if (servico.maoObra) totais.maoObra += parseFloat(servico.maoObra);
    }

  });

  return {
    cimento: totais.cimento.toFixed(2),
    areia: totais.areia.toFixed(2),
    brita: totais.brita.toFixed(2),
    cal: totais.cal.toFixed(2),
    tinta: totais.tinta.toFixed(0),
    massa: totais.massa.toFixed(0),
    selador: totais.selador.toFixed(0),
    ceramica: totais.ceramica.toFixed(2),
    argamassa: totais.argamassa.toFixed(2),
    rejunte: totais.rejunte.toFixed(2),
    maoObra: totais.maoObra.toFixed(2)
     
  };


}
// valor total de mão de obra


const formatadorReal = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function mostrarResumoMateriais() {
  const m = calcularMateriaisPorServico();
  
  document.getElementById("resultado").innerHTML += `
    <hr>
    <h3>📦 Materiais Totais</h3>

    ${m.cimento > 0 ? `🧱 Cimento: ${m.cimento} sacos<br>` : ""}
    ${m.areia > 0 ? `🏖️ Areia: ${m.areia} m³<br>` : ""}
    ${m.brita > 0 ? `🪨 Brita: ${m.brita} m³<br>` : ""}
    ${m.cal > 0 ? `🪣 Cal: ${m.cal} sacos<br>` : ""}

    ${m.tinta > 0 ? `🎨 Tinta: ${m.tinta} latas<br>` : ""}
    ${m.massa > 0 ? `🧴 Massa corrida: ${m.massa} latas<br>` : ""}
    ${m.selador > 0 ? `🧪 Selador: ${m.selador} latas<br>` : ""}

    ${m.ceramica > 0 ? `🧱 Cerâmica: ${m.ceramica} m²<br>` : ""}
    ${m.argamassa > 0 ? `🪜 Argamassa: ${m.argamassa} sacos<br>` : ""}
    ${m.rejunte > 0 ? `🧼 Rejunte: ${m.rejunte} kg<br><br><br>` : ""}
    <br><br>
    <p>-----------------------------------------------------------------------------------</p>
    <strong>${m.maoObra > 0 ? ` Total Mão de Obra:  ${formatadorReal.format(m.maoObra)}</strong> <br>` : ""}
    
  `;


}
mostrarResumoMateriais()

carregarPreview()
function finalizarOrcamento() {
  window.print();
  // Remove o orçamento salvo no navegador
    localStorage.removeItem('orcamentoFinal');
  window.location.href="index.html"
}


