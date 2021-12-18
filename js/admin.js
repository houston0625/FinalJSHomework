let originalOrderList = [];

window.onload = function () {
    InitialOrderInfoList();

    const list = document.querySelector(".js-orderList");

    list.addEventListener('click', function (e) {
        e.preventDefault();
        const name = e.target.getAttribute('name');

        if (name === 'changeOrderStatus') {
            const orderId = e.target.getAttribute('data-order-id');
            const orderState = e.target.getAttribute('data-order-state');
            ChangeOrderState(orderId, orderState);
        } else if (name === 'removeOrderItem') {
            const orderId = e.target.getAttribute('data-order-id');
            RemoveOrderItem(orderId);
        }
    });

    const btnRemoveAllOrder = document.querySelector('#btnRemoveAllOrder');
    btnRemoveAllOrder.addEventListener('click', function () {
        RemoveAllOrder();
    });
}

/**
 * 變更訂單狀態
 * @param {*} orderId 
 * @param {*} orderState 
 */
function ChangeOrderState(orderId, orderState) {
    //debugger;
    let state = true;
    if (orderState === "true") {
        state = false;
    }

    const sendObject = {
        "data": {
            "id": orderId,
            "paid": state
        }
    };

    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, sendObject, {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            if (response.status === 200) {
                alert('訂單狀態變更成功');
                originalOrderList = response.data.orders;
                renderList();
            } else {
                alert(response.data.message);
            }
        });
}

/**
 * 刪除單筆訂單
 * @param {*} orderId 
 * @param {*} orderState 
 */
function RemoveOrderItem(orderId) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`, {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            if (response.status === 200) {
                alert('訂單刪除成功');
                originalOrderList = response.data.orders;
                renderList();
            } else {
                alert(response.data.message);
            }
        });
}

/**
 * 刪除全部訂單
 *
 */
function RemoveAllOrder() {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            if (response.status === 200) {
                alert('全部訂單刪除成功');
                originalOrderList = [];
                renderList();
            } else {
                alert(response.data.message);
            }
        });
}

function InitialOrderInfoList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            if (response.status === 200) {
                originalOrderList = response.data.orders;
                renderList();
                renderC3();
            } else {
                alert(response.data.message);
            }
        });
}

function renderC3() {
    // 物件資料蒐集
    let total = {};
    originalOrderList.forEach(item => {
        item.products.forEach(productItem => {
            if (total[productItem.category] === undefined) {
                total[productItem.category] = productItem.price * productItem.quantity;
            } else {
                total[productItem.category] += productItem.price * productItem.quantity;
            }
        })
    })

    // 做出資料關聯
    let categoryAry = Object.keys(total);
    let newData = [];

    categoryAry.forEach(item => {
        let tempArray = [];
        tempArray.push(item);
        tempArray.push(total[item]);
        newData.push(tempArray);
    })

    // C3.js
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: newData,
        },
    });
}

function getAllProductTitle(productList) {
    //const productList = item.products;
    let productTitle = '';
    productList.forEach(product => {
        productTitle += `<p>${product.title}</p>`;
    });
    return productTitle;
}

function renderList() {
    let str = '';
    originalOrderList.forEach((item) => {

        const productTitle = getAllProductTitle(item.products);

        let paidState = `未處理`;
        if (item.paid === true) {
            paidState = `已處理`;
        }

        let createAt = new Date(item.createdAt * 1000);
        const createDate = `${createAt.getFullYear()}/${createAt.getMonth() + 1}/${createAt.getDate()}`;

        str += `<tr>
        <td>${item.id}</td>
        <td>
            <p>${item.user.name}</p>
            <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
           ${productTitle}
        </td>
        <td>${createDate}</td>
        <td class="orderStatus">
            <a href="#" data-order-id=${item.id} data-order-state=${item.paid} name="changeOrderStatus">${paidState}</a>
        </td>
        <td>
            <input type="button" class="delSingleOrder-Btn" data-order-id=${item.id} name="removeOrderItem" value="刪除">
        </td>
    </tr>`;
    });
    //console.log(data);
    const list = document.querySelector(".js-orderList");
    list.innerHTML = str;


}