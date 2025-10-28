const myLibrary = [];

// Book constructor 
function Book({ title, author, pages, read, uuid = crypto.randomUUID(), humanId = randHumanId() }) {
  this.uuid = uuid;
  this.humanId = humanId;
  this.title = title;
  this.author = author;
  this.pages = Number(pages);
  this.read = Boolean(read);
}
Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

// # Generat0r
function randHumanId() {
  return Math.floor(1 + Math.random() * 200_000_000);
}

const STORAGE_KEY = "library.v1";

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(myLibrary));
}
function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const items = JSON.parse(raw);
  myLibrary.length = 0;
  for (const item of items) {
    myLibrary.push(new Book(item));
  }
}

// DOM 
const tbody = document.getElementById("tbody");
const btnAdd = document.getElementById("btnAdd");
const btnLoadDefaults = document.getElementById("btnLoadDefaults");
const btnClearStorage = document.getElementById("btnClearStorage");

const dlgAdd = document.getElementById("dlgAdd");
const formAdd = document.getElementById("formAdd");
const closeAdd = document.getElementById("closeAdd");
const addHumanIdSpan = document.getElementById("addHumanId");

const dlgEdit = document.getElementById("dlgEdit");
const formEdit = document.getElementById("formEdit");
const closeEdit = document.getElementById("closeEdit");
const editHumanIdSpan = document.getElementById("editHumanId");

// Render
function render() {
  tbody.innerHTML = "";

  for (const book of myLibrary) {
    const tr = document.createElement("tr");
    tr.dataset.uuid = book.uuid;

    tr.append(td(book.title));
    tr.append(td(book.author));
    tr.append(td(String(book.pages), "right"));
    tr.append(td(book.read ? "yes" : "no"));

    // Edit
    const editCell = document.createElement("td");
    editCell.className = "col-edit";
    const editBtn = document.createElement("button");
    editBtn.className = "row-btn";
    editBtn.title = "Edit";
    editBtn.innerHTML = '<span class="mdi mdi-square-edit-outline"></span>';
    editBtn.addEventListener("click", () => openEdit(book.uuid));
    editCell.append(editBtn);
    tr.append(editCell);

    // Remove
    const rmCell = document.createElement("td");
    rmCell.className = "col-remove";
    const rmBtn = document.createElement("button");
    rmBtn.className = "row-btn row-btn--danger";
    rmBtn.innerHTML = '<span class="mdi mdi-delete-outline"></span> Remove';
    rmBtn.addEventListener("click", () => removeBook(book.uuid));
    rmCell.append(rmBtn);
    tr.append(rmCell);

    // Read
    tr.children[3].style.cursor = "pointer";
    tr.children[3].title = "Click to toggle read status";
    tr.children[3].addEventListener("click", () => {
      book.toggleRead();
      save(); render();
    });

    tbody.append(tr);
  }
}

function td(text, align) {
  const el = document.createElement("td");
  el.textContent = text;
  if (align === "right") el.style.textAlign = "right";
  return el;
}

// Add
btnAdd.addEventListener("click", () => {
  addHumanIdSpan.textContent = randHumanId();
  dlgAdd.showModal();
});

closeAdd.addEventListener("click", () => dlgAdd.close());

formAdd.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(formAdd);
  const book = new Book({
    title: data.get("title").trim(),
    author: data.get("author").trim(),
    pages: Number(data.get("pages")),
    read: data.get("read") === "on",
    humanId: Number(document.getElementById("addHumanId").textContent) || randHumanId(),
  });

  myLibrary.push(book);
  save(); render();
  formAdd.reset();
  dlgAdd.close();
});

// Edit pt2
