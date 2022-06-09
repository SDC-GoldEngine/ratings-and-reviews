DROP DATABASE IF EXISTS reviews;
CREATE DATABASE reviews;

\c reviews;

DROP TABLE IF EXISTS review CASCADE;
CREATE TABLE review (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  review_date BIGINT NOT NULL,
  rating INT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  response TEXT NOT NULL,
  recommend BOOLEAN NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  helpfulness INT DEFAULT 0,
  reported BOOLEAN NOT NULL
);

ALTER TABLE review ALTER COLUMN review_date TYPE TIMESTAMP USING to_timestamp((review_date::decimal)/1000);

DROP TABLE IF EXISTS characteristics CASCADE;
CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  name TEXT NOT NULL
);

DROP TABLE IF EXISTS characteristic_reviews CASCADE;
CREATE TABLE characteristic_reviews (
  id SERIAL PRIMARY KEY,
  characteristic_id INT references characteristics(id),
  review_id INT references review(id),
  char_value INT NOT NULL
);

DROP TABLE IF EXISTS review_photos CASCADE;
CREATE TABLE review_photos (
  id SERIAL PRIMARY KEY,
  review_id INT references review(id),
  review_url TEXT NOT NULL
);

COPY review (id, product_id, rating, review_date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/Users/jessicazhou/Desktop/HR/SDC/data/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics (id, product_id, name)
FROM '/Users/jessicazhou/Desktop/HR/SDC/data/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY characteristic_reviews (id, characteristic_id, review_id, char_value)
FROM '/Users/jessicazhou/Desktop/HR/SDC/data/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

COPY review_photos (id, review_id, review_url)
FROM '/Users/jessicazhou/Desktop/HR/SDC/data/reviews_photos.csv'
DELIMITER ','
CSV HEADER;