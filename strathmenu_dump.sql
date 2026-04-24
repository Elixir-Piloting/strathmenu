--
-- PostgreSQL database dump
--

\restrict kBwiXv7FxbO2H35qG68xGVkYQkG7vPp0aRLfkAbUtMVbTEafFvBuWHBWUj3stci

-- Dumped from database version 18.3 (Ubuntu 18.3-1.pgdg24.04+1)
-- Dumped by pg_dump version 18.3 (Ubuntu 18.3-1.pgdg24.04+1)

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
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: MenuItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MenuItem" (
    id text NOT NULL,
    name text NOT NULL,
    price double precision NOT NULL,
    "categoryId" text NOT NULL,
    day text,
    "mealPeriod" text,
    location text,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."MenuItem" OWNER TO postgres;

--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name) FROM stdin;
cmod9lphw0000889tqcp1805m	rice/pilau
cmod9pc9y0002889teq52016d	masala
cmodbazmn0004889tifte5bhq	fast meals
cmodbp4av0006889te7kp49ry	Meals
cmodbp4b50007889t5wvo95gt	Breakfast
cmodbp4bc0008889tzxhfgp38	Beverages
cmodbp4bg0009889t68xu6ubi	Snacks
cmodbp4bj000a889t42ybnstw	Sides
\.


--
-- Data for Name: MenuItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MenuItem" (id, name, price, "categoryId", day, "mealPeriod", location, "imageUrl", "createdAt") FROM stdin;
cmodbrnmn000b889t1rtmvbza	beef and pea pilau	150	cmodbp4av0006889te7kp49ry	\N	Lunch	STC Cafeteria	\N	2026-04-24 19:50:12.575
cmodbsjdh000c889tpdyxko6r	Mini Ndizi Nyama	85	cmodbp4av0006889te7kp49ry	\N	\N	STC Cafeteria	\N	2026-04-24 19:50:53.717
cmodbtjq3000d889tldj4bb53	Traditional beef stew (full)	110	cmodbp4av0006889te7kp49ry	\N	\N	STC Cafeteria	\N	2026-04-24 19:51:40.827
cmodbv54x000f889ta3sx948t	Brown Chapati	30	cmodbazmn0004889tifte5bhq	\N	\N	STC Cafeteria	\N	2026-04-24 19:52:55.233
cmodbuchv000e889twvb2ide0	Mini Masal Chips (Mini)	80	cmodbp4av0006889te7kp49ry	\N	\N	STC Cafeteria	\N	2026-04-24 19:52:18.115
\.


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: MenuItem MenuItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MenuItem"
    ADD CONSTRAINT "MenuItem_pkey" PRIMARY KEY (id);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: MenuItem MenuItem_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MenuItem"
    ADD CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict kBwiXv7FxbO2H35qG68xGVkYQkG7vPp0aRLfkAbUtMVbTEafFvBuWHBWUj3stci

