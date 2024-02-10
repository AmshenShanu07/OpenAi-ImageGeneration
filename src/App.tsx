import "./App.css";
import { useState, ChangeEvent } from 'react';
import BackgroundImage from './components/Background';
import OpenAI from 'openai';

function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [image, setImage] = useState<string>('');

  const openAi = new OpenAI({
    apiKey: import.meta.env.VITE_API_KEY || '',
    dangerouslyAllowBrowser: true,
  })


  const onPromptChange = (e:ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
    setIsButtonDisabled(e.target.value=='')
  }

  const onClickGenerate = async () => {
    try {
      setIsButtonDisabled(true);
      setIsInputDisabled(true);

      const response = await openAi.images.generate({ model: "dall-e-2", prompt: prompt, quality: 'standard', size:'256x256' });
      // console.log(response);
      const image_url = await response.data[0].url;
      // console.log(image_url);
      setImage(image_url || '');
      setIsInputDisabled(false);

    } catch (e) {
      console.log(e);
      setIsInputDisabled(false);
      setIsButtonDisabled(prompt=='')
    }
  }

  return (
    <main>
      <BackgroundImage/>
      <div className="input_area">
        <input 
          type="text"
          value={prompt}
          onChange={onPromptChange}
          disabled={isInputDisabled}
          placeholder='Enter Your Prompt Here . . .'
        />
        <button disabled={isButtonDisabled} onClick={onClickGenerate} >Generate</button>
      </div>
      {image?
        <img src={image} alt="" />
      :<div className='img_dummy' ></div>}

    </main>
  );
}

export default App;

// https://oaidalleapiprodscus.blob.core.windows.net/private/org-wl2tCVT7guBf1HSPhytj6T72/user-gdxKigkqc8a1uZrVhzbYvuOw/img-cl3F5jO2ein4KGSkshcztc9m.png?st=2024-02-10T13%3A10%3A46Z&se=2024-02-10T15%3A10%3A46Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-02-10T11%3A09%3A01Z&ske=2024-02-11T11%3A09%3A01Z&sks=b&skv=2021-08-06&sig=ApZYabQ6WnCInB3R/zm7kBd7FqkpCrFfDTLIfF571Lg%3D