const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
// const ejs = require('ejs');
const query1 = 'select * from student_data where Rollno = ?'

const port = 3700;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'lib_Schema'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connection to database successful');
});

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});

// Entry End-point;
app.post('/entry', (req, res) => {
    const st_id = req.body.rollno.toUpperCase();
    const book_id = req.body.bookid.toUpperCase();
    // const date = req.body.date;
    connection.query(`select exists(select 1 from student_data where Rollno = ? )as result`, [st_id], (err, res1) => {
        if (res1[0].result != 1) {
            res.json('student not aviable in database')
        }
        else {
            connection.query(`select exists(select 1 from Book_data where bookid = ? )as result`, [book_id], (err, res2) => {
                if (res2[0].result != 1) {
                    res.json('book not aviable in database');
                }
                else {
                    connection.query('SELECT * FROM student_data WHERE Rollno = ?', [st_id], (err, result1) => {
                        if (err) {
                            console.error('Error querying student_data:', err);
                            // Handle error
                            return;
                        }

                        if (result1.length === 0) {
                            console.log('Student not found');
                            // Handle case where student is not found
                            return;
                        }

                        connection.query('SELECT * FROM Book_data WHERE bookid = ?', [book_id], (err1, result2) => {
                            if (err1) {
                                console.error('Error querying Book_data:', err1);
                                // Handle error
                                return;
                            }

                            if (result2.length === 0) {
                                res.json('Book not found');
                                // Handle case where book is not found
                                return;
                            }
                            connection.query('SELECT COUNT(*) FROM management_data WHERE bookid = ? and State = "borrowed" ', [book_id], (err1,borrow_count)=>{
                                if(err) throw err;
                                connection.query('select COUNT(*) from management_data where bookid =? and State = "return ed"',[book_id],(err,return_count)=>{
                                    if(err) throw err;
                                    else{
                                        if (borrow_count[0]['COUNT(*)'] == return_count[0]['COUNT(*)']) {
                                            const date = new Date().toISOString().slice(0, 10).replace('T', ' ');

                                            // Insert into management_data
                                            connection.query('INSERT INTO management_data VALUES (?, ?, ?, ?, ?,?,?,?)', [
                                                result1[0].Rollno,
                                                result1[0].Name,
                                                result2[0].bookid,
                                                result2[0].bookName,
                                                result2[0].Authorname,
                                                'borrowed',
                                                date,
                                                "NO"
                                            ], (err2, value) => {
                                                if (err2) {
                                                    console.error('Error inserting into management_data:', err2);
                                                    // Handle error
                                                    return;
                                                }
                                                else {
                                                    connection.query('UPDATE book_data set avaiable = "NO"  WHERE bookid = ?', [book_id]);
                
                                                    res.json("Successfully Added");
                                                }
                
                                            });
                                        }
                                        else{
                                            res.json("This Book Still didn't returned");
                                        }
                                    }
                                })

                            })
                            
                     
                        });
                        // end

                    });

                }
            })
        }
    })

})
app.post('/return', (req, res) => {
    const st_id = req.body.rollno.toUpperCase();
    const book_id = req.body.bookid.toUpperCase();
    // const date = req.body.date;
    connection.query(`select exists(select 1 from student_data where Rollno = ? )as result`, [st_id], (err, res1) => {
        if (res1[0].result != 1) {
            res.json('student not aviable in database')
        }
        else {
            connection.query(`select exists(select 1 from Book_data where bookid = ? )as result`, [book_id], (err, res2) => {
                if (res2[0].result != 1) {
                    res.json('book not aviable in database');
                }
                else {
                    connection.query('SELECT * FROM student_data WHERE Rollno = ?', [st_id], (err, result1) => {
                        if (err) {
                            console.error('Error querying student_data:', err);
                            // Handle error
                            return;
                        }

                        if (result1.length === 0) {
                            console.log('Student not found');
                            // Handle case where student is not found
                            return;
                        }

                        connection.query('SELECT * FROM Book_data WHERE bookid = ?', [book_id], (err1, result2) => {
                            if (err1) {
                                console.error('Error querying Book_data:', err1);
                                // Handle error 
                                return;
                            }

                            if (result2.length === 0) {
                                console.log('Book not found');
                                // Handle case where book is not found
                                return;
                            }

                            connection.query('SELECT COUNT(*) FROM management_data WHERE bookid = ? and State = "borrowed" ', [book_id], (err1,borrow_count)=>{
                                if(err) throw err;
                                connection.query('select COUNT(*) from management_data where bookid =? and State = "returned"',[book_id],(err,return_count)=>{
                                    if(err) throw err;
                                    else{
                                        if(borrow_count[0]['COUNT(*)'] > return_count[0]['COUNT(*)']){
                                            const date = new Date().toISOString().slice(0, 10).replace('T', ' ');

                                            // Insert into management_data
                                            connection.query('INSERT INTO management_data VALUES (?, ?, ?, ?, ?, ?, ?,?)', [
                                                result1[0].Rollno,
                                                result1[0].Name,
                                                result2[0].bookid,
                                                result2[0].bookName,
                                                result2[0].Authorname,
                                                'returned',
                                                date,
                                                "YES"
                                            ], (err2, value) => {
                                                if (err2) {
                                                    console.error('Error inserting into management_data:', err2);
                                                    // Handle error
                                                    return;
                                                }
                                                else {
                                                    connection.query('UPDATE book_data set avaiable = "YES"  WHERE bookid = ?', [book_id]);
                                                    
                                                    res.json("Successfully Added");
                
                                                }
                
                                            });
                                        }
                                        else{
                                            res.json("You Must Borrow this Book");
                                        }
                                    }
                                })})

                            // Assuming date is defined somewhere
                            
                        });
                    });

                }
            })
        }
    })

})
// Add Student end-point
app.post('/add_student', (req, res) => {
    const st_id = req.body.rollno.toUpperCase();
    const st_name = req.body.st_name.toUpperCase();

    connection.query(`select exists(select 1 from student_data where Rollno = ? )as result`, [st_id], (err, res1) => {
        if (res1[0].result == 1) {
            res.json("Student Already Avaiable");
        }

        else {
            connection.query('insert into  student_data values (?,?) ', [st_id, st_name], (err) => {
                if (err) {
                    console.error('Error querying student_data:', err);
                    // Handle error
                    return;
                }

                else {
                    res.json('Student added Successfully')
                }
            })
        }
    })
})

app.post('/add_book', (req, res) => {
    const book_id = req.body.bookid.toUpperCase();
    const book_name = req.body.bookName.toUpperCase();
    const author_name = req.body.authorname.toUpperCase();

    connection.query(`select exists(select 1 from Book_data where bookid = ? )as result`, [book_id], (err, res1) => {
        if (res1[0].result == 1) {

            res.json("Book Already In a Database");
        }

        else {
            connection.query('insert into  Book_data values (?,?,?) ', [book_id, book_name, author_name], (err) => {
                if (err) {
                    console.error('Error querying student_data:', err);
                    // Handle error
                    return;
                }

                else {
                    res.json("Successfully Added");
                }
            })
        }
    })
})


app.post('/taken', (req, res) => {
    connection.query('select * from management_data where State = "borrowed"', (err, result) => {
        res.json(result);
        // console.log(result);
    })
})
app.post('/returned', (req, res) => {
    connection.query('select * from management_data where State = "returned"', (err, result) => {
        res.json(result);
        
    })
})
app.post('/search', (req, res) => {
    const searchValue = req.body.search_value.toUpperCase();
    const filter = req.body.filter;
    
    if (filter == 1) {
        connection.query('SELECT * FROM student_data', (err, rows) => {
            if (err) {
                console.error('Error querying student_data:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }



            const searchResults = rows.filter(row => {
                // Check if searchValue is not empty and not undefined
                if (searchValue && searchValue.trim() !== '') {
                    // Perform filtering
                    return row.Rollno === searchValue || row.Name.toUpperCase().includes(searchValue.trim().toUpperCase());
                } else {
                    // If searchValue is empty or undefined, include all rows
                    return true;
                }
            });
            connection.query('select * from management_data where State = "borrowed" order by Date desc', (err, Res) => {
                let FLAG = false;
                const final_res = [];
                for (let i = 0; i < searchResults.length; i++) {
                    for (let j = 0; j < Res.length; j++) {
                        if (searchResults[i].Rollno === Res[j].Rollno) {
                            FLAG = true;
                            break; // Exit inner loop if a match is found
                        }
                    }
                    if (FLAG) {
                        break; // Exit outer loop if a match is found
                    }
                }

                // if (FLAG) {
                //      final_res.push(Res);
                // } 
                res.json(searchResults);
            });
        });
    }
    else if (filter == 2) {

        connection.query('select * from book_data', (err, bookres) => {
            const book_result = bookres.filter(bookres => bookres.bookid == searchValue || bookres.bookName.includes(searchValue));
            res.json(book_result);
        })
    }
})

app.post('/retrieve-data', (req, res) => {

    connection.query('select * from management_data where Rollno = ? order by Date', [req.body.rollno], (err, st_data) => {
        if (st_data.length == 0) {
            res.json(`'${req.body.name}' Data Not Avaiable  `)
        }
        else {
            res.json(st_data);

        }
    })
});


app.post('/User', (req, res_1) => {
    const Pass = req.body.Password;
    connection.query('select exists(select 1 from Pass_word where pass = ?)as result', [Pass], (err, res) => {
        console.log(res);
        if (res[0].result === 1) {

            res_1.json(true);

        } else {
            res_1.json(false);
        }
    })

})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post('/pending',(req,res)=>{
    connection.query('Select * from management_data where handover = "NO"',(err,result)=>{
        if(err) throw err;
        else {
            res.json(result);
        }
    })    
})
app.post('/pending_indivual',(req,res)=>{
    const st_id = req.body.rollno;
    connection.query('Select * from management_data where handover = "NO" and Rollno = ?',[st_id],(err,result)=>{
        if(err) throw err;
        else {
            if(result.length==0){
                res.json("All the books are returned");
            }
            res.json(result);
        }
    })    
})
