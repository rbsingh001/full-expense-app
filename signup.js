function usersignup(){
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    if(name.trim() === "" || email.trim() === "" || password.trim() === ""){
        alert("Please fill All inputs carefully ");
        return;
    }
    
    axios.post('http://localhost:5000/user/signup', {
        name: name,
        email: email,
        password: password
      })
      .then(res => {
        console.log("Sign Up Successful")

        console.log(res);

        document.getElementById('name').value = "";
        document.getElementById('email').value = "";
        document.getElementById('password').value = "";
        })
      .catch(err => {
        if(err.response && err.response.status === 409){
            console.log("User already exists");
            alert("User with this email already exists");
        }
        else{
            console.log(err);
        }
      });

    

}