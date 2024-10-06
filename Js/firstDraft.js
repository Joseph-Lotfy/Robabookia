/*---------Search Container --------------*/
// document.getElementById('searchContainer').addEventListener('click', (e) =>{
//     if (!e.target.closest('.book-search-form')) {
//         let parent = e.target.closest('.search');
//         const form = parent.querySelector('.book-search-form');
//         if (form.classList.contains('show')) {
//             // Start fading out by removing the show class
//             form.classList.remove('show');
//             // Wait for the opacity transition to finish before hiding the element
//             setTimeout(() => {
//                 form.style.visibility = 'hidden';
//             }, 200); // This matches the transition duration (0.5s)
            
//         } else {
//             // Make it visible immediately, then trigger the opacity animation
//             form.style.visibility = 'visible';
//             form.classList.add('show');
//             console.log(form)
//             const bodyClickHandler = (e) => {
//                 if (!e.target.closest('.book-search-form') && !e.target.closest('.search')) {
//                     form.classList.remove('show');
                    
//                     // Wait for the opacity transition to finish before hiding the element
//                     setTimeout(() => {
//                         form.style.visibility = 'hidden';
//                     }, 200); // This matches the transition duration (0.2s)
                    
//                     // Remove the body event listener once the task is done
//                     document.removeEventListener('click', bodyClickHandler);
//                 }
//             };
//             document.addEventListener('click', bodyClickHandler);
//         }
//     }
// })

/*---------Fetch Book Detaiks-------------*/
document.getElementById('book-search-form').addEventListener('submit', function(e) {
    const container = document.getElementById('cards-container');
    container.innerHTML = '<div class="loader" id="loader"></div>';
    e.preventDefault(); // Prevent the page from refreshing
    const query = document.getElementById('book-search-input').value;
    // let dropDown = document.getElementById('dropDown');
    // dropDown.innerHTML = "Choose a Genre"
    showLoader(); // Show the loader when fetching starts
    fetchBookCovers(query);
});
function fetchBookCovers(query) {
    fetch(`https://openlibrary.org/search.json?title=${query}`)
        .then(response => response.json())
        .then(data => {
            const books = data.docs.slice(0, 6); // Get the first 6 books
            if (books.length > 0) {
                const descriptionPromises = books.map(book => getBookDetails(book.key));
                Promise.all(descriptionPromises).then(descriptions => {
                    displayBookCovers(books, descriptions);
                });
            } else {
                displayError('No books found');
                hideLoader(); // Hide the loader if no books found
            }
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            displayError('An error occurred');
            hideLoader(); // Hide the loader in case of an error
        });
}
/*---------show and Hide Loader-------------*/
function showLoader() {
    document.getElementById('loader').style.display = 'block'; // Show the loader
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none'; // Hide the loader
}

/*---------Constructing Books-------------*/
function displayBookCovers(books, details) {
    const container = document.getElementById('cards-container');
    container.innerHTML = ''; // Clear previous results
    books.forEach((book, index) => {
        const coverId = book.cover_i;
        const title = book.title;
        const author = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
        const bookUrl = findEnglishEdition(book); // Get the English edition URL
        const descriptionText = details[index].description || 'No description available';
        const genres = details[index].subjects || 'No genre available';
        const cleanedDescription = cleanDescription(descriptionText).slice(0,400) + "..."; 
        const randomNumber = coverId%1000;
        if (coverId) {
            const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
            container.innerHTML += `
                <div class="card haveHover" data-genre="${genres}">
                  <div class="card-img">
                   <img class="bookImg" src="${coverUrl}" alt="Book Cover">
                  </div>
                    <div class="card-info">
                        <h2 class="bookTitle">${title}</h2>
                        <p>${author}</p>
                        <div class="icons">
                            <p class="p3 price">$${randomNumber}</p>
                        </div>
                        <div class="buttons">
                            <button class="btn-details showDescription haveHover">Description</button>
                            <button class="btn-buy haveHover buy" id="${coverId}">Buy <i class="fa-solid fa-cart-plus"></i></button>
                        </div>
                    </div>
                    <div class="popoverr">
                        <div class="descriptionBox">
                            <button class="hideDescription">x</button>   
                            <div class="descriptionBookDetails">
                                <img class="descriptionImage" src="${coverUrl}" alt="Cover of ${title}">
                                <div>
                                    <div>
                                        <h4>${title}</h4>
                                        <p class="descName">${author}</p>
                                    </div>
                                    <p class="descText">${cleanedDescription}</p>
                                    <a href="${bookUrl}" target="_blank">
                                        <button type="button" class="moreDetails btn-secondary" class="moreDetails">See more Details</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
              </div>

            `;
        } 
    });
    hideLoader(); // Hide the loader after displaying results
}

/*---------Hide Description-------------*/
document.body.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('hideDescription')) {
        const button = e.target;
        const popoverr = button.closest('.popoverr');
        const hoverBooks = document.body.querySelectorAll('.notHover')
        const blackScreen = document.body.querySelector('.blackScreen')
        hoverBooks.forEach((hoverBook) =>{
            hoverBook.classList.remove('notHover')
            hoverBook.classList.add('haveHover')
        })
        popoverr.remove()
        blackScreen.remove()
    }
});

/*---------Show Description-------------*/
document.getElementById('cards-container').addEventListener('click', (e) => {
    if (e.target && e.target.closest('.showDescription')) {
        const button = e.target.closest('.showDescription');
        const book = button.closest('.card');
        const desc = book.querySelector('.popoverr'); // Corrected to use class name
        const newDesc = desc.cloneNode(true)
        const hoverBooks = document.body.querySelectorAll('.haveHover')
        hoverBooks.forEach((hoverBook) =>{
            hoverBook.classList.remove('haveHover')
            hoverBook.classList.add('notHover')
        })
        let blackScreen = document.createElement('div')
        blackScreen.classList.add('blackScreen')
        document.body.append(newDesc)
        newDesc.classList.add('popoverr-visible');
        document.body.append(blackScreen)
        setTimeout(() => {blackScreen.style.opacity = .9; newDesc.style.opacity = 1;}, 200);
        const bodyClickHandler = (e) => {
            if (!e.target.closest('.descriptionBox') && !e.target.closest('.showDescription')) {
                const hoverBooks = document.body.querySelectorAll('.notHover')
                hoverBooks.forEach((hoverBook) =>{
                    hoverBook.classList.remove('notHover')
                    hoverBook.classList.add('haveHover')
                })
                newDesc.remove()
                blackScreen.remove()
                document.removeEventListener('click', bodyClickHandler);
            }
        };
        document.addEventListener('click', bodyClickHandler);
    }
});




/*---------Cart Items-------------*/
let numOfItems = 0; // Use 'let' instead of 'const' to allow updates
const cartNumb = document.getElementById('num');
let noItemsDiv = document.createElement('div');
let purchases =  document.getElementById('allPurchasedItems');
let checkout = document.querySelector('.checkout')
let Totalprice = 0;

localStorage.setItem('key', Totalprice)
noItemsDiv.innerHTML = "<p>No item in the cart</p><img src='images/empty cart.png' class='emptyCart'>"
noItemsDiv.classList.add('noItemsDiv')
if(numOfItems == 0){
    checkout.style.display = "none";
    cartNumb.style.display="none";
    purchases.append(noItemsDiv);
}
/*---------Clicking on buy-------------*/

document.getElementById('cards-container').addEventListener('click', (e) => {
    if (e.target && e.target.closest('.buy')) {
        const button = e.target.closest('.buy');
        const parent = e.target.closest('.card')
        const title = parent.querySelector('.bookTitle').innerHTML
        const imgUrl = parent.querySelector('.bookImg').src;
        const price = parent.querySelector('.price')
        let priceInNumber = price.innerHTML.slice(1);
        console.log(priceInNumber)
        Totalprice += Number(priceInNumber);
        localStorage.setItem('key', Totalprice)
        // console.log(button.disapled)
        if(button.disapled == false || !button.disapled){addPurchasedItem(title, imgUrl, priceInNumber, button);}
        if (!button.classList.contains('bought')) {
            button.classList.add('bought'); // Add the 'bought' class to mark as purchased
            button.innerHTML = `Bought <i class="fa-solid fa-cart-flatbed"></i>`;
            numOfItems++; 
            cartNumb.innerHTML = numOfItems; // Update cart number display
            button.disapled = 1;
            cartNumb.style.display="";
        }
    }
});
/*---------Clicking on Cart-------------*/
document.getElementById('cart').addEventListener('click', (e) => {
    if (!e.target.closest('.purchases')) {
        let parent = e.target.closest('.cart');
        const purchases = parent.querySelector('.purchases');
        if (purchases.classList.contains('show')) {
            // Start fading out by removing the show class
            purchases.classList.remove('show');
            // Wait for the opacity transition to finish before hiding the element
            setTimeout(() => {
                purchases.style.visibility = 'hidden';
            }, 200); // This matches the transition duration (0.5s)
            
        } else {
            // Make it visible immediately, then trigger the opacity animation
            purchases.style.visibility = 'visible';
            purchases.classList.add('show');
            const bodyClickHandler = (e) => {
                if (!e.target.closest('.purchases') && !e.target.closest('.cart')) {
                    purchases.classList.remove('show');
                    
                    // Wait for the opacity transition to finish before hiding the element
                    setTimeout(() => {
                        purchases.style.visibility = 'hidden';
                    }, 200); // This matches the transition duration (0.2s)
                    console.log(e.target.tagName)
                    
                    // Remove the body event listener once the task is done
                    document.removeEventListener('click', bodyClickHandler);
                }
            };
            document.addEventListener('click', bodyClickHandler);
        }
    }
});


/*---------Remove Items-------------*/
document.getElementById('cart').addEventListener('click', (e) =>{
    if(e.target.closest('.removeAddedItem')){
        e.stopPropagation();  // Prevent the event from bubbling to the body click handler
        let cancelButton = e.target.closest('.removeAddedItem')
        let newPurchasedItem = e.target.closest('.purchasedItems')
        let purchaseButtonId = cancelButton.dataset.button
        let purchaseButton = document.getElementById(purchaseButtonId);
        let parent = purchaseButton.closest('.card');
        let price = parent.querySelector('.price')
        let priceInNumber = price.innerHTML.slice(1);
        console.log(parent)
        // let priceInNumber = price.innerHTML.slice(1);
        Totalprice -= Number(priceInNumber);
        localStorage.setItem('key', Totalprice)

        if(purchaseButton){
            purchaseButton.classList.remove('bought'); 
            purchaseButton.innerHTML = `Buy <i class="fa-solid fa-cart-plus"></i>`;
            purchaseButton.disapled = 0;
        }
        numOfItems--; // Decrement number of items
        cartNumb.innerHTML = numOfItems; // Update cart number display
        newPurchasedItem.remove();
        if(numOfItems == 0){
            cartNumb.style.display="none";
            purchases.append(noItemsDiv);
            checkout.style.display = "none";

        }
        
    }
})
/*---------Add Items--------------*/
function addPurchasedItem(title, imgUrl, priceInNumber, button){
    let newPurchasedItem = document.createElement('div')
    newPurchasedItem.classList.add('purchasedItems')
    newPurchasedItem.innerHTML = ` 
        <img src="${imgUrl}" class="purchasedItemsImg">
        <div class="purchasedItemsName">
            <p class='purchasedItemsTitle'>${title}</p>
            <p class='purchasedItemsPrice'>$${priceInNumber}</p>
        </div>
       <button class="removeAddedItem" data-button="${button.id}">x</button>
    `
    noItemsDiv.remove()
    checkout.style.display = "block";
    purchases.append(newPurchasedItem)
    let addedNotification = document.createElement('div');
    addedNotification.classList.add('AddedNotification')
    addedNotification.innerHTML = "<h3>an item was added</h3><img src='images/done (1).gif' class='doneGif'></img>";
    document.body.append(addedNotification)
    setTimeout(() => addedNotification.remove(), 2000)
}
function cleanDescription(description) {
    // Remove any text after a specific delimiter, e.g., "([source]"
    const delimiterIndex = description.indexOf('([source]');
    return delimiterIndex !== -1 ? description.substring(0, delimiterIndex).trim() : description;
}

// Function to find the English edition or fallback to the first edition
function findEnglishEdition(book) {
    const englishEdition = book.edition_key && book.language && book.language.includes('eng')
        ? book.edition_key[1]
        : book.edition_key ? book.edition_key[1] : book.key;

    return `https://openlibrary.org/books/${englishEdition}`;
}

// Function to fetch the book description using the work key
function getBookDetails(workKey) {
    return fetch(`https://openlibrary.org${workKey}.json`)
        .then(response => response.json())
        .then(data => {
            // Get the description and subjects (genres)
            const description = data.description ? 
                (typeof data.description === 'string' ? data.description : data.description.value) : 
                'No description available';
            const subjects = data.subjects ? data.subjects.join(', ') : 'No genre available'; // Join subjects into a string
            return {
                description: description,
                subjects: subjects // Return the subjects (genres) as part of the object
            };
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
            return {
                description: 'No description available',
                subjects: 'No genre available' // Return default message in case of an error
            };
        });
}

function displayError(message) {
    const container = document.getElementById('book-cover-container');
    container.innerHTML = `<p>${message}</p>`;
}

function Genre(){
    let books = document.querySelectorAll('.book')
    books.forEach((book) =>{
        let genres = book.dataset.genre
        console.log(1);
        if(genres.indexOf('romance') && -1 || genres.indexOf('Romance') === -1){
            book.hidden = 1;
        }
    })
}
document.querySelectorAll('.genre').forEach((button) => {
    button.addEventListener('click', (e) => {
        let books = document.querySelectorAll('.card');
        let visibleBooksCount = 0; // Counter to track visible books
        let type = e.target.dataset.type;
        let active = document.body.querySelector('.active')
        active.classList.remove('active');
        e.target.classList.add('active')
        document.getElementById('no-items-message')?.remove();
        books.forEach((book) => {
            let genres = book.dataset.genre;
            if(type === "allBooks"){
                visibleBooksCount++; 
                book.style.display = ''; // Show the book
            }
            else {
                if (genres.toLowerCase().includes(type.toLowerCase())) {
                    book.style.display = ''; // Show the book
                    visibleBooksCount++; // Increment count of visible books
                } else {
                    book.style.display = 'none'; // Hide the book
                }
            }
        });
        if (visibleBooksCount === 0) {
            const noItemsMessage = document.createElement('p');
            noItemsMessage.id = 'no-items-message'; 
            noItemsMessage.textContent = 'No items available for this genre.';
            document.getElementById('cards-container').appendChild(noItemsMessage);
        }
    });
});
