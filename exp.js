
function showPremium() {
    document.getElementById('rzp-btn').style.visibility = 'hidden'
    let premium = document.getElementById('premium')
    let p = document.createTextNode("You are a Premium User");
    let leaderboard = document.createElement('button');
    leaderboard.innerText="Show Leaderboard";
    leaderboard.addEventListener("click", function () {
        showLeaderboard();

    })
    premium.appendChild(p);
    premium.appendChild(leaderboard);
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

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
    const tokendata = parseJwt(token)
    let isPremium = tokendata.isPremium;
    if (isPremium) {
        showPremium();
    }
    axios.get('http://localhost:5000/exp', { headers: { "Authorization": token } })
        .then((response) => {
            console.log(response.data.exps)


            for (let i = 0; i < response.data.exps.length; i++) {
                ShowNewExp(response.data.exps[i]);
            }
        })
        .catch((error) => {
            console.log(error)
        })

})

function deleteExp(x) {
    const exp_id = x;
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:5000/exp/${exp_id}`, { headers: { "Authorization": token } })
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

        console.log(response.data.key_id , "--------",response.data.order.orderid);

        // Configure options for Razorpay Checkout form
        const options = {
            key: response.data.key_id,
            order_id: response.data.order.orderid,
            handler: async function (response) {
                // Make a POST request to update the transaction status
                try {
                    const res = await axios.post('http://localhost:5000/purchase/updatetransactionstatus', {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id,
                    }, {
                        headers: { "Authorization": token }
                    });
                    alert('You are a Premium User Now');
                    // console.log(res.data.token)
                    localStorage.setItem('token',res.data.token);
                    showPremium();

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

function showLeaderboard(){
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/premium/leaderboard', { headers: { "Authorization": token } })
        .then((response) => {
            console.log(response.data)
            let lb = document.getElementById('lb');
            lb.innerText="";

            for (let i = 0; i < response.data.length; i++) {
                let li = document.createElement('li');
                let name = response.data[i].name;
                let amount = response.data[i].total_cost;
                li.innerText = `Name : ${name}  Total Expence: ${amount}`
                lb.appendChild(li); 
            }
        })
        .catch((error) => {
            console.log(error)
        })

}