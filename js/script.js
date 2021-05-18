const inputField = document.querySelector('.form-control');
const form = document.querySelector('.needs-validation');
const spinnerElement = document.querySelector('.my-spinner');

function handleSubmit(e) {
  e.preventDefault();
  const inputData = checkData(inputField.value);

  inputData
    ? handleSearch(inputData)
    : displayError('Valid input is required.');

  inputField.value = '';
}

const checkData = (rawData) =>
  rawData.trim().toLowerCase().length > 0
    ? rawData.trim().toLowerCase()
    : false;

async function handleSearch(inputData) {
  spinner('show');
  const bookData = await fetchData(inputData);
  displayData(bookData);
}

function displayError(message) {
  const errorDiv = document.querySelector('.invalid-feedback');

  errorDiv.innerText = message;

  errorDiv.style.display = 'block';

  setTimeout(() => (errorDiv.style.display = 'none'), 3000);
}

async function fetchData(inputData) {
  const searchString = `https://www.googleapis.com/books/v1/volumes?q=${inputData}&startIndex=0&maxResults=20`;

  const response = await fetch(searchString);

  return await response.json();
}

function displayData(data) {
  if (!data.items) return displayError('No results found.');

  const booksContainer = document.querySelector('.books-container');

  spinner('hide');

  booksContainer.innerHTML = '';

  data.items.forEach((el) => {
    booksContainer.innerHTML += `
    <div class="col">
    <div class="card shadow-sm">
        <img class="my-img" width="200" height="307"src="${
          el.volumeInfo.imageLinks?.thumbnail
            ? el.volumeInfo.imageLinks.thumbnail
            : ''
        }"></img>

      <div class="card-body">
        <p class="card-text">${formatText(el.volumeInfo.description)}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <a class="btn btn-sm btn-outline-secondary" href="${
              el.volumeInfo.infoLink
            }" target="_blank" role="button">View More</a>
          </div>
          <small class="text-muted">Published: ${
            el.volumeInfo.publishedDate
          }</small>
        </div>
      </div>
    </div>
  </div>
  `;
  });
}

function formatText(text) {
  if (text) {
    let newText = text.slice(0, 200);

    return newText + '...';
  }
  return 'No description found';
}

const spinner = (type) =>
  (spinnerElement.style.display = type === 'show' ? 'block' : 'none');

form.addEventListener('submit', handleSubmit);
