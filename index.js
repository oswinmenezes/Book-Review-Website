//backend
import dotenv from "dotenv"
import express from "express"
import bodyParser from "body-parser"
import axios from "axios";
import pg from "pg"

const app=express();
dotenv.config();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

function normalize(str) {//function to remove punctuations like ,
  return str
    .replace(/[^\w\s]/g, "")  // remove punctuation
    .trim();
}

function authorMatches(userInput, apiName) {
  const userWords = normalize(userInput).split(/\s+/);
  const apiWords = normalize(apiName).split(/\s+/);

  // check if every user word exists somewhere in api words
  for(let i=0;i<userWords.length;i++){
    if(!apiWords.includes(userWords[i])){
        return false;
    }
  }
  return true;
}

const db = new pg.Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

const PORT = process.env.PORT || 3000;

db.connect();

app.get("/",async(req,res)=>{
    const result=await db.query("SELECT * FROM books;")
    console.log(result.rows)
    res.render("index.ejs",{length:result.rows.length ,data:result.rows});
});
app.get("/about",(req,res)=>{
    res.render("aboutPage.ejs")
});
app.get("/allBooks",async(req,res)=>{
    const result=await db.query("SELECT * FROM books;");
    console.log(result.rows);
    console.log(result.rows.length);
    res.render("gridPage.ejs",{data:result.rows,length:result.rows.length});
});
app.get("/newBook",(req,res)=>{
    res.render("newBook.ejs",{heading:"New Book",btnCaption:"Add Changes",formAction:"book",data:"null"});
});
app.get("/delete/:id",async(req,res)=>{
    const id=req.params.id;
    try{
        await db.query("DELETE FROM books WHERE id=$1",[id]);
        console.log("deleted summary successfully");
        res.redirect("/allBooks")
    }
    catch(err){
        console.log(err);
        console.log("deletion failed...")
    }
});
app.post("/book/edit/:id",async(req,res)=>{
    const id=req.params.id;
    const title=req.body.bookName;
    const summary=req.body.summary;
    const rating=req.body.ratingInput;
    const genre=req.body.genre;
    const author_name=req.body.authorName;
    
    try{
        await db.query("UPDATE books SET book_title=$1,summary=$2,rating=$3,genre=$4,author_name=$5 WHERE id=$6",[title,summary,rating,genre,author_name,id]);
        console.log("riview editted successfully...");
        res.redirect("/allBooks");
    }
    catch(err){
        console.log(err);
        console.log("unable to edit riview...")
    }
})
app.get("/edit/:id",async(req,res)=>{
    const id=req.params.id;
    try{
        const result=await db.query("SELECT * FROM books WHERE id=$1",[id]);
        res.render("newBook.ejs",{heading:"Edit Summary" ,data:result.rows,btnCaption:"Add Changes",formAction:`book/edit/${id}`})
    }
    catch(err){
        console.log(err);
        console.log("could not fetch book..")
    }
});
app.post("/book",async(req,res)=>{
    const title=normalize(req.body.bookName.toLowerCase());
    const formatted_title=encodeURIComponent(title);
    console.log(formatted_title);
    const author_name=normalize(req.body.authorName.toLowerCase());
    const rating=req.body.ratingInput;
    const summary=req.body.summary;
    const genre=req.body.genre;
    let id=null;
    try{
        const bookDet=await axios.get(`https://openlibrary.org/search.json?q=${formatted_title}&fields=title,author_name,cover_i`);
        console.log(bookDet.data.docs);
        for(let i=0;i<bookDet.data.docs.length;i++){
            let data=normalize(bookDet.data.docs[i].title);
            let author = bookDet.data.docs[i].author_name?.[0] ? normalize(bookDet.data.docs[i].author_name[0].toLowerCase()) : "";

            if(data.toLowerCase()===title ){
                if(authorMatches(author_name, author)){
                    console.log(bookDet.data.docs[i]);
                    if(bookDet.data.docs[i].cover_i){
                        id=bookDet.data.docs[i].cover_i;
                    }
                }
                break;
            }    
            
        }
        await db.query("INSERT INTO books (book_title,summary,rating,cover_id,genre,author_name) VALUES($1,$2,$3,$4,$5,$6);",[title,summary,rating,id,genre,author_name]);
        res.redirect("/");
    }
    catch(err){
        console.log(err);
    }
});
app.post("/genre",async(req,res)=>{
    const genre=req.body.genre;
    try{
        const result=await db.query("SELECT * FROM books WHERE genre=$1",[genre]);
        res.render("gridPage.ejs",{data:result.rows,length:result.rows.length});
    }
    catch(err){
        console.log(err);
    }
})

app.get("/book/:id",async(req,res)=>{
    const id=req.params.id;
    const result=await db.query("SELECT * FROM books WHERE id=$1",[id]);
    console.log(result.rows);
    res.render("bookSummaryPage.ejs",{data:result.rows});
})
app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
});