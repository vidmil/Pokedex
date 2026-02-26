const lista = document.getElementById("lista-pokemon");
const busca = document.getElementById("textBusca");
const bodyApp = document.getElementById("body-app");
const imgPokebola = document.getElementById("img-pokebola");
const totalCountLabel = document.getElementById("total-count");

let pokemons = [];
let temaAtual = 'red';

// Lógica de Carrossel Automático
function alternarTemaAutomatico() {
    if (temaAtual === 'red') {
        temaAtual = 'blue';
        bodyApp.className = 'theme-blue';
        imgPokebola.src = 'midias/pokebola_2.png';
    } else {
        temaAtual = 'red';
        bodyApp.className = 'theme-red';
        imgPokebola.src = 'midias/pokebola_1.png';
    }
}

// Inicia a alternância a cada 5000ms (5 segundos)
setInterval(alternarTemaAutomatico, 1500);

async function buscarPokemons() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await response.json();
       
        totalCountLabel.innerText = data.count;

        const detalhes = data.results.map(p =>
            fetch(p.url).then(res => res.json())
        );

        pokemons = await Promise.all(detalhes);
        renderizar(pokemons);

    } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
    }
}

function renderizar(listaPokemons) {
    lista.innerHTML = "";

    listaPokemons.forEach(pokemon => {
        const col = document.createElement("div");
        col.className = "col-6 col-sm-4 col-md-3 col-lg-2 mb-2";

        const pokeId = pokemon.id.toString().padStart(4, '0');

        col.innerHTML = `
            <div class="card card-pokemon h-100 shadow-sm text-center">
                <div class="img-container">
                    <img src="${pokemon.sprites.front_default}" class="img-fluid" alt="${pokemon.name}">
                </div>
                <div class="card-body p-1">
                    <p class="card-title mb-1">#${pokeId} ${pokemon.name}</p>
                    <div class="d-flex justify-content-center flex-wrap gap-1">
                        ${pokemon.types.map(t =>
                            `<span class="badge badge-type text-capitalize">${t.type.name}</span>`
                        ).join("")}
                    </div>
                </div>
            </div>
        `;
        lista.appendChild(col);
    });
}

busca.addEventListener("input", function () {
    const valor = this.value.toLowerCase();
    const filtrados = pokemons.filter(p => p.name.includes(valor));
    renderizar(filtrados);
});

buscarPokemons();