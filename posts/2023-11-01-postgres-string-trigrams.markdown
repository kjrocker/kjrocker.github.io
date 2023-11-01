---
title: pg-trgm and Text Similarity Search
meta: A brief introduction to the pg-trgm plugin in Postgres and its many uses
---

I asked ChatGPT what are some advanced Postgres tricks I should learn about, and one of the things that came up was `pg_trgm`. After a bit [more reading](https://www.postgresql.org/docs/current/pgtrgm.html), I'm convinced this plugin should be an essential part of any database engineers toolkit. <!--more-->

From the documentation:

> The `pg_trgm` module provides functions and operators for determining the similarity of alphanumeric text based on trigram matching, as well as index operator classes that support fast searching for similar strings.

Trigram matching is a whole algorithm on its own, but it's enough to say that it "breaks strings into three-character chunks and counts how many chunks are shared".

You can either compare two strings directly:

```sql
select similarity('shiori novella', 'murasaki shion') as similiarity;
```

```txt
similiarity
-----------
0.153846
```

Or compare a substring to a larger string:

```sql
select word_similarity ('potato', 'two potatos for the harvest festival') as word_similiarity;
```

```txt
word_similarity
--------------
0.857143
```

You can filter to only rows with similar text. The exact threshold is controlled by configuration.

```sql
select * from users where name % 'John';
```

Or you could put the value in a column and manipulate it directly.

```sql
select *, name <-> 'John' as john_distance from users;
```

The absolute _killer_ feature for this is having text search that exists somewhere between exact string matches and full fuzzy-text search.

Name search that can handle misspellings, finding mentions of a specific word that accounts for things like plurals or prefixes...

You could also use this for a Google-style "Did You Mean...." UI for when a search would return no results.

If you've ever worked in a system where you searched for "tickets" but the thing you actually needed was misspelled "tocket", then you need a more flexible keyword search. But if you don't need or want to invest in true full-text search, this is a simple alternative.

For more reading, check out the [official documentation](https://www.postgresql.org/docs/current/pgtrgm.html).

### One more thing

Because this extension converts text into an array, you can _absolutely_ create a GIN Index with this to optimize even further.

```sql
CREATE INDEX idx_users_email ON users USING gin(email gin_trgm_ops);
```
