const modal = document.querySelector('#modal');
const modalShow = document.querySelector('#show-modal');
const modalClose = document.querySelector('#close-modal');
const bookmarkForm = document.querySelector('#bookmark-form');
const websiteNameEl = document.querySelector('#website-name');
const websiteUrlEl = document.querySelector('#website-url');
const bookmarksContainer = document.querySelector('#bookmarks-container');

// state
let bookmarks = [];

// show modal, focus on the first input in modal
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// modal event listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click',
    (e) => (e.target === modal) ? modal.classList.remove('show-modal') : false);

// validate form
function validate(name, url) {
    const expression =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!name || !url) {
        alert('Please submit values for both fields')
        return false;
    }
    if (!url.match(regex)) {
        alert('Please provide a valid web address');
        return false;
    }
    // valid
    return true
}

function buildBookmarks() {
    // remove all bookmark elements
    bookmarksContainer.textContent = '';
    // build bookmarks DOM
    bookmarks.forEach((bookmark) => {
        const {name, url} = bookmark;
        // item
        const item = document.createElement('div');
        item.classList.add('item');
        // close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // favicon - link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://www.google.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        // link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);

    })
}

// fetch bookmarks from localStorage if available
function fetchBookmarks() {
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // create bookmarks array in localStorage
        bookmarks = [
            {
                name: 'Ivan Kayn portfolio',
                url: 'https://ivan-kayn.it',
            }
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

function deleteBookmark(url) {
    bookmarks.forEach((bookmark, index) => {
        if (bookmark.url === url) {
            bookmarks.splice(index, 1);
        }
    })
    // update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// handle data from form
function storeBookmark(event) {
    event.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('http://', 'https://')) {
        urlValue = `https://${urlValue}`;
    }

    if (!validate(nameValue, urlValue)) {
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };

    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();

}

// event listeners
bookmarkForm.addEventListener('submit', storeBookmark);

// on load
fetchBookmarks();