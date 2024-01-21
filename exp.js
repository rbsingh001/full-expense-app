
function myfunction() {

    let amount = document.getElementById("expence").value;
    let description = document.getElementById("des").value;
    let category = document.getElementById("category").value;

    const exp = {
        amount: amount,
        description: description,
        category: category
    }

    const token = localStorage.getItem('token');
    axios
        .post('http://localhost:5000/exp', exp, { headers: { "Authorization": token } })
        .then(res => {
            console.log('res-data');

            ShowNewExp(res.data);

            console.log(res.data);
        }).catch(err => {
            console.log(err);
        })
}

function ShowNewExp(ex) {

    document.getElementById("expence").value = "";
    document.getElementById("des").value = "";
    document.getElementById("category").value = "";

    console.log(ex.id);
    let eid = ex.id;

    let ul = document.getElementById("ul")

    let li = document.createElement("li");
    let t = document.createTextNode(ex.amount + " " + ex.description + " " + ex.category);

    li.appendChild(t);
    li.setAttribute('id', eid);
    var deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    let list = document.getElementById("ul")
    deleteButton.addEventListener("click", function () {
        deleteExp(eid);

    })

    li.appendChild(deleteButton);
    li.setAttribute("id", `${eid}`);
    ul.appendChild(li);
}

window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/exp', { headers: { "Authorization": token } })
        .then((response) => {
            console.log(response.data)
            for (let i = 0; i < response.data.length; i++) {
                ShowNewExp(response.data[i]);
            }
        })
        .catch((error) => {
            console.log(error)
        })
})

function deleteExp(x) {
    const exp_id = x;
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:5000/exp/${exp_id}`,{ headers: { "Authorization": token } })
        .then((response) => {
            console.log(response.data);
            if (response.status === 204) {
                var liToRemove = document.getElementById(exp_id);
                console.log(liToRemove);
                if (liToRemove) {
                    liToRemove.remove();

                }
                else {
                    console.error('Delete Req was not successful');
                }
            }

        })
        .catch((error) => console.log(error));
}

document.getElementById('rzp-btn').onclick = async function (e) {
    const token = localStorage.getItem('token');

    try {
        // Make a GET request to your server to get the Razorpay order details
        const response = await axios.get('http://localhost:5000/purchase/premiummembership', {
            headers: { "Authorization": token }
        });

        console.log(response);

        // Configure options for Razorpay Checkout form
        const options = {
            key: response.data.key_id,
            order_id: response.data.order.orderid,
            handler: async function (response) {
                // Make a POST request to update the transaction status
                try {
                    await axios.post('http://localhost:5000/purchase/updatetransactionstatus', {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id,
                    }, {
                        headers: { "Authorization": token }
                    });

                    alert('You are a Premium User Now');
                } catch (error) {
                    console.error(error);
                    alert('Something went wrong');
                }
            }
        };

        // Initialize Razorpay Checkout form
        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed', function (response) {
            console.log(response);
            alert('Something went wrong');
        });
    } catch (error) {
        console.error(error);
        alert('Failed to fetch Razorpay order details');
    }
};

