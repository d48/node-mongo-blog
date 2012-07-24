var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON= require('mongodb').pure().BSON;
var ObjectID = require('mongodb').ObjectID;

// Methods
// --------------------------------------------

/**
 * @method ArticleProvider
 * @description creates new database Connection
 */
ArticleProvider = function(host, port) {
  this.db = new Db('node-mongo-blog', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

/**
 * @method getCollection
 * @description returns collection of articles
 */
ArticleProvider.prototype.getCollection = function(callback) {
  this.db.collection('articles', function(error, article_collection) {
    if (error) callback(error);
    else callback(null, article_collection);
  });
};

/**
 * @method findAll
 * @description finds all articles, basically entire collection
 */
ArticleProvider.prototype.findAll = function(callback) {
  this.getCollection(function(error, article_collection) {
    if (error) callback(error);
    else {
      article_collection.find().toArray(function(error, results) {
        if (error) callback(error)
        else callback(null, results)
      });
    }
  });
};

/** 
 * Find article/blog entry by ID
 * need to pass in createFromHexString on id for mongodb ObjectID spec
 * of being a 12-byte value
 */
ArticleProvider.prototype.findById = function(id, callback) {
  this.getCollection(function(error, article_collection) {
    if (error) callback(error);
    else {
      article_collection.findOne(
        {_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)},
        function(error, result) {
          if (error) callback(error)
          else callback(null, result)
        }
      );
    } 
  });
};

/**
 * Adds comment to article 
 */
ArticleProvider.prototype.addCommentToArticle = function(articleId, comment, callback) {
  this.getCollection(function(error, article_collection) {
    if(error) callback(error);
    else {
      article_collection.update(
          {_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(articleId)}
        , {"$push": {comments: comment}}
        , function(error, article) {
            if(error) callback(error);
            else callback(null, article)
          }
      )
    }
  })
};

ArticleProvider.prototype.save = function(articles, callback) {
  this.getCollection(function(error, article_collection) {
    if (error) callback(error);
    else {
      if( typeof(articles.length)=="undefined" )
        articles = [articles];

      for( var i=0; i<articles.length; i++ ) {
        article = articles[i];
        article.created_at = new Date();

        if( article.comments === undefined ) article.comments = [];
        for( var j=0; j<article.comments.length; j++ ) {
          article.comments[j].created_at = new Date();
        }
      }
      
      article_collection.insert(articles, function() {
        callback(null, articles);
      });
    }
  });
};

exports.ArticleProvider = ArticleProvider;
