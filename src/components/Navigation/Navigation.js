import React,{ Component } from 'react';

class Navigation extends Component {
    render() {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                { this.props.isSignedIn ?
                    <p onClick={() => {this.props.onRouteChange('signin')}} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
                 :
                    <div>
                        <p onClick={() => {this.props.onRouteChange('home')}} className='f3 link dim black underline pa3 pointer btn'>Sign In</p>
                        <p onClick={() => {this.props.onRouteChange('register')}} className='f3 link dim black underline pa3 pointer btn'>Register</p>
                    </div>   
                }
                
            </nav>
        );
    }
}

export default Navigation;
