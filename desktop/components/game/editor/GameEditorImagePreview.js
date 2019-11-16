import * as React from 'react';

export default class GameEditorImagePreview extends React.Component {
  state = {
    dimensions: null,
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props && prevProps.url !== this.props.url) {
      this._loadDimensions();
    }
  }

  async componentDidMount() {
    this._loadDimensions();
  }

  _loadDimensions = () => {
    this.setState({
      dimensions: null,
    });

    var image = new Image();

    image.onload = () => {
      this.setState({
        dimensions: {
          width: image.width,
          height: image.height,
        },
      });
    };

    image.src = this.props.url;
  };

  render() {
    let { url } = this.props;
    let { dimensions } = this.state;

    return (
      <div
        {...this.props}
        style={{
          display: 'flex',
          flexDirection: 'column',
          ...(this.props.style || {}),
        }}>
        <div style={{ minHeight: 30 }}>
          {dimensions ? `${dimensions.width}x${dimensions.height}` : ' '}
        </div>
        <img
          src={url}
          style={{
            objectFit: 'contain',
            flex: '1',
            imageRendering: 'pixelated',
          }}
        />
      </div>
    );
  }
}
