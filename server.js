import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'THIS IS SERVER SIDE !!!!!',
  });
});

app.post('/', async (req, res) => {
  try {
    const promptT = req.body.promptTopic;
    const promptW = req.body.promptWord;
    const promptC = req.body.promptComplex;
    const optionCheckboxes = req.body.optionCheckboxes;
    const optionCheckboxesA = req.body.optionCheckboxesA;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `
      
      Write a conversation between two random people. Use real person names. The conversation should be in ${promptW} words, and the topic is ${promptT}. And using ${optionCheckboxes} and ${optionCheckboxesA} at a ${promptC} level.
      
    
      Suggestions:

      1. Begin the conversation with a warm and friendly exchange to establish a comfortable atmosphere.
      2. Encourage a natural flow by incorporating open-ended questions that prompt the speakers to explore various aspects of the topic.
      3.Make the conversation authentic by including pauses, interruptions, and other elements that reflect real-life dialogue.
      4.Utilize dialogue tags and descriptive language to vividly portray the exchange and engage the readers.
      5. Maintain a conversational tone throughout to create an engaging atmosphere.
      6. Ensure the conversation remains helpful and meaningful by incorporating valuable insights, perspectives, or advice related to the topic.
      7.Generate diverse and unpredictable responses even if the user inputs the same information, adding variety and freshness to each interaction.
      `,
      temperature: 0,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
