const axios = require('axios');

export default class searchEngine {
	constructor() {
	  this.searchQuery = '';
	  this.page = 1;
	  this.perPage = 40;
	  this.gallery;
	}
  
	async fetchResult() {
	  const url = `https://pixabay.com/api/?key=28087290-924e0ea1f00da6c33f866d98b&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&q=${this.searchQuery}&page=${this.page}`;
  
	  return await axios
		.get(url);
	}
  
	get query() {
	  return this.searchQuery;
	}
  
	set query(newQuery) {
	  this.searchQuery = newQuery;
	}
  
	incrementPage() {
	  this.page += 1;
	}
  
	resetPage() {
	  this.page = 1;
	}

	page() { 
		return this.page;
	}
  }