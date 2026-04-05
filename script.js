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

    const msg =
        `*🌫️🌹${nome.value}🌹🌫️*
*🌹 Data de Nascimento:* ${data.value}
*🌫️ Título do Livro:* ${titulo.value}
*🌹 Usuário no Wattpad :* ${user.value}
*🌫️ Gênero Literário:* ${genero.value}
*🌹 Conteúdo +18:* ${getCheckboxes()}
*🌫️ Gatilhos:* ${gatilhos.value}
*🌹 Feedbacks:* ${feedback.value}
*🌫️ Capítulos especiais:* ${capEspeciais.value}
*🌹 Quantidade de palavras:* ${palavras.value}
*🌫️ Link da Obra:* ${link.value}
◃────────────────▹
*🌫️ NÃO PREENCHA 🌫️*
*Bônus Q/L:* 
*Q/Cc:* 
*S/a:*`;

    resultado.innerText = msg;
}

function copiar() {
    navigator.clipboard.writeText(resultado.innerText);
    alert("Copiado 🌹");
}

function setTema(tema) {
    document.body.className = tema;
}
