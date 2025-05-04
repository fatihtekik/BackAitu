--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 17.2

-- Started on 2025-05-03 19:10:02

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: aituproject_user
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO aituproject_user;

--
-- TOC entry 3449 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: aituproject_user
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16738)
-- Name: category; Type: TABLE; Schema: public; Owner: aituproject_user
--

CREATE TABLE public.category (
    id integer NOT NULL,
    user_id integer,
    category character varying(100) NOT NULL
);


ALTER TABLE public.category OWNER TO aituproject_user;

--
-- TOC entry 221 (class 1259 OID 16737)
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: aituproject_user
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_id_seq OWNER TO aituproject_user;

--
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 221
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: aituproject_user
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- TOC entry 228 (class 1259 OID 16821)
-- Name: key; Type: TABLE; Schema: public; Owner: aituproject_user
--

CREATE TABLE public.key (
    id integer NOT NULL,
    cab character varying(50),
    corpus character varying(10),
    status boolean DEFAULT true NOT NULL
);


ALTER TABLE public.key OWNER TO aituproject_user;

--
-- TOC entry 226 (class 1259 OID 16784)
-- Name: key_category; Type: TABLE; Schema: public; Owner: aituproject_user
--

CREATE TABLE public.key_category (
    key_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.key_category OWNER TO aituproject_user;

--
-- TOC entry 224 (class 1259 OID 16751)
-- Name: key_history; Type: TABLE; Schema: public; Owner: aituproject_user
--

CREATE TABLE public.key_history (
    id integer NOT NULL,
    key_id integer,
    user_id integer,
    action character varying(50) NOT NULL,
    action_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.key_history OWNER TO aituproject_user;

--
-- TOC entry 223 (class 1259 OID 16750)
-- Name: key_history_id_seq; Type: SEQUENCE; Schema: public; Owner: aituproject_user
--

CREATE SEQUENCE public.key_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.key_history_id_seq OWNER TO aituproject_user;

--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 223
-- Name: key_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: aituproject_user
--

ALTER SEQUENCE public.key_history_id_seq OWNED BY public.key_history.id;


--
-- TOC entry 227 (class 1259 OID 16820)
-- Name: key_id_seq; Type: SEQUENCE; Schema: public; Owner: aituproject_user
--

CREATE SEQUENCE public.key_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.key_id_seq OWNER TO aituproject_user;

--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 227
-- Name: key_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: aituproject_user
--

ALTER SEQUENCE public.key_id_seq OWNED BY public.key.id;


--
-- TOC entry 216 (class 1259 OID 16696)
-- Name: role; Type: TABLE; Schema: public; Owner: aituproject_user
--

CREATE TABLE public.role (
    id integer NOT NULL,
    role character varying(50) NOT NULL
);


ALTER TABLE public.role OWNER TO aituproject_user;

--
-- TOC entry 215 (class 1259 OID 16695)
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: aituproject_user
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_id_seq OWNER TO aituproject_user;

--
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 215
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: aituproject_user
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- TOC entry 220 (class 1259 OID 16718)
-- Name: transfer_request; Type: TABLE; Schema: public; Owner: aituproject_user
--

CREATE TABLE public.transfer_request (
    id integer NOT NULL,
    key_id integer NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    to_user_id integer,
    from_user_id integer
);


ALTER TABLE public.transfer_request OWNER TO aituproject_user;

--
-- TOC entry 219 (class 1259 OID 16717)
-- Name: transfer_request_id_seq; Type: SEQUENCE; Schema: public; Owner: aituproject_user
--

CREATE SEQUENCE public.transfer_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transfer_request_id_seq OWNER TO aituproject_user;

--
-- TOC entry 3454 (class 0 OID 0)
-- Dependencies: 219
-- Name: transfer_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: aituproject_user
--

ALTER SEQUENCE public.transfer_request_id_seq OWNED BY public.transfer_request.id;


--
-- TOC entry 225 (class 1259 OID 16769)
-- Name: user_categories; Type: TABLE; Schema: public; Owner: aituproject_user
--

CREATE TABLE public.user_categories (
    user_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.user_categories OWNER TO aituproject_user;

--
-- TOC entry 229 (class 1259 OID 16828)
-- Name: user_category; Type: TABLE; Schema: public; Owner: aituproject_user
--

CREATE TABLE public.user_category (
    user_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.user_category OWNER TO aituproject_user;

--
-- TOC entry 218 (class 1259 OID 16703)
-- Name: users; Type: TABLE; Schema: public; Owner: aituproject_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    fio text NOT NULL,
    number character varying(20) NOT NULL,
    password text NOT NULL,
    role_id integer,
    admin boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO aituproject_user;

--
-- TOC entry 217 (class 1259 OID 16702)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: aituproject_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO aituproject_user;

--
-- TOC entry 3455 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: aituproject_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3250 (class 2604 OID 16741)
-- Name: category id; Type: DEFAULT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- TOC entry 3254 (class 2604 OID 16824)
-- Name: key id; Type: DEFAULT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.key ALTER COLUMN id SET DEFAULT nextval('public.key_id_seq'::regclass);


--
-- TOC entry 3251 (class 2604 OID 16754)
-- Name: key_history id; Type: DEFAULT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.key_history ALTER COLUMN id SET DEFAULT nextval('public.key_history_id_seq'::regclass);


--
-- TOC entry 3244 (class 2604 OID 16699)
-- Name: role id; Type: DEFAULT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- TOC entry 3247 (class 2604 OID 16721)
-- Name: transfer_request id; Type: DEFAULT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.transfer_request ALTER COLUMN id SET DEFAULT nextval('public.transfer_request_id_seq'::regclass);


--
-- TOC entry 3245 (class 2604 OID 16706)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3436 (class 0 OID 16738)
-- Dependencies: 222
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: aituproject_user
--

COPY public.category (id, user_id, category) FROM stdin;
4	\N	user
5	1	administration
\.


--
-- TOC entry 3442 (class 0 OID 16821)
-- Dependencies: 228
-- Data for Name: key; Type: TABLE DATA; Schema: public; Owner: aituproject_user
--

COPY public.key (id, cab, corpus, status) FROM stdin;
1	221	C1.3	t
2	222	C1.3	t
3	223	C1.3	t
4	224	C1.3	t
5	225	C1.3	t
6	226	C1.3	t
7	227	C1.3	t
8	228	C1.3	t
9	229	C1.3	t
10	230	C1.3	t
11	231	C1.3	t
12	232	C1.3	t
14	237	C1.3	t
15	240	C1.3	t
16	241	C1.3	t
17	243	C1.3	t
19	246	C1.3	t
20	247	C1.3	t
21	249	C1.3	t
23	251	C1.3	t
24	252	C1.3	t
25	253	C1.3	t
26	257	C1.3	t
27	258	C1.3	t
28	259	C1.3	t
29	260	C1.3	t
30	261	C1.3	t
31	262	C1.3	t
32	263	C1.3	t
33	264	C1.3	t
34	188	C1.3	t
35	187	C1.3	t
38	121	C1.3	t
39	128	C1.3	t
40	129	C1.3	t
41	130	C1.3	t
42	168	C1.3	t
43	sports hall	C1.3	t
44	dining hall	C1.3	t
45	337	C1.3	t
46	338	C1.3	t
47	339	C1.3	t
48	340	C1.3	t
49	341	C1.3	t
50	342	C1.3	t
51	343	C1.3	t
52	344	C1.3	t
53	345	C1.3	t
54	346	C1.3	t
55	352	C1.3	t
56	353	C1.3	t
57	354	C1.3	t
58	355	C1.3	t
59	356	C1.3	t
60	357	C1.3	t
61	358	C1.3	t
62	359	C1.3	t
63	360	C1.3	t
64	361	C1.3	t
65	362	C1.3	t
66	365	C1.3	t
67	366	C1.3	t
68	367	C1.3	t
69	370	C1.3	t
70	331	C1.3	t
71	327	C1.3	t
72	328	C1.3	t
73	324	C1.3	t
74	323	C1.3	t
75	322	C1.3	t
76	321	C1.3	t
77	319	C1.3	t
78	318	C1.3	t
36	126	C1.3	f
37	125	C1.3	f
13	236	C1.3	f
22	250	C1.3	f
18	244	C1.3	f
\.


--
-- TOC entry 3440 (class 0 OID 16784)
-- Dependencies: 226
-- Data for Name: key_category; Type: TABLE DATA; Schema: public; Owner: aituproject_user
--

COPY public.key_category (key_id, category_id) FROM stdin;
\.


--
-- TOC entry 3438 (class 0 OID 16751)
-- Dependencies: 224
-- Data for Name: key_history; Type: TABLE DATA; Schema: public; Owner: aituproject_user
--

COPY public.key_history (id, key_id, user_id, action, action_time, "timestamp") FROM stdin;
1	13	1	issue	2025-04-30 08:01:58.701954	2025-04-30 08:01:58.701954
2	37	1	issue	2025-04-30 08:03:01.928273	2025-04-30 08:03:01.928273
3	37	1	return	2025-04-30 08:03:33.528603	2025-04-30 08:03:33.528603
4	13	1	return	2025-04-30 08:03:54.424157	2025-04-30 08:03:54.424157
5	24	1	issue	2025-04-30 08:04:43.270246	2025-04-30 08:04:43.270246
6	14	5	issue	2025-05-02 07:42:16.905815	2025-05-02 07:42:16.913527
7	14	5	return	2025-05-02 07:47:27.265217	2025-05-02 07:47:27.266716
8	14	5	issue	2025-05-02 07:49:20.420209	2025-05-02 07:49:20.425438
9	14	5	return	2025-05-02 07:52:04.759522	2025-05-02 07:52:04.762054
10	14	5	issue	2025-05-02 07:53:24.845222	2025-05-02 07:53:24.850868
11	14	5	return	2025-05-02 07:59:25.539027	2025-05-02 07:59:25.540886
12	14	5	issue	2025-05-02 08:00:44.338281	2025-05-02 08:00:44.342903
13	36	5	issue	2025-05-03 11:28:14.660142	2025-05-03 11:28:14.665236
14	36	5	return	2025-05-03 11:46:14.76764	2025-05-03 11:46:14.773909
15	36	5	issue	2025-05-03 11:47:23.884417	2025-05-03 11:47:23.88858
16	37	3	issue	2025-05-03 12:00:47.5487	2025-05-03 12:00:47.55202
19	13	5	issue	2025-05-03 12:15:27.124479	2025-05-03 12:15:27.131688
18	22	5	issue	2025-05-03 12:12:36.989795	2025-05-03 12:12:36.992561
17	18	5	issue	2025-05-03 12:11:54.362598	2025-05-03 12:11:54.365648
20	37	5	transfer	2025-05-03 12:55:40.164615	2025-05-03 12:55:40.166462
\.


--
-- TOC entry 3430 (class 0 OID 16696)
-- Dependencies: 216
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: aituproject_user
--

COPY public.role (id, role) FROM stdin;
\.


--
-- TOC entry 3434 (class 0 OID 16718)
-- Dependencies: 220
-- Data for Name: transfer_request; Type: TABLE DATA; Schema: public; Owner: aituproject_user
--

COPY public.transfer_request (id, key_id, status, "timestamp", to_user_id, from_user_id) FROM stdin;
1	37	approved	2025-05-03 12:54:48.313451	5	3
\.


--
-- TOC entry 3439 (class 0 OID 16769)
-- Dependencies: 225
-- Data for Name: user_categories; Type: TABLE DATA; Schema: public; Owner: aituproject_user
--

COPY public.user_categories (user_id, category_id) FROM stdin;
1	4
1	5
2	4
3	4
4	4
5	4
2	5
\.


--
-- TOC entry 3443 (class 0 OID 16828)
-- Dependencies: 229
-- Data for Name: user_category; Type: TABLE DATA; Schema: public; Owner: aituproject_user
--

COPY public.user_category (user_id, category_id) FROM stdin;
\.


--
-- TOC entry 3432 (class 0 OID 16703)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: aituproject_user
--

COPY public.users (id, fio, number, password, role_id, admin) FROM stdin;
1	ahmadieva_arai	ahmadieva_arai	1234	\N	f
2	Салих Фатих Текик	Салих Фатих Текик	1234	\N	f
3	SALIKH TEKIK	+77783928285	1234	\N	f
4	Сафарова Нинель Руслановна	87052344567	1234	\N	t
5	Қуандық Нұрайым Нұрхатқызы	87710504939	1234	\N	f
\.


--
-- TOC entry 3456 (class 0 OID 0)
-- Dependencies: 221
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: aituproject_user
--

SELECT pg_catalog.setval('public.category_id_seq', 5, true);


--
-- TOC entry 3457 (class 0 OID 0)
-- Dependencies: 223
-- Name: key_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: aituproject_user
--

SELECT pg_catalog.setval('public.key_history_id_seq', 20, true);


--
-- TOC entry 3458 (class 0 OID 0)
-- Dependencies: 227
-- Name: key_id_seq; Type: SEQUENCE SET; Schema: public; Owner: aituproject_user
--

SELECT pg_catalog.setval('public.key_id_seq', 78, true);


--
-- TOC entry 3459 (class 0 OID 0)
-- Dependencies: 215
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: aituproject_user
--

SELECT pg_catalog.setval('public.role_id_seq', 1, false);


--
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 219
-- Name: transfer_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: aituproject_user
--

SELECT pg_catalog.setval('public.transfer_request_id_seq', 1, true);


--
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: aituproject_user
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- TOC entry 3263 (class 2606 OID 16743)
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- TOC entry 3271 (class 2606 OID 16788)
-- Name: key_category key_category_pkey; Type: CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.key_category
    ADD CONSTRAINT key_category_pkey PRIMARY KEY (key_id, category_id);


--
-- TOC entry 3265 (class 2606 OID 16757)
-- Name: key_history key_history_pkey; Type: CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.key_history
    ADD CONSTRAINT key_history_pkey PRIMARY KEY (id);


--
-- TOC entry 3273 (class 2606 OID 16827)
-- Name: key key_pkey; Type: CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.key
    ADD CONSTRAINT key_pkey PRIMARY KEY (id);


--
-- TOC entry 3257 (class 2606 OID 16701)
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- TOC entry 3261 (class 2606 OID 16725)
-- Name: transfer_request transfer_request_pkey; Type: CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.transfer_request
    ADD CONSTRAINT transfer_request_pkey PRIMARY KEY (id);


--
-- TOC entry 3267 (class 2606 OID 16773)
-- Name: user_categories user_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.user_categories
    ADD CONSTRAINT user_categories_pkey PRIMARY KEY (user_id, category_id);


--
-- TOC entry 3275 (class 2606 OID 16832)
-- Name: user_category user_category_pkey; Type: CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.user_category
    ADD CONSTRAINT user_category_pkey PRIMARY KEY (user_id, category_id);


--
-- TOC entry 3259 (class 2606 OID 16711)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3268 (class 1259 OID 16800)
-- Name: idx_key_category_category_id; Type: INDEX; Schema: public; Owner: aituproject_user
--

CREATE INDEX idx_key_category_category_id ON public.key_category USING btree (category_id);


--
-- TOC entry 3269 (class 1259 OID 16799)
-- Name: idx_key_category_key_id; Type: INDEX; Schema: public; Owner: aituproject_user
--

CREATE INDEX idx_key_category_key_id ON public.key_category USING btree (key_id);


--
-- TOC entry 3279 (class 2606 OID 16744)
-- Name: category category_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3276 (class 2606 OID 16843)
-- Name: transfer_request fk_from_user; Type: FK CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.transfer_request
    ADD CONSTRAINT fk_from_user FOREIGN KEY (from_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3277 (class 2606 OID 16853)
-- Name: transfer_request fk_key; Type: FK CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.transfer_request
    ADD CONSTRAINT fk_key FOREIGN KEY (key_id) REFERENCES public.key(id) ON DELETE SET NULL;


--
-- TOC entry 3278 (class 2606 OID 16848)
-- Name: transfer_request fk_to_user; Type: FK CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.transfer_request
    ADD CONSTRAINT fk_to_user FOREIGN KEY (to_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3283 (class 2606 OID 16794)
-- Name: key_category key_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.key_category
    ADD CONSTRAINT key_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE CASCADE;


--
-- TOC entry 3280 (class 2606 OID 16763)
-- Name: key_history key_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.key_history
    ADD CONSTRAINT key_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3281 (class 2606 OID 16779)
-- Name: user_categories user_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.user_categories
    ADD CONSTRAINT user_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id);


--
-- TOC entry 3282 (class 2606 OID 16774)
-- Name: user_categories user_categories_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.user_categories
    ADD CONSTRAINT user_categories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3284 (class 2606 OID 16838)
-- Name: user_category user_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.user_category
    ADD CONSTRAINT user_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE CASCADE;


--
-- TOC entry 3285 (class 2606 OID 16833)
-- Name: user_category user_category_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aituproject_user
--

ALTER TABLE ONLY public.user_category
    ADD CONSTRAINT user_category_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-05-03 19:10:12

--
-- PostgreSQL database dump complete
--

