const telegramApiSelect = document.querySelector("#telegram-api-select");
const telegramApiName = document.querySelector("#telegram-api-name");
const telegramApiDescription = document.querySelector("#telegram-api-description");
const telegramApiFit = document.querySelector("#telegram-api-fit");
const telegramApiLink = document.querySelector("#telegram-api-link");
const methodBrowser = document.querySelector("#telegram-method-browser");
const heroStats = document.querySelector(".intro-stats");
const methodSearch = document.querySelector("#method-search");
const methodSelect = document.querySelector("#telegram-method-select");
const methodCount = document.querySelector("#method-count");
const heroMethodCount = document.querySelector("#hero-method-count");
const methodName = document.querySelector("#method-name");
const methodId = document.querySelector("#method-id");
const methodReturn = document.querySelector("#method-return");
const methodParams = document.querySelector("#method-params");
const parameterCount = document.querySelector("#parameter-count");
let telegramMethods = [];

const telegramApis = {
  bot: {
    name: "Bot API",
    description: "Build bots that respond to messages and provide services inside Telegram through a simplified HTTPS interface.",
    fit: "Separate method reference",
    url: "https://core.telegram.org/bots/api",
  },
  client: {
    name: "Telegram API / MTProto",
    description: "Methods for building custom Telegram clients. TDLib handles networking, encryption, and local data storage.",
    fit: "Client API methods are listed below",
    url: "https://core.telegram.org/api",
  },
  gateway: {
    name: "Gateway API",
    description: "Send Telegram verification codes to users as an alternative to SMS through the Telegram Gateway service.",
    fit: "Separate service documentation",
    url: "https://core.telegram.org/gateway",
  },
  widgets: {
    name: "Telegram Widgets",
    description: "Add selected Telegram features, such as login or sharing, to a website. Widgets are not a full Telegram client or bot API.",
    fit: "Separate integration documentation",
    url: "https://core.telegram.org/widgets",
  },
};

function showTelegramApi(value) {
  const api = telegramApis[value];
  if (!api) return;
  methodBrowser.hidden = value !== "client";
  heroStats.hidden = value !== "client";
  telegramApiName.textContent = api.name;
  telegramApiDescription.textContent = api.description;
  telegramApiFit.textContent = api.fit;
  telegramApiLink.href = api.url;
}

function showTelegramMethod(method) {
  if (!method) return;
  methodName.textContent = method.method;
  methodId.textContent = method.id;
  methodReturn.textContent = method.type;
  parameterCount.textContent = method.params.length ? `${method.params.length} parameters` : "No parameters";
  methodParams.replaceChildren();

  if (method.params.length === 0) {
    const empty = document.createElement("p");
    empty.className = "detail-placeholder";
    empty.textContent = "This method has no parameters.";
    methodParams.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const param of method.params) {
    const row = document.createElement("div");
    row.className = "parameter-row";
    const name = document.createElement("code");
    name.textContent = param.name;
    const type = document.createElement("span");
    type.textContent = param.type;
    row.append(name, type);
    fragment.append(row);
  }
  methodParams.append(fragment);
}

function renderTelegramMethods(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredMethods = telegramMethods.filter((method) => {
    const searchable = [method.method, method.type, ...method.params.flatMap((param) => [param.name, param.type])]
      .join(" ")
      .toLowerCase();
    return searchable.includes(normalizedQuery);
  });
  const selectedMethod = methodSelect.value;
  const groups = new Map();

  for (const method of filteredMethods) {
    const separator = method.method.indexOf(".");
    const namespace = separator === -1 ? "General" : method.method.slice(0, separator);
    if (!groups.has(namespace)) groups.set(namespace, []);
    groups.get(namespace).push(method);
  }

  methodSelect.replaceChildren();
  for (const namespace of [...groups.keys()].sort()) {
    const group = document.createElement("optgroup");
    group.label = namespace;
    for (const method of groups.get(namespace)) {
      const option = document.createElement("option");
      option.value = method.method;
      option.textContent = method.method;
      group.append(option);
    }
    methodSelect.append(group);
  }

  methodCount.textContent = normalizedQuery
    ? `${filteredMethods.length} of ${telegramMethods.length} methods`
    : `${telegramMethods.length} methods`;
  heroMethodCount.textContent = String(telegramMethods.length);

  const selected = filteredMethods.find((method) => method.method === selectedMethod) || filteredMethods[0];
  if (selected) {
    methodSelect.value = selected.method;
    showTelegramMethod(selected);
  } else {
    methodName.textContent = "No matching methods";
    methodId.textContent = "—";
    methodReturn.textContent = "—";
    parameterCount.textContent = "0 parameters";
    methodParams.replaceChildren();
    const empty = document.createElement("p");
    empty.className = "detail-placeholder";
    empty.textContent = "Try another method name, parameter, or type.";
    methodParams.append(empty);
  }
}

async function loadTelegramMethods() {
  try {
    const response = await fetch("./telegram-methods.json");
    if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
    const methods = await response.json();
    if (!Array.isArray(methods)) throw new Error("Catalog format is invalid");
    telegramMethods = methods.sort((left, right) => left.method.localeCompare(right.method));
    renderTelegramMethods(methodSearch.value);
  } catch {
    methodCount.textContent = "Catalog unavailable";
    methodName.textContent = "Could not load the API catalog";
    parameterCount.textContent = "";
    methodParams.replaceChildren();
    const error = document.createElement("p");
    error.className = "detail-placeholder";
    error.textContent = "The local catalog could not be loaded. Reload the page or regenerate the catalog.";
    methodParams.append(error);
  }
}
telegramApiSelect.addEventListener("change", () => showTelegramApi(telegramApiSelect.value));
methodSearch.addEventListener("input", () => renderTelegramMethods(methodSearch.value));
methodSelect.addEventListener("change", () => {
  const selected = telegramMethods.find((method) => method.method === methodSelect.value);
  showTelegramMethod(selected);
});
window.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    methodSearch.focus();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}

showTelegramApi(telegramApiSelect.value);
loadTelegramMethods();