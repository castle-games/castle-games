import * as React from 'react';

export default class GameEditorFontPreview extends React.Component {
  state = {
    text:
      Math.random() > 0.5
        ? 'Ebenezer unexpectedly bagged two tranquil aardvarks with his jiffy vacuum cleaner.'
        : 'Sphinx of black quartz, judge my vow.',
    isLoaded: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this._loadExternalFont();
    }
  }

  async componentDidMount() {
    this._loadExternalFont();
  }

  _loadExternalFont = async () => {
    this.setState({
      isLoaded: false,
    });
    let fontFace = new FontFace('GameTextEditorFontFamily', `url(${this.props.url})`);
    let loadedFontFace = await fontFace.load();
    document.fonts.add(loadedFontFace);
    this.setState({
      isLoaded: true,
    });
  };

  render() {
    let { text, isLoaded } = this.state;

    if (!isLoaded) {
      return null;
    }

    return (
      <div
        {...this.props}
        style={{
          padding: 20,
          fontFamily: 'GameTextEditorFontFamily',
          fontSize: 30,
          ...(this.props.style || {}),
        }}>
        <div>{text}</div>
        <div>{'0 1 2 3 4 5 6 7 8 9'}</div>
      </div>
    );
  }
}
