const form = document.getElementById("formulario");

const ulCardsList = document.getElementById("UlCardsList");

const inTitle = document.getElementById("input-title");
const inAbout = document.getElementById("input-about"); // SOBRE/ ABOUT = LINGUAGEM  ---  TODO
const inCategory = document.getElementById("input-category");
const inDescription = document.getElementById("input-description");
const inLink = document.getElementById("input-link");

const inSearch = document.getElementById("input-search");
const btnSearch = document.getElementById("btn-search");
const btnClearSearch = document.getElementById("btn-clear-search");

const nTotalCards = document.getElementById("n-total-cards");
const nFrontend = document.getElementById("n-frontend");
const nBackend = document.getElementById("n-backend");
const nFullStack = document.getElementById("n-fullstack");
const nSoftSkills = document.getElementById("n-softskills");

/*************************/

// CRIA VETOR DE CONTROLE
let cardsList = [];

//CONTROLA ESTADO DE EDIÇÃO DO FORM
let editingItemId = null;

// ***************** FUNÇÂO SALVAR LISTA ***************

function saveList() {
  const CardsJson = JSON.stringify(cardsList);
  localStorage.setItem("recipes", CardsJson);
}

// ***************** FUNÇÂO CARREGAR LISTA ***********
function recoverList() {
  const CardsJson = localStorage.getItem("recipes");
  if (CardsJson) {
    cardsList = JSON.parse(CardsJson);
  }
  updateScreen(cardsList);
}

// ***************** FUNÇÂO CRIAR CARD ***************
function createItem() {
  if (editingItemId) {
    //SALVA ITEM SENDO EDITADO
    const item = cardsList.find((item) => item.id === editingItemId);

    item.title = inTitle.value;
    item.about = inAbout.value;
    item.category = inCategory.value;
    item.description = inDescription.value;
    item.link = inLink.value;

    editingItemId = null;
    alert("Card alterado com sucesso!");
  } else {
    //CRIA NOVO CARD
    const newItem = {
      id: Date.now(),
      title: inTitle.value,
      about: inAbout.value,
      category: inCategory.value,
      description: inDescription.value,
      link: inLink.value,
    };

    cardsList.push(newItem);
    alert("Card cadastrado com sucesso!");
  }
  form.reset();
  updateScreen(cardsList);
  saveList();
}


// FUNÇÂO EDITAR ITENS
function editItem(itemToEdit) {
  const { title, about, category, description, link } = itemToEdit;

  inTitle.value = title;
  inAbout.value = about;
  inCategory.value = category;
  inDescription.value = description;
  inLink.value = link;

  editingItemId = itemToEdit.id;
}

function removeItem(itemId) {
  const response = confirm("Deseja realmente excluir o card?");

  if (response) {
    cardsList = cardsList.filter((item) => item.id !== itemId);

    updateScreen(cardsList);
    saveList();
  }
}

//CRIAR ELEMENTO HTML

function createItemElement(item) {
  const li = document.createElement("li");

  li.innerHTML = `
  <div class="Card-QuickTip">
     <h3><strong>${item.title}</strong></h3>
     <p><strong>Linguagem:</strong> ${item.about}</p>
    <p><strong>Categoria:</strong> ${item.category}</p>

      <p><strong>Descrição:</strong> 
      ${item.description}</p>

      <iframe src="${
        item.link // autoplay; 
      }"  class="iframe" width="350" height="315" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      
    <div class="div-card-btn">

    <button class="remove btn btn-outline-danger btn-card">🗑️ Excluir</button>
      <a href="#formulario"><button class="edit btn btn-outline-warning btn-card">📝 Editar</button><a>

      ${
        item.link
          ? `<button class="link btn btn-outline-primary btn-card">📹 Link</button>`
          : ""
      }

</div>
      </div>
  `;

  li.querySelector("button.remove").addEventListener("click", () => {
    console.log("REMOVE", item.id);
    removeItem(item.id);
  });

  li.querySelector("button.edit").addEventListener("click", () => {
    console.log("EDITA", item);
    editItem(item);
  });

  const btnLink = li.querySelector("button.link");

  if (btnLink) {
    btnLink.addEventListener("click", () => {
      window.open(item.link, "_blank").focus();
    });
  }
  return li;
}

// FUNÇÂO UPDATE CATEGORY

function updateCategories() {
  const totalFrontend = cardsList.reduce((acc, item) => {
    if (item.category === "Front-end") {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);

  const totalBackend = cardsList.reduce((acc, item) => {
    if (item.category === "Back-end") {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);

  const totalFullStack = cardsList.reduce((acc, item) => {
    if (item.category === "FullStack") {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);

  const totalSoftSkills = cardsList.reduce((acc, item) => {
    if (item.category === "SoftSkills") {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);

  nFrontend.innerText = totalFrontend;
  nBackend.innerText = totalBackend;
  nFullStack.innerText = totalFullStack;
  nSoftSkills.innerText = totalSoftSkills;
  nTotalCards.innerText =
  totalFrontend + totalBackend + totalFullStack + totalSoftSkills;
}

// ATUALIZA HTML DA LISTA

function updateScreen(list) {
  ulCardsList.innerHTML = "";
  list.forEach((item) => {
    const cards = createItemElement(item);
    ulCardsList.appendChild(cards);
  });
  updateCategories();
}

form.addEventListener("submit", (event) => {
  //evita o comportamento padrão do navegador
  event.preventDefault();
  //chama função de criação do novo Item
  createItem();
});

form.addEventListener("reset", (event) => {
  editingItemId = null;
});

btnSearch.addEventListener("click", () => {
  const filteredList = cardsList.filter((item) =>
    item.title.toLocaleLowerCase().includes(inSearch.value.toLocaleLowerCase())
  );
  updateScreen(filteredList);
});

btnClearSearch.addEventListener("click", () => {
  inSearch.value = "";
  updateScreen(cardsList);
});

recoverList();

