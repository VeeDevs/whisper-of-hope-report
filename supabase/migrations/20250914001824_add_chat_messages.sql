create table if not exists public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  sender_id uuid references auth.users(id) on delete cascade,
  receiver_id uuid references auth.users(id) on delete cascade,
  sender_anonymous_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint chat_messages_sender_exists
    foreign key (sender_id)
    references auth.users(id)
    on delete cascade,

  constraint chat_messages_receiver_exists
    foreign key (receiver_id)
    references auth.users(id)
    on delete cascade
);

-- Create indexes for better query performance
create index if not exists chat_messages_sender_id_idx on public.chat_messages(sender_id);
create index if not exists chat_messages_receiver_id_idx on public.chat_messages(receiver_id);
create index if not exists chat_messages_created_at_idx on public.chat_messages(created_at);

-- Enable RLS
alter table public.chat_messages enable row level security;

-- Create policies
create policy "Users can insert their own messages"
  on public.chat_messages for insert
  with check (auth.uid() = sender_id);

create policy "Users can read messages they sent or received"
  on public.chat_messages for select
  using (auth.uid() in (sender_id, receiver_id));