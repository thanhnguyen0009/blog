document.addEventListener('DOMContentLoaded', function() {
    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.querySelector('.searchClose');

    if (searchBar && searchInput && searchClose) {
        allButtons.forEach(button => {
            button.addEventListener('click', function() {
                searchBar.style.visibility = 'visible';
                searchBar.classList.add('open');
                searchClose.setAttribute('aria-expanded', 'true');
                searchInput.focus();
            });
        });

        searchClose.addEventListener('click', function() {
            searchBar.style.visibility = 'hidden';
            searchBar.classList.remove('open');
            searchClose.setAttribute('aria-expanded', 'false');
        });
    } else {
        console.error('One or more elements are not found in the DOM.');
    }
});
