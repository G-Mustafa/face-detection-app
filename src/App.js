import React,{ Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';


const app = new Clarifai.App({
  apiKey: '4f33f5d8b7c547c5afa98625a5f1ef61'
});
 

const particlesOption = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
    
  }
};


class App extends Component {
  constructor(){
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box: {},
      route:'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  loadUser = (user) => {
    this.setState({user: {
      id: user.id,
      name: user.name,
      email: user.email,
      entries: user.entries,
      joined: user.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiface = data.outputs[0].data.regions[0].region_info.bounding_box;
    const img = document.getElementById('inputImg');
    const width = Number(img.width);
    const height = Number(img.height);
    return {
      leftCol: clarifaiface.left_col * width,
      topRow: clarifaiface.top_row * height,
      rightCol: width - (clarifaiface.right_col * width),
      bottomRow: height - (clarifaiface.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({box});
  }

  onSubmit = () => {
    let url = this.state.input;
    this.setState({imageUrl: url});

    app.models.predict(Clarifai.FACE_DETECT_MODEL,url)
    .then(response => {
      if(response){
        fetch('http://localhost:3000/image',{
          method: 'put',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              id: this.state.user.id
          })

      })
      .then( response => response.json())
      .then( data => this.setState((state) => ({
        user: Object.assign({},state.user,{entries: data})
      })))

        this.displayFaceBox(this.calculateFaceLocation(response));
    }})
    .catch( err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signin'){
      this.setState({isSignedIn: false});
    }else if(route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }
  
  render() {
    return (
      <div className="App">
        <Particles params={particlesOption} className='particles' />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {this.state.route === 'home'?
        <div>
          <Logo />
          <Rank userData={this.state.user} />
          <ImageLinkForm onSubmit={this.onSubmit} onInputChange={this.onInputChange} />
          <FaceRecognition box={this.state.box} imgSrc={this.state.imageUrl} />
        </div>:(this.state.route === 'signin'? 
                <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> : 
                <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              )
        }
      </div>

    );
  }
}

export default App;
