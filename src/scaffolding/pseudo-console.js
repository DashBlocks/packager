class PseudoConsole {
  constructor (parent) {
    this.parent = parent;
    this.parent.vm.runtime.console = this;
  }

  clear () {
    if (this.parent.stageMode === 'console') {
      this.parent._consoleLines = new Array();
    }
  }

  addLine (line) {
    if (this.parent.stageMode === 'console') {
      const splitted = String(line).split('\n').reduce((acc, value) => [...acc, ...value.match(new RegExp(`.{1,${this.parent._consoleLinesCount}}`, 'g'))], []);
      this.parent._consoleLines = [...this.parent._consoleLines, ...splitted].toSpliced(
        0,
        Math.max(0, this.parent._consoleLines.length + splitted.length - this.parent._consoleLinesCount)
      );
    }
  }
}

export default PseudoConsole;