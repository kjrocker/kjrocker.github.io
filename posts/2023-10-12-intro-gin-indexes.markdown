---
title: Intro to GIN Indexes
---

I've been completely engrossed in the PostgreSQL documentation lately, and I'd like to share some gems with you—specifically about the magical world of indexes and collections.

Ever find yourself with a prexisting column full of arrays or JSON objects, and the complex `WHERE` clause for the latest feature is glacially slow? Well good news! You can search these complex data structures efficiently with Generalized Inverted Indexes, or GIN indexes. They're the Swiss Army knife of querying collections.<!--more-->

Like regular indexes, which are technically B-Tree Indexes, optimize basic lookups and sorting, GIN indexes drastically improve performance when dealing with collections.

Let's imagine a table like this:

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

This can be used to unpack array columns, JSON columns, and used to create an index for full-text search (which definitely deserves its own topic).

Now you can use collection fields with comfort and the knowledge that you're not sacrificing searchability or speed.
