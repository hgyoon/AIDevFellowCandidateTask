import React from "react";
import "./App.css";
import constants from "./constants.js";
import ImageList from "./components/ImageList.js";
import { Meme } from "./components/meme.js";
import { isScrollable, throttler, parseJSON, debouncer } from "./utils.js";


export default class App extends React.Component {
  constructor(props){
    super(props);
    const queriesFromStorage = JSON.parse(localStorage.getItem(constants.STORAGE_KEY));
    this.state = {
			searchText: "",
			imageList: [],
			pageNumber: 1,
			showPopUp: false,
			popUpImage: null,
			queries: queriesFromStorage ? queriesFromStorage : [],
			template: null,
			meme: null,
		};
		// Function bindings
		this.onSearchInputChange = this.onSearchInputChange.bind(this);
		this.handleImageClick = this.handleImageClick.bind(this);
  }

  componentDidMount(){
    window.onscroll = throttler(() => {
			if (isScrollable()) return;
			this.handleScroll();
		}, 1000);

    this.makeSearch = debouncer(() => {
			/* Save search query */
			this.state.queries.push(this.state.searchText);
			this.setState({ queries: this.state.queries }, this.updateLocalStorage());

			/* Make API call for the query */
			const url = constants.BASE_URL + "&text=" + this.state.searchText;
			fetch(url)
        .then(parseJSON)
				.then(resp => {
					this.setState({ imageList: resp.photos.photo });
        })
        .then(() => {console.log(this.state.imageList);})
				.catch(err => {
					console.log(err);
				});
		}, 1000);
  }

  handleScroll() {
		let url = constants.BASE_URL + "&text=" + this.state.searchText + "&page=" + (this.state.pageNumber + 1);
		fetch(url)
			.then(parseJSON)
			.then(resp => {
				resp.photos.photo.forEach(photo => this.state.imageList.push(photo));
				this.setState({
					pageNumber: resp.photos.page,
					imageList: this.state.imageList
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

  updateLocalStorage() {
		localStorage.setItem(constants.STORAGE_KEY, JSON.stringify(this.state.queries));
	}

	onSearchInputChange(event) {
		const searchText = event.currentTarget.value;
		this.setState({ searchText });
		const trimmedText = searchText.replace(/\s+$/, "");
		if (trimmedText.length) this.makeSearch(trimmedText);
  }
  
  handleImageClick(idx) {
		this.setState({ template: this.state.imageList[idx]});
	}


  render() {
		return (
			<div className="app">
				<div className="app-header">
					{!this.state.template && (
						<div>
						<h2 style={{ margin: "1rem 0" }}>MEME GENERATOR 1.0</h2>
            <p style={{ margin: "1rem 0" }}>Try to search for images in the search bar</p>
						<div className="h-flex jc ac search-bar">
							<input
								type="text"
								className="search-input"
								value={this.state.searchText}
								onChange={this.onSearchInputChange}
							/>
						</div>
						{this.state.queries.length > 0 &&
							<div style={{ marginTop: "16px" }}>
								<h5 style={{ marginBottom: "5px" }}>Your Recent Searches</h5>
								<ul className="h-flex jc">
									{this.state.queries.map((query, idx) =>
										<li key={idx} className="query">
											{query}
										</li>
									)}
								</ul>
							</div>}
						</div>
					)}
					
				</div>
				<div className="app-content" ref="appContent">
					{this.state.template && (<Meme imageInput={this.state.template}/>)}
					{!this.state.template && <ImageList images={this.state.imageList} onImageClick={this.handleImageClick} />}
				</div>
			</div>
		);
	}
}