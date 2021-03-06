const connection = require("../db/connection");

const selectArticles = ({ sort_by, order, author, topic, title }) => {
  return connection
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.body",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .count("comments.article_id as comment_count")
    .from("articles")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .returning("*")
    .modify(query => {
      if (author) query.where("articles.author", "=", author);
      if (topic) query.where("articles.topic", "=", topic);
      if (title) query.where("articles.title", "=", title);
    });
};

const selectArticlesById = article_id => {
  return connection
    .select("articles.*")
    .count("comments.article_id as comment_count")
    .from("articles")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .where("articles.article_id", "=", article_id)
    .groupBy("articles.article_id")
    .returning("*");
};

const updateArticle = (article_id, inc_votes) => {
  console.log(article_id);
  return connection("articles")
    .where("article_id", "=", article_id)
    .increment("votes", inc_votes)
    .returning("*");
};

const selectCommentsByArticleID = (article_id, { sort_by, order }) => {
  return connection("comments")
    .where("comments.article_id", "=", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .returning("*");
};

const insertComments = comment => {
  return connection("comments")
    .insert(comment)
    .returning("*");
};

const insertArticle = (title, body, topic, author) => {
  return connection("articles")
    .insert({ title, body, topic, author })
    .returning("*");
};

module.exports = {
  selectArticles,
  selectArticlesById,
  updateArticle,
  selectCommentsByArticleID,
  insertComments,
  insertArticle
};
