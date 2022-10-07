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
        style={{background: props.highlight ? "#ffffaa" : "#ffffff"}}
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
        key={i}
        value={this.props.squares[i]}
        onClick={() => {this.props.onClick(i);}}
        highlight={this.props.winner.line.indexOf(i) >= 0}
      />
    );
  }
  render() {


    return (
      <div>
        {Array(3).fill(null).map((a, j) => (
          <div className="board-row" key={j}>
            {Array(3).fill(null).map((a, i) => (this.renderSquare(i + j * 3)))}
          </div>
        ))}
      </div>
    );
  }
}

function calculateWinner(board) {
  const squares = board.squares;
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
      return {winner: squares[a], line: [a, b, c]};
    }
  }
  return {winner: null, line: [-1, -1, -1]};
}

class Game extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        target: -1,
        step: 0,
      }],
      historySortReverse: false,
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
    let squares = this.latestBoard().squares;
    if(calculateWinner(this.latestBoard()).winner || squares[i]){
      return;
    }
    squares = squares.map((s, j) => (i == j ? (this.xIsNext() ? 'X' : 'O') : s));
    this.setState({
      history: this.state.history.slice(0, stepNum + 1).concat([{
        squares: squares,
        target: i,
        step: stepNum + 1,
      }]),
      stepNum: stepNum + 1,
    });
  }
  render() {
    const winner = calculateWinner(this.latestBoard());
    let status;
    if(winner.winner){
      status = "Winner: " + winner.winner;
    }else if(this.latestBoard().squares.indexOf(null) === -1){
      status = "Draw";
    }else{
      status = 'Next player: ' + (this.xIsNext() ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board winner={winner} squares={this.latestBoard().squares} onClick={(i) => {this.handleClick(i);}}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <a href="#" onClick={() => {this.setState({historySortReverse: !this.state.historySortReverse})}}>
            履歴を逆順に表示する
          </a>
          <ol>{
            (this.state.historySortReverse ? this.state.history.slice().reverse() : this.state.history).map((b, i) => (
              <li key={i}>
                <button style={{fontWeight: b.step === this.state.stepNum ? "bold" : "normal"}} onClick={() => {this.jumpTo(b.step)}}>
                  {b.step ?
                    `Go to move #${b.step} (${b.target % 3 + 1}, ${Math.floor(b.target / 3) + 1})`
                  :
                    "Go to game start"
                  }
                </button>
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
