const API_URL = "http://localhost:3000";

async function carregarCarousel() {
  const carousel = document.getElementById("carousel-content");
  if (!carousel) return;

  const response = await fetch(`${API_URL}/desenvolvedores`);
  const desenvolvedores = await response.json();
  const destaques = desenvolvedores.filter(dev => dev.destaque);

  destaques.forEach((dev, index) => {
    carousel.innerHTML += `
      <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <div class="carousel-bg" style="background-image:url('${dev.imagem}')">
          <div class="carousel-overlay">
            <div class="carousel-content">
              <h2>${dev.nome}</h2>
              <p>${dev.descricao}</p>
              <a href="detalhes.html?id=${dev.id}" class="btn-custom">Ver detalhes</a>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

async function carregarCards() {
  const container = document.getElementById("cards-container");
  if (!container) return;

  const response = await fetch(`${API_URL}/desenvolvedores`);
  const desenvolvedores = await response.json();

  desenvolvedores.forEach(dev => {
    container.innerHTML += `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card-custom">
          <div class="card-img-bg" style="background-image:url('${dev.imagem}')"></div>
          <div class="card-content">
            <h5>${dev.nome}</h5>
            <p>${dev.descricao}</p>
            <a href="detalhes.html?id=${dev.id}" class="btn-custom">Saiba mais</a>
          </div>
        </div>
      </div>
    `;
  });
}

async function carregarDetalhes() {
  const detalhes = document.getElementById("detalhes-container");
  if (!detalhes) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    detalhes.innerHTML = "<p>ID não informado. Volte para a página inicial.</p>";
    return;
  }

  const response = await fetch(`${API_URL}/desenvolvedores/${id}`);

  if (response.status === 404) {
    detalhes.innerHTML = "<p>Desenvolvedor não encontrado.</p>";
    return;
  }

  const dev = await response.json();

  detalhes.innerHTML = `
    <div class="details-wrapper">
      <div class="row g-0">
        <div class="col-lg-6">
          <div class="details-img" style="background-image:url('${dev.imagem}')"></div>
        </div>
        <div class="col-lg-6">
          <div class="details-content">
            <h2>${dev.nome}</h2>
            <p>${dev.conteudo}</p>
            <p><strong>País:</strong> ${dev.pais}</p>
            <p><strong>ID:</strong> ${dev.id}</p>
            <p><strong>Categoria:</strong> Desenvolvedor de Jogos</p>
            <p><strong>Status:</strong> Figura Influente da Indústria</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const obrasContainer = document.getElementById("atracoes-container");

  dev.obras.forEach(obra => {
    obrasContainer.innerHTML += `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="atracao-card">
          <div class="atracao-img" style="background-image:url('${obra.imagem}')"></div>
          <div class="atracao-content">
            <h5>${obra.nome}</h5>
            <p>${obra.descricao}</p>
          </div>
        </div>
      </div>
    `;
  });
}
async function carregarGraficos() {
  const res  = await fetch(`${API_URL}/desenvolvedores`);
  const devs = await res.json();

  const COLORS = ["#66c0f4", "#4fa3d6", "#3a8bbf", "#2a72a8", "#1e5c8a", "#f4a261", "#e76f51", "#2a9d8f"];
  Chart.defaults.color = "#c7d5e0";
  Chart.defaults.font  = { family: "Arial, Helvetica, sans-serif", size: 12 };

  new Chart(document.getElementById("chartObras"), {
    type: "bar",
    data: {
      labels: devs.map(d => d.nome.split(" ")[0]),
      datasets: [{
        label: "Nº de obras",
        data: devs.map(d => d.obras?.length || 0),
        backgroundColor: COLORS.slice(0, devs.length),
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: "#2a475e" } },
        y: { grid: { color: "#2a475e" }, beginAtZero: true, ticks: { stepSize: 1 } }
      }
    }
  });

  const porPais = devs.reduce((acc, d) => {
    acc[d.pais] = (acc[d.pais] || 0) + 1;
    return acc;
  }, {});

  new Chart(document.getElementById("chartPaises"), {
    type: "pie",
    data: {
      labels: Object.keys(porPais),
      datasets: [{
        data: Object.values(porPais),
        backgroundColor: COLORS.slice(0, Object.keys(porPais).length),
        borderColor: "#1b2838",
        borderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: { padding: 16, color: "#c7d5e0" }
        }
      }
    }
  });
}

if (document.getElementById("chartObras")) {
  carregarGraficos();
}

carregarCarousel();
carregarCards();
carregarDetalhes();