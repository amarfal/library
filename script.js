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
