// need different string here
var mongostr = 'mongodb://heroku:39c02d21a2de06d053238109c338daac@alex.mongohq.com:10007/
app6469233';
var localstr = 'mongodb://localhost/node-mongo-blog';

var connect = require('connect')
  , mongo = require('mongodb')
  , database = null;


// Methods
// --------------------------------------------

/**
 * @method ArticleProvider
 * @description creates new database Connection
 */
ArticleProvider = function() {
  mongo.connect(mongostr, {}, function(error, db) {
    console.log("connected, db: " + db);

    database = db;

    database.addListener("error", function(error) {
      console.log("Error connecting to MongoHQ");
    });
  })
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
