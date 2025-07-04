import axios from 'axios';

async function generateEmbedding(text) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        input: text,
        model: 'text-embedding-3-small' 
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
  
    return response.data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

export default generateEmbedding;
