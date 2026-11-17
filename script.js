/* =====================================================
   DARK ROSES | SISTEMA PRINCIPAL
   Versão aprimorada
===================================================== */


/* =====================================================
   1. CONFIGURAÇÕES
===================================================== */

const CONFIG = {
    cardFileName: "dark-roses-card.png",
    exportScale: 3,
    temas: ["dark", "blood", "midnight"]
};


/* =====================================================
   2. ELEMENTOS DO DOM
===================================================== */

const el = {
    form: document.getElementById("formFicha"),

    nome: document.getElementById("nome"),
    data: document.getElementById("data"),
    titulo: document.getElementById("titulo"),
    user: document.getElementById("user"),
    genero: document.getElementById("genero"),
    gatilhos: document.getElementById("gatilhos"),

    capEspeciais: document.getElementById("capEspeciais"),
    capEspeciaisContainer: document.getElementById("capEspeciaisContainer"),

    link: document.getElementById("link"),

    maior: document.getElementById("maior"),
    menor: document.getElementById("menor"),

    progresso: document.getElementById("progresso"),
    barra: document.getElementById("barra"),

    outroCheck: document.getElementById("outroCheck"),
    outroTexto: document.getElementById("outroTexto"),
    outroContainer: document.getElementById("outroContainer"),

    nenhumConteudo: document.getElementById("nenhumConteudo"),

    resultado: document.getElementById("resultado"),
    cardContainer: document.getElementById("cardContainer"),
    baixarCardBtn: document.getElementById("baixarCardBtn")
};


/* =====================================================
   3. ESTADO
===================================================== */

const estado = {
    gerando: false,
    ultimoID: null
};


/* =====================================================
   4. INICIALIZAÇÃO
===================================================== */

document.addEventListener("DOMContentLoaded", inicializar);

function inicializar() {

    const elementosEssenciais = [
        el.form,
        el.nome,
        el.data,
        el.titulo,
        el.user,
        el.genero,
        el.gatilhos,
        el.capEspeciais,
        el.capEspeciaisContainer,
        el.link,
        el.maior,
        el.menor,
        el.progresso,
        el.barra,
        el.outroCheck,
        el.outroTexto,
        el.outroContainer,
        el.nenhumConteudo,
        el.resultado,
        el.cardContainer,
        el.baixarCardBtn
    ];

    if (elementosEssenciais.some(elemento => !elemento)) {
        console.error(
            "Dark Roses: um ou mais elementos esperados não foram encontrados no HTML."
        );
        return;
    }

    configurarEventos();

    configurarCamposCondicionais();

    configurarTemaInicial();

    atualizarBarra();
}


/* =====================================================
   5. EVENTOS
===================================================== */

function configurarEventos() {

    // Data
    el.data.addEventListener("input", formatarData);
    el.data.addEventListener("blur", corrigirData);

    // Usuário Wattpad
    el.user.addEventListener("blur", formatarUsuario);

    // Conteúdo sensível
    el.outroCheck.addEventListener("change", toggleOutro);

    el.nenhumConteudo.addEventListener("change", controlarNenhum);

    document.querySelectorAll(
        '.checkbox-group input[type="checkbox"]:not(#nenhumConteudo)'
    ).forEach(check => {
        check.addEventListener("change", controlarCategorias);
    });

    // Capítulos especiais
    document.querySelectorAll(
        'input[name="possuiEspeciais"]'
    ).forEach(radio => {
        radio.addEventListener("change", toggleCapEspeciais);
    });

    // Progresso
    el.form.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", atualizarBarra);
        input.addEventListener("change", atualizarBarra);
    });

    // Valores técnicos
    el.maior.addEventListener("input", validarOrdemPalavras);
    el.menor.addEventListener("input", validarOrdemPalavras);

    // Atualização do progresso após qualquer mudança
    el.form.addEventListener("change", atualizarBarra);
}


/* =====================================================
   6. CONFIGURAÇÃO INICIAL
===================================================== */

function configurarTemaInicial() {

    const temaAtual = CONFIG.temas.find(
        tema => document.body.classList.contains(tema)
    );

    if (!temaAtual) {
        document.body.classList.add("dark");
    }
}


function configurarCamposCondicionais() {

    toggleOutro();

    toggleCapEspeciais();
}


/* =====================================================
   7. FORMATAÇÃO DE DADOS
===================================================== */

// Formata a data enquanto o usuário digita.

function formatarData(event) {

    let valor = event.target.value.replace(/\D/g, "").slice(0, 8);

    if (valor.length > 4) {
        valor = valor.replace(
            /^(\d{2})(\d{2})(\d{1,4})$/,
            "$1/$2/$3"
        );
    } else if (valor.length > 2) {
        valor = valor.replace(
            /^(\d{2})(\d{1,2})$/,
            "$1/$2"
        );
    }

    event.target.value = valor;
}


// Corrige formatos incompletos ao sair do campo.

function corrigirData() {

    const numeros = el.data.value.replace(/\D/g, "");

    if (!numeros) return;

    if (numeros.length === 8) {

        const dia = numeros.slice(0, 2);
        const mes = numeros.slice(2, 4);
        const ano = numeros.slice(4, 8);

        el.data.value = `${dia}/${mes}/${ano}`;

    } else if (numeros.length === 7) {

        const dia = numeros.slice(0, 1).padStart(2, "0");
        const mes = numeros.slice(1, 3);
        const ano = numeros.slice(3, 7);

        el.data.value = `${dia}/${mes}/${ano}`;
    }

    atualizarBarra();
}


// Padroniza o usuário do Wattpad.

function formatarUsuario() {

    let usuario = el.user.value.trim();

    if (!usuario) return;

    usuario = usuario.replace(/^@+/, "");

    el.user.value = `@${usuario}`;
}


/* =====================================================
   8. CAMPOS CONDICIONAIS
===================================================== */

// Campo Outro.

function toggleOutro() {

    const ativo = el.outroCheck.checked;

    el.outroContainer.hidden = !ativo;

    el.outroTexto.required = ativo;

    if (ativo) {
        el.outroTexto.focus();
    } else {
        el.outroTexto.value = "";
    }

    atualizarBarra();
}


// Opção Nenhum.

function controlarNenhum() {

    if (el.nenhumConteudo.checked) {

        document.querySelectorAll(
            '.checkbox-group input[type="checkbox"]:not(#nenhumConteudo)'
        ).forEach(check => {
            check.checked = false;
        });

        toggleOutro();
    }

    atualizarBarra();
}


// Impede que Nenhum seja selecionado junto com outras categorias.

function controlarCategorias() {

    if (this.checked) {
        el.nenhumConteudo.checked = false;
    }

    if (this === el.outroCheck) {
        toggleOutro();
    }

    atualizarBarra();
}


// Capítulos especiais.

function toggleCapEspeciais() {

    const selecionado = document.querySelector(
        'input[name="possuiEspeciais"]:checked'
    );

    const possui = selecionado?.value === "Sim";

    el.capEspeciaisContainer.hidden = !possui;

    el.capEspeciais.required = possui;

    if (!possui) {
        el.capEspeciais.value = "";
    }

    atualizarBarra();
}


/* =====================================================
   9. PROGRESSO
===================================================== */

function atualizarBarra() {

    const camposObrigatorios = [
        el.nome,
        el.data,
        el.titulo,
        el.user,
        el.genero,
        el.maior,
        el.menor,
        el.link
    ];

    let total = camposObrigatorios.length;
    let preenchidos = 0;

    camposObrigatorios.forEach(campo => {

        if (campo.value.trim() && campo.checkValidity()) {
            preenchidos++;
        }
    });

    // Feedback
    total++;

    if (document.querySelector('input[name="feedback"]:checked')) {
        preenchidos++;
    }

    // Conteúdo sensível
    total++;

    if (document.querySelector(
        '.checkbox-group input[type="checkbox"]:checked'
    )) {
        preenchidos++;
    }

    // Capítulos especiais
    total++;

    if (document.querySelector(
        'input[name="possuiEspeciais"]:checked'
    )) {
        preenchidos++;
    }

    // Campo condicional: Outro
    if (el.outroCheck.checked) {

        total++;

        if (el.outroTexto.value.trim()) {
            preenchidos++;
        }
    }

    // Campo condicional: capítulos especiais
    const especiais = document.querySelector(
        'input[name="possuiEspeciais"]:checked'
    );

    if (especiais?.value === "Sim") {

        total++;

        if (el.capEspeciais.value.trim()) {
            preenchidos++;
        }
    }

    const porcentagem = Math.round(
        (preenchidos / total) * 100
    );

    el.progresso.style.width = `${porcentagem}%`;

    el.barra.setAttribute(
        "aria-valuenow",
        porcentagem
    );
}


/* =====================================================
   10. UTILITÁRIOS
===================================================== */

function limparEspacosFinais(texto) {

    return texto
        .split("\n")
        .map(linha => linha.trimEnd())
        .join("\n")
        .trim();
}


function validarNomeCompleto(nome) {

    // Nome ou pseudônimo pode ter uma única palavra.
    return nome.trim().length >= 2;
}


function gerarID() {

    if (window.crypto?.randomUUID) {
        return `DR-${crypto.randomUUID().slice(0, 8)}`;
    }

    return `DR-${Math.floor(
        100000 + Math.random() * 900000
    )}`;
}


function getFeedback() {

    const selecionado = document.querySelector(
        'input[name="feedback"]:checked'
    );

    return selecionado ? selecionado.value : "-";
}


function getCapEspeciais() {

    const selecionado = document.querySelector(
        'input[name="possuiEspeciais"]:checked'
    );

    if (!selecionado) return "-";

    if (selecionado.value === "Não") {
        return "Não possui";
    }

    return el.capEspeciais.value.trim();
}


function getCheckboxes() {

    const checks = document.querySelectorAll(
        '.checkbox-group input[type="checkbox"]:checked'
    );

    const valores = Array.from(checks).map(check => {

        if (check.value === "Outro") {
            return el.outroTexto.value.trim();
        }

        return check.value;
    });

    return valores.length
        ? valores.join(", ")
        : "Não informado";
}


/* =====================================================
   11. VALIDAÇÃO DE DATA
===================================================== */

function validarData(dataStr) {

    const regex =
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (!regex.test(dataStr)) return false;

    const [dia, mes, ano] = dataStr.split("/").map(Number);

    const data = new Date(ano, mes - 1, dia);

    return (
        data.getFullYear() === ano &&
        data.getMonth() === mes - 1 &&
        data.getDate() === dia
    );
}


/* =====================================================
   12. VALIDAÇÃO NUMÉRICA
===================================================== */

function validarNumeroPositivo(valor) {

    const numero = Number(valor);

    return (
        Number.isSafeInteger(numero) &&
        numero > 0
    );
}


function validarOrdemPalavras() {

    const maior = Number(el.maior.value);
    const menor = Number(el.menor.value);

    if (
        el.maior.value &&
        el.menor.value &&
        maior > 0 &&
        menor > 0 &&
        menor > maior
    ) {

        el.menor.setCustomValidity(
            "O menor capítulo não pode superar o maior."
        );

    } else {

        el.menor.setCustomValidity("");
    }
}


/* =====================================================
   13. VALIDAÇÃO GERAL
===================================================== */

function validarFormulario() {

    const camposObrigatorios = [
        el.nome,
        el.data,
        el.titulo,
        el.user,
        el.genero,
        el.maior,
        el.menor,
        el.link
    ];

    for (const campo of camposObrigatorios) {

        if (!campo.value.trim()) {

            campo.focus();

            alert("Preencha todos os campos obrigatórios 🌹");

            return false;
        }
    }

    if (!validarNomeCompleto(el.nome.value)) {

        el.nome.focus();

        alert("Informe um nome ou pseudônimo com pelo menos 2 caracteres.");

        return false;
    }

    if (!validarData(el.data.value)) {

        el.data.focus();

        alert("Data inválida 🌫️ Utilize dd/mm/aaaa.");

        return false;
    }

    const feedbackSelecionado = document.querySelector(
        'input[name="feedback"]:checked'
    );

    if (!feedbackSelecionado) {
        document.querySelector('input[name="feedback"]')?.focus();

        alert("Selecione sua preferência de feedback.");

        return false;
    }

    const conteudoSelecionado = document.querySelector(
        '.checkbox-group input[type="checkbox"]:checked'
    );

    if (!conteudoSelecionado) {

        alert("Selecione uma opção de conteúdo sensível, incluindo Nenhum.");

        return false;
    }

    if (
        el.outroCheck.checked &&
        !el.outroTexto.value.trim()
    ) {

        el.outroTexto.focus();

        alert("Descreva o outro conteúdo sensível.");

        return false;
    }

    const especiais = document.querySelector(
        'input[name="possuiEspeciais"]:checked'
    );

    if (!especiais) {

        alert("Informe se sua obra possui capítulos especiais.");

        return false;
    }

    if (
        especiais.value === "Sim" &&
        !el.capEspeciais.value.trim()
    ) {

        el.capEspeciais.focus();

        alert("Informe quais são os capítulos especiais.");

        return false;
    }

    if (!validarNumeroPositivo(el.maior.value) ||
        !validarNumeroPositivo(el.menor.value)) {

        el.maior.focus();

        alert("Informe quantidades de palavras inteiras e positivas.");

        return false;
    }

    const maior = Number(el.maior.value);
    const menor = Number(el.menor.value);

    if (menor > maior) {

        el.menor.focus();

        alert("O menor capítulo não pode ser maior que o maior.");

        return false;
    }

    // Verifica URL.
    try {

        const url = new URL(el.link.value);

        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("Protocolo inválido");
        }

    } catch {

        el.link.focus();

        alert("Informe um link válido para sua obra.");

        return false;
    }

    return true;
}

/* =====================================================
   14. CÁLCULO DE MÉDIA
===================================================== */

function calcularMedia(maior, menor) {

    const max = Number(maior);
    const min = Number(menor);

    if (
        !Number.isSafeInteger(max) ||
        !Number.isSafeInteger(min)
    ) {
        return "-";
    }

    return Math.round((max + min) / 2);
}


/* =====================================================
   15. SISTEMA Q/CC
   REGRAS ORIGINAIS PRESERVADAS
===================================================== */

// Tabela até 10 mil palavras.

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

    return { cap: 1, com: 35 };
}


// MDC.

function mdc(a, b) {

    return b === 0
        ? a
        : mdc(b, a % b);
}


// MMC.

function mmc(a, b) {

    return (a * b) / mdc(a, b);
}


// Regra avançada acima de 10 mil.

function calcularQCavancado(maior, menor) {

    const max = Number(maior);
    const min = Number(menor);

    const media = Math.round((max + min) / 2);

    const fator = 1000;

    const maxN = Math.max(1, Math.floor(max / fator));
    const minN = Math.max(1, Math.floor(min / fator));
    const mediaN = Math.max(1, Math.floor(media / fator));

    const TETO = 35;

    for (let i = 1; i <= TETO; i++) {

        if (
            maxN % i === 0 &&
            minN % i === 0 &&
            mediaN % i === 0
        ) {

            return {
                cap: 1,
                com: i
            };
        }
    }

    const menorStr = String(min);
    const fallback = Number(menorStr.slice(0, 2));

    return {
        cap: 1,
        com: Math.min(fallback, TETO)
    };
}


// Função principal.

function calcularQC(maior, menor) {

    const max = Number(maior);
    const min = Number(menor);

    if (!max || !min) return "-";

    const media = Math.round((max + min) / 2);

    if (media <= 10000) {
        return getTabelaQC(media);
    }

    return calcularQCavancado(max, min);
}


// Formatação.

function formatarQC(qc) {

    if (qc === "-") return "-";

    return `${qc.cap}C.${qc.com}c.`;
}


/* =====================================================
   16. MONTAGEM DA MENSAGEM
   FORMATO ORIGINAL PRESERVADO
===================================================== */

function montarMensagem() {

    const mediaCalculada = calcularMedia(
        el.maior.value,
        el.menor.value
    );

    const palavrasFormatadas =
        `Maior capítulo: ${el.maior.value} / ` +
        `Menor capítulo: ${el.menor.value} / ` +
        `Média padrão: ${mediaCalculada}`;

    return `*🌫️🌹${el.nome.value.trim()}🌹🌫️*
*🌹 Data de Nascimento:* ${el.data.value}
*🌫️ Título do Livro:* ${el.titulo.value.trim()}
*🌹 Usuário no Wattpad :* ${el.user.value}
*🌫️ Gênero Literário:* ${el.genero.value.trim()}
*🌹 Contém conteúdo +18?  (Se sim, especifique: tortura, suicídio, abuso, drogas, etc.):* ${getCheckboxes()}.
*🌫️ Você possui gatilhos ou desconfortos ao ler conteúdo +18? (Se sim, quais?):* ${el.gatilhos.value.trim() || "Não informado"}.
*🌹 Deseja participar de feedbacks? (Feedbacks são mútuos; não é possível apenas receber):* ${getFeedback()}.
*🌫️ Possui capítulos especiais? (Capítulos curtos com menos de 300 palavras):* ${getCapEspeciais()}.
*🌹 Quantidade de palavras (${palavrasFormatadas}):*
*🌫️ Link da Obra:* ${el.link.value.trim()}
◃────────────────▹
*🌫️ NÃO PREENCHA 🌫️*
*Bônus Q/L:* 
*Q/Cc:* 
*S/a:*`;
}

/* =====================================================
   18. CÓPIA DA FICHA
===================================================== */

async function copiarTexto(texto) {

    try {

        if (navigator.clipboard && window.isSecureContext) {

            await navigator.clipboard.writeText(texto);

            return true;
        }

        // Alternativa para ambientes sem Clipboard API.

        const textarea = document.createElement("textarea");

        textarea.value = texto;

        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.select();

        const sucesso = document.execCommand("copy");

        textarea.remove();

        return sucesso;

    } catch (erro) {

        console.error("Erro ao copiar:", erro);

        return false;
    }
}


/* =====================================================
   19. AÇÃO PRINCIPAL
===================================================== */

async function gerar() {

    if (estado.gerando) return;

    validarOrdemPalavras();

    if (!validarFormulario()) return;

    estado.gerando = true;

    const botao = el.form.querySelector(".acoes button");
    const textoOriginal = botao?.textContent || "";

    if (botao) {
        botao.disabled = true;
        botao.textContent = "Gerando ficha...";
    }

    try {

        // Q/Cc. As regras originais foram mantidas.
        const qc = calcularQC(
            el.maior.value,
            el.menor.value
        );

        const qcFormatado = formatarQC(qc);

        // Montagem da mensagem.
        let msg = montarMensagem();

        msg = msg.replace(
            "*Q/Cc:*",
            `*Q/Cc:* ${qcFormatado}`
        );

        const mensagemFinal = limparEspacosFinais(msg);

        // Exibição do resultado.
        el.resultado.textContent = mensagemFinal;
        el.resultado.hidden = false;

        // Geração do cartão visual.
        gerarCard();

        // Cópia local. Não há envio para servidor.
        const copiado = await copiarTexto(mensagemFinal);

        if (copiado) {
            alert("Ficha gerada e copiada! 🌹");
        } else {
            alert(
                "Ficha gerada! Não foi possível copiá-la automaticamente. " +
                "Você ainda pode selecionar e copiar o texto exibido. 🌫️"
            );
        }

    } catch (erro) {

        console.error("Erro ao gerar ficha:", erro);

        alert("Ocorreu um erro ao gerar sua ficha 🌫️");

    } finally {

        estado.gerando = false;

        if (botao) {
            botao.disabled = false;
            botao.textContent = textoOriginal;
        }
    }
}


/* =====================================================
   20. CRIAÇÃO SEGURA DE ELEMENTOS
===================================================== */

function criarElemento(tag, classe, texto) {

    const elemento = document.createElement(tag);

    if (classe) {
        elemento.className = classe;
    }

    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    return elemento;
}


/* =====================================================
   21. GERAÇÃO DO CARTÃO
===================================================== */

function gerarCard() {

    const idMembro = estado.ultimoID || gerarID();
    estado.ultimoID = idMembro;

    const card = criarElemento("div", "dr-card");

    // Moldura ornamental: os quatro cantos são elementos reais,
    // além dos detalhes decorativos definidos no CSS.
    ["tl", "tr", "bl", "br"].forEach(posicao => {
        card.appendChild(
            criarElemento("span", `dr-corner dr-corner--${posicao}`)
        );
    });

    // Cabeçalho da identidade visual.
    const header = criarElemento("header", "dr-header");
    const rose = criarElemento("div", "dr-rose", "🌹");
    const brand = criarElemento("div", "dr-brand", "DARK ROSES");
    const subtitle = criarElemento(
        "div",
        "dr-subtitle",
        "MEMBRO OFICIAL"
    );

    header.append(rose, brand, subtitle);
    card.appendChild(header);
    card.appendChild(criarElemento("div", "dr-divider"));

    // Identidade do membro.
    const identity = criarElemento("section", "dr-identity");
    identity.appendChild(
        criarElemento("h2", "dr-name", el.nome.value.trim())
    );
    identity.appendChild(
        criarElemento("p", "dr-date", `Nascimento: ${el.data.value}`)
    );
    card.appendChild(identity);

    // Selo de autenticidade.
    const seal = criarElemento("div", "dr-seal");
    seal.appendChild(
        criarElemento("span", "dr-seal-symbol", "✦")
    );
    seal.appendChild(
        criarElemento("span", "dr-seal-text", "FICHA AUTÊNTICA")
    );
    card.appendChild(seal);

    // Auxiliares para manter a estrutura do cartão consistente.
    const criarSecao = (titulo) => {
        const secao = criarElemento("section", "dr-section");
        secao.appendChild(
            criarElemento("h3", "dr-section-title", titulo)
        );
        return secao;
    };

    const adicionarInfo = (secao, rotulo, valor) => {
        const linha = criarElemento("div", "dr-info");
        linha.appendChild(
            criarElemento("span", "dr-info-label", rotulo)
        );
        linha.appendChild(
            criarElemento(
                "strong",
                "dr-info-value",
                valor && String(valor).trim() ? String(valor).trim() : "Não informado"
            )
        );
        secao.appendChild(linha);
    };

    // Obra e perfil.
    const secaoObra = criarSecao("OBRA & PERFIL");
    adicionarInfo(secaoObra, "Título", el.titulo.value);
    adicionarInfo(secaoObra, "Gênero literário", el.genero.value);
    adicionarInfo(secaoObra, "Wattpad", el.user.value);

    const linhaLink = criarElemento("div", "dr-info");
    linhaLink.appendChild(
        criarElemento("span", "dr-info-label", "Link da obra")
    );

    const linkObra = criarElemento("a", "dr-info-value", "Acessar obra");
    const urlObra = new URL(el.link.value.trim());
    linkObra.href = urlObra.href;
    linkObra.target = "_blank";
    linkObra.rel = "noopener noreferrer";
    linhaLink.appendChild(linkObra);

    secaoObra.appendChild(linhaLink);
    card.appendChild(secaoObra);

    // Preferências e informações de leitura.
    const secaoLeitura = criarSecao("LEITURA & PREFERÊNCIAS");
    adicionarInfo(secaoLeitura, "Conteúdo sensível", getCheckboxes());
    adicionarInfo(
        secaoLeitura,
        "Gatilhos e desconfortos",
        el.gatilhos.value.trim() || "Não informado"
    );
    adicionarInfo(secaoLeitura, "Participa de feedbacks", getFeedback());
    adicionarInfo(
        secaoLeitura,
        "Capítulos especiais",
        getCapEspeciais()
    );
    card.appendChild(secaoLeitura);

    // Estatísticas da obra.
    const secaoEstatisticas = criarSecao("ESTATÍSTICAS DA OBRA");
    const stats = criarElemento("div", "dr-stats");

    const media = calcularMedia(el.maior.value, el.menor.value);
    const estatisticas = [
        ["dr-stat", el.maior.value, "MAIOR CAPÍTULO"],
        ["dr-stat", el.menor.value, "MENOR CAPÍTULO"],
        ["dr-stat", media, "MÉDIA PADRÃO"]
    ];

    estatisticas.forEach(([, valor, rotulo]) => {
        const item = criarElemento("div", "dr-stat");
        item.appendChild(
            criarElemento("strong", "dr-stat-value", String(valor))
        );
        item.appendChild(
            criarElemento("span", "dr-stat-label", rotulo)
        );
        stats.appendChild(item);
    });

    secaoEstatisticas.appendChild(stats);
    card.appendChild(secaoEstatisticas);

    // Rodapé e identificador exclusivo.
    const footer = criarElemento("footer", "dr-footer");
    footer.appendChild(
        criarElemento(
            "span",
            "dr-footer-message",
            "Escritores unidos pela arte"
        )
    );
    footer.appendChild(
        criarElemento("strong", "dr-id", `ID: ${idMembro}`)
    );
    footer.appendChild(
        criarElemento("span", "dr-footer-brand", "DARK ROSES SOCIETY")
    );
    card.appendChild(footer);

    el.cardContainer.replaceChildren(card);
    el.cardContainer.hidden = false;
    el.baixarCardBtn.hidden = false;

    return card;
}


/* =====================================================
   22. EXPORTAÇÃO DO CARTÃO
===================================================== */

async function baixarCard() {

    const card = el.cardContainer.querySelector(".dr-card");

    if (!card) {

        alert("Gere o cartão primeiro 🌹");

        return;
    }

    if (typeof html2canvas === "undefined") {

        alert("Biblioteca de captura indisponível 🌫️");

        return;
    }

    const botao = el.baixarCardBtn;

    botao.disabled = true;

    const textoOriginal = botao.textContent;

    botao.textContent = "Preparando imagem...";

    card.classList.add("exportando");

    try {

        // Aguarda fontes e layout antes da captura.
        if (document.fonts?.ready) {
            await document.fonts.ready;
        }

        await new Promise(resolve => {
            requestAnimationFrame(() => requestAnimationFrame(resolve));
        });

        const canvas = await html2canvas(card, {

            scale: CONFIG.exportScale,

            backgroundColor: null,

            useCORS: true,

            logging: false
        });

        const imagem = await new Promise((resolve, reject) => {

            canvas.toBlob(blob => {

                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Falha ao criar imagem."));
                }

            }, "image/png");
        });

        const url = URL.createObjectURL(imagem);

        const link = document.createElement("a");

        link.href = url;

        link.download = CONFIG.cardFileName;

        document.body.appendChild(link);

        link.click();

        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1500);

    } catch (erro) {

        console.error("Erro ao exportar cartão:", erro);

        alert("Não foi possível exportar o cartão 🌫️");

    } finally {

        card.classList.remove("exportando");

        botao.disabled = false;

        botao.textContent = textoOriginal;
    }
}


/* =====================================================
   23. SISTEMA DE TEMAS
===================================================== */

function setTema(tema) {

    if (!CONFIG.temas.includes(tema)) {
        console.warn("Tema não reconhecido:", tema);
        return;
    }

    CONFIG.temas.forEach(nome => {
        document.body.classList.remove(nome);
    });

    document.body.classList.add(tema);

    console.log(`Tema alterado: ${tema} 🌹`);
}
