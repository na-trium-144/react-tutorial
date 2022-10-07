import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// class Square extends React.Component {
//   render() {
function Square(props){
    return (
      <button
        className="square"
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  // }
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => {this.props.onClick(i);}}
      />
    );
  }
  render() {


    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class Game extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      history: [Array(9).fill(null)],
      stepNum: 0,
    }
  }
  latestBoard(){
    return this.state.history[this.state.stepNum];
  }
  jumpTo(i){
    this.setState({stepNum: i});
  }
  xIsNext(){
    return this.state.stepNum % 2 === 0;
  }
  handleClick(i){
    let stepNum = this.state.stepNum;
    let squares = this.latestBoard();
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares = squares.map((s, j) => (i == j ? (this.xIsNext() ? 'X' : 'O') : s));
    this.setState({
      history: this.state.history.slice(0, stepNum + 1).concat([squares]),
      stepNum: stepNum + 1,
    });
  }
  render() {
    const winner = calculateWinner(this.latestBoard());
    let status;
    if(winner){
      status = "Winner: " + winner;
    }else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={this.latestBoard()} onClick={(i) => {this.handleClick(i);}}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{
            this.state.history.map((sq, i) => (
              <li key={i}>
                <button onClick={() => {this.jumpTo(i)}}>{i ? `Go to move #${i}` : "Go to game start"}</button>
              </li>
            ))
          }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
