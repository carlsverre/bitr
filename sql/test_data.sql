--
-- PostgreSQL database dump
--

-- Started on 2009-12-14 10:28:39 PST

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

SET search_path = public, pg_catalog;

--
-- TOC entry 1838 (class 0 OID 0)
-- Dependencies: 1518
-- Name: friends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: csc370
--

SELECT pg_catalog.setval('friends_id_seq', 9, true);


--
-- TOC entry 1839 (class 0 OID 0)
-- Dependencies: 1512
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: csc370
--

SELECT pg_catalog.setval('groups_id_seq', 1, false);


--
-- TOC entry 1840 (class 0 OID 0)
-- Dependencies: 1514
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: csc370
--

SELECT pg_catalog.setval('posts_id_seq', 10, true);


--
-- TOC entry 1841 (class 0 OID 0)
-- Dependencies: 1516
-- Name: user_to_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: csc370
--

SELECT pg_catalog.setval('user_to_group_id_seq', 1, false);


--
-- TOC entry 1842 (class 0 OID 0)
-- Dependencies: 1510
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: csc370
--

SELECT pg_catalog.setval('users_id_seq', 6, true);


--
-- TOC entry 1831 (class 0 OID 16815)
-- Dependencies: 1511
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: csc370
--

INSERT INTO users (id, username, fullname, last_login, creation_date, location, password, salt, email, active, signature) VALUES (5, 'bob', 'bobsies mckinn', '2009-04-14 09:56:01', '2009-05-14 09:56:01', 'dunno...', 'a4fcfadf4b6a943f99584adc2e8c4225', 'de49e8a7d6f0ea8defb3d2eddffa0963', 'bob@bob.com', true, 'BOB TO THE RESCUE!!!!111!one!');
INSERT INTO users (id, username, fullname, last_login, creation_date, location, password, salt, email, active, signature) VALUES (1, 'carl', 'carl sverre', '2009-08-14 09:53:08', '2009-09-14 09:53:08', 'victoria bc', 'a4fcfadf4b6a943f99584adc2e8c4225', 'de49e8a7d6f0ea8defb3d2eddffa0963', 'bloonmail@gmail.com', true, 'awesome in a small package');
INSERT INTO users (id, username, fullname, last_login, creation_date, location, password, salt, email, active, signature) VALUES (3, 'sarah', 'Sarah Prusinowski', '2009-09-14 09:55:45', '2009-10-14 09:55:45', 'victoria bc', 'a4fcfadf4b6a943f99584adc2e8c4225', 'de49e8a7d6f0ea8defb3d2eddffa0963', NULL, true, 'Fo''shizzle');
INSERT INTO users (id, username, fullname, last_login, creation_date, location, password, salt, email, active, signature) VALUES (4, 'orphan', '', '2009-10-14 09:55:53', '2009-11-14 09:55:53', '', 'a4fcfadf4b6a943f99584adc2e8c4225', 'de49e8a7d6f0ea8defb3d2eddffa0963', NULL, true, '');
INSERT INTO users (id, username, fullname, last_login, creation_date, location, password, salt, email, active, signature) VALUES (6, 'superman', 'Kal-El', '2009-06-14 09:56:09', '2009-07-14 09:56:09', 'Smallville', 'a4fcfadf4b6a943f99584adc2e8c4225', 'de49e8a7d6f0ea8defb3d2eddffa0963', 'super@man.com', true, 'Wowzers...  I''m superer than batman!');


--
-- TOC entry 1835 (class 0 OID 16888)
-- Dependencies: 1519 1831 1831
-- Data for Name: friends; Type: TABLE DATA; Schema: public; Owner: csc370
--

INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (1, 6, 1, 'rrr', '2009-12-14 09:59:57.072359');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (2, 6, 5, 'rrr', '2009-12-14 10:00:02.509096');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (3, 1, 3, 'rrr', '2009-12-14 10:14:16.522939');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (4, 1, 5, '-rr', '2009-12-14 10:14:21.505776');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (5, 1, 4, 'rrr', '2009-12-14 10:14:24.990143');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (6, 5, 1, 'rrr', '2009-12-14 10:15:47.28345');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (7, 5, 3, 'rrr', '2009-12-14 10:15:54.78549');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (8, 3, 1, 'rrr', '2009-12-14 10:23:16.515018');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (9, 4, 1, 'rrr', '2009-12-14 10:26:32.014285');


--
-- TOC entry 1832 (class 0 OID 16833)
-- Dependencies: 1513
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: csc370
--



--
-- TOC entry 1833 (class 0 OID 16847)
-- Dependencies: 1515 1831
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: csc370
--

INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, mediatype, filename) VALUES (1, 5, NULL, '2009-12-14 10:15:34.057452', 'shiny, things', 'i like shiny things...', true, 'text', NULL);
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, mediatype, filename) VALUES (2, 5, NULL, '2009-12-14 10:15:41.707902', 'alone', 'this isn''t private READ ME!!!', false, 'text', NULL);
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, mediatype, filename) VALUES (3, 1, NULL, '2009-12-14 10:16:36.600995', 'first', 'First post', false, 'text', NULL);
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, mediatype, filename) VALUES (4, 1, NULL, '2009-12-14 10:16:52.152849', 'goodlookin', 'hmm...  this is starting to look good... :)', false, 'text', NULL);
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, mediatype, filename) VALUES (5, 1, NULL, '2009-12-14 10:17:01.489579', 'secret', 'PRIVATE: Super Secret', true, 'text', NULL);
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, mediatype, filename) VALUES (6, 3, NULL, '2009-12-14 10:23:12.112349', 'sleep', 'sleeping actually...', false, 'text', NULL);
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, mediatype, filename) VALUES (7, 4, NULL, '2009-12-14 10:26:03.580764', 'sad', 'wow I am alone in this world...', false, 'text', NULL);
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, mediatype, filename) VALUES (8, 4, NULL, '2009-12-14 10:26:14.004399', 'more d''s', 'really saddd', false, 'text', NULL);
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, mediatype, filename) VALUES (9, 4, NULL, '2009-12-14 10:26:27.007136', 'SECRET', 'someone is watching me', true, 'text', NULL);
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, mediatype, filename) VALUES (10, 6, NULL, '2009-12-14 10:27:06.807418', 'oh yeahhh', 'SAVING SHIT', false, 'text', NULL);


--
-- TOC entry 1834 (class 0 OID 16870)
-- Dependencies: 1517 1832 1831
-- Data for Name: user_to_group; Type: TABLE DATA; Schema: public; Owner: csc370
--



-- Completed on 2009-12-14 10:28:39 PST

--
-- PostgreSQL database dump complete
--

