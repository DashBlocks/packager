class PseudoConsole {
  constructor (parent) {
    this.parent = parent;
    const self = this;
    this.parent.vm.runtime.console = {
      get props () {
        return {
          get lines () {
            return self.parent._consoleLines;
          },
          get cursor () {
            return self.parent._consoleCursor;
          },
          set setConsoleCursor (cursor) {
            self.parent._consoleCursor = cursor;
          }
        };
      },
      state: {
        get linesCount () {
          return self.parent._consoleLinesCount;
        },
        get symbols () {
          return self.parent._consoleSymbols;
        }
      },
      clear: this.clear.bind(this),
      addLine: this.addLine.bind(this),
      editLine: this.editLine.bind(this),
      editSymbol: this.editSymbol.bind(this)
    };
  }

  get realCursor () {
    return {
      row: Math.max(0, Math.min(this.parent._consoleLinesCount - 1, Math.round(+this.parent._consoleCursor.row))),
      symbol: Math.max(0, Math.min(this.parent._consoleSymbols - 1, Math.round(+this.parent._consoleCursor.symbol)))
    };
  }

  clear () {
    this.parent._consoleLines = new Array();
    this.parent._consoleCursor = {
      row: 0,
      symbol: 0
    };
    this.parent._updateConsole();
  }

  addLine (line, cursor2NextLine) {
    if (!String(line)) return;
    const splitted = String(line)
      .split('\n')
      .reduce((acc, value) => [...acc, ...value.match(new RegExp(`.{1,${this.parent._consoleSymbols}}`, 'g'))], []);
    const newLines = this.parent._consoleLines.toSpliced(this.realCursor.row, 0, ...splitted);
    this.parent._consoleLines = newLines.toSpliced(
      0,
      Math.max(0, newLines.length - (this.parent._consoleLinesCount - 1))
    );
    if (cursor2NextLine) {
      this.parent._consoleCursor = {
        row: this.realCursor.row + splitted.length - Math.max(0, newLines.length - (this.parent._consoleLinesCount - 1)),
        symbol: 0
      };
    } else {
      this.parent._consoleCursor = {
        row: this.realCursor.row - Math.max(0, newLines.length - (this.parent._consoleLinesCount - 1)),
        symbol: this.realCursor.symbol
      };
    }
    this.parent._updateConsole();
  }

  editLine (line) {
    if (!String(line)) return;
    const splitted = String(line)
      .split('\n')
      .reduce((acc, value) => [...acc, ...value.match(new RegExp(`.{1,${this.parent._consoleSymbols}}`, 'g'))], []);
    const newLines = this.parent._consoleLines.toSpliced(this.realCursor.row, 1, ...splitted);
    this.parent._consoleLines = newLines.toSpliced(
      0,
      Math.max(0, newLines.length - (this.parent._consoleLinesCount - 1))
    );
    this.parent._consoleCursor = {
      row: this.realCursor.row - Math.max(0, newLines.length - (this.parent._consoleLinesCount - 1)),
      symbol: this.realCursor.symbol
    };
  }

  editSymbol (value) {
    if (!String(value)?.[0]) return;
    const symbol = String(value)[0];
    const line = (this.parent._consoleLines[this.realCursor.row] || '').padEnd(this.realCursor.symbol + 1, ' ');
    this.parent._consoleLines = this.parent._consoleLines.toSpliced(
      this.realCursor.row,
      1,
      line.substring(0, this.realCursor.symbol) + symbol + line.substring(this.realCursor.symbol + 1, line.length)
    );
  }
}

export default PseudoConsole;