
const msg = document.createElement('h3');
msg.className = "text-center";
msg.innerText = "No Data Found.";
function GenrateId(){
  fetch('/id',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  )
    .then(res => res.json())
    .then(data => {
      window.alert("New Book ID is : "+data);
  })
}
function Close(){
  document.getElementById("entry").style.display = "flex";
  document.getElementById("return").style.display = "none";
  document.getElementById("add_student").style.display = "none";
  document.getElementById("add_book").style.display = "none";
  document.getElementById("database").style.display = "none";
  document.getElementById("database-search").style.display = "none";
  document.getElementById("personal_info").style.display = "none";
  document.getElementById("Book-search").style.display = "none";
  document.getElementById("database-pending").style.display = "none";
  document.getElementById("popup").style.display = "none";
  document.getElementById("popup-pass").style.display = "none";
  document.getElementById("change_password").style.display="none"
  window.location.reload(true);
}
function entry_form() {
  document.getElementById("entry").style.display = "flex";
  document.getElementById("return").style.display = "none";
  document.getElementById("add_student").style.display = "none";
  document.getElementById("add_book").style.display = "none";
  document.getElementById("database").style.display = "none";
  document.getElementById("database-search").style.display = "none";
  document.getElementById("personal_info").style.display = "none";
  document.getElementById("Book-search").style.display = "none";
  document.getElementById("database-pending").style.display = "none";
  document.getElementById("popup-pass").style.display = "none"
  document.getElementById("change_password").style.display="none"
 // Reload the current webpage



}
entry_form();
return_form = () => {
  document.getElementById("entry").style.display = "none";
  document.getElementById("return").style.display = "flex";
  document.getElementById("add_student").style.display = "none";
  document.getElementById("add_book").style.display = "none";
  document.getElementById("database").style.display = "none";
  document.getElementById("database-search").style.display = "none";
  document.getElementById("personal_info").style.display = "none";
  document.getElementById("popup").style.display = "flex";
  document.getElementById("Book-search").style.display = "none";
  document.getElementById("database-pending").style.display = "none";
  document.getElementById("popup-pass").style.display = "none"
  document.getElementById("change_password").style.display="none"
}
add_student_form = () => {
  document.getElementById("entry").style.display = "none";
  document.getElementById("return").style.display = "none";
  document.getElementById("add_student").style.display = "flex";
  document.getElementById("add_book").style.display = "none";
  document.getElementById("database").style.display = "none";
  document.getElementById("database-search").style.display = "none";
  document.getElementById("personal_info").style.display = "none";
  document.getElementById("popup").style.display = "flex";
  document.getElementById("Book-search").style.display = "none";
  document.getElementById("database-pending").style.display = "none";
  document.getElementById("popup-pass").style.display = "none"
  document.getElementById("change_password").style.display="none"




}
add_book_form = () => {
  document.getElementById("entry").style.display = "none";
  document.getElementById("return").style.display = "none";
  document.getElementById("add_student").style.display = "none";
  document.getElementById("add_book").style.display = "flex";
  document.getElementById("database").style.display = "none";
  document.getElementById("database-search").style.display = "none";
  document.getElementById("personal_info").style.display = "none";
  // document.getElementById("popup").style.display = "flex";
  document.getElementById("Book-search").style.display = "none";
  document.getElementById("database-pending").style.display = "none";
  document.getElementById("popup-pass").style.display = "none"
  document.getElementById("change_password").style.display="none"
}
taken_data = () => {
  const tble = document.getElementById('table');
  tble.innerHTML = "";
  document.getElementById("entry").style.display = "none";
  document.getElementById("return").style.display = "none";
  document.getElementById("add_student").style.display = "none";
  document.getElementById("add_book").style.display = "none";
  document.getElementById("database").style.display = "flex";
  document.getElementById("database-search").style.display = "none";
  document.getElementById("personal_info").style.display = "none";
  // document.getElementById("popup").style.display="flex";
  document.getElementById("Book-search").style.display = "none";
  document.getElementById("database-pending").style.display = "none";
  document.getElementById("popup-pass").style.display = "none"
  document.getElementById("change_password").style.display="none"


  fetch('/taken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  )
    .then(res => res.json())
    .then(data => {
      if(data.length==0){
        tble.appendChild(msg)
       }
      for (var i in data) {
      
        const row = document.createElement('tr');

        row.innerHTML = `<td>${data[i].Rollno}</td><td>${data[i].Name}</td><td>${data[i].bookid}</td><td>${data[i].bookName}</td><td>${data[i].Authorname}</td><td>${data[i].State}</td><td>${data[i].Date}</td>`;
        tble.appendChild(row);
      }
    })


}
return_data = () => {
  const tble = document.getElementById('table');
  tble.innerHTML = "";
  document.getElementById("entry").style.display = "none";
  document.getElementById("return").style.display = "none";
  document.getElementById("add_student").style.display = "none";
  document.getElementById("add_book").style.display = "none";
  document.getElementById("database-search").style.display = "none";
  document.getElementById("database").style.display = "flex";
  document.getElementById("personal_info").style.display = "none";
  document.getElementById("Book-search").style.display = "none";
  document.getElementById("database-pending").style.display = "none";
  document.getElementById("popup-pass").style.display = "none"
  document.getElementById("change_password").style.display="none"
  // document.getElementById("popup").style.display="flex";
  fetch('/returned', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  )
    .then(res => res.json())
    
    .then(data => {
      if(data.length==0){
        tble.appendChild(msg)
       }
      for (var i in data) {

        const row = document.createElement('tr');

        row.innerHTML = `<td>${data[i].Rollno}</td><td>${data[i].Name}</td><td>${data[i].bookid}</td><td>${data[i].bookName}</td><td>${data[i].Authorname}</td><td>${data[i].State}</td><td>${data[i].Date}</td>`;
        tble.appendChild(row);
      }
    })


}
pending_data = () => {
  const tble = document.getElementById('table-pending');
  tble.innerHTML = "";
  document.getElementById("entry").style.display = "none";
  document.getElementById("return").style.display = "none";
  document.getElementById("add_student").style.display = "none";
  document.getElementById("add_book").style.display = "none";
  document.getElementById("database-search").style.display = "none";
  document.getElementById("database").style.display = "none";
  document.getElementById("personal_info").style.display = "none";
  document.getElementById("Book-search").style.display = "none";
  document.getElementById("database-pending").style.display = "flex";
  document.getElementById("popup-pass").style.display = "none"
  document.getElementById("change_password").style.display="none"
  // document.getElementById("popup").style.display="flex";
  fetch('/pending', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  )
    .then(res => res.json())
    .then(data => {
      if(data.length==0){
        tble.appendChild(msg)
       }
      for (var i in data) {

        const row = document.createElement('tr');

        row.innerHTML = `<td>${data[i].Rollno}</td><td>${data[i].Name}</td><td>${data[i].bookid}</td><td>${data[i].bookName}</td><td>${data[i].Authorname}</td><td>${data[i].date}</td>`;
        tble.appendChild(row);
      }
    })


}

function search() {
  const filter = document.getElementById("filter").value;
  if (filter == 1) {
    const tble = document.getElementById('table');
    tble.innerHTML = "";
    document.getElementById("entry").style.display = "none";
    document.getElementById("return").style.display = "none";
    document.getElementById("add_student").style.display = "none";
    document.getElementById("add_book").style.display = "none";
    document.getElementById("database-search").style.display = "flex";
    document.getElementById("database").style.display = "none";
    document.getElementById("Book-search").style.display = "none";
    document.getElementById("personal_info").style.display = "none";
    document.getElementById("database-pending").style.display = "none";
    document.getElementById("popup-pass").style.display = "none"
    document.getElementById("change_password").style.display="none"
  }
  else {
    const tble = document.getElementById('table');
    tble.innerHTML = "";
    document.getElementById("entry").style.display = "none";
    document.getElementById("return").style.display = "none";
    document.getElementById("add_student").style.display = "none";
    document.getElementById("add_book").style.display = "none";
    document.getElementById("database-search").style.display = "none";
    document.getElementById("database").style.display = "none";
    document.getElementById("Book-search").style.display = "flex";
    document.getElementById("personal_info").style.display = "none";
    document.getElementById("database-pending").style.display = "none";
    document.getElementById("popup-pass").style.display = "none"
    document.getElementById("change_password").style.display="none"
  }

}

document.getElementById('searchForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get search value from the form
  const searchValue = document.querySelector('input[name="search_value"]').value;
  const Filter = document.querySelector('select[name="filter"]').value;

  // Make an AJAX request to the server
  fetch('/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ search_value: searchValue, filter: Filter })
  })
    .then(response => response.json())
    .then(data => {
      // Render search results
      renderSearchResults(data, Filter);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

function renderSearchResults(results, filter) {
  if (filter == 1) {
    const container = document.getElementById('table-search');
    container.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
      // Display message if no results found
      const message = document.createElement('p');
      message.textContent = 'No results found.';
      container.appendChild(message);
    } else {
      // Render each search result as table rows
      results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td name="Rollno">${result.Rollno}</td>
          <td name="Name">${result.Name}</td>
          <td><button class="btn btn-primary view-btn">View</button></td>
          <td><button class="btn btn-secondary pending-btn">Pending</button></td>
          <td><button class="btn btn-danger remove-btn">Remove</button></td>
        `;
        container.appendChild(row);
      });
    }
  } else if (filter == 2) {
    const container = document.getElementById('book-search');
    container.innerHTML = '';  // Clear previous results

    if (results.length === 0) {
      // Display message if no results found
      const message = document.createElement('p');
      message.textContent = 'No results found.';
      container.appendChild(message);
    } else {
      // Render each search result as table rows
      results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td name="bookid">${result.bookid}</td>
          <td name="bookName">${result.bookName}</td>
          <td>${result.Authorname}</td>
          <td>${result.avaiable}</td>
        `;
        container.appendChild(row);
      });
    }
  }
}

// Add an event listener to handle click events on search results
document.getElementById('table-search').addEventListener('click', function (event) {
  if (event.target.classList.contains('view-btn')) {
    // Handle view button click
    const row = event.target.closest('tr');
    const rollno = row.querySelector('[name="Rollno"]').textContent;
    const name = row.querySelector('[name="Name"]').textContent;

    fetch('/retrieve-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rollno, name })
    })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the server
      if (data.length > 0 && data[0].Rollno) {
        document.getElementById("entry").style.display = "none";
        document.getElementById("return").style.display = "none";
        document.getElementById("add_student").style.display = "none";
        document.getElementById("add_book").style.display = "none";
        document.getElementById("database").style.display = "none";
        document.getElementById("database-search").style.display = "none";
        document.getElementById("personal_info").style.display = "flex";
        document.getElementById("book-search").style.display = "none";
        document.getElementById("content_for_student_data").innerHTML = "";
        document.getElementById("popup-pass").style.display = "none"
        document.getElementById("change_password").style.display="none"

        const table = document.getElementById('content_for_student_data');
        data.forEach(item => {
          const Row = document.createElement("tr");
          Row.innerHTML = `
            <td>${item.Rollno}</td>
            <td>${item.Name}</td>
            <td>${item.bookid}</td>
            <td>${item.bookName}</td>
            <td>${item.Authorname}</td>
            <td>${item.State}</td>
            <td>${item.Date}</td>
          `;
          table.appendChild(Row);
        });
      } else {
        window.alert(data);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  } else if (event.target.classList.contains('pending-btn')) {
    // Handle pending button click
    const row = event.target.closest('tr');
    const rollno = row.querySelector('[name="Rollno"]').textContent;

    fetch('/pending_indivual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rollno })
    })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the server
      if (data.length > 0 && data[0].Rollno) {
        document.getElementById("entry").style.display = "none";
        document.getElementById("return").style.display = "none";
        document.getElementById("add_student").style.display = "none";
        document.getElementById("add_book").style.display = "none";
        document.getElementById("database").style.display = "none";
        document.getElementById("database-search").style.display = "none";
        document.getElementById("personal_info").style.display = "none";
        document.getElementById("book-search").style.display = "none";
        document.getElementById("table-pending").innerHTML = "";
        document.getElementById("popup-pass").style.display = "none"
        // document.getElementById("password_change").style.display = "none";
        document.getElementById('database-pending').style.display="flex"
        document.getElementById("change_password").style.display="none"

        const table = document.getElementById('table-pending');
        data.forEach(item => {
          console.log(item)
          const Row = document.createElement("tr");
          Row.innerHTML = `
            <td>${item.Rollno}</td>
            <td>${item.Name}</td>
            <td>${item.bookid}</td>
            <td>${item.bookName}</td>
            <td>${item.Authorname}</td>
            
            <td>${item.date}</td>
          `;
          table.appendChild(Row);
        });
      } else {
        window.alert(data);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  } else if (event.target.classList.contains('remove-btn')) {
    // Handle remove button click
    const row = event.target.closest('tr');
    const rollno = row.querySelector('[name="Rollno"]').textContent;
    const adminPassword = prompt("Please enter the admin password:");
    if(adminPassword!==null){
    fetch('/remove-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rollno,adminPassword})
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Remove the row from the table
        row.remove();
      } else {
        window.alert('Failed to remove student:'+data.message);
      }
    })
  
    .catch(error => {
      console.error('Error:', error);
    });
  }
  }
});

// Add an event listener to handle click events on search results
// document.getElementById('table-search').addEventListener('click', function (event) {

//   // Check if the clicked element is a button inside a search result row
//   if (event.target.tagName === 'BUTTON') {
//     // Get the parent row of the clicked button
//     const row = event.target.closest('tr');
//     // Extract the relevant values from the row
//     const rollno = row.querySelector('[name="Rollno"]').textContent;
//     const name = row.querySelector('[name="Name"]').textContent;

//     // Send the values to the Node.js server using AJAX
//     fetch('/retrieve-data', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ rollno: rollno, name: name })
//     })
//       .then(response => response.json())
//       .then(data => {
//         // Handle the response from the server
//         if (data[0].Rollno != undefined) {

//           // for display properties

//           document.getElementById("entry").style.display = "none";
//           document.getElementById("return").style.display = "none";
//           document.getElementById("add_student").style.display = "none";
//           document.getElementById("add_book").style.display = "none";
//           document.getElementById("database").style.display = "none";
//           document.getElementById("database-search").style.display = "none";
//           document.getElementById("personal_info").style.display = "flex";
//           document.getElementById("book-search").style.display = "none";
//           document.getElementById("content_for_student_data").innerHTML = "";

//           const table = document.getElementById('content_for_student_data');
//           for (var i in data) {
//             const Row = document.createElement("tr");
//             Row.innerHTML = `<td>${data[i].Rollno}</td><td>${data[i].Name}</td><td>${data[i].Bookid}</td><td>${data[i].BookName}</td><td>${data[i].Authorname}</td><td>${data[i].State}</td><td>${data[i].Date}</td>`
//             table.appendChild(Row);
//           }

//         }

//         else {
//           window.alert(data);
//         }

//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
//   }


// });



document.getElementById('Userform').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get search value from the form
  const Passvalue = document.querySelector('input[name="Password"]').value;

  // Make an AJAX request to the server
  fetch('/User', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ Password: Passvalue })
  })
    .then(response => response.json())
    .then(data => {
      // Render search results
      if (data) {
        document.getElementById("pass_field").value = "";
        document.getElementById("popup").style.display = "none";
      }
      else {
        window.alert("Password Is Incorrect");
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
document.getElementById('ReturnForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get search value from the form
  const rollno = document.querySelector('input[name="rollno_return"]').value;
  const bookid = document.querySelector('input[name="bookid_return"]').value;

  // Make an AJAX request to the server
  fetch('/return', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ rollno: rollno, bookid: bookid })
  })
    .then(response => response.json())
    .then(data => {
      window.alert(data.message);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

document.getElementById('add_book').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get search value from the form
  const bookid = document.querySelector('input[name="book_id"]').value;
  const bookName = document.querySelector('input[name="book_name"]').value;
  const authorname = document.querySelector('input[name="authorname"]').value;

  // Make an AJAX request to the server
  fetch('/add_book', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ bookid: bookid, bookName: bookName, authorname: authorname })
  })
    .then(response => response.json())
    .then(data => {
      window.alert(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

function change_password(){
  document.getElementById("entry").style.display = "none";
  document.getElementById("return").style.display = "none";
  document.getElementById("add_student").style.display = "none";
  document.getElementById("add_book").style.display = "none";
  document.getElementById("database").style.display = "none";
  document.getElementById("database-search").style.display = "none";
  document.getElementById("personal_info").style.display = "none";
  document.getElementById("Book-search").style.display = "none";
  document.getElementById("database-pending").style.display = "none";
  document.getElementById("popup-pass").style.display = "none"
  document.getElementById("change_password").style.display="flex"
}


document.getElementById('password_change_form').addEventListener("submit",(event)=>{
  event.preventDefault();
  const Rollno = document.getElementById("Student_id_pass").value;
  const Old_pass = document.getElementById("old_pass").value;
  const New_pass = document.getElementById("new_pass").value;
  fetch("/change_password",{
    method:"POST",
    headers:{
      "Content-Type" : "application/json",
    },
    body:JSON.stringify({Rollno:Rollno,Old_pass:Old_pass,New_pass:New_pass})
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.flag){
       document.getElementById("Student_id_pass").value="";
       document.getElementById("old_pass").value="";
       document.getElementById("new_pass").value="";
      window.alert(data.message);
    }
    else{
      window.alert(data.message)
    }
  })
})
document.getElementById('upload_form').addEventListener('submit', (event) => {
  event.preventDefault();
  
  const formData = new FormData();
  const fileField = document.querySelector('input[type="file"]');
  
  formData.append('csvfile', fileField.files[0]);

  fetch('/upload', {
      method: 'POST',
      body: formData
  })
  .then(response => response.text())
  .then(result => {
     window.alert(result);
  })
  .catch(error => {
      console.error('Error:', error);
     window.alert('Error While Inserting')
  });
});