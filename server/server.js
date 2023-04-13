import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
import mongoose from 'mongoose';


dotenv.config();


// Connection URL
const url = process.env.MONGODB_URL;
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;
// const client = new MongoClient(url);
// const db = client.db(process.env.MONGODB_NAME);
// const collection = db.collection('QuestionsAnswers');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use('/', express.static('public'));

// DB Schema
const QA = new Schema({
  question: String,
  answer: String
});

// creating the model/collection
const MyModel = mongoose.model('QuestionsAnswers', QA);


app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
});



app.post('/', async (req, res) => {
  try {

    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: `${prompt}`,
      temperature: 1, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    })

    // saves new questions ad answers to DB 
    const myModel = new MyModel({
      question: req.body.prompt,
      answer: response.data.choices[0].text
    })


    myModel.save().then(() => console.log('saved'));;

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})



app.get('/dashboard', async (req, res) => {

  // const allQas = await MyModel.find(); 
  // executes, name LIKE john and only selecting the "name" and "friends" fields

  const allQas = await MyModel.find({ answer: /business/i }, 'answer').exec();

  res.status(200).send({
    qas: allQas
  })

})

app.get('/search', async (req, res) => {

  const search = req.query.search;

    // const allQas = await MyModel.find();  

    const searchResults = await MyModel.find({ 
      $or:[
       { answer: {$regex: `${search}`} },
       { question: {$regex: `${search}`} }

      ]
      
    
    }).exec();

  res.render('pages/results', { search: searchResults });

})

app.get('/index', async (req, res) => {

  // const allQas = await MyModel.find();  

  const allQas = await MyModel.find().exec();

  var tagline = "No programming concept is complete without a cute animal mascot.";

  res.render('pages/index', { allQas: allQas });

})

app.listen(5000, () => {

  console.log('DB and Server has started on http://localhost:5000')
  mongoose.connect(url)
    .then(() => console.log('Connected!'));

})