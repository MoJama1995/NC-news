exports.up = function(knex, Promise) {
  const now = Date.now;
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable.text("body").notNullable();
    articlesTable.integer("votes").defaultTo(0);
    articlesTable.string("topic").references("topics.slug");
    articlesTable.string("author").references("users.username");
    articlesTable.string("created_at").defaultTo(now);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("articles");
};
