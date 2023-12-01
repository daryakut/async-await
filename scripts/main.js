function renderProduct(product) {
  const productCard = document.createElement("div");
  productCard.classList.add("productCard");

  productCard.addEventListener("click", (event) => {
    productCard.classList.toggle("productCardHighlighted");
  });

  const productTitle = document.createElement("h3");
  productTitle.textContent = product.name;
  productTitle.classList.add("productTitle");

  const productPrice = document.createElement("p");
  productPrice.textContent = product.price;
  productPrice.classList.add("productPrice");

  const productCategory = document.createElement("p");
  productCategory.textContent = product.category;
  productCategory.classList.add("productCategory");

  const productImg = document.createElement("img");
  productImg.src = !!product.img ? product.img : "";
  productImg.classList.add("productImg");

  const productDescription = document.createElement("p");
  productDescription.textContent = product.description;
  productDescription.classList.add("productDescription");

  productCard.append(
    productImg,
    productTitle,
    productPrice,
    productCategory,
    productDescription
  );

  return productCard;
}

// 1. Пишем сетевой запрос. Наша задача - обратиться к "бэку" по адресу `https://fakestoreapi.com/products/categories` GET-запросом, и вывести в консоль результат в "удобоваримом" виде (результат нам возвращается в виде JSON). Этот запрос нам вернет массив с категориями товаров.

// fetch("https://fakestoreapi.com/products/categories")
//   .then((response) => response.json())
//   .then((data) => console.log(data));

//   2. Добавляем в разметку ПЕРЕД блоком `.productsContainer` компонент `select` (выпадающее меню). Нужно заполнить этот `select` опциями (`<option value='value'>option_text</option>`), которые нам пришли с "бэка" в предыдущей задаче. То есть, пройтись по массиву результатов, для каждого создать элемент `option`, и добавить его в наш `select`. В качестве `value` используем значение, в качестве `option_text` используем то же.
const select = document.createElement("select");
const main = document.querySelector(".mainContainer");
main.prepend(select);

const loader = document.createElement("div");
loader.classList.add("loader");
loader.textContent = "Подождите, идет загрузка...";
main.prepend(loader);

function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
}

function createOption(data) {
  data.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.innerText = category;
    select.appendChild(option);
  });
}

fetch("https://fakestoreapi.com/products/categories")
  .then((response) => response.json())
  .then((data) => createOption(data));

//Пишем функцию `getProducts`. В качестве аргумента, она принимает категорию товаров. Она должна сделать запрос по адресу `https://fakestoreapi.com/products/category/CATEGORY`. В ответ нам придет список товаров этой категории. Наша задача - отрендерить их в списке товаров (`div.productsContainer`).  ВАЖНО! Список товаров перед рендерингом надо очистить! Товары рендерим с помощью функции `renderProduct`, она умеет создавать DOM-элемент, но нужно его еще добавить в контейнер.

function getProducts(category) {
  const productsContainer = document.querySelector(".productsContainer");
  productsContainer.innerHTML = "";
  showLoader();

  let apiUrl;
  if (category) {
    apiUrl = `https://fakestoreapi.com/products/category/${category}`;
  } else {
    apiUrl = "https://fakestoreapi.com/products";
  }

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((product) => {
        const productItem = renderProduct(product);
        productsContainer.append(productItem);
      });
      hideLoader();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);

      hideLoader();
    });
}

getProducts();

//  getProducts("electonics");
select.addEventListener("change", (event) => {
  getProducts(event.target.value);
});

//4. Дорабатываем функцию `getProducts`. Нужно добавить рассмотрение случая, когда у нас не задана категория (хотим запросить все товары). Нужно сделать так, чтобы, если в аргументе не передана категория, то запрос шел на адрес `https://fakestoreapi.com/products`.
