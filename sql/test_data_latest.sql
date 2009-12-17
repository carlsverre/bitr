--
-- PostgreSQL database dump
--

-- Started on 2009-12-17 10:45:32 PST

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

SET search_path = public, pg_catalog;

--
-- TOC entry 1848 (class 0 OID 0)
-- Dependencies: 1523
-- Name: friends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: csc370
--

SELECT pg_catalog.setval('friends_id_seq', 20, true);


--
-- TOC entry 1849 (class 0 OID 0)
-- Dependencies: 1517
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: csc370
--

SELECT pg_catalog.setval('groups_id_seq', 9, true);


--
-- TOC entry 1850 (class 0 OID 0)
-- Dependencies: 1519
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: csc370
--

SELECT pg_catalog.setval('posts_id_seq', 57, true);


--
-- TOC entry 1851 (class 0 OID 0)
-- Dependencies: 1521
-- Name: user_to_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: csc370
--

SELECT pg_catalog.setval('user_to_group_id_seq', 21, true);


--
-- TOC entry 1852 (class 0 OID 0)
-- Dependencies: 1515
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: csc370
--

SELECT pg_catalog.setval('users_id_seq', 8, true);


--
-- TOC entry 1840 (class 0 OID 16815)
-- Dependencies: 1516
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: csc370
--

INSERT INTO users (id, username, fullname, last_login, creation_date, location, password, salt, email, active, signature) VALUES (6, 'superman', 'Kal-El', '2009-12-16 23:47:19.346423', '2009-12-16 23:47:19.346423', 'Smallville', 'a4fcfadf4b6a943f99584adc2e8c4225', 'de49e8a7d6f0ea8defb3d2eddffa0963', 'super@man.com', true, 'Wowzers...  I''m superer than batman!');
INSERT INTO users (id, username, fullname, last_login, creation_date, location, password, salt, email, active, signature) VALUES (5, 'bob', 'bobsies mckinn', '2009-12-16 23:47:19.346423', '2009-12-16 23:47:19.346423', 'dunno...', 'a4fcfadf4b6a943f99584adc2e8c4225', 'de49e8a7d6f0ea8defb3d2eddffa0963', 'bob@bob.com', true, 'BOB TO THE RESCUE!!!!111!one!');
INSERT INTO users (id, username, fullname, last_login, creation_date, location, password, salt, email, active, signature) VALUES (4, 'orphan', '', '2009-12-16 23:47:19.346423', '2009-12-16 23:47:19.346423', '', 'a4fcfadf4b6a943f99584adc2e8c4225', 'de49e8a7d6f0ea8defb3d2eddffa0963', NULL, true, '');
INSERT INTO users (id, username, fullname, last_login, creation_date, location, password, salt, email, active, signature) VALUES (8, 'maggie', '', '2009-12-16 23:47:19.346423', '2009-12-16 23:47:19.346423', 'victoria bc', 'a4fcfadf4b6a943f99584adc2e8c4225', 'de49e8a7d6f0ea8defb3d2eddffa0963', 'maggie@uvic.ca', true, 'I AM SUPER AWESOME');
INSERT INTO users (id, username, fullname, last_login, creation_date, location, password, salt, email, active, signature) VALUES (1, 'carl', 'Carl Sverre', '2009-12-16 23:47:19.346423', '2009-12-16 23:47:19.346423', 'Victoria BC', 'a4fcfadf4b6a943f99584adc2e8c4225', 'de49e8a7d6f0ea8defb3d2eddffa0963', 'bloonmail@gmail.com', true, 'Bitr is composed of over 5000 lines of code!');
INSERT INTO users (id, username, fullname, last_login, creation_date, location, password, salt, email, active, signature) VALUES (3, 'sarah', 'Sarah Prusinowski', '2009-12-16 23:47:19.346423', '2009-12-16 23:47:19.346423', 'victoria bc', 'a4fcfadf4b6a943f99584adc2e8c4225', 'de49e8a7d6f0ea8defb3d2eddffa0963', NULL, true, 'Fo''shizzle');
INSERT INTO users (id, username, fullname, last_login, creation_date, location, password, salt, email, active, signature) VALUES (7, 'justmegzy', '', '2009-12-16 23:47:19.346423', '2009-12-16 23:47:19.346423', '', '361862c81dee747d3f8e10b9dfb0ca3f', '03af25111b6d7c83cfd0a5d108efaf0b', NULL, true, 'thinks your soul tastes delicious!');


--
-- TOC entry 1844 (class 0 OID 16888)
-- Dependencies: 1524 1840 1840
-- Data for Name: friends; Type: TABLE DATA; Schema: public; Owner: csc370
--

INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (1, 6, 1, 'rrr', '2009-12-14 09:59:57.072359');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (2, 6, 5, 'rrr', '2009-12-14 10:00:02.509096');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (3, 1, 3, 'rrr', '2009-12-14 10:14:16.522939');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (6, 5, 1, 'rrr', '2009-12-14 10:15:47.28345');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (7, 5, 3, 'rrr', '2009-12-14 10:15:54.78549');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (8, 3, 1, 'rrr', '2009-12-14 10:23:16.515018');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (9, 4, 1, 'rrr', '2009-12-14 10:26:32.014285');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (10, 3, 6, 'rrr', '2009-12-14 11:49:22.409723');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (11, 1, 4, 'rrr', '2009-12-14 13:09:12.165428');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (13, 7, 6, 'rrr', '2009-12-16 13:54:04.381228');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (14, 1, 7, 'rrr', '2009-12-16 13:59:06.222337');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (15, 1, 6, 'rrr', '2009-12-16 14:05:16.827829');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (16, 5, 6, 'rrr', '2009-12-16 14:05:44.183725');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (19, 1, 5, 'rrr', '2009-12-16 16:26:56.520034');
INSERT INTO friends (id, user_id, friend_id, perms, creation_date) VALUES (20, 8, 1, 'rrr', '2009-12-16 18:31:28.213534');


--
-- TOC entry 1841 (class 0 OID 16833)
-- Dependencies: 1518 1840
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: csc370
--

INSERT INTO groups (id, name, creation_date, description, owner) VALUES (2, 'test group', '2009-12-14 12:26:39.979567', 'testing 1 2 3', 1);
INSERT INTO groups (id, name, creation_date, description, owner) VALUES (6, 'awesome people', '2009-12-15 00:37:10.718811', 'these people are awesome', 1);
INSERT INTO groups (id, name, creation_date, description, owner) VALUES (8, 'Just me and superman', '2009-12-16 13:55:19.308311', 'See name.', 7);
INSERT INTO groups (id, name, creation_date, description, owner) VALUES (9, 'awesome', '2009-12-16 18:25:48.085531', 'my group
', 8);


--
-- TOC entry 1842 (class 0 OID 16847)
-- Dependencies: 1520 1840
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: csc370
--

INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, filename, mediatype, index_col) VALUES (53, 1, NULL, '2009-12-17 02:03:51', 'movie', 'Alice in wonderland!', false, '454f8aee6bb38a01c44012128bc250f1.flv', '--r', '''454f8aee6bb38a01c44012128bc250f1.flv'':5C ''alic'':2B ''movi'':1A ''wonderland'':4B');
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, filename, mediatype, index_col) VALUES (55, 1, 54, '2009-12-17 04:01:13.923407', '', 'responding to #54 lets hope this works!!', false, NULL, 'r--', '''54'':3B ''hope'':5B ''let'':4B ''respond'':1B ''work'':7B');
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, filename, mediatype, index_col) VALUES (57, 1, 10, '2009-12-17 04:39:50.984868', 'good-job', 'Nice job superman!!', false, NULL, 'r--', '''good'':2A ''good-job'':1A ''job'':3A,5B ''nice'':4B ''superman'':6B');
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, filename, mediatype, index_col) VALUES (56, 1, 54, '2009-12-17 04:01:48.762728', '', 'trying the response again #54', false, NULL, 'r--', '''54'':5B ''respons'':3B ''tri'':1B');
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, filename, mediatype, index_col) VALUES (54, 1, 53, '2009-12-17 02:37:34', 'photo', 'Me and my sis!', false, '7d1a1dba985f7221e592ddb33fbb047d.jpg', '-r-', '''7d1a1dba985f7221e592ddb33fbb047d.jpg'':6C ''photo'':1A ''sis'':5B');
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, filename, mediatype, index_col) VALUES (1, 5, NULL, '2009-12-14 10:15:34.057452', 'shiny, things', 'i like shiny things...', true, NULL, 'r--', '''like'':4B ''shini'':1A,5B ''thing'':2A,6B');
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, filename, mediatype, index_col) VALUES (2, 5, NULL, '2009-12-14 10:15:41.707902', 'alone', 'this isn''t private READ ME!!!', false, NULL, 'r--', '''alon'':1A ''isn'':3B ''privat'':5B ''read'':6B');
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, filename, mediatype, index_col) VALUES (3, 1, NULL, '2009-12-14 10:16:36.600995', 'first', 'First post', false, NULL, 'r--', '''first'':1A,2B ''post'':3B');
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, filename, mediatype, index_col) VALUES (4, 1, NULL, '2009-12-14 10:16:52.152849', 'goodlookin', 'hmm...  this is starting to look good... :)', false, NULL, 'r--', '''good'':8B ''goodlookin'':1A ''hmm'':2B ''look'':7B ''start'':5B');
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, filename, mediatype, index_col) VALUES (5, 1, NULL, '2009-12-14 10:17:01.489579', 'secret', 'PRIVATE: Super Secret', true, NULL, 'r--', '''privat'':2B ''secret'':1A,4B ''super'':3B');
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, filename, mediatype, index_col) VALUES (6, 3, NULL, '2009-12-14 10:23:12.112349', 'sleep', 'sleeping actually...', false, NULL, 'r--', '''actual'':3B ''sleep'':1A,2B');
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, filename, mediatype, index_col) VALUES (7, 4, NULL, '2009-12-14 10:26:03.580764', 'sad', 'wow I am alone in this world...', false, NULL, 'r--', '''alon'':5B ''sad'':1A ''world'':8B ''wow'':2B');
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, filename, mediatype, index_col) VALUES (8, 4, NULL, '2009-12-14 10:26:14.004399', 'more d''s', 'really saddd', false, NULL, 'r--', '''d'':2A ''realli'':3B ''saddd'':4B');
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, filename, mediatype, index_col) VALUES (9, 4, NULL, '2009-12-14 10:26:27.007136', 'SECRET', 'someone is watching me', true, NULL, 'r--', '''secret'':1A ''someon'':2B ''watch'':4B');
INSERT INTO posts (id, user_id, response_to, creation_date, tags, content, private, filename, mediatype, index_col) VALUES (10, 6, NULL, '2009-12-14 10:27:06.807418', 'oh yeahhh', 'SAVING SHIT', false, NULL, 'r--', '''oh'':1A ''save'':3B ''shit'':4B ''yeahhh'':2A');


--
-- TOC entry 1845 (class 0 OID 16922)
-- Dependencies: 1525
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: csc370
--

INSERT INTO sessions (session, session_id) VALUES ('session = {id:"l+PxlYduQ0h",data:{jf3290f9a:{user_id:7},user_id:7},path:"/",domain:null,persistent:true,lifetime:604800,expiration:1261605193677,getSetCookieHeaderValue:function (){
  var parts;
  parts=[''SID=''+this.id];
  if(this.path) parts.push(''path=''+this.path);
  if(this.domain) parts.push(''domain=''+this.domain);
  if(this.persistent) parts.push(''expires=''+dateCookieString(this.expiration));
  return parts.join(''; '');
},destroy:function (){
  delete sessions[this.id];
  removeSerializedSession(this.id);
},serialize:function () {
  return ''session = ''+serializer.serialize(this);
}}', 'l+PxlYduQ0h');
INSERT INTO sessions (session, session_id) VALUES ('session = {id:"dyRSmu++faN",data:{jf3290f9a:{},user_id:null},path:"/",domain:null,persistent:true,lifetime:604800,getSetCookieHeaderValue:function (){
  var parts;
  parts=[''SID=''+this.id];
  if(this.path) parts.push(''path=''+this.path);
  if(this.domain) parts.push(''domain=''+this.domain);
  if(this.persistent) parts.push(''expires=''+dateCookieString(this.expiration));
  return parts.join(''; '');
},destroy:function (){
  delete sessions[this.id];
  removeSerializedSession(this.id);
},serialize:function () {
  return ''session = ''+serializer.serialize(this);
}}', 'dyRSmu++faN');
INSERT INTO sessions (session, session_id) VALUES ('session = {id:"mKu2E88sqg8",data:{jf3290f9a:{user_id:1},user_id:1},path:"/",domain:null,persistent:true,lifetime:604800,expiration:1261630513526,getSetCookieHeaderValue:function (){
  var parts;
  parts=[''SID=''+this.id];
  if(this.path) parts.push(''path=''+this.path);
  if(this.domain) parts.push(''domain=''+this.domain);
  if(this.persistent) parts.push(''expires=''+dateCookieString(this.expiration));
  return parts.join(''; '');
},destroy:function (){
  delete sessions[this.id];
  removeSerializedSession(this.id);
},serialize:function () {
  return ''session = ''+serializer.serialize(this);
}}', 'mKu2E88sqg8');


--
-- TOC entry 1843 (class 0 OID 16870)
-- Dependencies: 1522 1841 1840
-- Data for Name: user_to_group; Type: TABLE DATA; Schema: public; Owner: csc370
--

INSERT INTO user_to_group (id, group_id, user_id, perms) VALUES (1, 2, 1, 'rrr');
INSERT INTO user_to_group (id, group_id, user_id, perms) VALUES (10, 2, 6, 'rrr');
INSERT INTO user_to_group (id, group_id, user_id, perms) VALUES (11, 6, 1, 'rrr');
INSERT INTO user_to_group (id, group_id, user_id, perms) VALUES (13, 6, 3, 'rrr');
INSERT INTO user_to_group (id, group_id, user_id, perms) VALUES (17, 8, 7, 'rrr');
INSERT INTO user_to_group (id, group_id, user_id, perms) VALUES (18, 8, 6, 'rrr');
INSERT INTO user_to_group (id, group_id, user_id, perms) VALUES (19, 6, 6, 'rrr');
INSERT INTO user_to_group (id, group_id, user_id, perms) VALUES (20, 9, 8, 'rrr');
INSERT INTO user_to_group (id, group_id, user_id, perms) VALUES (21, 9, 1, 'rrr');


-- Completed on 2009-12-17 10:45:33 PST

--
-- PostgreSQL database dump complete
--

