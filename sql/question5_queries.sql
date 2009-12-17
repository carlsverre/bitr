-- Question 5 queries

-- (a)
SELECT * FROM users WHERE active = true;

-- (b)
CREATE OR REPLACE FUNCTION sum_postcounts(t_row users) RETURNS integer AS $$
DECLARE
	accum	int;
	mtype	char(3);
BEGIN
	accum := 0;
	FOR mtype IN SELECT mediatype FROM posts WHERE user_id=t_row.id LOOP
		IF mtype='r--' THEN
			accum := accum + 1;
		ELSIF mtype='-r-' THEN
			accum := accum + 5;
		ELSE
			accum := accum + 10;
		END IF;
	END LOOP;

	RETURN accum;
END;
$$ LANGUAGE plpgsql;

select * from users u order by sum_postcounts(u) DESC;

-- (c)
select u.id,u.username from users u order by (select sum(sum_postcounts(u2)) from users u2 where u2.id in (select friend_id from friends where user_id=u.id)) desc;

-- (d)
-- search post content/tags
SELECT * FROM posts, plainto_tsquery('responding') AS query
	WHERE private=false AND query @@ index_col
	ORDER BY ts_rank_cd(index_col, query) DESC;

-- get all posts which are videos and are by user_id=1
select * from posts where mediatype='--r' and user_id=1;

-- get all posts which are currently encoding either their video or their photo
select * from posts where filename='default' AND mediatype in ('-r-','--r');

-- (e)
-- this question is a bit confusing...
-- not sure what it means...  what is a permission list?  a selection of x permission rows?

-- (f)
CREATE OR REPLACE FUNCTION relevant_to_media(t_row posts) RETURNS SETOF posts AS $$
DECLARE
	r posts;
BEGIN
	FOR r IN SELECT * FROM posts, to_tsquery(regexp_replace(regexp_replace(t_row.content, E'[^a-zA-Z _0-9]+', '', 'g'), E'\\s+', ' | ', 'g')) AS query
		WHERE query @@ index_col AND id != t_row.id ORDER BY ts_rank_cd(index_col, query) DESC LOOP
		RETURN NEXT r;
	END LOOP;

	RETURN;
END;
$$ LANGUAGE plpgsql;
