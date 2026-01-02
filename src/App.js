import { useState } from 'react';

export default function Game() {
  const size = 15;
  const [history, setHistory] = useState([Array(size * size).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const blackIsNext = (currentMove % 2) === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  
  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      if (move === 0) {
        return (
          <li key={move}>
            You are at game start
          </li>
          );
      } else {
      return (
        <li key={move}>
          You are at move #{move}
        </li>
        );
      }
    } else if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  return (
    <div className="game">
      <div className={`game-board ${blackIsNext ? "turn-black" : "turn-white"}`} >
        <Board squares={currentSquares} blackIsNext={blackIsNext} onPlay={handlePlay} size={size}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board({squares, blackIsNext, onPlay, size}) {
  const [winnerStone, winningLine] = calculateWinner(squares);
  const winner =
    winnerStone === "x" ? "Black" : winnerStone === "o" ? "White" : null;
  let status = winner
    ? "Winner: " + winner
    : `Next player: ${blackIsNext ? "Black" : "White"}`;
  function handleClick(i) {
    if (squares[i] || winner) {
      return
    }
    const nextSquares = squares.slice();
    nextSquares[i] = blackIsNext ? 'x' : 'o';
    onPlay(nextSquares);
  }

  const squareElements = squares.map((value, index) => (
    <Square key={index} value={value} isWinning={winningLine?.includes(index)} onSquareClick={() => handleClick(index)} />
  ));

  function rowElements() {
    const rows = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(squareElements[i * size + j]);
      }
      rows.push(<div key={i} className="board-row">{row}</div>);
    }
    return rows;
  }
  return (
  <div className="board">
  <div className="status">{status}</div>
  {rowElements()}
  </div>
  );

  function calculateWinner(squares) {
    const winLen = 5;
  
    // helper to check a specific 5-cell line starting at (r,c) moving by (dr,dc)
    function checkLine(r, c, dr, dc) {
      const first = squares[r * size + c];
      if (!first) return null;
  
      const line = [r * size + c];
  
      for (let k = 1; k < winLen; k++) {
        const rr = r + dr * k;
        const cc = c + dc * k;
        const idx = rr * size + cc;
  
        if (squares[idx] !== first) return null;
        line.push(idx);
      }
      return [first, line];
    }
  
    // Horizontal: start cols 0..size-5
    for (let r = 0; r < size; r++) {
      for (let c = 0; c <= size - winLen; c++) {
        const res = checkLine(r, c, 0, 1);
        if (res) return res;
      }
    }
  
    // Vertical: start rows 0..size-5
    for (let r = 0; r <= size - winLen; r++) {
      for (let c = 0; c < size; c++) {
        const res = checkLine(r, c, 1, 0);
        if (res) return res;
      }
    }
  
    // Diagonal down-right (\): start rows 0..size-5, cols 0..size-5
    for (let r = 0; r <= size - winLen; r++) {
      for (let c = 0; c <= size - winLen; c++) {
        const res = checkLine(r, c, 1, 1);
        if (res) return res;
      }
    }
  
    // Diagonal up-right (/): start rows 4..size-1, cols 0..size-5
    for (let r = winLen - 1; r < size; r++) {
      for (let c = 0; c <= size - winLen; c++) {
        const res = checkLine(r, c, -1, 1);
        if (res) return res;
      }
    }
  
    return [null, null];
  }  
}

function Square({ value, onSquareClick, isWinning}) {
  const stoneClass =
    value === "x" ? "blackSquare" : value === "o" ? "whiteSquare" : "";

  return (
    <button className={`square ${stoneClass} ${isWinning ? "win" : ""}`} onClick={onSquareClick} />
  );
}
