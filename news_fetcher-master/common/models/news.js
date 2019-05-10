'use strict';

var request = require('request');
var newsConfig = require('./../../config/newsConfig.json');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'News'});
var _ = require('lodash');



module.exports = function(News) {


	News.fetchNews = function(keyword,country,category,cb){

		let output = [];
		let apiKey = newsConfig.fetchNews.apiKey;
		let apiUrl = newsConfig.fetchNews.apiUrl;

		var params = {q : keyword};

		if(country){
			params.country = country
		}
		if(category){
			params.category = category
		}
        request.get({
            'url': apiUrl,
            'json':true,
            'qs' : params,
            'headers': {'x-api-key': apiKey}      
          }, function (err, res, body) {

          	if(err || !res){
          		log.error({"msg":"Error occurred while calling News API","err":err})
          		var err = new Error('Something went wrong. Please try again later.')
          		err.statusCode = 500
              return cb(err);
          	}

          	if(body.status == 'ok' && body.articles && body.totalResults == body.articles.length){

          		_.forEach(body.articles,function(feed){
          			let news_feed = {}
          			news_feed.country = country || '';
          			news_feed.category = category || '';
          			news_feed.filterKeyword = keyword;
          			news_feed.newsTitle = feed.title || '';
          			news_feed.description = feed.description ? feed.description.slice(0,100):'';
          			news_feed.sourceUrl = feed.url || ''
          			output.push(news_feed);

          		});
          		return cb(null,output);

          	}

          	else{
          		return cb(null,output);
          	}

          });


      
	

	}

	News.remoteMethod(
	'fetchNews',{
		description:'to fetch all news articles on basis on filter',
		accepts:[{'arg':'keyword','type':'string','description':'string showing filter keyword','required':true},
		{'arg':'country','type':'string','description':'string showing country name'},
		{'arg':'category','type':'string','description':'string showing category'}],
		returns:{'arg':'data','type':'object','root':true},
		http:{'verb':"GET",path:"/fetchNews"}
		
	}
	);

};
