// ===== ELEMENTOS =====
const el = {
  nome: document.getElementById("nome"),
  data: document.getElementById("data"),
  titulo: document.getElementById("titulo"),
  user: document.getElementById("user"),
  genero: document.getElementById("genero"),
  gatilhos: document.getElementById("gatilhos"),
  feedback: document.getElementById("feedback"),
  capEspeciais: document.getElementById("capEspeciais"),
  link: document.getElementById("link"),
  maior: document.getElementById("maior"),
  menor: document.getElementById("menor"),

  progresso: document.getElementById("progresso"),
  outroCheck: document.getElementById("outroCheck"),
  outroTexto: document.getElementById("outroTexto"),
  resultado: document.getElementById("resultado"),
  cardContainer: document.getElementById("cardContainer"),
};

// apenas inputs relevantes para progresso
const inputs = document.querySelectorAll("input[type='text'], input[type='date']");

// ===== EVENTOS =====
el.outroCheck.addEventListener("change", toggleOutro);

inputs.forEach(input => {
  input.addEventListener("input", atualizarBarra);
});

// ===== FUNÇÕES =====

// 🌹 UI
function toggleOutro() {
  const ativo = el.outroCheck.checked;

  el.outroTexto.style.display = ativo ? "block" : "none";

  if (ativo) {
    el.outroTexto.focus();
  } else {
    el.outroTexto.value = "";
  }
}

// 🆔 ID mais seguro
function gerarID() {
  if (window.crypto?.randomUUID) {
    return `DR-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `DR-${Math.floor(100000 + Math.random() * 900000)}`;
}

// 📊 Progresso
function atualizarBarra() {
  let preenchidos = 0;

  inputs.forEach(i => {
    if (i.value.trim()) preenchidos++;
  });

  const porcentagem = (preenchidos / inputs.length) * 100;
  el.progresso.style.width = `${porcentagem}%`;
}

// 🧼 Limpeza de texto
function limparEspacosFinais(texto) {
  return texto
    .split("\n")
    .map(linha => linha.trimEnd())
    .join("\n")
    .trim();
}

// 📐 Regras de negócio
function calcularMedia(maior, menor) {
  const max = parseInt(maior, 10);
  const min = parseInt(menor, 10);

  if (!Number.isInteger(max) || !Number.isInteger(min)) return "-";

  return Math.round((max + min) / 2);
}

function getCheckboxes() {
  const checks = document.querySelectorAll(".checkbox-group input[type='checkbox']:checked");

  let valores = Array.from(checks).map(c => c.value);

  if (valores.includes("Outro") && el.outroTexto.value.trim()) {
    valores = valores.filter(v => v !== "Outro");
    valores.push(el.outroTexto.value.trim());
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

// ✅ Validação isolada
function validarFormulario() {
  if (!el.nome.value.trim()) {
    alert("Nome obrigatório 🌹");
    return false;
  }

  if (el.data.value && !validarData(el.data.value)) {
    alert("Data inválida 🌫️ Use o formato dd/mm/aaaa corretamente.");
    return false;
  }

  if (el.maior.value && el.menor.value) {
    const max = parseInt(el.maior.value, 10);
    const min = parseInt(el.menor.value, 10);

    if (min > max) {
      alert("O menor capítulo não pode ser maior que o maior 🌫️");
      return false;
    }
  }

  return true;
}

// ===== Q/Cc =====

// tabela até 10k (arredonda pra cima)
function getTabelaQC(palavras) {
  const p = Number(palavras);

  if (p <= 100) return { cap: 10, com: 1 };
  if (p <= 300) return { cap: 10, com: 1 };
  if (p <= 400) return { cap: 8, com: 2 };
  if (p <= 600) return { cap: 5, com: 4 };
  if (p <= 800) return { cap: 4, com: 6 };
  if (p <= 1000) return { cap: 3, com: 8 };
  if (p <= 1500) return { cap: 2, com: 13 };
  if (p <= 2000) return { cap: 2, com: 15 };
  if (p <= 2500) return { cap: 1, com: 20 };
  if (p <= 3000) return { cap: 1, com: 25 };
  if (p <= 5000) return { cap: 1, com: 30 };
  return { cap: 1, com: 35 }; // até 10k
}

// matemática base
function mdc(a, b) {
  return b === 0 ? a : mdc(b, a % b);
}

function mmc(a, b) {
  return (a * b) / mdc(a, b);
}

// regra acima de 10k
function calcularQCavancado(maior, menor) {
  const max = Number(maior);
  const min = Number(menor);
  const media = Math.round((max + min) / 2);

  const fator = 1000;

  const maxN = Math.max(1, Math.round(max / fator));
  const minN = Math.max(1, Math.round(min / fator));
  const mediaN = Math.max(1, Math.round(media / fator));

  const mmc1 = mmc(maxN, minN);
  const mmcFinal = mmc(mmc1, mediaN);

  return {
    cap: 1,
    com: mmcFinal
  };
}

// função principal Q/Cc
function calcularQC(maior, menor) {
  const max = Number(maior);
  const min = Number(menor);

  if (!max || !min) return "-";

  // até 10k → usa tabela (pela média)
  const media = Math.round((max + min) / 2);

  if (media <= 10000) {
    return getTabelaQC(media);
  }

  // acima de 10k → regra avançada
  return calcularQCavancado(max, min);
}

// formatação final
function formatarQC(qc) {
  if (qc === "-") return "-";
  return `${qc.cap}C.${qc.com}c.`;
}

// 🧾 Montagem da mensagem (STRING PRESERVADA)
function montarMensagem() {
  const mediaCalculada = calcularMedia(el.maior.value, el.menor.value);

  const palavrasFormatadas =
    `Maior capítulo: ${el.maior.value || "-"} / ` +
    `Menor capítulo: ${el.menor.value || "-"} / ` +
    `Média padrão: ${mediaCalculada}`;

  return `*🌫️🌹${el.nome.value}🌹🌫️*
*🌹 Data de Nascimento:* ${el.data.value}
*🌫️ Título do Livro:* ${el.titulo.value}
*🌹 Usuário no Wattpad :* ${el.user.value}
*🌫️ Gênero Literário:* ${el.genero.value}
*🌹 Contém conteúdo +18?  (Se sim, especifique: tortura, suicídio, abuso, drogas, etc.):* ${getCheckboxes()}.
*🌫️ Você possui gatilhos ou desconfortos ao ler conteúdo +18? (Se sim, quais?):* ${el.gatilhos.value}.
*🌹 Deseja participar de feedbacks? (Feedbacks são mútuos; não é possível apenas receber):* ${el.feedback.value}.
*🌫️ Possui capítulos especiais? (Capítulos curtos com menos de 300 palavras):* ${el.capEspeciais.value}.
*🌹 Quantidade de palavras (${palavrasFormatadas}):*
*🌫️ Link da Obra:* ${el.link.value}
◃────────────────▹
*🌫️ NÃO PREENCHA 🌫️*
*Bônus Q/L:* 
*Q/Cc:* 
*S/a:*`;
}

// 🎯 AÇÃO PRINCIPAL
function gerar() {
  if (!validarFormulario()) return;

  const qc = calcularQC(el.maior.value, el.menor.value);
  const qcFormatado = formatarQC(qc);
  
  let msg = montarMensagem();

  // substitui SOMENTE o campo Q/Cc
  msg = msg.replace("*Q/Cc:*", `*Q/Cc:* ${qcFormatado}`);
  
  el.resultado.innerText = limparEspacosFinais(msg);

  gerarCard();
}

// 📋 Copiar
function copiar() {
  if (!el.resultado.innerText) {
    alert("Nada para copiar 🌫️");
    return;
  }

  navigator.clipboard.writeText(el.resultado.innerText);
  alert("Copiado 🌹");
}

// 🖼️ Exportar card
function baixarCard() {
  const card = document.querySelector(".card");

  if (!card) {
    alert("Gere o cartão primeiro 🌹");
    return;
  }

  if (typeof html2canvas === "undefined") {
    alert("Erro ao gerar imagem 🌫️");
    return;
  }

  card.classList.add("exportando");

  html2canvas(card, {
    scale: 2,
    backgroundColor: null
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "dark-roses-card.png";
    link.href = canvas.toDataURL();
    link.click();
  }).finally(() => {
    card.classList.remove("exportando");
  });
}

// 🃏 Card
function gerarCard() {
  const idMembro = gerarID();

  el.cardContainer.innerHTML = `
    <div class="card">
      
      <div class="selo">🌹 Dark Roses</div>

      <h3>${el.nome.value}</h3>
      <div class="sub">MEMBRO OFICIAL</div>

      <div class="info">
        <span>📖 Livro</span>
        <strong>${el.titulo.value || "-"}</strong>
      </div>

      <div class="info">
        <span>🎭 Gênero</span>
        <strong>${el.genero.value || "-"}</strong>
      </div>

      <div class="info">
        <span>👤 Wattpad</span>
        <strong>${el.user.value || "-"}</strong>
      </div>

      <div class="info">
        <span>📅 Nascimento</span>
        <strong>${el.data.value || "-"}</strong>
      </div>

      <div class="info">
        <span>💬 Feedbacks</span>
        <strong>${el.feedback.value || "-"}</strong>
      </div>

      <div class="id">ID: ${idMembro}</div>

      <div class="footer">
        Dark Roses Society • Escritores unidos pela arte
      </div>

    </div>
  `;
}

// 🎨 Tema
function setTema(tema) {
  document.body.className = tema;
}
