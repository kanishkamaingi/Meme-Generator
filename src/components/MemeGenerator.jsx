import { useState, useEffect } from 'react';
import axios from 'axios';
import './MemeGenerator.css'

const MemeGenerator = () => {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [allMemes, setAllMemes] = useState([]);
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [memeUrl, setMemeUrl] = useState('');

  useEffect(() => {
    axios.get('https://api.imgflip.com/get_memes')
      .then(response => {
        setAllMemes(response.data.data.memes);
      })
      .catch(error => console.error('Error fetching memes:', error));
  }, []);

  const generateMeme = async (e) => {
    e.preventDefault();
    if (!selectedMeme) return;

    const formData = new FormData();
    formData.append('template_id', selectedMeme.id);
    formData.append('username', 'vanshajgugnani'); // Use your Imgflip username
    formData.append('password', 'Vanshaj@2004'); // Use your Imgflip password
    formData.append('text0', topText);
    formData.append('text1', bottomText);

    try {
      const response = await axios.post('https://api.imgflip.com/caption_image', formData);
      setMemeUrl(response.data.data.url);
    } catch (error) {
      console.error('Error generating meme:', error);
    }
  };

  return (
    <div className="meme-generator">
      <h1>Meme Generator</h1>
      <form onSubmit={generateMeme}>
        <div className="form-group">
          <label>Top Text:</label>
          <input
            type="text"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
            placeholder="Enter top text"
          />
        </div>
        <div className="form-group">
          <label>Bottom Text:</label>
          <input
            type="text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            placeholder="Enter bottom text"
          />
        </div>
        <div className="form-group">
          <label>Select Meme Template:</label>
          <select
            value={selectedMeme?.id || ''}
            onChange={(e) => setSelectedMeme(allMemes.find(meme => meme.id === e.target.value))}
          >
            <option value="">Select a template</option>
            {allMemes.map(meme => (
              <option key={meme.id} value={meme.id}>{meme.name}</option>
            ))}
          </select>
        </div>
        <button type="submit">Generate Meme</button>
      </form>

      {memeUrl && (
        <div className="meme-result">
          <h2>Your Meme:</h2>
          <img src={memeUrl} alt="Generated meme" />
        </div>
      )}
    </div>
  );
};

export default MemeGenerator;