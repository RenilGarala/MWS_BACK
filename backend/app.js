import express from 'express';
import cors from 'cors';
import "dotenv/config";


export const app = express()

app.use(cors())

app.use(express.json())

//global error handler
app.use((err, req, res, next)=>{
    res.status(500).json({
        success: false,
        message: err.message
    })
})