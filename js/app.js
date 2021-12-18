window.onload = function () {
    getProductList('');
    getCartList();

    const productWrap = document.querySelector('.productWrap');
    productWrap.addEventListener('click', function (e) {
        const buttonName = e.target.getAttribute('name');
        if (buttonName === 'addCardBtn') {
            const dataId = e.target.getAttribute('data-id');
            addCartItem(dataId);
        }
    });

    const shappingCartTable = document.querySelector('.shoppingCart-table');
    shappingCartTable.addEventListener('click', function (e) {
        const buttonName = e.target.getAttribute('name');
        if (buttonName === 'discardAllBtn') {
            deleteAllCartList();
        } else if (buttonName === 'deleteCardItem') {
            const cardId = e.target.getAttribute('data-card-id');
            deleteCartItem(cardId);
        }

    });

    const btnSendOderData = document.querySelector('#btnSendOderData');
    btnSendOderData.addEventListener('click', function (e) {
        e.preventDefault();
        createOrder();
    });

    // 過濾條件
    const productSelect = document.querySelector('.productSelect');
    productSelect.addEventListener('change', function (e) {
        getProductList(e.target.value);
    });
}

// 取得產品列表
function getProductList(category) {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).
    then(function (response) {
            if (response.data.status === true) {
                let productInfoList = '';
                let dataList = response.data.products;
                if (category !== '' && category !== '全部') {
                    dataList = dataList.filter(item => item.category === category);
                }

                dataList.forEach(item => {
                    const commaOriginPrice = ConvertCommaUtility.AppendComma(item.origin_price);
                    const commaPrice = ConvertCommaUtility.AppendComma(item.price);
                    productInfoList += `<li class="productCard">
                        <h4 class="productType">新品</h4>
                        <img src="${item.images}"
                            alt="">
                        <a href="#" class="addCardBtn" data-id="${item.id}" name="addCardBtn">加入購物車</a>
                        <h3>"${item.title}"</h3>
                        <del class="originPrice">NT$${commaOriginPrice}</del>
                        <p class="nowPrice">NT$${commaPrice}</p>
                    </li>`;

                });

                const productWrap = document.querySelector('.productWrap');
                productWrap.innerHTML = productInfoList;
            }
        })
        .catch(function (error) {
            console.log(error.response.data)
        })
}

// 加入購物車
function addCartItem(productId) {
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
        data: {
            "productId": productId,
            "quantity": 1
        }
    }).
    then(function (response) {
        if (response.status === 200) {
            alert('加入購物車成功');
            UpdateShoppingCartTable(response.data);
        } else {
            alert('加入購物車失敗');
        }
    });
}

let temp = {};
// 取得購物車列表
function getCartList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
        if (response.status === 200) {
            UpdateShoppingCartTable(response.data);
        }
    })
}

let cartData = [];

/*
 更新購物車列表
 */
function UpdateShoppingCartTable(responseData) {
    const shoppingCartTable = document.querySelector('#shoppingCart-tableList');
    let strCardItem = ``;
    cartData = responseData.carts;
    responseData.carts.forEach(item => {
        const commaPrice = ConvertCommaUtility.AppendComma(item.product.price);
        const totalPrice = item.quantity * item.product.price;
        const commaTotalPrice = ConvertCommaUtility.AppendComma(totalPrice);
        strCardItem += ` 
        <tr>
            <td>
                <div class="cardItem-title">
                    <img src="${item.product.images}" alt="">
                    <p>Antony ${item.product.title}</p>
                </div>
            </td>
            <td>NT$${commaPrice}</td>
            <td>${item.quantity}</td>
            <td>NT$${commaTotalPrice}</td>
            <td class="discardBtn">
                <a href="#" class="material-icons" name="deleteCardItem" data-card-id=${item.id} >
                    clear
                </a>
            </td>
        </tr>`;
    });
    shoppingCartTable.innerHTML = strCardItem;
    const commaFinalTotal = ConvertCommaUtility.AppendComma(responseData.finalTotal);
    const finalTotal = document.querySelector('#finalTotal');
    finalTotal.textContent = commaFinalTotal;
}


// 清除購物車內全部產品
function deleteAllCartList() {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
        //console.log(response.data);
        if (response.status === 200) {
            UpdateShoppingCartTable(response.data);
            alert(response.data.message);
        } else if (response.status === 400 || response.status === 404) {
            alert(response.data.message);
        }
    })
}

// 刪除購物車內特定產品
function deleteCartItem(cartId) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`).
    then(function (response) {
        //console.log(response.data);
        if (response.status === 200) {
            alert('刪除成功');
            UpdateShoppingCartTable(response.data);
            //alert(response.data.message);
        } else if (response.status === 400 || response.status === 404) {
            alert(response.data.message);
        }
    })
}

// 送出購買訂單
function createOrder() {

    if (cartData.length === 0) {
        alert('請加入購物車');
        return;
    }

    const errorList = validateBeforeCreateOrder();
    //console.log(errorList);
    if (errorList) {
        Object.keys(errorList).forEach(key => {
            document.querySelector(`#${key}-message`).textContent = errorList[key];
        });
    } else {
        // let sendObject = {
        //     user: {}
        // };
        // const orderForm = document.querySelector('#orderForm');
        // const inputGroup = orderForm.querySelectorAll('input[type=text],input[type=tel],input[type=email],select');
        // inputGroup.forEach(item => {
        //     const itemName = item.getAttribute('name');
        //     const itemValue = item.value;
        //     sendObject.user[itemName] = itemValue;
        // });
        // console.log(sendObject);

        const customerName = document.querySelector("#customerName").value;
        const customerPhone = document.querySelector("#customerPhone").value;
        const customerEmail = document.querySelector("#customerEmail").value;
        const customerAddress = document.querySelector("#customerAddress").value;
        const customerTradeWay = document.querySelector("#tradeWay").value;

        axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`, {
            "data": {
                "user": {
                    "name": customerName,
                    "tel": customerPhone,
                    "email": customerEmail,
                    "address": customerAddress,
                    "payment": customerTradeWay
                }
            }
        }).
        then(function (response) {
                if (response.status === 200) {
                    alert("訂單建立成功");
                    document.querySelector("#customerName").value = "";
                    document.querySelector("#customerPhone").value = "";
                    document.querySelector("#customerEmail").value = "";
                    document.querySelector("#customerAddress").value = "";
                    document.querySelector("#tradeWay").value = "ATM";
                    getCartList();
                }
            })
            .catch(function (error) {
                console.log(error.response.data);
            });


        // const customerName = document.querySelector("#customerName").value;
        // const customerPhone = document.querySelector("#customerPhone").value;
        // const customerEmail = document.querySelector("#customerEmail").value;
        // const customerAddress = document.querySelector("#customerAddress").value;
        // const customerTradeWay = document.querySelector("#tradeWay").value;

        // axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`, {
        //     "data": {
        //         "user": {
        //             "name": customerName,
        //             "tel": customerPhone,
        //             "email": customerEmail,
        //             "address": customerAddress,
        //             "payment": customerTradeWay
        //         }
        //     }
        // }).then(function (response) {
        //     debugger;
        //     alert("訂單建立成功");
        //     document.querySelector("#customerName").value = "";
        //     document.querySelector("#customerPhone").value = "";
        //     document.querySelector("#customerEmail").value = "";
        //     document.querySelector("#customerAddress").value = "";
        //     document.querySelector("#tradeWay").value = "ATM";
        //     getCartList();
        // })
    }
}

/**
 * 送出購買訂單前檢核
 */
function validateBeforeCreateOrder() {
    const constraints = {
        name: {
            presence: {
                message: '^姓名是必填欄位'
            }
        },
        tel: {
            presence: {
                message: '^電話是必填欄位'
            }
        },
        email: {
            email: {
                message: "^doesn't look like a valid email"
            },
            presence: {
                message: '^EMail是必填欄位'
            }
        },
        address: {
            presence: {
                message: '^寄送地址是必填欄位'
            }
        },
    }
    const orderForm = document.querySelector('#orderForm');
    const inputGroup = orderForm.querySelectorAll('input[type=text],input[type=tel],input[type=email]');

    inputGroup.forEach(item => {
        const itemName = item.getAttribute('name');
        document.querySelector(`#${itemName}-message`).textContent = '';
    });

    let errorList = validate(orderForm, constraints);
    return errorList;
}