const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const { Console } = require('console');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });

const query1 = 'select * from student_data where Rollno = ?'

const port = 3700;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'lib_Schema'
});
connection.query("SET SQL_SAFE_UPDATES = 0",(err)=>{
    if(err)  throw err;
})
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
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Entry End-point;
app.post('/entry', (req, res) => {
    const st_id = req.body.rollno.toUpperCase();
    const book_id = req.body.bookid.toUpperCase();
    const date = req.body.date;

    connection.query('SELECT EXISTS(SELECT 1 FROM student_data WHERE Rollno = ?) AS result', [st_id], (err, res1) => {
        if (err) {
            console.error('Error querying student_data:', err);
            return res.status(500).json('Error querying student_data');
        }
        if (res1[0].result != 1) {
            return res.json('Student not available in database');
        }

        connection.query('SELECT EXISTS(SELECT 1 FROM book_data WHERE bookid = ?) AS result', [book_id], (err, res2) => {
            if (err) {
                console.error('Error querying book_data:', err);
                return res.status(500).json('Error querying book_data');
            }
            if (res2[0].result != 1) {
                return res.json('Book not available in database');
            }

            connection.query('SELECT * FROM student_data WHERE Rollno = ?', [st_id], (err, result1) => {
                if (err) {
                    console.error('Error querying student_data:', err);
                    return res.status(500).json('Error querying student_data');
                }
                if (result1.length === 0) {
                    return res.json('Student not found');
                }

                connection.query('SELECT * FROM book_data WHERE bookid = ?', [book_id], (err, result2) => {
                    if (err) {
                        console.error('Error querying book_data:', err);
                        return res.status(500).json('Error querying book_data');
                    }
                    if (result2.length === 0) {
                        return res.json('Book not found');
                    }

                    connection.query('SELECT COUNT(*) AS count FROM management_data WHERE bookid = ? AND State = "borrowed"', [book_id], (err, borrow_count) => {
                        if (err) {
                            console.error('Error querying management_data:', err);
                            return res.status(500).json('Error querying management_data');
                        }

                        connection.query('SELECT COUNT(*) AS count FROM management_data WHERE bookid = ? AND State = "returned"', [book_id], (err, return_count) => {
                            if (err) {
                                console.error('Error querying management_data:', err);
                                return res.status(500).json('Error querying management_data');
                            }

                            if (borrow_count[0].count == return_count[0].count) {
                                const date = new Date().toISOString().slice(0, 10);

                                connection.query('UPDATE book_data SET avaiable = "NO" WHERE bookid = ?', [book_id], (err) => {
                                    if (err) {
                                        console.error('Error updating book_data:', err);
                                        return res.status(500).json('Error updating book_data');
                                    }
                                    else{
                                        console.log("Success");
                                    }

                                    connection.query('INSERT INTO management_data (Rollno, Name, bookid, bookName, Authorname, State, date) VALUES (?, ?, ?, ?, ?, ?, ?)', [
                                        result1[0].Rollno,
                                        result1[0].Name,
                                        result2[0].bookid,
                                        result2[0].bookName,
                                        result2[0].Authorname,
                                        'borrowed',
                                        date
                                    ], (err2) => {
                                        if (err2) {
                                            console.error('Error inserting into management_data:', err2);
                                            return res.status(500).json('Error inserting into management_data');
                                        }

                                        connection.query('INSERT INTO pending_data (Rollno, Name, bookid, bookName, Authorname, date) VALUES (?, ?, ?, ?, ?, ?)', [
                                            result1[0].Rollno,
                                            result1[0].Name,
                                            result2[0].bookid,
                                            result2[0].bookName,
                                            result2[0].Authorname,
                                            date
                                        ], (err) => {
                                            if (err) {
                                                console.error('Error inserting into pending_data:', err);
                                                return res.status(500).json('Error inserting into pending_data');
                                            }

                                            res.json('Successfully Added');
                                        });
                                    });
                                });
                            } else {
                                res.json('This book is still not returned');
                            }
                        });
                    });
                });
            });
        });
    });
});


app.post('/return', (req, res) => {
    const st_id = req.body.rollno.toUpperCase();
    const book_id = req.body.bookid.toUpperCase();

    // Check if the student exists in the database
    connection.query(`SELECT EXISTS(SELECT 1 FROM student_data WHERE Rollno = ?) AS result`, [st_id], (err, res1) => {
        if (err) {
            console.error('Error querying student_data:', err);
            res.json({ success: false, message: 'Error querying student_data' });
            return;
        }

        if (res1[0].result != 1) {
            res.json({ success: false, message: 'Student not available in database' });
        } else {
            // Check if the book exists in the database
            connection.query(`SELECT EXISTS(SELECT 1 FROM Book_data WHERE bookid = ?) AS result`, [book_id], (err, res2) => {
                if (err) {
                    console.error('Error querying Book_data:', err);
                    res.json({ success: false, message: 'Error querying Book_data' });
                    return;
                }

                if (res2[0].result != 1) {
                    res.json({ success: false, message: 'Book not available in database' });
                } else {
                    // Get student details
                    connection.query('SELECT * FROM student_data WHERE Rollno = ?', [st_id], (err, result1) => {
                        if (err) {
                            console.error('Error querying student_data:', err);
                            res.json({ success: false, message: 'Error querying student_data' });
                            return;
                        }

                        if (result1.length === 0) {
                            res.json({ success: false, message: 'Student not found' });
                            return;
                        }

                        // Get book details
                        connection.query('SELECT * FROM Book_data WHERE bookid = ?', [book_id], (err1, result2) => {
                            if (err1) {
                                console.error('Error querying Book_data:', err1);
                                res.json({ success: false, message: 'Error querying Book_data' });
                                return;
                            }

                            if (result2.length === 0) {
                                res.json({ success: false, message: 'Book not found' });
                                return;
                            }

                            // Check borrow count vs return count
                            connection.query('SELECT COUNT(*) AS borrow_count FROM management_data WHERE bookid = ? AND State = "borrowed"', [book_id], (err, borrow_count) => {
                                if (err) {
                                    console.error('Error querying management_data:', err);
                                    res.json({ success: false, message: 'Error querying management_data' });
                                    return;
                                }

                                connection.query('SELECT COUNT(*) AS return_count FROM management_data WHERE bookid = ? AND State = "returned"', [book_id], (err, return_count) => {
                                    if (err) {
                                        console.error('Error querying management_data:', err);
                                        res.json({ success: false, message: 'Error querying management_data' });
                                        return;
                                    }

                                    if (borrow_count[0].borrow_count > return_count[0].return_count) {
                                        const date = new Date().toISOString().slice(0, 10);

                                        // Update book availability
                                        connection.query('UPDATE book_data SET avaiable = "YES" WHERE bookid = ?', [book_id], (err) => {
                                            if (err) {
                                                console.error('Error updating book_data:', err);
                                                res.json({ success: false, message: 'Error updating book_data' });

                                            }

                                            // Insert into management_data
                                            connection.query('INSERT INTO management_data (Rollno, Name, bookid, bookName, Authorname, State, date) VALUES (?, ?, ?, ?, ?, ?, ?)', [
                                                result1[0].Rollno,
                                                result1[0].Name,
                                                result2[0].bookid,
                                                result2[0].bookName,
                                                result2[0].Authorname,
                                                'returned',
                                                date
                                            ], (err2, value) => {
                                                if (err2) {
                                                    console.error('Error inserting into management_data:', err2);
                                                    res.json({ success: false, message: 'Error inserting into management_data' });
                                                    return;
                                                } else {
                                                    connection.query('delete from pending_data where rollno = ? and bookid = ?', [st_id, book_id], (err) => {
                                                        if (err) throw err;
                                                    })
                                                    res.json({ success: true, message: 'Successfully returned the book' });
                                                }
                                            });
                                        });
                                    } else {
                                        res.json({ success: false, message: 'You must borrow this book before returning it' });
                                    }
                                });
                            });
                        });
                    });
                }
            });
        }
    });
});

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

    connection.query(`select exists(select 1 from book_data where bookid = ? )as result`, [book_id], (err, res1) => {
        if (res1[0].result == 1) {

            res.json("Book Already In a Database");
        }

        else {
            connection.query('insert into  book_data values (?,?,?,?) ', [book_id, book_name, author_name,"YES"], (err) => {
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
        if (err) throw err;
        // console.log(result)
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

            // Sort searchResults based on how well the names match the search value
            searchResults.sort((a, b) => {
                const nameA = a.Name.toUpperCase();
                const nameB = b.Name.toUpperCase();
                const indexA = nameA.indexOf(searchValue);
                const indexB = nameB.indexOf(searchValue);
                if (indexA === 0 && indexB !== 0) {
                    return -1;
                } else if (indexA !== 0 && indexB === 0) {
                    return 1;
                } else {
                    return nameA.localeCompare(nameB);
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
    } else if (filter == 2) {
        connection.query('select * from book_data', (err, bookres) => {
            if (err) {
                console.error('Error querying book_data:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            const bookResults = bookres.filter(book => {
                // Check if searchValue is not empty and not undefined
                if (searchValue && searchValue.trim() !== '') {
                    // Perform filtering
                    return book.bookid == searchValue || book.bookName.toUpperCase().includes(searchValue.trim().toUpperCase());
                } else {
                    // If searchValue is empty or undefined, include all rows
                    return true;
                }
            });

            // Sort bookResults based on how well the names match the search value
            bookResults.sort((a, b) => {
                const nameA = a.bookName.toUpperCase();
                const nameB = b.bookName.toUpperCase();
                const indexA = nameA.indexOf(searchValue);
                const indexB = nameB.indexOf(searchValue);
                if (indexA === 0 && indexB !== 0) {
                    return -1;
                } else if (indexA !== 0 && indexB === 0) {
                    return 1;
                } else {
                    return nameA.localeCompare(nameB);
                }
            });

            res.json(bookResults);
        });
    }
});




app.post('/retrieve-data', (req, res) => {

    connection.query('select * from management_data where Rollno = ? order by Date', [req.body.rollno], (err, st_data) => {
        if (st_data.length == 0) {
            res.json(`'${req.body.name}' Data Not Available `)
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

app.post('/pending', (req, res) => {
    connection.query('Select * from pending_data', (err, result) => {
        if (err) throw err;
        else {
            res.json(result);
        }
    })
})
app.post('/pending_indivual', (req, res) => {
    const st_id = req.body.rollno;
    connection.query('Select * from pending_data where  Rollno = ?', [st_id], (err, result) => {
        if (err) throw err;
        else {
            if (result.length == 0) {
                res.json("All the books are returned");
            }
            res.json(result);
        }
    })
})
app.post('/change_password', (req, res) => {
    const roll_no = req.body.Rollno.toUpperCase();
    const old_password = req.body.Old_pass;
    const new_password = req.body.New_pass;

    // Step 1: Select the current password for the given roll_no
    connection.query('SELECT password FROM student_data WHERE rollno = ?', [roll_no], (error, results) => {
        if (error) {
            return res.json('Error querying the database.');
        }

        if (results.length === 0) {
            return res.json({ flag: false, message: 'Roll number not found.' });
        }

        const current_password = results[0].password;

        // Step 2: Check if the provided old_password matches the current password
        if (current_password !== old_password) {
            return res.json({ flag: false, message: 'Old password is incorrect or Try to Change the Case of Letters' });
        }

        // Step 3: Update the password with the new one
        connection.query('UPDATE student_data SET password = ? WHERE rollno = ?', [new_password, roll_no], (updateError) => {
            if (updateError) {
                return res.status(500).send('Error updating the password.');
            }

            res.json({ flag: true, message: 'Password updated successfully.' });
        });
    });
});

app.post('/remove-student', (req, res) => {
    const roll_no = req.body.rollno;
    const admin_pass = req.body.adminPassword;

    // Check if the admin password is correct
    connection.query('SELECT EXISTS(SELECT 1 FROM Pass_word WHERE pass = ?) AS result', [admin_pass], (err, results) => {
        if (err) {
            res.json({ success: false, message: "Error in password verification" });
        } else if (results[0].result === 1) {
            // If the password is correct, proceed to delete the student
            connection.query("DELETE FROM student_data WHERE Rollno = ?", [roll_no], (err) => {
                if (err) {
                    res.json({ success: false, message: "Error deleting student" });
                } else {
                    res.json({ success: true, message: "Student removed successfully" });
                }
            });
        } else {
            res.json({ success: false, message: "Unauthorized Access" });
        }
    });
});
app.post('/User_pass', (req, res) => {
    const roll_no = req.body.rollno;
    const password = req.body.PassWord;
    console.log(roll_no, password)
    connection.query("SELECT EXISTS (SELECT 1 FROM student_data WHERE Rollno = ? AND password = ?) AS result", [roll_no, password], (err, res1) => {
        if (err) throw err;
        console.log(res1);
        if (res1[0].result == 1) {
            res.json(true);
        } else {
            res.json(false);
        }
    });
});
app.post('/id', (req, res) => {
    connection.query("SELECT *FROM book_data WHERE bookid LIKE 'lp%'ORDER BY bookid desc", (err, result) => {
        if (err) throw err;
        let num = parseInt((result[0].bookid).slice(2)) + 1;

        res.json("LP" + num);

    })
})
app.post('/upload', upload.single('csvfile'), (req, res) => {
    const filePath = req.file.path;
    let records = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            records.push([row.Rollno, row.Name, row.password]);
        })
        .on('end', () => {
            const query = 'INSERT INTO student_data (Rollno, Name, password) VALUES ?';
            connection.query(query, [records], (err, result) => {
                if (err) {
                    console.error('Error inserting data into MySQL:', err);
                    res.status(500).json('Error uploading data');
                    return;
                }
                console.log('Number of records inserted:', result.affectedRows);
                fs.unlinkSync(filePath); // Delete the file after processing
                res.json('File uploaded and data inserted successfully');
            });
        });
});
