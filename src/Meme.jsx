import React from "react";
import html2canvas from "html2canvas";

export default function Meme() {
  const [meme, setMeme] = React.useState({
    topText: "",
    bottomText: "",
    randomImage: "http://i.imgflip.com/1bij.jpg", 
  });

  const [allMemes, setAllMemes] = React.useState([]);

  React.useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => setAllMemes(data.data.memes));
  }, []);

  function getMemeImage() {
    const randomNumber = Math.floor(Math.random() * allMemes.length);
    const url = allMemes[randomNumber].url;
    convertImageToBase64(url, (base64Image) => {
      setMeme((prevMeme) => ({
        ...prevMeme,
        randomImage: base64Image,
      }));
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setMeme((prevMeme) => ({
      ...prevMeme,
      [name]: value,
    }));
  }

  function convertImageToBase64(url, callback) {
    const img = new Image();
    img.crossOrigin = "Anonymous"; 
    img.src = url;
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      callback(dataURL);
    };
  }

  function downloadMeme() {
    const memeElement = document.querySelector(".meme");
    html2canvas(memeElement).then((canvas) => {
      const link = document.createElement("a");
      link.download = "meme.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  }

  return (
    <main>
      <div className="form">
        <input
          type="text"
          placeholder="Top text"
          className="form--input"
          name="topText"
          value={meme.topText}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Bottom text"
          className="form--input"
          name="bottomText"
          value={meme.bottomText}
          onChange={handleChange}
        />
        <button className="form--button" type="button" onClick={getMemeImage}>
          Get an new image 🖼 
        </button>
      </div>
      <div className="meme">
        <h2 className="meme--text top">{meme.topText}</h2>
        <img src={meme.randomImage} className="meme--image" alt="meme" />
        <h2 className="meme--text bottom">{meme.bottomText}</h2>
      </div>
      <button className="download-button" onClick={downloadMeme}>
      ⬇️Download 
      </button>
    </main>
  );
}
