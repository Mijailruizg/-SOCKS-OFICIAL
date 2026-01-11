-- This file contains the requested Supabase database schema for reference.
-- Run these SQL commands in your Supabase SQL Editor to set up the database.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  category text,
  price numeric not null,
  sale_price numeric,
  rating numeric default 0,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Users Table (This extends Supabase Auth, strictly for app-specific data if needed, though Supabase Auth handles users)
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Cart Table
create table cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  product_id uuid references products(id),
  quantity integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders Table
create table orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  total_amount numeric not null,
  status text default 'pending', -- 'processing', 'shipped', 'delivered', 'cancelled'
  stripe_payment_id text,
  shipping_address jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items Table
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id),
  product_id uuid references products(id),
  quantity integer not null,
  price numeric not null
);

-- Newsletter Subscribers
create table newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);