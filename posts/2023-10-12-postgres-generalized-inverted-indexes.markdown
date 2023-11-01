---
title: Generalized Inverted Indexes And You
---

I've been reading PostgreSQL documentation for fun lately, and I'd like to share what I've learned. Most recently, that's been advanced indexes and working with collection fields.

If you've ever worked prexisting array or JSON column and needed a complex `WHERE` clause for the latest feature, you might have worried about query performance. Or maybe you _didn't_ worry about it, only to find out later that it was glacially slow.<!--more--> Well good news! You can search these data structures efficiently with [Generalized Inverted Indexes](https://www.postgresql.org/docs/current/gin-intro.html), or GIN indexes.

I'm not entirely clear if the term is "GIN index" or just "GIN", but I'll stick to the former.

Just like B-Tree Indexes optimize basic lookups and sorting, GIN indexes improve performance for all types of operations involving collections.
For example, finding all rows that contain an element in an array column.

For a concrete example, let's imagine a table like this:

```sql
CREATE TABLE farm_animals (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    tags TEXT[] NOT NULL
);
```

Loaded up with values

```sql
INSERT INTO farm_animals (name, tags) VALUES
    ('Chicken', ARRAY['bird', 'domestic']),
    ('Cow', ARRAY['mammal', 'domestic']),
    ('Rooster', ARRAY['bird', 'domestic']),
    ('Dog', ARRAY['mammal', 'domestic', 'pet']),
    ('Cat', ARRAY['mammal', 'domestic', 'pet']),
    ('Fish', ARRAY['aquatic']);
```

We try to find all the birds, but it's just too slow. This is going to be a very high-traffic query, and our data-set is huge.

A GIN index will unpack the array, and put each _unique value_ on its own row with a list of pointers to all the rows containing that value.

The resulting index looks like this:

```txt
farm_animals Table       GIN Index on tags
------------------       ---------------------
id | name    | tags      key     | row_pointers
---|---------|--------   ------- | -------------
 1 | Chicken | bird      bird    | 1, 3
 2 | Cow     | mammal    mammal  | 2, 4, 5
 3 | Rooster | bird      domestic| 1, 2, 3, 4, 5
 4 | Dog     | mammal    pet     | 4, 5
 5 | Cat     | mammal    aquatic | 6
 6 | Fish    | aquatic
```

Now we can safely ask questions like "how many farm animals are domestic mammals?" or "find all the birds" without parsing the array column at all, just from the index. Now all our farm animal searches will scale.

GIN indexes are versatile: they can be used to efficiently query array columns, JSON columns, and even to create an index for full-text search or text similarity checks—both topics that definitely deserve their own articles.

With this, you can use collection fields with comfort and the knowledge that you're not sacrificing searchability or speed. Now go forth and write that complex `WHERE` statement, filter on that JSON field, and aggregate your domesticated birds.

For more reading, check out the [official Postgres documentation](https://www.postgresql.org/docs/current/gin-intro.html).
