import * as React from 'react';

export default class GameEditorImagePreview extends React.Component {
  state = {
    dimensions: null,
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
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
      <div {...this.props}>
        {dimensions ? `${dimensions.width}x${dimensions.height}` : ''}
        <img
          src={url}
          style={{
            objectFit: 'contain',
            width: '100%',
            height: '100%',
            imageRendering: 'pixelated',
          }}
        />
      </div>
    );
  }
}
