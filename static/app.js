const input = document.getElementById("ingredient-input");
const chipsEl = document.getElementById("chips");
const goBtn = document.getElementById("go");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const shelf = document.getElementById("shelf");

let ingredients = [];

function renderChips() {
  chipsEl.replaceChildren();
  ingredients.forEach((name, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = name;
    btn.title = "Remove " + name;
    btn.addEventListener("click", () => {
      ingredients.splice(i, 1);
      renderChips();
    });
    li.appendChild(btn);
    chipsEl.appendChild(li);
  });
  goBtn.disabled = ingredients.length === 0;
}

function addIngredient(value) {
  const name = value.trim().replace(/,$/, "").trim();
  if (!name) return;
  if (!ingredients.some((x) => x.toLowerCase() === name.toLowerCase())) {
    ingredients.push(name);
  }
  input.value = "";
  renderChips();
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault();
    addIngredient(input.value);
  } else if (e.key === "Backspace" && !input.value && ingredients.length) {
    ingredients.pop();
    renderChips();
  }
});

input.addEventListener("paste", (e) => {
  const text = (e.clipboardData || window.clipboardData).getData("text");
  if (text.includes(",") || text.includes("\n")) {
    e.preventDefault();
    text.split(/[,\n]/).forEach(addIngredient);
  }
});

shelf.addEventListener("click", () => input.focus());

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function tagList(label, items, className) {
  const wrap = el("div", "taglist");
  wrap.appendChild(el("span", "taglist-label", label));
  items.forEach((t) => wrap.appendChild(el("span", "tag " + className, t)));
  return wrap;
}

function renderRecipes(data) {
  resultsEl.replaceChildren();
  (data.recipes || []).forEach((r) => {
    const article = el("article", "recipe");
    article.appendChild(el("h2", "", r.name));
    article.appendChild(el("p", "meta", [r.time, r.difficulty].filter(Boolean).join(", ")));

    if (r.uses && r.uses.length) article.appendChild(tagList("From your fridge", r.uses, "have"));
    if (r.missing && r.missing.length) article.appendChild(tagList("Nice to add", r.missing, "missing"));

    const ol = el("ol", "steps");
    (r.steps || []).forEach((s) => ol.appendChild(el("li", "", s)));
    article.appendChild(ol);
    resultsEl.appendChild(article);
  });
  if (data.note) resultsEl.appendChild(el("p", "note", data.note));
  resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

goBtn.addEventListener("click", async () => {
  if (input.value.trim()) addIngredient(input.value);
  goBtn.disabled = true;
  goBtn.textContent = "Cooking up ideas...";
  statusEl.hidden = true;
  resultsEl.replaceChildren();

  try {
    const res = await fetch("/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong.");
    renderRecipes(data);
  } catch (err) {
    statusEl.textContent = err.message;
    statusEl.hidden = false;
  } finally {
    goBtn.textContent = "Find recipes";
    goBtn.disabled = ingredients.length === 0;
  }
});
