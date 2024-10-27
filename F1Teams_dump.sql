--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 17.0

-- Started on 2024-10-27 19:12:31 CET

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16723)
-- Name: drivers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drivers (
    name character varying(50),
    surname character varying(50),
    nationality character varying(50),
    year_of_birth integer,
    seasons_competed integer,
    races_entered integer,
    wins integer,
    points integer,
    poles integer,
    fastest_laps integer,
    podiums integer,
    wdc integer,
    team_id integer
);


ALTER TABLE public.drivers OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16717)
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    team_id integer NOT NULL,
    team_name character varying(50),
    engine character varying(50),
    licensed_in character varying(50),
    season_entered integer,
    races_entered integer,
    wins integer,
    points integer,
    poles integer,
    fastest_laps integer,
    podiums integer,
    wdc integer,
    wcc integer
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16716)
-- Name: teams_team_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teams_team_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teams_team_id_seq OWNER TO postgres;

--
-- TOC entry 3602 (class 0 OID 0)
-- Dependencies: 215
-- Name: teams_team_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teams_team_id_seq OWNED BY public.teams.team_id;


--
-- TOC entry 3447 (class 2604 OID 16720)
-- Name: teams team_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams ALTER COLUMN team_id SET DEFAULT nextval('public.teams_team_id_seq'::regclass);


--
-- TOC entry 3596 (class 0 OID 16723)
-- Dependencies: 217
-- Data for Name: drivers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drivers (name, surname, nationality, year_of_birth, seasons_competed, races_entered, wins, points, poles, fastest_laps, podiums, wdc, team_id) FROM stdin;
Max	Verstappen	Netherlands	1997	10	205	61	2940	40	32	110	3	1
Sergio	Perez	Mexico	1990	14	281	6	1636	3	12	39	0	1
Charles	Leclerc	Monaco	1997	7	145	8	1349	26	9	40	0	2
Carlos	Sainz	Spain	1994	10	205	3	1197	5	4	24	0	2
Lewis	Hamilton	UK	1985	18	352	105	4816	104	67	201	7	3
George	Russell	UK	1998	6	124	2	636	3	8	14	0	3
Lando	Norris	UK	1999	6	124	3	930	7	10	24	0	4
Oscar	Piastri	Australia	2001	2	42	2	344	0	3	9	0	4
Esteban	Ocon	France	1996	8	153	1	427	0	1	3	0	5
Pierre	Gasly	France	1996	8	150	1	402	0	3	4	0	5
Fernando	Alonso	Spain	1981	21	400	32	2329	22	26	106	2	6
Lance	Stroll	Canada	1998	8	165	0	292	1	0	3	0	6
Kevin	Magnussen	Denmark	1992	10	183	0	194	1	2	1	0	7
Nico	Hülkenberg	Germany	1987	13	226	0	559	1	2	0	0	7
Yuki	Tsunoda	Japan	2000	4	86	0	83	0	1	0	0	8
Liam	Lawson	New Zealand	2002	1	1	0	2	0	0	0	0	8
Valtteri	Bottas	Finland	1989	12	243	10	1797	20	19	67	0	9
Zhou	Guanyu	China	1999	3	64	0	12	0	2	0	0	9
Alexander	Albon	Thailand	1996	5	102	0	240	0	0	2	0	10
Franco	Colapinto	Argentina	2003	1	5	0	5	0	0	0	0	10
\.


--
-- TOC entry 3595 (class 0 OID 16717)
-- Dependencies: 216
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (team_id, team_name, engine, licensed_in, season_entered, races_entered, wins, points, poles, fastest_laps, podiums, wdc, wcc) FROM stdin;
1	Red Bull Racing	Honda RBPT	Austria	2005	390	120	7752	103	98	280	7	6
2	Ferrari	Ferrari	Italy	1950	1096	247	10168	252	262	823	15	16
3	Mercedes	Mercedes	Germany	2010	313	128	7566	139	109	296	9	8
4	McLaren	Mercedes	UK	1966	970	188	6835	162	169	521	12	8
5	Alpine	Renault	France	2021	86	1	461	0	1	4	0	0
6	Aston Martin	Mercedes	UK	2021	92	0	498	0	3	9	0	0
7	Haas	Ferrari	US	2016	186	0	287	1	2	0	0	0
8	RB	Honda RBPT	Italy	2024	20	0	36	0	1	0	0	0
9	Sauber	Ferrari	Switzerland	1993	485	1	865	1	5	26	0	0
10	Williams	Mercedes	UK	1978	823	114	3637	128	133	313	7	9
\.


--
-- TOC entry 3603 (class 0 OID 0)
-- Dependencies: 215
-- Name: teams_team_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_team_id_seq', 10, true);


--
-- TOC entry 3449 (class 2606 OID 16722)
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (team_id);


--
-- TOC entry 3450 (class 2606 OID 16726)
-- Name: drivers drivers_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(team_id);


-- Completed on 2024-10-27 19:12:31 CET

--
-- PostgreSQL database dump complete
--

