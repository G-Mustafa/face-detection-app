import React,{ Component } from 'react';
import './FaceRecognition.css';

class FaceRecognition extends Component {
    render() {
        let { imgSrc,box } = this.props;
        return (
            <div className='center ma'>
                <div className='absolute mt2'>
                    <img id='inputImg' src={imgSrc} alt='face' width='500px' height='auto' />
                    <div className='bounding-box' style={{top:box.topRow, bottom:box.bottomRow, left:box.leftCol, right:box.rightCol}}></div>
                </div>
            </div>
        );
    }
}

export default FaceRecognition;