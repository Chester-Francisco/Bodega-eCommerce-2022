/* ---------- Class 'Items'--------- */
class Items {
    id;
    title;
    description;
    price;
    img;
    data;

    constructor() {
        this.fetch_products();
        this.shippingValidation();
        this.paymentValidation();
        this.billingInfoValidation();
        this.confirmOrder();
    }

    /* Fetch the products from fakestore */
    fetch_products() {
        try {
            fetch('https://fakestoreapi.com/products')
                .then(res => res.json())
                .then(function (json) {
                    catalog.data = json;
                    catalog.displayItems();
                });

        } catch (e) {
            fetch('https://deepblue.camosun.bc.ca/~c0180354/ics128/final/fakestoreapi.json')
                .then(res => res.json())
                .then(function (json) {
                    catalog.data = json;
                    catalog.displayItems();
                });
        }
    }
    /* Fetch the products from fakestore */

    displayItems() {
        // this function contains a lot of the website's functionality
        // whenever I move any of the jQuery functions outside this function most things just won't work for reasons I don't know

        /* Local Variables */
        let subtotal = 0;
        let item = this.data;
        let itemCounter = 0;
        let index;
        let itemTax = 0;
        let taxAmount = .08;
        let orderTotal = 0;
        /* Local Variables */

        /* This appends the fetched data from the api to the body */
        for(let i = 0; i < this.data.length; i++) {
            let item = this.data[i];
            $(`<div class="col-sm-2 col-lg-3 mb-4">
                   <div class="card">
                       <img src="${item.image}" class="card-img-top" alt="${item.title}">
                       <div class="card-body">
                           <h5 class="card-title">${item.title}</h5>
                           <p class="card-text">${item.description}</p>
                           <p class="card-text"> $${item.price}</p>
                           <button type="button" data-product-id="${item.id}" class="btn btn-primary addItemToCart">Add to Cart</button>
                       </div>
                   </div>
             </div>`).appendTo('#items');
        }
        /* ----------- */


        /* ---------- Masonry Layout --------- */
        let catalog_container = document.getElementById("items");
        jQuery(catalog_container).imagesLoaded( function() {
            var msnry = new Masonry(catalog_container);
        });
        /* ---------- End Masonry Layout --------- */


        /*  Disabling the checkout button and empty cart button if no items are in the cart.
            Once an item has been added, both buttons are enabled, but if the empty cart
            button is clicked then both are disabled again                                  */
        $('.checkoutBtn').prop('disabled', true);       // checkout button in shopping cart
        $('.clearItemsInCart').prop('disabled', true);  // empty cart button in shopping cart

        $('.addItemToCart').click(function() {
            $('.checkoutBtn').prop('disabled', false);
            $('.clearItemsInCart').prop('disabled', false);

            $('.clearItemsInCart').click(function () {
                $('.checkoutBtn').prop('disabled', true);
                $('.clearItemsInCart').prop('disabled', true);
            });
        });
        /*----*/


        /* ---------- Item Counter & Shopping Cart-------- */
        $('#numItems').html(`${itemCounter}`);

        $('.addItemToCart').click(function() {
            itemCounter++;
            $('#numItems').html(`${itemCounter}`);
            // everytime the button 'Add to Cart' is clicked the yellow box beside the 'View Cart' button is updated

            let product_id = $(this).attr('data-product-id');
            index = product_id - 1;
            itemTax += item[index].price * taxAmount ;
            subtotal += item[index].price;          //variable for subtotal

            $(`<div id="${item[index].id}"> 
            <p> <button type="button" data-remove="${index}" class="btn btn-outline-secondary btn-sm removeItem"><i class="bi bi-trash"></i></button>
            ${item[index].title} <b> $${item[index].price} </b>
            </p> 
            </div>`).appendTo('#ItemDescription');
            // it was a lot easier targeting the specific item that corresponds to the button that was clicked within this .click function
            // I wasn't able to use 'product_id' outside this function's scope so this was the only fix I could think of regarding adding the item into the Shopping cart view

            $(`<p>${item[index].title} <b> $${item[index].price} </b> </p>`).appendTo('#itemConfirmOrder');
        });
        /* ---------- End Item Counter & Shopping Cart --------- */


        /*---------   Calculating the subtotal in cart  -----------*/
        $('.viewCart').click(function () {
            $('#subtotal').html(`<b>Subtotal:</b> $${subtotal.toFixed(2)}`);
        });
        /*---------   End Calculating the subtotal in cart  -----------*/


        /*------- Shipping tax ------*/
        $('.confirmOrder').click(function () {
            let shippingTax = 15;
            orderTotal = subtotal + shippingTax + itemTax;
            $('#shippingTax').html(`<b>Shipping:</b> $${shippingTax.toFixed(2)}`);
            $('#confirmSubTotal').html(`<b>Subtotal:</b> $${subtotal.toFixed(2)}`);
            $('#tax').html(`<b>Tax:</b> $${itemTax.toFixed(2)}`);
            $('#order_total').html(`<b>Order Total:</b> $${orderTotal.toFixed(2)}`);
        })
        /*------- Shipping tax ------*/


        /* ---------- Clear All Cart Items --------- */
        // I am setting the counter and subtotal to 0
        // as well as using empty() to clear the div containing the items
        $('.clearItemsInCart').click(function() {
            itemCounter = 0;
            subtotal = 0;
            itemTax = 0;
            orderTotal = 0;
            $('#subtotal').html(`<b>Subtotal:</b> $${subtotal.toFixed(2)}`);
            $('#numItems').html(`${itemCounter}`);
            $('#tax').html(`<b>Tax:</b> $${itemTax.toFixed(2)}`);
            $('#order_total').html(`<b>Order Total:</b> $${orderTotal.toFixed(2)}`);
            $('#ItemDescription').empty();
            $('#itemConfirmOrder').empty();
        });
        /* ---------- Clear All Cart Items--------- */
    }

    paymentValidation() {
        /*---- Regular expression for credit card -----*/
        let visa = /^4[0-9]{12}(?:[0-9]{3})?$/;
        let cardDateMM = /^(0[1-9]|1[012])$/;
        let cardDateYY = /^[0-9]{2}$/;
        let cvv = /^[0-9]{3}$/;
        /*--------------------*/

        /*---- For each field, every keyup, it will check for a match -----*/
        $('#cardNum').keyup(function () {
            let cardCheck = $("input[name='cardNum']").val();

            if(visa.test(cardCheck)) {
                $('#cardNum').css('color', 'green');
            } else {
                $('#cardNum').css('color', 'red');
            }
        });

        $('#expirationMM').keyup(function () {
            let monthCheck = $("input[name='expirationDate']").val();

            if(cardDateMM.test(monthCheck) && monthCheck >= 4) {
                $('#expirationMM').css('color', 'green');
            } else {
                $('#expirationMM').css('color', 'red');
            }
        });

        $('#expirationYY').keyup(function () {
           let yearCheck =  $("input[name='expirationYY']").val();

           if(cardDateYY.test(yearCheck) && yearCheck >= 22) {
               $('#expirationYY').css('color', 'green');
           } else {
               $('#expirationYY').css('color', 'red');
           }
        });

        $('#cvv').keyup(function() {
            let cvvCheck = $("input[name='cvv']").val();

            if(cvv.test(cvvCheck)) {
                $('#cvv').css('color', 'green');
            } else {
                $('#cvv').css('color', 'red');
            }
        });
    }

    /*-- This function contains all the regex validations for the billing information modal,
          On every keyup it checks if the field is validated, if so then the text turns green if not the
          text turns red                                                                       --*/
    billingInfoValidation() {
        let fullNameCheck = /[A-Za-z]+$/;
        let addressCheck = /^\d+\s[A-z]+\s[A-z]+/g;
        let countryCheck = /^[A-Z]{2}$/;
        let cityCheck = /[A-Za-z]+$/;
        let emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let american_postal_check = /^\d{5}(?:[-\s]\d{4})?$/;
        let cad_postal_check = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/;
        let phoneCheck = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/gm;

        let us_states = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA",
                        "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA ", "MA", "MD",
                        "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH",
                        "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC",
                        "SD", "TN ", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];

        let cad_provinces = ["AB", "BC", "MB", "NB", "NL", "NT",
                            "NS", "NU", "ON", "PE", "QC", "SK", "YT"];

        $('#firstName').keyup(function() {
            let firstName = $("input[name='firstName']").val();

            if(fullNameCheck.test(firstName)) {
                $('#firstName').css('color', 'green');
            } else {
                $('#firstName').css('color', 'red');
            }
        });

        $('#lastName').keyup(function() {
            let lastName = $("input[name='lastName']").val();

            if(fullNameCheck.test(lastName)) {
                $('#lastName').css('color', 'green');
            } else {
                $('#lastName').css('color', 'red');
            }
        });

        $('#billing_address1').keyup(function() {
            let address = $("input[name='billing_address1']").val();

            if(addressCheck.test(address)) {
                $('#billing_address1').css('color', 'green');
            } else {
                $('#billing_address1').css('color', 'red');
            }
        });

        $('#billing_address2').keyup(function() {
            let address = $("input[name='billing_address2']").val();

            if(addressCheck.test(address)) {
                $('#billing_address2').css('color', 'green');
            } else {
                $('#billing_address2').css('color', 'red');
            }
        });

        $('#billing_country').keyup(function() {
            let country = $("input[name='billing_country']").val();

            if(countryCheck.test(country)) {
                $('#billing_country').css('color', 'green');
            } else {
                $('#billing_country').css('color', 'red');
            }
        });

        /* This block of code first checks which country it is, then uses one of the loops to validate for the province/state */
        $('#billing_province_state').keyup(function () {
            if($("input[name='billing_country']").val() === "US") {
                let state = $("input[name='billing_province_state']").val();

                for(let i of us_states) {
                    if(state === i){
                        $('#billing_province_state').css('color', 'green');
                        break;
                    } else {
                        $('#billing_province_state').css('color', 'red');
                    }
                }
            } else {
                let province = $("input[name='billing_province_state']").val();

                for(let i of cad_provinces) {
                    if (province === i) {
                        $('#billing_province_state').css('color', 'green');
                        break;
                    } else {
                        $('#billing_province_state').css('color', 'red');
                    }
                }
            }
        });
        /* ------------ */

        $('#billing_city').keyup(function() {
            let city = $("input[name='billing_city']").val();

            if(cityCheck.test(city)) {
                $('#billing_city').css('color', 'green');
            } else {
                $('#billing_city').css('color', 'red');
            }
        });

        /* This block of code checks which country is listed first, either US or Canada then decides which regex to use for postal validation*/
        $('#billing_postal').keyup(function () {

            if($("input[name='billing_country']").val() === "US") {
                let americanPostal = $("input[name='billing_postal']").val();

                if (american_postal_check.test(americanPostal)) {
                    $('#billing_postal').css('color', 'green');
                } else {
                    $('#billing_postal').css('color', 'red');
                }
            } else {
                let canadianPostal = $("input[name='billing_postal']").val();

                  if (cad_postal_check.test(canadianPostal)) {
                    $('#billing_postal').css('color', 'green');
                } else {
                    $('#billing_postal').css('color', 'red');
                }

            }
        });
        /* -------------- */

        $('#billing_contact').keyup(function () {
            let phone_number = $("input[name='billing_contact']").val();

            if(phoneCheck.test(phone_number)) {
                $('#billing_contact').css('color', 'green');
            } else {
                $('#billing_contact').css('color', 'red');
            }
        });

        $('#billing_email').keyup(function() {
            let email = $("input[name='billing_email']").val();

            if(emailCheck.test(email)) {
                $('#billing_email').css('color', 'green');
            } else {
                $('#billing_email').css('color', 'red');
            }
        });
    }
    /*----------------*/


    /*-------- Option to use Billing Address as Shipping Info ---------*/
    /*-------- If radio is checked then just move on but if not then it is essentially the same function as 'billingValidation()'*/
    shippingValidation() {
        let fullNameCheck = /[A-Za-z]+$/;
        let addressCheck = /^\d+\s[A-z]+\s[A-z]+/g;
        let countryCheck = /^[A-Z]{2}$/;
        let cityCheck = /[A-Za-z]+$/;
        let emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let american_postal_check = /^\d{5}(?:[-\s]\d{4})?$/;
        let cad_postal_check = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/;
        let phoneCheck = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/gm;

        let us_states = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA",
            "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA ", "MA", "MD",
            "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH",
            "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC",
            "SD", "TN ", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];

        let cad_provinces = ["AB", "BC", "MB", "NB", "NL", "NT",
                        "NS", "NU", "ON", "PE", "QC", "SK", "YT"];

        $('.shipping').click(function () {

           $('#shippingDetails').click(function () {
               let checked = $("input[name='shippingDetails']").is(":checked");

                   if(checked) {
                       $('#differentInfo_from_Billing').hide();
                   } else {
                       $('#differentInfo_from_Billing').show();
                   }
               });

                $('#shippingFirstName').keyup(function() {
                    let firstName = $("input[name='shippingFirstName']").val();

                    if(fullNameCheck.test(firstName)) {
                        $('#shippingFirstName').css('color', 'green');
                    } else {
                        $('#shippingFirstName').css('color', 'red');
                    }
                });

                $('#shippingLastName').keyup(function() {
                    let lastName = $("input[name='shippingLastName']").val();

                    if(fullNameCheck.test(lastName)) {
                        $('#shippingLastName').css('color', 'green');
                    } else {
                        $('#shippingLastName').css('color', 'red');
                    }
                });

                $('#shippingAddress').keyup(function() {
                    let address = $("input[name='shippingAddress']").val();

                    if(addressCheck.test(address)) {
                        $('#shippingAddress').css('color', 'green');
                    } else {
                        $('#shippingAddress').css('color', 'red');
                    }
                });

                $('#shipping_country').keyup(function() {
                    let country = $("input[name='shipping_country']").val();

                    if(countryCheck.test(country)) {
                        $('#shipping_country').css('color', 'green');
                    } else {
                        $('#shipping_country').css('color', 'red');
                    }
                });

            /* This block of code first checks which country it is, then uses one of the loops to validate for the province/state */
            $('#shipping_province_state').keyup(function () {
                if($("input[name='shipping_country']").val() === "US") {
                    let state = $("input[name='shipping_province_state']").val();

                    for(let i of us_states) {
                        if(state === i){
                            $('#shipping_province_state').css('color', 'green');
                            break;
                        } else {
                            $('#shipping_province_state').css('color', 'red');
                        }
                    }
                } else {
                    let province = $("input[name='shipping_province_state']").val();

                    for(let i of cad_provinces) {
                        if (province === i) {
                            $('#shipping_province_state').css('color', 'green');
                            break;
                        } else {
                            $('#shipping_province_state').css('color', 'red');
                        }
                    }
                }
            });
            /* ------------ */

            $('#shipping_city').keyup(function () {
               let city = $("input[name='shipping_city']") .val();

               if(cityCheck.test(city)) {
                    $('#shipping_city').css('color', 'green');
                } else {
                    $('#shipping_city').css('color', 'red');
                }
            });

            /*----- The postal validation first checks which country is listed and proceeds to validate that country's postal requirements ------*/
            $('#shipping_postal').keyup(function () {
                    if($("input[name='shipping_country']").val() === "US") {
                        let americanPostal = $("input[name='shipping_postal']").val();

                        if (american_postal_check.test(americanPostal)) {
                            $('#shipping_postal').css('color', 'green');
                        } else {
                            $('#shipping_postal').css('color', 'red');
                        }
                    } else {
                        let canadianPostal = $("input[name='shipping_postal']").val();

                        if (cad_postal_check.test(canadianPostal)) {
                            $('#shipping_postal').css('color', 'green');
                        } else {
                            $('#shipping_postal').css('color', 'red');
                        }
                    }
                });
            /*-----------*/

            $('#shipping_contact').keyup(function () {
                let phone = $("input[name='shipping_contact']") .val();

                if(phoneCheck.test(phone)) {
                    $('#shipping_contact').css('color', 'green');
                } else {
                    $('#shipping_contact').css('color', 'red');
                }
            });

            $('#shipping_email').keyup(function () {
                let email = $("input[name='shipping_email']") .val();

                if(emailCheck.test(email)) {
                    $('#shipping_email').css('color', 'green');
                } else {
                    $('#shipping_email').css('color', 'red');
                }
            });
        });
    }
    /*-----------------*/


    /*  This function is when the final button is clicked
        Here I grab the values of all input fields and check for validation one last time.
        If all fields are okay then I move onto my POST fetch. If not, display a message saying they need to fix it */

    /*This function is sort of convoluted*/
    confirmOrder() {
        let submission = {};
        let billing = {};
        let shipping = {};

        /* Regular Expressions */
        let visa = /^4[0-9]{12}(?:[0-9]{3})?$/;
        let cardDateMM = /^(0[1-9]|1[012])$/;
        let cardDateYY = /^[0-9]{2}$/;
        let cvvCheck = /^[0-9]{3}$/;
        let fullNameCheck = /[A-Za-z]+$/;
        let addressCheck = /^\d+\s[A-z]+\s[A-z]+/g;
        let countryCheck = /^[A-Z]{2}$/;
        let cityCheck = /[A-Za-z]+$/;
        let emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let american_postal_check = /^\d{5}(?:[-\s]\d{4})?$/;
        let cad_postal_check = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/;
        let phoneCheck = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/gm;
        /* Regular Expressions */

        /*Arrays containing the provinces and states*/
        let us_states = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA",
            "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA ", "MA", "MD",
            "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH",
            "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC",
            "SD", "TN ", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];

        let cad_provinces = ["AB", "BC", "MB", "NB", "NL", "NT",
            "NS", "NU", "ON", "PE", "QC", "SK", "YT"];
        /*---------*/


        $('.orderComplete').click(function () {

            /* Final Validation for payment method - essentially the same as the other methods, but I needed these variables in this scope*/
            let cardNum = visa.test($("input[name='cardNum']").val());
            let cardMM = cardDateMM.test($("input[name='expirationDate']").val());
            let cardYY = cardDateYY.test($("input[name='expirationYY']").val());
            let cvv =  cvvCheck.test($("input[name='cvv']").val());
            /* Final Validation for payment method */


            /* Final Validation for Billing Information - essentially the same as the other methods, but I needed these variables in this scope*/
            let billing_first_name = fullNameCheck.test($("input[name='firstName']").val());
            let billing_last_name = fullNameCheck.test($("input[name='lastName']").val());
            let billing_address = addressCheck.test($("input[name='billing_address1']").val());
            let billing_country = countryCheck.test($("input[name='billing_country']").val());
            let billing_city = cityCheck.test($("input[name='billing_city']").val());
            let billing_prov_state;
            let billing_postal;

            if($("input[name='billing_country']").val() === 'US') {
                let state = $("input[name='billing_province_state']").val();
                for(let i of us_states) {
                    if(state === i) {
                        billing_prov_state = true;
                        break;
                    } else {
                        billing_prov_state = false;
                    }
                }
            } else {
                let prov = $("input[name='billing_province_state']").val();
                for(let i of cad_provinces) {
                    if(prov === i) {
                        billing_prov_state = true;
                        break;
                    } else {
                        billing_prov_state = false;
                    }
                }
            }

            if($("input[name='billing_country']").val() === 'US') {
                billing_postal = american_postal_check.test($("input[name='billing_postal']").val());
            } else {
                billing_postal = cad_postal_check.test($("input[name='billing_postal']").val());
            }

            let contact = phoneCheck.test($("input[name='billing_contact']").val());
            let email = emailCheck.test($("input[name='billing_email']").val());
            /*-------------------------------*/


            /*---------Submission Object---------*/
            submission.card_number = $("input[name='cardNum']").val();
            submission.expiry_month = $("input[name='expirationDate']").val();
            submission.expiry_year = $("input[name='expirationYY']").val();
            submission.security_code = $("input[name='cvv']").val();
           //  submission.amount = I couldn't figure out how to grab the subtotal from the above methods;
            submission.currency = 'CAD';

            /* Billing Object */
            billing.first_name = $("input[name='firstName']").val();
            billing.last_name = $("input[name='lastName']").val();
            billing.address_1 = $("input[name='billing_address1']").val();

            if($("input[name='billing_address2']").val() !== "") {
                billing.address_2 = $("input[name='billing_address2']").val();
            }

            billing.city = $("input[name='billing_city']").val();
            billing.province = $("input[name='billing_province_state']").val();
            billing.country = $("input[name='billing_country']").val();
            billing.postal = $("input[name='billing_postal']").val();
            billing.phone = $("input[name='billing_contact']").val();
            billing.email = $("input[name='billing_email']").val();
            /*------*/

            /* ------ Shipping Object ------ */
            /* this checks if the user wants to use the same Info as Billing Details. If 'checked' is false,
             then I use the fields in the shipping information modal for the object */
            let checked = $("input[name='shippingDetails']").is(":checked");
            if(checked) {
                shipping.first_name = billing.first_name;
                shipping.last_name = billing.last_name;
                shipping.address_1 = billing.address_1

                if(billing.address_2 !== "") {
                    shipping.address_2 = billing.address_2
                }

                shipping.city = billing.city;
                shipping.province = billing.province;
                shipping.country = billing.country;
                shipping.postal = billing.postal;
                shipping.phone =  billing.phone;
                shipping.email =  billing.email;

            } else {

                shipping.first_name = $("input[name='shippingFirstName']").val();
                shipping.last_name = $("input[name='shippingLastName']").val();
                shipping.address_1 = $("input[name='shippingAddress']").val();

                if ($("input[name='shippingAddress2']").val() !== "") {
                    shipping.address_2 = $("input[name='billing_email']").val();
                }
                shipping.city = $("input[name='shipping_city']").val();
                shipping.province = $("input[name='shipping_province_state']").val();
                shipping.country = $("input[name='shipping_country']").val();
                shipping.postal = $("input[name='shipping_postal']").val();
                shipping.phone = $("input[name='shipping_contact']").val();
                shipping.email = $("input[name='shipping_email']").val();
            }
            /*---------*/

            submission.billing = billing;
            submission.shipping = shipping;
            /*---------Submission Object---------*/

            /* I had to validate the fields again in this function in order to use this condition, (I know this condition is too much but it works!)
            *  I left out shipping from this scope because most often people will use the same address as billing address
            * */
            if(cardYY && cardMM && cardNum && cvv && billing_first_name && billing_last_name && billing_address
               && billing_country && billing_city && billing_prov_state && billing_postal && contact && email ) {

                try {
                    let form_data = new FormData();
                    form_data.append('submission', JSON.stringify(submission));

                    fetch('https://deepblue.camosun.bc.ca/~c0180354/ics128/final/', {
                        method: "POST",
                        cache: 'no-cache',
                        body: form_data
                    }).then(function () {
                        $('#ItemDescription').empty();
                        $('#subtotal').html(`<b>Subtotal:</b> $${0}`);
                        $('#numItems').html(`${0}`);
                        $(`<p>Your order is currently being processed. Thank you for shopping at The Bodega! <i class="bi bi-check-circle"></i></p>`).appendTo('.confirmation');
                    });
                } catch (e) {
                    $('#ItemDescription').empty();
                    $('#subtotal').html(`<b>Subtotal:</b> $${0}`);
                    $('#numItems').html(`${0}`);
                    $(`<p>Unfortunately your order did not go through! Please give our support team a day or two to contact you, sorry for the inconvenience! </p> <i class="bi bi-bug"></i>`).appendTo('.confirmation');
                }
            } else {
                $(`<p>Order unsuccessful! It looks like your missing some information. Please fill out your information correctly! <i class="bi bi-bug"></i></p>`).appendTo('.confirmation');
            }
        })
    }
    /*--------------*/
}
/* ---------- End of Class 'Items'--------- */
const catalog = new Items();

//Things I couldn't figure out (thought I'd make it easier for you)
/*
1) single item removal
2) one of the two API's - though I could fetch them, utilizing them was a completely different story, so I just took the code out
3) multiple of same item in cart - instead of a multiplier showing up next to the item a duplicate will show up
4) I couldn't figure out how to  use subtotal outside its scope and add the value to the submission object
 */