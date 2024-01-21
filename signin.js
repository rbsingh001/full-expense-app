function userlogin() {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    if (email.trim() === "" || password.trim() === "") {
        alert("Please fill All inputs carefully ");
        return;
    }

    axios.post('http://localhost:5000/user/login', {
        email: email,
        password: password
    })
        .then(res => {
            if (res.data.message === 'Login successful') {
                console.log('Login Successful');

                const token = res.data.token;
                localStorage.setItem('token',token);
                window.location.href = `file:///C:/Users/dell/Desktop/Exp/exp.html`;
                document.getElementById('email').value = "";
                document.getElementById('password').value = "";
            }
            else {
                console.log('Unexpected response ', res.data.message);
            }

        })
        .catch(err => {
            if (err.response) {
                if (err.response.status === 404) {
                    console.log('User not found with this email');
                    alert('User not found with this email');
                }
                else if (err.response.status === 401) {
                    console.log("Incorrect password");
                    alert("Incorrect password");
                }
                else {
                    console.log('Unexpected Error', err.response.data.message);
                }

            } else {
                console.log('Error : ', err.message);
            }

        });
}
