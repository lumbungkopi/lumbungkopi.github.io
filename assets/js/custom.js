$(document).ready(function(){
    let countCart = 0;
    if (localStorage.getItem('shop_cart')=== null) {
        countCart = 0;
    } else {
        let shopCart = JSON.parse(localStorage.getItem('shop_cart'))
        shopCart.map((el) => {
            countCart += el.productQty
        })
    }
    document.getElementById("data-count").innerHTML= countCart

    // Hack to enable multiple modals by making sure the .modal-open class
    // is set to the <body> when there is at least one modal open left
    // $('body').on('hidden.bs.modal', function () {
    //     // if($('.modal.in').length > 0) {
    //         $('body').addClass('modal-open')
    //     // }
    // })
})

$('#productDetailModal').on('hidden.bs.modal', function () {
    var shopCartTemp = JSON.parse(localStorage.shop_cart)
    let dataTemp = {}
    var shopCart = shopCartTemp.reduce(function(data, el) {
        var id = el.productId;
        if (!dataTemp[id] && parseInt(el.productQty) > 0) {
            dataTemp[id] = {
            productId: el.productId,
            productName: el.productName,
            productPrice: el.productPrice,
            productImg: el.productImg,
            productQty: el.productQty,
            }
            data.push(dataTemp[id])
        }
        return data
    }, [])

    localStorage.setItem("shop_cart", JSON.stringify(shopCart));  //put the object back
})

function setProductId(id) {
    document.getElementById('productId').value = id
}

function setModalProductDetail(shopCartTemp) {
    var dataTemp = {}
    var shopCart = shopCartTemp.reduce(function(data, el) {
        var id = el.productId;
        if (!dataTemp[id] && parseInt(el.productQty) > 0) {
            dataTemp[id] = {
            productId: el.productId,
            productName: el.productName,
            productPrice: el.productPrice,
            productImg: el.productImg,
            productQty: el.productQty,
            }
            data.push(dataTemp[id]);
        }
        return data;
    }, [])
    if(shopCart.length) {
        document.getElementById("productDetailBody").innerHTML = ''
        let detailProduct = "";
        let subtotal = 0
        shopCart.forEach(function(item, i){
            const price = parseInt(item.productPrice)
            const qty = parseInt(item.productQty)
            const total = parseInt(item.productPrice) * parseInt(item.productQty)
            subtotal += total
            detailProduct += '<div class="col-md-5"><img src="assets/img/products/'+item.productImg+'" alt="" width="80%"></div>'
            detailProduct += '<div class="col-md-7">'
            detailProduct += '<h5 class="mb-1 mt-2"><b>'+item.productName+'</b></h5>';
            detailProduct += '<p class="mb-2"> Rp. '+price.toLocaleString()+'</p>';
            if (qty > 1) {
                detailProduct += `<div class="form-row row form__row__checkout">
                <div class="form-group col-md-5 pl-0 __input_number_modal">
                    <div class="input-group">
                        <span class="input-group-btn">
                            <button type="button" onclick="setProductId(${item.productId})" class="btn btn-default btn-number btn-number-left" data-type="minus" data-field="quant-${i}[1]"><i class="fa fa-minus" aria-hidden="true"></i></button>`
            } else {
                detailProduct += `<div class="form-row row form__row__checkout">
                <div class="form-group col-md-5 pl-0 __input_number_modal">
                    <div class="input-group">
                        <span class="input-group-btn">
                            <button type="button" onclick="setProductId(${item.productId})" class="btn btn-default btn-number btn-number-left" disabled="disabled" data-type="minus" data-field="quant-${i}[1]"><i class="fa fa-minus" aria-hidden="true"></i></button>`
            }
            detailProduct += `
                    </span>
                    <input type="text" name="quant-${i}[1]" class="form-control input-number input__number" value=${qty} min="1" max="1000" name="qtyProduct">
                    <span class="input-group-btn">
                        <button type="button" onclick="setProductId(${item.productId})" class="btn btn-default btn-number btn-number-right" data-type="plus" data-field="quant-${i}[1]""><i class="fa fa-plus" aria-hidden="true"></i></button>
                    </span>
                </div>
            </div>
            <div class="col-md-7 __remove_btn">
                <span class="input-group-btn">
                    <button type="button" class="btn btn-danger" onclick="removeProductFromCart(${item.productId})"><i class="fa fa-trash" aria-hidden="true"></i></button>
                </span>
            </div>
            <br/>
            <p><b>Total : Rp. <b id="total-${item.productId}">${total.toLocaleString()}</b></b></p></div>`;
            detailProduct += '</div>'
        })
        detailProduct += `<div class="col-md-12">
        <div class="row p__detail-footer">
            <div class="col-md-5"></div>
            <div class="col-md-7 text-right">
                <b>SubTotal : Rp. <b id="subtotal">${subtotal.toLocaleString()}</b></b>
            </div>
        </div>
        </div>`
        detailProduct += `<div class="col-md-12">
        <div class="row p__detail-footer">
            <div class="col-md-5"></div>
            <div class="col-md-7 text-right" style="margin-bottom: -15px;">
                <button type="button" class="btn btn__success" data-dismiss="modal" onclick="checkoutDetail()">Checkout</button>
            </div>
        </div>
        </div>`

        document.getElementById("productDetailBody").innerHTML = detailProduct
        document.getElementById('subtotal-checkout').value = subtotal
    } else {
        document.getElementById("productDetailBody").innerHTML = '<div class="col-md-12"><h4 class="text-center">Empty cart.</h4></div>'
    }
}

function productDetail(productId, productName, price, productImg) {
    document.getElementById("productName").innerHTML=productName;
    document.getElementById("productImg").innerHTML=`<img src="assets/img/products/${productImg}" alt="" width="100%" id="detail-pouch-1">`;
    document.getElementById("productPrice").innerHTML='Rp. ' +price.toLocaleString();
    document.getElementById('productId').value = productId

    let shopCart;
    if (localStorage.getItem('shop_cart' )=== null) {
        shopCart = [];
    } else {
        shopCart = JSON.parse(localStorage.getItem('shop_cart'));	
    }
    
    shopCart.push({
        productId,
        productName,
        productPrice: price,
        productImg,
        productQty: 0,
    });	
    localStorage.setItem('shop_cart',JSON.stringify(shopCart));

    $('#productDetailModal').modal('show')
  }

function addToCart() {
    var qty = $('#qtyProduct').val();
    let total = 0
    $('#summaryModal').modal('show')
    $('#productDetailModal').modal('hide')

    var shopCartTemp = JSON.parse(localStorage.shop_cart)
    var productId = $('#productId').val()

    for (var i = 0; i < shopCartTemp.length; i++) {
        if(parseInt(productId) === parseInt(shopCartTemp[i].productId)){ 
            shopCartTemp[i].productQty += parseInt(qty)
            break
        }
     }

    var dataTemp = {}
    var shopCart = shopCartTemp.reduce(function(data, el) {
        var id = el.productId;
        if (!dataTemp[id]) {
            total += el.productQty
            dataTemp[id] = {
            productId: el.productId,
            productName: el.productName,
            productPrice: el.productPrice,
            productImg: el.productImg,
            productQty: el.productQty,
            }
            data.push(dataTemp[id]);
        }
        return data;
    }, [])

    document.getElementById("data-count").innerHTML=total;

    localStorage.setItem("shop_cart", JSON.stringify(shopCart));  //put the object back

    setModalProductDetail(shopCart)
}

function clearCart() {
    document.getElementById("data-count").innerHTML=0
    localStorage.clear()
    $('#checkoutModal').modal('hide')
    $('#thanksModal').modal('show')
}

function removeProductFromCart(productId) {
    var shopCartTemp = JSON.parse(localStorage.shop_cart)
    const shopCart = shopCartTemp.filter(item => parseInt(item.productId) !== parseInt(productId))
    setModalProductDetail(shopCart)
    var totalCart = 0
    shopCart.map((el) => {
        totalCart += el.productQty
    })
    document.getElementById("data-count").innerHTML=totalCart;
    localStorage.setItem("shop_cart", JSON.stringify(shopCart));  //put the object back
}

function showCart() {
    let shopCart;
    if (localStorage.getItem('shop_cart' )=== null) {
        shopCart = [];
    } else {
        shopCart = JSON.parse(localStorage.getItem('shop_cart'))
    }
    setModalProductDetail(shopCart)
    $('#summaryModal').modal('show')
}

function checkoutDetail() {
    $('#summaryModal').modal('hide')
    var subtotal = parseInt($('#subtotal-checkout').val())
    document.getElementById("subtotal-checkout-label").innerHTML = subtotal.toLocaleString()
    document.getElementById("totalPayment").innerHTML = subtotal.toLocaleString()
    $('#checkoutModal').modal('show')
}

$(document).on('click', '.btn-number', function(e){
    e.preventDefault();
    
    fieldName = $(this).attr('data-field');
    type      = $(this).attr('data-type');
    var input = $("input[name='"+fieldName+"']");
    var currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
        if(type == 'minus') {
            var total = 0

            var shopCartTemp = JSON.parse(localStorage.shop_cart)

            var dataTemp = {}
            var productId = $('#productId').val()
            let subtotal = 0
            var shopCart = shopCartTemp.reduce(function(data, el) {
                var id = el.productId;
                if (!dataTemp[id]) {
                    let qty = el.productQty
                    if (parseInt(el.productId) === parseInt(productId)) {
                        qty = el.productQty - 1
                        let total = parseInt(el.productPrice) * parseInt(qty)
                        let elemTotal = document.getElementById("total-"+id)
                        if (elemTotal) {
                            elemTotal.innerHTML=total.toLocaleString()
                        }
                    }
                    subtotal += parseInt(el.productPrice) * parseInt(qty)
                    total += qty
                    dataTemp[id] = {
                    productId: el.productId,
                    productName: el.productName,
                    productPrice: el.productPrice,
                    productImg: el.productImg,
                    productQty: qty,
                    }
                    data.push(dataTemp[id]);
                }
                return data
            }, [])

            document.getElementById("data-count").innerHTML=total
            let elemSubtotal = document.getElementById("subtotal")
            if (elemSubtotal) {
                elemSubtotal.innerHTML=subtotal.toLocaleString()
            }
            document.getElementById('subtotal-checkout').value = subtotal

            localStorage.setItem("shop_cart", JSON.stringify(shopCart));  //put the object back
            
            if(currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            } 
            if(parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if(type == 'plus') {
            var total = 0
            let subtotal = 0
            var shopCartTemp = JSON.parse(localStorage.shop_cart)

            var dataTemp = {}
            var productId = $('#productId').val()
            var shopCart = shopCartTemp.reduce(function(data, el) {
                var id = el.productId;
                if (!dataTemp[id]) {
                    let qty = el.productQty
                    if (parseInt(el.productId) === parseInt(productId)) {
                        qty = el.productQty + 1
                        let total = parseInt(el.productPrice) * parseInt(qty)
                        let elemTotal = document.getElementById("total-"+id)
                        if (elemTotal) {
                            elemTotal.innerHTML=total.toLocaleString()
                        }
                    }
                    subtotal += parseInt(el.productPrice) * parseInt(qty)
                    total += qty
                    dataTemp[id] = {
                    productId: el.productId,
                    productName: el.productName,
                    productPrice: el.productPrice,
                    productImg: el.productImg,
                    productQty: qty,
                    }
                    data.push(dataTemp[id]);
                }
                return data
            }, [])

            document.getElementById("data-count").innerHTML=total
            let elemSubtotal = document.getElementById("subtotal")
            if (elemSubtotal) {
                elemSubtotal.innerHTML=subtotal.toLocaleString()
            }
            document.getElementById('subtotal-checkout').value = subtotal

            localStorage.setItem("shop_cart", JSON.stringify(shopCart));  //put the object back

            if(currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
            if(parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
});

$(document).on('click', '.btn-number-add-cart', function(e){
    e.preventDefault();
    
    fieldName = $(this).attr('data-field');
    type      = $(this).attr('data-type');
    var input = $("input[name='"+fieldName+"']");
    var currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
        if(type == 'minus') {
            if(currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            } 
            if(parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if(type == 'plus') {
            if(currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
            if(parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
});

$(document).on('focusin', '.input-number', function(){
   $(this).data('oldValue', $(this).val());
});

$(document).on('change', '.input-number', function(){    
    minValue =  parseInt($(this).attr('min'));
    maxValue =  parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());
    // console.log('minValue', minValue)
    // console.log('maxValue', maxValue)
    // console.log('valueCurrent', valueCurrent)
    
    name = $(this).attr('name');
    if(valueCurrent >= minValue) {
        $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
        $(".btn-number-left[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Sorry, the minimum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    if(valueCurrent <= maxValue) {
        $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Sorry, the maximum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    
    
});

$(document).on('keydown', '.input-number', function(e){
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
            // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) || 
            // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});