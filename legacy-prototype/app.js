const formatPrice = (value) =>
  Number(value || 0).toLocaleString("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  });

const generateTableData = () => {
  const categories = ["Kostky", "Příručky", "Miniatury", "Mapy", "Doplňky"];
  const items = ["Dice", "Tome", "Set", "Module", "Deck", "Terrain", "Screen", "Tokens", "Guide", "Kit"];
  const adjectives = ["Ember", "Shadow", "Crystal", "Raven", "Obsidian", "Mythic", "Aurora", "Draco", "Elder", "Arcane"];
  const availability = ["Skladem", "Na cestě", "Předobjednávka"];

  return Array.from({ length: 50 }).map((_, index) => {
    const id = index + 1;
    const product = `${adjectives[index % adjectives.length]} ${items[index % items.length]}`;
    const category = categories[index % categories.length];
    const price = 320 + index * 35;
    const status = availability[index % availability.length];
    return {
      code: `DK-${String(id).padStart(3, "0")}`,
      product,
      category,
      status,
      price,
    };
  });
};

const statusBadge = (status) => {
  if (status === "Skladem") return "bg-success";
  if (status === "Na cestě") return "bg-warning text-dark";
  return "bg-secondary";
};

$(function initPage() {
  const data = generateTableData();
  const tbody = $("#productTable tbody");

  const rowsHtml = data
    .map(
      (item) => `
      <tr data-code="${item.code}">
        <td>${item.code}</td>
        <td>${item.product}</td>
        <td>${item.category}</td>
        <td><span class="badge ${statusBadge(item.status)}">${item.status}</span></td>
        <td>${formatPrice(item.price)}</td>
      </tr>
    `,
    )
    .join("");

  tbody.html(rowsHtml);

  const table = $("#productTable").DataTable({
    pageLength: 8,
    lengthChange: false,
    order: [[0, "asc"]],
    language: {
      search: "Hledat:",
      paginate: { previous: "Předchozí", next: "Další" },
      info: "Zobrazeno _START_–_END_ z _TOTAL_ položek",
      infoEmpty: "Žádné položky k zobrazení",
      emptyTable: "Žádná data",
    },
  });

  const loreModal = new bootstrap.Modal(document.getElementById("loreModal"));
  const loreText = document.getElementById("loreModalText");

  $("#productTable tbody").on("click", "tr", function handleRowClick() {
    const rowData = table.row(this).data();
    if (!rowData) return;
    const [code, product, category, status, price] = rowData;
    loreText.textContent = `Kronika: ${product} (${code}) z kategorie ${category} je aktuálně "${$(status).text().trim() || status}". Cena ${price}.`;
    loreModal.show();
  });

  $("#loreDetailBtn").on("click", () => {
    const randomItem = data[Math.floor(Math.random() * data.length)];
    loreText.textContent = `Náhodný záznam: ${randomItem.product} (${randomItem.code}) – ${randomItem.status}, ${formatPrice(
      randomItem.price,
    )}.`;
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const el = document.querySelector(targetId);
      if (el) {
        event.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  const form = document.querySelector("form.needs-validation");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.classList.add("was-validated");
    });
  }
});
