import React from "react";
import { getImageUrl } from "../utils.js";

export class Meme extends React.Component {
    constructor(props){
        super(props);
        this.state = {
			topText: "",
        }
    }

    render(){
        const {farm, server, id, secret } = this.props.imageInput;
        return(
            <div className="app">
                {/* Using same template for main page for consistency */}
                <div className="app-header">
                <div>
						<h2 style={{ margin: "1rem 0" }}>MEME GENERATOR 1.0</h2>
                        <h3 style={{ margin: "1rem 0" }}>TYPE IN ANY WORDS YOU LIKE BELOW</h3>
                        <h3 style={{ margin: "1rem 0" }}>REFRESH TO START AGAIN</h3>
                </div>
                </div>
                {/* Overlays text on the image to make a meme */}
                <div className="meme-container">
                    <input
                    placeholder="ADD TOP TEXT"
                    value={this.state.topText}
                    onChange={e => {
                        this.setState({topText: e.target.value})
                    }}
                    />
                    <div className="text-box">
                    <h1>{this.state.topText}</h1>
                    </div>

                    <img
                    src={getImageUrl(farm, server, id, secret)}
                    alt=""
                    />
                </div>
            </div>
        );
    }
}