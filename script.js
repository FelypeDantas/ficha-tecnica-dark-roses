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

function gerar() {
    if (!nome.value.trim()) {
        alert("Nome obrigatório 🌹");
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

  html2canvas(card).then(canvas => {
    const link = document.createElement("a");
    link.download = "dark-roses-card.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

function gerarCard() {
  const container = document.getElementById("cardContainer");

  container.innerHTML = `
    <div class="card">
      <h3>🌹 ${nome.value || "Nome não informado"}</h3>

      <p><strong>📖 Livro:</strong> ${titulo.value || "-"}</p>
      <p><strong>🎭 Gênero:</strong> ${genero.value || "-"}</p>
      <p><strong>👤 Wattpad:</strong> ${user.value || "-"}</p>

      <p><strong>📅 Nascimento:</strong> ${data.value || "-"}</p>
      <p><strong>💬 Feedbacks:</strong> ${feedback.value || "-"}</p>
    </div>
  `;
}

function setTema(tema) {
    document.body.className = tema;
}
