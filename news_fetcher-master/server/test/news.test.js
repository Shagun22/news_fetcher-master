var request = require('supertest');
var chai = require('chai')
var assert = require('chai').assert;
var app = require('../server');
var books = app.models.Books;
var expect = chai.expect;



function apiCall(verb,url,params,headers){
	 if (params) {
    var queryString = Object.keys(params).reduce(function (a, k) {
      a.push(k + '=' + params[k]);
      return a;
    }, []).join('&');

    url = url + '?' + queryString;
    console.log('url',url)
  }

  var result = request(app)[verb](url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/);

  if (headers) {
    Object.keys(headers).forEach(function (a, k) {
      result.set(a, headers[a]);
    });
  };
  return result;

}
describe('GET fetchNews',function(){

	/*before(function(done){
		done();
	})
	after(function(done){
		done();
	})*/

	it('should give error when keyword is not sent in request',function(done){

		apiCall('get','/api/News/fetchNews')
		.expect(400,function(err,res){
			if(err) return done(err);
			assert(res.body)
			return done();
		})

	});

	it('should give successful response even when no data is present for the specified keyword',function(done){

		apiCall('get','/api/News/fetchNews',{'keyword':'xyzblablabla'})
		.expect(200,function(err,res){
			if(err){
				return done(err)
			}
			assert(res.body)
			expect(res.body).to.be.an('array').that.is.empty;
			return done();
		})

	});

	it('should provide all news articles as per keyword',function(done){

		apiCall('get','/api/News/fetchNews',{'keyword':'fiction'})
		.expect(200,function(err,res){
			if(err){
				return done(err);
			}
			assert(res.body)
			assert.equal(res.body[0].country,'')
			assert.equal(res.body[0].category,'')
			assert.equal(res.body[0].filterKeyword,'fiction')
			assert(res.body[0].newsTitle)
			assert(res.body[0].description)
			assert(res.body[0].sourceUrl)
			return done();
		})

	});

});