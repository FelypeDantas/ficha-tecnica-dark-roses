const inputs = document.querySelectorAll("input");
const progresso = document.getElementById("progresso");
const outroCheck = document.getElementById("outroCheck");
const outroTexto = document.getElementById("outroTexto");

outroCheck.addEventListener("change", () => {
  if (outroCheck.checked) {
    outroTexto.style.display = "block";
    outroTexto.focus();
  } else {
    outroTexto.style.display = "none";
    outroTexto.value = "";
  }
});

inputs.forEach(input => {
    input.addEventListener("input", atualizarBarra);
});

function gerarID() {
  return "DR-" + Math.floor(100000 + Math.random() * 900000);
}

function atualizarBarra() {
    let preenchidos = 0;
    inputs.forEach(i => {
        if (i.value.trim() !== "") preenchidos++;
    });
    let total = inputs.length;
    let porcentagem = (preenchidos / total) * 100;
    progresso.style.width = porcentagem + "%";
}

function getCheckboxes() {
  const checks = document.querySelectorAll(".checkbox-group input[type='checkbox']:checked");

  let valores = Array.from(checks).map(c => c.value);

  if (valores.includes("Outro") && outroTexto.value.trim() !== "") {
    valores = valores.filter(v => v !== "Outro");
    valores.push(outroTexto.value.trim());
  }

  return valores.length ? valores.join(", ") : "Não";
}

  function validarData(dataStr) {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

  if (!regex.test(dataStr)) return false;

  const [dia, mes, ano] = dataStr.split("/").map(Number);
  const data = new Date(ano, mes - 1, dia);

  return (
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia
  );
}

function gerar() {
    if (!nome.value.trim()) {
        alert("Nome obrigatório 🌹");
        return;
    }

    if (data.value && !validarData(data.value)) {
        alert("Data inválida 🌫️ Use o formato dd/mm/aaaa corretamente.");
        return;
    }

  const palavrasFormatadas = 
  `Maior capítulo: ${maior.value || "-"} / ` +
  `Menor capítulo: ${menor.value || "-"} / ` +
  `Média padrão: ${media.value || "-"}`;

    const msg =
        `*🌫️🌹${nome.value}🌹🌫️*
*🌹 Data de Nascimento:* ${data.value}
*🌫️ Título do Livro:* ${titulo.value}
*🌹 Usuário no Wattpad :* ${user.value}
*🌫️ Gênero Literário:* ${genero.value}
*🌹 Contém conteúdo +18?  (Se sim, especifique: tortura, suicídio, abuso, drogas, etc.):* ${getCheckboxes()}.
*🌫️ Você possui gatilhos ou desconfortos ao ler conteúdo +18? (Se sim, quais?):* ${gatilhos.value}.
*🌹 Deseja participar de feedbacks? (Feedbacks são mútuos; não é possível apenas receber):* ${feedback.value}.
*🌫️ Possui capítulos especiais? (Capítulos curtos com menos de 300 palavras):* ${capEspeciais.value}.
*🌹 Quantidade de palavras (${palavrasFormatadas}):*
*🌫️ Link da Obra:* ${link.value}
◃────────────────▹
*🌫️ NÃO PREENCHA 🌫️*
*Bônus Q/L:* 
*Q/Cc:* 
*S/a:*`;

    resultado.innerText = msg;
    gerarCard();
}

function copiar() {
    navigator.clipboard.writeText(resultado.innerText);
    alert("Copiado 🌹");
}

function baixarCard() {
  const card = document.querySelector(".card");

  if (!card) {
    alert("Gere o cartão primeiro 🌹");
    return;
  }

  // adiciona classe temporária
  card.classList.add("exportando");

  html2canvas(card, {
    scale: 2,
    backgroundColor: null
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "dark-roses-card.png";
    link.href = canvas.toDataURL();
    link.click();

    // remove depois
    card.classList.remove("exportando");
  });
}

function gerarCard() {
  const container = document.getElementById("cardContainer");
  const idMembro = gerarID();

  container.innerHTML = `
    <div class="card">
      
      <div class="selo">🌹 Dark Roses</div>

      <h3>${nome.value}</h3>
      <div class="sub">MEMBRO OFICIAL</div>

      <div class="info">
        <span>📖 Livro</span>
        <strong>${titulo.value || "-"}</strong>
      </div>

      <div class="info">
        <span>🎭 Gênero</span>
        <strong>${genero.value || "-"}</strong>
      </div>

      <div class="info">
        <span>👤 Wattpad</span>
        <strong>${user.value || "-"}</strong>
      </div>

      <div class="info">
        <span>📅 Nascimento</span>
        <strong>${data.value || "-"}</strong>
      </div>

      <div class="info">
        <span>💬 Feedbacks</span>
        <strong>${feedback.value || "-"}</strong>
      </div>

      <div class="id">ID: ${idMembro}</div>

      <div class="footer">
        Dark Roses Society • Escritores unidos pela arte
      </div>

    </div>
  `;
}

function setTema(tema) {
    document.body.className = tema;
}
