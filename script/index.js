'use strict'

const form = document.querySelector(".form");
const responseData = document.querySelector(".response");
const path = "https://api.github.com/search/repositories";

async function getRepositories(name) {
    const response = await fetch(`${path}?q=${name}&per_page=10`);

    if (!response.ok) throw new Error("Ошибка получения данных");

    const result = await response.json();
    return result;
}

function setListOfResults(data) {
    const list = document.createElement("ul");
    list.classList.add("output-block__list");

    data.forEach(item => {
        list.innerHTML += `
      <li class="output-block__item">
        <div class="item-box">
          <a class="item-box__link" href="${item.html_url}" target="_blank">${item.name}</a>
          ${item.language ? `<p class="item-box__language">Язык: ${item.language}</p>` : ""}
          <p class="item-box__stars">Звезд: ${item.stargazers_count} &star;</p>
          <p class="item-box__created-at">Создан: ${new Date(item.created_at).toLocaleDateString()}</p>
        </div>
        <div class="user-info">
          <a class="user-info__link" href="${item.owner.html_url}" target="_blank">
            <img class="user-info__avatar" src="${item.owner.avatar_url}" alt="user-avatar">
            <span class="user-info__name">&copy; ${item.owner.login}</span>
          </a>
        </div>
      </li>
    `;
    });

    return list;
}

function setNotFoundMessage() {
    const p = document.createElement("p");
    p.classList.add("output-block__empty");
    p.innerHTML = "Ничего не найдено";
    return p;
}

function setErrorMessage(error) {
    const errorElem = document.createElement("p");
    errorElem.classList.add("output-block__error");
    errorElem.innerHTML = error.message;
    return errorElem;
}

function getValidation() {
    if (form.children.length < 3) {
        const error = document.createElement("p");
        error.classList.add("container-form__error");
        error.innerHTML = "Введите более 2-х символов";
        form.append(error);
    }
}

function clearResponseData() {
    responseData.innerHTML = "";
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputText = form.text.value;
    form.text.value = "";

    if (inputText.length < 3) {
        getValidation();
        return;
    }

    clearResponseData();

    try {
        const data = await getRepositories(inputText);

        const result = data.items.length > 0 ? setListOfResults(data.items) : setNotFoundMessage();

        responseData.append(result);
    } catch (err) {
        const error = setErrorMessage(err);
        responseData.append(error);
    }

});


form.addEventListener("keydown", () => document.querySelector(".container-form__error")?.remove());