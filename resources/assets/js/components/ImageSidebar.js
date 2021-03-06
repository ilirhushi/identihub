import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactSVG from 'react-svg';
import CopyToClipboard from 'react-copy-to-clipboard';
import NotificationSystem from 'react-notification-system';
import NewSize from '../components/NewSize';
import { deleteImage, addImageConverted, updateImageFile } from '../reducers/Bridge/BridgeApiCalls';
import { paramsChecker, isPublic } from '../helpers';

class ImageSidebar extends Component {

  constructor(props) {
    super(props);

    this.notificationSystem = null;
    this.inputElement = null;

    this.state = {
      margin: 0
    };

    this.openSettings = this.openSettings.bind(this);
    this.openPrimary = this.openPrimary.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.addNewConverted = this.addNewConverted.bind(this);
    this.emulateInputOnChange = this.emulateInputOnChange.bind(this);
    this.updateImage = this.updateImage.bind(this);
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
  }

  addNotification(){
    this.notificationSystem.addNotification({
      message: 'Link copied to clipboard ',
      level: 'success'
    });
  }

  openSettings() {
    this.setState((prevState, _) => {
      return {margin: 300}
    })
  }

  openPrimary() {
    this.setState((prevState, _) => {
      return {margin: 0}
    })
  }

  deleteImage() {
    const { deleteImage, bridge, image, history } = this.props;
    if(deleteImage){
      history.replace('/bridge/' + bridge.id);
      deleteImage(bridge.id, image.id);
    }
  }

  emulateInputOnChange(event) {
    this.inputElement.click();
  }

  updateImage(e) {
    const { updateImageFile, bridge, image } = this.props;
    const file = e.target.files[0];
    updateImageFile(bridge.id, image.id, file);
  }

  addNewConverted(width, height) {
    const { addImageConverted, bridge, image } = this.props;
    addImageConverted(bridge.id, image.id, parseInt(width), parseInt(height));
  }

  render() {

    const openSettings = this.openSettings;
    const openPrimary = this.openPrimary;
    const addNotification = this.addNotification;
    const deleteImage = this.deleteImage;
    const addNewConverted = this.addNewConverted;
    const emulateInputOnChange = this.emulateInputOnChange;

    const isPub = isPublic();

    const { margin} = this.state;
    const marginStyle = "-" + margin + "px";

    const { image } = this.props;

    const lastConverted = image.converted[image.converted.length - 1];

    if(!image)
      return <div> </div>;

    let settingsButton = null;
    let newSize = null;
    if(!isPub){
      settingsButton = (<div onClick={openSettings}>
        <ReactSVG
          path="/images/settings.svg"
        />
      </div>);
      newSize = (<NewSize defaultWidth={lastConverted.width} ratio={image.width_ratio} saveElement={addNewConverted}/>);
    }

    return (
      <div className="image-sidebar">
        <div className="primary-view" style={{marginLeft: marginStyle}}>
          <div className="head">
            {settingsButton}
            <h3>Images</h3>
          </div>
          <div className="content">
            <section>
              <h4>Source File</h4><a className="button" href={window.location.origin + '/assets/' + image.filename} download={image.filename}>Download</a>
              <div className="clipboard_and_text">
                <div>
                  <CopyToClipboard text={window.location.origin + '/assets/' + image.filename} className="clipboard" onCopy={() => {addNotification()}}>
                    <span><ReactSVG
                      path="/images/clipboard.svg"
                    /></span>
                  </CopyToClipboard>
                </div>
                <p>{window.location.origin + '/assets/' + image.filename}</p>
              </div>
            </section>
            <section>
              <h4>Converted Files</h4>
              {
                image.converted.map(function(convertedItem) {
                  return (
                    <div key={convertedItem.id}>
                      <div className="clipboard_and_text">
                        <div>
                          <CopyToClipboard text={window.location.origin + '/assets/' + convertedItem.filename} className="clipboard" onCopy={() => {addNotification()}}>
                            <span>
                              <ReactSVG
                                path="/images/clipboard.svg"
                              />
                            </span>
                          </CopyToClipboard>
                        </div>
                        <p>{window.location.origin + '/assets/' + convertedItem.filename}</p>
                      </div>
                      <div className="text">
                        <p><span className="prefix">Width</span> <span className="primar">{convertedItem.width}</span></p>
                        <p><span className="prefix">Height</span> <span className="primar">{convertedItem.height}</span></p>
                        <a className="button" href={window.location.origin + '/assets/' + convertedItem.filename} download={convertedItem.filename}>Download</a>
                      </div>
                    </div>
                  );
                })
              }
            </section>
            {newSize}
          </div>
        </div>
        <div className="settings">
          <div className="head">
            <div onClick={openPrimary}>
              <ReactSVG
                path="/images/close.svg"
              />
            </div>
            <h3>Logo Settings</h3>
          </div>
          <div className="content">
            <section>
              <input id="update-icon"
                     ref={input => this.inputElement = input}
                     onChange={this.updateImage}
                     type="file"
                     accept="image/*"
                     name="image"/>
              <div className="text">
                <a className="button" onClick={emulateInputOnChange}>Update Logo File</a>
              </div>
            </section>
            <section>
              <div className="text">
                <a className="button" onClick={deleteImage}>Delete</a>
              </div>
            </section>
          </div>
        </div>
        <NotificationSystem ref="notificationSystem" />
      </div>
    );

  }

}

ImageSidebar.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.number
  })
};

const dispatchToProps = (dispatch) => {
  return bindActionCreators({
    deleteImage,
    addImageConverted,
    updateImageFile
  }, dispatch)
};

export default connect(state => state, dispatchToProps)(ImageSidebar);