import express from 'express';

const app = express();


app.get('/',(req,res)=>{
    res.send('Hello world!!');
});




app.listen(process.env.PORT || 5050,()=>{
    console.log(`Running at 5050 or env port`);
});