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

async function createOption() {
  try {
    showLoader();

    const categories = await jsonRequest(
      "https://fakestoreapi.com/products/categories"
    );

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.innerText = category;
      select.appendChild(option);
    });

    hideLoader();

  } catch (error) {
    console.error("Error fetching categories:", error);
    hideLoader();
  }
}

createOption();

async function getProducts(category) {
  const productsContainer = document.querySelector(".productsContainer");
  productsContainer.innerHTML = "";

  showLoader();

  try {
    let apiUrl;
    if (category) {
      apiUrl = `https://fakestoreapi.com/products/category/${category}`;
    } else {
      apiUrl = "https://fakestoreapi.com/products";
    }

    const data = await jsonRequest(apiUrl);

    data.forEach((product) => {
      const productItem = renderProduct(product);
      productsContainer.append(productItem);
    });

    hideLoader();
  } catch (error) {
    console.error("Error fetching data:", error);
    hideLoader();
  }
}
getProducts();
 
select.addEventListener("change", (event) => {
  getProducts(event.target.value);
});

async function jsonRequest(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return await response.json();
}
