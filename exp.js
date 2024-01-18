
var z = 0;
var e;
let urlparams = new URLSearchParams(window.location.search);

let userId = urlparams.get('id');
console.log(userId);
console.log("hello");

function myfunction() {

    if (z == 0) {
        console.log(userId)

        let amount = document.getElementById("expence").value;
        let description = document.getElementById("des").value;
        let category = document.getElementById("category").value;

        const exp = {
            amount: amount,
            description: description,
            category: category
        }

        axios
            .post(`http://localhost:5000/exp/${userId}`,
                exp
            )
            .then(res => {

                console.log('res-data');

                ShowNewExp(res.data);

                console.log(res.data);
            }).catch(err => {
                console.log(err);
            })
    }

    if (z == 1) {
        z = 0;
        let amount = document.getElementById("expence").value;
        let description = document.getElementById("des").value;
        let category = document.getElementById("category").value;

        const exp = {
            amount: amount,
            description: description,
            category: category
        }


        axios.put(`http://localhost:5000/exp/${e}`, exp)
            .then((res) => {
                console.log(res.data);
                document.getElementById("expence").value = "";
                document.getElementById("des").value = "";
                document.getElementById("category").value = "";
                ShowOldExp(res.data);
            })
            .catch((err) => console.log(err));
    }
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

    var editbtn = document.createElement('button');
    editbtn.innerText = 'Edit';
    editbtn.addEventListener("click", function () {
        editExp(eid);
    })

    li.appendChild(deleteButton);
    li.appendChild(editbtn);


    li.setAttribute("id", `${eid}`);
    ul.appendChild(li);
}

window.addEventListener("DOMContentLoaded", () => {
    axios.get(`http://localhost:5000/exp/${userId}`)
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
    axios.delete(`http://localhost:5000/exp/${exp_id}`)
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

function editExp(x) {
    e = x;
    axios.get(`http://localhost:5000/edit-exp/${x}`)
        .then(res => {

            document.getElementById("expence").value = res.data.amount;
            description = document.getElementById("des").value = res.data.description;
            category = document.getElementById("category").value = res.data.category;
            z = 1;
        })
        .catch((err) => {
            console.log(err);
        });

}

function ShowOldExp(ex) {

    //     document.getElementById("expence").value = "";
    //     document.getElementById("des").value = "";
    //     document.getElementById("category").value = "";

    //     console.log(ex.id);
    //     let eid = ex.id;

    //     // let ul = document.getElementById("ul")

    //     let li = document.getElementById(eid);
    //     li.innerText="";
    //     let t = document.createTextNode(ex.amount + " " + ex.description + " " + ex.category);

    //     li.appendChild(t);
    //     // li.setAttribute('id', eid);
    //     var deleteButton = document.createElement('button');
    //     deleteButton.innerText = 'Delete';
    //     let list = document.getElementById("ul")
    //     deleteButton.addEventListener("click", function () {
    //         deleteExp(eid);

    //     })

    //     var editbtn = document.createElement('button');
    //     editbtn.innerText = 'Edit';
    //     editbtn.addEventListener("click", function () {
    //         editExp(eid);
    //     })

    //     li.appendChild(deleteButton);
    //     li.appendChild(editbtn);


    //     li.setAttribute("id", `${eid}`);
    //     // ul.appendChild(li);
}