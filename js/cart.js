var cart = {
    // (A) PROPERTIES
    hPdt: null, // These are all the products which are displayed in the HTML document 
    hItems: null, // Everything which is in the cart at the moment on the HTML file
    items: {}, // All the current items that are in the cart
    iURL: "../images/", // The link to the path where the code should get the product images 

  

    // This is saving an item which is in the cart and adding this to the cart items/products, it stores it in the local storage
    save: function() {
        localStorage.setItem("cart", JSON.stringify(cart.items));
    },

    // This function loads all the items which are added to the local storage and it puts them into the cart from the items
    load: function() {
        cart.items = localStorage.getItem("cart");
        if (cart.items == null) { cart.items = {}; } else { cart.items = JSON.parse(cart.items); }
    },

    // This clears the whole cart and gives an alert at the top of the page to confirm it
    clear: function() {
        if (confirm("Are you sure you want to empty the cart?")) {
            cart.items = {};
            localStorage.removeItem("cart");
            cart.list();
        }
    },

    // This function pull the items and prints them onto the document using their ID
    show: function() {
        // Gets the items from the HTML file
        cart.hPdt = document.getElementById("cart-products");
        cart.hItems = document.getElementById("cart-items");

        // (C2) Here I'm defining 3 variables and draws it onto the products 
        cart.hPdt.innerHTML = "";
        let p, item, part;
        for (let id in products) {
            // This is the box which wraps all the images,names,description, and price into 1 box and put's it into a div by creating one for the product.
            p = products[id];
            item = document.createElement("div");
            item.className = "p-item";
            cart.hPdt.appendChild(item);

            // This variable is creating an image and defining a source which are the link to the image and I've appended the image to the part variable.
            part = document.createElement("img");
            part.src = cart.iURL + p.img;
            part.className = "p-img";
            item.appendChild(part);

            // PRODUCT NAME
            part = document.createElement("div");
            part.innerHTML = p.name;
            part.className = "p-name";
            item.appendChild(part);

            // PRODUCT DESCRIPTION
            part = document.createElement("div");
            part.innerHTML = p.type;
            part.className = "p-type";
            item.appendChild(part);

            // PRODUCT PRICE
            part = document.createElement("div");
            part.innerHTML = "£" + p.price;
            part.className = "p-price";
            item.appendChild(part);

            // ADD TO CART
            part = document.createElement("input");
            part.type = "button";
            part.value = "Add to Cart";
            part.className = "cart p-add";
            part.onclick = cart.add;
            part.dataset.id = id;
            item.appendChild(part);
        }

        // (C3) LOAD CART FROM PREVIOUS SESSION
        cart.load();

        // (C4) LIST CURRENT CART ITEMS
        cart.list();
    },

    // This function lists all the items/products in a loop which are currently in the cart on the HTML until it find the right id/key, here are another 3 variables which will be worked on later on on the code.
    list: function() {
        // This resets the items which are in the cart.items
        cart.hItems.innerHTML = "";
        let item, part, pdt;
        let empty = true;
        for (let key in cart.items) {
            if (cart.items.hasOwnProperty(key)) { empty = false; break; }
        }

        // This is the checker to check if the cart is empty and if it's empty it prints out a word "Nothing Here!" and it also adds/appends the items into an item
        if (empty) {
            item = document.createElement("div");
            item.innerHTML = "Nothing Here!";
            cart.hItems.appendChild(item);
        }

        // This code is rendering if the cart is not empty it lists out the items which are in the cart.items that the user adds to the object cart from the items there
        else {
            let p, total = 0,
                subtotal = 0;
            for (let id in cart.items) {
                // This piece of code creates a div and prints out the cart item (c-item) onto the cart with the item selected 
                p = products[id];
                item = document.createElement("div");
                item.className = "c-item";
                cart.hItems.appendChild(item);

                // This code creates another div and prints the product name on the website, and appends the name of an item into the part
                part = document.createElement("div");
                part.innerHTML = p.name;
                part.className = "c-name";
                item.appendChild(part);

                // This code is functioning for the removing/deleting the items from the cart which on the click and it's defined as cart.remove.
                part = document.createElement("input");
                part.type = "button";
                part.value = "X";
                part.dataset.id = id;
                part.className = "c-del cart";
                part.addEventListener("click", cart.remove);
                item.appendChild(part);

                // This piece of code defines the minimum quantity of the items and sets the ID of the item which then changes from 0 to 1 etc
                part = document.createElement("input");
                part.type = "number";
                part.min = 0;
                part.value = cart.items[id];
                part.dataset.id = id;
                part.className = "c-qty";
                part.addEventListener("change", cart.change);
                item.appendChild(part);

                // This code adds the current and overall price of all the products and then once the item is added to the cart this adds the subtotal into the total price which is displayed in the total.
                subtotal = cart.items[id] * p.price;
                total += subtotal;
            }

            // This is the total amount of the items which are dded in the cart and gets the price from the items in the HTML and makes the total to have a pounds sign
            item = document.createElement("div");
            item.className = "c-total";
            item.id = "c-total";
            item.innerHTML = "TOTAL: £" + total;
            cart.hItems.appendChild(item);

            // When teh button Empty is clicked it will run the function clear and empty everything which is in the cart. 
            item = document.createElement("input");
            item.type = "button";
            item.value = "Empty";
            item.addEventListener("click", cart.clear);
            item.className = "c-empty cart";
            cart.hItems.appendChild(item);

            // This is the checkout button which when the button is clicked it prints 
            item = document.createElement("input");
            item.type = "button";
            item.value = "Checkout";
            item.addEventListener("click", cart.checkout);
            item.className = "c-checkout cart";
            cart.hItems.appendChild(item);
        }
    },

    // This function keeps a track of how many items there are in the cart at the moment and it check if there are no items in the cart the code will set the total number of the cart into 1 and when another items get's added this adds the number depending on how many items there is in the cart.
    add: function() {
        if (cart.items[this.dataset.id] == undefined) {
            cart.items[this.dataset.id] = 1;
        } else {
            cart.items[this.dataset.id]++;
        }
        // The cart.save is taking the items from the local storage and simple saves the current choices of items added and .list simply lists them out 
        cart.save();
        cart.list();
    },

    // This functions works for the changing the items and will be worked on later on in the code.
    change: function() {
        // This code clears/removes the item which is clicked to be removed, and set's it's value to check if the value is equal to or 0 and it checks that the product is deleted using it's ID to be sure.
        if (this.value <= 0) {
            delete cart.items[this.dataset.id];
            cart.save();
            cart.list();
        }

        // (F2) This code updates the final/total price of the UPDATE TOTAL ONLY
        else {
            cart.items[this.dataset.id] = this.value;
            var total = 0;
            for (let id in cart.items) {
                total += cart.items[id] * products[id].price;
                document.getElementById("c-total").innerHTML = "TOTAL: £" + total;
            }
        }
    },

    // (G) REMOVE ITEM FROM CART
    remove: function() {
        delete cart.items[this.dataset.id];
        cart.save();
        cart.list();
    },

    // (H) CHECKOUT
    checkout: function() {
        // SEND DATA TO SERVER
        // CHECKS
        // SEND AN EMAIL
        // RECORD TO DATABASE
        // PAYMENT
        // WHATEVER IS REQUIRED
        alert("Are you sure you wish to checkout!");

        /*
        var data = new FormData();
        data.append('cart', JSON.stringify(cart.items));
        data.append('products', JSON.stringify(products));
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "SERVER-SCRIPT");
        xhr.onload = function(){ ... };
        xhr.send(data);
        */
    }
};
window.addEventListener("DOMContentLoaded", cart.show);