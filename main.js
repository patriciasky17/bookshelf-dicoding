const books = [];
const RENDER_EVENT = 'render-books';

function generateId() {
    return +new Date();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function generateBook(id, title, author, year, genre, isComplete){
    return{
        id,
        title,
        author,
        year,
        genre,
        isComplete
    }
}

function createBook(bookObject) {
    document.getElementsByClassName('bagian-input')[0].style.display = 'block';

    const {id, title, author, year, genre, isComplete} = bookObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textGenre = document.createElement('p');
    textGenre.innerText = "Genre : " + genre;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Penulis : " + author;

    const textYear = document.createElement('p');
    textYear.innerText = "Tahun : " + year;

    const textContainer = document.createElement('article');
    textContainer.classList.add('buku-satuan');
    textContainer.append(textTitle, textGenre, textAuthor, textYear);    

    const containerAction = document.createElement('div');
    containerAction.classList.add('tombol-aksi');
    textContainer.append(containerAction);
    textContainer.setAttribute('id', `book-${id}`);

    if (isComplete) {
        const tombolUndo = document.createElement('button');
        tombolUndo.classList.add('hijau');
        tombolUndo.innerText = 'Undo ⟲';
        tombolUndo.addEventListener('click', function () {
            undoBookFromCompleted(id);
            alert("Buku dipindahkan ke belum selesai dibaca!");
        });

        const tombolDelete = document.createElement('button');
        tombolDelete.classList.add('merah');
        tombolDelete.innerText = 'Delete 🗑';
        tombolDelete.addEventListener('click', function () {
            let choice = confirm("Buku dengan judul " + title + " akan dihapus! Apakah kamu yakin?");
            if(choice){
                alert("Buku dengan judul " + title + " telah dihapus!");
                removeBookFromCompleted(id);
            } else{
                alert("Buku dengan judul " + title + " tidak jadi dihapus!");
            }
        });

        const tombolEdit = document.createElement('button');
        tombolEdit.classList.add('kuning');
        tombolEdit.innerText = 'Edit ✎';

        const bagianEditBuku = document.getElementsByClassName('bagian-edit');
        bagianEditBuku[0].style.display = 'none';

        tombolEdit.addEventListener('click', function () {
            document.getElementsByClassName('bagian-input')[0].style.display = 'none';
            bagianEditBuku[0].style.display = 'block';
            detailBook(id);
            alert("Buku dengan judul " + title + " akan diedit!");
        });

        containerAction.append(tombolUndo, tombolEdit, tombolDelete);
    } else {
        const tombolSelesai = document.createElement('button');
        tombolSelesai.classList.add('hijau');
        tombolSelesai.innerText = 'Done ✓';
        tombolSelesai.addEventListener('click', function () {
            addBookToCompleted(id);
            alert("Buku telah selesai dibaca!");
        });

        const tombolDelete = document.createElement('button');
        tombolDelete.classList.add('merah');
        tombolDelete.innerText = 'Delete 🗑';
        tombolDelete.addEventListener('click', function () {
            let choice = confirm("Buku dengan judul " + title + " akan dihapus! Apakah kamu yakin?");
            if(choice){
                alert("Buku dengan judul " + title + " telah dihapus!");
                removeBookFromCompleted(id);
            } else{
                alert("Buku dengan judul " + title + " tidak jadi dihapus!");
            }
        });

        const tombolEdit = document.createElement('button');
        tombolEdit.classList.add('kuning');
        tombolEdit.innerText = 'Edit ✎';

        const bagianEditBuku = document.getElementsByClassName('bagian-edit');
        bagianEditBuku[0].style.display = 'none';

        tombolEdit.addEventListener('click', function () {
            document.getElementsByClassName('bagian-input')[0].style.display = 'none';
            bagianEditBuku[0].style.display = 'block';
            detailBook(id);
            alert("Buku dengan judul " + title + " akan diedit!");
        });

        containerAction.append(tombolSelesai, tombolEdit, tombolDelete);
    }
    return textContainer;
}

function addBook() {
    const textBook = document.getElementById('inputJudulBuku').value;
    const textAuthor = document.getElementById('inputPenulis').value;
    const textYear = document.getElementById('inputTahunTerbit').value;
    const textGenre = document.getElementById('inputGenreBuku').value;
    const checkComplete = document.getElementById('inputSelesaiBaca');

    if (checkComplete.checked == true){
        const generatedID = generateId();
        const bookObject = generateBook(generatedID, textBook, textAuthor, textYear, textGenre, true);
        books.push(bookObject);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();

    } else {
        const generatedID = generateId();
        const bookObject = generateBook(generatedID, textBook, textAuthor, textYear, textGenre, false);
        books.push(bookObject);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
    
}

function addBookToCompleted(bookId) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const editTextBook = document.getElementById('editJudulBuku');
const editTextAuthor = document.getElementById('editPenulis');
const editTextYear = document.getElementById('editTahunTerbit');
const editTextGenre = document.getElementById('editGenreBuku');

function detailBook(bookId) {
    const bookTarget = findBook(bookId);

    const bookIndex = findBookIndex(bookId);

    const editForm = document.getElementById('editBukuSatuan');

    if (bookTarget == null) return;

    editTextBook.value = bookTarget.title;
    editTextAuthor.value = bookTarget.author;
    editTextYear.value = bookTarget.year;
    editTextGenre.value = bookTarget.genre;

    editForm.addEventListener('submit', function (event) {
        event.preventDefault();
        updateBook({
            id: books[bookIndex].id,
            title: editTextBook.value,
            author: editTextAuthor.value,
            year: editTextYear.value,
            genre: editTextYear.value,
        });
        alert("Buku berhasil diedit!");
        editForm.reset();
    });
}


function updateBook(bookObject) {
    const { id, title, author, genre, year } = bookObject;

    const book = findBook(id);

    const newTitle = editTextBook.value;
    const newAuthor = editTextAuthor.value;
    const newYear = editTextYear.value;
    const newGenre = editTextGenre.value;

    book.title = newTitle;
    book.author = newAuthor;
    book.year = newYear;
    book.genre = newGenre;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBukuSatuan');

    const searchInput = document.getElementById('cariBukuSatuan');

    searchInput.addEventListener('keyup', function () {
        searchKeyword = searchInput.value;
        document.dispatchEvent(new Event(RENDER_EVENT));
    });

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
        alert("Buku berhasil ditambahkan!");
        submitForm.reset();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const listBukuBelumSelesaiBaca = document.getElementById('listBukuBelumSelesai');
    const listBukuSelesaiBaca = document.getElementById('listBukuSelesai');

    listBukuBelumSelesaiBaca.innerHTML = '';
    listBukuSelesaiBaca.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = createBook(bookItem);
        if (bookItem.isComplete) {
            listBukuSelesaiBaca.append(bookElement);
            
        } else {
            listBukuBelumSelesaiBaca.append(bookElement);
        }
    }
});

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.getElementById('cariBuku').addEventListener("click", function (event){
    event.preventDefault();
    const searchBook = document.getElementById('cariJudulBuku').value.toLowerCase();
    const listBuku = document.querySelectorAll('.buku-satuan > h3');
    for (buku of listBuku) {
        if (buku.innerText.toLowerCase().includes(searchBook)){
            buku.parentElement.style.display = "block";
        } else {
            console.log(buku.innerText.toLowerCase());
            buku.parentElement.style.display = "none";
        }
    }
})