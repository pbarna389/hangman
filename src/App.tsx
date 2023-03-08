import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import './App.css'

type stringArr = string[];

function App() {
  const [gameOn, setGameOn] = useState<boolean>(true);
  const [restart, setRestart] = useState<boolean>(false);
  const [winning, setWinning] = useState<boolean>(false);
  const [losing, setLosing] = useState<boolean>(false);
  const [words, setWords] = useState<stringArr>(["Willow", "Ohama", "Bella", "Guitar", "Axe", "Honorificabilitudinitatibus", "Fellowship", "Love", "Dog", "Cat"]);
  const [word, setWord] = useState<string[]>([]);
  const [wordLetters, setWordLetters] = useState<string[]>();
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [foundLetters, setFoundLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [winningCond, setWinningCond] = useState<number>(0);
  const [lives, setLives] = useState<number>(7);

  useEffect(() => {
    if (gameOn === true) {
      setWord(words[Math.floor(Math.random() * words.length)].split(""));
      setUsedLetters([]);
      setFoundLetters([]);
      setWrongLetters([]);
      setWinningCond(0);
      setWinning(false);
      setLosing(false);
      setRestart(false);
      setLives(7);
    }
  }, [restart === true]);

  useEffect(() => {
    setWordLetters([...new Set(word.map(letter => letter.toLowerCase()))])
  }, [word])

  useEffect(() => {
    if (wordLetters) {
      if (winningCond === wordLetters.length) {
        setGameOn(false);
        setWinning(true);
      }
    }
  }, [winningCond])

  useEffect(() => {
    if (lives === 0) setLosing(true);
  }, [lives]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = document.querySelector(`input[name="letter"]`) as HTMLInputElement;
    const value = target.value;

    if (word.join("").toLowerCase().split("").includes(value) && !usedLetters.includes(value)) {
      setUsedLetters([...usedLetters, value.toLowerCase()]);
      setFoundLetters([...foundLetters, value.toLowerCase()]);
      setWinningCond(prev => ++prev);
    } else if (usedLetters.includes(value.toLowerCase())) {
      return;
    } else {
      setUsedLetters([...usedLetters, value.toLowerCase()]);
      setWrongLetters([...wrongLetters, value.toLowerCase()]);
      setLives(prev => --prev);
    }
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value.length <= 1 ? setInput(e.target.value) : setInput(input);
  };

  const handleOnClick = () => {
    setGameOn(true);
    setRestart(true);
  }

  return (
    <div className="App">
      <div>
        {
          word.map(letter => usedLetters.includes(letter.toLowerCase()) ? <span>{letter} </span> : <span>_ </span>)
        }
      </div>
      <div>Lives: {lives}</div>
      <div>
        Used letters: {
          usedLetters.map(letter => <span>{letter} </span>)
        }
      </div>
      <div>
        Correct letters : {
          foundLetters.map(letter => <span>{letter} </span>)
        }
      </div>
      <div>
        Wrong letters : {
          wrongLetters.map(letter => <span>{letter} </span>)
        }
      </div>
      <form onSubmit={e => handleSubmit(e)} data-form="form">
        <input name="letter" onChange={e => handleInput(e)} value={input} disabled={winning} data-input="form"></input>
        <button type="submit" disabled={winning}>Does it contain?</button>
      </form>
      {
        !winning && !losing &&
        <button onClick={handleOnClick}>Restart?</button>
      }
      {
        winning &&
        <>
          <div>YOU WON!</div>
          <button onClick={handleOnClick}>Retry?</button>
        </>
      }
      {
        losing &&
        <>
          <div>YOU LOST!</div>
          <div>Your word was: {word}</div>
          <button onClick={handleOnClick}>Retry?</button>
        </>
      }
    </div>
  )
}

export default App
